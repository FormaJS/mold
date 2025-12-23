import { BaseSchema } from './BaseSchema.js';

/**
 * UnionToIntersection helper generic would be needed for complex TS,
 * but for JSDoc simple intersection might suffice.
 * @template T
 * @typedef {(T extends any ? (x: T) => void : never) extends (x: infer R) => void ? R : never} UnionToIntersection
 */

/**
 * @template {BaseSchema<any>[]} TSchemas
 * @extends {BaseSchema<UnionToIntersection<TSchemas[number]['_outputType']>>}
 */
export class IntersectionSchema extends BaseSchema {
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
        let mergedValue = value;
        const allErrors = [];

        for (const schema of this.schemas) {
            const result = await schema.validate(mergedValue);
            if (!result.valid) {
                if (Array.isArray(result.errors)) {
                    allErrors.push(...result.errors);
                } else {
                    // Should not happen for arrays usually, but safety check
                    allErrors.push(result.errors);
                }
            } else {
                // If it's an object, merge it? Or just keep passing?
                // Zod merges outputs. If it's objects, we merge.
                if (
                    typeof mergedValue === 'object' &&
                    mergedValue !== null &&
                    typeof result.value === 'object' &&
                    result.value !== null
                ) {
                    mergedValue = { ...mergedValue, ...result.value };
                } else {
                    // Primitive intersection? usually just last one wins or same value
                    mergedValue = result.value;
                }
            }
        }

        if (allErrors.length > 0) {
            return {
                valid: false,
                errors: allErrors,
                value: value,
            };
        }

        return {
            valid: true,
            errors: null,
            value: mergedValue,
        };
    }
    /**
     * @returns {object}
     */
    toJSONSchema() {
        return {
            allOf: this.schemas.map((s) => s.toJSONSchema()),
        };
    }
}
