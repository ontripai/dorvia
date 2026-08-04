# Start Here Content Preservation

During the route consolidation (DRE-P2-ROUTES-SEO-T01), the following legacy slugs from the `StartHereContent.tsx` component were deprecated and redirected to the canonical routes:
- `/start-here/pre-departure-checklist` -> `/start-here/planning-to-come`
- `/start-here/first-three-days` -> `/start-here/newly-arrived`
- `/start-here/first-month` -> `/start-here/settling-in`

## Analysis of Unique Content
An audit of the switch-case in `StartHereContent.tsx` revealed that the legacy slugs contained highly specific, unique, and valuable checklist information that did not exist in the destination canonical routes. 
For example:
- `pre-departure-checklist` contained crucial lists like "Essential Documents", "Financial & Comm Prep", and "Recommended Items".
- `first-three-days` detailed the initial "72 hours", covering "Safe Airport Transfer", "SIM Card", and "Avoiding Initial Scams".
- `first-month` detailed the next immediate actions like "Collecting IGI Residence Card" and "Health Insurance Registration".

## Resolution
Rather than appending all this content blindly to the end of the destination pages or deleting it entirely, the unique grids from the deprecated routes were surgically extracted and inserted into the destination routes under semantically distinct sub-headings:
1. **Planning to Come**: Gained the new secondary section **Final Pre-departure Checklist** (چک‌لیست نهایی پیش از سفر).
2. **Newly Arrived**: Gained the new secondary section **First 72 Hours Guide** (راهنمای ۷۲ ساعت نخست).
3. **Settling In**: Gained the new secondary section **Essential First-Month Actions** (اقدامات ضروری ماه اول).

This preserves 100% of the valuable checklist content without breaking the canonical route structure. The old dead cases were then safely removed from the code.
