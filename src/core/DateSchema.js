import { BaseSchema } from './BaseSchema.js';

/**
 * @extends {BaseSchema<Date>}
 */
export class DateSchema extends BaseSchema {
    constructor(engine, chain = []) {
        super(engine, chain);
        // Default type validation
        if (chain.length === 0) {
            this.chain.push({
                type: 'validator',
                methodName: (value) => {
                    if (!(value instanceof Date) || isNaN(value.getTime())) {
                        return {
                            valid: false,
                            error: 'type',
                            message: 'Value must be a valid Date',
                        };
                    }
                    return { valid: true };
                },
                options: {},
            });
        }
    }

    /**
     * @param {Date|string|number} minDate
     * @param {string} [message]
     */
    min(minDate, message) {
        const min = new Date(minDate);
        return this._addToChain({
            type: 'validator',
            methodName: (value) => {
                if (value < min) {
                    return {
                        valid: false,
                        error: 'minDate',
                        message: message || `Date must be after ${min.toISOString()}`,
                        context: { min, value },
                    };
                }
                return { valid: true };
            },
            options: { min },
        });
    }

    /**
     * @param {Date|string|number} maxDate
     * @param {string} [message]
     */
    max(maxDate, message) {
        const max = new Date(maxDate);
        return this._addToChain({
            type: 'validator',
            methodName: (value) => {
                if (value > max) {
                    return {
                        valid: false,
                        error: 'maxDate',
                        message: message || `Date must be before ${max.toISOString()}`,
                        context: { max, value },
                    };
                }
                return { valid: true };
            },
            options: { max },
        });
    }

    /**
     * @returns {object}
     */
    toJSONSchema() {
        return {
            type: 'string',
            format: 'date-time',
        };
    }
}
