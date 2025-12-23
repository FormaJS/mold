import { BaseSchema } from './BaseSchema.js';

/**
 * @template T
 * @extends {BaseSchema<Promise<T>>}
 */
export class PromiseSchema extends BaseSchema {
    /**
     * @param {any} engine
     * @param {BaseSchema<T>} [valueSchema]
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

        if (
            !value ||
            typeof value.then !== 'function' ||
            typeof value.catch !== 'function'
        ) {
            const result = {
                valid: false,
                error: 'promise',
                message: 'Value must be a Promise',
            };
            return {
                valid: false,
                errors: [this._formatError(result)],
                value: value,
            };
        }

        if (!this.valueSchema) {
            return {
                valid: true,
                errors: null,
                value: value,
            };
        }

        try {
            const resolvedValue = await value;
            const result = await this.valueSchema.validate(resolvedValue);

            if (!result.valid) {
                return {
                    valid: false,
                    errors: result.errors,
                    value: value // We can't really return the rejected promise in a meaningful way here for "value", usually schemas return the input or transformed output.
                    // If we return the resolved value here, we are effectively unwrapping.
                    // If the user wants the promise, they shouldn't pass a value schema?
                    // Usually Zod returns the resolved value if you validate a promise.
                };
            }

            // If validation passed, we return the RESOLVED value (unwrapped)
            // Or should we return a Promise that resolves to it?
            // If the schema output type is Promise<T>, then we should probably return the resolved value if the validation function is async?
            // Wait, if validation returns { value: T }, then the whole validation result is Promise<{ value: T }>.
            // So if we return result.value, it is T.
            return {
                valid: true,
                errors: null,
                value: result.value,
            };

        } catch (err) {
            // Promise rejected
            return {
                valid: false,
                errors: [{
                    rule: 'promiseRejection',
                    message: 'Promise rejected',
                    context: { error: err }
                }],
                value: value
            };
        }
    }

    toJSONSchema() {
        // Promises don't really have a JSON Schema representation
        return {};
    }
}
