// Standalone, local-only browser smoke/a11y regression checks.
// Run with NODE_PATH pointing to an isolated playwright install. Does not
// authenticate, send credentials, call outside services or publish content.
const assert = require("node:assert/strict")
const { chromium } = require("playwright")

const ORIGIN = "http://127.0.0.1:3000"
const scenarios = [
  ["/about", "About Big Based"],
  ["/features", "Features"],
  ["/contact", "Contact Us"],
  ["/faq", "Frequently Asked Questions"],
  ["/visual-review/community", "Fictional layout review"],
  ["/visual-review/sign-in", "Sign-in layout review"],
  ["/visual-review/social", "Your feed"],
  ["/visual-review/social/creator/samplecreator", "Sample Creator"],
]

async function checkPage(browser, path, marker, width, height, colorScheme) {
  const page = await browser.newPage({
    viewport: { width, height },
    colorScheme,
    reducedMotion: "reduce",
  })
  try {
    const response = await page.goto(ORIGIN + path, { waitUntil: "domcontentloaded", timeout: 45000 })
    assert.equal(response?.status(), 200, path + ": expected 200")
    const bodyText = await page.locator("body").innerText()
    assert.ok(bodyText.includes(marker), path + ": required marker not rendered")
    assert.ok(!bodyText.includes("Application error: a server-side exception"), path + ": server error content")

    const geometry = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      root: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }))
    assert.ok(
      Math.max(geometry.root, geometry.body) <= geometry.viewport + 2,
      path + ": horizontal document overflow: " + JSON.stringify(geometry),
    )

    // Check rendered computed values, not just authored class names. Wait for
    // the existing system-theme hydration (no theme changes are written).
    if (path === "/about" || path === "/faq" || path === "/visual-review/sign-in") {
      await page.waitForFunction(
        (expectDark) => document.documentElement.classList.contains("dark") === expectDark,
        colorScheme === "dark",
        { timeout: 10000 },
      )
      const themeColors = await page.evaluate(() => {
        const root = document.querySelector(".bb-2025-page")
        const panel = root?.querySelector(".bb-2025-panel")
        return {
          page: root ? getComputedStyle(root).backgroundColor : null,
          panel: panel ? getComputedStyle(panel).backgroundColor : null,
        }
      })
      assert.equal(
        themeColors.page,
        colorScheme === "dark" ? "rgb(8, 8, 8)" : "rgb(243, 244, 246)",
        path + ": original page backdrop",
      )
      if (themeColors.panel !== null) {
        assert.equal(
          themeColors.panel,
          colorScheme === "dark" ? "rgb(13, 13, 13)" : "rgb(255, 255, 255)",
          path + ": original panel surface",
        )
      }
    }

    if (path === "/visual-review/sign-in") {
      // The original BB header is already provided by app/layout.tsx.
      // Hidden alternate-theme images do not count as duplicate logos.
      const onScreenLogos = await page.locator('img[alt="BigBased Logo"]').evaluateAll((images) =>
        images.filter((img) => {
          const box = img.getBoundingClientRect()
          const style = getComputedStyle(img)
          return box.width > 0 && box.height > 0 && box.right > 0 &&
            box.left < window.innerWidth && box.bottom > 0 &&
            box.top < window.innerHeight && style.visibility !== "hidden"
        }).length,
      )
      assert.equal(onScreenLogos, 1, "auth visual review must inherit the one global header BB logo")
      // The original 2025 iPhone recording also includes an intentional
      // centered 64px auth mark. It is distinct from the global header.
      const authLogoCount = await page.locator('[data-bb-auth-brand] img[alt="Big Based Logo"]').evaluateAll(
        (images) => images.filter((img) => {
          const box = img.getBoundingClientRect()
          return box.width > 0 && box.height > 0 && box.left < window.innerWidth
        }).length,
      )
      assert.equal(authLogoCount, 1, "preserve the original visible centered sign-in brand")
      assert.equal(await page.getByRole("heading", { name: "BIG BASED" }).count(), 1)
      assert.equal(await page.locator('input[type="email"]:disabled').count(), 1)
      assert.equal(await page.locator('input[type="password"]:disabled').count(), 1)
      assert.equal(await page.getByRole("button", { name: /Sign In · disabled in preview/i }).isDisabled(), true)
      assert.equal(await page.locator("form").count(), 0, "visual review must not submit forms")
    }
    if (path === "/faq") {
      assert.equal(await page.getByRole("heading", { name: "Frequently Asked Questions" }).count(), 1)
      assert.equal(await page.getByRole("button", { name: "All", exact: true }).getAttribute("aria-pressed"), "true")
      const selectedColor = await page.getByRole("button", { name: "All", exact: true }).evaluate(
        (node) => getComputedStyle(node).borderBottomColor,
      )
      assert.equal(
        selectedColor,
        colorScheme === "dark" ? "rgb(251, 191, 36)" : "rgb(245, 158, 11)",
        "FAQ must inherit the original 2025 amber selected-tab color",
      )
    }
    console.log("PASS", width + "px", colorScheme, path, geometry)
  } finally {
    await page.close()
  }
}

;(async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    for (const [path, marker] of scenarios) {
      await checkPage(browser, path, marker, 390, 844, "dark")
    }
    for (const [path, marker] of [
      scenarios[3], scenarios[4], scenarios[5], scenarios[6],
    ]) {
      await checkPage(browser, path, marker, 1440, 900, "light")
    }
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error("Local BigBased visual guard FAILED:", error.message)
  process.exitCode = 1
})
