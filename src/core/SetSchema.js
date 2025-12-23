import { BaseSchema } from './BaseSchema.js';

/**
 * @template T
 * @extends {BaseSchema<Set<T>>}
 */
export class SetSchema extends BaseSchema {
    /**
     * @param {any} engine
     * @param {BaseSchema<T>} valueSchema
     */
    constructor(engine, valueSchema) {
        super(engine);
        this.valueSchema = valueSchema;
    }

    /**
     * @param {any} value
     */
    async validate(value) {
        if (this._isOptional && value === undefined) {
            return { valid: true, value: undefined };
        }

        if (!(value instanceof Set)) {
            const result = {
                valid: false,
                error: 'set',
                message: 'Value must be a Set',
            };
            return {
                valid: false,
                errors: [this._formatError(result)],
                value: value,
            };
        }

        const currentSet = new Set();
        const errors = [];
        let hasErrors = false;
        let index = 0;

        for (const val of value) {
            const result = await this.valueSchema.validate(val);
            if (!result.valid) {
                errors.push({
                    index,
                    error: result.errors
                });
                hasErrors = true;
            }
            currentSet.add(result.value);
            index++;
        }

        if (hasErrors) {
            return {
                valid: false,
                errors: errors,
                value: currentSet,
            };
        }

        return {
            valid: true,
            errors: null,
            value: currentSet,
        };
    }

    toJSONSchema() {
        return {
            type: 'array',
            uniqueItems: true,
            items: this.valueSchema.toJSONSchema()
        };
    }
}
