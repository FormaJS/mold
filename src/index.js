import formaInstance from '@formajs/formajs';
import { BaseSchema } from './core/BaseSchema.js';
import { StringSchema } from './core/StringSchema.js';
import { NumberSchema } from './core/NumberSchema.js';
import { ObjectSchema } from './core/ObjectSchema.js';
import { ArraySchema } from './core/ArraySchema.js';
import { LiteralSchema } from './core/LiteralSchema.js';
import { EnumSchema } from './core/EnumSchema.js';
import { UnionSchema } from './core/UnionSchema.js';
import { IntersectionSchema } from './core/IntersectionSchema.js';
import { TupleSchema } from './core/TupleSchema.js';
import { LazySchema } from './core/LazySchema.js';
import { BooleanSchema } from './core/BooleanSchema.js';
import { DateSchema } from './core/DateSchema.js';
import { RecordSchema } from './core/RecordSchema.js';
import { MapSchema } from './core/MapSchema.js';
import { SetSchema } from './core/SetSchema.js';
import { PromiseSchema } from './core/PromiseSchema.js';
import { FunctionSchema } from './core/FunctionSchema.js';
import { FileSchema } from './core/FileSchema.js';

// Extract the Forma class from the default FormaJS instance
const Forma = formaInstance.constructor;

class FormaSchemaFactory {
    constructor(locale = 'en-US') {
        /** @type {any} */
        const FormaClass = Forma;
        this.engine = new FormaClass(locale);
    }

    /**
     * @param {string} locale
     */
    setLocale(locale) {
        try {
            this.engine.setLocale(locale);
        } catch {
            this.engine.locale = locale;
            const modulePath = `@formajs/formajs/i18n/${locale}`;
            import(modulePath)
                .then(() => {
                    try {
                        this.engine.setLocale(locale);
                    } catch {
                        // ignore
                    }
                })
                .catch(() => {
                    try {
                        this.engine.setLocale('en-US');
                    } catch {
                        this.engine.locale = 'en-US';
                    }
                });
        }
    }

    /**
     * @param {string} locale
     */
    async ensureLocale(locale) {
        const modulePath = `@formajs/formajs/i18n/${locale}`;
        try {
            await import(modulePath);
        } catch {
            // ignore
        }
    }

    /**
     * @param {string} locale
     */
    async setLocaleAsync(locale) {
        await this.ensureLocale(locale);
        this.engine.setLocale(locale);
    }

    /**
     * Start a boolean validation chain.
     * @param {object} [options]
     * @param {boolean} [options.strict=false] - If true, only accepts true/false.
     * @returns {BooleanSchema}
     */
    boolean(options = {}) {
        return new BooleanSchema(this.engine, [], options);
    }

    /**
     * Start a date validation chain.
     * @returns {DateSchema}
     */
    date() {
        return new DateSchema(this.engine);
    }

    /**
     * Creates a record schema.
     * @template T
     * @param {BaseSchema<T>} valueSchema
     * @returns {RecordSchema<T>}
     */
    record(valueSchema) {
        return new RecordSchema(this.engine, valueSchema);
    }

    /**
     * Creates a map schema.
     * @template K, V
     * @param {BaseSchema<K>} keySchema
     * @param {BaseSchema<V>} valueSchema
     * @returns {MapSchema<K, V>}
     */
    map(keySchema, valueSchema) {
        return new MapSchema(this.engine, keySchema, valueSchema);
    }

    /**
     * Creates a set schema.
     * @template T
     * @param {BaseSchema<T>} valueSchema
     * @returns {SetSchema<T>}
     */
    set(valueSchema) {
        return new SetSchema(this.engine, valueSchema);
    }

    /**
     * Creates a promise schema.
     * @template T
     * @param {BaseSchema<T>} [valueSchema]
     * @returns {PromiseSchema<T>}
     */
    promise(valueSchema) {
        return new PromiseSchema(this.engine, valueSchema);
    }

    /**
     * Creates a function schema.
     * @returns {FunctionSchema}
     */
    function() {
        return new FunctionSchema(this.engine);
    }

    /**
     * Start a file validation chain.
     * @returns {FileSchema}
     */
    file() {
        return new FileSchema(this.engine);
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
     * @template [Shape=any]
     * @param {Shape} shape - The object shape.
     * @returns {ObjectSchema<Shape>}
     */
    object(shape = /** @type {any} */ ({})) {
        return new ObjectSchema(this.engine, shape);
    }

    /**
     * Start an array validation chain.
     * @param {import('./core/BaseSchema.js').BaseSchema<any>} itemSchema - The schema for each array item.
     * @returns {ArraySchema}
     */
    array(itemSchema) {
        return new ArraySchema(this.engine, itemSchema);
    }

    /**
     * @template {string|number|boolean|null|undefined} T
     * @param {T} value
     * @returns {LiteralSchema<T>}
     */
    literal(value) {
        return new LiteralSchema(this.engine, value);
    }

    /**
     * @template {readonly (string|number)[]} T
     * @param {T} values
     * @returns {EnumSchema<T>}
     */
    enum(values) {
        return new EnumSchema(this.engine, values);
    }

    /**
     * @template {import('./core/BaseSchema.js').BaseSchema<any>[]} T
     * @param {T} schemas
     * @returns {UnionSchema<T>}
     */
    or(...schemas) {
        if (schemas.length === 1 && Array.isArray(schemas[0])) {
            schemas = schemas[0];
        }
        return new UnionSchema(this.engine, schemas);
    }

    /**
     * @template {import('./core/BaseSchema.js').BaseSchema<any>[]} T
     * @param {T} schemas
     * @returns {IntersectionSchema<T>}
     */
    and(...schemas) {
        if (schemas.length === 1 && Array.isArray(schemas[0])) {
            // @ts-ignore
            schemas = schemas[0];
        }
        // @ts-ignore
        return new IntersectionSchema(this.engine, schemas);
    }

    /**
     * @template {import('./core/BaseSchema.js').BaseSchema<any>[]} T
     * @param {T} schemas
     * @returns {TupleSchema<T>}
     */
    tuple(schemas) {
        // @ts-ignore
        return new TupleSchema(this.engine, schemas);
    }

    /**
     * @template {import('./core/BaseSchema.js').BaseSchema<any>} T
     * @param {() => T} builder
     * @returns {LazySchema<T>}
     */
    lazy(builder) {
        return new LazySchema(this.engine, builder);
    }

    /**
     * Coercion helpers.
     */
    get coerce() {
        return {
            /**
             * Coerces value to number before validation.
             * @returns {NumberSchema}
             */
            number: () => {
                return this.number().transform((val) => Number(val));
            },
            /**
             * Coerces value to boolean before validation.
             * "true", "on", "1", 1, true -> true
             * everything else -> false (or maybe stricter?)
             * Let's stick to simple "true"/"on" check for forms.
             * @returns {import('./core/BaseSchema.js').BaseSchema<boolean>}
             */
            boolean: () => {
                return this.boolean();
            },
            /**
             * Coerces value to Date before validation.
             * @returns {DateSchema}
             */
            date: () => {
                return this.date().transform((val) => new Date(val));
            },
            /**
             * Coerces value to String.
             * @returns {StringSchema}
             */
            string: () => {
                return this.string().transform((val) => String(val));
            },
        };
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
