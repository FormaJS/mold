import formaInstance from '@formajs/formajs';
import { StringSchema } from './core/StringSchema.js';
import { NumberSchema } from './core/NumberSchema.js';
import { ObjectSchema } from './core/ObjectSchema.js';
import { ArraySchema } from './core/ArraySchema.js';

// Extrai a classe Forma da instância default do FormaJS
const Forma = formaInstance.constructor;

class FormaSchemaFactory {
    constructor(locale = 'en-US') {
        this.engine = new Forma(locale);
    }

    setLocale(locale) {
        this.engine.setLocale(locale);
    }

    /**
     * Inicia uma cadeia de validação de String.
     * @returns {StringSchema}
     */
    string() {
        return new StringSchema(this.engine);
    }

    /**
     * Inicia uma cadeia de validação de Number.
     * @returns {NumberSchema}
     */
    number() {
        return new NumberSchema(this.engine);
    }

    /**
     * Inicia uma cadeia de validação de Object.
     * @param {object} shape - A forma do objeto.
     * @returns {ObjectSchema}
     */
    object(shape = {}) {
        return new ObjectSchema(this.engine, shape);
    }

    /**
     * Inicia uma cadeia de validação de Array.
     * @param {BaseSchema} itemSchema - O schema para cada item do array.
     * @returns {ArraySchema}
     */
    array(itemSchema) {
        return new ArraySchema(this.engine, itemSchema);
    }
}

export const f = new FormaSchemaFactory();
export const forma = f;
export default f;
