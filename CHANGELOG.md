# @formajs/mold

## 2.1.0

### Major Features & Schemas

- **New Primitives**:
    - `f.boolean()`: Strict boolean validation.
    - `f.date()`: Date validation with `.min()`/`.max()`.
    - `f.file()`: File object validation with `minSize`, `maxSize`, `type`.
- **Complex Structures**:
    - `f.record(valueSchema)`: Objects with uniform value types.
    - `f.map(keySchema, valueSchema)`: JavaScript Map validation.
    - `f.set(valueSchema)`: JavaScript Set validation.
    - `f.tuple([...schemas])`: Fixed-length arrays.
- **Advanced Types**:
    - `f.union([...schemas])` / `f.or()`: Matches any schema.
    - `f.intersection([...schemas])` / `f.and()`: Matches all schemas.
    - `f.literal(value)`: Exact value matching.
    - `f.enum([...values])`: Value list matching.
    - `f.lazy(() => schema)`: Recursive schemas.
    - `f.promise(valueSchema)`: Promise validation.
    - `f.function()`: Function validation.

### Enhancements

- **ObjectSchema**:
    - `.pick(keys)`, `.omit(keys)`: Shape manipulation.
    - `.partial()`, `.required()`: Bulk optional/required modifiers.
    - `.extend(shape)`: Merge schemas.
    - Unknown key modes: `.strip()`, `.strict()`, `.passthrough()`.
- **BaseSchema**:
    - `.optional()` / `.required()`: Toggle optionality.
    - `.default(value)`: Default values.
    - `.catch(value)`: Fallback on error.
    - `.transform(fn)` / `.refine(fn)`: Custom pipelines.
    - `.describe(text)`: Metadata.
- **Coercion**:
    - `f.coerce.string()`, `.number()`, `.boolean()`, `.date()`: Auto-conversion utilities.
- **Utilities**:
    - `toJSONSchema()`: Export schemas to standard JSON Schema format.
    - `f.ensureLocale()` / `f.setLocaleAsync()`: Better async i18n loading.

## 1.0.0

### Initial Release

- Core schema orchestration over FormaJS.
- `string`, `number`, `object`, `array` schemas.
- Basic validation layout.
