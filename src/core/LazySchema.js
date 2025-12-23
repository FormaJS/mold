import { BaseSchema } from './BaseSchema.js';

/**
 * @template {BaseSchema<any>} TSchema
 * @extends {BaseSchema<TSchema['_outputType']>}
 */
export class LazySchema extends BaseSchema {
    /**
     * @param {any} engine
     * @param {() => TSchema} builder
     */
    constructor(engine, builder) {
        super(engine);
        this.builder = builder;
    }

    /**
     * @param {any} value
     */
    async validate(value) {
        const schema = this.builder();
        return schema.validate(value);
    }

    /**
     * @returns {object}
     */
    toJSONSchema() {
        // Recursive schemas are hard to serialize without definitions/references context.
        // For now, return a generic object or "any" schema.
        return {};
    }
}
