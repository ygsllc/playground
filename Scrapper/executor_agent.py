import json
import asyncio
from pathlib import Path
from typing import Dict, Optional
from loguru import logger
from crewai import Agent
from utils.playwright_context import get_browser_context
from tool_registry import ToolRegistry
from models.rate_result import RateResult

class ExecutorAgent:
    """Agent responsible for executing the mortgage rate scraping workflow."""
    
    def __init__(self):
        """Initialize the executor agent with required tools."""
        self.tools = ToolRegistry.get_tools()
        self.agent = Agent(
            role="Mortgage Rate Scraper",
            goal="Accurately scrape mortgage rates from bank websites",
            backstory="I am an automated agent that scrapes mortgage rates from various banks",
            tools=self.tools
        )
        
    async def load_config(self, bank_name: str) -> Dict:
        """
        Load bank-specific scraping configuration.
        
        Args:
            bank_name: Name of the bank to load config for
            
        Returns:
            Dictionary containing bank configuration
        """
        config_path = Path(__file__).parent / "config" / f"{bank_name.lower()}.json"
        
        if not config_path.exists():
            raise ValueError(f"Configuration not found for bank: {bank_name}")
            
        with open(config_path) as f:
            return json.load(f)
            
    async def execute_scrape(self, bank_name: str) -> Optional[RateResult]:
        """
        Execute the complete scraping workflow for a bank.
        
        Args:
            bank_name: Name of the bank to scrape
            
        Returns:
            RateResult object if successful, None if failed
        """
        try:
            # Load bank configuration
            config = await self.load_config(bank_name)
            logger.info(f"Loaded configuration for {bank_name}")
            
            # Get tool instances
            form_tool = ToolRegistry.get_tool_by_name("form")
            scrape_tool = ToolRegistry.get_tool_by_name("scrape")
            storage_tool = ToolRegistry.get_tool_by_name("storage")
            
            async with get_browser_context() as page:
                # Navigate to bank URL
                await page.goto(config["url"])
                logger.info(f"Navigated to {config['url']}")
                
                # Fill form if required
                if config.get("requires_form"):
                    await form_tool.fill_form(
                        page=page,
                        form_sequence=config["form_sequence"],
                        form_fields=config["form_fields"]
                    )
                    logger.info("Completed form filling sequence")
                
                # Scrape rates
                result = await scrape_tool.scrape_rates(page=page, config=config)
                
                if result and not result.error:
                    # Store result in Supabase
                    await storage_tool.store_result(result)
                    return result
                else:
                    logger.error(f"Failed to scrape rates for {bank_name}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error executing scrape for {bank_name}: {str(e)}")
            return None
            
    async def execute_multi_scrape(self, bank_names: list[str]) -> list[RateResult]:
        """
        Execute scraping workflow for multiple banks in parallel.
        
        Args:
            bank_names: List of bank names to scrape
            
        Returns:
            List of successful RateResult objects
        """
        tasks = [self.execute_scrape(bank) for bank in bank_names]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out failed results
        return [r for r in results if isinstance(r, RateResult) and not r.error] 