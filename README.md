# @formajs/mold

> **Data in Perfect Forma.**

A schema validation library built on top of [FormaJS](https://github.com/FormaJS/forma). Define, sanitize, and validate data structures with an intuitive, chainable interface inspired by Zod and Yup.

## Key Features

- **Built on FormaJS**: Leverages FormaJS validators and sanitizers "as is"
- **Type-safe schemas**: Define complex data structures with type validation
- **Chainable API**: Fluent, readable validation chains
- **i18n support**: Inherits FormaJS internationalization
- **Zero reimplementation**: Pure orchestration layer over FormaJS

## Installation

```bash
npm install @formajs/mold
# or
pnpm add @formajs/mold
# or
yarn add @formajs/mold
```

## Quick Start

```javascript
import { forma } from '@formajs/mold';

// Define a user schema
const userSchema = forma.object({
    name: forma.string().trim().validateNotEmpty().validateLength({ min: 2, max: 50 }),
    email: forma.string().trim().normalizeEmail().validateEmail(),
    age: forma.number().validateInt().validatePositive().min(18).max(120),
    tags: forma.array(forma.string().trim().validateNotEmpty()).minLength(1),
});

// Validate data
const user = {
    name: '  João Silva  ',
    email: '  JOAO@EXAMPLE.COM  ',
    age: 25,
    tags: ['developer', 'javascript'],
};

const result = await userSchema.validate(user);

if (result.valid) {
    console.log('Valid user:', result.value);
    // Sanitized output:
    // { name: 'João Silva', email: 'joao@example.com', age: 25, tags: [...] }
} else {
    console.error('Validation errors:', result.errors);
}
```

## Architecture

**@formajs/mold** is a pure orchestration layer. It does NOT reimplement validation logic. Instead, it:

1. Uses FormaJS validators, sanitizers, and formatters directly
2. Organizes them into chainable schema builders
3. Manages validation pipelines for complex data structures
4. Preserves all FormaJS i18n and configuration

### Design Principles

- **Use FormaJS "as is"**: All validation logic comes from FormaJS
- **Zero duplication**: No reimplemented validators
- **Pure orchestration**: Only manages schema structure and pipeline execution
- **Fluent API**: Chainable methods for readable schema definitions

## API Reference

### Schema Types

#### `forma.string()`

Creates a string schema with FormaJS validators and sanitizers.

**Sanitizers:**

- `.trim()` - Remove leading/trailing whitespace
- `.lTrim()` - Remove leading whitespace
- `.rTrim()` - Remove trailing whitespace
- `.toSlug()` - Convert to URL-friendly slug
- `.stripTags()` - Remove HTML tags
- `.escapeHTML()` - Escape HTML entities
- `.unescapeHTML()` - Unescape HTML entities
- `.normalizeEmail()` - Normalize email format
- `.blacklist({ chars })` - Remove specified characters
- `.whitelist({ chars })` - Keep only specified characters

**Validators:**

- `.validateAlpha()` - Alphabetic characters only
- `.validateAlphanumeric()` - Alphanumeric characters only
- `.validateEmail()` - Valid email format
- `.validateURL()` - Valid URL format
- `.validateUUID()` - Valid UUID format
- `.validateLength({ min, max })` - String length constraints
- `.validateNotEmpty()` - Non-empty string
- `.validateSlug()` - Valid URL slug
- `.validateStrongPassword()` - Strong password requirements
- And [50+ more FormaJS validators](https://github.com/FormaJS/forma/blob/main/packages/forma/docs/validators.md)

#### `forma.number()`

Creates a number schema with inline validators (FormaJS validators are for string-based numbers).

**Validators:**

- `.validateInt()` - Must be integer
- `.validateFloat()` - Must be float
- `.validatePositive()` - Must be positive
- `.validateNegative()` - Must be negative
- `.validateDivisibleBy({ divisor })` - Divisible by value
- `.validateDecimal()` - Must be decimal
- `.validateNumeric()` - Must be number
- `.validateNotEmpty()` - Not null/undefined
- `.validateIsIn({ values })` - In whitelist
- `.validateIsWhitelisted({ values })` - In whitelist
- `.validateIsBlacklisted({ values })` - Not in blacklist
- `.min(value)` - Minimum value
- `.max(value)` - Maximum value

#### `forma.object(shape)`

Creates an object schema with nested schemas.

```javascript
const schema = forma.object({
    name: forma.string().validateNotEmpty(),
    contact: forma.object({
        email: forma.string().validateEmail(),
        phone: forma.string().validateLength({ min: 10 }),
    }),
});
```

#### `forma.array(itemSchema)`

Creates an array schema with item validation.

**Validators:**

- `.minLength(value)` - Minimum array length
- `.maxLength(value)` - Maximum array length
- `.validateNotEmpty()` - Non-empty array

```javascript
const schema = forma.array(forma.string().validateEmail()).minLength(1).maxLength(10);
```

### Validation Result

```javascript
{
    valid: boolean,          // true if valid
    value: any,              // Sanitized/transformed value
    errors: Array | Object | null  // Validation errors
}
```

**Error structures:**

- **String/Number**: `[{ rule, message, context }, ...]`
- **Object**: `{ field1: [...], field2: [...] }`
- **Array**: `[...errors, { items: [item0Errors, item1Errors] }]`

## Internationalization

Mold inherits FormaJS i18n configuration. Set locale globally:

```javascript
import { forma } from '@formajs/mold';
import '@formajs/formajs/i18n/pt-BR'; // Load Brazilian Portuguese

forma.setLocale('pt-BR');

const schema = forma.string().validateEmail();
const result = await schema.validate('invalid');
// result.errors[0].message: "Email inválido" (Portuguese)
```

## Examples

### User Registration Form

```javascript
const registrationSchema = forma.object({
    username: forma.string().trim().toSlug().validateLength({ min: 3, max: 20 }),
    email: forma.string().trim().normalizeEmail().validateEmail(),
    password: forma.string().validateStrongPassword(),
    age: forma.number().validateInt().min(18).max(120),
});
```

### Blog Post Schema

```javascript
const postSchema = forma.object({
    title: forma.string().trim().validateNotEmpty().validateLength({ min: 10, max: 200 }),
    slug: forma.string().trim().validateSlug(),
    content: forma.string().trim().stripTags().validateLength({ min: 100 }),
    tags: forma
        .array(forma.string().trim().validateLength({ min: 2, max: 30 }))
        .minLength(1)
        .maxLength(10),
    author: forma.object({
        name: forma.string().validateNotEmpty(),
        email: forma.string().validateEmail(),
    }),
});
```

### API Request Validation

```javascript
const apiRequestSchema = forma.object({
    apiKey: forma.string().validateUUID({ version: 4 }),
    endpoint: forma.string().validateURL(),
    method: forma.string().validateIsIn({ values: ['GET', 'POST', 'PUT', 'DELETE'] }),
    payload: forma.object({
        userId: forma.number().validateInt().validatePositive(),
        data: forma.object({}), // Any object
    }),
});
```

## License

MIT © FormaJS

## Integração com FormaJS

O FormaSchema é o consumidor principal dos validadores standalone do FormaJS, orquestrando a execução e coleta de erros usando as mensagens i18n do Forma.
