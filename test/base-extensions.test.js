import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('BaseSchema Extensions', () => {
    describe('.default()', () => {
        it('should return default value when input is undefined', async () => {
            const schema = f.string().default('hello');
            const res = await schema.validate(undefined);
            expect(res.valid).toBe(true);
            expect(res.value).toBe('hello');
        });

        it('should use input value if provided', async () => {
            const schema = f.string().default('hello');
            const res = await schema.validate('world');
            expect(res.valid).toBe(true);
            expect(res.value).toBe('world');
        });
    });

    describe('.describe()', () => {
        it('should store description in schema', () => {
            const schema = f.string().describe('User name');
            // @ts-ignore
            expect(schema._description).toBe('User name');
        });

        it('should preserve description over chain method', () => {
            const schema = f.string().describe('User name').min(3);
            // @ts-ignore
            expect(schema._description).toBe('User name');
        });
    });

    describe('optional + default', () => {
        it('default should take precedence over optional', async () => {
            const schema = f.string().optional().default('foo');
            const res = await schema.validate(undefined);
            expect(res.valid).toBe(true);
            expect(res.value).toBe('foo');
        });
    });
});
