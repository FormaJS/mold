import { BaseSchema } from './BaseSchema.js';

export class ArraySchema extends BaseSchema {
    constructor(engine, itemSchema, chain = []) {
        super(engine, chain);
        this.itemSchema = itemSchema;
    }

    /**
     * Adiciona um passo à cadeia (imutável).
     */
    _addToChain(step) {
        const newChain = [...this.chain];
        newChain.push(step);
        return new ArraySchema(this.engine, this.itemSchema, newChain);
    }

    // --- VALIDATORS ---

    minLength(minValue) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => {
                if (value.length < minValue) {
                    return {
                        valid: false,
                        error: 'validateLengthMin',
                        message: `Array must have at least ${minValue} items`,
                        context: { min: minValue, actual: value.length }
                    };
                }
                return { valid: true };
            },
            options: { min: minValue },
        });
    }

    maxLength(maxValue) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => {
                if (value.length > maxValue) {
                    return {
                        valid: false,
                        error: 'validateLengthMax',
                        message: `Array must have at most ${maxValue} items`,
                        context: { max: maxValue, actual: value.length }
                    };
                }
                return { valid: true };
            },
            options: { max: maxValue },
        });
    }

    /**
     * Alias for minLength.
     * @param {number} length
     */
    min(length) {
        return this.minLength(length);
    }

    /**
     * Alias for maxLength.
     * @param {number} length
     */
    max(length) {
        return this.maxLength(length);
    }

    validateNotEmpty(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateNotEmpty,
            options,
        });
    }

    /**
     * Executa os pipelines de validação para o array.
     */
    async validate(value) {
        if (!Array.isArray(value)) {
            const result = { valid: false, error: 'invalidType' };
            return {
                valid: false,
                errors: [this._formatError(result)],
                value: value,
            };
        }

        let currentValue = [...value];
        const errors = [];
        let items = undefined;

        // Sanitizers no nível do array
        for (const rule of this.chain) {
            if (rule.type === 'sanitizer' || rule.type === 'formatter') {
                currentValue = await rule.methodName.call(this.engine, currentValue, rule.options);
            }
        }

        // Validators no nível do array
        for (const rule of this.chain) {
            if (rule.type === 'validator') {
                const result = await rule.methodName.call(this.engine, currentValue, rule.options);
                if (result && !result.valid) {
                    errors.push(this._formatError(result));
                }
            }
        }

        // Valida cada item se houver itemSchema
        if (this.itemSchema) {
            items = [];
            for (let i = 0; i < currentValue.length; i++) {
                const itemResult = await this.itemSchema.validate(currentValue[i]);
                if (!itemResult.valid) {
                    items[i] = itemResult.errors;
                } else {
                    items[i] = undefined;
                }
                currentValue[i] = itemResult.value;
            }
            // Remove trailing undefineds para não criar um array gigante
            while (items.length && items[items.length - 1] === undefined) items.pop();
            if (items.length === 0) items = undefined;
        }

        const hasErrors = errors.length > 0 || (items && items.some((e) => e !== undefined));

        return {
            valid: !hasErrors,
            errors: hasErrors ? (items ? Object.assign([...errors], { items }) : errors) : null,
            value: currentValue,
        };
    }
    /**
     * @returns {object}
     */
    toJSONSchema() {
        return {
            type: 'array',
            items: this.itemSchema.toJSONSchema(),
        };
    }
}
