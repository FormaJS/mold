import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('ObjectSchema Unknown Keys', () => {
    it('should passthrough unknown keys by default', async () => {
        const schema = f.object({
            a: f.string()
        });
        const input = { a: 'valid', b: 'extra' };
        const result = await schema.validate(input);

        expect(result.valid).toBe(true);
        expect(result.value).toEqual({ a: 'valid', b: 'extra' });
    });

    it('should strip unknown keys when .strip() is used', async () => {
        const schema = f.object({
            a: f.string()
        }).strip();
        const input = { a: 'valid', b: 'extra', c: 123 };
        const result = await schema.validate(input);

        expect(result.valid).toBe(true);
        expect(result.value).toEqual({ a: 'valid' });
        expect(result.value).not.toHaveProperty('b');
        expect(result.value).not.toHaveProperty('c');
    });

    it('should error on unknown keys when .strict() is used', async () => {
        const schema = f.object({
            a: f.string()
        }).strict();
        const input = { a: 'valid', b: 'extra' };
        const result = await schema.validate(input);

        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty('b');
        expect(result.errors.b[0].rule).toBe('invalidKey');
    });

    it('should handle passthrough explicitly', async () => {
        const schema = f.object({
            a: f.string()
        }).strict().passthrough(); // Override strict
        const input = { a: 'valid', b: 'extra' };
        const result = await schema.validate(input);

        expect(result.valid).toBe(true);
        expect(result.value).toEqual({ a: 'valid', b: 'extra' });
    });

    it('toJSONSchema should reflect modes', () => {
        const strict = f.object({ a: f.string() }).strict();
        expect(strict.toJSONSchema().additionalProperties).toBe(false);

        const strip = f.object({ a: f.string() }).strip();
        expect(strip.toJSONSchema().additionalProperties).toBe(true);

        const pass = f.object({ a: f.string() }).passthrough();
        expect(pass.toJSONSchema().additionalProperties).toBe(true);
    });
});
