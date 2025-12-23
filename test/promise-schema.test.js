import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('PromiseSchema', () => {
    it('should validate a promise structure', async () => {
        const schema = f.promise();
        const p = Promise.resolve(1);
        expect((await schema.validate(p)).valid).toBe(true);
    });

    it('should failure on non-promise', async () => {
        const schema = f.promise();
        expect((await schema.validate(1)).valid).toBe(false);
        expect((await schema.validate({})).valid).toBe(false);
    });

    it('should validate resolved value', async () => {
        const schema = f.promise(f.number());
        const p = Promise.resolve(1);
        const res = await schema.validate(p);

        expect(res.valid).toBe(true);
        expect(res.value).toBe(1); // Should return unwrapped value
    });

    it('should fail if resolved value is invalid', async () => {
        const schema = f.promise(f.number());
        const p = Promise.resolve('string');
        const res = await schema.validate(p);

        expect(res.valid).toBe(false);
    });

    it('should fail if promise rejects', async () => {
        const schema = f.promise(f.number());
        const p = Promise.reject(new Error('fail'));
        // We need to catch this because validate awaits the promise
        // My implementation catches rejection and returns valid=false
        const res = await schema.validate(p);
        expect(res.valid).toBe(false);
    });

    it('should support optional', async () => {
        const schema = f.promise().optional();
        expect((await schema.validate(undefined)).valid).toBe(true);
    });
});
