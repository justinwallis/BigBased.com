// Server-side-only projection for the fictional BigBased visual review.
// Never import this module into a client component. The raw fixture contains
// synthetic private fields used to test public projection filtering.
import { getPublicCreator, listAuthorizedFeed } from "./core.mjs";

const PREVIEW_ACTOR = Object.freeze({
  verified: true,
  product: "bigbased",
  tenantId: "tenant-fixture-one",
  userId: "00000000-0000-4000-8000-000000000001",
  communityIds: [],
  followedCreatorIds: [],
  blockedCreatorIds: [],
  mutedCreatorIds: [],
});

const POST_PRESENTATION = Object.freeze({
  "10000000-0000-4000-8000-000000000001": {
    community: "Creator Commons", topic: "Creator independence", avatarClass: "bg-violet-600",
  },
  "10000000-0000-4000-8000-000000000002": {
    community: "Independent Publishing", topic: "Independent publishing", avatarClass: "bg-amber-700",
  },
  "10000000-0000-4000-8000-000000000003": {
    community: "Community Showcase", topic: "Community conversations", avatarClass: "bg-violet-800",
  },
  "10000000-0000-4000-8000-000000000004": {
    community: "Creator Commons", topic: "Following creators", avatarClass: "bg-slate-800",
  },
});

export function getFictionalReviewFeed() {
  const result = listAuthorizedFeed({ actor: PREVIEW_ACTOR, limit: 20 });
  if (!result.ok) return [];
  return result.data.items.map((post) => {
    const creator = post.creator;
    const presentation = POST_PRESENTATION[post.post_id];
    // This route is reachable without a real account. Only public examples
    // may be passed into its client props, even when all data is fictional.
    if (!creator || !presentation || post.visibility !== "public") return null;

    const initials = creator.display_name.split(/\s+/).slice(0, 2)
      .map((part) => part.slice(0, 1).toUpperCase()).join("");
    return {
      id: post.post_id,
      username: creator.username,
      author: creator.display_name,
      handle: "@" + creator.username,
      initials,
      community: presentation.community,
      time: "Fictional sample",
      text: post.text,
      topic: presentation.topic,
      avatarClass: presentation.avatarClass,
    };
  }).filter(Boolean);
}

export function getFictionalReviewCreator(username) {
  const publicCreator = getPublicCreator(username);
  // This preview intentionally displays only fictional local-tenant creators.
  // Global creator discovery and cross-tenant access are separate designs.
  if (!publicCreator || !["samplecreator", "fictionalstudio"].includes(publicCreator.username)) {
    return null;
  }
  const posts = getFictionalReviewFeed().filter((post) => post.username === publicCreator.username);
  return { ...publicCreator, posts };
}
