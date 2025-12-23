import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('DateSchema', () => {
    it('should validate valid Date objects', async () => {
        const schema = f.date();
        const date = new Date();
        const res = await schema.validate(date);
        expect(res.valid).toBe(true);
        expect(res.value).toBe(date);
    });

    it('should fail on invalid types or NaNs', async () => {
        const schema = f.date();
        expect((await schema.validate('not a date')).valid).toBe(false); // BaseSchema doesn't coerce unless transforming
        expect((await schema.validate(new Date('invalid'))).valid).toBe(false);
        expect((await schema.validate(123)).valid).toBe(false);
    });

    it('should validate min date', async () => {
        const min = new Date('2023-01-01');
        const schema = f.date().min(min);

        expect((await schema.validate(new Date('2022-12-31'))).valid).toBe(false);
        expect((await schema.validate(new Date('2023-01-01'))).valid).toBe(true);
        expect((await schema.validate(new Date('2023-01-02'))).valid).toBe(true);
    });

    it('should validate max date', async () => {
        const max = new Date('2023-12-31');
        const schema = f.date().max(max);

        expect((await schema.validate(new Date('2024-01-01'))).valid).toBe(false);
        expect((await schema.validate(new Date('2023-12-31'))).valid).toBe(true);
        expect((await schema.validate(new Date('2023-12-30'))).valid).toBe(true);
    });

    it('should support coercion via f.coerce.date()', async () => {
        const schema = f.coerce.date();
        expect((await schema.validate('2023-01-01')).valid).toBe(true);
        expect((await schema.validate('invalid')).valid).toBe(false);
    });

    it('should generate correct JSON Schema', () => {
        const schema = f.date();
        expect(schema.toJSONSchema()).toEqual({
            type: 'string',
            format: 'date-time'
        });
    });
});
