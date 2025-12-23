import { BaseSchema } from './BaseSchema.js';

/**
 * @template {BaseSchema<any>[]} TSchemas
 * @extends {BaseSchema<TSchemas[number]['_outputType']>}
 */
export class UnionSchema extends BaseSchema {
    /**
     * @param {any} engine
     * @param {TSchemas} schemas
     */
    constructor(engine, schemas) {
        super(engine);
        this.schemas = schemas;
    }

    /**
     * @param {any} value
     */
    async validate(value) {
        const errors = [];

        for (const schema of this.schemas) {
            const result = await schema.validate(value);
            if (result.valid) {
                return result;
            }
            // Collect error but keep trying
            errors.push(result.errors);
        }

        // If none matched, construct a detailed message
        const summary = errors.map((schemaErrors) => {
            // Take the first error message from each branch as a summary
            return schemaErrors && schemaErrors[0] ? schemaErrors[0].message : 'Invalid';
        }).join(' OR ');

        const result = {
            valid: false,
            error: 'union',
            message: `Value did not match any of the allowed types. Issues: ${summary}`,
            context: { unionErrors: errors },
        };

        return {
            valid: false,
            errors: [this._formatError(result)],
            value: value,
        };
    }

    /**
     * @returns {object}
     */
    toJSONSchema() {
        return {
            anyOf: this.schemas.map((s) => s.toJSONSchema()),
        };
    }
}
