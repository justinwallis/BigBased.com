# Big Based

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/justinwallis-projects/bigbased.com)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/CuzQBoDUmsW)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Creator AI product architecture (documentation only)

The accepted strategy is recorded in [BigBased / MyBased Creator AI Product Boundaries v1](docs/architecture/creator-ai-product-boundaries-v1.md), with the shared technology approach in [OpenTrestle architecture PR #155](https://github.com/OpenTrestle/opentrestle-platform/pull/155). BigBased.com remains the creator/community/publishing destination; MyBased.ai is planned as a separate personal AI workspace and app. The restored historical `/chat` remains a visual-reference draft, not approved AI infrastructure. No public deployment or customer account federation is authorized by this document.

## BigBased in the OpenTrestle product family (review only)

The [BigBased Product-Family Fit and Integration Blueprint v1](docs/architecture/bigbased-product-family-fit-v1.md) clarifies which parts BigBased owns independently, how optional MyBased.ai draft handoff and OpenTrestle/OTPE services would work behind explicit creator consent and separate product authority, and why SteadLamp private Home/Life/Business data never flows into BigBased by default. The original 2025 BigBased dark visual identity stays authoritative. **No live service, identity linkage or publishing integration is enabled by this proposal.**

## Social foundation preparation (no live integration)

BigBased owns the creator/community/social product independently of the OpenTrestle technology platform. See [BigBased Social Foundation v1](docs/architecture/bigbased-social-foundation-v1.md) for the source inventory, public/private profile boundary, community roadmap, and release gates. The [versioned social integration fixture](contracts/bigbased-social-integration.v1.json) and [offline tests](tests/contracts/bigbased-social-integration.test.mjs) document a future default-deny BigBased-to-OpenTrestle adapter; they do not connect services, enable models, or modify data. Validate the fixture with `node --test tests/contracts/bigbased-social-integration.test.mjs`.

## Deployment

Your project is live at:

**[https://BigBased.com](https://BigBased.com)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/CuzQBoDUmsW](https://v0.dev/chat/projects/CuzQBoDUmsW)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
