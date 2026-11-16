# BigBased Social Platform — Technology Decision and Facebook-Familiar UX v1

**Status:** Proposed for review (2026-11-16). Documentation and offline contract only. No new packages installed; no AI inference, service connection, database migration, authentication/policy change, deployment, app release or license acceptance.

## Recommendation

**Build an independent BigBased social product using the existing Next.js / React / TypeScript / Tailwind frontend, backed by a modular TypeScript application architecture and PostgreSQL.** Expose a versioned HTTP **REST API documented with OpenAPI** to web, mobile and future approved integrations. Avoid copying an entire PHP/Ruby social-network engine into the Next.js app.

REST is an **API interface style**, not the database, deployment platform, social engine or scaling mechanism. Use HTTPS/JSON REST for CRUD and public/mobile APIs, background event processing for fanout and publishing, and WebSockets or SSE only when a feature actually needs live updates.

Use **OpenAPI 3.1** for the first checked-in contract due to established tool support. OpenAPI 3.2.1 was published September 2026; a future toolchain upgrade can be independently reviewed. The draft spec under `contracts/api/bigbased-social.openapi.json` is **design only** and does not assert that any endpoint exists.

## Why this choice beats an entire network clone

The repository already contains Radix-based UI components, Tailwind, React 19, Next 15.2.8, Tiptap editor packages and TanStack Virtual. Some dependencies use floating "latest" versions. Preserve the original 2025 brand and UI while tightening dependency versions. A full platform fork introduces another framework/runtime, another identity/account system, difficult upgrades and possible copyleft/attribution obligations.

### GitHub building blocks evaluated

| Component or platform | Practical BigBased use | Fit and license | Decision |
| --- | --- | --- | --- |
| **shadcn/ui** ([GitHub](https://github.com/shadcn-ui/ui)) | Source-owned accessible UI composition | MIT; many current Radix components already cover needs | **Use existing primitives; selectively borrow** |
| **Tiptap** (already in package.json) | Rich text post composer, long-form creator content | Existing integration; evaluate package-specific/current license and extension constraints before upgrades | **Retain unless a tested gap** |
| **Lexical** ([GitHub](https://github.com/facebook/lexical)) | Alternative rich text editor | MIT; accessible and extensible | **Benchmark only; do not replace Tiptap by default** |
| **TanStack Virtual** ([GitHub](https://github.com/TanStack/virtual)) | Efficient rendering of long feeds | MIT; **already installed** | **Use** |
| **TanStack Query** ([GitHub](https://github.com/TanStack/query)) | Client cache, cursor pagination, server-state invalidation | MIT; not currently verified installed | **Candidate when API client is implemented** |
| **Uppy** ([GitHub](https://github.com/transloadit/uppy)) | Media upload progress and resumable tus/S3 uploads | MIT | **Candidate for upload workflow** |
| **BullMQ** ([GitHub](https://github.com/taskforcesh/bullmq)) | Durable notifications, post/media processing and external publication jobs | MIT; requires approved worker/queue environment | **Later, not needed for visual prototype** |
| **HumHub** ([GitHub](https://github.com/humhub/humhub)) | Study mature users, Spaces, feed, modular permissions and moderation | PHP/Yii, AGPL-3.0-related licensing | **Reference/evaluate only; not the primary codebase** |
| **Friendica** ([GitHub](https://github.com/friendica/friendica)) | Study privacy and federation | PHP, AGPL-3.0 | **Reference for later federation** |
| **Discourse** ([GitHub](https://github.com/discourse/discourse)) | Optional standalone forum/community engine | Ruby/Rails/Ember, GPL | **Only if forum becomes a separately hosted product** |
| **OSSN** ([GitHub](https://github.com/opensource-socialnetwork/opensource-socialnetwork)) | Study Facebook-like interaction inventory | PHP; repository reports Open Source Social Network License 4.0 / Cryptographic Autonomy License 1.0, NOT a generic MIT/GPL drop-in | **Do not fork/copy without independent legal/license review** |

These are **candidates**, not installed dependencies. Upstream security, sustainability, performance, license and version suitability require a fresh review when actually selected.

## Facebook-familiar but clearly BigBased

### Desktop
- Compact top navigation: BigBased mark, universal search, Home, Communities, Creator Studio, notifications and account menu.
- Left navigation: Feed, Friends/Following, Communities, Saved, Creator Studio and settings.
- Center: audience-aware composer, optional creator highlights, **chronological** feed by default, post cards with meaningful media and comment/reaction controls.
- Right: community discovery, relevant creator suggestions, upcoming events, privacy/help links. **Never fake** activity, counts or sponsored placements.
- Public creator profile: cover + avatar, visible follow action, creator projects/posts, community activity and publishing portfolio.

### Mobile
- Single-column content, readable composer and cards, fixed or adaptive bottom navigation for Home, Communities, Create, Notifications, Profile, with a compact top search.
- Avoid desktop sidebars covering content; accessible drawers for secondary views and touch targets.
- Support light/dark, keyboard, screen readers, reduced motion, large text and low-bandwidth media loading.

### Distinguish beyond Facebook
- Maintain original 2025 BigBased brand rather than Facebook logo/blue trade dress or an exact pixel-for-pixel copy.
- Creator ownership: export content, portable media, domain and publishing identities, clearer audiences and moderation transparency.
- Creator/community/publishing workflows get priority over ad-targeting and engagement manipulation.
- MyBased.ai personal AI stays a separately branded app/experience; cross-posting to BigBased requires creator confirmation.
- OpenTrestle future AI/publishing/automation is integrated through explicit consented, scoped service contracts; SteadLamp Home/Life/Business data is isolated.

## Proposed modular architecture

```text
BigBased Web (Next.js / React)         BigBased Mobile (future native app)
             \                         /
              v                       v
           REST/HTTPS API v1 — OpenAPI contract
                        |
         BigBased authenticated application boundary
         [creator/profile] [social graph] [posts/feed]
         [community] [moderation] [publishing]
                        |
        PostgreSQL (authoritative records + migrations)
              |                    |
      S3-compatible object storage  outbox / background worker (later)
           CDN (later)              notifications, media, syndication
                        |
           Optional future OpenTrestle adapter
           approval + scoped receipts (no shared social DB)
```

Begin as a **modular monolith**: one deployable backend with internal domain modules and a clean OpenAPI boundary. Split services only when measured throughput, reliability, operational ownership or isolation demands it. A high-scale vision does not require microservices immediately.

### Database and feed design
- PostgreSQL normalized records for creators, memberships, follows, blocks, posts, post visibility, reactions, comments, media, communities, moderation cases and publications.
- Stable identifiers, foreign keys, uniqueness and ownership restrictions; migration history and recoverable backups.
- Separate private account data from opt-in public creator projections; do not expose nested `social_links._extended`, contact email or billing details through public API.
- Simple indexed chronological **fanout-on-read** first, visibility-filtered and ordered by `(created_at, id)`; keyset/cursor pagination, per-page caps and server-enforced authorization.
- Add caches/search/async fanout after measurement; hybrid fanout for very large accounts later. No invented user-scale or latency promise.
- Media: direct-to-object-storage uploads with short-lived scoped tokens, validation, content type/size limits, processing and CDN only when approved.
- Notifications and publishing: transactional outbox, idempotent worker processing, retries/dead-letter handling and scoped delivery receipts when infrastructure is approved.

### API, security and operations standards
- HTTPS with resource-oriented JSON endpoints, OpenAPI schemas, consistent errors, stable IDs, input validation and explicit API versioning.
- Authenticated browser sessions and OAuth/OIDC if federated login or public clients require it; align with RFC 9700 (OAuth Security BCP) and RFC 10017 (browser apps) before implementation.
- **Resource-level authorization** on every operation; OWASP API Security Top 10 explicitly flags broken object-level authorization.
- Do not expose Supabase service-role credentials to clients; align real app session identity with PostgreSQL RLS and audit each table/view/search/media path.
- ETags where useful, bounded cursor pagination, conditional requests and idempotency keys for retryable writes.
- Structured logging (secrets/PII redacted), metrics/traces (OpenTelemetry candidate), SLOs, performance/load tests, backups and restoration drills before scale.
- Separate BigBased creator data from OpenTrestle operational data, SteadLamp customer/Space data and MyBased private AI histories.

## Existing repository risks that must be fixed before production
1. Community actions mix NextAuth session assumptions with Supabase clients. Determine and test the authoritative caller identity and RLS context before enabling mutations.
2. Some community queries use broad SELECTs or author email joins. Return minimal public projections.
3. Profile fields persist private data in nested extended JSON; public display must use an opt-in projection and not weaken current deny-by-default database policies.
4. Historical chat/community placeholder data must not be presented as real conversations or popularity counts.
5. `latest` dependency ranges and an older Next.js version require a reviewed, pinned dependency/lockfile update with compatibility and security tests. No blind bulk upgrades.

## Build sequence — workstreams 1, 2 and 3, no AI
1. **Design and offline demo**: source-derived Facebook-familiar layout and creator profile/community/posts/feeds, using existing libraries. Synthetic data prominently labeled.
2. **Data and security contracts**: review public/private creator schema, auth choice, RLS, moderation permissions; no production schema changes without separate approval.
3. **REST v1 implementation**: versioned read-only creator/profile and feed from fictional fixtures; then authorized write flows with independent test DB and negative authorization tests.
4. **Creator publishing**: drafts, export/import and consented syndication. OpenTrestle Publishing Engine becomes an optional adapter later; no implied access.
5. **Load, scale, release gates**: measure; add caches/queues and deploy topology only as justified. AI conversations and creator assistants remain outside these workstreams until OpenTrestle foundation is ready.

## Release and validation
- This PR is an architecture-and-API-contract review; does not implement HTTP handlers, create tables, run new background workers, install packages or change production.
- Review the original BigBased screenshots and first-party visual assets before implementation. Validate on mobile and desktop; verify feed loading and authorization with an isolated test environment.
- No reactivation of historical AI endpoints or reopening public profile RLS; no Facebook copyrighted source/assets, branding or exact proprietary interface copying.

**Other records:** [BigBased Social Foundation PR #18](https://github.com/justinwallis/BigBased.com/pull/18); [social MVP issue #19](https://github.com/justinwallis/BigBased.com/issues/19); [social security issue #20](https://github.com/justinwallis/BigBased.com/issues/20); [OpenTrestle Conversation issue #156](https://github.com/OpenTrestle/opentrestle-platform/issues/156).
