## Summary

Completes the production mobile-navigation hotfix and simplifies the DORVIA
brand lockup across Header, Mobile Drawer and Footer.

## Mobile Navigation

- Rendered the full-screen drawer through a React portal
- Fixed iOS Safari and in-app browser height constraints
- Added safe-area bottom clearance
- Prevented floating widgets from covering navigation
- Preserved body scroll lock and drawer scrolling
- Corrected canonical navigation links
- Removed duplicate React keys

## Brand Lockup

- Removed “در رومانی” and “In Romania” beside the logo
- Removed the temporary DR badge
- Kept the approved DORVIA logo independent
- Added localized platform descriptions below the Footer logo
- Updated logo accessibility label to DORVIA EUROP

## Validation

- npm run validate:content passed
- npx tsc --noEmit passed
- npm run build passed
- Mobile Persian RTL verified
- Mobile English LTR verified
- Desktop Header verified
- Footer wrapping verified
- Route and Sitemap structure unchanged

## Final commits

- Mobile navigation: 6d93fa9d221b866f27f27012c9c6e04f18190183
- Brand lockup: 9174384c81ba1e5aa9e8a55fc1aec92ee0ccf574
