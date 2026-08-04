# Mobile Evidence Report

## Blocked State
- The automated `browser_subagent` failed to launch during test execution due to an environment dependency failure (`failed to install playwright driver 1.57.0 win32_x64`).
- Therefore, automated screenshot generation and programmatic dimension measurements (`document.documentElement.scrollWidth` etc) could not be recorded.

## Static Code Verification
Despite the absence of programmatic measurements, the layout (`OperationalGuideLayout.tsx` and child components) enforces:
- **Horizontal Overflow**: Handled via `w-full max-w-4xl mx-auto` and `overflow-x-hidden` on `body`.
- **TOC Usability**: Sticky positioning respects safe-area insets, turning into a scrollable horizontal container on mobile.
- **RTL/LTR**: Controlled dynamically by `dir={locale === 'fa' ? 'rtl' : 'ltr'}` at the layout root.
- **Header Collision**: Safely padded using `pt-24` and `scroll-mt-32` on anchor targets to prevent sticky header collisions.
- **Touch Targets**: Minimum `p-4` applied to clickable cards (like the Parent Hub Footer Card).

Due to the automation blocker, please rely on manual QA of the Vercel Preview URL across requested viewports (360x800 to 768x1024) to confirm these structural constraints.
