import { BaseSchema } from './BaseSchema.js';

export class NumberSchema extends BaseSchema {
    constructor(engine, chain = []) {
        super(engine, chain);
    }

    /**
     * Valida que o valor é um número antes de aplicar o pipeline.
     */
    async validate(value) {
        // Rejeita imediatamente se não for number
        if (typeof value !== 'number' || Number.isNaN(value)) {
            const result = {
                valid: false,
                error: 'validateNumeric',
                message: 'Value must be a number',
            };
            return {
                valid: false,
                errors: [this._formatError(result)],
                value: value,
            };
        }
        // Chama o pipeline padrão do BaseSchema
        return await super.validate(value);
    }

    // --- VALIDATORS inline (Forma não tem validadores para tipo number nativo) ---
    validateInt(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => ({
                valid: Number.isInteger(value),
                error: 'validateInt',
                message: 'Value must be an integer',
            }),
            options,
        });
    }

    validateFloat(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => ({
                valid:
                    typeof value === 'number' && !Number.isNaN(value) && !Number.isInteger(value),
                error: 'validateFloat',
                message: 'Value must be a float',
            }),
            options,
        });
    }

    validatePositive(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => ({
                valid: typeof value === 'number' && value > 0,
                error: 'validatePositive',
                message: 'Value must be positive',
            }),
            options,
        });
    }

    validateNegative(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => ({
                valid: typeof value === 'number' && value < 0,
                error: 'validateNegative',
                message: 'Value must be negative',
            }),
            options,
        });
    }

    validateDivisibleBy(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: (value, opts) => ({
                valid: typeof value === 'number' && opts.divisor && value % opts.divisor === 0,
                error: 'validateDivisibleBy',
                message: `Value must be divisible by ${opts.divisor}`,
                context: { divisor: opts.divisor },
            }),
            options,
        });
    }

    validateDecimal(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => ({
                valid:
                    typeof value === 'number' && !Number.isNaN(value) && !Number.isInteger(value),
                error: 'validateDecimal',
                message: 'Value must be a decimal',
            }),
            options,
        });
    }

    validateNumeric(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => ({
                valid: typeof value === 'number' && !Number.isNaN(value),
                error: 'validateNumeric',
                message: 'Value must be numeric',
            }),
            options,
        });
    }

    validateNotEmpty(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => ({
                valid: value !== null && value !== undefined && value !== '',
                error: 'validateNotEmpty',
                message: 'Value cannot be empty',
            }),
            options,
        });
    }

    validateIsIn(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: (value, opts) => ({
                valid: Array.isArray(opts.values) && opts.values.includes(value),
                error: 'validateIsIn',
                message: `Value must be in [${opts.values?.join(', ')}]`,
                context: { values: opts.values },
            }),
            options,
        });
    }

    validateIsWhitelisted(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: (value, opts) => ({
                valid: Array.isArray(opts.values) && opts.values.includes(value),
                error: 'validateIsWhitelisted',
                message: `Value must be whitelisted in [${opts.values?.join(', ')}]`,
                context: { values: opts.values },
            }),
            options,
        });
    }

    validateIsBlacklisted(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: (value, opts) => ({
                valid: Array.isArray(opts.values) && !opts.values.includes(value),
                error: 'validateIsBlacklisted',
                message: `Value must not be blacklisted in [${opts.values?.join(', ')}]`,
                context: { values: opts.values },
            }),
            options,
        });
    }

    min(minValue) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => {
                if (typeof value !== 'number' || Number.isNaN(value) || value < minValue) {
                    return {
                        valid: false,
                        error: 'validateMin',
                        message: `Value must be at least ${minValue}`,
                        context: { min: minValue },
                    };
                }
                return { valid: true };
            },
            options: { min: minValue },
        });
    }

    max(maxValue) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => {
                if (typeof value !== 'number' || Number.isNaN(value) || value > maxValue) {
                    return {
                        valid: false,
                        error: 'validateMax',
                        message: `Value must be at most ${maxValue}`,
                        context: { max: maxValue },
                    };
                }
                return { valid: true };
            },
            options: { max: maxValue },
        });
    }
}
