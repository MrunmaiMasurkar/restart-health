# Responsible AI, Privacy and Clinical Boundaries

## 1. Intended use

ReStart is a general wellness and healthy-habit support prototype. It is intended to help a user reflect on a missed habit check-in and consider a small, practical next step.

It is not intended for diagnosis, treatment, prevention, clinical triage, emergency response or clinical decision-making.

## 2. Clinical boundaries

- ReStart does not diagnose or assess medical conditions.
- ReStart does not provide treatment plans or medication advice.
- AI-generated suggestions are general motivational guidance.
- Suggestions are not a substitute for a qualified healthcare professional.
- The prototype has not undergone clinical validation or regulatory assessment.
- The product should not be marketed as a medical device or clinically proven intervention.

If a user has a health concern, persistent symptoms or an urgent need, they should seek appropriate professional care rather than rely on ReStart.

## 3. AI behavior and limitations

The AI service uses an external model through OpenRouter. Model output can be inaccurate, generic, unsuitable or unavailable. Provider/model availability and rate limits can change.

The prototype should:
- Use supportive, non-judgmental language.
- Avoid shame, blame, coercion or unrealistic demands.
- Avoid diagnosis, treatment recommendations and claims of guaranteed outcomes.
- Encourage manageable, user-controlled steps.
- Clearly communicate when a suggestion could not be generated.

The current application does not include a formal AI safety evaluation, human review workflow, model monitoring system or systematic bias assessment.

## 4. Privacy and data handling

Current implementation facts:
- There is no login or authentication.
- There is no multi-user data isolation.
- Goals and check-ins are stored in a local SQLite database.
- AI suggestions are not persisted in the database.
- Relevant check-in context is sent to the configured external AI provider when a suggestion is requested.
- The OpenRouter API key is configured on the backend using `.env`.

Users should not enter names, contact details, medical records, diagnoses or other sensitive personal information into the prototype.

## 5. Security limitations

The current prototype is not production-hardened. It does not yet provide:
- User authentication and authorization.
- Per-user access controls.
- Encryption and managed secrets for a deployed environment.
- A documented retention/deletion workflow.
- Rate limiting or abuse protection.
- A formal security assessment.

The local `.env` file must not be committed. Keep the API key out of frontend code, source control, screenshots and demo recordings. If a key is exposed, revoke it with the provider and create a replacement.

## 6. Future safeguards before real-world deployment

Before use with real users or sensitive data:
1. Define a privacy notice, lawful basis/consent model and data-retention policy.
2. Implement authentication, authorization and strict user-level data isolation.
3. Review data minimization and external AI-provider data handling.
4. Use secure secret management and HTTPS.
5. Add rate limits, logging controls and incident handling.
6. Conduct security, accessibility and responsible-AI reviews.
7. Test output safety and quality with a documented evaluation set.
8. Obtain relevant clinical, legal and regulatory guidance if the intended use expands.

## 7. Transparency statement

ReStart is an early-stage wellness prototype. It demonstrates a technical workflow for habit tracking and contextual AI-generated encouragement. It does not establish clinical effectiveness, medical safety, or improved health outcomes.
