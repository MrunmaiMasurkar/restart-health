# Testing, Verification and Known Limitations

## 1. Manual smoke-test checklist

Use this checklist when verifying a local build.

| Test | Expected result |
|---|---|
| Start backend | FastAPI starts and serves the local API |
| Open `/docs` | Interactive API documentation loads |
| Start frontend | Vite starts and prints a local URL |
| Create a habit | Goal is saved and appears in the UI |
| Save completed check-in | Check-in is accepted and saved |
| Save partially completed check-in | Check-in is accepted and saved |
| Save missed check-in | Check-in is accepted and saved |
| Request missed-check-in suggestion | Backend requests an AI suggestion |
| AI provider available | Suggestion is returned and displayed |
| Refresh browser | Goals and check-ins remain available |
| Refresh browser | Previously displayed AI suggestion is not expected to persist |

## 2. AI integration test

`backend/test_ai.py` exercises the AI service directly. It requires:
- An active backend virtual environment.
- Installed dependencies.
- A valid `backend/.env`.
- A working OpenRouter API key.
- A currently available model and sufficient provider quota.

Run from `backend`:

```cmd
python test_ai.py
```

This test calls an external provider and may be affected by network availability, model availability, account limits or provider changes.

## 3. API error interpretation

The missed-check-in flow saves the check-in before requesting the AI suggestion. Therefore, an AI request failure does not necessarily mean that the check-in failed to save.

Potential external AI failure causes include invalid credentials, unavailable model, provider rate limits, network errors or provider-side failures. Check backend logs for the actual cause rather than assuming one.

## 4. Known limitations

- No automated end-to-end test suite is documented.
- AI suggestions are not persisted.
- Check-ins have no date/time field.
- No calendar, daily streak or date-aware analytics.
- No authentication, authorization or multi-user isolation.
- SQLite is used for local prototype storage.
- The database startup helper is a lightweight column addition, not a migration framework.
- No formal performance/load test is claimed.
- No clinical validation or user-outcome study is claimed.
- No public deployment is currently implemented.

## 5. Verification record

Before submitting, record only tests actually performed:

- Date tested:
- Python version:
- Node.js version:
- Browser:
- Backend startup:
- Frontend startup:
- Goal creation:
- Check-in statuses:
- AI suggestion:
- Persistence after refresh:
- Issues observed:

Do not mark a test as passed unless it was actually performed on the submitted version.
