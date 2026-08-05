# Driving License Mobile Evidence

## Overview
This document records the visual evidence and layout behavior of the driving license pilot under mobile and desktop viewports, addressing issues like internal container clipping, TOC offset overlap, and table overflows.

## Retest Summary
- 360x800 (FA/EN): Header correctly scales without horizontal scrolling. English table rows now break and wrap instead of clipping outside the viewport.
- 375x812, 390x844, 412x915: Header fully fits inside the viewport. TOC offset uses scroll-mt-32 (128px) ensuring proper anchor spacing without overlapping the scenario titles.
- 768x1024: Desktop view remains fully functional.

> Note: Screenshots could not be automatically captured during this run due to an environment Playwright driver download failure (HTTP 404). Manual verification of the viewports is requested.
