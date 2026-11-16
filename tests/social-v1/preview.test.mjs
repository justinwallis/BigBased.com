import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  getFictionalReviewFeed,
  getFictionalReviewCreator,
} from "../../lib/social-v1/preview.mjs"

test("review feed uses the single policy-filtered fictional social source", () => {
  const feed = getFictionalReviewFeed()
  assert.equal(feed.length, 4)
  assert.deepEqual(feed.map((post) => post.username), [
    "samplecreator", "fictionalstudio", "samplecreator", "fictionalstudio",
  ])
  assert.ok(feed.every((post) => post.time === "Fictional sample"))
  assert.ok(feed.every((post) => post.id.startsWith("10000000-")))
  assert.ok(feed.every((post) => /^[a-z0-9_-]+$/.test(post.username)))
})

test("server projection never ships the fixture's private account fields", () => {
  const data = JSON.stringify(getFictionalReviewFeed())
  for (const forbidden of [
    "private_email", "@example.invalid", "social_links", "_extended",
    "NEVER_EXPOSE_PRIVATE_PROFILE", "tenant_id", "creator_id",
    "follower_count", "contact_info", "password",
  ]) {
    assert.equal(data.includes(forbidden), false, forbidden)
  }
  assert.equal(data.includes("suspended user's"), false)
  assert.equal(data.includes("private draft"), false)
  assert.equal(data.includes("Deleted posts"), false)
  assert.equal(data.includes("separate fictional tenant"), false)
})

test("fictional creator page respects public opt-in and preview tenant boundary", () => {
  const creator = getFictionalReviewCreator("samplecreator")
  assert.equal(creator.username, "samplecreator")
  assert.equal(creator.posts.length, 2)
  assert.ok(creator.posts.every((post) => post.username === "samplecreator"))
  const text = JSON.stringify(creator)
  assert.equal(text.includes("private_email"), false)
  assert.equal(text.includes("NEVER_EXPOSE_PRIVATE_PROFILE"), false)
  assert.equal(getFictionalReviewCreator("privatecreator"), null)
  assert.equal(getFictionalReviewCreator("disabledcreator"), null)
  assert.equal(getFictionalReviewCreator("externalcreator"), null)
  assert.equal(getFictionalReviewCreator("does-not-exist"), null)
})

test("preview UI consumes safe server props, not raw private fixture modules", () => {
  const client = readFileSync(
    new URL("../../components/social-preview/SocialFeedPreviewClient.tsx", import.meta.url), "utf8",
  )
  const page = readFileSync(
    new URL("../../app/visual-review/social/page.tsx", import.meta.url), "utf8",
  )
  const profile = readFileSync(
    new URL("../../app/visual-review/social/creator/[username]/page.tsx", import.meta.url), "utf8",
  )
  assert.match(page, /getFictionalReviewFeed\(\)/)
  assert.match(page, /isReviewEnvironment\(\)/)
  assert.match(profile, /getFictionalReviewCreator\(username\)/)
  assert.match(profile, /isReviewEnvironment\(\)/)
  assert.match(client, /seedPosts\.filter\(/)
  assert.match(client, /\/visual-review\/social\/creator/)
  assert.doesNotMatch(client, /social-v1\/fixtures|social-v1\/core|social-v1\/preview/)
  assert.doesNotMatch(client, /\bfetch\s*\(/)
})
