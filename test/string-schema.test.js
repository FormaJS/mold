import { describe, it, expect } from 'vitest';
import { forma } from '../src/index.js';

describe('StringSchema - Integração com validadores e sanitizadores FormaJS', () => {
    it('validateAlpha', async () => {
        const schema = forma.string().validateAlpha();
        expect((await schema.validate('abc')).valid).toBe(true);
        expect((await schema.validate('123')).valid).toBe(false);
    });

    it('validateAlphanumeric', async () => {
        const schema = forma.string().validateAlphanumeric();
        expect((await schema.validate('abc123')).valid).toBe(true);
        expect((await schema.validate('abc!')).valid).toBe(false);
    });

    it('validateEmail', async () => {
        const schema = forma.string().validateEmail();
        expect((await schema.validate('a@b.com')).valid).toBe(true);
        expect((await schema.validate('a@b')).valid).toBe(false);
    });

    it('validateLength', async () => {
        const schema = forma.string().validateLength({ min: 2, max: 4 });
        expect((await schema.validate('abc')).valid).toBe(true);
        expect((await schema.validate('a')).valid).toBe(false);
        expect((await schema.validate('abcde')).valid).toBe(false);
    });

    it('validateNotEmpty', async () => {
        const schema = forma.string().validateNotEmpty();
        expect((await schema.validate('a')).valid).toBe(true);
        expect((await schema.validate('')).valid).toBe(false);
    });

    it('validateSlug', async () => {
        const schema = forma.string().validateSlug();
        expect((await schema.validate('abc-def')).valid).toBe(true);
        expect((await schema.validate('abc_def')).valid).toBe(false);
    });

    it('validateStrongPassword', async () => {
        const schema = forma.string().validateStrongPassword();
        expect((await schema.validate('Abc123!@#')).valid).toBe(true);
        expect((await schema.validate('abc')).valid).toBe(false);
    });

    it('validateUUID', async () => {
        const schema = forma.string().validateUUID();
        // UUID v4 válido: 123e4567-e89b-42d3-a456-426614174000 (dígito 4 na posição da versão)
        const uuidV4 = '123e4567-e89b-42d3-a456-426614174000';
        expect((await schema.validate(uuidV4)).valid).toBe(true);
        expect((await schema.validate('123')).valid).toBe(false);
        // Testa versão específica
        expect((await forma.string().validateUUID({ version: 4 }).validate(uuidV4)).valid).toBe(
            true
        );
        expect((await forma.string().validateUUID({ version: 3 }).validate(uuidV4)).valid).toBe(
            false
        );
    });

    it('trim, lTrim, rTrim', async () => {
        const schema = forma.string().trim().lTrim().rTrim();
        expect((await schema.validate('  abc  ')).value).toBe('abc');
    });

    it('toSlug', async () => {
        const schema = forma.string().toSlug();
        expect((await schema.validate('João da Silva')).value).toBe('joao-da-silva');
    });

    it('escapeHTML/unescapeHTML', async () => {
        const schema = forma.string().escapeHTML();
        expect((await schema.validate('<div>')).value).toContain('&lt;');
        const schema2 = forma.string().escapeHTML().unescapeHTML();
        expect((await schema2.validate('<div>')).value).toBe('<div>');
    });

    it('normalizeEmail', async () => {
        const schema = forma.string().normalizeEmail();
        expect((await schema.validate('Test@Email.com')).value).toContain('@');
    });

    it('blacklist/whitelist', async () => {
        const schema = forma.string().blacklist({ chars: 'a' });
        expect((await schema.validate('banana')).value).not.toContain('a');
        const schema2 = forma.string().whitelist({ chars: 'b' });
        expect((await schema2.validate('banana')).value).toBe('b');
    });

    it('stripTags', async () => {
        const schema = forma.string().stripTags();
        expect((await schema.validate('<b>abc</b>')).value).toBe('abc');
    });
});
