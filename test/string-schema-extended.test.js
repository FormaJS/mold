import { describe, it, expect } from 'vitest';
import { forma } from '../src/index.js';

describe('StringSchema - Validadores Estendidos', () => {
    it('validateAscii', async () => {
        const schema = forma.string().validateAscii();
        expect((await schema.validate('hello')).valid).toBe(true);
        expect((await schema.validate('héllo')).valid).toBe(false);
    });

    it('validateBase64', async () => {
        const schema = forma.string().validateBase64();
        expect((await schema.validate('SGVsbG8gV29ybGQ=')).valid).toBe(true);
        expect((await schema.validate('not-base64!')).valid).toBe(false);
    });

    it('validateBIC', async () => {
        const schema = forma.string().validateBIC();
        expect((await schema.validate('DEUTDEFF')).valid).toBe(true);
        expect((await schema.validate('invalid')).valid).toBe(false);
    });

    it('validateBoolean', async () => {
        const schema = forma.string().validateBoolean();
        expect((await schema.validate('true')).valid).toBe(true);
        expect((await schema.validate('false')).valid).toBe(true);
        expect((await schema.validate('maybe')).valid).toBe(false);
    });

    it('validateByteLength', async () => {
        const schema = forma.string().validateByteLength({ min: 2, max: 10 });
        expect((await schema.validate('abc')).valid).toBe(true);
        expect((await schema.validate('a')).valid).toBe(false);
    });

    it('validateContains', async () => {
        const schema = forma.string().validateContains('world');
        expect((await schema.validate('hello world')).valid).toBe(true);
        expect((await schema.validate('hello')).valid).toBe(false);
    });

    it('validateCreditCard', async () => {
        const schema = forma.string().validateCreditCard();
        expect((await schema.validate('4111111111111111')).valid).toBe(true);
        expect((await schema.validate('1234567890123456')).valid).toBe(false);
    });

    it('validateCurrency', async () => {
        const schema = forma.string().validateCurrency();
        expect((await schema.validate('$100.00')).valid).toBe(true);
        expect((await schema.validate('abc')).valid).toBe(false);
    });

    it('validateDataURI', async () => {
        const schema = forma.string().validateDataURI();
        expect((await schema.validate('data:text/plain;base64,SGVsbG8=')).valid).toBe(true);
        expect((await schema.validate('not-a-data-uri')).valid).toBe(false);
    });

    it('validateDate', async () => {
        const schema = forma.string().validateDate();
        expect((await schema.validate('2024-01-01')).valid).toBe(true);
        expect((await schema.validate('not-a-date')).valid).toBe(false);
    });

    it('validateDecimal', async () => {
        const schema = forma.string().validateDecimal();
        expect((await schema.validate('10.5')).valid).toBe(true);
        expect((await schema.validate('abc')).valid).toBe(false);
    });

    it('validateDivisibleBy', async () => {
        const schema = forma.string().validateDivisibleBy(5);
        expect((await schema.validate('10')).valid).toBe(true);
        expect((await schema.validate('7')).valid).toBe(false);
    });

    it('validateEndsWith', async () => {
        const schema = forma.string().validateEndsWith('end');
        expect((await schema.validate('hello end')).valid).toBe(true);
        expect((await schema.validate('hello')).valid).toBe(false);
    });

    it('validateEqualsTo', async () => {
        const schema = forma.string().validateEqualsTo('test');
        expect((await schema.validate('test')).valid).toBe(true);
        expect((await schema.validate('other')).valid).toBe(false);
    });

    it('validateFQDN', async () => {
        const schema = forma.string().validateFQDN();
        expect((await schema.validate('example.com')).valid).toBe(true);
        expect((await schema.validate('not..valid')).valid).toBe(false);
    });

    it('validateHSL', async () => {
        const schema = forma.string().validateHSL();
        expect((await schema.validate('hsl(120, 100%, 50%)')).valid).toBe(true);
        expect((await schema.validate('not-hsl')).valid).toBe(false);
    });

    it('validateHexColor', async () => {
        const schema = forma.string().validateHexColor();
        expect((await schema.validate('#FF5733')).valid).toBe(true);
        expect((await schema.validate('not-hex')).valid).toBe(false);
    });

    it('validateHexadecimal', async () => {
        const schema = forma.string().validateHexadecimal();
        expect((await schema.validate('DEADBEEF')).valid).toBe(true);
        expect((await schema.validate('ZZZZZ')).valid).toBe(false);
    });

    it('validateIBAN', async () => {
        const schema = forma.string().validateIBAN();
        expect((await schema.validate('DE89370400440532013000')).valid).toBe(true);
        expect((await schema.validate('invalid')).valid).toBe(false);
    });

    it('validateIMEI', async () => {
        const schema = forma.string().validateIMEI();
        expect((await schema.validate('490154203237518')).valid).toBe(true);
        expect((await schema.validate('123')).valid).toBe(false);
    });

    it('validateIP', async () => {
        const schema = forma.string().validateIP();
        expect((await schema.validate('192.168.1.1')).valid).toBe(true);
        expect((await schema.validate('999.999.999.999')).valid).toBe(false);
    });

    it('validateIPRange', async () => {
        const schema = forma.string().validateIPRange();
        expect((await schema.validate('192.168.1.0/24')).valid).toBe(true);
        expect((await schema.validate('invalid')).valid).toBe(false);
    });

    it('validateISBN', async () => {
        const schema = forma.string().validateISBN();
        expect((await schema.validate('978-3-16-148410-0')).valid).toBe(true);
        expect((await schema.validate('invalid')).valid).toBe(false);
    });

    it('validateISINCode', async () => {
        const schema = forma.string().validateISINCode();
        expect((await schema.validate('US0378331005')).valid).toBe(true);
        expect((await schema.validate('invalid')).valid).toBe(false);
    });

    it('validateISRC', async () => {
        const schema = forma.string().validateISRC();
        expect((await schema.validate('USRC17607839')).valid).toBe(true);
        expect((await schema.validate('invalid')).valid).toBe(false);
    });

    it('validateISSN', async () => {
        const schema = forma.string().validateISSN();
        expect((await schema.validate('0378-5955')).valid).toBe(true);
        expect((await schema.validate('invalid')).valid).toBe(false);
    });

    it('validateJSON', async () => {
        const schema = forma.string().validateJSON();
        expect((await schema.validate('{"key":"value"}')).valid).toBe(true);
        expect((await schema.validate('not-json')).valid).toBe(false);
    });

    it('validateJWT', async () => {
        const schema = forma.string().validateJWT();
        expect(
            (
                await schema.validate(
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'
                )
            ).valid
        ).toBe(true);
        expect((await schema.validate('not-jwt')).valid).toBe(false);
    });

    it('validateLowercase', async () => {
        const schema = forma.string().validateLowercase();
        expect((await schema.validate('lowercase')).valid).toBe(true);
        expect((await schema.validate('UPPERCASE')).valid).toBe(false);
    });

    it('validateMACAddress', async () => {
        const schema = forma.string().validateMACAddress();
        expect((await schema.validate('00:1B:44:11:3A:B7')).valid).toBe(true);
        expect((await schema.validate('invalid')).valid).toBe(false);
    });

    it('validateMimeType', async () => {
        const schema = forma.string().validateMimeType();
        expect((await schema.validate('text/plain')).valid).toBe(true);
        expect((await schema.validate('invalid')).valid).toBe(false);
    });

    it('validateMongoId', async () => {
        const schema = forma.string().validateMongoId();
        expect((await schema.validate('507f1f77bcf86cd799439011')).valid).toBe(true);
        expect((await schema.validate('invalid')).valid).toBe(false);
    });

    it('validateMultibyte', async () => {
        const schema = forma.string().validateMultibyte();
        expect((await schema.validate('こんにちは')).valid).toBe(true);
        expect((await schema.validate('hello')).valid).toBe(false);
    });

    it('validateNumeric', async () => {
        const schema = forma.string().validateNumeric();
        expect((await schema.validate('12345')).valid).toBe(true);
        expect((await schema.validate('abc')).valid).toBe(false);
    });

    it('validatePort', async () => {
        const schema = forma.string().validatePort();
        expect((await schema.validate('8080')).valid).toBe(true);
        expect((await schema.validate('99999')).valid).toBe(false);
    });

    it('validatePostalCode', async () => {
        const schema = forma.string().validatePostalCode();
        expect((await schema.validate('12345')).valid).toBe(true);
    });

    it('validateSemVer', async () => {
        const schema = forma.string().validateSemVer();
        expect((await schema.validate('1.2.3')).valid).toBe(true);
        expect((await schema.validate('invalid')).valid).toBe(false);
    });

    it('validateStartsWith', async () => {
        const schema = forma.string().validateStartsWith('hello');
        expect((await schema.validate('hello world')).valid).toBe(true);
        expect((await schema.validate('world')).valid).toBe(false);
    });

    it('validateSurrogatePair', async () => {
        const schema = forma.string().validateSurrogatePair();
        expect((await schema.validate('𝌆')).valid).toBe(true);
    });

    it('validateTaxId', async () => {
        const schema = forma.string().validateTaxId();
        expect((await schema.validate('123-45-6789')).valid).toBe(true);
    });

    it('validateURL', async () => {
        const schema = forma.string().validateURL();
        expect((await schema.validate('https://example.com')).valid).toBe(true);
        expect((await schema.validate('not-url')).valid).toBe(false);
    });

    it('validateUppercase', async () => {
        const schema = forma.string().validateUppercase();
        expect((await schema.validate('UPPERCASE')).valid).toBe(true);
        expect((await schema.validate('lowercase')).valid).toBe(false);
    });

    it('sanitizer: stripTags', async () => {
        const schema = forma.string().stripTags();
        expect((await schema.validate('<p>text</p>')).value).toBe('text');
    });

    it('multiple validators chained', async () => {
        const schema = forma
            .string()
            .trim()
            .validateNotEmpty()
            .validateLength({ min: 3 })
            .validateAlpha();
        expect((await schema.validate('  abc  ')).valid).toBe(true);
        expect((await schema.validate('  ab  ')).valid).toBe(false);
    });
});
