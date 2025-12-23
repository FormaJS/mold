import { BaseSchema } from './BaseSchema.js';

/**
 * @template {string|number|boolean|null|undefined} TLiteral
 * @extends {BaseSchema<TLiteral>}
 */
export class LiteralSchema extends BaseSchema {
    /**
     * @param {any} engine
     * @param {TLiteral} literalValue
     */
    constructor(engine, literalValue) {
        super(engine);
        this.literalValue = literalValue;
    }

    /**
     * @param {any} value
     */
    async validate(value) {
        if (value !== this.literalValue) {
            const result = {
                valid: false,
                error: 'literal',
                message: `Value must be strictly equal to ${String(this.literalValue)}`,
                context: { expected: this.literalValue, received: value },
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

    /**
     * @returns {object}
     */
    toJSONSchema() {
        return {
            const: this.literalValue,
        };
    }
}
