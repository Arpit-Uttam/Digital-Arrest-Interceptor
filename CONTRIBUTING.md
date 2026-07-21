# Contributing to Digital Arrest Interceptor

Welcome to the team! This repository is built and maintained by a collaborative team of three developers. To ensure consistency, code quality, and smooth deployment, please follow the guidelines below.

---

## 👥 Our Team & Roles

1. **Avani Katiyar (Backend & Database Engineer)**
   - Responsible for api route organization, database connection pooling, SQLite transactions, schemas, and security.
   - Core files: `/backend/app/api/`, `/backend/app/db/`, `/backend/main.py`.

2. **Arpit Uttam (Machine Learning & Testing Infrastructure)**
   - Responsible for speech recognition, deepfake classifiers, rule & semantic analysis fusion models, and testing suites.
   - Core files: `/backend/app/services/`, `/backend/tests/`.

3. **Gagan gupta (Frontend & UI/UX Engineer)**
   - Responsible for the React UI, dashboard modules, custom React hooks, WebSockets client, and animations.
   - Core files: `/frontend/src/`.

---

## ⚙️ Coding Standards

### Python (Backend)
- **Formatter & Linter:** We use **Ruff** for linting and formatting.
- **Typing:** Provide descriptive type hints (`typing` module) for all function arguments and return signatures.
- **Dependencies:** Add new python dependencies to `requirements.txt` and run `pip install -r requirements.txt`.

### JavaScript (Frontend)
- **Formatter:** **Prettier** is configured to enforce standard formatting.
- **Linter:** **ESLint** checks react best practices and rules of hooks.
- **Hooks:** Keep component logic clean by delegating async side-effects and websockets to custom hooks.

---

## 🌿 Git Workflow & Branching Strategy

We use feature branching. No developer pushes directly to `main`.
1. **Branch Naming Conventions:**
   - `feature/avani/add-database-pooling`
   - `feature/arpit/integrate-whisper-v3`
   - `feature/gagan/enhance-risk-gauge`
   - `bugfix/issue-description`
2. **Conventional Commits:** Follow the conventional commits pattern:
   - `feat: add real-time deepfake classification`
   - `fix: correct sqlite session memory leaks`
   - `test: add mocks for openai api calls`
   - `docs: update setup manual`

---

## 🧪 Testing Guidelines
- Run the full suite with `pytest backend/tests/` before committing.
- Mock all network-bound API calls (e.g. OpenAI Whisper, Anthropic Claude) in tests using pytest-mock or custom wrappers.
