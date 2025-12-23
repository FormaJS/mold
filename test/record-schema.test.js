import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('RecordSchema', () => {
    it('should validate valid record', async () => {
        const schema = f.record(f.number());

        expect((await schema.validate({ a: 1, b: 2 })).valid).toBe(true);
        expect((await schema.validate({})).valid).toBe(true);
    });

    it('should fail on invalid values', async () => {
        const schema = f.record(f.number());
        const result = await schema.validate({ a: 1, b: 'two' });

        expect(result.valid).toBe(false);
        expect(result.errors.b).toBeDefined();
    });

    it('should fail on non-object input', async () => {
        const schema = f.record(f.number());

        expect((await schema.validate(null)).valid).toBe(false);
        expect((await schema.validate([])).valid).toBe(false);
        expect((await schema.validate('string')).valid).toBe(false);
    });

    it('should support object validation features like optional', async () => {
        const schema = f.record(f.number()).optional();

        expect((await schema.validate(undefined)).valid).toBe(true);
    });
});
