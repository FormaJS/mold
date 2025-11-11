import { describe, it, expect } from 'vitest';
import { forma } from '../src/index.js';

describe('Exemplos reais: uso misto de sanitizers e validators', () => {
    it('Cadastro de usuário: nome, email e idade', async () => {
        const schema = forma.object({
            name: forma.string().trim().toSlug().validateNotEmpty().validateLength({ min: 3 }),
            email: forma.string().trim().normalizeEmail().validateEmail(),
            age: forma.number().validateInt().validatePositive().min(18),
        });
        const input = {
            name: '  João da Silva  ',
            email: '  TESTE@EMAIL.COM  ',
            age: 22,
        };
        const result = await schema.validate(input);
        expect(result.valid).toBe(true);
        expect(result.value.name).toBe('joao-da-silva');
        expect(result.value.email).toBe('teste@email.com');
        expect(result.value.age).toBe(22);
    });

    it('Formulário de contato: mensagem obrigatória, telefone opcional', async () => {
        const schema = forma.object({
            message: forma
                .string()
                .trim()
                .stripTags()
                .validateNotEmpty()
                .validateLength({ min: 10 }),
            phone: forma.string().trim().validateLength({ min: 8, max: 15 }),
        });
        const input = {
            message: '  <b>Olá, preciso de ajuda!</b>  ',
            phone: '  11999999999  ',
        };
        const result = await schema.validate(input);
        expect(result.valid).toBe(true);
        expect(result.value.message).toBe('Olá, preciso de ajuda!');
        expect(result.value.phone).toBe('11999999999');
    });

    it('Sanitização e validação de lista de emails', async () => {
        const schema = forma.object({
            emails: forma
                .array(forma.string().trim().normalizeEmail().validateEmail())
                .minLength(2),
        });
        const input = {
            emails: ['  TESTE@EMAIL.COM ', '  outro@dominio.com  '],
        };
        const result = await schema.validate(input);
        expect(result.valid).toBe(true);
        expect(result.value.emails[0]).toBe('teste@email.com');
        expect(result.value.emails[1]).toBe('outro@dominio.com');
    });

    it('Validação de senha forte e sanitização', async () => {
        const schema = forma.object({
            password: forma.string().trim().validateStrongPassword(),
        });
        const input = { password: '  Abc123!@#  ' };
        const result = await schema.validate(input);
        expect(result.valid).toBe(true);
        expect(result.value.password).toBe('Abc123!@#');
    });

    it('Sanitização de campos com blacklist/whitelist', async () => {
        const schema = forma.object({
            code: forma
                .string()
                .blacklist({ chars: 'a' })
                .whitelist({ chars: 'bcd' })
                .validateNotEmpty(),
        });
        const input = { code: 'abcdaaa' };
        const result = await schema.validate(input);
        expect(result.valid).toBe(true);
        expect(result.value.code).toBe('bcd');
    });

    it('Validação de objeto aninhado com sanitização', async () => {
        const schema = forma.object({
            user: forma.object({
                name: forma.string().trim().toSlug().validateNotEmpty(),
                contact: forma.object({
                    email: forma.string().normalizeEmail().validateEmail(),
                }),
            }),
        });
        const input = {
            user: {
                name: '  Maria Eduarda  ',
                contact: { email: '  MARIA@EMAIL.COM  ' },
            },
        };
        const result = await schema.validate(input);
        expect(result.valid).toBe(true);
        expect(result.value.user.name).toBe('maria-eduarda');
        expect(result.value.user.contact.email).toBe('maria@email.com');
    });
});
