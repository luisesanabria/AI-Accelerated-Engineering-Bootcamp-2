# Coding Guidelines – TODO App

This document describes the coding style, conventions, and quality principles for the TODO application. All contributors are expected to follow these guidelines to ensure a consistent, maintainable, and high-quality codebase.

## General Formatting

Consistency in formatting reduces cognitive overhead and makes code reviews faster. The project enforces the following rules:

- **Indentation**: 2 spaces — no tabs.
- **Line length**: max 100 characters per line.
- **Semicolons**: always required at the end of statements (JavaScript/TypeScript).
- **Quotes**: single quotes for strings in JavaScript/TypeScript; double quotes in JSX attribute values.
- **Trailing commas**: required in multi-line arrays, objects, and function parameters (`"trailingComma": "all"` in Prettier).
- **Blank lines**: one blank line between logical blocks; no consecutive blank lines.
- **End of file**: every file must end with a single newline character.

All formatting rules are enforced automatically — see the **Linting & Formatting** section below.

## Naming Conventions

Clear, descriptive names communicate intent without requiring comments.

- **Variables and functions**: `camelCase` (e.g., `taskList`, `fetchTasks`).
- **React components**: `PascalCase` (e.g., `TaskCard`, `DueDatePicker`).
- **Constants**: `UPPER_SNAKE_CASE` for true compile-time constants (e.g., `MAX_TASK_TITLE_LENGTH`).
- **Files**: match the primary export — `PascalCase` for component files (`TaskCard.tsx`), `camelCase` for utility/service files (`taskService.ts`).
- **Test files**: match the file under test with a `.test.js` / `.test.ts` suffix (e.g., `taskService.test.ts`).
- **Boolean variables**: prefix with `is`, `has`, or `can` (e.g., `isCompleted`, `hasError`).

## Import Organization

Imports must be grouped and ordered to keep the top of every file scannable:

1. **Node built-ins** (e.g., `path`, `fs`)
2. **Third-party packages** (e.g., `react`, `express`, `@mui/material`)
3. **Internal aliases / absolute paths** (e.g., `@/services/taskService`)
4. **Relative imports** (e.g., `./TaskCard`, `../utils/formatDate`)

Leave one blank line between each group. Use named imports over default imports where the module supports it.

## Code Quality Principles

### DRY (Don't Repeat Yourself)

Duplicated logic is a maintenance liability. Before adding new code, check whether an existing utility, hook, or helper already covers the need. Extract shared logic into dedicated modules under `src/utils/` (frontend) or `src/helpers/` (backend).

### Single Responsibility

Every function, component, and module should do one thing well. If a function needs a comment to explain what its second purpose is, it should be split into two functions.

### Small Functions

Keep functions short and focused — aim for fewer than 30 lines. Deeply nested logic (more than 3 levels) should be extracted into named helper functions.

### Immutability

Prefer immutable data patterns. Use `const` by default; only use `let` when reassignment is genuinely required. Never mutate function arguments or component props.

### Error Handling

All async operations must handle errors explicitly — either via `try/catch` or by propagating a typed error to the caller. Never silently swallow errors; at minimum log them.

### Magic Numbers & Strings

Replace hardcoded literals with named constants or configuration values. For example, use `MAX_TASK_TITLE_LENGTH = 200` instead of the bare number `200`.

## TypeScript

- Enable `strict` mode in `tsconfig.json` for all packages.
- Avoid `any`; use `unknown` when the type is genuinely unknown and narrow it explicitly.
- Define shared types and interfaces in a dedicated `types/` directory; do not co-locate type definitions inside component files unless they are component-specific.
- Prefer `interface` for object shapes and `type` for unions, intersections, and mapped types.

## React-Specific Guidelines

- Prefer **functional components** with hooks over class components.
- Extract business logic out of components into custom hooks (`use*.ts` files under `src/hooks/`).
- Avoid inline object/array literals in JSX props to prevent unnecessary re-renders; define them outside the render or memoize with `useMemo`/`useCallback`.
- Use **React.FC** sparingly — prefer explicit prop type annotations for clarity.

## Linting & Formatting

The project uses the following tools, configured at the repository root:

| Tool | Purpose | Config file |
|------|---------|-------------|
| **ESLint** | JavaScript/TypeScript linting | `.eslintrc.js` |
| **Prettier** | Code formatting | `.prettierrc` |

Run checks locally before committing:

```bash
# Lint
npm run lint

# Format check
npm run format:check

# Auto-fix formatting
npm run format
```

A pre-commit hook (via **Husky** + **lint-staged**) automatically runs ESLint and Prettier on staged files. Commits that introduce lint errors will be rejected.

CI pipelines also run `npm run lint` and `npm run format:check` on every pull request; failing checks block merging.

## Comments & Documentation

- Write **self-documenting code** first; add comments only when the *why* is not obvious from the code itself.
- Use **JSDoc** (`/** */`) for all exported functions, hooks, and components.
- Remove commented-out code before opening a pull request — use version control history instead.

## Git & Pull Requests

- Keep commits small and focused; each commit should represent a single logical change.
- Write commit messages in the imperative mood (e.g., `Add due date field to TaskForm`).
- Every pull request must reference the related issue and include a brief description of what changed and why.
- A pull request should not be merged without at least one approving review and all CI checks passing.
