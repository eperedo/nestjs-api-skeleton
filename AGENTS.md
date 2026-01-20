# Coding Conventions

## Functional Programming Rules

- Avoid mutating variables after initialization.
- Do not reassign variables.
- Prefer expressions over statements when practical.
- Keep validation logic pure and deterministic.
- Return collections of validation errors rather than the first error.
- Use arrays and spreads instead of push/splice.
- Avoid side effects inside validation helpers.
