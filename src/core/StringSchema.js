import { BaseSchema } from './BaseSchema.js';

/**
 * @extends {BaseSchema<string>}
 */
export class StringSchema extends BaseSchema {
    constructor(engine, chain = []) {
        super(engine, chain);
    }

    // --- SANITIZERS ---
    trim(options = {}) {
        return this._addToChain({ type: 'sanitizer', methodName: this.engine.trim, options });
    }
    lTrim(options = {}) {
        return this._addToChain({ type: 'sanitizer', methodName: this.engine.lTrim, options });
    }
    rTrim(options = {}) {
        return this._addToChain({ type: 'sanitizer', methodName: this.engine.rTrim, options });
    }
    toSlug(options = {}) {
        return this._addToChain({ type: 'sanitizer', methodName: this.engine.toSlug, options });
    }
    stripTags(options = {}) {
        return this._addToChain({ type: 'sanitizer', methodName: this.engine.stripTags, options });
    }
    escapeHTML(options = {}) {
        return this._addToChain({ type: 'sanitizer', methodName: this.engine.escapeHTML, options });
    }
    unescapeHTML(options = {}) {
        return this._addToChain({
            type: 'sanitizer',
            methodName: this.engine.unescapeHTML,
            options,
        });
    }
    normalizeEmail(options = {}) {
        return this._addToChain({
            type: 'sanitizer',
            methodName: this.engine.normalizeEmail,
            options,
        });
    }
    blacklist(options = {}) {
        return this._addToChain({ type: 'sanitizer', methodName: this.engine.blacklist, options });
    }
    whitelist(options = {}) {
        return this._addToChain({ type: 'sanitizer', methodName: this.engine.whitelist, options });
    }

    // --- VALIDATORS ---
    validateAlpha(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateAlpha,
            options,
        });
    }
    validateAlphanumeric(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateAlphanumeric,
            options,
        });
    }
    validateAscii(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateAscii,
            options,
        });
    }
    validateBase64(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateBase64,
            options,
        });
    }
    validateBIC(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateBIC,
            options,
        });
    }
    validateBoolean(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateBoolean,
            options,
        });
    }
    validateByteLength(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateByteLength,
            options,
        });
    }
    validateContains(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateContains,
            options,
        });
    }
    validateCreditCard(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateCreditCard,
            options,
        });
    }
    validateCurrency(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateCurrency,
            options,
        });
    }
    validateDataURI(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateDataURI,
            options,
        });
    }
    validateDate(options = {}) {
        // If no options provided, normalize input to Date via engine.toDate first,
        // allowing strict ISO-8601 strings to be accepted even without locale.
        if (!options || Object.keys(options).length === 0) {
            // Inline ISO-8601 date validator for string inputs (YYYY-MM-DD)
            const isoValidator = async (value) => {
                if (typeof value !== 'string') return { valid: false, error: 'validateDate' };
                const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                if (!m) return { valid: false, error: 'validateDate' };
                const y = Number(m[1]);
                const mo = Number(m[2]);
                const d = Number(m[3]);
                const date = new Date(Date.UTC(y, mo - 1, d));
                const valid = date.getUTCFullYear() === y && (date.getUTCMonth() + 1) === mo && date.getUTCDate() === d;
                return { valid };
            };
            return this._addToChain({ type: 'validator', methodName: isoValidator, options: {} });
        }
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateDate,
            options,
        });
    }
    validateDecimal(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateDecimal,
            options,
        });
    }
    validateDivisibleBy(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateDivisibleBy,
            options,
        });
    }
    validateEmail(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateEmail,
            options,
        });
    }
    validateEndsWith(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateEndsWith,
            options,
        });
    }
    validateEqualsTo(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateEqualsTo,
            options,
        });
    }
    validateFQDN(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateFQDN,
            options,
        });
    }
    validateHSL(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateHSL,
            options,
        });
    }
    validateHexColor(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateHexColor,
            options,
        });
    }
    validateHexadecimal(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateHexadecimal,
            options,
        });
    }
    validateIBAN(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateIBAN,
            options,
        });
    }
    validateIMEI(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateIMEI,
            options,
        });
    }
    validateIP(options = {}) {
        return this._addToChain({ type: 'validator', methodName: this.engine.validateIP, options });
    }
    validateIPRange(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateIPRange,
            options,
        });
    }
    validateISBN(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateISBN,
            options,
        });
    }
    validateISINCode(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateISINCode,
            options,
        });
    }
    validateISO(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateISO,
            options,
        });
    }
    validateISRC(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateISRC,
            options,
        });
    }
    validateISSN(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateISSN,
            options,
        });
    }
    validateJSON(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateJSON,
            options,
        });
    }
    validateJWT(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateJWT,
            options,
        });
    }
    validateLength(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateLength,
            options,
        });
    }
    validateLicensePlate(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateLicensePlate,
            options,
        });
    }
    validateLowercase(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateLowercase,
            options,
        });
    }
    validateMACAddress(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateMACAddress,
            options,
        });
    }
    validateMatches(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateMatches,
            options,
        });
    }
    validateMimeType(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateMimeType,
            options,
        });
    }
    validateMobileNumber(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateMobileNumber,
            options,
        });
    }
    validateMongoId(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateMongoId,
            options,
        });
    }
    validateMultibyte(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateMultibyte,
            options,
        });
    }
    validateNotEmpty(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateNotEmpty,
            options,
        });
    }
    validateNumeric(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateNumeric,
            options,
        });
    }
    validatePort(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validatePort,
            options,
        });
    }
    validatePostalCode(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validatePostalCode,
            options,
        });
    }
    validateSemVer(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateSemVer,
            options,
        });
    }
    validateSlug(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateSlug,
            options,
        });
    }
    validateStartsWith(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateStartsWith,
            options,
        });
    }
    validateStrongPassword(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateStrongPassword,
            options,
        });
    }
    validateSurrogatePair(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateSurrogatePair,
            options,
        });
    }
    validateTaxId(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateTaxId,
            options,
        });
    }
    validateURL(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateURL,
            options,
        });
    }
    validateUppercase(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateUppercase,
            options,
        });
    }
    validateUUID(options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: this.engine.validateUUID,
            options,
        });
    }

    // --- FORMATTERS ---
    formatDate(options = {}) {
        return this._addToChain({ type: 'formatter', methodName: this.engine.formatDate, options });
    }
    formatCurrency(options = {}) {
        return this._addToChain({
            type: 'formatter',
            methodName: this.engine.formatCurrency,
            options,
        });
    }
    formatPostalCode(options = {}) {
        return this._addToChain({
            type: 'formatter',
            methodName: this.engine.formatPostalCode,
            options,
        });
    }
    formatMobileNumber(options = {}) {
        return this._addToChain({
            type: 'formatter',
            methodName: this.engine.formatMobileNumber,
            options,
        });
    }
    formatTaxId(options = {}) {
        return this._addToChain({
            type: 'formatter',
            methodName: this.engine.formatTaxId,
            options,
        });
    }
}
