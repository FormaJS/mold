import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('Object Enhancements', () => {
    it('should partial() make all fields optional', async () => {
        const schema = f.object({
            a: f.string(),
            b: f.number()
        }).partial();

        expect((await schema.validate({})).valid).toBe(true);
        expect((await schema.validate({ a: 's' })).valid).toBe(true);
    });

    it('should required() make all fields required', async () => {
        const schema = f.object({
            a: f.string().optional(),
            b: f.number().optional()
        }).required();

        expect((await schema.validate({})).valid).toBe(false);
        expect((await schema.validate({ a: 's', b: 1 })).valid).toBe(true);
    });

    it('should extend() merge shapes', async () => {
        const schemaA = f.object({ a: f.string() });
        const schemaB = schemaA.extend({ b: f.number() });

        expect((await schemaB.validate({ a: 's', b: 1 })).valid).toBe(true);
        expect((await schemaB.validate({ a: 's' })).valid).toBe(false);
    });
});
