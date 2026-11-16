import test from "node:test"
import assert from "node:assert/strict"
import {
  apiError, getPublicCreator, isReviewEnvironment, listAuthorizedFeed,
  preparePrivateDraft,
} from "../../lib/social-v1/core.mjs"
import { fixtureCreators, fixturePosts } from "../../lib/social-v1/fixtures.mjs"

const creatorOne = "00000000-0000-4000-8000-000000000001"
const creatorTwo = "00000000-0000-4000-8000-000000000002"
const makeActor = (overrides = {}) => ({
  verified: true,
  product: "bigbased",
  tenantId: "tenant-fixture-one",
  userId: creatorOne,
  communityIds: [],
  followedCreatorIds: [],
  blockedCreatorIds: [],
  mutedCreatorIds: [],
  ...overrides,
})

test("review route policy denies production independently of NODE_ENV", () => {
  assert.equal(isReviewEnvironment({ VERCEL_ENV: "production", NODE_ENV: "production" }), false)
  assert.equal(isReviewEnvironment({ VERCEL_ENV: "production", NODE_ENV: "development" }), false)
  assert.equal(isReviewEnvironment({ VERCEL_ENV: "preview", NODE_ENV: "production" }), true)
  assert.equal(isReviewEnvironment({ NODE_ENV: "development" }), true)
  assert.equal(isReviewEnvironment({ NODE_ENV: "production" }), false)
})

test("public profile projection contains exactly seven approved fields", () => {
  const p = getPublicCreator("samplecreator")
  assert.ok(p)
  assert.deepEqual(Object.keys(p).sort(), [
    "creator_id", "username", "display_name", "bio", "avatar_url", "banner_url", "website",
  ].sort())
  assert.equal(p.username, "samplecreator")
  assert.equal(JSON.stringify(p).includes("NEVER_EXPOSE_PRIVATE_PROFILE"), false)
  assert.equal(JSON.stringify(p).includes("@example.invalid"), false)
  assert.equal(getPublicCreator("privatecreator"), null)
  assert.equal(getPublicCreator("disabledcreator"), null)
  assert.equal(getPublicCreator("../admin"), null)
  assert.equal(getPublicCreator("not-a-person"), null)
})

test("fixtures contain no actual account or post data and include a separate tenant", () => {
  assert.equal(fixtureCreators.length, 5)
  assert.equal(fixturePosts.length, 8)
  assert.ok(fixtureCreators.every((c) => c.creator_id.startsWith("00000000-")))
  assert.ok(fixturePosts.every((p) => p.post_id.startsWith("10000000-")))
  assert.ok(fixturePosts.some((p) => p.tenant_id === "tenant-fixture-other"))
})

test("missing, untrusted, wrong product and revoked actors fail closed", () => {
  assert.equal(listAuthorizedFeed().status, 401)
  assert.equal(listAuthorizedFeed({ actor: { userId: creatorOne, product: "bigbased", tenantId: "tenant-fixture-one" } }).status, 401)
  assert.equal(listAuthorizedFeed({ actor: makeActor({ product: "opentrestle" }) }).status, 403)
  assert.equal(listAuthorizedFeed({ actor: makeActor({ revoked: true }) }).status, 403)
  assert.equal(preparePrivateDraft({ input: { text: "hello" }, idempotencyKey: "example-key" }).status, 401)
})

test("an actor sees only permitted public, community and followed content", () => {
  const a = listAuthorizedFeed({ actor: makeActor() })
  assert.equal(a.ok, true)
  assert.deepEqual(a.data.items.map((p) => p.post_id), [
    "10000000-0000-4000-8000-000000000001",
    "10000000-0000-4000-8000-000000000002",
  ])
  const b = listAuthorizedFeed({ actor: makeActor({
    communityIds: ["community-fixture-one"], followedCreatorIds: [creatorTwo],
  }) })
  assert.deepEqual(b.data.items.map((p) => p.post_id), [
    "10000000-0000-4000-8000-000000000001",
    "10000000-0000-4000-8000-000000000002",
    "10000000-0000-4000-8000-000000000003",
    "10000000-0000-4000-8000-000000000004",
  ])
  const text = JSON.stringify(b)
  assert.ok(!text.includes("NEVER_EXPOSE_PRIVATE_PROFILE"))
  assert.ok(!text.includes("@example.invalid"))
  assert.ok(!text.includes("other tenant"))
  assert.ok(!text.includes("private draft"))
  assert.ok(!text.includes("Deleted posts"))
})

test("blocks and mutes hide creator content from the feed", () => {
  const denied = listAuthorizedFeed({ actor: makeActor({
    blockedCreatorIds: [creatorOne], mutedCreatorIds: [creatorTwo],
    followedCreatorIds: [creatorTwo], communityIds: ["community-fixture-one"],
  }) })
  assert.equal(denied.ok, true)
  assert.deepEqual(denied.data.items, [])
})

test("tenant boundaries override social visibility and creator membership", () => {
  const otherTenant = listAuthorizedFeed({ actor: makeActor({
    tenantId: "tenant-fixture-other",
    followedCreatorIds: [creatorOne, creatorTwo],
    communityIds: ["community-fixture-one"],
  }) })
  assert.deepEqual(otherTenant.data.items.map((p) => p.post_id),
    ["10000000-0000-4000-8000-000000000008"])
})

test("feed pagination is stable and invalid limits/cursors are rejected", () => {
  const pageOne = listAuthorizedFeed({ actor: makeActor(), limit: 1 })
  assert.equal(pageOne.ok, true)
  assert.equal(pageOne.data.items.length, 1)
  assert.equal(typeof pageOne.data.next_cursor, "string")
  const pageTwo = listAuthorizedFeed({
    actor: makeActor(), limit: 1, cursor: pageOne.data.next_cursor,
  })
  assert.equal(pageTwo.ok, true)
  assert.notEqual(pageOne.data.items[0].post_id, pageTwo.data.items[0].post_id)
  assert.equal(pageTwo.data.next_cursor, null)
  assert.equal(listAuthorizedFeed({ actor: makeActor(), limit: 0 }).status, 400)
  assert.equal(listAuthorizedFeed({ actor: makeActor(), limit: 51 }).status, 400)
  assert.equal(listAuthorizedFeed({ actor: makeActor(), cursor: "!!!" }).status, 400)
  assert.equal(listAuthorizedFeed({ actor: makeActor(), cursor: "e30" }).status, 400)
})

test("draft policy checks required idempotency, shape and access but never persists", () => {
  const input = { text: "  Hello creators!  " }
  const valid = preparePrivateDraft({ actor: makeActor(), input, idempotencyKey: "example-key" })
  assert.equal(valid.ok, true)
  assert.equal(valid.persisted, false)
  assert.equal(valid.data.status, "private-draft")
  assert.equal(valid.data.draft_id, undefined)
  assert.equal(preparePrivateDraft({ actor: makeActor(), input, idempotencyKey: "x" }).status, 400)
  assert.equal(preparePrivateDraft({ actor: makeActor(), input: { text: "" }, idempotencyKey: "example-key" }).status, 400)
  assert.equal(preparePrivateDraft({ actor: makeActor(), input: { text: "x", public: true }, idempotencyKey: "example-key" }).status, 400)
  assert.equal(preparePrivateDraft({ actor: makeActor({ product: "mybased" }), input, idempotencyKey: "example-key" }).status, 403)
})
