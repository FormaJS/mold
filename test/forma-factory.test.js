import { describe, it, expect } from 'vitest';
import { forma } from '../src/index.js';

describe('Forma Factory', () => {
    it('cria StringSchema com string()', () => {
        const schema = forma.string();
        expect(schema).toBeDefined();
        expect(schema.constructor.name).toBe('StringSchema');
    });

    it('cria NumberSchema com number()', () => {
        const schema = forma.number();
        expect(schema).toBeDefined();
        expect(schema.constructor.name).toBe('NumberSchema');
    });

    it('cria ObjectSchema com object()', () => {
        const schema = forma.object({});
        expect(schema).toBeDefined();
        expect(schema.constructor.name).toBe('ObjectSchema');
    });

    it('cria ArraySchema com array()', () => {
        const schema = forma.array(forma.string());
        expect(schema).toBeDefined();
        expect(schema.constructor.name).toBe('ArraySchema');
    });

    it('define locale com setLocale()', async () => {
        const testForma = new (await import('../src/index.js')).default.constructor('en-US');
        testForma.setLocale('pt-BR');
        expect(testForma.engine.locale).toBe('pt-BR');
    });

    it('factory retorna instâncias funcionais', async () => {
        const stringSchema = forma.string().validateNotEmpty();
        const result = await stringSchema.validate('test');
        expect(result.valid).toBe(true);
    });

    it('factory permite encadeamento de métodos', () => {
        const schema = forma
            .string()
            .trim()
            .validateNotEmpty()
            .validateEmail();
        expect(schema).toBeDefined();
    });

    it('factory cria schemas independentes', async () => {
        const schema1 = forma.string().validateLength({ min: 5 });
        const schema2 = forma.string().validateLength({ min: 10 });

        const result1 = await schema1.validate('hello');
        const result2 = await schema2.validate('hello');

        expect(result1.valid).toBe(true);
        expect(result2.valid).toBe(false);
    });

    it('factory cria object schema com múltiplos tipos', () => {
        const schema = forma.object({
            name: forma.string(),
            age: forma.number(),
            hobbies: forma.array(forma.string())
        });
        expect(schema).toBeDefined();
    });

    it('factory cria array de objects', () => {
        const schema = forma.array(
            forma.object({
                id: forma.number(),
                name: forma.string()
            })
        );
        expect(schema).toBeDefined();
    });
});
