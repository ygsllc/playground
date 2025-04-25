from pydantic import BaseModel, Field
from typing import Optional

class RateResult(BaseModel):
    loan_type: str = Field(..., description="Type of mortgage loan")
    interest_rate: float = Field(..., description="Interest rate percentage")
    apr: float = Field(..., description="Annual Percentage Rate")
    points: str = Field(..., description="Points cost in dollars")
    timestamp: str = Field(..., description="Timestamp when rates were last updated")
    error: Optional[str] = Field(None, description="Error message if scraping failed") 