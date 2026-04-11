# projeto-ford-inteligencia
API para extração automática de specs de veículos concorrentes usando web scraping + LLM local. FastAPI + React + SQLite + Ollama. Desafio Ford FIAP 2026.

🔧 Ford Commercial Intelligence
```text

backend/
├── __init__.py          # Pode ficar vazio ou com versão/descrição
├── main.py              # app FastAPI
├── routes/
│   ├── __init__.py      # Exporta os routers (ex: from .veiculos import router)
│   └── veiculos.py
├── models/
│   ├── __init__.py
│   └── ficha.py
├── services/
│   ├── __init__.py
│   ├── scraper.py
│   └── llm_client.py
└── database/
    ├── __init__.py
    └── cache.py
```
