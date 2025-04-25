from contextlib import asynccontextmanager
from playwright.async_api import async_playwright, Browser, Page
from loguru import logger

@asynccontextmanager
async def get_browser_context():
    """
    Async context manager for Playwright browser sessions.
    Handles browser setup and cleanup.
    """
    playwright = None
    browser = None
    
    try:
        playwright = await async_playwright().start()
        browser = await playwright.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        )
        page = await context.new_page()
        
        # Enable console logging
        page.on("console", lambda msg: logger.debug(f"Browser console: {msg.text}"))
        page.on("pageerror", lambda err: logger.error(f"Browser error: {err}"))
        
        yield page
        
    except Exception as e:
        logger.error(f"Error in browser context: {str(e)}")
        raise
        
    finally:
        if browser:
            await browser.close()
        if playwright:
            await playwright.stop()

async def wait_for_navigation(page: Page):
    """
    Helper function to wait for page navigation and network idle.
    """
    await page.wait_for_load_state("networkidle")
    await page.wait_for_load_state("domcontentloaded") 