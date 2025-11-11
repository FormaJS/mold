import { BaseSchema } from './BaseSchema.js';

export class ObjectSchema extends BaseSchema {
    constructor(engine, shape = {}, chain = []) {
        super(engine, chain);
        this.shape = shape;
    }

    /**
     * Adiciona um passo à cadeia (imutável).
     */
    _addToChain(step) {
        const newChain = [...this.chain];
        newChain.push(step);
        return new ObjectSchema(this.engine, this.shape, newChain);
    }

    /**
     * Define a forma do objeto.
     * @param {object} shape - Um objeto onde as chaves são nomes de campos e os valores são schemas.
     * @returns {ObjectSchema}
     */
    shape(shape) {
        return new ObjectSchema(this.engine, shape, this.chain);
    }

    /**
     * Executa os pipelines de validação para o objeto.
     */
    async validate(value) {
        if (typeof value !== 'object' || value === null) {
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
                const result = { valid: false, error: 'required' };
                errors[key] = [this._formatError(result)];
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

        // Remove campos sem erro (null ou undefined)
        Object.keys(errors).forEach((key) => {
            if (
                errors[key] == null ||
                (Array.isArray(errors[key]) && errors[key].every((e) => e == null))
            ) {
                delete errors[key];
            }
        });

        return {
            valid: Object.keys(errors).length === 0,
            errors: Object.keys(errors).length > 0 ? errors : null,
            value: currentValue,
        };
    }
}
