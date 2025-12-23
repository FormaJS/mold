/**
 * Formats a template string (e.g. "Value is {min}") with data.
 * @param {string} template - The message template (e.g. "Value is {min}")
 * @param {object} context - The data object (e.g. { min: 5 })
 * @returns {string} The formatted string
 */
function formatMessageLocal(template, context = {}) {
    if (!template) return 'Validation error.';

    return template.replace(/{(\w+)}/g, (match, key) => {
        return Object.prototype.hasOwnProperty.call(context, key) ? context[key] : match;
    });
}

/**
 * @template OutputType
 */
export class BaseSchema {
    /**
     * Phantom property for type inference
     * @protected
     * @type {OutputType}
     */
    _outputType;
    _isOptional = false;
    _defaultValue = undefined;
    _description = undefined;
    _catchValue = undefined;
    _hasCatch = false;

    constructor(engine, chain = []) {
        this.engine = engine;
        this.chain = chain;
    }

    /**
     * Transform the value.
     * @template NewType
     * @param {(value: any) => NewType} fn
     * @returns {BaseSchema<NewType>}
     */
    transform(fn) {
        // Transformations are treated as sanitizers in the current architecture (run first)
        return this._addToChain({
            type: 'sanitizer',
            methodName: (val) => fn(val),
            options: {},
        });
    }

    /**
     * Marks the schema as optional.
     */
    optional() {
        // Clone the schema to avoid mutating the original
        const schema = this._clone();
        schema._isOptional = true;
        return schema;
    }

    /**
     * Marks the schema as required (reverses optional).
     */
    required() {
        const schema = this._clone();
        schema._isOptional = false;
        return schema;
    }

    /**
     * Sets a default value.
     * @param {any} value
     * @returns {this}
     */
    default(value) {
        const schema = this._addToChain({
            type: 'meta',
            name: 'default',
        });
        schema._defaultValue = value;
        return schema;
    }

    /**
     * Catch error and return fallback value.
     * @param {any} value
     * @returns {this}
     */
    catch(value) {
        const schema = this._addToChain({
            type: 'meta',
            name: 'catch',
        });
        schema._catchValue = value;
        schema._hasCatch = true;
        return schema;
    }

    /**
     * Sets a description.
     * @param {string} text
     * @returns {this}
     */
    describe(text) {
        const schema = this._addToChain({
            type: 'meta',
            name: 'describe',
        });
        schema._description = text;
        return schema;
    }

    /**
     * Custom validation refinement.
     * @param {(value: any) => boolean | Promise<boolean>} fn
     * @param {object} [options]
     * @param {string} [options.message]
     */
    refine(fn, options = {}) {
        return this._addToChain({
            type: 'validator',
            methodName: async (val) => {
                const valid = await fn(val);
                return {
                    valid,
                    error: 'refine',
                    message: options.message || 'Invalid value',
                    context: { value: val },
                };
            },
            options,
        });
    }

    /**
     * Adiciona um passo à cadeia (imutável).
     */
    _addToChain(step) {
        const newChain = [...this.chain];
        newChain.push(step);
        // Retorna uma *nova* instância do schema
        // Preserva metadados
        const schema = new this.constructor(this.engine, newChain);
        schema._isOptional = this._isOptional;
        schema._defaultValue = this._defaultValue;
        schema._description = this._description;
        schema._catchValue = this._catchValue;
        schema._hasCatch = this._hasCatch;
        return schema;
    }

    _clone() {
        const schema = new this.constructor(this.engine, [...this.chain]);
        schema._isOptional = this._isOptional;
        schema._defaultValue = this._defaultValue;
        schema._description = this._description;
        schema._catchValue = this._catchValue;
        schema._hasCatch = this._hasCatch;
        return schema;
    }

    /**
     * Formata uma mensagem de erro usando o motor i18n do Forma.
     */
    _formatError(result) {
        // Se já tem mensagem, usa ela
        if (result.message) {
            return {
                rule: result.error,
                message: result.message,
                context: result.context || null,
            };
        }

        // Tenta obter mensagem da configuração do Forma
        // Forma armazena mensagens em this.config.messages[key] ou this.config[key]
        let messageTemplate = null;
        if (this.engine.config) {
            if (this.engine.config.messages && this.engine.config.messages[result.error]) {
                messageTemplate = this.engine.config.messages[result.error];
            } else if (this.engine.config[result.error]) {
                messageTemplate = this.engine.config[result.error];
            }
        }

        const message = formatMessageLocal(
            messageTemplate || result.error, // Fallback to error key if no message found
            result.context
        );

        return {
            rule: result.error,
            message: message,
            context: result.context || null,
        };
    }

    /**
     * Executa os pipelines de validação.
     */
    async validate(value) {
        try {
            if (value === undefined) {
                if (this._defaultValue !== undefined) {
                    return { valid: true, value: this._defaultValue };
                }
                if (this._isOptional) {
                    return { valid: true, value: undefined };
                }
            }

            let currentValue = value;
            const errors = [];

            // Executa sanitizadores e formatters primeiro
            for (const rule of this.chain) {
                if (rule.type === 'sanitizer' || rule.type === 'formatter') {
                    currentValue = await rule.methodName.call(this.engine, currentValue, rule.options);
                }
            }

            // Executa validators
            for (const rule of this.chain) {
                if (rule.type === 'validator') {
                    let result;
                    if (typeof rule.methodName === 'function') {
                        result = await rule.methodName(currentValue, rule.options);
                    } else {
                        result = await rule.methodName.call(this.engine, currentValue, rule.options);
                    }

                    if (result && !result.valid) {
                        errors.push(this._formatError(result));
                    } else if (result && result.valid && 'value' in result) {
                        currentValue = result.value;
                    }
                }
            }

            if (errors.length > 0) {
                if (this._hasCatch) {
                    return { valid: true, value: this._catchValue };
                }
                return {
                    valid: false,
                    errors: errors,
                    value: currentValue,
                };
            }

            return {
                valid: true,
                value: currentValue,
            };
        } catch (err) {
            if (this._hasCatch) {
                return { valid: true, value: this._catchValue };
            }
            throw err;
        }
    }
}
