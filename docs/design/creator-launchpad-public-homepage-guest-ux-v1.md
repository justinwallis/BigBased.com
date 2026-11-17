# BigBased — Creator Launchpad public homepage: guest UX and conversion design v1

**Status:** Working design direction authorized for study on 2026-11-16; **not approved application implementation**. This page is a design/experience specification, not a live feature claim. Source for positioning: [ADR — MyBased inside BigBased](../architecture/adr-mybased-private-workspace-inside-bigbased-v2.md). Source for site-wide visual fidelity: [Original 2025 BigBased Profile — Exact Visual Master](./original-2025-profile-style-master.md).

## Owner choices from homepage study (in order)

1. **One main page at a time.** Do not expand this study into Chat, Projects, Profile, or Connect interior-page designs without a distinct request.
2. **Chat · Build · Connect** is the platform's organizing language. **MyBased AI** is the private creative conversation space *inside* BigBased; the future `mybased.ai` entry/marketing usage does not require a separate product or DNS change.
3. **Build is the main surface**. Avoid a promotional SaaS hero, an oversized landscape/photographic banner, huge CTAs, repeated sales cards, and a globe/decorative desktop vignette. Give visitors a real taste of a creator workbench instead.
4. **Use the same launchpad design for guests and signed-in people**, with capability differences. **Guest can try builder, search public content, and explore creator work; sign in is needed to save to an account.** Do not build an entirely different marketing homepage.
5. Preserve the darker source-authored 2025 BigBased style, the official crowned BB logo and Futura STD brand. Existing generated concept images are exploration, **not** final brand source files.
6. Keep **Connect visible** on the right as a Facebook-familiar *public project/creator feed*, not the whole site's purpose. Mock entries must be explicitly fictional in prototypes; never present generated likes, followers, account activity, or fabricated timestamps as live.
7. Add **global search for guests**, plus **collapsible MyBased chat/history within the left sidebar**. Keep the navigation practical rather than excessively large.
8. Provide a genuinely appealing pathway to create the owner's **preserved pixel-specific original 2025 creator profile** as a public home for finished work; never redesign that source or pre-share projects.
9. Chat should work as both **a full dedicated conversation experience** (nav Chat) and **an optional context-aware assistant** alongside Build (popover/sidepanel). Exact route is open, e.g. `/chat` is a placeholder and **not an endpoint claim**.
10. **No repo website code or live external account/provider/data changes** until separately authorized. This PR includes only product/design documentation.

## Proposed guest-first visual hierarchy: one page, one launchpad

The approved *directional* image is a **three-column black-forward launchpad**: compact shared header, optional left nav, dominant central builder, narrower right public Connect feed.

**Header (all visitors):**
- Official crowned BB/BigBased brand; single existing shared header, never a secondary one.
- Compact Chat / Build / Connect / Explore navigation and **global search**. Search over public project titles, creator public projections and communities, with an explicit “search all public content” scope for guests. No private-user suggestions, contacts, unpublished media, emails or account fields.
- Right: **Sign in** and restrained account action. Do not fabricate a signed-in avatar for guests.

**Left rail (collapsible):**
- Build, Chat (MyBased AI), Connect, Explore, then resources. Avoid generic marketing links dominating.
- **MyBased Chats** disclosure can expand/collapse; **New Chat** is present. For guests, only **actual chats created during the current guest session** can appear (if an approved local prototype supports them). Do not fabricate previous chats as if durable history exists.
- Guest state explicitly says **“Guest chats aren't saved to your account”**; not “your saved chats.” Provide **Sign in to save** only where appropriate.
- On mobile, collapse into a drawer or compact bottom nav and don't cover builder controls.

**Center (visually dominant):**
- Short human headline (“Make something your own.”, “The Creator Launchpad”, etc.), not another enormous ad banner.
- MyBased AI entry bar near the top; no implication of a live model without approved integration.
- **Builder is the hero**: choose Website / Publication / Video / Mini-app / Business Kit. Propose one smallest working sample first (existing Creator Lab v0.7 web-page builder is a useful *offline* starting reference); don't imply five complete backend generators.
- Within selected builder, clear small **Design / Content / Pages / Settings** controls only when they truly have meaningful behavior. Editable project title, selected layout/theme, and a responsive live preview. Visible undo/reset; preview-only sample never claims hosted production.
- A modest bottom control: **Preview** and **Save project**. Attempting Save as guest begins the sign-in/handoff flow described below; no account or payment demand before trying.

**Right (public social discovery):**
- Compact **Connect** with Feed / Projects / Creators / Groups tabs or equivalent; show actual public data only when verified and safely authorized. In design-only previews, show *fictional example* labeling with no invented live counts.
- Familiar social post anatomy (author/name, project excerpt or image, replies, share/save affordances). As guest, exploration/search/detail may work without an account; commenting/following/publishing requires a login and server-side privileges.
- A small authentic creator **profile preview/invitation** is near creator cards or after a meaningful builder milestone: “Give your work a home” / “Your profile. Your projects.” **Not** a forced modal on landing.
- Do not stuff a full-size original profile design into the homepage or duplicate its header; use a teaser linking into an eventual onboarding route.

## Primary user journeys (desired design, no functional implementation claim)

### A — Guest visitor builds, then signs in to save

1. Visitor arrives at the **same launchpad UI** as an account holder, with guest-readable capabilities and a visible search.
2. Visitor selects Website, edits project name, chooses theme/layout; live sample preview responds. An illustrative no-backend prototype can implement this deterministically.
3. Visitor selects **Save project**. UI says “Sign in to save this project and continue,” and clearly identifies which artifact will be saved.
4. Capture guest state safely for an **intentional account handoff**; ensure user can cancel and continue the unsaved guest demo. A proposed later implementation could use short-lived browser-local data, but it must be bounded, never contain secrets, and be reviewed for privacy, XSS and data loss. Avoid promising recovered drafts unless tested.
5. After successful login and explicit user consent, offer **“Save this project to your workspace”**; confirm ownership/tenant, idempotency, visibility=private, and asset bounds. If migration fails, show truthful recovery controls, never silently discard or publish.
6. A natural optional next step: **“Make a creator profile to showcase your work”**. Project is private until separate publish/share action. Profile completion is not required to save a private project.

### B — Visitor searches or explores Connect

- Global search accessible regardless of signed-in state. Query **public-only** resources by default; no access to private MyBased conversations or unpublished drafts.
- Click a creator name or project to view public content. “Follow,” “comment,” “save to account” can show a scoped sign-in prompt rather than dead buttons.
- Show what a **beautiful personalized profile** makes possible: custom cover, centered avatar, public work, selected content tabs, creator identity. This should motivate optional signup, not gate looking at public work.
- No fictional follower counts or engagement presented as authentic activity.

### C — Chat navigation and context

- **Chat nav** opens the *full* MyBased AI workspace under BigBased (route and implementation unspecified). The homepage remains the launchpad, not a chat-only public page.
- **Contextual Chat entry** at the builder opens a compact expandable MyBased panel/drawer, not an automatic redirect, so users can keep editing. A “Open full chat” affordance can move the current conversation to the full workspace when that behavior is actually supported.
- Project context only passed to the assistant after explicit selection/permission. Applying generated changes requires review/approval; no direct autonomous publish, edit or external execute.
- **Guest AI** is a separate future risk/cost/abuse decision. For early prototypes use non-model fixed examples with clear “Demo” labeling. If guest live Chat is unavailable, explain that and allow builder exploration or sign-in; don't pretend chat works.
- Sidebar history: for signed-in accounts, eventually private authorized per-user conversation list; for guest, no persistent cloud history or fabricated chat titles. Cancel, logout, cross-user and account-change states must not reveal private conversations.

### D — Profile creation as earned invitation

- Strongest moment **after a project exists**: “Give your work a home,” show the source-faithful *profile preview* and explain customizable public identity / portfolio / follow / community.
- **Original source authority** `app/[username]/PublicProfilePageClient.tsx` with exact frozen SHA `04ef8e7d6a8a9f1d14afdadd869e62750bf948a8`; source cover max 1250px, `clamp(200px, 25vw + 75px, 455px)` height, blue/purple/indigo gradient, centered 196×196 avatar desktop, 1220px content max, dark `#080808` page, dark `#0d0d0d` panels, `#131313` actions, 3px amber active tab.
- No speculative pixel-perfect redraw: reuse and screenshot-compare original authored source before any UI change. A **Projects tab** is a *proposal to review*, not approved modification. Social/contact/personal fields require strict public allowlist; legacy profile source is not a security audit.
- Sign-up/username creation and visibility selections must be real, authorized and tested before shipping.

## Suggested microcopy (not approved slogans)

- Main: **“Make something your own.”** / **“Build your next project.”**
- Subhead: **“Chat. Build. Connect.”**
- Builder: **“Try the builder”**, **“Preview”**, **“Save project”**.
- Guest save gate: **“Sign in to save your work”** with “Keep exploring” and no lost input.
- Profile invitation: **“Give your work a home.”** / **“Make your creator profile.”**
- Guest chat: **“Guest chat — not saved to an account.”**

Avoid overusing “free,” “live,” “no account needed” or “AI-powered” until the exact service, limits and billing are verified. “Try a sample without signing in” is acceptable only when the sample actually works.

## Responsive, usability and trust checks for later implementation

- Screens to verify: desktop around 1440px/ultrawide, tablet, 390px and 375px phone. Sidebars never overlap the public homepage/workbench or the creator profile; keyboard/tab and screen-reader flows remain available.
- Global search has focus, empty, zero-result, loading and error states; public-only filter is enforced on server not just UI.
- Chat disclosure preserves navigation state and works via keyboard, mobile; no fictional account history.
- Builder selection/theme/name truly update preview; undo/reset and refresh expectations are explicit. No fake “Save” success.
- Guest login prompt: cancel, failed login, session expiration, duplicate save, account mismatch, intentional privacy selection, denied permission and failed migration.
- Profile invitation appears only after an earned action or in restrained discovery areas; **no forced public profile** to keep private work.
- Public Connect labels examples/fixtures; no fake people/activity or content leakage.
- No cross-product reads of SteadLamp data, OpenTrestle Console/Code authority or MyBased private chats by default.
- No live AI providers, secrets, workers, OTPE distribution, customer records, identity federation, DNS, production writes or deployment from this design document.

## Open decisions / not yet authorized

1. Guest builder project's safe storage and save handoff design, including cleanup and what can survive a page refresh.
2. Guest Chat feasibility/cost and what subset is accessible before login; no provider model execution authorized.
3. Exact Chat route, sidebar interaction and project-context sharing permission.
4. Public creator-profile onboarding entry point; possible Projects tab remains design-only.
5. First *genuinely implemented* creator output among website/publication/video/mini-app/business kit; don't promise more than the tested demo.
6. Which public Connect resources are populated first after auth/RLS/privacy validation.

## Handoff

**Next visual iteration = same homepage only**. Preserve prior approved 3-column workbench and right feed, **restore top search**, **collapsible MyBased Chats section** left, **truthful guest sign-in-to-save state** below preview, and a small **creator-profile invitation** reflecting original 2025 visual treatment. No standalone chat page mockups, profile redesign, project pages, coding or deployment until separately approved.
