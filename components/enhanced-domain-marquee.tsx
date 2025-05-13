"use client"

import type React from "react"
import { useEffect, useRef, useState, useMemo } from "react"
import { Globe, Gauge } from "lucide-react"

// Sample domain names with TLDs and categories - we'll use these directly instead of the generator
// to ensure we have immediate data to display
const INITIAL_DOMAINS = [
  { name: "freedom.org", category: "organization" },
  { name: "liberty-tech.com", category: "company" },
  { name: "patriot-university.edu", category: "education" },
  { name: "truth-network.org", category: "organization" },
  { name: "sovereign-systems.io", category: "technology" },
  { name: "heritage-alliance.org", category: "organization" },
  { name: "liberty-college.edu", category: "education" },
  { name: "constitutional-rights.org", category: "organization" },
  { name: "digital-sovereignty.com", category: "company" },
  { name: "parallel-economy.net", category: "network" },
  { name: "faith-freedom.org", category: "organization" },
  { name: "american-values.com", category: "company" },
  { name: "truth-archives.org", category: "organization" },
  { name: "decentralized-future.io", category: "technology" },
  { name: "free-speech-platform.com", category: "company" },
  { name: "patriot-media.org", category: "organization" },
  { name: "liberty-foundation.org", category: "organization" },
  { name: "freedom-press.com", category: "company" },
  { name: "sovereign-citizen.net", category: "network" },
  { name: "constitution-first.org", category: "organization" },
  { name: "american-heritage.edu", category: "education" },
  { name: "truth-seekers.net", category: "network" },
  { name: "liberty-news.com", category: "company" },
  { name: "freedom-tech.io", category: "technology" },
  { name: "patriot-network.org", category: "organization" },
  { name: "sovereign-nation.com", category: "company" },
  { name: "freedom-alliance.org", category: "organization" },
  { name: "liberty-institute.edu", category: "education" },
  { name: "american-values.org", category: "organization" },
  { name: "truth-media.com", category: "company" },
  { name: "patriot-forum.net", category: "network" },
  { name: "freedom-university.edu", category: "education" },
  { name: "liberty-press.org", category: "organization" },
  { name: "sovereign-tech.io", category: "technology" },
  { name: "constitution-defenders.com", category: "company" },
  { name: "american-freedom.org", category: "organization" },
  { name: "truth-coalition.net", category: "network" },
  { name: "liberty-digital.com", category: "company" },
  { name: "freedom-network.org", category: "organization" },
  { name: "patriot-tech.io", category: "technology" },
  { name: "sovereign-media.com", category: "company" },
  { name: "freedom-institute.edu", category: "education" },
  { name: "liberty-nation.org", category: "organization" },
  { name: "american-truth.net", category: "network" },
  { name: "truth-university.edu", category: "education" },
  { name: "patriot-press.com", category: "company" },
  { name: "sovereign-alliance.org", category: "organization" },
  { name: "freedom-coalition.net", category: "network" },
  { name: "liberty-media.com", category: "company" },
  { name: "american-patriot.org", category: "organization" },
]

// Generate more domains by combining prefixes and suffixes
const generateMoreDomains = () => {
  const prefixes = [
    "freedom",
    "liberty",
    "patriot",
    "truth",
    "sovereign",
    "heritage",
    "faith",
    "american",
    "constitution",
    "republic",
    "eagle",
    "flag",
    "star",
    "stripe",
    "defend",
    "protect",
    "secure",
    "free",
    "brave",
    "bold",
    "strong",
    "united",
    "independent",
    "righteous",
    "just",
    "honest",
    "loyal",
    "faithful",
    "traditional",
    "conservative",
    "classic",
    "founding",
    "pioneer",
    "frontier",
    "heartland",
    "homeland",
    "nation",
    "country",
    "state",
    "local",
    "community",
    "family",
    "values",
    "principle",
    "virtue",
    "honor",
    "duty",
    "service",
    "sacrifice",
    "courage",
    "valor",
    "hero",
    "legacy",
    "history",
    "heritage",
    "tradition",
    "culture",
    "society",
    "citizen",
    "voter",
    "rights",
    "liberty",
    "justice",
    "law",
    "order",
    "peace",
    "security",
    "defense",
    "military",
    "veteran",
    "warrior",
    "fighter",
    "guardian",
    "shield",
    "sword",
    "arrow",
    "rifle",
    "gun",
    "ammo",
    "tactical",
    "strategic",
    "victory",
    "win",
    "triumph",
    "succeed",
    "achieve",
    "excel",
    "lead",
    "guide",
    "direct",
    "steer",
    "navigate",
    "chart",
    "map",
    "compass",
    "north",
    "south",
    "east",
    "west",
    "central",
    "united",
    "allied",
    "coalition",
    "federation",
    "union",
    "league",
    "alliance",
    "pact",
    "accord",
    "treaty",
    "agreement",
    "contract",
    "covenant",
    "pledge",
    "oath",
    "vow",
    "promise",
    "commit",
    "dedicate",
    "devote",
    "consecrate",
    "sanctify",
    "bless",
    "pray",
    "worship",
    "revere",
    "respect",
    "honor",
    "esteem",
    "admire",
    "digital",
    "cyber",
    "tech",
    "data",
    "info",
    "knowledge",
    "wisdom",
    "insight",
    "vision",
    "sight",
    "view",
    "perspective",
    "angle",
    "approach",
    "method",
    "system",
    "process",
    "procedure",
    "protocol",
    "standard",
    "benchmark",
    "measure",
    "metric",
    "index",
    "indicator",
    "signal",
    "sign",
    "symbol",
    "emblem",
    "badge",
    "insignia",
    "mark",
    "brand",
    "logo",
    "identity",
    "character",
    "nature",
    "essence",
    "core",
    "heart",
    "soul",
    "spirit",
    "mind",
    "intellect",
    "reason",
    "logic",
    "rational",
    "sensible",
    "practical",
    "pragmatic",
    "realistic",
    "grounded",
    "centered",
    "balanced",
    "stable",
    "steady",
    "firm",
    "solid",
    "strong",
    "robust",
    "resilient",
    "enduring",
    "lasting",
    "permanent",
    "eternal",
    "forever",
    "always",
    "constant",
    "consistent",
    "reliable",
    "dependable",
    "trustworthy",
    "credible",
    "authentic",
    "genuine",
    "real",
    "true",
    "actual",
    "factual",
    "verifiable",
    "provable",
    "demonstrable",
    "evident",
    "apparent",
    "clear",
    "obvious",
    "plain",
    "simple",
    "direct",
    "straight",
    "forward",
    "advance",
    "progress",
    "develop",
    "grow",
    "expand",
    "increase",
    "enhance",
    "improve",
    "upgrade",
    "elevate",
    "raise",
    "lift",
    "boost",
    "amplify",
    "magnify",
    "intensify",
    "strengthen",
    "fortify",
    "reinforce",
    "support",
    "uphold",
    "maintain",
    "sustain",
    "preserve",
    "conserve",
    "protect",
    "defend",
    "guard",
    "watch",
    "monitor",
    "observe",
    "survey",
    "scan",
    "search",
    "seek",
    "find",
    "discover",
    "uncover",
    "reveal",
    "expose",
    "disclose",
    "declare",
    "proclaim",
    "announce",
    "state",
    "express",
    "articulate",
    "voice",
    "speak",
    "talk",
    "communicate",
    "share",
    "exchange",
    "interact",
    "engage",
    "participate",
    "involve",
    "include",
    "incorporate",
    "integrate",
    "unify",
    "unite",
    "join",
    "connect",
    "link",
    "bind",
    "tie",
    "fasten",
    "secure",
    "anchor",
    "ground",
    "root",
    "base",
    "foundation",
    "pillar",
    "column",
    "post",
    "beam",
    "support",
    "structure",
    "framework",
    "skeleton",
    "backbone",
    "core",
    "center",
    "middle",
    "heart",
    "essence",
    "substance",
    "matter",
    "material",
    "element",
    "component",
    "part",
    "piece",
    "segment",
    "section",
    "division",
    "unit",
    "module",
    "block",
    "chunk",
    "fragment",
    "portion",
    "share",
    "allotment",
    "allocation",
    "distribution",
    "spread",
    "range",
    "scope",
    "extent",
    "reach",
    "span",
    "stretch",
    "cover",
    "encompass",
    "embrace",
    "include",
    "contain",
    "hold",
    "possess",
    "own",
    "have",
    "keep",
    "retain",
    "maintain",
    "preserve",
    "conserve",
    "protect",
    "defend",
    "guard",
    "shield",
    "shelter",
    "harbor",
    "haven",
    "refuge",
    "sanctuary",
    "asylum",
    "retreat",
    "hideaway",
    "hideout",
    "bunker",
    "fortress",
    "castle",
    "citadel",
    "stronghold",
    "bastion",
    "bulwark",
    "rampart",
    "wall",
    "barrier",
    "boundary",
    "border",
    "frontier",
    "edge",
    "rim",
    "perimeter",
    "circumference",
    "outline",
    "contour",
    "shape",
    "form",
    "figure",
    "profile",
    "silhouette",
    "shadow",
    "shade",
    "dark",
    "light",
    "bright",
    "shine",
    "glow",
    "radiate",
    "emit",
    "send",
    "transmit",
    "broadcast",
    "publish",
    "issue",
    "release",
    "launch",
    "start",
    "begin",
    "commence",
    "initiate",
    "institute",
    "establish",
    "found",
    "create",
    "make",
    "produce",
    "generate",
    "develop",
    "design",
    "plan",
    "project",
    "scheme",
    "program",
    "agenda",
    "schedule",
    "timetable",
    "calendar",
    "date",
    "time",
    "period",
    "era",
    "age",
    "epoch",
    "eon",
    "eternity",
    "infinity",
    "endless",
    "boundless",
    "limitless",
    "unlimited",
    "unrestricted",
    "free",
    "open",
    "accessible",
    "available",
    "ready",
    "prepared",
    "equipped",
    "furnished",
    "supplied",
    "stocked",
    "loaded",
    "full",
    "complete",
    "whole",
    "entire",
    "total",
    "absolute",
    "utter",
    "sheer",
    "pure",
    "clean",
    "clear",
    "transparent",
    "translucent",
    "opaque",
    "solid",
    "dense",
    "thick",
    "thin",
    "fine",
    "delicate",
    "subtle",
    "nuanced",
    "complex",
    "complicated",
    "intricate",
    "detailed",
    "elaborate",
    "ornate",
    "decorated",
    "adorned",
    "embellished",
    "enhanced",
    "improved",
    "upgraded",
    "advanced",
    "progressive",
    "forward",
    "onward",
    "upward",
    "ascending",
    "rising",
    "climbing",
    "soaring",
    "flying",
    "gliding",
    "sailing",
    "cruising",
    "traveling",
    "journeying",
    "voyaging",
    "exploring",
    "discovering",
    "finding",
    "locating",
    "spotting",
    "sighting",
    "observing",
    "watching",
    "viewing",
    "seeing",
    "perceiving",
    "sensing",
    "feeling",
    "experiencing",
    "undergoing",
    "enduring",
    "surviving",
    "persisting",
    "continuing",
    "lasting",
    "remaining",
    "staying",
    "abiding",
    "dwelling",
    "residing",
    "living",
    "existing",
    "being",
    "becoming",
    "growing",
    "developing",
    "evolving",
    "changing",
    "transforming",
    "converting",
    "shifting",
    "moving",
    "turning",
    "rotating",
    "spinning",
    "whirling",
    "twirling",
    "swirling",
    "circling",
    "orbiting",
    "revolving",
    "cycling",
    "circulating",
    "flowing",
    "streaming",
    "running",
    "rushing",
    "racing",
    "speeding",
    "accelerating",
    "hastening",
    "hurrying",
    "dashing",
    "darting",
    "shooting",
    "launching",
    "propelling",
    "driving",
    "pushing",
    "thrusting",
    "forcing",
    "compelling",
    "impelling",
    "urging",
    "pressing",
    "squeezing",
    "crushing",
    "smashing",
    "breaking",
    "shattering",
    "splintering",
    "fragmenting",
    "disintegrating",
    "dissolving",
    "melting",
    "fusing",
    "merging",
    "blending",
    "mixing",
    "combining",
    "uniting",
    "joining",
    "connecting",
    "linking",
    "attaching",
    "fastening",
    "securing",
    "fixing",
    "setting",
    "placing",
    "positioning",
    "arranging",
    "organizing",
    "ordering",
    "structuring",
    "systematizing",
    "categorizing",
    "classifying",
    "grouping",
    "sorting",
    "separating",
    "dividing",
    "splitting",
    "cleaving",
    "cutting",
    "slicing",
    "dicing",
    "chopping",
    "mincing",
    "grinding",
    "pulverizing",
    "powdering",
    "dusting",
    "sprinkling",
    "scattering",
    "spreading",
    "distributing",
    "dispensing",
    "allocating",
    "assigning",
    "designating",
    "appointing",
    "nominating",
    "electing",
    "selecting",
    "choosing",
    "picking",
    "opting",
    "deciding",
    "determining",
    "resolving",
    "settling",
    "concluding",
    "finishing",
    "completing",
    "ending",
    "terminating",
    "ceasing",
    "stopping",
    "halting",
    "pausing",
    "resting",
    "relaxing",
    "easing",
    "calming",
    "soothing",
    "comforting",
    "consoling",
    "reassuring",
    "encouraging",
    "inspiring",
    "motivating",
    "stimulating",
    "exciting",
    "thrilling",
    "exhilarating",
    "invigorating",
    "energizing",
    "revitalizing",
    "rejuvenating",
    "renewing",
    "restoring",
    "rehabilitating",
    "recovering",
    "healing",
    "curing",
    "remedying",
    "treating",
    "fixing",
    "repairing",
    "mending",
    "patching",
    "darning",
    "stitching",
    "sewing",
    "weaving",
    "knitting",
    "crocheting",
    "crafting",
    "making",
    "building",
    "constructing",
    "erecting",
    "raising",
    "lifting",
    "elevating",
    "hoisting",
    "hauling",
    "pulling",
    "dragging",
    "tugging",
    "yanking",
    "jerking",
    "jolting",
    "jarring",
    "shaking",
    "quaking",
    "trembling",
    "quivering",
    "shivering",
    "vibrating",
    "oscillating",
    "fluctuating",
    "wavering",
    "wobbling",
    "teetering",
    "tottering",
    "faltering",
    "stumbling",
    "tripping",
    "falling",
    "dropping",
    "plunging",
    "diving",
    "plummeting",
    "cascading",
    "tumbling",
    "rolling",
    "spinning",
    "whirling",
    "twirling",
    "swirling",
    "circling",
    "looping",
    "coiling",
    "spiraling",
    "winding",
    "twisting",
    "turning",
    "bending",
    "folding",
    "creasing",
    "wrinkling",
    "crinkling",
    "crumpling",
    "crushing",
    "squeezing",
    "pressing",
    "compressing",
    "condensing",
    "concentrating",
    "focusing",
    "centering",
    "targeting",
    "aiming",
    "pointing",
    "directing",
    "guiding",
    "leading",
    "steering",
    "navigating",
    "piloting",
    "driving",
    "riding",
    "flying",
    "soaring",
    "gliding",
    "floating",
    "drifting",
    "wandering",
    "roaming",
    "rambling",
    "roving",
    "ranging",
    "traveling",
    "journeying",
    "voyaging",
    "touring",
    "trekking",
    "hiking",
    "climbing",
    "ascending",
    "mounting",
    "scaling",
    "conquering",
    "overcoming",
    "surmounting",
    "prevailing",
    "winning",
    "triumphing",
    "succeeding",
    "achieving",
    "accomplishing",
    "attaining",
    "realizing",
    "fulfilling",
    "satisfying",
    "gratifying",
    "pleasing",
    "delighting",
    "charming",
    "enchanting",
    "captivating",
    "fascinating",
    "enthralling",
    "spellbinding",
    "mesmerizing",
    "hypnotizing",
    "entrancing",
    "bewitching",
    "alluring",
    "tempting",
    "tantalizing",
    "teasing",
    "taunting",
    "provoking",
    "inciting",
    "instigating",
    "triggering",
    "sparking",
    "igniting",
    "kindling",
    "inflaming",
    "burning",
    "blazing",
    "flaring",
    "flashing",
    "gleaming",
    "glinting",
    "glittering",
    "sparkling",
    "twinkling",
    "shimmering",
    "shining",
    "glowing",
    "radiating",
    "beaming",
    "emitting",
    "sending",
    "transmitting",
    "broadcasting",
    "telecasting",
    "televising",
    "airing",
    "showing",
    "displaying",
    "exhibiting",
    "presenting",
    "demonstrating",
    "illustrating",
    "depicting",
    "portraying",
    "representing",
    "symbolizing",
    "signifying",
    "denoting",
    "connoting",
    "meaning",
    "implying",
    "suggesting",
    "indicating",
    "pointing",
    "hinting",
    "alluding",
    "referring",
    "relating",
    "connecting",
    "associating",
    "linking",
    "tying",
    "binding",
    "uniting",
    "joining",
    "coupling",
    "pairing",
    "matching",
    "fitting",
    "suiting",
    "complementing",
    "harmonizing",
    "coordinating",
    "synchronizing",
    "timing",
    "scheduling",
    "planning",
    "arranging",
    "organizing",
    "systematizing",
    "structuring",
    "ordering",
    "sequencing",
    "ranking",
    "grading",
    "rating",
    "evaluating",
    "assessing",
    "judging",
    "determining",
    "deciding",
    "resolving",
    "settling",
    "concluding",
    "finishing",
    "completing",
    "ending",
    "terminating",
    "ceasing",
    "stopping",
    "halting",
    "pausing",
    "resting",
    "relaxing",
    "easing",
    "calming",
    "soothing",
    "comforting",
    "consoling",
    "reassuring",
    "encouraging",
    "inspiring",
    "motivating",
    "stimulating",
    "exciting",
    "thrilling",
    "exhilarating",
    "invigorating",
    "energizing",
    "revitalizing",
    "rejuvenating",
    "renewing",
    "restoring",
    "rehabilitating",
    "recovering",
    "healing",
    "curing",
    "remedying",
    "treating",
    "fixing",
    "repairing",
    "mending",
    "patching",
    "darning",
    "stitching",
    "sewing",
    "weaving",
    "knitting",
    "crocheting",
    "crafting",
    "making",
    "building",
    "constructing",
    "erecting",
    "raising",
    "lifting",
    "elevating",
    "hoisting",
    "hauling",
    "pulling",
    "dragging",
    "tugging",
    "yanking",
    "jerking",
    "jolting",
    "jarring",
    "shaking",
    "quaking",
    "trembling",
    "quivering",
    "shivering",
    "vibrating",
    "oscillating",
    "fluctuating",
    "wavering",
    "wobbling",
    "teetering",
    "tottering",
    "faltering",
    "stumbling",
    "tripping",
    "falling",
    "dropping",
    "plunging",
    "diving",
    "plummeting",
    "cascading",
    "tumbling",
    "rolling",
    "spinning",
    "whirling",
    "twirling",
    "swirling",
    "circling",
    "looping",
    "coiling",
    "spiraling",
    "winding",
    "twisting",
    "turning",
    "bending",
    "folding",
    "creasing",
    "wrinkling",
    "crinkling",
    "crumpling",
    "crushing",
    "squeezing",
    "pressing",
    "compressing",
    "condensing",
    "concentrating",
    "focusing",
    "centering",
    "targeting",
    "aiming",
    "pointing",
    "directing",
    "guiding",
    "leading",
    "steering",
    "navigating",
    "piloting",
    "driving",
    "riding",
    "flying",
    "soaring",
    "gliding",
    "floating",
    "drifting",
    "wandering",
    "roaming",
    "rambling",
    "roving",
    "ranging",
    "traveling",
    "journeying",
    "voyaging",
    "touring",
    "trekking",
    "hiking",
    "climbing",
    "ascending",
    "mounting",
    "scaling",
    "conquering",
    "overcoming",
    "surmounting",
    "prevailing",
    "winning",
    "triumphing",
    "succeeding",
    "achieving",
    "accomplishing",
    "attaining",
    "realizing",
    "fulfilling",
    "satisfying",
    "gratifying",
    "pleasing",
    "delighting",
    "charming",
    "enchanting",
    "captivating",
    "fascinating",
    "enthralling",
    "spellbinding",
    "mesmerizing",
    "hypnotizing",
    "entrancing",
    "bewitching",
    "alluring",
    "tempting",
    "tantalizing",
    "teasing",
    "taunting",
    "provoking",
    "inciting",
    "instigating",
    "triggering",
    "sparking",
    "igniting",
    "kindling",
    "inflaming",
    "burning",
    "blazing",
    "flaring",
    "flashing",
    "gleaming",
    "glinting",
    "glittering",
    "sparkling",
    "twinkling",
    "shimmering",
    "shining",
    "glowing",
  ]

  const suffixes = [
    "tech",
    "digital",
    "media",
    "news",
    "truth",
    "facts",
    "data",
    "info",
    "network",
    "hub",
    "central",
    "center",
    "hq",
    "base",
    "home",
    "place",
    "space",
    "zone",
    "area",
    "region",
    "nation",
    "country",
    "state",
    "city",
    "town",
    "village",
    "community",
    "society",
    "group",
    "team",
    "crew",
    "squad",
    "force",
    "unit",
    "division",
    "corps",
    "legion",
    "army",
    "navy",
    "air",
    "space",
    "marine",
    "guard",
    "patrol",
    "watch",
    "shield",
    "defense",
    "protect",
    "secure",
    "safe",
    "liberty",
    "freedom",
    "rights",
    "justice",
    "law",
    "order",
    "peace",
    "unity",
    "alliance",
    "coalition",
    "federation",
    "union",
    "league",
    "association",
    "organization",
    "foundation",
    "institute",
    "academy",
    "school",
    "college",
    "university",
    "education",
    "learning",
    "knowledge",
    "wisdom",
    "insight",
    "vision",
    "view",
    "perspective",
    "outlook",
    "approach",
    "method",
    "system",
    "process",
    "procedure",
    "protocol",
    "standard",
    "guide",
    "manual",
    "handbook",
    "reference",
    "resource",
    "tool",
    "utility",
    "service",
    "solution",
    "answer",
    "response",
    "reaction",
    "action",
    "movement",
    "initiative",
    "project",
    "program",
    "plan",
    "strategy",
    "tactic",
    "maneuver",
    "operation",
    "mission",
    "quest",
    "journey",
    "adventure",
    "expedition",
    "exploration",
    "discovery",
    "finding",
    "revelation",
    "disclosure",
    "expose",
    "report",
    "account",
    "story",
    "narrative",
    "chronicle",
    "history",
    "record",
    "document",
    "file",
    "archive",
    "collection",
    "compilation",
    "anthology",
    "series",
    "set",
    "array",
    "assortment",
    "variety",
    "diversity",
    "range",
    "spectrum",
    "scale",
    "measure",
    "metric",
    "standard",
    "benchmark",
    "criterion",
    "principle",
    "value",
    "virtue",
    "quality",
    "attribute",
    "trait",
    "characteristic",
    "feature",
    "aspect",
    "element",
    "component",
    "part",
    "piece",
    "segment",
    "section",
    "division",
    "unit",
    "module",
    "block",
    "node",
    "point",
    "spot",
    "location",
    "position",
    "place",
    "site",
    "venue",
    "arena",
    "field",
    "ground",
    "land",
    "territory",
    "domain",
    "realm",
    "kingdom",
    "empire",
    "dynasty",
    "legacy",
    "heritage",
    "tradition",
    "custom",
    "practice",
    "habit",
    "routine",
    "ritual",
    "ceremony",
    "celebration",
    "commemoration",
    "memorial",
    "monument",
    "landmark",
    "beacon",
    "signal",
    "sign",
    "symbol",
    "emblem",
    "badge",
    "insignia",
    "crest",
    "coat",
    "shield",
    "banner",
    "flag",
    "standard",
    "ensign",
    "colors",
    "mark",
    "brand",
    "label",
    "tag",
    "stamp",
    "seal",
    "imprint",
    "impression",
    "image",
    "picture",
    "portrait",
    "photo",
    "snapshot",
    "shot",
    "frame",
    "scene",
    "view",
    "vista",
    "panorama",
    "landscape",
    "horizon",
    "sky",
    "heaven",
    "paradise",
    "utopia",
    "ideal",
    "dream",
    "vision",
    "aspiration",
    "hope",
    "wish",
    "desire",
    "want",
    "need",
    "requirement",
    "necessity",
    "essential",
    "fundamental",
    "basic",
    "core",
    "central",
    "key",
    "critical",
    "crucial",
    "vital",
    "important",
    "significant",
    "major",
    "main",
    "primary",
    "principal",
    "chief",
    "head",
    "lead",
    "top",
    "premier",
    "prime",
    "first",
    "foremost",
    "supreme",
    "ultimate",
    "absolute",
    "total",
    "complete",
    "whole",
    "entire",
    "full",
    "comprehensive",
    "thorough",
    "extensive",
    "broad",
    "wide",
    "vast",
    "immense",
    "enormous",
    "huge",
    "massive",
    "colossal",
    "gigantic",
    "giant",
    "big",
    "large",
    "great",
    "grand",
    "magnificent",
    "splendid",
    "superb",
    "excellent",
    "outstanding",
    "exceptional",
    "extraordinary",
    "remarkable",
    "notable",
    "noteworthy",
    "significant",
    "important",
    "consequential",
    "momentous",
    "historic",
    "historical",
    "legendary",
    "fabled",
    "storied",
    "famous",
    "renowned",
    "celebrated",
    "acclaimed",
    "distinguished",
    "eminent",
    "prominent",
    "preeminent",
    "leading",
    "foremost",
    "premier",
    "prime",
    "primary",
    "principal",
    "chief",
    "main",
    "major",
    "key",
    "central",
    "core",
    "essential",
    "fundamental",
    "basic",
    "elemental",
    "rudimentary",
    "primitive",
    "primal",
    "original",
    "initial",
    "first",
    "earliest",
    "ancient",
    "old",
    "traditional",
    "conventional",
    "standard",
    "regular",
    "normal",
    "usual",
    "common",
    "ordinary",
    "everyday",
    "routine",
    "familiar",
    "known",
    "recognized",
    "established",
    "settled",
    "fixed",
    "set",
    "determined",
    "decided",
    "resolved",
    "concluded",
    "finished",
    "completed",
    "ended",
    "terminated",
    "ceased",
    "stopped",
    "halted",
    "paused",
    "suspended",
    "interrupted",
    "broken",
    "disrupted",
    "disturbed",
    "troubled",
    "concerned",
    "worried",
    "anxious",
    "nervous",
    "tense",
    "stressed",
    "pressured",
    "burdened",
    "loaded",
    "weighed",
    "heavy",
    "substantial",
    "considerable",
    "significant",
    "appreciable",
    "noticeable",
    "observable",
    "visible",
    "apparent",
    "evident",
    "obvious",
    "clear",
    "plain",
    "distinct",
    "definite",
    "certain",
    "sure",
    "positive",
    "confident",
    "assured",
    "convinced",
    "persuaded",
    "satisfied",
    "content",
    "happy",
    "pleased",
    "glad",
    "delighted",
    "joyful",
    "cheerful",
    "merry",
    "jolly",
    "jovial",
    "genial",
    "cordial",
    "friendly",
    "amiable",
    "affable",
    "pleasant",
    "agreeable",
    "nice",
    "kind",
    "gentle",
    "tender",
    "soft",
    "mild",
    "moderate",
    "temperate",
    "balanced",
    "even",
    "level",
    "steady",
    "stable",
    "secure",
    "safe",
    "protected",
    "sheltered",
    "shielded",
    "guarded",
    "defended",
    "fortified",
    "reinforced",
    "strengthened",
    "bolstered",
    "supported",
    "backed",
    "upheld",
    "maintained",
    "sustained",
    "preserved",
    "conserved",
    "saved",
    "rescued",
    "recovered",
    "retrieved",
    "regained",
    "reclaimed",
    "restored",
    "renewed",
    "revived",
    "revitalized",
    "rejuvenated",
    "refreshed",
    "invigorated",
    "energized",
    "activated",
    "stimulated",
    "aroused",
    "excited",
    "thrilled",
    "enthralled",
    "captivated",
    "fascinated",
    "entranced",
    "spellbound",
    "mesmerized",
    "hypnotized",
    "bewitched",
    "enchanted",
    "charmed",
    "delighted",
    "pleased",
    "satisfied",
    "gratified",
    "fulfilled",
    "realized",
    "achieved",
    "accomplished",
    "attained",
    "reached",
    "arrived",
    "landed",
    "settled",
    "established",
    "installed",
    "positioned",
    "placed",
    "located",
    "situated",
    "based",
    "founded",
    "grounded",
    "rooted",
    "anchored",
    "moored",
    "docked",
    "berthed",
    "harbored",
    "sheltered",
    "protected",
    "shielded",
    "guarded",
    "defended",
    "fortified",
    "reinforced",
    "strengthened",
    "bolstered",
    "supported",
    "backed",
    "upheld",
    "maintained",
    "sustained",
    "preserved",
    "conserved",
    "saved",
    "rescued",
    "recovered",
    "retrieved",
    "regained",
    "reclaimed",
    "restored",
    "renewed",
    "revived",
    "revitalized",
    "rejuvenated",
    "refreshed",
    "invigorated",
    "energized",
    "activated",
    "stimulated",
    "aroused",
    "excited",
    "thrilled",
    "enthralled",
    "captivated",
    "fascinated",
    "entranced",
    "spellbound",
    "mesmerized",
    "hypnotized",
    "bewitched",
    "enchanted",
    "charmed",
    "delighted",
    "pleased",
    "satisfied",
    "gratified",
    "fulfilled",
    "realized",
    "achieved",
    "accomplished",
    "attained",
    "reached",
    "arrived",
    "landed",
    "settled",
    "established",
    "installed",
    "positioned",
    "placed",
    "located",
    "situated",
    "based",
    "founded",
    "grounded",
    "rooted",
    "anchored",
    "moored",
    "docked",
    "berthed",
    "harbored",
    "sheltered",
    "protected",
    "shielded",
    "guarded",
    "defended",
    "fortified",
    "reinforced",
    "strengthened",
    "bolstered",
    "supported",
    "backed",
    "upheld",
    "maintained",
    "sustained",
    "preserved",
    "conserved",
    "saved",
    "rescued",
    "recovered",
    "retrieved",
    "regained",
    "reclaimed",
    "restored",
    "renewed",
    "revived",
    "revitalized",
    "rejuvenated",
    "refreshed",
    "invigorated",
    "energized",
    "activated",
    "stimulated",
    "aroused",
    "excited",
    "thrilled",
    "enthralled",
    "captivated",
    "fascinated",
    "entranced",
    "spellbound",
    "mesmerized",
    "hypnotized",
    "bewitched",
    "enchanted",
    "charmed",
  ]

  const tlds = ["com", "org", "net", "io", "co", "app", "dev", "tech", "info", "us", "me", "ai"]
  const categories = ["organization", "company", "education", "technology", "network"]

  const result = []
  const usedDomains = new Set()

  // Generate domains until we reach the target count or run out of combinations
  let attempts = 0
  const maxAttempts = 10000 // Prevent infinite loops

  while (result.length < 620 && attempts < maxAttempts) {
    attempts++

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    const tld = tlds[Math.floor(Math.random() * tlds.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]

    // Create domain name with optional hyphen
    const useHyphen = Math.random() > 0.7
    const domainName = useHyphen ? `${prefix}-${suffix}.${tld}` : `${prefix}${suffix}.${tld}`

    // Check if this domain is already used
    if (!usedDomains.has(domainName)) {
      usedDomains.add(domainName)
      result.push({ name: domainName, category })
    }
  }

  return result
}

// Generate additional domains and combine with initial domains
const generateAllDomains = () => {
  const additionalDomains = generateMoreDomains()
  return [...INITIAL_DOMAINS, ...additionalDomains]
}

// Get color based on domain category
const getCategoryColor = (category: string) => {
  switch (category) {
    case "organization":
      return "text-blue-600 dark:text-blue-400"
    case "company":
      return "text-green-600 dark:text-green-400"
    case "education":
      return "text-red-600 dark:text-red-400"
    case "technology":
      return "text-purple-600 dark:text-purple-400"
    case "network":
      return "text-yellow-600 dark:text-yellow-400"
    default:
      return "text-gray-600 dark:text-gray-300"
  }
}

// Get TLD color
const getTldColor = (domain: string) => {
  const tld = domain.split(".").pop()
  switch (tld) {
    case "org":
      return "text-blue-500 dark:text-blue-300"
    case "com":
      return "text-green-500 dark:text-green-300"
    case "edu":
      return "text-red-500 dark:text-red-300"
    case "io":
      return "text-purple-500 dark:text-purple-300"
    case "net":
      return "text-yellow-500 dark:text-yellow-300"
    case "app":
      return "text-orange-500 dark:text-orange-300"
    case "dev":
      return "text-cyan-500 dark:text-cyan-300"
    case "tech":
      return "text-indigo-500 dark:text-indigo-300"
    case "ai":
      return "text-pink-500 dark:text-pink-300"
    default:
      return "text-gray-500 dark:text-gray-300"
  }
}

// Constants for physics
const FRICTION = 0.95 // Higher = less friction
const MIN_VELOCITY_THRESHOLD = 0.1 // Minimum velocity to continue momentum
const MAX_VELOCITY = 50 // Maximum velocity cap
const VELOCITY_SCALE = 0.3 // Scale factor for velocity
const FLING_THRESHOLD = 1.5 // Velocity threshold to consider a fling

export default function EnhancedDomainMarquee() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  // Animation state
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [contentPosition, setContentPosition] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const [showSpeedIndicator, setShowSpeedIndicator] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [allDomains, setAllDomains] = useState(generateAllDomains())

  // Refs for tracking drag state
  const lastDragX = useRef(0)
  const lastDragTime = useRef(0)
  const contentWidth = useRef(0)
  const lastVelocities = useRef<number[]>([])
  const flingDetected = useRef(false)
  const flingDirection = useRef(0)
  const flingStartTime = useRef(0)
  const flingDuration = useRef(0)

  // Create three copies of domains for seamless looping
  const domains = useMemo(() => {
    return [...allDomains, ...allDomains, ...allDomains]
  }, [allDomains])

  // Initialize and measure content
  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const updateMeasurements = () => {
        if (!contentRef.current) return

        const containerWidth = containerRef.current?.offsetWidth || 0
        const fullContentWidth = contentRef.current?.scrollWidth || 0

        // Set content width to one-third of the full width (since we have 3 copies)
        contentWidth.current = fullContentWidth / 3

        // Mark as loaded once measurements are done
        setIsLoaded(true)
      }

      // Initial measurement after a short delay to ensure rendering
      setTimeout(updateMeasurements, 500)

      // Update on resize
      window.addEventListener("resize", updateMeasurements)
      return () => window.removeEventListener("resize", updateMeasurements)
    }
  }, [])

  // Auto-animation when not dragging
  useEffect(() => {
    if (isDragging || (isPaused && Math.abs(velocity) < MIN_VELOCITY_THRESHOLD)) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    let lastTime = performance.now()
    const baseSpeed = 0.05 * speedMultiplier // Base speed adjusted by multiplier

    const animate = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time

      // Calculate new position based on auto-scroll or momentum
      let newPosition

      if (Math.abs(velocity) > MIN_VELOCITY_THRESHOLD) {
        // Apply momentum with friction
        const newVelocity = velocity * FRICTION
        setVelocity(newVelocity)

        // Move based on velocity
        newPosition = contentPosition + newVelocity * deltaTime * 0.1
      } else {
        // Regular auto-scroll
        newPosition = contentPosition + baseSpeed * deltaTime
      }

      // Handle loop boundaries
      if (newPosition >= contentWidth.current) {
        newPosition = 0
      } else if (newPosition < 0) {
        newPosition = contentWidth.current - 1
      }

      setContentPosition(newPosition)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isDragging, isPaused, velocity, contentWidth, contentPosition, speedMultiplier])

  // Handle fling physics
  useEffect(() => {
    if (flingDetected.current && !isDragging) {
      const currentTime = performance.now()
      const elapsedTime = currentTime - flingStartTime.current

      // If fling is still active
      if (elapsedTime < flingDuration.current) {
        // Calculate decay factor based on elapsed time
        const progress = elapsedTime / flingDuration.current
        const decayFactor = 1 - Math.pow(progress, 2) // Quadratic decay

        // Apply fling velocity with decay
        const flingVelocity = flingDirection.current * Math.max(10, Math.abs(velocity)) * decayFactor
        setVelocity(flingVelocity)
      } else {
        // Fling is complete
        flingDetected.current = false
      }
    }
  }, [isDragging, velocity])

  // Track velocity for fling detection
  const updateVelocity = (currentX: number, currentTime: number) => {
    const deltaX = currentX - lastDragX.current
    const timeDelta = currentTime - lastDragTime.current

    if (timeDelta > 0) {
      // Calculate instantaneous velocity (pixels per ms)
      const instantVelocity = deltaX / timeDelta

      // Add to velocity history (keep last 5)
      lastVelocities.current.push(instantVelocity)
      if (lastVelocities.current.length > 5) {
        lastVelocities.current.shift()
      }

      // Calculate weighted average velocity (more recent = higher weight)
      let weightedSum = 0
      let weightSum = 0

      lastVelocities.current.forEach((v, i) => {
        const weight = i + 1
        weightedSum += v * weight
        weightSum += weight
      })

      const avgVelocity = weightSum > 0 ? weightedSum / weightSum : 0

      // Scale and limit velocity
      const scaledVelocity = avgVelocity * VELOCITY_SCALE * speedMultiplier
      const clampedVelocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, scaledVelocity))

      setVelocity(clampedVelocity)

      // Detect fling gesture
      if (Math.abs(avgVelocity) > FLING_THRESHOLD && timeDelta < 100) {
        flingDetected.current = true
        flingDirection.current = avgVelocity > 0 ? 1 : -1
        flingStartTime.current = currentTime
        flingDuration.current = Math.min(2000, Math.abs(avgVelocity) * 500) // Duration based on velocity
      }
    }

    // Update last position and time
    lastDragX.current = currentX
    lastDragTime.current = currentTime
  }

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPaused(true)
    setIsDragging(true)
    setDragStartX(e.clientX)
    lastDragX.current = e.clientX
    lastDragTime.current = performance.now()
    lastVelocities.current = []
    flingDetected.current = false
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const currentX = e.clientX
    const currentTime = performance.now()

    // Update velocity tracking
    updateVelocity(currentX, currentTime)

    // Calculate drag distance
    const deltaX = currentX - lastDragX.current

    // Update content position based on drag
    setContentPosition((prev) => {
      let newPosition = prev - deltaX

      // Handle loop boundaries
      if (newPosition >= contentWidth.current) {
        newPosition = 0
      } else if (newPosition < 0) {
        newPosition = contentWidth.current - 1
      }

      return newPosition
    })
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)

      // Keep paused for momentum to complete
      if (Math.abs(velocity) < MIN_VELOCITY_THRESHOLD) {
        setIsPaused(false)
      }
    }
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPaused(true)
      setIsDragging(true)
      setDragStartX(e.touches[0].clientX)
      lastDragX.current = e.touches[0].clientX
      lastDragTime.current = performance.now()
      lastVelocities.current = []
      flingDetected.current = false
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return

    const currentX = e.touches[0].clientX
    const currentTime = performance.now()

    // Update velocity tracking
    updateVelocity(currentX, currentTime)

    // Calculate drag distance
    const deltaX = currentX - lastDragX.current

    // Update content position based on drag
    setContentPosition((prev) => {
      let newPosition = prev - deltaX

      // Handle loop boundaries
      if (newPosition >= contentWidth.current) {
        newPosition = 0
      } else if (newPosition < 0) {
        newPosition = contentWidth.current - 1
      }

      return newPosition
    })
  }

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false)

      // Keep paused for momentum to complete
      if (Math.abs(velocity) < MIN_VELOCITY_THRESHOLD) {
        setIsPaused(false)
      }
    }
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)

      // Resume auto-scroll after momentum completes
      if (Math.abs(velocity) < MIN_VELOCITY_THRESHOLD) {
        setIsPaused(false)
      }
    }
  }

  // Handle hover pause
  const handleMouseEnter = () => {
    // Only pause if not already dragging
    if (!isDragging && Math.abs(velocity) < MIN_VELOCITY_THRESHOLD) {
      setIsPaused(true)
    }
  }

  // Handle speed multiplier changes
  const increaseSpeed = () => {
    setSpeedMultiplier((prev) => Math.min(prev + 0.5, 5))
    setShowSpeedIndicator(true)
    setTimeout(() => setShowSpeedIndicator(false), 2000)
  }

  const decreaseSpeed = () => {
    setSpeedMultiplier((prev) => Math.max(prev - 0.5, 0.5))
    setShowSpeedIndicator(true)
    setTimeout(() => setShowSpeedIndicator(false), 2000)
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if marquee is in viewport
      if (!containerRef.current || !isElementInViewport(containerRef.current)) return

      if (e.key === "ArrowRight") {
        setVelocity((prev) => prev - 5)
      } else if (e.key === "ArrowLeft") {
        setVelocity((prev) => prev + 5)
      } else if (e.key === "+" || e.key === "=") {
        increaseSpeed()
      } else if (e.key === "-" || e.key === "_") {
        decreaseSpeed()
      }
    }

    // Helper function to check if element is in viewport
    function isElementInViewport(el: HTMLElement) {
      const rect = el.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div
      className="bg-gray-100 dark:bg-gray-800 py-4 overflow-hidden domain-marquee relative"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex items-center">
        {/* Title */}
        <div className="absolute left-4 z-20 bg-gray-100 dark:bg-gray-800 px-2 flex items-center">
          <Globe size={16} className="mr-2 text-gray-600 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Available Domains <span className="text-xs opacity-60">({allDomains.length})</span>
          </span>
        </div>

        {/* Left fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-gray-100 dark:from-gray-800 to-transparent"></div>

        {/* Right fade effect */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-gray-100 dark:from-gray-800 to-transparent"></div>

        {/* Scrolling content with drag handlers */}
        <div
          className={`whitespace-nowrap pl-36 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            transform: `translateX(${-contentPosition}px)`,
            transition: isDragging ? "none" : "transform 0.1s linear",
          }}
          ref={contentRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Render all domains directly for now - we'll optimize later if needed */}
          {domains.map((domain, index) => {
            const [name, tld] = domain.name.split(/\.(?=[^.]+$)/)
            return (
              <span
                key={`${domain.name}-${index}`}
                className="inline-block mx-6 font-mono text-sm hover:scale-110 transition-transform"
                title={`${domain.name} - ${domain.category}`}
              >
                <span className={getCategoryColor(domain.category)}>{name}</span>
                <span className={`${getTldColor(domain.name)}`}>.{tld}</span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Speed controls */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex items-center space-x-2">
        <button
          onClick={decreaseSpeed}
          className="p-1 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          aria-label="Decrease speed"
        >
          <Gauge size={16} className="rotate-180" />
        </button>

        <button
          onClick={increaseSpeed}
          className="p-1 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          aria-label="Increase speed"
        >
          <Gauge size={16} />
        </button>
      </div>

      {/* Speed indicator */}
      {showSpeedIndicator && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-black/80 text-white px-3 py-1 rounded-full text-sm">
          Speed: {speedMultiplier.toFixed(1)}x
        </div>
      )}

      {/* Debug info */}
      <div className="absolute left-4 bottom-1 text-xs text-gray-500">
        Domains: {allDomains.length} | Loaded: {isLoaded ? "Yes" : "No"} | Width: {Math.round(contentWidth.current)}px
      </div>

      {/* Drag instruction */}
      <div className="absolute right-24 top-1/2 transform -translate-y-1/2 z-20 hidden md:block">
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
          {isDragging ? "Fling to scroll faster" : "Click and drag to browse"}
        </span>
      </div>
    </div>
  )
}
