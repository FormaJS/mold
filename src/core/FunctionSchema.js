import { BaseSchema } from './BaseSchema.js';

/**
 * @extends {BaseSchema<Function>}
 */
export class FunctionSchema extends BaseSchema {
    /**
     * @param {any} engine
     */
    constructor(engine) {
        super(engine);
    }

    /**
     * @param {any} value
     */
    async validate(value) {
        if (this._isOptional && value === undefined) {
            return { valid: true, value: undefined };
        }

        if (typeof value !== 'function') {
            const result = {
                valid: false,
                error: 'function',
                message: 'Value must be a function',
            };
            return {
                valid: false,
                errors: [this._formatError(result)],
                value: value,
            };
        }

        return {
            valid: true,
            errors: null,
            value: value,
        };
    }

    toJSONSchema() {
        return {
            type: 'string',
            format: 'function', // Not a standard JSON Schema format but indicates intent
        };
    }
}
