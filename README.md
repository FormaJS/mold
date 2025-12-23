# @formajs/mold

> **Data in Perfect Forma.**

**Mold** is a powerful, chainable schema validation library tailored for the FormaJS ecosystem. It provides a fluent API to define, validate, and coerce data structures with ease.

## Installation

```bash
npm install @formajs/mold
```

## Basic Usage

```javascript
import { f } from '@formajs/mold';

const schema = f.object({
  name: f.string().min(3).required(),
  age: f.number().min(18).optional(),
  email: f.string().email(),
  tags: f.array(f.string()).min(1),
});

const result = await schema.validate({
  name: 'John Doe',
  age: 25,
  email: 'john@example.com',
  tags: ['developer', 'js'],
});

if (result.valid) {
  console.log('Valid data:', result.value);
} else {
  console.error('Validation errors:', result.errors);
}
```

## API Reference

### Primitives

- `f.string()`: Validates strings. Chain with `.min()`, `.max()`, `.email()`, `.url()`, `.uuid()`, etc.
- `f.number()`: Validates numbers. Chain with `.min()`, `.max()`, `.int()`, `.positive()`, etc.
- `f.boolean()`: Validates booleans.
- `f.date()`: Validates Date objects. Chain with `.min(date)`, `.max(date)`.
- `f.file()`: Validates File objects. Chain with `.minSize()`, `.maxSize()`, `.type()`.

### Objects & Records

- `f.object(shape)`: Defines a structured object.
  - `.strip()`: Remove unknown keys (default: passthrough).
  - `.strict()`: Error on unknown keys.
  - `.passthrough()`: Keep unknown keys.
  - `.pick(keys)`: Select specific keys.
  - `.omit(keys)`: Remove specific keys.
  - `.partial()`: Make all fields optional.
  - `.required()`: Make all fields required.
  - `.extend(shape)`: Add fields.
- `f.record(valueSchema)`: Validates an object where all values match strict schema.
- `f.map(keySchema, valueSchema)`: Validates a JavaScript `Map`.

### Arrays & Sets

- `f.array(itemSchema)`: Validates an array of items. Chain with `.min()`, `.max()`.
- `f.set(valueSchema)`: Validates a JavaScript `Set`.
- `f.tuple([schema1, schema2])`: Validates a fixed-length array with specific types.

### Advanced Types

- `f.literal(value)`: Matches an exact value.
- `f.enum(values)`: Matches one of the provided values.
- `f.union([schemaA, schemaB])` or `f.or([A, B])`: Matches any of the schemas.
- `f.intersection(schemas)` or `f.and([A, B])`: Matches all schemas.
- `f.promise(valueSchema)`: Validates a Promise and its resolved value.
- `f.function()`: Validates a function.
- `f.lazy(() => schema)`: For recursive schemas.

### Common Methods

All schemas support:
- `.optional()`: Marks the value as optional (allows `undefined`).
- `.required()`: Marks the value as required.
- `.default(value)`: Sets a default value if `undefined`.
- `.transform(fn)`: Transforms the value.
- `.refine(fn, options)`: Custom validation logic.
- `.catch(value)`: specific fallback value on error.
- `.describe(text)`: Adds metadata description.

### Coercion

Mold provides a `coerce` namespace to automatically convert types before validation:

```javascript
const schema = f.object({
  id: f.coerce.number(), // "123" -> 123
  active: f.coerce.boolean(), // "true" -> true
  created: f.coerce.date(), // ISO string -> Date
});
```
