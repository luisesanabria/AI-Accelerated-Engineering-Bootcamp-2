# UI Guidelines – TODO App

This document defines the UI guidelines for the TODO application to ensure a consistent, accessible, and user-friendly interface.

## Component Library

- **UG-01**: Use [Material UI (MUI)](https://mui.com/) components as the primary component library.
- **UG-02**: Do not mix component libraries; all interactive elements must use MUI components.

## Color Palette

| Role        | Color Token          | Hex       |
|-------------|----------------------|-----------|
| Primary     | `primary.main`       | `#1976D2` |
| Secondary   | `secondary.main`     | `#9C27B0` |
| Background  | `background.default` | `#F5F5F5` |
| Surface     | `background.paper`   | `#FFFFFF` |
| Error       | `error.main`         | `#D32F2F` |
| Success     | `success.main`       | `#388E3C` |
| Text (main) | `text.primary`       | `#212121` |

- **UG-03**: Always use the defined color tokens; avoid hardcoded hex values in component styles.
- **UG-04**: Overdue tasks must be highlighted using `error.light` as background.
- **UG-05**: Completed tasks must render task title with a strikethrough and muted `text.disabled` color.

## Typography

- **UG-06**: Use the MUI default `Roboto` font family throughout the app.
- **UG-07**: Page title: `h5` variant. Section labels: `subtitle1`. Task title: `body1`. Metadata (due date, priority): `caption`.

## Layout

- **UG-08**: The app must be responsive and usable on screens from 320 px (mobile) to 1440 px (desktop).
- **UG-09**: Use MUI `Container` with `maxWidth="md"` as the main content wrapper.
- **UG-10**: Use MUI `Stack` or `Grid` for all layout composition; avoid raw CSS flex/grid where MUI equivalents exist.

## Buttons & Actions

- **UG-11**: Primary actions (e.g., "Add Task", "Save") use `variant="contained"` with `color="primary"`.
- **UG-12**: Secondary / cancel actions use `variant="outlined"` with `color="secondary"`.
- **UG-13**: Destructive actions (e.g., "Delete") use `variant="outlined"` with `color="error"`.
- **UG-14**: Icon-only buttons must include an `aria-label` for screen readers.

## Forms & Inputs

- **UG-15**: All form fields use MUI `TextField` with `variant="outlined"`.
- **UG-16**: Required fields must show a `*` indicator and an inline error message on blur when left empty.
- **UG-17**: Date inputs use the MUI `DatePicker` from `@mui/x-date-pickers`.

## Feedback & States

- **UG-18**: Success notifications (task created, updated, deleted) use MUI `Snackbar` + `Alert` with `severity="success"`.
- **UG-19**: Error notifications use MUI `Snackbar` + `Alert` with `severity="error"`.
- **UG-20**: Loading states display a MUI `CircularProgress` centered in the content area.
- **UG-21**: Empty states display a centered illustration or icon with a short descriptive message.

## Accessibility

- **UG-22**: All interactive elements must be keyboard-navigable and have visible focus indicators.
- **UG-23**: Color alone must not convey meaning; always pair color with an icon or text label.
- **UG-24**: Minimum touch target size is 44 × 44 px for mobile.
- **UG-25**: The app must achieve a WCAG 2.1 AA contrast ratio for all text and interactive elements.

## Icons

- **UG-26**: Use [Material Icons](https://mui.com/material-ui/material-icons/) (`@mui/icons-material`) exclusively.
- **UG-27**: Decorative icons must have `aria-hidden="true"`.
