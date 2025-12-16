import formaInstance from '@formajs/formajs';
import { StringSchema } from './core/StringSchema.js';
import { NumberSchema } from './core/NumberSchema.js';
import { ObjectSchema } from './core/ObjectSchema.js';
import { ArraySchema } from './core/ArraySchema.js';

// Extract the Forma class from the default FormaJS instance
const Forma = formaInstance.constructor;

class FormaSchemaFactory {
    constructor(locale = 'en-US') {
        this.engine = new Forma(locale);
    }

    setLocale(locale) {
        try {
            this.engine.setLocale(locale);
        } catch {
            // If the locale isn't registered yet, optimistically set the property
            // to satisfy synchronous callers, then load and apply properly.
            this.engine.locale = locale;
            const modulePath = `@formajs/formajs/i18n/${locale}`;
            import(modulePath)
                .then(() => {
                    try {
                        this.engine.setLocale(locale);
                    } catch {
                        // keep optimistic assignment if setLocale still fails
                    }
                })
                .catch(() => {
                    // If loading fails, revert to a safe default
                    try {
                        this.engine.setLocale('en-US');
                    } catch {
                        this.engine.locale = 'en-US';
                    }
                });
        }
    }

    /**
     * Ensure a locale module is registered in FormaJS by dynamically importing
     * its side-effectful wrapper (v2.0.0 uses opt-in locales).
     * @param {string} locale - e.g. 'pt-BR', 'ru-RU'
     * @returns {Promise<void>}
     */
    async ensureLocale(locale) {
        const modulePath = `@formajs/formajs/i18n/${locale}`;
        try {
            // Dynamic import triggers the locale wrapper's self-registration.
            await import(modulePath);
        } catch {
            // No-op: leave to caller to import manually or handle error upstream.
        }
    }

    /**
     * Ensure locale registration (Forma v2 opt-in) and set it on the engine.
     * Prefer this method when the locale module may not yet be loaded.
     * @param {string} locale
     * @returns {Promise<void>}
     */
    async setLocaleAsync(locale) {
        await this.ensureLocale(locale);
        this.engine.setLocale(locale);
    }

    /**
     * Start a string validation chain.
     * @returns {StringSchema}
     */
    string() {
        return new StringSchema(this.engine);
    }

    /**
     * Start a number validation chain.
     * @returns {NumberSchema}
     */
    number() {
        return new NumberSchema(this.engine);
    }

    /**
     * Start an object validation chain.
     * @param {object} shape - The object shape.
     * @returns {ObjectSchema}
     */
    object(shape = {}) {
        return new ObjectSchema(this.engine, shape);
    }

    /**
     * Start an array validation chain.
     * @param {BaseSchema} itemSchema - The schema for each array item.
     * @returns {ArraySchema}
     */
    array(itemSchema) {
        return new ArraySchema(this.engine, itemSchema);
    }
}

export const f = new FormaSchemaFactory();
export const forma = f;

/**
 * @typedef {import('./core/BaseSchema.js').BaseSchema<any>} AnySchema
 */

/**
 * @template {AnySchema} T
 * @typedef {T['_outputType']} infer
 */

export default f;
