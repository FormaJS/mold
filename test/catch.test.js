import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('.catch()', () => {
    it('should return fallback value on error', async () => {
        const schema = f.string().catch('fallback');
        const res = await schema.validate(123); // Invalid type
        expect(res.valid).toBe(true);
        expect(res.value).toBe('fallback');
    });

    it('should return valid value if no error', async () => {
        const schema = f.string().catch('fallback');
        const res = await schema.validate('valid');
        expect(res.valid).toBe(true);
        expect(res.value).toBe('valid');
    });

    it('should work with validation errors', async () => {
        const schema = f.string().email().catch('invalid@email.com');
        const res = await schema.validate('not-an-email');
        expect(res.valid).toBe(true);
        expect(res.value).toBe('invalid@email.com');
    });

    it('should preserve type inference logic (runtime check)', async () => {
        const schema = f.number().catch(0);
        const res = await schema.validate('NaN');
        expect(res.value).toBe(0);
    });
});
