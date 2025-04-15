from langchain_openai import ChatOpenAI
from browser_use import Agent
import asyncio
from dotenv import load_dotenv
load_dotenv()

async def main():
    agent = Agent(
        llm=ChatOpenAI(model="gpt-4o-mini"),
    )
    response = await agent.run(task="Compare price of gpt-4o and DeepSeek-V3")
    print(response.content)

asyncio.run(main())