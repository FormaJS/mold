import { BaseSchema } from './BaseSchema.js';

/**
 * @template {readonly (string|number|boolean|null)[]} TValues
 * @extends {BaseSchema<TValues[number]>}
 */
export class EnumSchema extends BaseSchema {
    /**
     * @param {any} engine
     * @param {TValues} values
     * @param {any[]} [chain]
     */
    constructor(engine, values, chain = []) {
        super(engine, chain);
        this.values = values;

        // Add enum validator only if chain is empty (initial creation)
        if (chain.length === 0) {
            this.chain.push({
                type: 'validator',
                methodName: (value) => {
                    if (!this.values.includes(value)) {
                        return {
                            valid: false,
                            error: 'enum',
                            message: `Value must be one of: ${this.values.join(', ')}`,
                            context: { allowed: this.values, received: value },
                        };
                    }
                    return { valid: true };
                },
                options: {},
            });
        }
    }

    /**
     * @returns {object}
     */
    toJSONSchema() {
        /** @type {any} */
        const schema = { enum: this.values };
        return schema;
    }

    /**
     * @param {any} step
     */
    _addToChain(step) {
        const newChain = [...this.chain];
        newChain.push(step);
        // We must pass values along with the new chain.
        // But wait, the standard pattern (like ObjectSchema) is:
        // return new EnumSchema(this.engine, this.values, newChain);
        // SO we need to update Constructor to accept chain as 3rd arg.
        return new EnumSchema(this.engine, this.values, newChain);
    }
}
