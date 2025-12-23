import { BaseSchema } from './BaseSchema.js';

/**
 * @template {BaseSchema<any>[]} TSchemas
 * @extends {BaseSchema<{ [K in keyof TSchemas]: TSchemas[K] extends BaseSchema<infer U> ? U : never }>}
 */
export class TupleSchema extends BaseSchema {
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
        if (!Array.isArray(value)) {
            const result = {
                valid: false,
                error: 'tuple',
                message: 'Value must be an array',
            };
            return {
                valid: false,
                errors: [this._formatError(result)],
                value: value,
            };
        }

        if (value.length !== this.schemas.length) {
            const result = {
                valid: false,
                error: 'tupleLength',
                message: `Tuple must have exactly ${this.schemas.length} items`,
                context: { expected: this.schemas.length, received: value.length },
            };
            return {
                valid: false,
                errors: [this._formatError(result)],
                value: value,
            };
        }

        const currentValue = [...value];
        const items = [];
        let hasErrors = false;

        for (let i = 0; i < this.schemas.length; i++) {
            const schema = this.schemas[i];
            const itemResult = await schema.validate(currentValue[i]);

            if (!itemResult.valid) {
                items[i] = itemResult.errors;
                hasErrors = true;
            } else {
                items[i] = undefined;
            }
            currentValue[i] = itemResult.value;
        }

        // Just like ArraySchema, we might want to return "items" structure
        if (hasErrors) {
            return {
                valid: false,
                errors: { items },
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
            type: 'array',
            prefixItems: this.schemas.map((s) => s.toJSONSchema()),
            items: false, // Tuple usually implies no extra items?
            minItems: this.schemas.length,
            maxItems: this.schemas.length,
        };
    }
}
