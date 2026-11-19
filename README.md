# ReStart — Adaptive Healthy-Habits Companion

ReStart is a wellness prototype designed to help people resume healthy routines after a missed habit check-in. Users create habit goals, record daily progress, describe barriers, and receive a contextual, AI-generated suggestion after a missed check-in.

> **Project stage:** Functional prototype  
> **Challenge alignment:** Future Health Digital Innovation Challenge — Wellbeing / Sustaining Healthy Behaviors  
> **Important:** ReStart is a general wellness-support prototype. It is not a medical device and does not diagnose, treat, or prevent any medical condition.

## 1. The problem

People may struggle to maintain healthy routines when everyday barriers such as low energy, lack of time, or forgetting interrupt their progress. A simple tracker can record a missed day, but may not help the user decide how to restart.

## 2. The solution

ReStart combines habit tracking with supportive, non-clinical AI suggestions:

1. A user creates a habit goal and selects a category and daily target.
2. The user records a check-in as `completed`, `partially_completed`, or `missed`.
3. The user can add a short note and select a barrier.
4. When a missed check-in is saved, the frontend requests a suggestion from the backend.
5. The backend sends relevant check-in context to an OpenAI-compatible API endpoint configured for OpenRouter.
6. The generated suggestion is returned to the frontend and displayed as a gentle next step.

The intention is to encourage a practical restart rather than shame or punish the user for missing a habit.

## 3. Current features

- Create and list habit goals.
- Record completed, partially completed, and missed check-ins.
- Capture optional notes and a barrier (`not_enough_time`, `low_energy`, `forgot`, `other`).
- Store goals and check-ins in SQLite.
- Generate a contextual suggestion for a missed check-in using OpenRouter.
- Display the returned suggestion in the React interface.

### Current data persistence

| Information | Current storage |
|---|---|
| Habit goals | SQLite `goals` table |
| Check-in status | SQLite `check_ins` table |
| Check-in note | SQLite `check_ins` table |
| Check-in barrier | SQLite `check_ins` table |
| AI-generated suggestion | Frontend state for the current session; not saved to SQLite |

Refreshing the page can clear the displayed AI suggestion. Goals and check-ins remain in the database.

## 4. Technology stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Python, FastAPI, Uvicorn |
| Validation | Pydantic |
| ORM / database access | SQLAlchemy |
| Database | SQLite |
| AI integration | OpenAI Python client with OpenRouter-compatible endpoint |
| Configuration | `python-dotenv` |

The prototype currently runs locally. Azure deployment is not implemented and is not required by the technology-neutral challenge description.

## 5. Architecture

```text
React + Vite frontend
        |
        | HTTP requests
        v
FastAPI backend
   |             |
   |             +---- OpenRouter API
   |                    (AI suggestion)
   |
   +---- SQLAlchemy ---- SQLite
          goals
          check_ins
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the request flow and API overview.

## 6. Repository structure

```text
restart-health/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── ai_service.py
│   ├── test_ai.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                 # local only; do not commit
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   └── src/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ASSUMPTIONS_AND_DATA.md
│   ├── RESPONSIBLE_AI_AND_PRIVACY.md
│   ├── TESTING_AND_LIMITATIONS.md
│   ├── SETUP_AND_CONFIGURATION.md
│   └── SOLUTION_DECK_OUTLINE.md
└── README.md
```

The exact frontend source structure may differ. Keep the repository's existing files and add the documentation files in the appropriate locations.

## 7. Prerequisites

The project was run locally with:

- Python 3.14.6
- Node.js 24.18.0
- npm 11.16.0

Use the same versions where practical for the closest reproduction of the tested setup. The Python virtual environment is local to each machine and should be recreated; do not commit `.venv`.

## 8. Backend setup (Windows)

Open Command Prompt:

```cmd
cd backend
py -m venv .venv
.venv\Scripts\activate.bat
python -m pip install -r requirements.txt
copy .env.example .env
```

Open `backend/.env` and replace the placeholder with your own OpenRouter API key. Then start the API:

```cmd
python -m uvicorn main:app --reload
```

Backend URL: `http://127.0.0.1:8000`  
Interactive API documentation: `http://127.0.0.1:8000/docs`

Keep this terminal running.

## 9. Frontend setup

Open a second terminal:

```cmd
cd frontend
npm install
npm run dev
```

Vite normally prints the local frontend URL, commonly `http://localhost:5173/`. Open the exact URL printed in your terminal.

Keep the frontend and backend terminals running together.

## 10. Environment variables

Create `backend/.env` using `backend/.env.example`:

```dotenv
LLM_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
LLM_ENDPOINT=https://openrouter.ai/api/v1
OPENROUTER_API_KEY=replace_with_your_own_key
```

- `LLM_MODEL`: model identifier sent to the configured API.
- `LLM_ENDPOINT`: OpenRouter API base URL.
- `OPENROUTER_API_KEY`: private API credential.

Never commit `.env`, paste the key into frontend code, or publish it in screenshots or recordings. The model identifier shown is the one used in the development configuration; model availability and free-tier limits can change.

## 11. API overview

The backend currently exposes these routes:

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/` | Basic API/root response |
| `POST` | `/goals` | Create a habit goal |
| `GET` | `/goals` | List habit goals |
| `POST` | `/check-ins` | Save a check-in |
| `GET` | `/check-ins` | List check-ins |
| `GET` | `/check-ins/{check_in_id}/suggestion` | Generate a suggestion for a missed check-in |

The suggestion route is intended for missed check-ins. The backend validates the check-in and associated goal, then requests a suggestion from the configured AI provider. See `/docs` while the backend is running for the live request schemas and responses.

## 12. Database

SQLite is configured through SQLAlchemy. The current models include:

- `Goal`: `id`, `title`, `category`, `daily_target`
- `CheckIn`: `id`, `goal_id`, `status`, `note`, `barrier`

The backend creates tables on startup. A small startup helper adds the `barrier` column to an existing `check_ins` table when it is missing. This is a lightweight prototype migration, not a full database migration system.

The local database file is `backend/restart.db`. Do not commit a database containing personal or test-user data. A clean clone can create its own local database when the backend starts.

## 13. Data assumptions

- No external clinical dataset is currently used.
- No model is trained or fine-tuned by this project.
- User-entered goals, statuses, notes and barriers provide the context for the application.
- AI suggestions are generated at request time by an external LLM provider.
- The prototype does not establish clinical efficacy or behavior-change outcomes.

More detail: [`docs/ASSUMPTIONS_AND_DATA.md`](docs/ASSUMPTIONS_AND_DATA.md).

## 14. Responsible AI, privacy and safety

ReStart is a general wellness and habit-support tool. It must not be presented as a diagnostic, treatment, emergency, or clinical decision-support system.

The prototype has no login, authentication, authorization, multi-user isolation, or user-controlled data-sharing feature. SQLite data is stored locally in the configured database file. When a missed-check-in suggestion is requested, relevant context is sent to the configured external AI provider. Do not enter sensitive medical or identifying information.

More detail: [`docs/RESPONSIBLE_AI_AND_PRIVACY.md`](docs/RESPONSIBLE_AI_AND_PRIVACY.md).

## 15. Testing the prototype

A practical manual smoke test:

1. Start the backend and frontend.
2. Create a habit.
3. Record a completed check-in.
4. Record a partially completed check-in.
5. Record a missed check-in and choose a barrier.
6. Confirm that a suggestion appears when the AI service is available.
7. Refresh the page and confirm that goals and check-ins remain.
8. Confirm that the suggestion is not persisted after refresh.

`backend/test_ai.py` is an AI-service test script. It requires a valid backend `.env` and a working provider/model configuration; it may incur provider usage or be affected by rate limits.

See [`docs/TESTING_AND_LIMITATIONS.md`](docs/TESTING_AND_LIMITATIONS.md).

## 16. Known limitations

- AI suggestions are not persisted in the database.
- Check-ins do not currently include a date or timestamp field.
- Date-aware daily history, streaks and calendar analytics are not implemented.
- The prototype does not implement user accounts or multi-user data isolation.
- SQLite is used for local prototyping; production deployment would require a reviewed persistence and backup strategy.
- The AI provider is external; availability, latency, model behavior and rate limits are outside the application's control.
- Automated test coverage is limited; the documented workflow is primarily verified through manual testing.
- No clinical validation, formal usability study, or outcome evaluation is claimed.
- The current app has not been deployed to Azure or another public hosting environment.

## 17. Future development

Potential next steps, not current features:

- Add authentication, authorization and user-specific data separation.
- Add timestamps and date-aware habit history.
- Persist AI suggestions with appropriate retention controls.
- Add user-configurable reminders and progress visualizations.
- Add structured evaluation of suggestion usefulness and user experience.
- Review privacy, security, accessibility and clinical boundaries with relevant experts.
- Conduct user testing and evaluate outcomes before making impact claims.
- Assess a production deployment architecture, including Azure if appropriate.

## 18. Challenge context

ReStart is submitted as a prototype aligned with the Wellbeing challenge statement **“Sustaining Healthy Behaviors.”** The concept focuses on supporting users after a missed habit through reflection on barriers and a practical next step.

The official challenge is technology-neutral and asks for a working prototype with technical documentation, assumptions and limitations. Always follow the live Hack2Skill dashboard for the final upload fields and any updated submission instructions.

## 19. License and contribution

No open-source license is specified here. Add a license only after deciding how you want the code to be reused. Do not assume that public GitHub visibility automatically grants a particular license.
