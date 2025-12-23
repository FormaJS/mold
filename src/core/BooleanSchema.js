import { BaseSchema } from './BaseSchema.js';

/**
 * @extends {BaseSchema<boolean>}
 */
export class BooleanSchema extends BaseSchema {
    constructor(engine, chain = [], options = {}) {
        super(engine, chain);
        this.options = options;

        if (chain.length === 0) {
            this.chain.push({
                type: 'validator',
                methodName: (value) => {
                    const { strict = false } = this.options;

                    if (typeof value === 'boolean') {
                        return { valid: true, value };
                    }

                    if (typeof value === 'string' || typeof value === 'number') {
                        const stringValue = String(value);
                        const result = this.engine.validateBoolean(stringValue, { strict });
                        if (result.valid) {
                            const boolValue = this.engine.toBoolean(stringValue, { strict });
                            return { valid: true, value: boolValue };
                        }

                        return {
                            valid: false,
                            error: 'validateBoolean',
                            // message will be formatted by engine using error code
                        };
                    }

                    return {
                        valid: false,
                        error: 'invalidType',
                        message: 'Value must be a boolean or a valid boolean string',
                    };
                },
                options: {},
            });
        }
    }

    /**
     * @returns {object}
     */
    toJSONSchema() {
        return { type: 'boolean' };
    }
}
