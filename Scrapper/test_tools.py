import asyncio
from loguru import logger
from playwright.async_api import async_playwright
from tool_registry import ToolRegistry
from models.rate_result import RateResult
import re

async def test_tools():
    logger.info("Starting tool tests...")
    
    # Get tools from registry
    registry = ToolRegistry()
    scrape_tool = registry.get_tool_by_name("scrape")
    storage_tool = registry.get_tool_by_name("storage")
    
    async with async_playwright() as p:
        # Launch browser with specific options to avoid detection
        browser = await p.chromium.launch(
            headless=False,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-features=IsolateOrigins,site-per-process'
            ]
        )
        
        # Create a context that mimics a real browser
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        )
        
        page = await context.new_page()
        
        try:
            # Navigate to Wells Fargo rates page
            logger.info("Navigating to Wells Fargo rates page...")
            await page.goto("https://www.wellsfargo.com/mortgage/rates/", wait_until="networkidle")
            await page.wait_for_timeout(5000)  # Wait for dynamic content
            
            # Set up scrape tool
            scrape_tool.set_page(page)
            
            # Extract data using JavaScript
            data = await page.evaluate("""() => {
                // Helper function to clean text
                const cleanText = (text) => text ? text.trim().replace(/\\s+/g, ' ') : '';
                
                // Find the timestamp
                const timestampEl = Array.from(document.querySelectorAll('*')).find(
                    el => el.textContent && el.textContent.includes('Rates, terms, and fees as of')
                );
                const timestamp = timestampEl ? cleanText(timestampEl.textContent) : '';
                
                // Find all rate rows
                const rows = Array.from(document.querySelectorAll('*')).filter(el => {
                    const text = el.textContent || '';
                    return (
                        text.includes('Fixed Rate') || 
                        text.includes('ARM')
                    ) && text.includes('%');
                });
                
                // Extract data from each row
                const products = rows.map(row => {
                    const text = cleanText(row.textContent);
                    
                    // Extract loan type
                    const loanTypeMatch = text.match(/(\\d{2}-Year Fixed[- ]Rate(?:\\s+VA)?|\\d{1,2}\\/\\d{1,2}-Month ARM)/);
                    const loanType = loanTypeMatch ? loanTypeMatch[0] : '';
                    
                    // Extract percentages
                    const percentages = text.match(/(\\d+\\.\\d+)%/g) || [];
                    
                    // Extract points
                    const pointsMatch = text.match(/\\$(\\d{1,3}(?:,\\d{3})*)/);
                    const points = pointsMatch ? pointsMatch[0] : '';
                    
                    return {
                        loan_type: loanType,
                        interest_rate: percentages[0] ? parseFloat(percentages[0]) : 0,
                        apr: percentages[1] ? parseFloat(percentages[1]) : 0,
                        points: points,
                        timestamp: timestamp
                    };
                });
                
                return {
                    timestamp,
                    products: products.filter(p => p.loan_type && p.interest_rate && p.apr)
                };
            }""")
            
            if data['products']:
                logger.info(f"Found {len(data['products'])} products")
                logger.info(f"Timestamp: {data['timestamp']}")
                
                for product in data['products']:
                    try:
                        result = RateResult(
                            loan_type=product['loan_type'],
                            interest_rate=product['interest_rate'],
                            apr=product['apr'],
                            points=product['points'],
                            timestamp=data['timestamp']
                        )
                        
                        logger.info(f"Product:")
                        logger.info(f"  Loan Type: {result.loan_type}")
                        logger.info(f"  Interest Rate: {result.interest_rate}%")
                        logger.info(f"  APR: {result.apr}%")
                        logger.info(f"  Points: {result.points}")
                        
                        # Store in Supabase
                        await storage_tool._run(result)
                        
                    except Exception as e:
                        logger.error(f"Error processing product: {str(e)}")
                
                logger.info("Successfully scraped all rates!")
            else:
                logger.error("No products found in the page content")
            
        except Exception as e:
            logger.error(f"Error during testing: {str(e)}")
            raise
        
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_tools()) 