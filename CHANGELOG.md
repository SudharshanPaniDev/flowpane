# Changelog

All notable changes to this project are documented here. This project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 (unreleased)

First release.

- **Fixes before release:** DataTable keeps empty values last when sorting in either direction; Tabs stay keyboard-reachable when no tab is selected; Checkbox renders and links its description when it has no visible label.
- Tests run on React 19 and React 18 in CI.
- **Workflow components:** DataTable (sorting, search, row selection, pagination, toolbar for bulk actions, empty and no-results states), Stepper, StatusBadge, EmptyState.
- **Building blocks:** Button, TextField, Select, Checkbox, Dialog (modal and alert dialog), Tabs, Toast.
- Theming with `--fp-*` CSS custom properties; light and dark themes with WCAG AA contrast.
- ESM and CommonJS builds with TypeScript declarations; `"use client"` for Next.js App Router.
- Storybook documentation with an "Orders admin" example.
