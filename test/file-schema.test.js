import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { f } from '../src/index.js';

describe('FileSchema', () => {
    let OriginalFile;

    beforeAll(() => {
        OriginalFile = global.File;
        // Mock File if not present or just to be safe
        global.File = class MockFile {
            constructor(parts, name, options) {
                this.parts = parts;
                this.name = name;
                this.type = options.type || '';
                this.size = parts.reduce((acc, part) => acc + part.length, 0);
            }
        };
    });

    afterAll(() => {
        global.File = OriginalFile;
    });

    it('should validate File instances', async () => {
        const schema = f.file();
        const file = new File(['content'], 'test.txt', { type: 'text/plain' });
        const res = await schema.validate(file);
        expect(res.valid).toBe(true);
    });

    it('should fail for non-File values', async () => {
        const schema = f.file();
        expect((await schema.validate('not a file')).valid).toBe(false);
        expect((await schema.validate({})).valid).toBe(false);
    });

    it('should validate minSize', async () => {
        const schema = f.file().minSize(10); // bytes
        const small = new File(['123'], 'small.txt', { type: 'text/plain' });
        const large = new File(['12345678901'], 'large.txt', { type: 'text/plain' });

        expect((await schema.validate(small)).valid).toBe(false); // 3 bytes
        expect((await schema.validate(large)).valid).toBe(true); // 11 bytes
    });

    it('should validate maxSize', async () => {
        const schema = f.file().maxSize(5);
        const small = new File(['123'], 'small.txt', { type: 'text/plain' });
        const large = new File(['123456'], 'large.txt', { type: 'text/plain' });

        expect((await schema.validate(small)).valid).toBe(true);
        expect((await schema.validate(large)).valid).toBe(false);
    });

    it('should validate mimeType', async () => {
        const schema = f.file().type('image/png');
        const png = new File([''], 'img.png', { type: 'image/png' });
        const jpeg = new File([''], 'img.jpg', { type: 'image/jpeg' });

        expect((await schema.validate(png)).valid).toBe(true);
        expect((await schema.validate(jpeg)).valid).toBe(false);
    });

    it('should validate mimeType with wildcard', async () => {
        const schema = f.file().type('image/*');
        const png = new File([''], 'img.png', { type: 'image/png' });
        const text = new File([''], 'doc.txt', { type: 'text/plain' });

        expect((await schema.validate(png)).valid).toBe(true);
        expect((await schema.validate(text)).valid).toBe(false);
    });
});
