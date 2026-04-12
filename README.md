# projeto-ford-inteligencia
API para extração automática de specs de veículos concorrentes usando web scraping + LLM local. FastAPI + React + SQLite + Ollama. Desafio Ford FIAP 2026.

🔧 Ford Commercial Intelligence

```text
projeto-ford/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app, rotas principais
│   │   ├── database.py             # Conexão com SQLite, funções de cache
│   │   ├── models.py               # Modelos Pydantic (schemas)
│   │   ├── scraping.py             # Coleta com requests/BeautifulSoup
│   │   ├── llm_client.py           # Chamada ao Ollama (extração JSON)
│   │   └── utils.py                # Funções auxiliares (hash, validação)
│   ├── requirements.txt            # Dependências: fastapi, uvicorn, requests, bs4, etc.
│   └── fichas.db                   # Banco SQLite (será criado na 1ª execução)
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Componente principal React
│   │   ├── api.js                  # Chamadas para o backend
│   │   └── components/...
│   ├── package.json
│   └── tailwind.config.js
├── README.md                       # Documentação do projeto (inclui contrato da API)
└── .gitignore
```
