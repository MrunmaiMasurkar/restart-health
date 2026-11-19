# Setup and Configuration

## 1. Prerequisites

Versions used in the local development environment:
- Python 3.14.6
- Node.js 24.18.0
- npm 11.16.0

Use the same versions where possible to reproduce the tested setup. If you use other versions, verify dependency compatibility.

## 2. Backend — Windows Command Prompt

```cmd
cd backend
py -m venv .venv
.venv\Scripts\activate.bat
python -m pip install -r requirements.txt
copy .env.example .env
```

Edit `backend/.env` and set your own API key:

```dotenv
LLM_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
LLM_ENDPOINT=https://openrouter.ai/api/v1
OPENROUTER_API_KEY=replace_with_your_own_key
```

Start FastAPI:

```cmd
python -m uvicorn main:app --reload
```

Open:
- API: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`

Keep this terminal open.

## 3. Frontend — second terminal

```cmd
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, commonly `http://localhost:5173/`.

Keep this terminal open as well.

## 4. Python virtual environment

`.venv` is a machine-local environment. It contains installed Python packages and must be created separately on each development machine. It should not be pushed to GitHub.

If Windows resolves a global Python/Uvicorn executable instead of the project's environment, activate `.venv` and invoke Uvicorn through the environment's Python:

```cmd
.venv\Scripts\activate.bat
python -m uvicorn main:app --reload
```

## 5. Environment file

`.env.example` is a template and is safe to commit because it contains only a placeholder. `.env` contains the real API key and must remain local and ignored by Git.

The frontend must never receive the OpenRouter API key. AI provider requests are made by the backend.

## 6. Database

The backend uses SQLite at the configured relative path `sqlite:///./restart.db`. When started from the backend directory, this resolves to the local `backend/restart.db` file. The backend creates tables when it starts.

The database file is local state and should not be committed if it contains personal or test data.
