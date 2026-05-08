# Testing Guidelines – TODO App

This document defines the testing principles and conventions for the TODO application to ensure code quality and reliability.

## General Principles

- All new features must include appropriate tests before merging.
- Tests must be isolated and independent — each test sets up its own data and does not rely on other tests.
- Setup and teardown hooks (`beforeEach`, `afterEach`, `beforeAll`, `afterAll`) are required to ensure tests succeed on multiple consecutive runs.
- Tests should be maintainable, readable, and follow the Arrange-Act-Assert (AAA) pattern.

## Port Configuration

- Always use environment variables with sensible defaults for port configuration.
- **Backend**: `const PORT = process.env.PORT || 3030;`
- **Frontend**: React's default port is `3000`, but can be overridden with the `PORT` environment variable.
- This allows CI/CD workflows to dynamically detect and configure ports without code changes.

---

## Unit Tests

**Framework**: [Jest](https://jestjs.io/)

Unit tests verify individual functions and React components in isolation.

### Conventions

| Rule | Detail |
|------|--------|
| File naming | `*.test.js` or `*.test.ts` |
| Backend location | `packages/backend/__tests__/` |
| Frontend location | `packages/frontend/src/__tests__/` |
| File matching | Name each test file after what it tests (e.g., `app.test.js` tests `app.js`) |

### Guidelines

- Mock all external dependencies (databases, APIs, file system).
- Each test function should assert a single behaviour.
- Aim for >80% statement coverage on business-logic modules.

---

## Integration Tests

**Framework**: [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest)

Integration tests verify backend API endpoints using real HTTP requests against a running Express app.

### Conventions

| Rule | Detail |
|------|--------|
| File naming | `*.test.js` or `*.test.ts` |
| Location | `packages/backend/__tests__/integration/` |
| File naming strategy | Name files based on what they test (e.g., `todos-api.test.js` for TODO API endpoints) |

### Guidelines

- Use an in-memory or test database; never run integration tests against the production database.
- Each test suite should start with a clean data state via `beforeEach`/`afterEach` hooks.
- Assert both the HTTP status code and the response body shape.

---

## End-to-End (E2E) Tests

**Framework**: [Playwright](https://playwright.dev/) *(required — no other E2E framework)*

E2E tests validate complete UI workflows through browser automation.

### Conventions

| Rule | Detail |
|------|--------|
| File naming | `*.spec.js` or `*.spec.ts` |
| Location | `tests/e2e/` |
| File naming strategy | Name files after the user journey (e.g., `todo-workflow.spec.js`) |

### Guidelines

- **One browser only**: configure a single browser in `playwright.config.ts` (e.g., Chromium).
- **Page Object Model (POM)**: all page interactions must be encapsulated in POM classes stored in `tests/e2e/pages/`.
- **Scope**: limit E2E tests to **5–8 critical user journeys**; focus on happy paths and key edge cases — not exhaustive coverage.
- Use Playwright's `beforeEach` to navigate to a known state before every test.
- Avoid hardcoded waits (`page.waitForTimeout`); use Playwright's built-in auto-waiting and `expect` assertions instead.

### Example critical journeys to cover

1. User creates a new task
2. User edits an existing task
3. User marks a task as complete
4. User deletes a task
5. User filters tasks by status
6. User adds a due date to a task

---

## Summary Matrix

| Type | Framework | Location | Naming |
|------|-----------|----------|--------|
| Unit (backend) | Jest | `packages/backend/__tests__/` | `*.test.js` |
| Unit (frontend) | Jest | `packages/frontend/src/__tests__/` | `*.test.js` |
| Integration | Jest + Supertest | `packages/backend/__tests__/integration/` | `*.test.js` |
| E2E | Playwright | `tests/e2e/` | `*.spec.js` |
