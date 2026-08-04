# Content Route Audit

## Route Counts
1. **Implemented Physical Routes (src/app)**: 25 (e.g. `page.tsx`, `[slug]/page.tsx`)
2. **Metadata-only Routes (src/lib/pageMeta.ts)**: 60+ (mapped via dynamic `[slug]`)
3. **Total Discrepancy Resolved**: The 76 routes arise from counting physical folders + every dynamic key in pageMeta.

## Route Inventory

| Route | Implemented | Type | Public Status | Content Maturity | Fact Check Status | Operational Completeness | Legal Risk | Official Sources | Mobile Readiness | Recommended Action |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Yes | Home | Public | Operational | Source verified | N/A | Low | Partial | Good | Add service pathways |
| `/about` | Yes | Static | Public | Basic | Unchecked | N/A | Low | None | Good | Expand team info |
| `/evaluation` | Yes | Form | Public | Operational | N/A | Yes | PRIVACY (Blocking) | None | Good | Add privacy notice |
| `/legal/privacy` | Yes | Legal | Public | Basic | N/A | N/A | PRIVACY | N/A | Good | Add Telegram flow |
| `/legal/terms` | Yes | Legal | Public | Basic | N/A | N/A | CONSUMER | N/A | Good | Draft provider section |
| `/legal/disclaimer` | Yes | Legal | Public | Basic | N/A | N/A | LEGAL | N/A | Good | Add medical/tax limits |
| `/immigration` | Yes (Dynamic) | Hub | Public | Informative | Unchecked | No | Low | None | Good | Add specific CTA block |
| `/immigration/igi-process` | Yes (Dynamic) | Guide | Public | Good but incomplete | Partially checked | Partial | IMMIGRATION | Complete | Good | Lacks appointment links |
| `/immigration/residence-renewal`| Yes (Dynamic) | Guide | Public | Good but incomplete | Partially checked | Partial | IMMIGRATION | Complete | Good | Lacks clear timeline risks |
| `/immigration/family-reunification`| Yes (Dynamic) | Guide | Public | Good but incomplete | Partially checked | Partial | IMMIGRATION | Complete | Good | Lacks income calculation |
| `/immigration/citizenship` | Yes (Dynamic) | Guide | Public | Good but incomplete | Partially checked | Partial | LEGAL | Complete | Good | Lacks lawyer disclaimer |
| `/company` | Yes (Dynamic) | Hub | Public | Informative | Unchecked | No | Low | None | Good | Add setup CTA |
| `/company/registration` | Yes (Dynamic) | Guide | Public | Good but incomplete | Partially checked | Partial | TAX, LEGAL | Partial | Good | No direct quote form |
| `/company/tax-types` | Yes (Dynamic) | Guide | Public | Good but incomplete | Partially checked | Partial | TAX | Partial | Good | Thresholds need 2024 verify |
| `/needs` | Yes (Dynamic) | Hub | Public | Informative | Unchecked | No | Low | None | Good | Add service pathways |
| `/needs/driving-license` | Yes (Dynamic) | Guide | Public | Good but incomplete | Partially checked | Partial | LEGAL | Complete | Good | Add DRPCIV link |
| `/needs/health` | Yes (Dynamic) | Guide | Public | Basic | Unchecked | No | MEDICAL | Partial | Good | Add doctor directory |
| `/needs/housing` | Yes (Dynamic) | Guide | Public | Informative | Partially checked | Partial | CONSUMER | Partial | Good | Add provider directory |
| `/needs/currency-exchange` | Yes (Dynamic) | Guide | Public | Informative | Unchecked | Partial | FINANCIAL | Partial | Good | Add BNR feeds |
| `/needs/certified-translation`| Yes (Dynamic) | Guide | Public | Informative | Unchecked | No | CONSUMER | None | Good | Create provider directory |
| `/needs/notary-public` | Yes (Dynamic) | Guide | Public | Informative | Unchecked | No | LEGAL | None | Good | Create provider directory |
| `/study/scholarships` | Yes (Dynamic) | Guide | Public | Informative | Unchecked | Partial | EDUCATION | Partial | Good | Missing deadline tracker |
| `/study/visa-type-d` | Yes (Dynamic) | Guide | Public | Informative | Unchecked | Partial | IMMIGRATION | Partial | Good | Missing embassy link |
| `/work/work-permit` | Yes (Dynamic) | Guide | Public | Informative | Unchecked | Partial | IMMIGRATION | Complete | Good | Employer match missing |
| `/work/taxes-salaries` | Yes (Dynamic) | Guide | Public | Informative | Unchecked | Partial | TAX | Partial | Good | Missing calculator |
| `/admin/comments` | Yes | Admin | Protected (Auth required) | N/A | N/A | N/A | SECURITY (Blocking) | N/A | NOT VERIFIED | Requires strict CSRF/Roles |

*Note: Routes not listed here are currently marked as **DETAILED AUDIT PENDING**.*
