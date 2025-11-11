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

export class BaseSchema {
    constructor(engine, chain = []) {
        this.engine = engine;
        this.chain = chain;
    }

    /**
     * Adiciona um passo à cadeia (imutável).
     */
    _addToChain(step) {
        const newChain = [...this.chain];
        newChain.push(step);
        // Retorna uma *nova* instância do schema
        return new this.constructor(this.engine, newChain);
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

        // Busca template de mensagem no config do Forma
        const messageTemplate = this.engine.config.messages?.[result.error];
        const message = formatMessageLocal(messageTemplate, result.context);

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
        let currentValue = value;
        const errors = [];

        // Executa sanitizadores e formatters primeiro
        for (const rule of this.chain) {
            if (rule.type === 'sanitizer' || rule.type === 'formatter') {
                currentValue = await rule.methodName.call(this.engine, currentValue, rule.options);
            }
        }

        // Executa validadores
        for (const rule of this.chain) {
            if (rule.type === 'validator') {
                let result;

                // Se for função inline, executa diretamente
                if (typeof rule.methodName === 'function') {
                    result = await rule.methodName(currentValue, rule.options);
                } else {
                    // Se for método do Forma, chama via call
                    result = await rule.methodName.call(this.engine, currentValue, rule.options);
                }

                if (result && !result.valid) {
                    errors.push(this._formatError(result));
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : null,
            value: currentValue,
        };
    }
}
