import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('optional()', () => {
    it('should allow undefined values', async () => {
        const schema = f.string().optional();
        const result = await schema.validate(undefined);
        expect(result.valid).toBe(true);
        expect(result.value).toBe(undefined);
    });

    it('should validate if value is present', async () => {
        const schema = f.string().optional();
        const result = await schema.validate('hello');
        expect(result.valid).toBe(true);
        expect(result.value).toBe('hello');

        const fail = await schema.validate(123);
        expect(fail.valid).toBe(false);
    });

    it('should work within objects', async () => {
        const schema = f.object({
            req: f.string(),
            opt: f.number().optional(),
        });

        const res1 = await schema.validate({ req: 'a' });
        expect(res1.valid).toBe(true);
        expect(res1.value).toEqual({ req: 'a' });

        const res2 = await schema.validate({ req: 'a', opt: 10 });
        expect(res2.valid).toBe(true);
    });

    it('should reflect in JSON Schema', () => {
        const schema = f.object({
            req: f.string(),
            opt: f.number().optional(),
        });
        const json = schema.toJSONSchema();
        expect(json.required).toContain('req');
        expect(json.required).not.toContain('opt');
    });
});
