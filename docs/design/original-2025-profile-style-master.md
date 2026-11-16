# Original 2025 BigBased Profile — Exact Visual Master

**Design authority:** The user-authored original BigBased profile `app/[username]/PublicProfilePageClient.tsx`, file blob SHA-1 `04ef8e7d6a8a9f1d14afdadd869e62750bf948a8`.

**Decision (2026-11-16):** Every BigBased page should use this original, nearly finished 2025 profile styling as the **sole website-wide visual reference**. Do not replace it with a generic social-feed treatment, white-label template, AI-generated redesign, or a pixel-for-pixel Facebook clone.

**Status:** Implementation in a review branch only; shared style system derived from the reference, not a claim of screenshot-verified pixel identity across every route. Historical profile JSX is frozen by an automated blob-hash test and was not modified.

## Canonical values extracted from the authored source

| Element | Exact source treatment | Reusable class |
| --- | --- | --- |
| Site header, BB icon, search, hamburger and slide-out menu | Existing app/client-layout.tsx, BBLogo, SideMenu and SearchPopup; one shared header only | Reuse existing layout; **never** add a second brand header |
| Page background | Light gray-100; **dark #080808** | `bb-2025-page` |
| Content width | **1220px maximum** on profile content | `bb-2025-container` |
| Profile cover | **from-blue-600 via-purple-600 to-indigo-600**, height `clamp(200px, 25vw + 75px, 455px)` | `bb-2025-cover` |
| Avatar | Centered in the cover on both mobile and desktop; original **196×196px** desktop, bordered circular | `bb-2025-avatar` |
| Surface/cards | Light white; **dark #0d0d0d** | `bb-2025-panel` |
| Controls/actions | Gray-200 light; **dark #131313**; hover **#1f1f1f**; height **35px**; rounded-md | `bb-2025-action` |
| Selected tabs | **3px amber-500 border and text**, amber-400 in dark mode | `bb-2025-tabs`, `bb-2025-tab` |
| Form fields | White/light or dark surface, compact and readable | `bb-2025-field` |
| Light/dark mode | Preserve contrast and the original theme behavior | Scope inside `bb-2025-page` |

**Important:** The app's current `globals.css` includes original targeted overrides, some with `!important`. The extracted design classes live in **`styles/bigbased-2025.css`**, loaded alongside the original stylesheet and **scoped to explicitly opted-in pages only**. Do not rewrite or purge original 2025 CSS wholesale.

## Routes/components aligned in this branch

- Social feed visual review and its source-driven creator-profile review: original dark/light surfaces and control sizes; genuine 2025-centered cover/avatar on creator profile; amber active navigation, not generic purple selected tabs.
- Community landing and legacy community client shell: backgrounds, cards, compact controls.
- Chat visual shell, input and suggestion controls: original dark surfaces and 35px actions. **No AI engine or account integration enabled**.
- About, Features, Partners, Contact, FAQ, Transform, Revolution, Docs: matching original page background and light/dark inheritance; simple information pages use original-style panels and action controls where applicable.
- Profile account surface, notifications, security (password, two-factor, sessions), and checkout background: matching shared light/dark foundation.
- Not-found state and original shared header inheritance.

**Original home page and public profile master are preserved**, not reauthored. Special-purpose debugger and global error handling retain their diagnostic semantics.

## What 'exact' means across different page purposes

Do not make every page *literally* have a person-avatar cover. Different functions need different information layouts. Exactness applies to **the established visual system and reusable primitives**: original header, BB logo, sidebar behavior, background colors, controls, spacing scale, active-tab amber, 2025 typography/contrast, card backgrounds and mobile/dark behavior. When a page actually has a creator profile, use the **same centered cover/avatar geometry** instead of approximating it.

Do not invent a secondary global nav, alternate violet brand palette, fake friends, follower counters, invented community engagement or real social claims in fictional previews.

## Acceptance before merging

1. Original profile's complete JSX blob SHA remains unchanged; compare the original page at phone widths and desktop widths against the user's 2025 video/stills.
2. Render and visually compare **all modified routes** in both light and dark. Verify header doesn't double, cover/avatar positioning matches the original, and tabs use amber. Test 375px phone, tablet, 1280px desktop and any narrower viewports needed.
3. Run keyboard/VoiceOver/Screen Reader checks, modal focus trapping, theme changes, responsive wrapping, content scroll, and readable contrast.
4. Treat existing legacy authentication, profile public SELECTs and community/RLS issues separately. Styling is not a security release; do not expose private `social_links._extended`, auto-enable real social activity, deploy/merge to production or turn on AI.
5. Build and browser QA are **not yet confirmed**. Vercel's preview deployment-limit failures and lack of authenticated browser rendering prevent a pixel-perfect verification claim.
6. Continue inventorying less frequently visited nested routes and unique marketing widgets before saying **every** page is exact.

### Comparison baseline

The user-authored original profile and iPhone recording are the visual source of truth. Old draft restoration PR #12 and the privacy-protection work in PR #13 are preserved separately. The social implementation review is stacked on draft PR #23. Original 2025 visual recovery is a design instruction, **not** authorization to revert profile privacy protections or enable old chat backend code.

**Scope:** Visual styling only. No model, database, real creator accounts, publishing, permissions, domain, live site, or native-app behavior changed.
