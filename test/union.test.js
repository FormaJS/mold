import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('UnionSchema (OR)', () => {
    it('should validate if one matches', async () => {
        const schema = f.or([f.string(), f.number()]);
        expect((await schema.validate('hello')).valid).toBe(true);
        expect((await schema.validate(123)).valid).toBe(true);
        expect((await schema.validate(true)).valid).toBe(false);
    });

    it('should provide detailed errors', async () => {
        const schema = f.or([f.string(), f.number()]);
        const res = await schema.validate(true);
        expect(res.valid).toBe(false);
        const msg = res.errors[0].message;
        // Depending on locale, specific messages might vary, but we expect "Issues:" and some content
        expect(msg).toContain('Issues:');
        expect(res.errors[0].context.unionErrors).toBeDefined();
    });
});
