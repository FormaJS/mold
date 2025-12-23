import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('JSON Schema Generation', () => {
    it('should generate string schema', () => {
        const schema = f.string().min(5).max(10).email();
        const json = schema.toJSONSchema();
        expect(json).toEqual({
            type: 'string',
            minLength: 5,
            maxLength: 10,
            format: 'email',
        });
    });

    it('should generate number schema', () => {
        const schema = f.number().min(0).max(100).int();
        const json = schema.toJSONSchema();
        expect(json).toEqual({
            type: 'integer',
            minimum: 0,
            maximum: 100,
        });
    });

    it('should generate object schema', () => {
        const schema = f.object({
            name: f.string(),
            age: f.number(),
        });
        const json = schema.toJSONSchema();
        expect(json).toEqual({
            type: 'object',
            properties: {
                name: { type: 'string' },
                age: { type: 'number' },
            },
            required: ['name', 'age'],
            additionalProperties: false,
        });
    });

    it('should generate array schema', () => {
        const schema = f.array(f.string());
        const json = schema.toJSONSchema();
        expect(json).toEqual({
            type: 'array',
            items: { type: 'string' },
        });
    });

    it('should generate enum schema', () => {
        const schema = f.enum(['a', 'b']);
        const json = schema.toJSONSchema();
        expect(json).toEqual({
            enum: ['a', 'b'],
        });
    });

    it('should generate union schema', () => {
        const schema = f.or(f.string(), f.number());
        const json = schema.toJSONSchema();
        expect(json).toEqual({
            anyOf: [{ type: 'string' }, { type: 'number' }],
        });
    });

    it('should generate literal schema', () => {
        const schema = f.literal('foo');
        const json = schema.toJSONSchema();
        expect(json).toEqual({
            const: 'foo',
        });
    });
});
