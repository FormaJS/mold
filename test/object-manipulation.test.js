import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('Object Manipulation', () => {
    describe('.pick()', () => {
        it('should create new schema with selected keys', async () => {
            const schema = f.object({
                a: f.string(),
                b: f.number(),
                c: f.boolean()
            });

            const picked = schema.pick(['a', 'c']);
            const result = await picked.validate({ a: 'foo', c: true });

            expect(result.valid).toBe(true);
            expect(result.value).toEqual({ a: 'foo', c: true });

            // Should ignore extra keys (default unknownMode)
            const resultExtra = await picked.validate({ a: 'foo', c: true, b: 123 });
            expect(resultExtra.valid).toBe(true);
            expect(resultExtra.value).toEqual({ a: 'foo', c: true, b: 123 });
        });

        it('should respect inherited unknownMode', async () => {
            const schema = f.object({ a: f.string(), b: f.number() }).strict();
            const picked = schema.pick(['a']);

            const result = await picked.validate({ a: 'foo', b: 123 }); // b is now unknown
            expect(result.valid).toBe(false); // stric mode should fail
            // @ts-ignore
            expect(picked._unknownMode).toBe('strict');
        });
    });

    describe('.omit()', () => {
        it('should create new schema without omitted keys', async () => {
            const schema = f.object({
                a: f.string(),
                b: f.number(),
                c: f.boolean()
            });

            const omitted = schema.omit(['b']);
            const result = await omitted.validate({ a: 'foo', c: true });

            expect(result.valid).toBe(true);
            expect(result.value).toEqual({ a: 'foo', c: true });
        });

        it('should respect inherited unknownMode', async () => {
            const schema = f.object({ a: f.string(), b: f.number() }).strip();
            const omitted = schema.omit(['b']);

            const result = await omitted.validate({ a: 'foo', b: 123 }); // b is stripped
            expect(result.valid).toBe(true);
            expect(result.value).toEqual({ a: 'foo' });
            expect(result.value).not.toHaveProperty('b');
        });
    });
});
