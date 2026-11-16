// BigBased social domain prototype. All data is synthetic; no external I/O.
// This module is NOT an authentication provider. Actor must come only from a
// trusted server-side verifier, never from request bodies, cookies or headers.
import { randomUUID } from "node:crypto";
import { fixtureCreators, fixturePosts } from "./fixtures.mjs";

export function isReviewEnvironment(env = process.env) {
  return env.VERCEL_ENV === "preview" ||
    (env.NODE_ENV === "development" && env.VERCEL_ENV !== "production");
}

export function apiError(status, code) {
  return { ok: false, status, error: { error: code, request_id: "fictional-review" } };
}

const PUBLIC_CREATOR_FIELDS = Object.freeze([
  "creator_id", "username", "display_name", "bio", "avatar_url", "banner_url", "website",
]);

export function getPublicCreator(username, creators = fixtureCreators) {
  if (typeof username !== "string" || !/^[A-Za-z0-9_-]{3,30}$/.test(username)) return null;
  const record = creators.find((item) => item.username.toLowerCase() === username.toLowerCase());
  if (!record || record.public_opt_in !== true || record.status !== "active") return null;
  return Object.fromEntries(PUBLIC_CREATOR_FIELDS.map((key) => [key, record[key] ?? null]));
}

// Conceptual server-verified actor for deterministic policy tests.
// No HTTP route in this PR constructs one from client-controlled information.
function verifyActor(actor) {
  if (!actor || actor.verified !== true || typeof actor.userId !== "string" ||
      !actor.userId || typeof actor.tenantId !== "string" || !actor.tenantId) {
    return apiError(401, "AUTH_REQUIRED");
  }
  if (actor.product !== "bigbased") return apiError(403, "PRODUCT_SCOPE_DENIED");
  if (actor.revoked === true) return apiError(403, "AUTH_REVOKED");
  return null;
}

function parseCursor(input) {
  if (input === null || input === undefined || input === "") return null;
  if (typeof input !== "string" || input.length > 512 || !/^[A-Za-z0-9_-]+$/.test(input)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(input, "base64url").toString("utf8"));
    if (!parsed || parsed.v !== 1 || typeof parsed.t !== "string" ||
        !Number.isFinite(Date.parse(parsed.t)) || typeof parsed.id !== "string" ||
        !/^[0-9a-f-]{36}$/i.test(parsed.id)) return false;
    return { t: parsed.t, id: parsed.id };
  } catch {
    return false;
  }
}

function encodeCursor(post) {
  return Buffer.from(JSON.stringify({ v: 1, t: post.created_at, id: post.post_id })).toString("base64url");
}

function isVisibleToActor(post, creator, actor) {
  if (post.tenant_id !== actor.tenantId || creator.tenant_id !== actor.tenantId) return false;
  if (post.status !== "published" || creator.status !== "active") return false;
  if (actor.blockedCreatorIds?.includes(post.creator_id) ||
      actor.mutedCreatorIds?.includes(post.creator_id)) return false;
  if (!creator.public_opt_in && post.creator_id !== actor.userId) return false;
  switch (post.visibility) {
    case "public": return true;
    case "community": return !!post.community_id && actor.communityIds?.includes(post.community_id) === true;
    case "followers": return post.creator_id === actor.userId ||
      actor.followedCreatorIds?.includes(post.creator_id) === true;
    default: return false; // Private content is not part of the home feed.
  }
}

// Future database adapter MUST re-apply these constraints at the database/RLS
// boundary. This in-memory function alone does not protect live records.
export function listAuthorizedFeed({
  actor, cursor = null, limit = 20,
  creators = fixtureCreators, posts = fixturePosts,
} = {}) {
  const denied = verifyActor(actor);
  if (denied) return denied;
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) return apiError(400, "INVALID_LIMIT");
  const after = parseCursor(cursor);
  if (after === false) return apiError(400, "INVALID_CURSOR");

  const byId = new Map(creators.map((creator) => [creator.creator_id, creator]));
  const ordered = posts.filter((post) => {
    const creator = byId.get(post.creator_id);
    if (!creator || !isVisibleToActor(post, creator, actor)) return false;
    return !after || (post.created_at < after.t ||
      (post.created_at === after.t && post.post_id < after.id));
  }).sort((a, b) => b.created_at.localeCompare(a.created_at) ||
    b.post_id.localeCompare(a.post_id));

  const page = ordered.slice(0, limit);
  const items = page.map((post) => ({
    post_id: post.post_id,
    creator: getPublicCreator(byId.get(post.creator_id)?.username, creators),
    text: post.text,
    created_at: post.created_at,
    visibility: post.visibility,
  }));

  // Do not emit null or partial author projections in this initial slice.
  return {
    ok: true,
    status: 200,
    data: {
      items: items.filter((post) => post.creator !== null),
      next_cursor: ordered.length > limit ? encodeCursor(page[page.length - 1]) : null,
    },
  };
}

// No persistence occurs here. A real draft needs a separately reviewed and
// idempotent authenticated storage adapter.
export function preparePrivateDraft({ actor, input, idempotencyKey } = {}) {
  const denied = verifyActor(actor);
  if (denied) return denied;
  if (typeof idempotencyKey !== "string" || !/^[A-Za-z0-9_-]{8,128}$/.test(idempotencyKey)) {
    return apiError(400, "INVALID_IDEMPOTENCY_KEY");
  }
  if (!input || typeof input !== "object" || Array.isArray(input) ||
      Object.keys(input).some((key) => !["text", "community_id"].includes(key)) ||
      typeof input.text !== "string" ||
      !input.text.trim() || input.text.length > 20000) {
    return apiError(400, "INVALID_DRAFT");
  }
  if (input.community_id !== undefined && input.community_id !== null &&
      (typeof input.community_id !== "string" || !/^[0-9a-f-]{36}$/i.test(input.community_id))) {
    return apiError(400, "INVALID_COMMUNITY");
  }

  return {
    ok: true,
    status: 201,
    data: {
      draft_id: randomUUID(),
      status: "private-draft",
    },
    persisted: false, // Never claim the draft was actually saved.
  };
}
