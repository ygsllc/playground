from playwright.async_api import async_playwright
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage

class Agent:
    def __init__(self, llm: BaseChatModel, headless: bool = False, chrome_path: str = None):
        self.llm = llm
        self.headless = headless
        self.chrome_path = chrome_path

    async def run(self, task: str):
        async with async_playwright() as p:
            # Launch the browser with specific arguments to avoid detection
            browser = await p.chromium.launch(
                headless=self.headless,
                executable_path=self.chrome_path,
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--no-sandbox',
                    '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                ]
            )
            
            # Create a new page with specific settings
            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            )
            page = await context.new_page()
            
            # Add script to make navigator.webdriver undefined
            await page.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined
                });
            """)
            
            # Navigate to Google
            await page.goto('https://www.google.com')
            
            # Type into the search box with random delays
            await page.click('textarea[name="q"]')
            await page.type('textarea[name="q"]', task, delay=100)  # Add random typing delay
            await page.wait_for_timeout(1000)  # Wait a bit before pressing Enter
            await page.press('textarea[name="q"]', 'Enter')
            
            # Wait for results to load
            await page.wait_for_load_state('networkidle')
            await page.wait_for_timeout(2000)  # Give extra time for results to render
            
            # Extract search result snippets
            search_results = await page.evaluate("""() => {
                const results = [];
                // Try different selectors that Google might use
                const resultElements = Array.from(document.querySelectorAll('div[data-sokoban-container], div.g, div[jscontroller][data-hveid]'));
                
                resultElements.forEach(result => {
                    // Try multiple possible selectors for each component
                    const title = 
                        result.querySelector('h3')?.textContent ||
                        result.querySelector('[role="heading"]')?.textContent || '';
                        
                    const snippet = 
                        result.querySelector('div.VwiC3b')?.textContent ||
                        result.querySelector('div[data-snf]')?.textContent ||
                        result.querySelector('div[data-sncf]')?.textContent ||
                        result.querySelector('div[style*="webkit-line-clamp"]')?.textContent || '';
                        
                    const link = 
                        result.querySelector('a[jsname]')?.href ||
                        result.querySelector('a[ping]')?.href ||
                        result.querySelector('a')?.href || '';
                        
                    if (title && snippet) {
                        results.push({ title, snippet, link });
                    }
                });
                return results;
            }""")
            
            # Format the results for the LLM
            formatted_results = "\n\n".join([
                f"Title: {result['title']}\nSnippet: {result['snippet']}\nURL: {result['link']}"
                for result in search_results[:5]  # Limit to first 5 results
            ])
            
            # Use the LLM to analyze the content
            response = await self.llm.ainvoke([
                HumanMessage(content=f"""Please analyze these Google search results about {task}.
                Focus on:
                1. Salary ranges mentioned
                2. Recent data points from reliable sources
                3. Any location-specific information
                
                If you find relevant information, summarize it. If you don't find the exact information, mention what related information you found.
                
                Search Results:
                {formatted_results}""")
            ])
            
            # Close the browser
            await context.close()
            await browser.close()
            
            return response