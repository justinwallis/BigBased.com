import test from "node:test"
import assert from "node:assert/strict"
import {
  CREATOR_PUBLICATION_STATES as STATE,
  evaluateCreatorPublication as evaluate,
} from "../../lib/social-v1/publishing.mjs"

const ownerId = "creator-1"
const otherId = "creator-2"
const communityId = "community-1"
const draft = Object.freeze({
  id: "draft-001", tenantId: "tenant-1",
  ownerId, communityId, status: STATE.PRIVATE, version: 0,
})
const owner = Object.freeze({
  verified: true, product: "bigbased", userId: ownerId,
  tenantId: "tenant-1", publishableCommunityIds: [communityId],
  moderatedCommunityIds: [], moderator: false,
})
const moderator = Object.freeze({
  verified: true, product: "bigbased", userId: otherId,
  tenantId: "tenant-1", publishableCommunityIds: [],
  moderatedCommunityIds: [communityId], moderator: true,
})
const consent = Object.freeze({
  verified: true, ownerId, draftId: "draft-001", ref: "synthetic-consent-001",
})
const destination = Object.freeze({
  product: "bigbased", kind: "community", communityId,
})

test("only an authenticated, in-tenant owner may propose review", () => {
  const accepted = evaluate({ actor: owner, draft, operation: "submit_review", expectedVersion: 0 })
  assert.equal(accepted.ok, true)
  assert.equal(accepted.evaluation.from, STATE.PRIVATE)
  assert.equal(accepted.evaluation.would_transition_to, STATE.REVIEW)
  assert.equal(accepted.evaluation.would_increment_to_version, 1)
  assert.equal(accepted.persisted, false)
  assert.equal(accepted.published, false)
  assert.equal(accepted.requires_authorized_commit, true)
  assert.equal(evaluate({ draft, operation: "submit_review", expectedVersion: 0 }).status, 401)
  assert.equal(evaluate({ actor: { ...owner, verified: false }, draft, operation: "submit_review", expectedVersion: 0 }).status, 401)
  assert.equal(evaluate({ actor: { ...owner, product: "steadlamp" }, draft, operation: "submit_review", expectedVersion: 0 }).status, 403)
  assert.equal(evaluate({ actor: { ...owner, revoked: true }, draft, operation: "submit_review", expectedVersion: 0 }).status, 403)
  assert.equal(evaluate({ actor: { ...owner, userId: otherId }, draft, operation: "submit_review", expectedVersion: 0 }).status, 403)
  assert.equal(evaluate({ actor: { ...owner, tenantId: "tenant-2" }, draft, operation: "submit_review", expectedVersion: 0 }).status, 404)
})

test("review and optimistic version boundaries fail closed", () => {
  assert.equal(evaluate({ actor: owner, draft, operation: "submit_review", expectedVersion: 1 }).status, 409)
  assert.equal(evaluate({ actor: owner, draft, operation: "prepare_publication", expectedVersion: 0, consent, destination }).status, 409)
  assert.equal(evaluate({ actor: owner, draft, operation: "publish", expectedVersion: 0 }).status, 403)
  assert.equal(evaluate({ actor: owner, draft, operation: "auto_publish", expectedVersion: 0 }).status, 403)
  assert.equal(evaluate({ actor: owner, draft: { ...draft, version: -1 }, operation: "submit_review", expectedVersion: -1 }).status, 400)
  assert.equal(evaluate({ actor: owner, draft: { ...draft, status: "published" }, operation: "submit_review", expectedVersion: 0 }).status, 400)
})

test("a separately authorized moderator may approve but not approve own draft", () => {
  const requested = { ...draft, status: STATE.REVIEW, version: 1 }
  assert.equal(evaluate({ actor: owner, draft: requested, operation: "approve_review", expectedVersion: 1 }).status, 403)
  assert.equal(evaluate({ actor: { ...moderator, moderator: false }, draft: requested, operation: "approve_review", expectedVersion: 1 }).status, 403)
  assert.equal(evaluate({ actor: { ...moderator, moderatedCommunityIds: [] }, draft: requested, operation: "approve_review", expectedVersion: 1 }).status, 403)
  const result = evaluate({ actor: moderator, draft: requested, operation: "approve_review", expectedVersion: 1 })
  assert.equal(result.ok, true)
  assert.equal(result.evaluation.would_transition_to, STATE.APPROVED)
  assert.equal(result.persisted, false)
  const rejected = evaluate({ actor: moderator, draft: requested, operation: "reject_review", expectedVersion: 1 })
  assert.equal(rejected.evaluation.would_transition_to, STATE.PRIVATE)
})

test("publication preparation requires independent review and explicit matching consent", () => {
  const reviewed = { ...draft, status: STATE.APPROVED, version: 2 }
  for (const badConsent of [
    undefined, {}, { ...consent, verified: false },
    { ...consent, ownerId: "another-owner" },
    { ...consent, draftId: "another-draft" },
    { ...consent, ref: "" },
  ]) {
    const denied = evaluate({ actor: owner, draft: reviewed, operation: "prepare_publication",
      expectedVersion: 2, consent: badConsent, destination })
    assert.equal(denied.status, 403)
    assert.equal(denied.published, false)
  }
  const allowed = evaluate({ actor: owner, draft: reviewed, operation: "prepare_publication",
    expectedVersion: 2, consent, destination })
  assert.equal(allowed.ok, true)
  assert.equal(allowed.evaluation.would_transition_to, STATE.READY)
  assert.equal(allowed.published, false)
  assert.equal(allowed.persisted, false)
})

test("destination and product boundaries prevent cross-community or cross-product posting", () => {
  const reviewed = { ...draft, status: STATE.APPROVED, version: 2 }
  for (const badDestination of [
    undefined,
    { ...destination, product: "opentrestle" },
    { ...destination, kind: "external-social" },
    { ...destination, communityId: "another-community" },
  ]) {
    assert.equal(evaluate({ actor: owner, draft: reviewed, operation: "prepare_publication",
      expectedVersion: 2, consent, destination: badDestination }).status, 403)
  }
  assert.equal(evaluate({ actor: { ...owner, publishableCommunityIds: [] },
    draft: reviewed, operation: "prepare_publication",
    expectedVersion: 2, consent, destination }).status, 403)
})

test("withdraw review requires owner and never publishes or persists", () => {
  const requested = { ...draft, status: STATE.REVIEW, version: 1 }
  const allowed = evaluate({ actor: owner, draft: requested, operation: "withdraw_review", expectedVersion: 1 })
  assert.equal(allowed.ok, true)
  assert.equal(allowed.evaluation.would_transition_to, STATE.PRIVATE)
  assert.equal(allowed.published, false)
  assert.equal(allowed.persisted, false)
  assert.equal(evaluate({ actor: moderator, draft: requested, operation: "withdraw_review", expectedVersion: 1 }).status, 403)
})
