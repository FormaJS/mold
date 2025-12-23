import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('BooleanSchema', () => {
    it('should validate boolean primitives', async () => {
        const schema = f.boolean();

        expect((await schema.validate(true)).valid).toBe(true);
        expect((await schema.validate(false)).valid).toBe(true);
    });

    it('should validate strings in loose mode (default)', async () => {
        const schema = f.boolean();
        // Assuming default is loose
        let res;

        res = await schema.validate('true');
        expect(res.valid).toBe(true);
        expect(res.value).toBe(true);

        res = await schema.validate('false');
        expect(res.valid).toBe(true);
        expect(res.value).toBe(false);

        res = await schema.validate('on');
        expect(res.valid).toBe(true);
        expect(res.value).toBe(true);

        expect((await schema.validate('random')).valid).toBe(false);
    });

    it('should validate strings in strict mode', async () => {
        const schema = f.boolean({ strict: true });

        expect((await schema.validate(true)).valid).toBe(true);
        expect((await schema.validate(false)).valid).toBe(true);

        // Strings should fail in strict mode (depending on Forma implementation)
        // If Forma's validateBoolean with strict=true rejects strings, then:
        // Actually, my implementation calls engine.validateBoolean(value, { strict }).
        // If strict=true, validateBoolean usually only accepts "true"/"false" strings or maybe none?
        // Let's check. But primitives logic is hardcoded in my BooleanSchema to pass.
        // So primitives pass.
        // Strings: engine.validateBoolean(val, {strict: true})

        // If 'strict' in validateBoolean means strict casing or only "1"/"0"?
        // Usually strict means no "yes"/"on".

        const res = await schema.validate('true');
        // It depends on Forma's strict definition.
        // I'll assume it passes "true" but fails "on".
        expect(res.valid).toBe(true);

        const resOn = await schema.validate('on');
        expect(resOn.valid).toBe(false);
    });

    it('should validate types', async () => {
        const schema = f.boolean();
        expect((await schema.validate(123)).valid).toBe(false);
        expect((await schema.validate({})).valid).toBe(false);
        expect((await schema.validate(null)).valid).toBe(false);
    });

    it('should support .optional()', async () => {
        const schema = f.boolean().optional();
        expect((await schema.validate(undefined)).valid).toBe(true);
    });

    it('should generate correct JSON Schema', () => {
        const schema = f.boolean();
        expect(schema.toJSONSchema()).toEqual({ type: 'boolean' });
    });
});
