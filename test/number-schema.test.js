import { describe, it, expect } from 'vitest';
import { forma } from '../src/index.js';

describe('NumberSchema - Integração com validadores FormaJS', () => {
    it('validateInt - aceita inteiros, rejeita floats', async () => {
        const schema = forma.number().validateInt();
        expect((await schema.validate(10)).valid).toBe(true);
        expect((await schema.validate(10.5)).valid).toBe(false);
    });

    it('validateFloat - aceita floats, rejeita string', async () => {
        const schema = forma.number().validateFloat();
        expect((await schema.validate(10.5)).valid).toBe(true);
        expect((await schema.validate('abc')).valid).toBe(false);
    });

    it('validatePositive/Negative', async () => {
        const pos = forma.number().validatePositive();
        const neg = forma.number().validateNegative();
        expect((await pos.validate(1)).valid).toBe(true);
        expect((await pos.validate(-1)).valid).toBe(false);
        expect((await neg.validate(-1)).valid).toBe(true);
        expect((await neg.validate(1)).valid).toBe(false);
    });

    it('validateDivisibleBy', async () => {
        const schema = forma.number().validateDivisibleBy({ divisor: 5 });
        expect((await schema.validate(10)).valid).toBe(true);
        expect((await schema.validate(7)).valid).toBe(false);
    });

    it('validateDecimal', async () => {
        const schema = forma.number().validateDecimal();
        expect((await schema.validate(10.5)).valid).toBe(true);
        expect((await schema.validate(10)).valid).toBe(false);
    });

    it('validateNumeric', async () => {
        const schema = forma.number().validateNumeric();
        expect((await schema.validate(123)).valid).toBe(true);
        expect((await schema.validate('abc')).valid).toBe(false);
    });

    it('validateNotEmpty', async () => {
        const schema = forma.number().validateNotEmpty();
        expect((await schema.validate(1)).valid).toBe(true);
        expect((await schema.validate(null)).valid).toBe(false);
    });

    it('validateIsIn', async () => {
        const schema = forma.number().validateIsIn({ values: [1, 2, 3] });
        expect((await schema.validate(2)).valid).toBe(true);
        expect((await schema.validate(5)).valid).toBe(false);
    });

    it('validateIsWhitelisted', async () => {
        const schema = forma.number().validateIsWhitelisted({ values: [10, 20] });
        expect((await schema.validate(10)).valid).toBe(true);
        expect((await schema.validate(30)).valid).toBe(false);
    });

    it('validateIsBlacklisted', async () => {
        const schema = forma.number().validateIsBlacklisted({ values: [10, 20] });
        expect((await schema.validate(10)).valid).toBe(false);
        expect((await schema.validate(30)).valid).toBe(true);
    });

    it('min/max', async () => {
        const schema = forma.number().min(5).max(10);
        expect((await schema.validate(7)).valid).toBe(true);
        expect((await schema.validate(4)).valid).toBe(false);
        expect((await schema.validate(11)).valid).toBe(false);
    });
});
