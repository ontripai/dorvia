# DRE-P2-CONTENT-SYSTEM-T01-R04 Change Log

- Header Layout: Updated Header.tsx to handle 44x44px touch targets. Fixed container clipping by shrinking layout gaps.
- TOC Anchors: Updated OperationalGuideLayout.tsx to expand scroll-mt-24 to scroll-mt-32 and increased TOC anchor touch sizes.
- Table Overflow: Changed whitespace-nowrap to whitespace-normal sm:whitespace-nowrap break-words in FeesAndTimelines.tsx for mobile viewports to prevent the English table from overflowing horizontally.
- Translation: Updated Persian string translation in a.ts IDP appliesTo field.
- Validator Runtime: Swapped 	s-node for 	sx in package.json for reliable validations.
