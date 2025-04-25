from typing import List, Union, Optional, Any
import os
from loguru import logger
from supabase import create_client, Client
from pydantic import Field
from crewai.tools import BaseTool
from models.rate_result import RateResult

class SupabaseTool(BaseTool):
    name: str = "Supabase Storage Tool"
    description: str = "Stores mortgage rate results in Supabase database"
    client: Optional[Any] = Field(default=None, exclude=True)
    
    def __init__(self, **data):
        """Initialize Supabase client from environment variables."""
        super().__init__(**data)
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables are required")
            
        self.client = create_client(supabase_url, supabase_key)

    async def _run(self, result: Union[RateResult, List[RateResult]]) -> None:
        """
        Required implementation of BaseTool._run
        """
        if isinstance(result, list):
            return await self.store_results(result)
        return await self.store_result(result)

    async def store_result(self, result: RateResult) -> None:
        """
        Store a single rate result in Supabase.
        
        Args:
            result: RateResult object to store
        """
        try:
            data = result.model_dump()
            response = self.client.table("mortgage_rates").insert(data).execute()
            
            if response.data:
                logger.info(f"Successfully stored rate for {result.bank_name}")
            else:
                logger.error(f"Failed to store rate for {result.bank_name}")
                
        except Exception as e:
            logger.error(f"Error storing rate in Supabase: {str(e)}")
            raise
            
    async def store_results(self, results: List[RateResult]) -> None:
        """
        Store multiple rate results in Supabase.
        
        Args:
            results: List of RateResult objects to store
        """
        try:
            data = [result.model_dump() for result in results]
            response = self.client.table("mortgage_rates").insert(data).execute()
            
            if response.data:
                logger.info(f"Successfully stored {len(results)} rate results")
            else:
                logger.error("Failed to store rate results")
                
        except Exception as e:
            logger.error(f"Error storing rates in Supabase: {str(e)}")
            raise 