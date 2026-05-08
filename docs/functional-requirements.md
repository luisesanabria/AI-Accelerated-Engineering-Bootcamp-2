# Functional Requirements – TODO App

This document defines the core functional requirements for the TODO application.

## Task Management

- **FR-01**: A user can create a new task with a title and optional description.
- **FR-02**: A user can edit the title and description of an existing task.
- **FR-03**: A user can delete a task.
- **FR-04**: A user can mark a task as complete or incomplete.

## Due Dates

- **FR-05**: A user can add a due date to a task.
- **FR-06**: A user can edit or remove the due date of a task.
- **FR-07**: Overdue tasks (past due date and not completed) are visually highlighted.

## Task Organization

- **FR-08**: Tasks are sorted by due date (earliest first) by default.
- **FR-09**: A user can filter tasks by status: All, Active, or Completed.
- **FR-10**: A user can search tasks by title keyword.

## Priorities

- **FR-11**: A user can assign a priority level to a task: Low, Medium, or High.
- **FR-12**: Tasks can be sorted by priority.

## Persistence

- **FR-13**: All tasks persist across page reloads (stored in local storage or a backend).

## User Feedback

- **FR-14**: The app displays a confirmation message when a task is created, updated, or deleted.
- **FR-15**: The app displays an empty state message when no tasks exist or match the current filter.
