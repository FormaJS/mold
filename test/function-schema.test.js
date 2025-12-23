import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('FunctionSchema', () => {
    it('should validate a function', async () => {
        const schema = f.function();
        const fn = () => { };
        expect((await schema.validate(fn)).valid).toBe(true);
    });

    it('should validate an async function', async () => {
        const schema = f.function();
        const fn = async () => { };
        expect((await schema.validate(fn)).valid).toBe(true);
    });

    it('should fail on non-function', async () => {
        const schema = f.function();
        expect((await schema.validate(1)).valid).toBe(false);
        expect((await schema.validate({})).valid).toBe(false);
        expect((await schema.validate('function')).valid).toBe(false);
    });

    it('should support optional', async () => {
        const schema = f.function().optional();
        expect((await schema.validate(undefined)).valid).toBe(true);
    });
});
