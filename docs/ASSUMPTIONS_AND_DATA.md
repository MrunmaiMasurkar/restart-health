# Data, Dataset Assumptions and Scope

## 1. External dataset

The current ReStart prototype does **not** use an external clinical, hospital, wearable, genomic or population-health dataset.

It does not train or fine-tune a machine-learning model.

## 2. Data entered by a user

The prototype collects user-entered habit information:
- Habit title.
- Habit category.
- Daily target.
- Check-in status.
- Optional short note.
- Optional barrier category.

The current barrier categories are:
- Not enough time.
- Low energy.
- Forgot.
- Other.

The application stores goals and check-ins in a local SQLite database.

## 3. AI input and output

When a user records a missed check-in, the backend can request a generated suggestion from the configured external AI provider.

The suggestion is generated at request time. It is returned to the frontend and held in frontend state; the current implementation does not persist it in SQLite.

The application should send only the context needed to generate a general habit-support suggestion. Users should be advised not to enter sensitive medical or identifying details in notes.

## 4. Assumptions

1. Users choose their own habits and targets.
2. A user's self-reported check-in is accepted as the record of their progress; it is not independently verified.
3. A missed check-in may have a practical barrier, but the selected barrier is self-reported and may not explain every reason.
4. A generated suggestion is general motivational guidance, not a clinically validated intervention.
5. The application does not infer a diagnosis, disease risk, mental-health condition or treatment need.
6. No clinical outcome or behavior-change effectiveness is claimed.

## 5. Data quality and limitations

- User-entered data may be incomplete, inaccurate or inconsistent.
- The prototype does not currently attach a date/time to each check-in.
- Date-based trends, streaks and adherence analytics are therefore not available.
- The prototype has no user account system or multi-user separation.
- The current database is intended for local prototype use, not sensitive health-data storage.

## 6. Evaluation plan for future work

Before making claims about effectiveness, future work should include:
- User research to understand habit barriers and preferred support.
- Usability testing with informed participants.
- A documented evaluation protocol and consent process.
- Measures such as task completion, perceived usefulness, suggestion relevance and user trust.
- Review for accessibility, bias, privacy and unintended effects.
- Appropriate clinical or behavioral-science expertise if the product scope moves toward health interventions.

No user study, clinical validation or measured health outcome is claimed in this submission unless separately conducted and documented.
