# Mobile Experience Audit (Route-by-Route)

## 1. Homepage (`/`)
- **Header/Hamburger**: Visible and functions well across 360x800 to 768x1024.
- **Hero/Length**: Scales well.
- **RTL/Safe Area**: Bottom safe area clear (390x844). RTL alignment perfect.

## 2. Hub Page (`/needs`)
- **Header/Navigation**: Top-level Hub cards display beautifully in stack mode.
- **Breadcrumb**: Absent (expected for top-level).

## 3. Guide Page (`/company/registration`)
- **Sticky Parent-Back Bar**: Correctly docks at `top-[80px]`. 
- **In-page Table of Contents**: Accessible.
- **Tables (Horizontal Overflow)**: Risk of overflow on 360x800. **Recommendation**: Implement `overflow-x-auto` wrapper.
- **Sticky CTA**: Missing. 
- **Forms/Keyboard**: N/A for this page.

## 4. Legal Page (`/legal/privacy`)
- **Text Readability**: Good on 412x915.
- **Footer**: Stacks cleanly.

## 5. Form Page (`/evaluation`)
- **Keyboard Behavior**: iOS keyboard pushes screen correctly on 375x812. 
- **Touch Targets**: > 44px for inputs.

## Provider Carousel Recommendation
For rendering third-party providers on mobile, do NOT use multi-level accordion or vertical lists that disrupt the reading flow. Use a horizontal swipe **Carousel** card format.
