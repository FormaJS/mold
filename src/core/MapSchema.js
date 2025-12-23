import { BaseSchema } from './BaseSchema.js';

/**
 * @template K, V
 * @extends {BaseSchema<Map<K, V>>}
 */
export class MapSchema extends BaseSchema {
    /**
     * @param {any} engine
     * @param {BaseSchema<K>} keySchema
     * @param {BaseSchema<V>} valueSchema
     */
    constructor(engine, keySchema, valueSchema) {
        super(engine);
        this.keySchema = keySchema;
        this.valueSchema = valueSchema;
    }

    /**
     * @param {any} value
     */
    async validate(value) {
        if (this._isOptional && value === undefined) {
            return { valid: true, value: undefined };
        }

        if (!(value instanceof Map)) {
            const result = {
                valid: false,
                error: 'map',
                message: 'Value must be a Map',
            };
            return {
                valid: false,
                errors: [this._formatError(result)],
                value: value,
            };
        }

        const currentMap = new Map();
        const errors = [];
        let hasErrors = false;
        let index = 0;

        for (const [key, val] of value.entries()) {
            const keyResult = await this.keySchema.validate(key);
            const valueResult = await this.valueSchema.validate(val);

            if (!keyResult.valid || !valueResult.valid) {
                errors.push({
                    index,
                    keyError: keyResult.valid ? null : keyResult.errors,
                    valueError: valueResult.valid ? null : valueResult.errors
                });
                hasErrors = true;
            }

            // We use the validated values for the new map
            currentMap.set(keyResult.value, valueResult.value);
            index++;
        }

        if (hasErrors) {
            return {
                valid: false,
                errors: errors, // Structure here is custom for Map/Set, might need refinement
                value: currentMap,
            };
        }

        return {
            valid: true,
            errors: null,
            value: currentMap,
        };
    }

    toJSONSchema() {
        return {
            type: 'array', // Maps often represented as array of entries in JSON Schema or just object if keys are strings
            description: 'Map',
            items: {
                type: 'array',
                items: [
                    this.keySchema.toJSONSchema(),
                    this.valueSchema.toJSONSchema()
                ],
                minItems: 2,
                maxItems: 2
            }
        }
    }
}
