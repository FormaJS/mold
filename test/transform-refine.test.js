import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('Transform & Refine', () => {
    it('should transform values', async () => {
        const schema = f.string().transform((s) => s + s);
        const res = await schema.validate('hi');
        expect(res.valid).toBe(true);
        expect(res.value).toBe('hihi');
    });

    it('should refine values', async () => {
        const schema = f
            .string()
            .refine((s) => s.includes('fail') === false, { message: 'no fail' });
        expect((await schema.validate('good')).valid).toBe(true);
        expect((await schema.validate('fail')).valid).toBe(false);
    });
});
