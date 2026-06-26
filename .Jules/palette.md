# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-05-14 - Accessible Language Switching with Haptic Feedback
**Learning:** Internationalization infrastructure (like LanguageContext) often exists in codebases without a corresponding UI trigger. Providing a toggle that uses both visual cues (icons/text) and physical cues (haptic feedback) significantly improves the perceived quality and accessibility of language switching. Using Framer Motion for state transitions makes the language change feel like a smooth app-wide update rather than a jarring refresh.
**Action:** Always check if i18n contexts have user-facing controls. When implementing toggles, use haptic feedback (if available in the design system) and ensure clear ARIA labels for icon-heavy components.
