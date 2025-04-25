import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from loguru import logger
from dotenv import load_dotenv
from executor_agent import ExecutorAgent
from models.rate_result import RateResult

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Mortgage Rate Scraper API",
    description="API for scraping mortgage rates from various banks",
    version="1.0.0"
)

# Initialize executor agent
agent = ExecutorAgent()

class ScrapeRequest(BaseModel):
    """Request model for scraping endpoints."""
    banks: List[str]

@app.get("/")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "version": "1.0.0"}

@app.post("/scrape/{bank_name}")
async def scrape_bank(bank_name: str) -> Optional[RateResult]:
    """
    Trigger scraping for a single bank.
    
    Args:
        bank_name: Name of the bank to scrape
        
    Returns:
        RateResult object if successful
    """
    try:
        result = await agent.execute_scrape(bank_name)
        
        if not result:
            raise HTTPException(status_code=500, detail=f"Failed to scrape rates for {bank_name}")
            
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error in /scrape/{bank_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scrape")
async def scrape_multiple(request: ScrapeRequest) -> List[RateResult]:
    """
    Trigger scraping for multiple banks in parallel.
    
    Args:
        request: ScrapeRequest containing list of banks
        
    Returns:
        List of successful RateResult objects
    """
    try:
        results = await agent.execute_multi_scrape(request.banks)
        return results
        
    except Exception as e:
        logger.error(f"Error in /scrape: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 