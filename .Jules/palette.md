## 2025-05-22 - Accessibility Enhancements in Form Controls and Navigation

**Learning:** Interactive elements such as form inputs and dropdown menus often lack explicit accessibility attributes in fast-paced development. Explicitly linking `<label>` elements to inputs using `id` and `htmlFor`, and providing ARIA roles and labels for complex components like language selectors and mobile menus, significantly improves the experience for screen reader users and ensures compliance with accessibility standards.

**Action:** Always verify that every form input has a corresponding label with matching `id`/`htmlFor`. For custom interactive components (dropdowns, modals, toggles), implement appropriate ARIA roles (`listbox`, `option`, `menu`) and states (`aria-expanded`, `aria-selected`, `aria-haspopup`) by default.
