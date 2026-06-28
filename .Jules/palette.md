## 2025-05-15 - Header Accessibility & Delight
**Learning:** Icon-only buttons (like mobile menu toggles) require explicit ARIA labels for screen readers. Standard focus rings are often invisible on dark/complex backgrounds; using `focus-visible:ring-indigo-500` ensures clear keyboard navigation without affecting mouse users.
**Action:** Always audit headers for `focus-visible` rings and add ARIA labels to all interactive icon elements.
