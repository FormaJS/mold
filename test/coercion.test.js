import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('Data Coercion', () => {
    describe('coerce.number()', () => {
        it('should coerce string to number', async () => {
            const schema = f.coerce.number();
            expect((await schema.validate('123')).valid).toBe(true);
            expect((await schema.validate('123')).value).toBe(123);
        });

        it('should fail on invalid number string', async () => {
            const schema = f.coerce.number();
            // Number('abc') is NaN
            expect((await schema.validate('abc')).valid).toBe(false);
        });
    });

    describe('coerce.boolean()', () => {
        it('should coerce checkable values to true', async () => {
            const schema = f.coerce.boolean();
            expect((await schema.validate('true')).value).toBe(true);
            expect((await schema.validate('on')).value).toBe(true);
            expect((await schema.validate('1')).value).toBe(true);
            expect((await schema.validate(1)).value).toBe(true);
            expect((await schema.validate(true)).value).toBe(true);
        });

        it('should coerce others to false', async () => {
            const schema = f.coerce.boolean();
            expect((await schema.validate('false')).value).toBe(false);
            expect((await schema.validate('off')).value).toBe(false);
            expect((await schema.validate(0)).value).toBe(false);
        });
    });

    describe('coerce.date()', () => {
        it('should coerce ISO string to Date', async () => {
            const schema = f.coerce.date();
            const dateStr = '2023-01-01T00:00:00.000Z';
            const res = await schema.validate(dateStr);
            expect(res.valid).toBe(true);
            expect(res.value).toBeInstanceOf(Date);
            expect(res.value.toISOString()).toBe(dateStr);
        });

        it('should fail on invalid date string', async () => {
            const schema = f.coerce.date();
            const res = await schema.validate('invalid-date');
            expect(res.valid).toBe(false);
        });
    });

    describe('coerce.string()', () => {
        it('should coerce number to string', async () => {
            const schema = f.coerce.string();
            expect((await schema.validate(123)).value).toBe('123');
        });
    });
});
