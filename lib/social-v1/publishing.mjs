// Fictional BigBased creator-publishing policy evaluation.
// No persistence, model call, authorization-token validation or external delivery.
// The actor and consent decisions MUST eventually come from a trusted server.
const STATE = Object.freeze({
  PRIVATE: "private-draft",
  REVIEW: "review-requested",
  APPROVED: "review-approved",
  READY: "publication-prepared",
});

function denied(status, error) {
  return { ok: false, status, error, persisted: false, published: false };
}

const ALLOWED_OPERATIONS = Object.freeze([
  "submit_review", "withdraw_review", "approve_review",
  "reject_review", "prepare_publication",
]);

// Pure policy/transition proposal. The returned state is NOT committed.
export function evaluateCreatorPublication({
  actor, draft, operation, expectedVersion,
  consent, destination,
} = {}) {
  if (!actor || actor.verified !== true || !actor.userId ||
      typeof actor.userId !== "string" || !actor.tenantId ||
      typeof actor.tenantId !== "string") {
    return denied(401, "AUTH_REQUIRED");
  }
  if (actor.product !== "bigbased" || actor.revoked === true) {
    return denied(403, "ACTOR_NOT_AUTHORIZED");
  }
  if (!draft || typeof draft !== "object" || Array.isArray(draft) ||
      typeof draft.id !== "string" || typeof draft.tenantId !== "string" ||
      typeof draft.ownerId !== "string" || typeof draft.status !== "string" ||
      !Object.values(STATE).includes(draft.status) ||
      !Number.isSafeInteger(draft.version) || draft.version < 0) {
    return denied(400, "INVALID_DRAFT_STATE");
  }
  // Avoid confirming the existence of another tenant's draft.
  if (draft.tenantId !== actor.tenantId) return denied(404, "NOT_FOUND");
  if (!Number.isSafeInteger(expectedVersion) || expectedVersion !== draft.version) {
    return denied(409, "VERSION_MISMATCH");
  }
  if (!ALLOWED_OPERATIONS.includes(operation)) {
    return denied(403, "DIRECT_PUBLICATION_DISABLED");
  }

  const isOwner = draft.ownerId === actor.userId;
  const isModerator = actor.moderator === true &&
    Array.isArray(actor.moderatedCommunityIds) &&
    draft.communityId !== null && typeof draft.communityId === "string" &&
    actor.moderatedCommunityIds.includes(draft.communityId) &&
    !isOwner;

  let nextState;
  switch (operation) {
    case "submit_review":
      if (!isOwner) return denied(403, "OWNER_REQUIRED");
      if (draft.status !== STATE.PRIVATE) return denied(409, "INVALID_TRANSITION");
      nextState = STATE.REVIEW;
      break;
    case "withdraw_review":
      if (!isOwner) return denied(403, "OWNER_REQUIRED");
      if (draft.status !== STATE.REVIEW) return denied(409, "INVALID_TRANSITION");
      nextState = STATE.PRIVATE;
      break;
    case "approve_review":
    case "reject_review":
      if (!isModerator) return denied(403, "MODERATOR_REQUIRED");
      if (draft.status !== STATE.REVIEW) return denied(409, "INVALID_TRANSITION");
      nextState = operation === "approve_review" ? STATE.APPROVED : STATE.PRIVATE;
      break;
    case "prepare_publication":
      if (!isOwner) return denied(403, "OWNER_REQUIRED");
      if (draft.status !== STATE.APPROVED) return denied(409, "REVIEW_NOT_APPROVED");
      // Consent and destination are trusted *evaluated* inputs in this offline
      // model, not user-supplied evidence of permission in a real service.
      if (!consent || consent.verified !== true ||
          consent.ownerId !== actor.userId || consent.draftId !== draft.id ||
          typeof consent.ref !== "string" || consent.ref.length < 8 ||
          !destination || destination.product !== "bigbased" ||
          destination.kind !== "community" ||
          destination.communityId !== draft.communityId ||
          !Array.isArray(actor.publishableCommunityIds) ||
          !actor.publishableCommunityIds.includes(destination.communityId)) {
        return denied(403, "EXPLICIT_CONSENT_AND_DESTINATION_REQUIRED");
      }
      nextState = STATE.READY;
      break;
  }

  return {
    ok: true,
    status: 200,
    evaluation: {
      operation,
      draft_ref: draft.id,
      from: draft.status,
      would_transition_to: nextState,
      would_increment_to_version: draft.version + 1,
    },
    persisted: false,
    published: false,
    requires_authorized_commit: true,
  };
}

export const CREATOR_PUBLICATION_STATES = STATE;
