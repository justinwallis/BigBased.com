import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const spec = JSON.parse(readFileSync(new URL("../../contracts/api/bigbased-social.openapi.json", import.meta.url), "utf8"))
const ops = Object.values(spec.paths).flatMap((item) => Object.values(item))

test("design-only REST/OpenAPI API version remains explicitly non-operational", () => {
  assert.equal(spec.openapi, "3.1.0")
  assert.equal(spec["x-review-status"], "offline-design-only")
  assert.match(spec.info.description, /not implemented or deployed/i)
  assert.deepEqual(Object.keys(spec.paths).sort(), ["/creators/{username}", "/feed", "/posts/drafts"].sort())
})

test("the public creator projection is minimal and prohibits unrecognized fields", () => {
  const profile = spec.components.schemas.CreatorPublic
  assert.equal(profile.additionalProperties, false)
  assert.deepEqual(Object.keys(profile.properties).sort(), [
    "creator_id", "username", "display_name", "bio", "avatar_url", "banner_url", "website"
  ].sort())
  for (const forbidden of ["email", "contact_info", "social_links", "_extended", "password", "billing_details"]) {
    assert.equal(profile.properties[forbidden], undefined)
  }
  assert.match(spec.paths["/creators/{username}"].get.description, /default deny/i)
})

test("the feed is authorization-scoped and cursor-paginated", () => {
  const feed = spec.paths["/feed"].get
  assert.deepEqual(feed.security, [{ SessionBearer: [] }])
  assert.match(feed.description, /visibility.*membership.*block/i)
  const params = Object.fromEntries(feed.parameters.map((p) => [p.name, p]))
  assert.equal(params.limit.schema.maximum, 50)
  assert.ok(params.cursor.schema.maxLength <= 512)
  assert.equal(spec.components.schemas.FeedPage.additionalProperties, false)
  assert.ok("403" in feed.responses)
  assert.ok("429" in feed.responses)
})

test("only private drafts can be created in v1 and idempotency is mandatory", () => {
  const action = spec.paths["/posts/drafts"].post
  assert.deepEqual(action.security, [{ SessionBearer: [] }])
  assert.ok(action.parameters.some((p) => p.name === "Idempotency-Key" && p.required))
  assert.equal(spec.components.schemas.DraftCreated.properties.status.const, "private-draft")
  assert.equal(spec.components.schemas.CreateDraft.additionalProperties, false)
  assert.ok(!("/posts/publish" in spec.paths))
})

test("all operations have documented success and safety error responses", () => {
  for (const op of ops) {
    assert.equal(typeof op.operationId, "string")
    assert.ok(Object.keys(op.responses).some((code) => code.startsWith("2")))
    assert.ok("429" in op.responses)
  }
})
