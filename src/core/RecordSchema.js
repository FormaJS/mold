import { BaseSchema } from './BaseSchema.js';

/**
 * @template T
 * @extends {BaseSchema<Record<string, T>>}
 */
export class RecordSchema extends BaseSchema {
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

        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            const result = {
                valid: false,
                error: 'record',
                message: 'Value must be an object',
            };
            return {
                valid: false,
                errors: [this._formatError(result)],
                value: value,
            };
        }

        const currentValue = { ...value };
        const errors = {};
        let hasErrors = false;

        for (const [key, val] of Object.entries(currentValue)) {
            const itemResult = await this.valueSchema.validate(val);
            if (!itemResult.valid) {
                // Determine if we need to wrap error in array or not
                if (Array.isArray(itemResult.errors)) {
                    errors[key] = itemResult.errors;
                } else {
                    errors[key] = [itemResult.errors];
                }
                hasErrors = true;
            }
            currentValue[key] = itemResult.value;
        }

        if (hasErrors) {
            return {
                valid: false,
                errors: errors,
                value: currentValue,
            };
        }

        return {
            valid: true,
            errors: null,
            value: currentValue,
        };
    }

    /**
     * @returns {object}
     */
    toJSONSchema() {
        return {
            type: 'object',
            additionalProperties: this.valueSchema.toJSONSchema(),
        };
    }
}
