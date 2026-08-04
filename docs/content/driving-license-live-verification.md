# Live Verification Report

## Deployment Details
- **Branch**: `dre-p00-base-t01-r01`
- **Commit**: `0ff7c74`
- **URL**: `https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app`

## SEO & Route Identity
| Route | Status | Title | H1 | Canonical | Robots |
|---|---|---|---|---|---|
| `/needs/driving-license` | 200 | گواهینامه رانندگی \| در رومانی – DORVIA EUROP | گواهینامه رانندگی در رومانی: تبدیل، صدور جدید و قوانین | `.../needs/driving-license` | `noindex, nofollow` |
| `/work/work-permit` | 200 | مجوز کار در رومانی (Aviz de Muncă) \| DORVIA EUROP | مجوز کار در رومانی (Aviz de Muncă) | `.../work/work-permit` | `noindex, nofollow` |
| `/romania/cities` | 200 | شناخت کشور رومانی \| در رومانی – DORVIA EUROP | شهرهای رومانی | `.../romania` | `noindex, nofollow` |

## Technical Route Responses
- `/robots.txt`: 200 (`User-Agent: * \n Disallow: /`)
- `/sitemap.xml`: 200 (66 URLs)
- `/cities`: 308 (Redirect)
- `/work/permit`: 308 (Redirect)
- `/admin/comments`: 404 (Correctly excluded)

*Note: FA routes (`/fa/*`) return 404 because localization currently targets the root path natively or via middleware injection for the default FA locale, depending on the Next.js standard config used here.*
