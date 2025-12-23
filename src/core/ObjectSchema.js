import { BaseSchema } from './BaseSchema.js';

/**
 * @template {Record<string, BaseSchema<any>>} Shape
 * @extends {BaseSchema<{ [K in keyof Shape]: Shape[K]['_outputType'] }>}
 */
export class ObjectSchema extends BaseSchema {
    constructor(engine, shape = {}, chain = []) {
        super(engine, chain);
        this.shape = shape;
        this._unknownMode = 'passthrough'; // 'strip', 'strict', 'passthrough'
    }

    /**
     * Adiciona um passo à cadeia (imutável).
     */
    _addToChain(step) {
        const newChain = [...this.chain];
        newChain.push(step);
        const schema = new ObjectSchema(this.engine, this.shape, newChain);
        schema._unknownMode = this._unknownMode;
        return schema;
    }

    /**
     * Define a forma do objeto.
     * @param {object} shape - Um objeto onde as chaves são nomes de campos e os valores são schemas.
     * @returns {ObjectSchema}
     */
    shape(shape) {
        const schema = new ObjectSchema(this.engine, shape, this.chain);
        schema._unknownMode = this._unknownMode;
        return schema;
    }

    /**
     * Remove chaves desconhecidas.
     */
    strip() {
        const schema = this._addToChain({ type: 'meta', name: 'strip' });
        schema._unknownMode = 'strip';
        return schema;
    }

    /**
     * Erro em chaves desconhecidas.
     */
    strict() {
        const schema = this._addToChain({ type: 'meta', name: 'strict' });
        schema._unknownMode = 'strict';
        return schema;
    }

    /**
     * Mantém chaves desconhecidas (default).
     */
    passthrough() {
        const schema = this._addToChain({ type: 'meta', name: 'passthrough' });
        schema._unknownMode = 'passthrough';
        return schema;
    }

    /**
     * Pick select keys.
     * @param {string[]} keys
     * @returns {ObjectSchema}
     */
    pick(keys) {
        const newShape = {};
        for (const key of keys) {
            if (Object.prototype.hasOwnProperty.call(this.shape, key)) {
                newShape[key] = this.shape[key];
            }
        }
        const schema = new ObjectSchema(this.engine, newShape);
        schema._unknownMode = this._unknownMode;
        return schema;
    }

    /**
     * Omit select keys.
     * @param {string[]} keys
     * @returns {ObjectSchema}
     */
    omit(keys) {
        const newShape = { ...this.shape };
        for (const key of keys) {
            delete newShape[key];
        }
        const schema = new ObjectSchema(this.engine, newShape);
        schema._unknownMode = this._unknownMode;
        return schema;
    }

    /**
     * Marks all fields in the shape as optional.
     * @returns {ObjectSchema}
     */
    partial() {
        const newShape = {};
        for (const [key, schema] of Object.entries(this.shape)) {
            newShape[key] = schema.optional();
        }
        const newSchema = new ObjectSchema(this.engine, newShape);
        newSchema._unknownMode = this._unknownMode;
        return newSchema;
    }

    /**
     * Marks all fields in the shape as required.
     * @returns {ObjectSchema}
     */
    required() {
        const newShape = {};
        for (const [key, schema] of Object.entries(this.shape)) {
            newShape[key] = schema.required();
        }
        const newSchema = new ObjectSchema(this.engine, newShape);
        newSchema._unknownMode = this._unknownMode;
        return newSchema;
    }

    /**
     * Extends the schema with a new shape.
     * @param {object} shape
     * @returns {ObjectSchema}
     */
    extend(shape) {
        const newShape = { ...this.shape, ...shape };
        const newSchema = new ObjectSchema(this.engine, newShape);
        newSchema._unknownMode = this._unknownMode;
        return newSchema;
    }

    /**
     * Executa os pipelines de validação para o objeto.
     */
    async validate(value) {
        if (this._isOptional && value === undefined) {
            return { valid: true, value: undefined };
        }

        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            const result = { valid: false, error: 'invalidType' };
            return {
                valid: false,
                errors: [this._formatError(result)],
                value: value,
            };
        }

        let currentValue = { ...value };
        const errors = {};

        // Sanitizers no nível do objeto (se houver)
        for (const rule of this.chain) {
            if (rule.type === 'sanitizer' || rule.type === 'formatter') {
                currentValue = await rule.methodName.call(this.engine, currentValue, rule.options);
            }
        }

        // Valida cada campo no shape
        for (const [key, schema] of Object.entries(this.shape)) {
            if (Object.prototype.hasOwnProperty.call(currentValue, key)) {
                const fieldResult = await schema.validate(currentValue[key]);
                if (!fieldResult.valid && fieldResult.errors != null) {
                    // Se o erro for um array, mantém, se for objeto (ex: objeto aninhado), coloca em array
                    if (Array.isArray(fieldResult.errors)) {
                        errors[key] = fieldResult.errors;
                    } else {
                        errors[key] = [fieldResult.errors];
                    }
                }
                currentValue[key] = fieldResult.value;
            } else {
                // @ts-ignore
                if (!schema._isOptional) {
                    const result = {
                        valid: false,
                        error: 'required',
                        message: 'Field is required',
                        context: { key }
                    };
                    errors[key] = [this._formatError(result)];
                }
            }
        }

        // Tratamento de chaves desconhecidas
        if (this._unknownMode !== 'passthrough') {
            for (const key of Object.keys(currentValue)) {
                if (!Object.prototype.hasOwnProperty.call(this.shape, key)) {
                    if (this._unknownMode === 'strict') {
                        const result = {
                            valid: false,
                            error: 'invalidKey',
                            message: `Unknown key: ${key}`,
                            context: { key }
                        };
                        if (!errors[key]) errors[key] = [];
                        errors[key].push(this._formatError(result));
                    } else if (this._unknownMode === 'strip') {
                        delete currentValue[key];
                    }
                }
            }
        }

        // Validators no nível do objeto
        for (const rule of this.chain) {
            if (rule.type === 'validator') {
                const result = await rule.methodName.call(this.engine, currentValue, rule.options);
                if (result && !result.valid) {
                    if (!errors._object) errors._object = [];
                    errors._object.push(this._formatError(result));
                }
            }
        }

        // Remove campos sem erro (null ou undefined).
        // Observação: não remover arrays que possuam propriedade `items` com erros de índices.
        Object.keys(errors).forEach((key) => {
            const node = errors[key];
            const isArray = Array.isArray(node);
            const hasItems = isArray && Object.prototype.hasOwnProperty.call(node, 'items');
            if (node == null || (isArray && !hasItems && node.every((e) => e == null))) {
                delete errors[key];
            }
        });

        return {
            valid: Object.keys(errors).length === 0,
            errors: Object.keys(errors).length > 0 ? errors : null,
            value: currentValue,
        };
    }
    /**
     * @returns {object}
     */
    toJSONSchema() {
        /** @type {any} */
        const schema = {
            type: 'object',
            properties: {},
            required: [],
            additionalProperties: this._unknownMode === 'strict' ? false : true,
        };

        for (const [key, sub] of Object.entries(this.shape)) {
            schema.properties[key] = sub.toJSONSchema();
            // @ts-ignore - _isOptional is protected
            if (!sub._isOptional) {
                schema.required.push(key);
            }
        }

        return schema;
    }
}
