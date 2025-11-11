import { describe, it, expect } from 'vitest';
import { forma } from '../src/index.js';

describe('ArraySchema - Casos de Borda', () => {
    it('valida array com tipo inválido (não-array)', async () => {
        const schema = forma.array(forma.string());
        const result = await schema.validate('not-an-array');
        expect(result.valid).toBe(false);
    });

    it('valida array com null', async () => {
        const schema = forma.array(forma.string());
        const result = await schema.validate(null);
        expect(result.valid).toBe(false);
    });

    it('valida array com undefined', async () => {
        const schema = forma.array(forma.string());
        const result = await schema.validate(undefined);
        expect(result.valid).toBe(false);
    });

    it('valida array vazio', async () => {
        const schema = forma.array(forma.string());
        const result = await schema.validate([]);
        expect(result.valid).toBe(true);
        expect(result.value).toEqual([]);
    });

    it('valida array com item inválido no meio', async () => {
        const schema = forma.array(forma.number().min(0));
        const result = await schema.validate([1, 2, -1, 4]);
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
    });

    it('valida array com múltiplos itens inválidos', async () => {
        const schema = forma.array(forma.string().validateEmail());
        const result = await schema.validate([
            'valid@email.com',
            'invalid1',
            'invalid2',
            'another@valid.com'
        ]);
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
    });

    it('valida array de objetos com erros', async () => {
        const schema = forma.array(
            forma.object({
                id: forma.number().min(1),
                name: forma.string().validateNotEmpty()
            })
        );
        const result = await schema.validate([
            { id: 1, name: 'John' },
            { id: 0, name: '' },
            { id: 2, name: 'Jane' }
        ]);
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
    });

    it('valida array aninhado', async () => {
        const schema = forma.array(forma.array(forma.string()));
        const result = await schema.validate([['a', 'b'], ['c', 'd']]);
        expect(result.valid).toBe(true);
    });

    it('valida array aninhado com erro', async () => {
        const schema = forma.array(
            forma.array(forma.number().min(0))
        );
        const result = await schema.validate([[1, 2], [3, -1]]);
        expect(result.valid).toBe(false);
    });

    it('valida array com números válidos', async () => {
        const schema = forma.array(forma.number());
        const result = await schema.validate([1, 2, 3]);
        expect(result.valid).toBe(true);
        expect(result.value).toEqual([1, 2, 3]);
    });
});
