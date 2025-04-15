from langchain_groq import ChatGroq
from browser_use import Agent
import asyncio
from dotenv import load_dotenv
load_dotenv()

async def main():
    agent = Agent(
        llm=ChatGroq(model="llama3-8b-8192"),  # or whatever Groq model you're using
    )
    response = await agent.run(task="Compare price of gpt-4o and DeepSeek-V3")
    
    # Assuming `response` is similar to OpenAI's and has `.content`
    print(response.content)  # 👈 print response like in the OpenAI version

asyncio.run(main())
