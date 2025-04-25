from typing import Dict, List, Optional, Any
from playwright.async_api import Page
from loguru import logger
from pydantic import Field
from crewai.tools import BaseTool
from models.rate_result import RateResult

class ScrapeTool(BaseTool):
    name: str = "Rate Scraping Tool"
    description: str = "Extracts mortgage rates from web pages using specified selectors"
    page: Optional[Any] = Field(default=None, exclude=True)

    def set_page(self, page: Page) -> None:
        """Set the Playwright page object."""
        self.page = page

    async def _run(self, rate_selector: str, apr_selector: str) -> RateResult:
        """
        Required implementation of BaseTool._run
        """
        if not self.page:
            raise ValueError("Page object not set. Call set_page() first.")
        return await self.scrape_rates(self.page, rate_selector, apr_selector)

    async def scrape_rates(self, page: Page, rate_selector: str, apr_selector: str) -> RateResult:
        """
        Scrape mortgage rates using provided selectors.
        
        Args:
            page: Playwright page object
            rate_selector: Selector for the interest rate
            apr_selector: Selector for the APR
            
        Returns:
            RateResult object with scraped data or None if scraping fails
        """
        try:
            # Wait for rate elements to be visible
            await page.wait_for_selector(rate_selector, state="visible", timeout=10000)
            await page.wait_for_selector(apr_selector, state="visible", timeout=10000)
            
            # Extract text content
            rate_text = await page.text_content(rate_selector)
            apr_text = await page.text_content(apr_selector)
            
            # Clean and convert to float
            rate = float(rate_text.strip().replace("%", ""))
            apr = float(apr_text.strip().replace("%", ""))
            
            # Create result object
            result = RateResult(
                bank_name=self.name,
                interest_rate=rate,
                apr=apr,
                loan_amount=float(self.config.get("form_fields", {}).get("loan_amount", "0")),
                zip_code=self.config.get("form_fields", {}).get("zip", "00000")
            )
            
            logger.info(f"Successfully scraped rates for {self.name}: {rate}% / {apr}% APR")
            return result
            
        except Exception as e:
            logger.error(f"Error scraping rates: {str(e)}")
            return RateResult(
                bank_name=self.name,
                interest_rate=0.0,
                apr=0.0,
                loan_amount=0.0,
                zip_code="00000",
                error=str(e)
            ) 