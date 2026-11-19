# ReStart — Solution Deck Outline

This is an outline for a concise presentation deck. Replace placeholders with verified screenshots and test results. Do not present proposed features as implemented.

## Slide 1 — ReStart
**An adaptive healthy-habits companion**

A wellness prototype that helps users take a practical next step after a missed habit check-in.

Include: project name, challenge statement (`Wellbeing — Sustaining Healthy Behaviors`), submitter/team details.

## Slide 2 — The problem
Healthy routines can be disrupted by everyday barriers such as low energy, lack of time or forgetting. A tracker can record a missed day, but recording alone may not help a person restart.

Keep the problem statement focused. Avoid unsupported prevalence or clinical statistics.

## Slide 3 — The solution
ReStart lets users:
- Create personal habit goals.
- Record completed, partially completed or missed check-ins.
- Note barriers.
- Receive a contextual, supportive AI-generated next step after a missed check-in.

## Slide 4 — User journey / prototype
Use actual screenshots or a short sequence:
1. Create a habit.
2. Record a check-in.
3. Select a barrier for a missed check-in.
4. Display the generated suggestion.
5. Show saved goals/check-in history.

## Slide 5 — Technical architecture
React + Vite → FastAPI → SQLAlchemy / SQLite.  
For missed check-ins, FastAPI calls the AI service module, which connects to OpenRouter using backend-only configuration.

## Slide 6 — Data, safety and limitations
- No external clinical dataset or model training.
- User-entered habit and check-in data.
- General wellness support only; not diagnosis or treatment.
- No authentication or multi-user separation in this prototype.
- Suggestions are not persisted; check-ins are not date-aware.
- External AI provider availability affects suggestion generation.

## Slide 7 — Evaluation and next steps
Include only tests actually performed. Potential next steps:
- Date-aware tracking and persisted suggestions.
- Authentication and user-specific data separation.
- User testing and evaluation of usefulness and trust.
- Privacy/security review.
- Deployment readiness assessment, including possible Azure hosting.

## Pitch guidance

Explain:
- Who experiences the problem.
- What ReStart does differently from a basic habit log.
- What is working today.
- What evidence you have from actual testing.
- What remains unbuilt and how you would validate it.

Do not claim clinical effectiveness, production readiness, multi-agent orchestration, Azure deployment or measured impact unless those have actually been implemented and verified.
