import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('MapSchema', () => {
    it('should validate valid map', async () => {
        const schema = f.map(f.string(), f.number());
        const map = new Map([['a', 1], ['b', 2]]);

        expect((await schema.validate(map)).valid).toBe(true);
    });

    it('should fail on invalid map entries', async () => {
        const schema = f.map(f.string(), f.number());
        const map = new Map([['a', 1], ['b', 'two']]);

        const result = await schema.validate(map);
        expect(result.valid).toBe(false);
        // We expect custom error structure
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail on non-map input', async () => {
        const schema = f.map(f.string(), f.number());
        expect((await schema.validate({})).valid).toBe(false);
    });

    it('should support optional', async () => {
        const schema = f.map(f.string(), f.number()).optional();
        expect((await schema.validate(undefined)).valid).toBe(true);
    });
});

describe('SetSchema', () => {
    it('should validate valid set', async () => {
        const schema = f.set(f.number());
        const set = new Set([1, 2, 3]);

        expect((await schema.validate(set)).valid).toBe(true);
    });

    it('should fail on invalid set values', async () => {
        const schema = f.set(f.number());
        const set = new Set([1, 'two', 3]);

        const result = await schema.validate(set);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail on non-set input', async () => {
        const schema = f.set(f.number());
        expect((await schema.validate([])).valid).toBe(false);
    });

    it('should support optional', async () => {
        const schema = f.set(f.number()).optional();
        expect((await schema.validate(undefined)).valid).toBe(true);
    });
});
