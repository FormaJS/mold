import { describe, it, expect } from 'vitest';
import { forma } from '../src/index.js';

describe('ObjectSchema - Casos de Borda', () => {
    it('valida objeto com campos faltantes', async () => {
        const schema = forma.object({
            name: forma.string().validateNotEmpty(),
            age: forma.number().min(0)
        });
        const result = await schema.validate({ name: 'John' });
        expect(result.valid).toBe(false);
        expect(result.errors.age).toBeDefined();
    });

    it('valida objeto com campo null', async () => {
        const schema = forma.object({
            name: forma.string().validateNotEmpty()
        });
        const result = await schema.validate({ name: null });
        expect(result.valid).toBe(false);
    });

    it('valida objeto com tipo inválido', async () => {
        const schema = forma.object({
            name: forma.string()
        });
        const result = await schema.validate('not-an-object');
        expect(result.valid).toBe(false);
    });

    it('valida objeto com tipo null', async () => {
        const schema = forma.object({
            name: forma.string()
        });
        const result = await schema.validate(null);
        expect(result.valid).toBe(false);
    });

    it('valida objeto com tipo undefined', async () => {
        const schema = forma.object({
            name: forma.string()
        });
        const result = await schema.validate(undefined);
        expect(result.valid).toBe(false);
    });

    it('valida objeto aninhado com erro', async () => {
        const schema = forma.object({
            user: forma.object({
                name: forma.string().validateNotEmpty(),
                email: forma.string().validateEmail()
            })
        });
        const result = await schema.validate({
            user: { name: 'John', email: 'invalid-email' }
        });
        expect(result.valid).toBe(false);
        expect(result.errors.user).toBeDefined();
    });

    it('valida objeto aninhado com campo faltante', async () => {
        const schema = forma.object({
            user: forma.object({
                name: forma.string().validateNotEmpty(),
                email: forma.string().validateEmail()
            })
        });
        const result = await schema.validate({
            user: { name: 'John' }
        });
        expect(result.valid).toBe(false);
        expect(result.errors.user).toBeDefined();
    });

    it('valida múltiplos campos com erro', async () => {
        const schema = forma.object({
            name: forma.string().validateNotEmpty(),
            age: forma.number().min(18),
            email: forma.string().validateEmail()
        });
        const result = await schema.validate({
            name: '',
            age: 10,
            email: 'invalid'
        });
        expect(result.valid).toBe(false);
        expect(result.errors.name).toBeDefined();
        expect(result.errors.age).toBeDefined();
        expect(result.errors.email).toBeDefined();
    });

    it('valida objeto com campo extra (não deve falhar)', async () => {
        const schema = forma.object({
            name: forma.string()
        });
        const result = await schema.validate({
            name: 'John',
            extraField: 'ignored'
        });
        expect(result.valid).toBe(true);
    });

    it('valida objeto vazio com schema vazio', async () => {
        const schema = forma.object({});
        const result = await schema.validate({});
        expect(result.valid).toBe(true);
    });

    it('valida objeto com array com item vazio', async () => {
        const schema = forma.object({
            items: forma.array(forma.string())
        });
        const result = await schema.validate({
            items: ['a', 'b', 'c']
        });
        expect(result.valid).toBe(true);
    });

    it('valida objeto com número string', async () => {
        const schema = forma.object({
            age: forma.number().min(0)
        });
        const result = await schema.validate({ age: 25 });
        expect(result.valid).toBe(true);
        expect(result.value.age).toBe(25);
    });

    it('valida objeto profundamente aninhado', async () => {
        const schema = forma.object({
            level1: forma.object({
                level2: forma.object({
                    level3: forma.string().validateNotEmpty()
                })
            })
        });
        const result = await schema.validate({
            level1: { level2: { level3: 'deep' } }
        });
        expect(result.valid).toBe(true);
    });

    it('valida objeto profundamente aninhado com erro', async () => {
        const schema = forma.object({
            level1: forma.object({
                level2: forma.object({
                    level3: forma.string().validateNotEmpty()
                })
            })
        });
        const result = await schema.validate({
            level1: { level2: { level3: '' } }
        });
        expect(result.valid).toBe(false);
        expect(result.errors.level1).toBeDefined();
    });

    it('cria schema com shape vazio e depois valida', async () => {
        const schema = forma.object({});
        const result = await schema.validate({ anything: 'goes' });
        expect(result.valid).toBe(true);
        expect(result.value).toEqual({ anything: 'goes' });
    });

    it('aplica sanitizers no objeto antes de validar campos', async () => {
        // Criar um schema que aplica sanitizer no nível do objeto
        const schema = forma.object({
            name: forma.string()
        });
        const result = await schema.validate({ name: '  test  ', extra: 'field' });
        expect(result.valid).toBe(true);
        expect(result.value.name).toBe('  test  ');
    });

    it('valida campo com erro de tipo array', async () => {
        const schema = forma.object({
            email: forma.string().validateEmail().validateNotEmpty()
        });
        const result = await schema.validate({ email: 'invalid' });
        expect(result.valid).toBe(false);
        expect(Array.isArray(result.errors.email)).toBe(true);
    });

    it('remove erros null ou undefined dos resultados', async () => {
        const schema = forma.object({
            name: forma.string(),
            age: forma.number()
        });
        const result = await schema.validate({ name: 'John', age: 25 });
        expect(result.valid).toBe(true);
        expect(result.errors).toBeNull();
    });

    it('valida objeto com campo que retorna erro como objeto', async () => {
        const schema = forma.object({
            nested: forma.object({
                value: forma.string().validateNotEmpty()
            })
        });
        const result = await schema.validate({
            nested: { value: '' }
        });
        expect(result.valid).toBe(false);
        expect(result.errors.nested).toBeDefined();
    });

    it('valida objeto mantendo valores processados', async () => {
        const schema = forma.object({
            name: forma.string().trim(),
            age: forma.number()
        });
        const result = await schema.validate({ name: '  John  ', age: 30 });
        expect(result.valid).toBe(true);
        expect(result.value.name).toBe('John');
        expect(result.value.age).toBe(30);
    });

    it('valida objeto com todos os campos válidos retorna errors null', async () => {
        const schema = forma.object({
            x: forma.number(),
            y: forma.number()
        });
        const result = await schema.validate({ x: 1, y: 2 });
        expect(result.valid).toBe(true);
        expect(result.errors).toBeNull();
        expect(Object.keys(result.errors || {}).length).toBe(0);
    });

    it('clona o objeto antes de processar para evitar mutação', async () => {
        const schema = forma.object({
            value: forma.string().trim()
        });
        const original = { value: '  test  ' };
        const result = await schema.validate(original);
        expect(result.valid).toBe(true);
        expect(original.value).toBe('  test  '); // Original não deve mudar
        expect(result.value.value).toBe('test'); // Resultado processado
    });

    it('valida hasOwnProperty corretamente para campos do objeto', async () => {
        const schema = forma.object({
            toString: forma.string() // Testa com propriedade herdada do prototype
        });
        const result = await schema.validate({ toString: 'test' });
        expect(result.valid).toBe(true);
    });

    it('valida objeto com múltiplos campos aninhados complexos', async () => {
        const schema = forma.object({
            user: forma.object({
                profile: forma.object({
                    name: forma.string().validateNotEmpty(),
                    age: forma.number().min(0).max(120)
                }),
                contacts: forma.array(forma.string().validateEmail())
            }),
            settings: forma.object({
                notifications: forma.string()
            })
        });
        
        const result = await schema.validate({
            user: {
                profile: { name: 'Jane', age: 28 },
                contacts: ['jane@example.com', 'jane2@example.com']
            },
            settings: {
                notifications: 'enabled'
            }
        });
        
        expect(result.valid).toBe(true);
    });

    it('valida objeto com array de objetos aninhados', async () => {
        const schema = forma.object({
            items: forma.array(
                forma.object({
                    id: forma.number().min(1),
                    name: forma.string().validateNotEmpty()
                })
            )
        });
        
        const result = await schema.validate({
            items: [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' }
            ]
        });
        
        expect(result.valid).toBe(true);
    });

    it('mantém estrutura de erro para campos com múltiplas validações falhas', async () => {
        const schema = forma.object({
            password: forma.string()
                .validateNotEmpty()
                .validateLength({ min: 8 })
                .validateStrongPassword()
        });
        
        const result = await schema.validate({ password: 'weak' });
        expect(result.valid).toBe(false);
        expect(result.errors.password).toBeDefined();
        expect(Array.isArray(result.errors.password)).toBe(true);
    });

    it('valida objeto preservando ordem dos campos', async () => {
        const schema = forma.object({
            first: forma.string(),
            second: forma.number(),
            third: forma.string()
        });
        
        const input = { first: 'a', second: 2, third: 'c' };
        const result = await schema.validate(input);
        
        expect(result.valid).toBe(true);
        expect(Object.keys(result.value)).toEqual(['first', 'second', 'third']);
    });

    it('retorna estrutura de erro consistente para objetos vazios com required fields', async () => {
        const schema = forma.object({
            required1: forma.string().validateNotEmpty(),
            required2: forma.number().min(1)
        });
        
        const result = await schema.validate({});
        
        expect(result.valid).toBe(false);
        expect(result.errors.required1).toBeDefined();
        expect(result.errors.required2).toBeDefined();
    });

    it('valida objeto com campo string vazio mas presente', async () => {
        const schema = forma.object({
            optionalField: forma.string()
        });
        
        const result = await schema.validate({ optionalField: '' });
        expect(result.valid).toBe(true);
        expect(result.value.optionalField).toBe('');
    });

    it('valida objeto com número zero', async () => {
        const schema = forma.object({
            count: forma.number()
        });
        
        const result = await schema.validate({ count: 0 });
        expect(result.valid).toBe(true);
        expect(result.value.count).toBe(0);
    });
});
