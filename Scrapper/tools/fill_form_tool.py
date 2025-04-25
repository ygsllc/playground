from typing import Dict, List, Any, Optional
from playwright.async_api import Page
from loguru import logger
from pydantic import Field
from crewai.tools import BaseTool
from utils.playwright_context import wait_for_navigation

class FillFormTool(BaseTool):
    name: str = "Form Filling Tool"
    description: str = "Fills out web forms using provided configuration"
    page: Optional[Any] = Field(default=None, exclude=True)

    def set_page(self, page: Page) -> None:
        """Set the Playwright page object."""
        self.page = page

    async def _run(self, form_sequence: List[Dict], form_fields: Dict[str, Any]) -> None:
        """
        Required implementation of BaseTool._run
        """
        if not self.page:
            raise ValueError("Page object not set. Call set_page() first.")
        return await self.fill_form(self.page, form_sequence, form_fields)

    async def fill_form(self, page: Page, form_sequence: List[Dict], form_fields: Dict) -> None:
        """
        Execute form filling sequence based on configuration.
        
        Args:
            page: Playwright page object
            form_sequence: List of form actions to execute
            form_fields: Dictionary of form field values
        """
        try:
            for step in form_sequence:
                action = step["action"]
                selector = step["selector"]
                
                # Wait for element to be visible
                await page.wait_for_selector(selector, state="visible", timeout=10000)
                
                if action == "type":
                    value = form_fields[step["value_key"]]
                    await page.fill(selector, value)
                    logger.info(f"Filled {selector} with {value}")
                    
                elif action == "click":
                    await page.click(selector)
                    logger.info(f"Clicked {selector}")
                    
                elif action == "wait":
                    await page.wait_for_selector(selector, state="visible", timeout=10000)
                    logger.info(f"Waited for {selector}")
                
                # Brief pause between actions
                await page.wait_for_timeout(500)
            
            # Wait for any final navigation
            await wait_for_navigation(page)
            
        except Exception as e:
            logger.error(f"Error filling form: {str(e)}")
            raise 