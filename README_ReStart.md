# ReStart --- An Adaptive Healthy-Habits Companion

> **Small steps. Meaningful progress.**
>
> ReStart is a full-stack hackathon prototype that helps people build
> healthier routines through habit goals, daily check-ins, progress
> summaries, and AI-generated suggestions when a habit is missed.

------------------------------------------------------------------------

## Table of Contents

-   [1. Project Overview](#1-project-overview)
-   [2. Problem Statement](#2-problem-statement)
-   [3. Proposed Solution](#3-proposed-solution)
-   [4. Goals and Design Principles](#4-goals-and-design-principles)
-   [5. Features](#5-features)
-   [6. Technology Stack](#6-technology-stack)
-   [7. Architecture](#7-architecture)
-   [8. Repository Structure](#8-repository-structure)
-   [9. How the Application Works](#9-how-the-application-works)
-   [10. Database Design](#10-database-design)
-   [11. Backend API Reference](#11-backend-api-reference)
-   [12. AI Suggestion Integration](#12-ai-suggestion-integration)
-   [13. Frontend Implementation](#13-frontend-implementation)
-   [14. Validation and Error
    Handling](#14-validation-and-error-handling)
-   [15. Setup and Installation](#15-setup-and-installation)
-   [16. Environment Variables and
    Secrets](#16-environment-variables-and-secrets)
-   [17. Running the Application](#17-running-the-application)
-   [18. Testing the API](#18-testing-the-api)
-   [19. Example User Journey](#19-example-user-journey)
-   [20. Current Limitations](#20-current-limitations)
-   [21. Future Improvements](#21-future-improvements)
-   [22. Security, Privacy, and Responsible
    AI](#22-security-privacy-and-responsible-ai)
-   [23. Troubleshooting](#23-troubleshooting)
-   [24. Interview Preparation Guide](#24-interview-preparation-guide)
-   [25. Quick Revision Sheet](#25-quick-revision-sheet)

------------------------------------------------------------------------

## 1. Project Overview

**Project name:** ReStart\
**Project type:** Full-stack web application / hackathon prototype\
**Domain:** Healthy habits and behaviour support\
**Frontend:** React + Vite\
**Backend:** Python + FastAPI\
**Database:** SQLite, accessed through SQLAlchemy\
**AI integration:** OpenRouter using an OpenAI-compatible API client\
**Local development URLs:**

-   Frontend: `http://localhost:5173`
-   Backend: `http://127.0.0.1:8000`
-   Interactive API documentation: `http://127.0.0.1:8000/docs`

ReStart lets a user define a habit, record how the habit went, review
previous check-ins, and receive an AI-generated suggestion after a
missed habit. The product is designed around encouragement rather than
guilt: a missed day is treated as information that can help the user
choose a more realistic next step.

The current prototype is a single-user local application.
Authentication, multi-user data separation, deployment, and
production-grade operational controls are not implemented yet.

## 2. Problem Statement

People often set healthy goals but find it difficult to maintain them
when work, low energy, forgetfulness, or other day-to-day barriers get
in the way. A simple checklist can record whether a task was completed,
but it may not help the user understand what made the task difficult or
how to restart.

ReStart explores a lightweight approach to this problem:

1.  Let the user define a small, measurable habit.
2.  Make daily progress easy to record.
3.  Preserve a history of completed, partially completed, and missed
    attempts.
4.  When a habit is missed, offer a practical, supportive suggestion.
5.  Present progress in a simple dashboard without framing a missed day
    as failure.

## 3. Proposed Solution

The application has three main layers:

1.  **React frontend** --- presents the dashboard, habit list, history,
    and modal forms.
2.  **FastAPI backend** --- validates requests, applies business rules,
    interacts with the database, and exposes REST endpoints.
3.  **SQLite database** --- persists habit goals and check-ins.
4.  **AI service integration** --- calls a model through OpenRouter to
    generate a personalized, non-medical suggestion for a missed
    check-in.

The frontend does not connect directly to SQLite or call the AI
provider. It sends HTTP requests to the backend. The backend owns
persistence and the AI integration.

## 4. Goals and Design Principles

-   **Make starting small easy:** habits have a name, category, and
    measurable daily target.
-   **Support imperfect progress:** check-ins can be completed,
    partially completed, or missed.
-   **Turn setbacks into useful feedback:** a missed check-in can
    trigger a suggestion.
-   **Keep responsibilities separated:** UI, API/business logic,
    persistence, and AI integration are distinct responsibilities.
-   **Validate input at the API boundary:** request models enforce basic
    constraints before endpoint logic runs.
-   **Avoid medical claims:** suggestions are intended as general habit
    support, not diagnosis or treatment.
-   **Keep the prototype manageable:** SQLite and a small REST API
    reduce setup complexity for a hackathon.

## 5. Features

### Implemented in the current prototype

-   Create a habit using a modal form.
-   Select a category such as movement, sleep, hydration, mindfulness,
    nutrition, or other.
-   Set a daily target, represented in the current API/UI as minutes.
-   Record a check-in against an existing habit.
-   Choose `completed`, `partially_completed`, or `missed`.
-   Optionally record a note and a reason/barrier for a missed habit.
-   View habits in the dashboard and the My Habits view.
-   View previous check-ins in the dashboard and History view.
-   View basic completion, partial-completion, and missed-check-in
    counts.
-   View a completion percentage based on recorded check-ins.
-   Request an AI suggestion for a missed check-in.
-   Display the suggestion on the dashboard with a dismiss control.
-   Validate request fields using Pydantic.
-   Persist goals and check-ins in SQLite.
-   Enable local frontend-to-backend requests through CORS
    configuration.
-   Explore and test the backend through FastAPI's generated API
    documentation.

### Not currently implemented

-   User accounts, login, or authentication.
-   Separate private data for different users.
-   A real calendar/date field on each check-in.
-   Streak calculations or a date-aware weekly/monthly analytics engine.
-   Editing or deleting habits and check-ins.
-   Accept/edit/decline actions for AI suggestions.
-   Background jobs, queues, or asynchronous AI processing.
-   Automated deployment or production hosting.
-   A production test suite covering every endpoint and failure case.

These are potential extensions, not claims about the current
implementation.

## 6. Technology Stack

  -----------------------------------------------------------------------
  Technology                          Role in the project
  ----------------------------------- -----------------------------------
  React                               Builds the interactive user
                                      interface using components and
                                      state

  Vite                                Runs the frontend development
                                      server and builds frontend assets

  JavaScript                          Implements UI behaviour, state
                                      updates, and HTTP requests

  CSS                                 Provides the sidebar layout, forms,
                                      cards, modal styling, and
                                      responsive presentation

  Python                              Implements backend endpoints and AI
                                      service integration

  FastAPI                             Defines REST endpoints and
                                      request/response handling

  Pydantic                            Validates incoming request data and
                                      constraints

  SQLAlchemy                          Maps Python model classes to
                                      database tables and manages
                                      database sessions

  SQLite                              Stores goals and check-ins in a
                                      local database file

  OpenRouter                          Provides access to a configured
                                      language model through an API

  `python-dotenv`                     Loads local environment
                                      configuration from a `.env` file

  Uvicorn                             Runs the FastAPI ASGI application
                                      locally
  -----------------------------------------------------------------------

**Version note:** the project was developed with Node.js `v24.18.0`, npm
`11.16.0`, and a Vite 8-based frontend. Check the project's actual
package files and Python dependency file for the exact versions
installed in a particular checkout.

## 7. Architecture

### High-level request flow

``` text
User
 |
 v
React + Vite frontend
 |
 | HTTP / JSON
 v
FastAPI backend
 |             \
 |              \----> AI service module
 |                       |
 v                       v
SQLAlchemy             OpenRouter API
 |
 v
SQLite database
```

### Responsibility boundaries

**Frontend** - Collects input from forms. - Sends JSON requests to the
backend. - Displays loading, success, and error states. - Maintains UI
state for the selected view, open modal, fetched data, and AI
suggestion.

**FastAPI application** - Exposes HTTP endpoints. - Validates incoming
request bodies through Pydantic models. - Checks relevant business
rules, such as whether a goal exists and whether a check-in is eligible
for a suggestion. - Reads and writes records through SQLAlchemy. - Calls
the AI service when a suggestion is requested.

**Database layer** - Defines the database engine and session factory. -
Provides a dependency that opens a session for a request and closes it
afterward. - Stores goals and check-ins.

**AI service** - Reads provider configuration from environment
variables. - Calls the configured model through OpenRouter. - Returns
suggestion text to the backend, which then returns it to the frontend.

### Why use a REST API?

The frontend and backend can evolve independently as long as they agree
on endpoint URLs, HTTP methods, JSON request bodies, and response
structures. It also makes the API testable without opening the React UI.

### Why SQLite for the prototype?

SQLite requires no separate database server and stores data in a local
file. That makes it convenient for a hackathon prototype. A hosted
relational database such as PostgreSQL would be a more suitable option
for a deployed, concurrent, multi-user version.

## 8. Repository Structure

The project root is `D:\restart-health`.

``` text
restart-health/
├── backend/
│   ├── .venv/                 # Local Python virtual environment; do not commit
│   ├── main.py                # FastAPI app, schemas, and endpoints
│   ├── database.py            # Engine, session factory, DB dependency
│   ├── models.py              # SQLAlchemy Goal and CheckIn models
│   ├── ai_service.py          # OpenRouter/model integration
│   ├── .env                   # Local secrets/configuration; do not commit
│   ├── restart.db             # Local SQLite database; usually not committed
│   └── ...                    # Dependency file and optional tests
└── frontend/
    ├── src/
    │   ├── App.jsx             # Main React UI and interaction logic
    │   ├── App.css             # Application styling
    │   ├── main.jsx            # React entry point (standard Vite setup)
    │   └── ...
    ├── public/
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
```

This is a conceptual map of the project based on the current
implementation. The exact filenames of dependency files and any
additional Vite-generated files should be confirmed in the checked-out
repository.

## 9. How the Application Works

### 9.1 Initial page load

When the React component mounts, an effect calls `loadData()`.

`loadData()` makes two requests in parallel:

-   `GET /goals`
-   `GET /check-ins`

Using `Promise.all()` allows both independent requests to be in flight
at the same time. If both succeed, the returned JSON is stored in React
state. While the requests are in progress, the UI displays a loading
state. If a request fails, the UI shows a backend
connection/data-loading error.

### 9.2 Creating a habit

1.  The user clicks **Add Habit** in the sidebar.
2.  A modal form opens.
3.  The user enters a habit name, category, and daily target.
4.  The form sends `POST /goals` with a JSON body.
5.  FastAPI/Pydantic validates the body.
6.  The backend creates and commits a `Goal` record.
7.  The response contains the new habit and its database ID.
8.  React adds the returned habit to its state and closes the modal.

The frontend updates its local state from the returned API response
rather than guessing the new ID.

### 9.3 Recording a check-in

1.  The user clicks **Daily Check-in** in the sidebar.
2.  The user selects an existing habit and a status.
3.  If the status is `missed`, the user can optionally select a barrier
    such as lack of time, low energy, or forgetting.
4.  The user can add an optional note.
5.  React sends `POST /check-ins`.
6.  The backend validates the status, verifies that the goal exists,
    saves the check-in, and returns the saved record.
7.  React adds that record to its state and returns to the dashboard.

### 9.4 Generating an AI suggestion

After a missed check-in has been saved successfully:

1.  The frontend receives the saved check-in, including its generated
    `id`.
2.  The frontend displays a temporary "Getting your personalized
    suggestion..." message in the suggestion card.
3.  It requests `GET /check-ins/{id}/suggestion`.
4.  The backend finds the check-in and its associated goal.
5.  The backend confirms that the check-in status is `missed`.
6.  The backend calls the AI service.
7.  The generated suggestion is returned as JSON.
8.  React replaces the loading text with the suggestion.

The suggestion request happens **after** the check-in is saved.
Therefore, if AI generation fails, the check-in itself can still remain
saved. The frontend catches a suggestion-fetch error and displays a
fallback message.

### 9.5 Dashboard calculations

The current dashboard derives simple totals from the loaded check-in
array:

-   `completedCount`: number of records with status `completed`.
-   `partialCount`: number of records with status `partially_completed`.
-   `missedCount`: number of records with status `missed`.
-   `completionPercentage`: `completedCount / totalCheckIns × 100`,
    rounded to the nearest integer.

If there are no check-ins, the percentage is zero.

This is a percentage of **all recorded check-ins**, not a calendar-based
daily adherence rate. The current check-in model does not store a date,
so the app should not describe this number as a weekly or monthly
completion rate.

## 10. Database Design

The current data model has two main tables: `goals` and `check_ins`.

### 10.1 `goals`

  -----------------------------------------------------------------------
  Column                  Type                    Purpose
  ----------------------- ----------------------- -----------------------
  `id`                    Integer, primary key    Unique goal identifier

  `title`                 String, required        User-defined habit name

  `category`              String, required        Habit category

  `daily_target`          Integer, required       Daily target value;
                                                  currently treated as
                                                  minutes in the UI
  -----------------------------------------------------------------------

Example record:

``` json
{
  "id": 1,
  "title": "Walk for 10 minutes",
  "category": "movement",
  "daily_target": 10
}
```

### 10.2 `check_ins`

  ------------------------------------------------------------------------
  Column                  Type                    Purpose
  ----------------------- ----------------------- ------------------------
  `id`                    Integer, primary key    Unique check-in
                                                  identifier

  `goal_id`               Integer, foreign key    References `goals.id`

  `status`                String, required        `completed`,
                                                  `partially_completed`,
                                                  or `missed`

  `note`                  String, required,       Optional user note
                          default empty           

  `barrier`               String, nullable        Optional reason a habit
                                                  was missed
  ------------------------------------------------------------------------

Example record:

``` json
{
  "id": 2,
  "goal_id": 1,
  "status": "missed",
  "note": "I did not have enough time today",
  "barrier": "not_enough_time"
}
```

### 10.3 Relationship

One goal can have many check-ins. Each check-in references one goal
using `goal_id`.

``` text
goals
  id (PK)
   |
   | one-to-many
   v
check_ins
  goal_id (FK -> goals.id)
```

The backend checks that the referenced goal exists before saving a
check-in. The foreign key also expresses the intended relationship at
the database-model level.

### 10.4 SQLAlchemy and database sessions

`database.py` defines: - `engine`: connects SQLAlchemy to
`sqlite:///./restart.db`. - `SessionLocal`: creates database sessions. -
`Base`: base class for declarative models. - `get_db()`: yields a
session and closes it in a `finally` block.

The request dependency pattern ensures that a session is available to an
endpoint and is closed after the request. Closing a session is important
for releasing resources.

### 10.5 Schema initialization and the `barrier` column

The application calls `Base.metadata.create_all(bind=engine)` to create
missing tables. The project also has an `add_barrier_column()` helper
that inspects the existing SQLite `check_ins` table using
`PRAGMA table_info(check_ins)` and adds the `barrier` column if it is
absent.

This helper was used to evolve an existing local database without
discarding its check-in records. It is a small development migration
workaround, not a replacement for a migration system such as Alembic in
a production application.

## 11. Backend API Reference

Base URL: `http://127.0.0.1:8000`

The FastAPI documentation is available at `/docs` while the backend is
running.

### 11.1 `GET /`

**Purpose:** Basic API/root endpoint.

**Expected use:** Verify that the API process is reachable. Refer to the
actual response in `main.py` for its exact message.

### 11.2 `GET /goals`

**Purpose:** Return the saved habit goals.

**Request body:** None.

**Example response:**

``` json
[
  {
    "id": 1,
    "title": "Walk for 10 minutes",
    "category": "movement",
    "daily_target": 10
  }
]
```

### 11.3 `POST /goals`

**Purpose:** Create a habit goal.

**Example request:**

``` json
{
  "title": "Walk for 10 minutes",
  "category": "movement",
  "daily_target": 10
}
```

**Validation rules:** - `title`: minimum 3 characters, maximum 100
characters. - `category`: a string. - `daily_target`: integer greater
than 0 and no more than 1440.

**Success:** `201 Created`, with the saved goal, including its generated
ID.

**Common failure:** Invalid data produces a validation error. The exact
status and response body are determined by FastAPI/Pydantic and the
endpoint implementation.

### 11.4 `GET /check-ins`

**Purpose:** Return saved check-in records.

**Request body:** None.

**Example response:**

``` json
[
  {
    "id": 2,
    "goal_id": 1,
    "status": "missed",
    "note": "I did not have enough time today",
    "barrier": "not_enough_time"
  }
]
```

The current model does not include a check-in date or a joined goal
title. The frontend resolves the goal name by matching `goal_id` to its
loaded goals.

### 11.5 `POST /check-ins`

**Purpose:** Save a daily habit check-in.

**Example request:**

``` json
{
  "goal_id": 1,
  "status": "missed",
  "note": "I did not have enough time today",
  "barrier": "not_enough_time"
}
```

**Validation rules:** - `goal_id`: integer greater than zero. -
`status`: one of `completed`, `partially_completed`, `missed`. - `note`:
defaults to an empty string and has a maximum length of 300
characters. - `barrier`: optional; if present, one of `not_enough_time`,
`low_energy`, `forgot`, or `other`.

**Backend business rule:** the referenced goal must exist.

**Success:** `201 Created`, returning the saved check-in including its
generated ID.

### 11.6 `GET /check-ins/{check_in_id}/suggestion`

**Purpose:** Generate a personalized suggestion for a missed check-in.

**Example request:**

``` http
GET /check-ins/2/suggestion
```

**Example response:**

``` json
{
  "check_in_id": 2,
  "goal_id": 1,
  "suggestion": "Try splitting your walk into two shorter sessions..."
}
```

The exact suggestion is generated dynamically and will vary.

**Business rules and errors:** - `404 Not Found` if the check-in does
not exist. - `404 Not Found` if the associated goal cannot be found. -
`400 Bad Request` if the check-in status is not `missed`. -
`502 Bad Gateway` if the upstream AI request fails, according to the
current endpoint design.

### 11.7 API summary

  ---------------------------------------------------------------------------------------
  Method                  Endpoint                                Purpose
  ----------------------- --------------------------------------- -----------------------
  GET                     `/`                                     Check API availability

  GET                     `/goals`                                List goals

  POST                    `/goals`                                Create a goal

  GET                     `/check-ins`                            List check-ins

  POST                    `/check-ins`                            Create a check-in

  GET                     `/check-ins/{check_in_id}/suggestion`   Generate a suggestion
                                                                  for a missed check-in
  ---------------------------------------------------------------------------------------

## 12. AI Suggestion Integration

### 12.1 Provider flow

The backend AI service uses an OpenAI-compatible client configured to
communicate with OpenRouter. The provider endpoint and model are
configured through environment variables.

``` text
FastAPI suggestion endpoint
        |
        v
ai_service.py
        |
        | configured model + prompt/context
        v
OpenRouter API
        |
        v
Generated suggestion text
        |
        v
FastAPI JSON response
        |
        v
React suggestion card
```

### 12.2 Why call the model through the backend?

The browser should not receive the OpenRouter API key. Keeping the call
on the backend: - avoids exposing the secret in frontend code; - keeps
provider-specific logic out of the React component; - centralizes error
handling; - makes it easier to change the model/provider without
changing the UI.

The API key must remain in a local environment file or secret manager
and must never be committed to Git.

### 12.3 What context is relevant?

The app has information such as the habit title/category, check-in
status, optional note, and optional barrier. The AI service can use
appropriate habit/check-in context to generate a practical next step.
Confirm the exact prompt fields in `backend/ai_service.py` before
claiming that every field is included.

### 12.4 Example of expected behaviour

If the habit is a short walk and the user misses it because of time
constraints, a helpful suggestion might propose breaking the walk into
smaller sessions or attaching it to an existing routine. This is an
illustrative example, not a fixed response.

### 12.5 Failure handling

The check-in is saved first. Suggestion generation is a separate
request. If the AI provider is unavailable, the user should still retain
the check-in, while the UI displays a fallback message.

The prototype makes the suggestion request when the user records a
missed check-in. A later page refresh does not automatically regenerate
or reload the previous suggestion because suggestions are not currently
stored in a dedicated database table.

### 12.6 Model configuration

The development configuration has used environment variables similar to:

``` dotenv
LLM_MODEL=your-configured-model
LLM_ENDPOINT=https://openrouter.ai/api/v1
OPENROUTER_API_KEY=your_private_api_key
```

Use the actual model configured in your own `.env` file. Do not copy a
real key into this README, a screenshot, a frontend environment
variable, or a public GitHub commit.

## 13. Frontend Implementation

### 13.1 Main component

`frontend/src/App.jsx` contains the primary application interface and
its current interaction logic.

Important state values include:

  -----------------------------------------------------------------------
  State                               Purpose
  ----------------------------------- -----------------------------------
  `view`                              Current page: dashboard, habits, or
                                      history

  `modal`                             Which form is open

  `habits`                            Goal records returned by the API

  `checkIns`                          Check-in records returned by the
                                      API

  `loading`                           Controls initial loading UI

  `error`                             Error message for failed requests

  `message`                           Success or informational message

  `saving`                            Prevents duplicate form submission
                                      while saving

  `aiSuggestion`                      Loading text or generated
                                      suggestion shown on the dashboard

  `title`, `category`, `dailyTarget`  Add-habit form state

  `selectedHabit`, `status`, `note`,  Daily check-in form state
  `barrier`                           
  -----------------------------------------------------------------------

### 13.2 React concepts used

-   **Components:** `App` renders the app interface.
-   **State (`useState`):** stores data and UI state; a state update
    triggers a re-render.
-   **Effects (`useEffect`):** loads initial API data and manages the
    Escape-key listener while a modal is open.
-   **Event handlers:** process form submissions, navigation, and button
    clicks.
-   **Controlled forms:** input values are driven by React state.
-   **Conditional rendering:** shows different pages, modal forms,
    errors, loading states, and the AI suggestion card.
-   **List rendering:** `.map()` renders habits, check-ins, and
    navigation items; stable record IDs are used as keys.
-   **Async/await and `fetch`:** communicate with the FastAPI backend.
-   **`Promise.all`:** loads goals and check-ins concurrently.

### 13.3 Sidebar and modal design

The sidebar contains navigation and the two primary action buttons: -
**Add Habit** - **Daily Check-in**

The forms open in modal dialogs instead of occupying the main dashboard.
The forms use the application's shared visual theme and close through
the close button, backdrop interaction, or Escape key when a save is not
in progress.

### 13.4 AI suggestion state

After a missed check-in is saved, React sets `aiSuggestion` to a loading
message, requests the suggestion endpoint, and then updates the same
state with the returned text. The dashboard conditionally renders a
suggestion card whenever `aiSuggestion` is non-empty.

This is UI state, not persistent AI-result storage. Dismissing the card
clears that state.

### 13.5 API URL

The current frontend uses:

``` js
const API_URL = "http://127.0.0.1:8000";
```

This is suitable for local development. Before deployment, the API base
URL should be configurable for the target environment.

## 14. Validation and Error Handling

Validation happens at more than one layer.

### Frontend

-   Required form fields.
-   Minimum/maximum habit title length.
-   Daily target input bounds.
-   Note length limit.
-   Disabled submit buttons while saving.
-   Loading and error messages for failed API requests.

Frontend validation improves the user experience but is not a security
boundary. A caller can bypass the UI and send requests directly.

### Backend

Pydantic request models validate incoming JSON. The backend also checks
whether a goal exists before saving a check-in and whether a check-in is
missed before generating a suggestion.

### AI provider

The suggestion endpoint handles upstream failures and returns an error
response. The frontend catches suggestion-fetch errors separately from
the successful check-in save.

### Database

SQLAlchemy sessions are used to perform persistence operations. The
`get_db()` dependency closes each session in a `finally` block.

## 15. Setup and Installation

### Prerequisites

Install: - Python 3.11+ (or another version supported by the project's
installed dependencies). - Node.js and npm. - Git, if cloning from the
remote repository. - An OpenRouter account/API key if you want live AI
suggestions.

Check installed versions:

``` bash
python --version
node --version
npm --version
```

### 15.1 Get the code

If you have access to the public repository:

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd restart-health
```

Replace the placeholder with the actual repository URL. Do not invent or
commit a placeholder URL as if it were real.

### 15.2 Set up the backend

Open a terminal in the project root:

``` bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

``` powershell
.\.venv\Scripts\Activate.ps1
```

**Windows Command Prompt:**

``` bat
.venv\Scripts\activate.bat
```

Install the project's backend dependencies using the dependency file
present in the repository. For example, if it contains
`requirements.txt`:

``` bash
pip install -r requirements.txt
```

If the repository does not yet have a dependency file, create one
containing the project's actual required packages and versions before
relying on this command. The known backend dependencies include FastAPI,
Uvicorn, SQLAlchemy, Pydantic, the OpenAI-compatible client library, and
`python-dotenv`.

Create `backend/.env` with your own provider settings:

``` dotenv
LLM_MODEL=your-configured-model
LLM_ENDPOINT=https://openrouter.ai/api/v1
OPENROUTER_API_KEY=your_private_api_key
```

Use a real model ID supported by your OpenRouter account. Never paste
the key into source code or share it publicly.

### 15.3 Set up the frontend

Open a second terminal:

``` bash
cd frontend
npm install
```

The project uses Vite. The development script is normally:

``` bash
npm run dev
```

Check `frontend/package.json` if the scripts differ in your checkout.

## 16. Environment Variables and Secrets

  -----------------------------------------------------------------------
  Variable                            Purpose
  ----------------------------------- -----------------------------------
  `LLM_MODEL`                         Identifies the model requested
                                      through OpenRouter

  `LLM_ENDPOINT`                      OpenAI-compatible API base URL

  `OPENROUTER_API_KEY`                Secret used to authenticate the
                                      backend's provider request
  -----------------------------------------------------------------------

Important practices: - Keep `backend/.env` out of version control. - Add
`.env`, virtual environments, SQLite database files, and generated build
output to `.gitignore` where appropriate. - Provide a `.env.example`
with placeholder values, never a real API key. - If a key is
accidentally committed, revoke/rotate it. Deleting it in a later commit
does not erase it from Git history. - Do not use a `VITE_` environment
variable for a secret; Vite-exposed variables can be included in
client-side code.

## 17. Running the Application

Start the backend in one terminal:

``` bash
cd backend
```

Activate `.venv`, then run:

``` bash
uvicorn main:app --reload
```

The API should be available at `http://127.0.0.1:8000`.

Start the frontend in a separate terminal:

``` bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

To test the backend independently, open `http://127.0.0.1:8000/docs`.

The backend's CORS configuration currently permits the local frontend
origins `http://localhost:5173` and `http://127.0.0.1:5173`. If the
frontend uses a different port or origin, update the backend's allowed
origins accordingly.

## 18. Testing the API

FastAPI's interactive documentation is the easiest manual test tool for
this prototype.

### Suggested manual test sequence

1.  Call `GET /` to confirm that the API is reachable.
2.  Call `GET /goals` and inspect the current records.
3.  Use `POST /goals` to create a habit.
4.  Use the returned goal ID in `POST /check-ins`.
5.  Create a `completed` check-in and verify that it is saved.
6.  Create a `missed` check-in and verify that it is saved.
7.  Call the suggestion endpoint for the missed check-in.
8.  Call the suggestion endpoint for a completed check-in and confirm
    that the endpoint rejects it.
9.  Call `GET /check-ins` and verify the saved records.
10. Repeat the flow through the React UI and verify the dashboard
    updates.

### Example cURL requests

Create a goal:

``` bash
curl -X POST "http://127.0.0.1:8000/goals" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Walk for 10 minutes\",\"category\":\"movement\",\"daily_target\":10}"
```

Create a missed check-in (replace `1` with a real goal ID):

``` bash
curl -X POST "http://127.0.0.1:8000/check-ins" \
  -H "Content-Type: application/json" \
  -d "{\"goal_id\":1,\"status\":\"missed\",\"note\":\"Not enough time today\",\"barrier\":\"not_enough_time\"}"
```

Fetch goals:

``` bash
curl "http://127.0.0.1:8000/goals"
```

Fetch check-ins:

``` bash
curl "http://127.0.0.1:8000/check-ins"
```

Fetch a suggestion (replace `2` with the ID returned by the missed
check-in request):

``` bash
curl "http://127.0.0.1:8000/check-ins/2/suggestion"
```

The IDs above are examples. Always use IDs returned by your own running
database.

## 19. Example User Journey

1.  A user opens ReStart and sees the dashboard.
2.  They click **Add Habit** and create "Walk for 10 minutes" in the
    movement category.
3.  The backend validates and stores the habit in SQLite.
4.  The user clicks **Daily Check-in**, selects the habit, and records
    `completed`.
5.  The dashboard updates to include the new check-in.
6.  On another attempt, the user records `missed` and selects
    `not_enough_time`.
7.  The backend saves that check-in.
8.  The frontend requests a suggestion for that check-in.
9.  The AI service generates a gentle, practical suggestion.
10. The dashboard displays the suggestion card so the user can consider
    a smaller or more realistic next step.

This flow demonstrates the central product idea: record the behaviour
first, then use the missed attempt as context for supportive guidance.

## 20. Current Limitations

It is important to be transparent about these limitations in a demo or
interview.

1.  **Single-user prototype:** no authentication or user ownership
    exists, so it is not ready for public multi-user deployment.
2.  **No check-in date:** history is based on saved records, not a true
    calendar. Daily streaks and weekly trends cannot yet be calculated
    reliably.
3.  **Daily target unit:** the current field is named `daily_target` but
    the interface labels it as minutes. That does not fit every category
    (for example, hydration). A future version should support
    category-specific units.
4.  **Suggestions are not persisted:** a generated suggestion is kept in
    frontend state and is not saved in its own table. It may disappear
    after a refresh.
5.  **AI dependency:** live suggestion generation requires valid
    provider configuration and network access, and may fail due to rate
    limits or provider errors.
6.  **No background job:** suggestion generation happens in the request
    flow and may add waiting time.
7.  **Basic database migration:** the manual `barrier` column helper is
    suitable for the prototype but not a full migration strategy.
8.  **Limited automated tests:** manual testing is useful but does not
    replace unit, integration, and end-to-end tests.
9.  **No deployment pipeline:** the documented URLs and settings are for
    local development.
10. **Basic analytics:** the displayed completion percentage is based on
    all records, not a time period or a per-habit target.

## 21. Future Improvements

### Product

-   Add check-in timestamps and date-aware history.
-   Add weekly/monthly summaries and streaks that are based on real
    dates.
-   Let users edit or archive habits.
-   Allow users to accept, edit, save, or dismiss AI suggestions.
-   Add category-specific target units (minutes, glasses, sessions,
    etc.).
-   Make the dashboard accessible and polished across mobile and desktop
    sizes.

### Backend and data

-   Add user accounts and ownership checks before allowing multi-user
    access.
-   Add pagination and filtering to list endpoints.
-   Use PostgreSQL for a deployed multi-user version.
-   Use Alembic or another migration approach to manage schema changes.
-   Add structured logging and consistent API error responses.
-   Add automated tests for valid inputs, invalid inputs, missing
    records, and provider failures.

### AI

-   Store generated suggestions with their check-in ID and timestamp.
-   Use a timeout and controlled retry policy for provider requests.
-   Define a concise prompt and constrain output to practical,
    non-medical suggestions.
-   Add a safe fallback if the model is unavailable.
-   Evaluate suggestions for relevance, tone, and unsafe or
    overconfident health claims.
-   Consider caching or asynchronous processing if traffic grows.

### Deployment and operations

-   Configure frontend and backend URLs per environment.
-   Store secrets in a deployment secret manager.
-   Restrict CORS to approved production origins.
-   Add CI checks and a deployment workflow.
-   Add monitoring for latency, errors, and provider failures.

## 22. Security, Privacy, and Responsible AI

ReStart is a habit-support prototype, not a medical application.

-   Do not present generated suggestions as medical diagnosis,
    treatment, or guaranteed outcomes.
-   Avoid sending unnecessary personal information to an AI provider.
-   Keep provider credentials on the backend.
-   Validate all input on the server, even when the frontend validates
    it too.
-   Add authentication and authorization before allowing multiple users
    to use a shared deployment.
-   Restrict production CORS origins.
-   Set request timeouts and handle provider errors without exposing
    secrets or internal stack traces.
-   Make it clear to users that AI-generated guidance can be imperfect.

The current local prototype does not implement production-grade
authentication, data isolation, retention controls, or a comprehensive
privacy workflow. Those should be addressed before collecting real
users' sensitive information.

## 23. Troubleshooting

### Frontend says it cannot load data

-   Confirm the backend is running at `http://127.0.0.1:8000`.
-   Open `http://127.0.0.1:8000/docs`.
-   Check the browser's Developer Tools → Network and Console tabs.
-   Confirm the frontend's `API_URL` matches the backend URL.
-   Check CORS origins if the frontend runs on a different host or port.

### AI suggestion does not appear

-   Confirm the check-in was saved with status `missed`.
-   Inspect the response from `POST /check-ins`; use its returned `id`.
-   Open `GET /check-ins/{id}/suggestion` in `/docs`.
-   Check that the backend `.env` contains a valid model, endpoint, and
    API key.
-   Restart the backend after changing environment variables.
-   Inspect the backend terminal for provider errors.
-   Check the browser's Network tab for the suggestion request and
    response.
-   Remember: the suggestion card is frontend state, so a refresh will
    not restore an earlier suggestion in the current implementation.

### API returns a validation error

Check: - title length is at least 3 characters and at most 100; -
`daily_target` is an integer from 1 to 1440; - status uses the exact
allowed string values; - note length is no more than 300 characters; -
barrier uses an allowed value or `null`; - `goal_id` refers to an
existing goal.

### Database schema errors

The project uses a local SQLite file. If the database was created by an
older version, confirm that the schema initialization code has run. Do
not delete the database as a first troubleshooting step if you need to
preserve existing records. The current helper specifically handles
adding the `barrier` column; more complex schema changes require an
explicit migration.

### Port already in use

Stop the other development server or start the process on a different
port, then update the frontend API URL and backend CORS configuration to
match.

## 24. Interview Preparation Guide

This section is designed to be studied independently of the source code.

### 24.1 A 30-second project explanation

"ReStart is a full-stack healthy-habits companion I built as a prototype
using React, FastAPI, and SQLite. Users can create habits, record
completed, partially completed, or missed check-ins, and review their
progress on a dashboard. When a user misses a habit, the frontend
requests a suggestion endpoint, and the backend uses an
OpenRouter-connected language model to generate a supportive next step.
I separated the UI, API, database models, and AI integration so each
part has a clear responsibility. The current version is a single-user
prototype, and I would add authentication, date-aware analytics,
automated tests, and production deployment before scaling it."

Adapt "I built" to accurately reflect your contribution. Do not claim
features that are not implemented.

### 24.2 A two-minute walkthrough

**Problem:** Habit tracking can become discouraging when a user misses a
goal. A simple completed/not-completed list does not help the user
restart.

**Solution:** ReStart stores habit goals and daily check-ins, tracks
simple progress totals, and asks an AI model for a practical suggestion
after a missed check-in.

**Frontend:** React manages form values, fetched data, the active view,
modal visibility, loading/errors, and the AI suggestion. It calls the
backend with `fetch`.

**Backend:** FastAPI exposes REST endpoints. Pydantic validates request
bodies. SQLAlchemy models and sessions persist the data in SQLite. The
backend verifies that a goal exists and that a check-in is missed before
generating a suggestion.

**AI:** The AI integration is kept on the backend, so the API key is not
shipped to the browser. The frontend first saves the check-in, then
calls the suggestion endpoint. If AI fails, the check-in remains saved
and the UI can show a fallback message.

**Next steps:** Add timestamps, user ownership/authentication, automated
tests, a proper migration system, and production deployment.

### 24.3 Architecture questions

**Q: Why did you separate frontend and backend?**\
A: The frontend is responsible for user interaction and presentation.
The backend validates input, applies business rules, persists data, and
integrates with the AI provider. This separation makes the API
independently testable and allows either layer to evolve without
rewriting the other, provided the API contract remains stable.

**Q: Why FastAPI?**\
A: FastAPI makes it straightforward to define HTTP endpoints, validate
request data using Pydantic, and expose interactive OpenAPI
documentation. It is a good fit for a small Python backend and an AI
integration.

**Q: Why SQLite?**\
A: SQLite is simple to set up and stores the prototype's data in a local
file without a separate database server. For a concurrent, deployed,
multi-user application, I would evaluate PostgreSQL and a managed
database.

**Q: Why SQLAlchemy?**\
A: SQLAlchemy maps Python model classes to relational tables and
provides database sessions for queries and writes. It keeps persistence
code more structured than scattering raw SQL across endpoint handlers.

**Q: Why REST instead of calling the database directly from React?**\
A: The browser should not connect directly to the database. The API
provides a controlled boundary for validation, business rules,
persistence, and AI calls. It also enables the backend to be tested
independently.

### 24.4 React questions

**Q: What is `useState` used for here?**\
A: It stores values that affect the UI, such as goals, check-ins, the
selected page, modal state, form inputs, loading/errors, and the AI
suggestion. Updating state causes React to re-render the relevant UI.

**Q: Why use `useEffect`?**\
A: One effect loads goals and check-ins when the component mounts.
Another attaches an Escape-key listener while the modal is open and
removes the listener during cleanup.

**Q: What is a controlled input?**\
A: An input whose displayed value is driven by React state. For example,
the habit title input uses `value={title}` and updates that state
through `onChange`. This keeps the form value available to the submit
handler.

**Q: Why use `.map()` and `key`?**\
A: `.map()` renders repeated UI elements from arrays, such as habits and
check-ins. A stable key, usually the record ID, helps React track which
list item corresponds to which data record.

**Q: What does conditional rendering do?**\
A: It displays UI only when a condition is true. ReStart uses it for
loading states, errors, the selected page, modal forms, the missed-habit
barrier field, and the AI suggestion card.

**Q: Why use `async/await` with `fetch`?**\
A: Network requests take time. `await` lets the handler wait for the
response before processing its JSON, while `try/catch/finally` can
handle errors and reset loading state.

**Q: Why use `Promise.all()` during initial loading?**\
A: Goals and check-ins can be fetched independently. `Promise.all()`
starts both requests without waiting for the first to finish before
starting the second, and waits until both settle successfully or one
rejects.

**Q: Is React state persistent?**\
A: No. React component state is in memory. The goals and check-ins
persist because the backend stores them in SQLite. The AI suggestion
currently exists only in frontend state, so it is lost on refresh.

### 24.5 Backend and API questions

**Q: What is Pydantic doing?**\
A: It validates and parses request bodies against defined schemas. For
example, the check-in status must be one of the allowed literal values,
and the note has a maximum length. This prevents invalid request data
from silently entering endpoint logic.

**Q: What is the difference between validation and business-rule
checking?**\
A: Validation checks whether the request has the right shape and
permitted field values. A business rule checks whether the operation
makes sense in the application's context. For example, `goal_id` being a
positive integer is validation; confirming that the goal actually exists
is a business/data check.

**Q: Why return `201 Created` when creating a record?**\
A: It communicates that the request successfully created a resource. The
response includes the saved record and its generated ID so the frontend
can refer to it.

**Q: Why does the suggestion endpoint return `400` for a completed
check-in?**\
A: The endpoint is intended only for missed check-ins. A completed
check-in exists, but it does not meet the endpoint's business condition,
so the request is rejected.

**Q: Why might the suggestion endpoint return `502`?**\
A: The backend depends on an upstream AI service. If that upstream
request fails, `502 Bad Gateway` communicates that the backend could not
obtain the expected result from the provider.

**Q: What is CORS?**\
A: Cross-Origin Resource Sharing is a browser security mechanism that
controls which origins may make browser-based requests to an API. The
backend allows the local Vite frontend origins. CORS is not
authentication and does not secure the API against non-browser clients.

### 24.6 Database questions

**Q: Why have separate `goals` and `check_ins` tables?**\
A: A habit can have many check-ins over time. Keeping goals and
check-ins separate avoids duplicating the habit's title and category in
every check-in and models the one-to-many relationship using `goal_id`.

**Q: What is a foreign key?**\
A: A foreign key identifies a relationship to another table's key. Here,
`check_ins.goal_id` references `goals.id`, expressing that a check-in
belongs to an existing goal.

**Q: What is a database session?**\
A: A session is SQLAlchemy's unit of work for interacting with the
database. It is used to query records, add new objects, and commit
changes. The request dependency closes the session after the endpoint
finishes.

**Q: What does `create_all()` do?**\
A: It creates tables that are missing based on the declared SQLAlchemy
models. It does not provide a complete versioned migration system for
changing existing schemas.

**Q: Why is the `barrier` migration helper limited?**\
A: It handles one specific schema change by checking whether a column
exists and adding it if necessary. For multiple schema changes across
environments, a migration tool such as Alembic provides versioned,
reviewable migrations.

### 24.7 AI integration questions

**Q: Why use an AI model for suggestions?**\
A: The goal is to generate a contextual, encouraging next step instead
of showing the same fixed message every time. The model can turn habit
context and a barrier into a practical suggestion. Its output still
needs safety boundaries and evaluation.

**Q: Why call OpenRouter from the backend?**\
A: It keeps the API key private and isolates provider-specific
configuration from the UI. The frontend calls our own endpoint rather
than a model provider directly.

**Q: What happens if AI generation fails?**\
A: The check-in has already been saved before the suggestion request
starts. The frontend handles suggestion failure separately and shows a
fallback message. That prevents an AI outage from undoing the user's
check-in.

**Q: Are AI suggestions saved?**\
A: Not in the current implementation. The suggestion is held in React
state and is not persisted in a dedicated table. A future version could
store the suggestion, associated check-in ID, creation time, and user
feedback.

**Q: How would you make the AI feature more reliable?**\
A: Add request timeouts, bounded retries where appropriate, consistent
provider-error handling, a fallback suggestion, logging without secrets,
prompt constraints, and tests for provider failures. I would also
evaluate suggestions for relevance and for avoiding medical claims.

**Q: How would you reduce AI costs and latency?**\
A: Keep prompts concise, avoid unnecessary repeated calls, set timeouts,
cache or persist results when appropriate, and consider asynchronous
processing if the feature grows. Any retry policy should be bounded to
avoid multiplying costs.

### 24.8 Testing questions

**Q: How would you test the create-goal endpoint?**\
A: Test a valid request, a title that is too short, a title that exceeds
the limit, a missing field, a non-integer or out-of-range target, and
verify that valid data is actually persisted and returned.

**Q: How would you test check-ins?**\
A: Test every allowed status, invalid status, nonexistent goal ID,
optional note and barrier values, note length validation, and retrieval
after creation.

**Q: How would you test the suggestion endpoint?**\
A: Test a missed check-in with a successful mocked AI response, a
completed check-in, a nonexistent check-in, a missing goal, and an
upstream provider failure. Verify both the status code and response
body.

**Q: What is the difference between unit and integration testing
here?**\
A: Unit tests isolate a small unit, such as a function that calculates
completion percentage. Integration tests exercise interactions between
components, such as a FastAPI endpoint and a test database or the
suggestion endpoint and a mocked AI client.

### 24.9 Design and improvement questions

**Q: What would you improve first?**\
A: I would add a check-in timestamp and tests first, because timestamps
make the history and analytics meaningful and tests protect the existing
behaviour. Before a public deployment, I would also add authentication,
user-level data ownership, secret management, and deployment
configuration.

**Q: How would you support multiple users?**\
A: Add a user model and authentication, associate each goal with an
owner, and enforce ownership checks on every goal and check-in
operation. I would not rely on hiding IDs in the UI as a security
measure.

**Q: How would you add a streak feature?**\
A: Store a timestamp or date for each check-in, define how multiple
check-ins on one day are handled, and calculate consecutive qualifying
dates per habit. I would clarify the product rules before implementing
the calculation.

**Q: What is one limitation you would openly acknowledge?**\
A: The current completion percentage is calculated across all saved
check-ins, not over a date range. Because check-ins do not currently
store dates, it is not a reliable weekly adherence metric yet.

### 24.10 Be ready to explain these code paths

Before an interview or demo, be able to explain these in your own words:

1.  `loadData()` --- how the frontend loads goals and check-ins.
2.  `handleCreateHabit()` --- how a form becomes a database record.
3.  `handleCheckIn()` --- how a check-in is saved and how the suggestion
    request follows it.
4.  `HabitGoalCreate` --- how the backend validates goal input.
5.  `HabitCheckInCreate` --- how check-in status, note, and barrier are
    constrained.
6.  `get_db()` --- how database sessions are provided and closed.
7.  The `Goal` and `CheckIn` models --- how the one-to-many relationship
    works.
8.  `GET /check-ins/{check_in_id}/suggestion` --- why it checks the
    record and status before calling AI.
9.  `ai_service.py` --- how provider configuration and model responses
    are handled.
10. The `aiSuggestion` React state --- why the card appears and why it
    does not persist across refreshes.

Do not memorize a claim you cannot demonstrate. If asked about a feature
that is planned but not implemented, say so clearly and explain how you
would approach it.

## 25. Quick Revision Sheet

### One-line summary

**ReStart is a React + FastAPI + SQLite habit tracker that uses an
OpenRouter-connected language model to suggest a practical next step
after a missed habit.**

### Core stack

-   React: UI and state.
-   Vite: frontend development/build tooling.
-   FastAPI: REST API.
-   Pydantic: request validation.
-   SQLAlchemy: ORM and database sessions.
-   SQLite: local persistence.
-   OpenRouter: model access.
-   `fetch` + JSON: frontend/backend communication.

### Core tables

-   `goals`: `id`, `title`, `category`, `daily_target`.
-   `check_ins`: `id`, `goal_id`, `status`, `note`, `barrier`.

### Core endpoints

-   `GET /goals`
-   `POST /goals`
-   `GET /check-ins`
-   `POST /check-ins`
-   `GET /check-ins/{check_in_id}/suggestion`

### Most important workflow

`Create goal → save check-in → if missed, request suggestion → show suggestion card`

### Five limitations to remember

1.  No authentication or multi-user separation.
2.  No check-in timestamp/date.
3.  AI suggestions are not persisted.
4.  Completion percentage is over all recorded check-ins, not a time
    window.
5.  Local prototype setup is not production deployment.

### Interview honesty rule

Explain what is implemented, what you personally contributed, what you
understand, and what you would improve. A clear explanation of a small
working system is stronger than claiming production readiness or
features that are not present.

------------------------------------------------------------------------

## License

Choose and add a license before distributing the project publicly. Do
not claim an open-source license until one has actually been selected
and included in the repository.
