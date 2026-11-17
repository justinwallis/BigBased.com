"""Deterministic offline BigBased Creator Launchpad browser checks.

Requires playwright Python and Chromium installed. Uses set_content on an entirely
self-contained HTML document: no server, account, credential, AI or network APIs.
"""
from pathlib import Path
import re
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
OUT = ROOT / "screenshots"
OUT.mkdir(exist_ok=True)


def run():
    checks = []
    with sync_playwright() as pl:
        browser = pl.chromium.launch(executable_path="/usr/bin/chromium", headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        context = browser.new_context(viewport={"width": 1440, "height": 900}, accept_downloads=True)
        page = context.new_page()
        errors, requests = [], []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("request", lambda req: requests.append(req.url))
        page.set_content(HTML, wait_until="load")
        assert page.locator("#preview h3").inner_text() == "Northstar Press"
        assert page.locator(".brand img").get_attribute("src").startswith("data:image/webp;base64,")
        checks.append("original approved brand asset embedded / initial builder")
        page.screenshot(path=str(OUT / "desktop-1440.png"), full_page=True)

        page.locator("#project-name").fill("Independent Works")
        assert page.locator("#preview h3").inner_text() == "Independent Works"
        page.locator("[data-theme='bold']").click()
        assert "theme-bold" in page.locator("#preview").get_attribute("class")
        page.locator("[data-layout='portfolio']").first.click()
        assert "layout-portfolio" in page.locator("#preview").get_attribute("class")
        page.locator("[data-kind='video']").first.click()
        assert page.locator("#preview h3").inner_text() == "My Documentary"
        page.locator("#undo").click()
        assert page.locator("#preview h3").inner_text() == "Independent Works"
        page.locator("#redo").click()
        assert page.locator("#preview h3").inner_text() == "My Documentary"
        checks.append("name/theme/layout/kind live updates + undo/redo")

        page.locator("#global-search").fill("Northstar")
        assert page.locator("[data-search-result]").count() == 1
        page.locator("#global-search").press("Escape")
        assert page.locator("#search-results").is_hidden()
        page.locator("#global-search").fill("gibberish")
        assert "No sample matches" in page.locator("#search-results").inner_text()
        checks.append("guest public-only fixture search, empty and escape states")

        page.locator("[data-feed='groups']").click()
        assert "Indie Creators" in page.locator("#feed-content").inner_text()
        page.locator("[data-feed='feed']").click()
        page.locator("[data-demo-action='like']").first.click()
        assert page.locator("[data-demo-action='like']").first.get_attribute("aria-pressed") == "true"
        page.locator("[data-demo-action='comment']").first.click()
        assert page.locator(".comments").first.is_visible()
        checks.append("Connect filtering, local-only reaction, demo comments")

        page.locator("#quick-prompt").fill("Help plan my publication")
        page.locator("#quick-chat button").click()
        assert "MyBased AI" in page.locator("#modal-heading").inner_text()
        assert "Help plan my publication" in page.locator("#chat-log").inner_text()
        assert "not connected" in page.locator("#chat-log").inner_text()
        assert "Help plan my publication" in page.locator("#chat-history").inner_text()
        page.locator("#modal-close").click()
        page.locator("#history-toggle").click()
        assert page.locator("#chat-children").is_hidden()
        page.locator("#history-toggle").click()
        assert page.locator("#chat-children").is_visible()
        checks.append("MyBased session chat + explicit no-AI state + history collapse")

        page.locator(".builder-footer [data-dialog='save']").click()
        assert "Sign in to save" in page.locator("#modal-heading").inner_text()
        assert page.locator("[data-modal-action='export']").is_visible()
        assert page.locator(".dialog button:disabled").count() == 1
        with page.expect_download() as item:
            page.locator("[data-modal-action='export']").click()
        download = item.value
        assert re.fullmatch(r"my-documentary\.html", download.suggested_filename)
        download_path = OUT / "exported-project.html"
        download.save_as(str(download_path))
        exported = download_path.read_text(encoding="utf-8")
        assert "My Documentary" in exported and "not a published" not in exported
        checks.append("honest sign-in-to-save gate + actual offline HTML export")

        page.locator("[data-dialog='profile']").first.click()
        assert "Give your work a home" == page.locator("#modal-heading").inner_text()
        assert "never appear" in page.locator("#modal-content").inner_text()
        page.locator("#modal-close").click()
        checks.append("profile teaser and private-vs-public disclosure")

        fresh_page = context.new_page()
        fresh_page.set_content(HTML, wait_until="load")
        assert "No guest chats yet" in fresh_page.locator("#chat-history").inner_text()
        assert fresh_page.locator("#preview h3").inner_text() == "Northstar Press"
        fresh_page.close()
        checks.append("guest memory intentionally resets in a fresh page")
        assert not errors, errors
        assert not requests, requests
        checks.append("no JavaScript exceptions / no outbound network requests")

        for width in (375, 390, 768, 940, 1170, 1440, 1920):
            pg = browser.new_page(viewport={"width": width, "height": 900})
            e = []
            pg.on("pageerror", lambda exc: e.append(str(exc)))
            pg.set_content(HTML, wait_until="load")
            assert pg.evaluate("document.documentElement.scrollWidth") <= width, width
            assert pg.locator("#builder-section").is_visible()
            assert pg.locator("#global-search").is_visible()
            assert not e, (width, e)
            if width in (375, 390, 768, 1440):
                pg.screenshot(path=str(OUT / f"responsive-{width}.png"), full_page=True)
            if width == 390:
                pg.locator("#mobile-menu").click()
                assert "mobile-open" in pg.locator("#sidebar").get_attribute("class")
                pg.locator("#menu-overlay").click()
                assert "mobile-open" not in pg.locator("#sidebar").get_attribute("class")
            pg.close()
        checks.append("375/390/768/940/1170/1440/1920 responsive, no overflow; mobile drawer")
        browser.close()
    print("PASS: " + str(len(checks)) + " grouped checks")
    for n, check in enumerate(checks, 1):
        print(f"  {n}. {check}")
    print(f"Screenshots: {OUT}")


if __name__ == "__main__":
    run()