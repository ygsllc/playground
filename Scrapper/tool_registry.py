from typing import List
from crewai.tools import BaseTool
from tools.fill_form_tool import FillFormTool
from tools.scrape_tool import ScrapeTool
from tools.supabase_tool import SupabaseTool

class ToolRegistry:
    """Registry for all available CrewAI tools."""
    
    @staticmethod
    def get_tools() -> List[BaseTool]:
        """
        Get all registered tools.
        
        Returns:
            List of Tool instances
        """
        return [
            FillFormTool(),
            ScrapeTool(),
            SupabaseTool()
        ]
        
    @staticmethod
    def get_tool_by_name(name: str) -> BaseTool:
        """
        Get a specific tool by name.
        
        Args:
            name: Name of the tool to retrieve
            
        Returns:
            Tool instance
        
        Raises:
            ValueError if tool not found
        """
        tools = {
            "form": FillFormTool(),
            "scrape": ScrapeTool(),
            "storage": SupabaseTool()
        }
        
        if name not in tools:
            raise ValueError(f"Tool {name} not found in registry")
            
        return tools[name] 