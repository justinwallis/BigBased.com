# BigBased Social v1 — Offline Implementation Slice

**Status:** draft, fictional-data-only, not a launched social API. Built on proposed [REST architecture PR #21](https://github.com/justinwallis/BigBased.com/pull/21) and [social visual preview PR #22](https://github.com/justinwallis/BigBased.com/pull/22).

## What this slice actually implements

- `lib/social-v1/fixtures.mjs`: five fictional creators and eight fictional posts across two synthetic tenants; opt-in/out and suspended profiles, public/community/followers/private/deleted records.
- `lib/social-v1/core.mjs`: a **pure, in-memory** projection/authorization demonstration. It handles public profile allowlisting, server-verified-actor-shaped feed scoping, visibility, community membership, follow graph, block/mute, chronological cursor pagination, and private-draft *validation only*.
- `tests/social-v1/core.test.mjs`: negative and positive policy tests with synthetic actor objects, including cross-product, cross-tenant, revoked and privacy-denial cases. A test actor is **not** a production authenticated user.
- Preview-only Next.js HTTP routes under `/api/v1`. All routes have no-store and noindex response headers.
- Social UI review: mobile center Create tab, existing Radix-powered accessible draft dialog, local-only reactions and bookmarks, light/dark theme control. The original BigBased brand logo is unchanged.

## Route status and hard boundaries

| HTTP route | Non-preview production | Local development or Vercel preview | Real data? |
| --- | --- | --- | --- |
| `GET /api/v1/creators/:username` | 404 | 200 for fictional opt-in creators; 404 otherwise | No |
| `GET /api/v1/feed` | 404 | 503 `AUTH_INTEGRATION_DISABLED` | No |
| `POST /api/v1/posts/drafts` | 404 | 503 `PERSISTENCE_DISABLED` | No |

**No real account-authenticated feed or durable draft endpoint is active.** The offline unit tests verify the proposed policy code, *not* production Supabase RLS, OAuth session identity, or a database adapter. They are not a substitute for integration and attack-path tests.

Do not enable the old NextAuth/Supabase-mixed community action endpoints to make this preview work. Do not relax the restricted public `profiles` SELECT policy. Do not expose historical nested `social_links._extended` details or author email joins.

## Creator publishing lifecycle (design and offline policy evaluation only)

The source now includes `lib/social-v1/publishing.mjs` and `tests/social-v1/publishing.test.mjs`. This defines proposal-only transitions:

```text
private-draft → review-requested → review-approved → publication-prepared
       ↑              |               |
       └── withdraw / reject ──────────┘ (review never publishes)
```

- Draft owner may submit/withdraw review; a separately scoped moderator may approve/reject, but may not approve their own post.
- Publication *preparation* requires matching owner consent, selected BigBased destination and actor-specific destination permissions.
- Every transition is evaluated against tenant, product, owner, expected draft version and status.
- **No function in this slice publishes, persists, records a true approval, or submits to OpenTrestle**. It returns an explicit `would_transition_to` and `persisted: false`, `published: false`.
- The caller's fictional `verified`, `moderator`, and `consent.verified` fields are trusted **only inside unit tests**, never from HTTP requests. An eventual server must verify authenticated identity, moderation membership and consent against authoritative records before committing a transition.
- The public REST `POST /api/v1/posts/drafts` route remains disabled with 503. There is no real publish endpoint.

## Running the offline tests

Use Node.js 20+:

```sh
node --test tests/social-v1/core.test.mjs \
  tests/contracts/bigbased-social-integration.test.mjs \
  tests/contracts/bigbased-social-openapi.test.mjs
```

The repository includes a read-only pull-request CI job for these tests; no npm install, secrets, database, models or external services are used. Compilation, responsive screenshots and user-flow QA remain separate required checks.

## Next safe implementation decisions

1. Visually inspect the isolated preview against the original 2025 mobile recordings. Test mobile/desktop, dark/light, focus/keyboard, scroll, modal, saved/bookmarked items and no fabricated activity.
2. Choose and verify the single authoritative user session and tenant/membership identity source; document public-profile opt-in and RLS decisions with the existing locked-down Supabase data.
3. Add real Postgres storage in a **separate test environment** with migrations, read/write RLS, author privacy projection, scope denial tests and immutable moderation audit. No live migration without a separate review.
4. Wire authorized feed and private draft endpoints to server-validated identity and RLS, add bounded pagination and idempotent writes. Never treat caller-supplied header/tenant IDs as permission proof.
5. Only after security and functional review, evaluate deployment, publishing distribution and optional OpenTrestle integration. MyBased private AI and SteadLamp customer data remain separate.

**Out of scope:** AI inference, OpenTrestle tool execution, MyBased integration, real account data, automated moderation, production deployments, new public accounts, real publish actions and a real chat backend.
