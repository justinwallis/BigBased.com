# ADR — MyBased is the private creative workspace within BigBased (2026-11-16)

**Decision: Selected by the product owner in conversation ("number 2").**
**Implementation status:** Product direction only. No working integration, production deployment, identity migration, model provider, DNS change, or consent flow was enabled.

## The decision

**BigBased is one connected creator/entrepreneur platform organized around Chat, Build and Connect. The Chat entry leads to MyBased AI, its private creative workspace—not a separately required consumer application at launch.**

An optional `mybased.ai` entry may later point to this BigBased workspace or serve as a marketing/directory site for creator-chatbot offerings. Domain routing, chatbot names/domains, identity federation, and independent apps are **not decided or configured** by this ADR.

The user selected the **embedded workspace** direction rather than a separate MyBased app or two customer products with federated identity. Any old docs that say MyBased must have separate user accounts or its own independent chat datastore are **superseded as product positioning**. Privacy isolation remains mandatory even within one product.

## One creator journey: Chat. Build. Connect.

1. **Chat → MyBased AI:** The BigBased **Chat** entry opens the private **MyBased AI** creative workspace where an independent person can brainstorm, research, plan, draft and work on projects. Chat is an optional entry and helper, not a requirement to use Build or Connect. Whether this is embedded in BigBased, a routed app surface or a dedicated `mybased.ai` entry remains a later UX/routing choice. Do not implement a second general-purpose chat engine in BigBased when an approved OpenTrestle conversation contract can be consumed.
2. **Build:** The person transforms a selected idea into an **owned project or artifact**—for example a launch page, media kit, publication, mini-app, website plan or creator platform. Work has explicit files, versions, export options and permissions; it must not live only in an ephemeral chat transcript.
3. **Connect:** The person deliberately chooses which project, excerpt, showcase, post or publication becomes visible to followers or communities. **No MyBased chat, private project, credential, draft or attachment becomes public by default.**

**Social networking supports creators' projects; it is not assumed to be the entire BigBased homepage.** Facebook-familiar UI patterns can still be used for feeds and communities, not necessarily as the first visitor's experience.

## BigBased public homepage — next and ONLY design target

Before any further page images or site build, design the **main public homepage** around the product's three clear actions: **Chat. Build. Connect.** A possible supporting invitation is *"What do you want to create?"*, but neither exact headline nor layout is approved. The Chat entry leads to the private MyBased AI workspace; Build to creator tools; Connect to social/community discovery. This is proposed content, not yet an approved headline, layout or visual mock.

Maintain the user's approved crowned BB brand assets, Futura STD and the original user-authored 2025 near-black visual language. Do not silently overwrite the exact 2025 master, add dominant green styling or replace the master with generic generated logos.

**STOP after one homepage concept/review.** No secondary page designs or production edits until approved.

**Latest guest/public-homepage study:** [Creator Launchpad public homepage — guest UX and conversion design v1](../design/creator-launchpad-public-homepage-guest-ux-v1.md). This documents the selected three-column guest-accessible workbench, public search, collapsible MyBased chat section, sign-in-to-save handoff, public Connect discovery, and optional creator-profile invitation. It does not authorize implementation or change the source-authored 2025 profile.

## Product and technology ownership

- **BigBased** owns one creator-facing product experience, creator identity/session decision (to be security-reviewed), private workspace authorization, private projects, publishable artifacts, creator profiles, social graph, communities, visibility and publishing policy.
- **MyBased** is a *workspace/experience name* inside BigBased. Its private conversations, model/context permissions and projects must have strict resource-level authorization and storage isolation from public social queries even if the same authenticated account accesses both.
- **OpenTrestle** remains a separate technology company/product that might supply versioned conversation protocols, tools and approval/receipt semantics under explicitly approved integration. **BigBased does not inherit OpenTrestle Console or runner credentials.**
- **SteadLamp** remains a separate Home/Life/Business customer app with no implicit data access or account sharing.
- **OTPE** may optionally supply authorized external publishing transport after separate scopes/approvals; BigBased remains authoritative for its content/publication outcomes.
- **mybased.ai** could be a direct URL, a separately branded landing page or chatbot directory; do not assume a domain redirect, new service, login or paid plan has been authorized.

This choice **removes the need for cross-product account federation between BigBased and an independently owned MyBased app at launch**, but does not remove the need for server-side access checks between private workspace data and public posts. If MyBased later becomes an independent service, federation and transfer contracts require a new ADR and threat review.

## Existing work to preserve and reconcile

- **Creator Lab v0.7** earlier offline prototype: idea paths, website launch page, video kit, mini-app, social lab and portable project passport. This demonstrates a creator-building workflow concept, **not** deployed AI or server-side persistence.
- **Original 2025 BigBased profile** is the exact existing visual master; existing prototype UI and test branches remain draft.
- **PR #16** creator/MyBased separation document, **PR #18** social foundation, **PR #21** social/REST stack and **PR #34** product-family fit contain valuable privacy, security and implementation boundaries. Their *separate standalone MyBased product* positioning is now superseded by this explicit owner decision; do not delete the documents or silently reinterpret them as current.
- **Current `main` homepage** still primarily presents older cultural/research/library messaging. This ADR does not rework it. The product positioning and homepage must be reconciled *before implementation*.

## Approval and verification gates

- [ ] Approve homepage information hierarchy and design, one page at a time.
- [ ] Decide MyBased chat placement within BigBased shell; do not auto-launch an AI model from a visual-only composer.
- [ ] Confirm private workspace model (projects, artifacts, conversations, visibility, ACL, account ownership, exports) and negative tests for accidental publication or cross-user reads.
- [ ] Confirm what a "builder" can really produce without pretending future website deployment, apps or platform hosting are already live.
- [ ] Preserve explicit preview/review/publish transitions, safe sharing, rollback and version history.
- [ ] Connect OpenTrestle models/tools, real persistence, external publishing, domains or deployment only under their separate approvals.
- [ ] Reconcile/update source docs and future OpenAPI schemas only once the product owner approves precise flows.

**No code, live permissions, provider configuration, domain records or existing customer data are changed by this ADR.**
