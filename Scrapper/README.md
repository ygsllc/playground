# 🏦 Mortgage Rate Scraper

A modular AI agent system that scrapes mortgage rates from various banks using CrewAI and Playwright.

## 🌟 Features

- Configurable bank scraping via JSON configs
- Playwright-powered browser automation
- Supabase storage integration
- CrewAI agent orchestration
- FastAPI endpoints for triggering scrapes
- Parallel scraping support
- Structured error handling and logging

## 🛠️ Tech Stack

- Python 3.11+
- FastAPI
- Playwright
- CrewAI
- Supabase
- Pydantic
- Loguru

## 📁 Project Structure

```
project-root/
│
├── main.py                 # FastAPI app entry point
├── executor_agent.py       # Main scraping orchestrator
├── config/
│   ├── wf.json            # Wells Fargo config
│   └── chase.json         # Chase config
├── tools/
│   ├── fill_form_tool.py  # Form filling tool
│   ├── scrape_tool.py     # Rate scraping tool
│   └── supabase_tool.py   # Database storage tool
├── tool_registry.py       # CrewAI tool registry
├── crew_agent.yaml        # CrewAI configuration
├── models/
│   └── rate_result.py     # Rate result model
├── utils/
│   └── playwright_context.py  # Browser utilities
└── requirements.txt
```

## 🚀 Getting Started

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Install Playwright browsers:
   ```bash
   playwright install
   ```

5. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

6. Create Supabase table:
   ```sql
   create table mortgage_rates (
     id uuid default uuid_generate_v4() primary key,
     bank_name text not null,
     interest_rate float not null,
     apr float not null,
     loan_amount float not null,
     zip_code text not null,
     timestamp timestamptz not null default now(),
     error text
   );
   ```

7. Run the API:
   ```bash
   uvicorn main:app --reload
   ```

## 🔧 Configuration

Bank configurations are stored in JSON files under the `config/` directory. Example structure:

```json
{
  "bank": "Wells Fargo",
  "url": "https://wellsfargo.com/mortgage/rates",
  "requires_form": true,
  "form_fields": {
    "zip": "75013",
    "loan_amount": "500000"
  },
  "form_sequence": [
    {"action": "type", "selector": "#zip", "value_key": "zip"},
    {"action": "click", "selector": "#submit"}
  ],
  "scrape": {
    "rate_selector": "#rate",
    "apr_selector": "#apr"
  }
}
```

## 🌐 API Endpoints

- `GET /`: Health check
- `POST /scrape/{bank_name}`: Scrape single bank
- `POST /scrape`: Scrape multiple banks in parallel

Example request:
```bash
curl -X POST "http://localhost:8000/scrape" \
  -H "Content-Type: application/json" \
  -d '{"banks": ["wf", "chase"]}'
```

## 🧪 Testing

Run tests with:
```bash
pytest
```

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 