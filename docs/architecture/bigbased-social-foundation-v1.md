# BigBased Social Foundation — Implementation Readiness v1

**Status:** Approved strategic direction, preparatory review only. No live database, RLS policy, authentication, provider, publishing or production change authorized.

## Product ownership decision

**BigBased owns its social network and creator platform.** OpenTrestle supplies *optional* reusable AI, conversation, tools, automation and publishing-engine capabilities only through separately authorized product-scoped APIs. **MyBased.ai** is a separate personal AI creator workspace. **SteadLamp** remains a separate customer Home/Life/Business companion.

- BigBased: public creator identities and profiles, social graph, follows, posts, feeds, comments, reactions, communities, search, moderation decisions, discovery, creator-owned publishing and export.
- OpenTrestle: versioned technical conversation protocol, model/tool adapters, optional workflow automation, approval boundaries, receipts, and optional publishing-engine adapters. Does not own BigBased posts, follows, moderation policy, social data, private messages or community rules.
- MyBased.ai: personal private AI conversations, projects, drafts and creator workflows. User must specifically approve any content exported or posted to BigBased.
- SteadLamp: its own Home/Life/Business customer context and Spaces. No implicit data or conversation sharing with BigBased, MyBased, or privileged OpenTrestle Code/Console.

Business/company separation remains intact. A potential licensing/service relationship is not the same as shared corporate ownership, credentials, accounts, tenant access or databases.

## Source findings — not proof of working production behavior

Inspection of the recovered June 2025 branch found:
- Community page and actions for categories, topics, posts, replies, reactions, trending and search.
- CommunityClientLayout contains illustrative channel messages, unread numbers and tag counts; these are **mocked**, not verified real social activity.
- Community actions use Supabase queries as well as NextAuth session checks; several select all columns or join author records containing email. Auth/session and authorization must be reconciled.
- Profile actions persist extended personal/contact/location details inside the social_links field; private data must be separated from explicitly consented public fields. A previously permissive anonymous public-profile read policy was restricted before this work.
- The recovered /chat interface in draft PR #14 is visual-only with browser-local drafts, not a working AI integration.

Do not expose old author email joins or profile extended data, silently relax RLS, or interpret a passing preview build as functional/security readiness.

## Social-first MVP that can advance without an AI chat engine

1. **Creator identity:** username, public display name, avatar, cover, short bio, opt-in website, explicit public/private settings, onboarding, edit and delete/export flows. Public response MUST be a strict presentation projection, never an account table dump.
2. **Posts and communities:** authored drafts, posts, categories, topics and replies, revisions, attachment metadata, visibility, timestamps, pagination, accessible search and error/empty states.
3. **Social graph and feed:** follow/unfollow, mute, block, reactions, chronological baseline feed, notifications and discovery; no manufactured follower counts or popularity metrics.
4. **Moderation:** reports, community roles, review queue, rule decisions, audit history, appeal and anti-spam/rate limits. Optional OpenTrestle AI assistance may **propose** actions but cannot autonomously enforce BigBased community policies.
5. **Creator publishing:** import/export, creator-owned content, optional domain support and eventual consented distribution. No mandatory paid publishing SaaS, though domains, storage, hosting and model compute have costs.

**Defer until separately approved:** recommendation algorithms, subscriptions/payments, federation/ActivityPub, creator marketplace, real-time chat backends, native release, AI providers, and cross-service publication.

## Proposed OpenTrestle boundary

The adjacent design-only contract is in contracts/bigbased-social-integration.v1.json. It does not create an API or entitlement.

- BigBased authorizes each user, creator, community, content item and audience. The server must derive identity/tenant/membership from verified authority, **not** client-supplied product IDs alone.
- A future outbound request to OpenTrestle carries purpose, product scope, resource reference, stable request/idempotency ID, version and a reviewed authorization/consent reference. No user secrets or whole private profiles.
- OpenTrestle returns proposals, artifacts, delivery attempts and technical receipts; BigBased remains the only authoritative source for actual publication or moderation outcomes.
- Default-deny missing/invalid/revoked rights, unknown contract versions, malformed request scope and cross-product data access; keep private drafts private on failure.
- Creator-approved export from MyBased to BigBased is specific to the selected artifact, destination and visibility. It is not automatic synchronization of private AI history.
- Never let OpenTrestle social scheduling/OTPE adapters use one creator's destination credentials for another creator or tenant.

## Preparation we can implement NOW (no backend activation)

### Workstream A — UX and design
Preserve original visual assets and mobile presentation. Create synthetic creator profile, feed, post detail, new post, community category, onboarding, moderation queue, private/denied/empty/loading and light/dark fixtures. Audit responsive controls and accessibility.

### Workstream B — data and access modeling
Map existing tables, reads and writes against one future identity/session model and RLS ownership tests. Specify opt-in public profile presentation, private account metadata, content visibility, social graph, blocks/mutes, moderation and deletion/export. Do not run live migrations yet.

### Workstream C — isolated product implementation
Develop review-only creator profiles and community UI with fictional data, explicitly labeled mock indicators, functional non-privileged navigation, forms with validation and meaningful error states. No external writes until auth/RLS passed.

### Workstream D — independent integration contract
Use a versioned event envelope and projection allowlists; write offline contract tests for product isolation, revoked/missing authorization, source/target identity, idempotency and no publication without explicit approval. Keep the adapter disabled while OpenTrestle conversation/control-plane contracts remain under development.

## Gates before a public social launch

- [ ] Verify unified auth/session boundaries and per-user authorization with negative tests.
- [ ] Validate RLS for all community/post/reaction/social/storage/search tables and email-safe author projections.
- [ ] Separate consented public profile data from private contact and other extended fields.
- [ ] Remove or label mocked activity so that no placeholder is presented as real data.
- [ ] Verify moderation, blocking, visibility, rate limits and abuse reporting.
- [ ] Confirm data export/deletion and creator publication consent workflows.
- [ ] Mobile/desktop accessibility and visual QA against historical design; actual application functionality tests.
- [ ] Explicit production deployment review and backups; separate approvals for AI, infrastructure and any integrations.

## References

- BigBased/MyBased architecture [PR #16](https://github.com/justinwallis/BigBased.com/pull/16).
- BigBased preserved historic site and paused **legacy AI chat** handoff [issue #17](https://github.com/justinwallis/BigBased.com/issues/17).
- OpenTrestle conversation foundation [issue #156](https://github.com/OpenTrestle/opentrestle-platform/issues/156) and architecture [PR #155](https://github.com/OpenTrestle/opentrestle-platform/pull/155).
- SteadLamp customer assistant boundary [PR #28](https://github.com/OpenTrestle/steadlamp/pull/28).

**Key distinction:** the legacy BigBased chat-engine implementation is paused; BigBased social/community/profile and creator-publishing development is not paused.
