# Palette's Journal - Critical UX/Accessibility Learnings

## 2025-05-15 - [Navigation Accessibility and Discoverability]
**Learning:** Core utility components like `ThemeToggle` are often overlooked if not integrated into the primary navigation. Adding ARIA attributes (`aria-current`, `aria-expanded`) to navigation elements significantly improves screen reader clarity.
**Action:** Always check if available utility components (Theme, Language, etc.) are actually visible in the `Header` or `Footer`. Ensure all mobile toggle buttons have dynamic `aria-expanded` and `aria-label` states.

## 2025-05-15 - [Mobile Tactile Feedback]
**Learning:** Haptic feedback on mobile devices provides immediate physical confirmation for interactive elements like theme toggles and menu buttons, making the interface feel more responsive.
**Action:** Use the `hapticTap` utility for primary mobile interactions to add a layer of "delight" and confirmation.
