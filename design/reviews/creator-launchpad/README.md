# BigBased — Creator Launchpad (guest review prototype v1)

**Status:** Standalone, offline visual/interaction review, **not** the live BigBased homepage. Branch: `feature/creator-launchpad-offline-guest-review-v1`, stacked on the approved direction documentation in draft PR #36. No model, real social service, login, account persistence, database, external API, domain, or deployment is activated.

## Open and try

Open **`index.html`** in a desktop or mobile browser. It is self-contained: approved BigBased wordmark and sample imagery are embedded as local data, with no external requests. No packages, local server, accounts, or internet access are needed.

Try editing the project name, theme, layout, and sample type; use **Undo/Redo** and **Preview**. Choose **Export HTML** to download a basic standalone sample document (it is a simplified exported project, **not** a hosted/publication-ready website). **Sign in to save** explains the future account handoff without claiming a functioning auth backend.

Use the global search to query **fictional public examples**; use Connect tabs, a local-only Like toggle, and sample comment expansion. Enter a chat prompt to see it appear in a **temporary tab-only MyBased conversation** and the collapsible sidebar. **No AI reply will be generated.** A new browser page/refresh does not preserve chats or builder edits. The creator-profile invitation is a concept preview of the original 2025 layout; it does not create a real public profile.

## Verified behavior (offline browser test)

`python test_guest_launchpad.py` — requires Python Playwright and Chromium at `/usr/bin/chromium`. It uses an in-memory page, so the test runs with no HTTP server. The test exercised:

1. Approved official brand image embedded and builder initial state.
2. Name/theme/layout/sample type changes, Undo and Redo.
3. Search matching and empty/escape states using public fictional fixtures only.
4. Connect filtering, local reaction toggle, and sample comments.
5. Temporary MyBased chat, explicit no-AI response state, and collapsible history.
6. Sign-in-to-save explanation and real local HTML export.
7. Profile invitation and private-to-public boundary copy.
8. Fresh-page guest reset behavior.
9. No JS page errors and no outbound browser network requests.
10. Responsive layout without horizontal overflow at **375, 390, 768, 940, 1170, 1440, and 1920 px**, including mobile drawer open/close.

Browser captures are supplied separately as review artifacts. Passing these checks does **not** validate production authentication, RLS, persistence, real model calls, full accessibility, or user acceptance.

## Reference fidelity and constraints

Design reference: the owner-selected `BigBased Creator Launchpad Showcase(1).png`. This is a code interpretation of its hierarchy, **not** a pixel-exact screenshot reproduction. The wordmark is derived from the already-approved BigBased transparent brand file, and small project images are crops of the owner-selected concept artwork. The original source-authored `app/[username]/PublicProfilePageClient.tsx` remains unchanged, including hash `04ef8e7d6a8a9f1d14afdadd869e62750bf948a8`.

Visual hierarchy: compact header with guest search; left workspace rail and MyBased chat disclosure; dominant Build workbench; MyBased entry; right Connect preview; lower creator-profile, Chat, and creator journey previews. Near-black panels, amber active states, no oversized SaaS hero or globe. Mobile prioritizes the builder, with side rail in a drawer and Connect below the builder.

## What requires a separate implementation approval

- Replace this **isolated review artifact** with a production homepage implementation using reviewed application components.
- Decide guest-edit retention and safe authenticated handoff with negative/unauthorized-session tests; the current prototype intentionally keeps guest edits in memory only.
- Implement real indexed public search and creator data only after public projections and server-side permissions are validated.
- Choose real chat model/API, guest usage limits, provider costs, and per-project context consent; OpenTrestle remains a separate technology platform.
- Implement actual server-backed builder outputs, saved projects, authorization, publish/revert, and public profile setup.
- Validate screen-reader, keyboard focus management, security, network requests, mobile browsers, full app builds, and production routing before making it live.

**No merge/deploy is authorized by this review prototype.**