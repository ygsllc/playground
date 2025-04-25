You are a professional software architect. Build a clean, modular, production-grade application using the specifications below. Use appropriate architectural patterns, and include all necessary files, comments, and docstrings.

# App Overview
- Name: {{Insert App Name}}
- Type: {{Web app / API / AI agent system / automation tool / RAG service}}
- Tech stack: 
  - Python 3.10+
  - FastAPI (preferred for APIs)
  - Use LangChain when building AI agents, tool-using chains, or document Q&A systems
  - Use CrewAI or AutoGen when multiple AI agents are required
  - Use Pinecone, Supabase, or ChromaDB as vector store if retrieval is involved

# Functional Requirements
- {{Feature 1 – e.g., User enters a query that triggers AI agent reasoning}}
- {{Feature 2 – e.g., Agent 1 fetches data, Agent 2 summarizes, Agent 3 critiques or enriches output}}
- {{Feature 3 – e.g., User receives final answer via API endpoint or web interface}}
- {{Optional – Use OpenAI API or Anthropic for core LLMs}}

# AI/Agent Design (if applicable)
- If the task involves reasoning, decision-making, summarization, or multi-step logic, implement as a **multi-agent system**
- Design agents with clear responsibilities (e.g., Researcher, Synthesizer, Critic)
- Use LangChain agents + tools **OR** CrewAI-style agent orchestration
- Each agent must have: a purpose, memory/context sharing, and clear task boundaries

# Output Requirements
- Entire app must run in Replit or export cleanly via GitHub
- Include `main.py` or `run.py` to launch app
- Include `requirements.txt` for all dependencies
- Include `.replit` for correct entry point
- Include `.env.example` file with placeholder secrets (e.g., OPENAI_API_KEY)
- Include `README.md` with setup, API docs, and agent logic description

# Code Style
- Use async FastAPI endpoints
- Organize code into `/routes`, `/agents`, `/tools`, `/services`, `/config`, etc.
- Use `dotenv` for env variables
- Follow clean, modular architecture
- Add type hints, docstrings, and comments throughout

# Bonus
- Add `tests/` with sample pytest tests
- Include `curl` or Postman samples for interacting with the app
- Add logging, error handling, and input validation

Respond only with the **full folder and file structure and complete codebase**.
