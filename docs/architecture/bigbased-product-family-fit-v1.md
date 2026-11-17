# BigBased in the Product Family — Non-Overlap and Opt-In Integration Blueprint v1

**Status:** Historical proposed product-family map (2026-11-16). **MyBased's standalone product placement and social-first homepage assumption are superseded** by [ADR v2: Chat · Build · Connect, with Chat leading to private MyBased AI](./adr-mybased-private-workspace-inside-bigbased-v2.md). Preserve this document's privacy, technical-service, company-separation and authorization constraints. No live API, account federation, licensing agreement, RLS policy, deployment, publishing operation or provider execution is authorized. Preserve the user's existing original 2025 BigBased visual design.

## Sources and authority

This document reconciles existing, still-draft materials:
- BigBased [Creator AI Product Boundaries v1](./creator-ai-product-boundaries-v1.md) and [Social Foundation v1](./bigbased-social-foundation-v1.md), including the proposed offline-only [integration contract](../../contracts/bigbased-social-integration.v1.json).
- BigBased [Social Platform Stack and Facebook-Familiar UX v1](./social-platform-stack-and-ux-v1.md) and the user-authored [2025 Original Profile Style Master](../design/original-2025-profile-style-master.md).
- OpenTrestle [Conversation Product Family PR #155](https://github.com/OpenTrestle/opentrestle-platform/pull/155), [web-first/native parity PR #158](https://github.com/OpenTrestle/opentrestle-platform/pull/158), and ongoing offline conversation foundation work.
- SteadLamp [customer-specific conversation boundary PR #28](https://github.com/OpenTrestle/steadlamp/pull/28) and [Experience Board Reconciliation PR #29](https://github.com/OpenTrestle/steadlamp/pull/29).
- The user-supplied SteadLamp application screenshots are references **for comparing product boundaries**, not BigBased UI specifications or evidence of a working live customer application.

**Where authority lives:** This is a BigBased-local architectural decision proposal. OpenTrestle, SteadLamp, MyBased, their legal operators, and the OpenTrestle Publishing Engine retain independent implementation and approval authority. Their draft PRs are not merged production contracts.

## The product answer: four different jobs, not four copies of chat

| Product | Primary user job | Owns and authorizes | Must not assume ownership of |
| --- | --- | --- | --- |
| **OpenTrestle** | Develop/apply technical AI and software capabilities, conversations, tools and approval-backed work | Versioned reusable conversation/attachment/tool proposal contracts and technical control plane; its own Chat/Code/Console developer product | BigBased social graph, creator publishing identity, social moderation, SteadLamp domain records |
| **SteadLamp** | Manage Home/Life/Business information and activities with Companion, Desk, Room, Book, Pulse and Lane | Customer/Space/Room-scoped domain context, permissions, personal/business records, collaborative decisions | BigBased public communities, MyBased private creator AI chats, OpenTrestle operator/admin authority |
| **BigBased.com** | Discover creators, follow others, discuss, join communities, publish and distribute creator work | Creator public profile projections, audience/privacy, posts, feeds, comments, reactions, follows, blocks, communities, moderation decisions, publishing outcomes | General-purpose private AI workspaces, household records, model/tool operator privileges |
| **MyBased.ai** | Create privately: research, draft, experiment, organize creator projects using AI | Private creator conversations, project history, drafts, attachments, export/share intent and its own app/identity boundary | Social-feed visibility, automatic publication, SteadLamp Spaces, OpenTrestle Console |
| **OpenTrestle Publishing Engine** (optional technology component) | Technical dispatch and reconciliation of approved distribution jobs | Technical delivery attempts, provider adapters, receipts according to its own approved authority | Social posts as source of truth, BigBased community rules, creator audience selection |

**Company separation:** BigBased/its eventual operator and OpenTrestle LLC do **not** become the same entity because BigBased uses an OpenTrestle API. Licensing, service terms, billing, data processing and commercial rights remain separate undecided questions. This document does not create an agreement.

**Experience separation:** Use familiar interaction patterns where useful; do not share brand identities or full product shells. SteadLamp's detailed application dashboards and Companion/Desk/Room are **not a template to transplant** into BigBased; BigBased's creator feed and community navigation must remain recognizable as a social product. Similarly, OpenTrestle developer Chat/Code/Console should not become BigBased's main social UI.

## The shared technology seam: reusable contracts, separate access

Adopt selectively and only after separate review:
1. **Conversation protocol:** versioned messages, attachments, streamed responses, errors, proposals, context references and state transitions may originate in OpenTrestle. This does *not* grant BigBased a shared conversation database, an OpenTrestle administrator credential, or a visible OpenTrestle Chat product tab.
2. **Tool/AI assistance:** a BigBased creator may request narrowly scoped draft help or a moderation *suggestion*. BigBased verifies its own creator/tenant/resource grants first. The platform returns a proposed artifact; BigBased decides when and whether to expose it. No autonomous social moderation.
3. **Publishing integration:** BigBased owns a creator-approved post/draft and chosen audiences. An optional OpenTrestle Publishing Engine adapter may propose/execute distribution only after explicit provider/credential/dispatch approvals. It returns technical attempt/receipt evidence. BigBased records the authoritative publication result after verifying it.
4. **Identity:** distinct identities and sessions by default. Possible future cross-product federation requires a separate user opt-in, security design, identity mapping, unlink/revocation and retention policy. No implicit SSO from a familiar username or shared operator.
5. **Storage:** BigBased owns social records, MyBased owns private AI creator records, SteadLamp owns private customer domain records, and OpenTrestle owns its own technical runtime/lineage. No common table, shared tenant ID, log export or search index solely because product names are associated.

Existing `contracts/bigbased-social-integration.v1.json` is **proposal-only** and **default-deny**. It explicitly forbids private profile fields, credentials, full chat histories, SteadLamp customer data and OpenTrestle Code data in an integration request. Do not widen its payload fields or bypass server-derived authorization without new contract review.

## A safe, useful creator-to-community example

**Draft-to-post is the first interoperability journey; not a live feature claim.**

1. A creator works privately in **MyBased.ai**, producing a draft, image or research artifact. The underlying private conversation stays there.
2. The creator deliberately selects one artifact/excerpt and **chooses Export to BigBased Draft**. Display exactly what will cross the boundary, its destination, visibility, attribution and any attachments. No background sync.
3. The MyBased service requests an approved, purpose-limited handoff. Recipient **BigBased** authenticates the actor independently, checks its own account/community permissions and creates a **private, unpublished BigBased draft**. Fail closed; on an error do not silently retry into another audience.
4. The creator reviews the draft **inside BigBased**. BigBased remains responsible for validation, content policy, audience selection, media processing, moderation and explicit `Publish` action.
5. A future approved distribution adapter may call OTPE for a selected provider account. OTPE reports *attempted/delivered/reconciled* technical states with idempotency and receipts; the UI must not claim that the BigBased post is published merely because a worker returned `succeeded`.
6. Revocation, unlinking or deleting the export grant stops further handoffs. Explicit per-product deletion and retained audit records follow separately approved retention rules.

**Negative test cases before implementing:** No consent, mismatched creator identity, revoked account link, private MyBased transcript attempted as public content, blocked/moderated BigBased audience, wrong community scope, expired publishing provider grant, delayed/duplicate delivery, mixed two creators' credentials, incomplete technical receipt, and accidental SteadLamp resource attachment. Each must fail without leaking or publishing private content.

## What BigBased should build independently now

**Core social-first tracks (do not wait for OpenTrestle Chat):**
- Creator profile and account settings with strict public projection and private contact metadata separation.
- Chronological social feed, composer, posts/comments/reactions, follows and community discovery/navigation.
- Per-post audience controls, saved content, report/mute/block, accessible moderation/appeals.
- Creator Studio: private drafts, revisions, media upload design, preview, export and publish approval.
- Versioned BigBased REST/OpenAPI resources, a single reviewed session/auth model and negative RLS/authorization tests. Current design-only contract and fictitious previews are not working production endpoints.
- Desktop/mobile visual review and a separately gated native strategy.

**Integrations that wait for explicit approval:** model calls, MyBased account federation, OpenTrestle tool dispatch, live moderation assistance, third-party publishing accounts, OTPE workers, real customer social data writes, real-time messaging, native store release and production rollout.

## UI/brand agreement for this BigBased chat

**The user's 2025 BigBased profile is the sole site-wide style authority** on the current review branches. Do not restyle it as SteadLamp or OpenTrestle.

- Preserve existing near-black `#080808` backdrop, charcoal `#0d0d0d` panel, `#131313` controls, amber selection and blue→purple→indigo creator-cover treatment, pending actual visual QA.
- User prefers an even **darker, black-forward** direction. Treat further darkening as a **visual proposal requiring comparison**, not implicit permission to change original profile constants. Favor neutral blacks over accidental green-tinted backgrounds.
- Green remains available as a semantic color when meaningful (e.g. verified success/available); do not let green replace the canonical background or be used as fabricated status.
- Social information architecture can feel Facebook-familiar (feed, communities, creator profiles, comments, mobile navigation) without copying Facebook trade dress or shifting toward SteadLamp's gold/cream Home/Life/Business dashboard style.
- Do not give BigBased a generic dark AI chat shell as its home page; MyBased can have a separate personal AI chat experience.
- Do not reintroduce fake follower counts, mock community engagement represented as real, private extended profile fields or public email joins.

## Repository handoff / ownership of documents

- This **BigBased repository** owns the creator social product diagram, interoperability requirements, public/private profile projections, consented export workflow, client UX and the status of feature flags.
- **OpenTrestle platform repository** owns actual future conversation API/stream/attachment schemas, technical approval/receipt/dispatch contracts and system compatibility versioning; BigBased only imports approved versioned contracts.
- **SteadLamp repository** owns Companion/Desk/Room/Book/Pulse/Lane interpretation and Home/Life/Business domain permissions; no BigBased document grants SteadLamp broader access.
- **MyBased repository/product** (if/when established) owns private creator project/memory/AI conversation behavior; do not place its durable chat history in a BigBased social table.
- **OTPE repository** owns technical publishing provider adapter and delivery-reconciliation contracts, with its separate deployment/security approval gates.

**Next joint review, not an automatic integration:** compare precise contract versions, actor/tenant/resource refs, privacy model, consent/revocation, failure state and receipts across repos. Then implement small fictional end-to-end tests (MyBased artifact → BigBased private draft), keeping OpenTrestle adapters disabled.

## Acceptance and unresolved decisions

- [ ] Preserve 2025 BigBased profile exact blob and continue screenshot QA (375/390px mobile and desktop). Do not assume source-level tests establish rendered fidelity.
- [ ] Confirm product/brand names and boundaries in each repo without copying private examples or screenshot images into a public repository.
- [ ] Decide separate product identity and optional federation only after reviewed data processing/security requirements.
- [ ] Verify BigBased session unification, server-side authorization, RLS, privacy projections and moderation before real writes.
- [ ] Decide which components of creator drafts/AI assist are MyBased-only versus optional BigBased creator assistance; no duplicate private chat history.
- [ ] Decide whether OTPE is used for external distribution and under what separately approved provider/credential scopes.
- [ ] Confirm any business-side licensing relationship **before** commercial cross-product access is enabled.
- [ ] Run offline contract tests for default deny, revocation, cross-tenant and cross-product isolation; actual runtime transport/provider tests await approval.

**This document makes no new live connection and does not authorize data sharing, worker execution, AI inference, identity federation, provider keys, paid services or deployment.**
