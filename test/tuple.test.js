import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('TupleSchema', () => {
    it('should validate fixed array', async () => {
        const schema = f.tuple([f.string(), f.number()]);
        expect((await schema.validate(['s', 1])).valid).toBe(true);
        expect((await schema.validate(['s', '1'])).valid).toBe(false);
        expect((await schema.validate(['s'])).valid).toBe(false);
    });
});
