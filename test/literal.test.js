import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('LiteralSchema', () => {
    it('should validate exact values', async () => {
        const schema = f.literal('red');
        expect((await schema.validate('red')).valid).toBe(true);
        expect((await schema.validate('blue')).valid).toBe(false);
    });

    it('should validate booleans and numbers', async () => {
        const boolSchema = f.literal(true);
        expect((await boolSchema.validate(true)).valid).toBe(true);
        expect((await boolSchema.validate(false)).valid).toBe(false);

        const numSchema = f.literal(42);
        expect((await numSchema.validate(42)).valid).toBe(true);
        expect((await numSchema.validate(43)).valid).toBe(false);
    });
});
