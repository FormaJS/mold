import { BaseSchema } from './BaseSchema.js';

/**
 * @extends {BaseSchema<File>}
 */
export class FileSchema extends BaseSchema {
    constructor(engine, chain = []) {
        super(engine, chain);
        // Default type validation
        if (chain.length === 0) {
            this.chain.push({
                type: 'validator',
                methodName: (value) => {
                    // Check if File is defined (browser or Node 20+)
                    if (typeof File !== 'undefined' && value instanceof File) {
                        return { valid: true };
                    }
                    // Fallback for environments where File is not defined or simple object check
                    // But typically we want strict instance check if valid.
                    // If value looks like a file (has name, size, type)?
                    // Let's stick to instanceof File as safe default for now,
                    // assuming the environment supports it (Mold/Bind usage).

                    return {
                        valid: false,
                        error: 'type',
                        message: 'Value must be a File',
                    };
                },
                options: {},
            });
        }
    }

    /**
     * @param {number} bytes
     * @param {string} [message]
     */
    minSize(bytes, message) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => {
                if (value.size < bytes) {
                    return {
                        valid: false,
                        error: 'minSize',
                        message: message || `File size must be at least ${bytes} bytes`,
                        context: { min: bytes, size: value.size },
                    };
                }
                return { valid: true };
            },
            options: { min: bytes },
        });
    }

    /**
     * @param {number} bytes
     * @param {string} [message]
     */
    maxSize(bytes, message) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => {
                if (value.size > bytes) {
                    return {
                        valid: false,
                        error: 'maxSize',
                        message: message || `File size must be at most ${bytes} bytes`,
                        context: { max: bytes, size: value.size },
                    };
                }
                return { valid: true };
            },
            options: { max: bytes },
        });
    }

    /**
     * @param {string|RegExp} mimeType
     * @param {string} [message]
     */
    type(mimeType, message) {
        return this._addToChain({
            type: 'validator',
            methodName: (value) => {
                let valid = false;
                if (mimeType instanceof RegExp) {
                    valid = mimeType.test(value.type);
                } else if (mimeType.endsWith('*')) {
                    // image/* -> startsWith('image/')
                    const prefix = mimeType.slice(0, -1);
                    valid = value.type.startsWith(prefix);
                } else {
                    valid = value.type === mimeType;
                }

                if (!valid) {
                    return {
                        valid: false,
                        error: 'fileType',
                        message: message || `File type must match ${mimeType}`,
                        context: { type: value.type, expected: mimeType },
                    };
                }
                return { valid: true };
            },
            options: { mimeType },
        });
    }

    /**
     * @returns {object}
     */
    toJSONSchema() {
        return {
            type: 'string',
            contentMediaType: 'application/octet-stream', // validation could refine this
        };
    }
}
