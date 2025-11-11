# @formajs/mold

## 1.0.0

### Initial Release

A schema validation library built as a pure orchestration layer over FormaJS.

#### Architecture

- **Uses FormaJS as validator**: All validation, sanitization, and formatting logic comes directly from FormaJS
- **Pure orchestration**: Mold only manages schema structure and pipeline execution
- **Zero reimplementation**: No duplicated validation logic
- **Fluent API**: Chainable schema builders for readable data structure definitions

#### Features

- **String Schema**: Full access to 50+ FormaJS validators and 10+ sanitizers
- **Number Schema**: Type-safe number validation with inline validators
- **Object Schema**: Nested object structures with field-level validation
- **Array Schema**: Item-level validation with length constraints
- **i18n Support**: Inherits FormaJS internationalization system
- **Error Reporting**: Detailed, structured error messages with context

#### API

- `forma.string()` - String schema with FormaJS validators/sanitizers
- `forma.number()` - Number schema with inline validators
- `forma.object(shape)` - Object schema with nested schemas
- `forma.array(itemSchema)` - Array schema with item validation
- `forma.setLocale(locale)` - Configure i18n locale

#### Dependencies

- `@formajs/formajs@^1.1.1` - Core validation engine
