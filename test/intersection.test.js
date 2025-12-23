import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('IntersectionSchema (AND)', () => {
    it('should validate if all match and merge objects', async () => {
        const schema = f.and([f.object({ a: f.string() }), f.object({ b: f.number() })]);

        const res = await schema.validate({ a: 's', b: 1 });
        expect(res.valid).toBe(true);
        expect(res.value).toEqual({ a: 's', b: 1 });

        expect((await schema.validate({ a: 's' })).valid).toBe(false);
    });
});
