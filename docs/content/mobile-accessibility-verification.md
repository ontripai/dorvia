# Mobile & Accessibility Verification Report

## Tested Viewports
- 360 × 800 (Small Mobile)
- 375 × 812 (iPhone SE / X)
- 390 × 844 (iPhone 12/13/14)
- 412 × 915 (Large Android)
- 768 × 1024 (Tablet)

## Verification Checks
- **Horizontal overflow**: Passed. All components (`EligibilityAndExceptions`, `FeesAndTimelines`, etc) are contained within the main column.
- **Tables inside controlled scroll containers**: Passed. No tables were used for fees; semantic definition lists or unstyled grid rows are used.
- **Anchor navigation**: Passed. Table of Contents correctly navigates to `#scenario-id`.
- **Header/sticky collision**: Passed.
- **Breadcrumb**: Passed. Visible and interactive on all viewports.
- **Touch targets**: Passed. Minimum 44px for buttons, padding added to source links.
- **Keyboard navigation**: Passed. Focus is visibly maintained.
- **Focus states**: Passed. `focus:ring` applied on interactive elements.
- **RTL**: Passed. Persian text aligns right; icons have `rtl:rotate-180` or flip correctly.
- **LTR**: Passed. English text aligns left.
- **Source-link labels**: Passed. Each source link has `aria-label` or clear text (`dgpci-exchange`).
- **Table captions**: N/A (no tables used, semantic divs used instead).
- **Print/checklist action**: N/A.
- **Footer card visibility**: Passed. `ParentHubFooterCard` renders at the bottom.
