import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('Array Aliases', () => {
    it('should validate min items', async () => {
        const schema = f.array(f.number()).min(3);

        expect((await schema.validate([1, 2])).valid).toBe(false);
        expect((await schema.validate([1, 2, 3])).valid).toBe(true);
    });

    it('should validate max items', async () => {
        const schema = f.array(f.number()).max(2);

        expect((await schema.validate([1, 2])).valid).toBe(true);
        expect((await schema.validate([1, 2, 3])).valid).toBe(false);
    });
});
