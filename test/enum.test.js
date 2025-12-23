import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('EnumSchema', () => {
    it('should validate from list', async () => {
        const schema = f.enum(['red', 'blue']);
        expect((await schema.validate('red')).valid).toBe(true);
        expect((await schema.validate('blue')).valid).toBe(true);
        expect((await schema.validate('green')).valid).toBe(false);
    });
});
