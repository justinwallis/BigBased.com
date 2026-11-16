# BigBased / MyBased Creator AI — Product Boundaries v1

**Status:** Accepted strategic direction; documentation only (2026-11-15).
**Cross-product authority:** [OpenTrestle Conversation Product Family PR #155](https://github.com/OpenTrestle/opentrestle-platform/pull/155), `docs/architecture/conversation-product-family-v1.md`.

## Which product does what?

- **BigBased.com:** the creator/community/publishing destination: profiles, discovery, social/community interaction, independent publishing and eventually creator-approved sharing.
- **MyBased.ai:** the personal AI and creator workspace: research, drafting, project work, exploration, preparation and optional share/publish actions. Aim for a polished, familiar, ChatGPT-like **mobile interaction model** with a distinct MyBased/BigBased visual identity.
- **OpenTrestle:** the separate technology foundation and developer/operator application. It is the proposed first implementation home for reusable conversation and tool/approval contracts; this does not legally merge OpenTrestle LLC with any Based Enterprise or BigBased operator.
- **SteadLamp:** a different, calm Home/Life/Business customer companion using only specifically authorized consumer-level capabilities. Neither MyBased nor BigBased inherits its private household or business contexts.

Treat **BigBased.ai** as a possible AI-related brand/entry domain, not a promise of a unified backend.

## Why not ship the June 2025 chat as the shared engine?

The historical BigBased chat visuals are valuable. Preserve brand elements and UX references in [draft chat restoration PR #14](https://github.com/justinwallis/BigBased.com/pull/14). Its current UI review stores only browser-tab drafts; it has **no functioning AI integration or durable account conversations**. Follow-up security, retrieval isolation, AI and persistence are tracked in [issue #15](https://github.com/justinwallis/BigBased.com/issues/15).

**Do not** promote the old streaming/RAG provider code directly to production or transplant it into OpenTrestle. Recover the experience as a design reference; build on reviewed scoped conversation contracts instead.

## Proposed end-user experiences

1. **MyBased.ai web/mobile:** focused composer, history, attachments, streaming, optional model and project context, privacy controls, accessible mobile navigation and creator-specific actions. It may use reusable React components (evaluate `assistant-ui`, Vercel Chatbot, LibreChat) but should own its UI, identity, storage and authorization.
2. **BigBased.com community:** profile, social, publishing and contextual creator discussions; not an unqualified mirror of personal AI conversations.
3. **Optional intentional handoff:** user reviews and approves exactly which MyBased output becomes a BigBased draft, asset or community post; must preserve attribution, permissions, consent, auditability, revocation and failure state.
4. **Independent branding/apps:** MyBased can have its own separately installable application. Shared conversation contracts do not mean a single white-label interface or merged user records.

## Platform, privacy and commercial boundaries

- Default deny cross-product reads; keep customer identity, histories, creator content, tenants, permissions, private files and model-provider credentials separate unless future explicit federation is approved.
- Do not require creators to subscribe to Ghost or another paid third-party publishing SaaS. Self-host/open-source software can reduce vendor lock-in; compute, storage, hosting, domain and model costs still exist.
- A technical licensing/service arrangement between OpenTrestle and a Based Enterprise/BigBased operator is **undecided**; no implied common ownership or shared private database.
- Any actual AI model selection, provider API key, inference spending, persistent chat data, federation or public launch requires a separate security and release decision.

## Implementation direction

Build the cross-product **protocol and offline Chat → Code → Console acceptance path** first in OpenTrestle. Explore MyBased's creator-oriented interface **in parallel**. Then adopt the reviewed protocol behind independent MyBased services and opt-in BigBased publishing integrations. Do not block community design or historical visual review on provider activation.

This document is a roadmap/decision record, not a working implementation and not a merge authorization.
