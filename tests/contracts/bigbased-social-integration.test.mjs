import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const file = new URL("../../contracts/bigbased-social-integration.v1.json", import.meta.url)
const contract = JSON.parse(readFileSync(file, "utf8"))

test("contract is an inert BigBased-owned integration proposal", () => {
  assert.equal(contract.contractVersion, "bigbased.social.integration.v1")
  assert.equal(contract.status, "proposed-offline-only")
  assert.equal(contract.ownsProduct, "bigbased")
  assert.equal(contract.optionalServiceProvider, "opentrestle")
  assert.equal(contract.publicationOwner, "bigbased")
  assert.equal(contract.moderationDecisionOwner, "bigbased")
})

test("social operations are denied by default and never publish or moderate automatically", () => {
  assert.equal(contract.authorization.default, "deny")
  assert.equal(contract.authorization.crossProductAccess, "not-implicit")
  assert.equal(contract.authorization.requiresVerifiedResourceScope, true)
  assert.equal(contract.authorization.requiresFreshAuthorization, true)
  assert.equal(contract.authorization.requiresExplicitActionApproval, true)
  assert.equal(contract.authorization.allowAutomatedPublication, false)
  assert.equal(contract.authorization.allowAutomatedModerationEnforcement, false)
  assert.ok(contract.integrationRequests.length > 0)
  for (const operation of contract.integrationRequests) {
    assert.equal(operation.authority, "bigbased")
    assert.equal(operation.service, "opentrestle")
    assert.equal(operation.sideEffectOnSocialContent, false)
    assert.equal(operation.requiresConsent, true)
    assert.match(operation.result, /only$/)
  }
})

test("public creator profile fields are allowlisted without sensitive extended data", () => {
  assert.equal(contract.publicProfilePublication, "explicit-creator-opt-in")
  assert.equal(new Set(contract.allowedPublicProfileFields).size, contract.allowedPublicProfileFields.length)
  const publicFields = new Set(contract.allowedPublicProfileFields)
  for (const forbidden of contract.neverExposeInPublicProfile) {
    assert.ok(!publicFields.has(forbidden), forbidden)
  }
  assert.ok(!publicFields.has("email"))
  assert.ok(!publicFields.has("social_links"))
})

test("synthetic request contains explicit scope and a stable idempotency key", () => {
  const request = contract.exampleFictionalRequest
  for (const field of contract.requiredRequestFields) {
    assert.equal(typeof request[field], "string", field)
    assert.ok(request[field].length > 0, field)
  }
  assert.equal(request.product, "bigbased")
  assert.equal(request.contractVersion, contract.contractVersion)
  for (const field of Object.keys(request.payload)) {
    assert.ok(contract.allowedRequestPayload.includes(field), field)
  }
  for (const field of contract.disallowedRequestPayload) {
    assert.ok(!(field in request.payload), field)
  }
  for (const field of contract.serverDerivedFields) {
    assert.ok(contract.requiredRequestFields.includes(field), field)
  }
})

test("no implicit imports of other products or private AI histories", () => {
  assert.ok(contract.noImplicitConsumerSync.includes("steadlamp"))
  assert.ok(contract.noImplicitConsumerSync.includes("mybased.ai"))
  assert.ok(contract.noImplicitConsumerSync.includes("opentrestle.code"))
  assert.ok(contract.disallowedRequestPayload.includes("full_private_chat_history"))
})
