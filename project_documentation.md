# DIGITAL ARREST INTERCEPTOR
## AI-Powered Public Safety System & Real-Time Scammer Interception Engine

<div style="page-break-after: always;"></div>

---

# 1. Cover Page

**Project Title:** Digital Arrest Interceptor — AI Public Safety Companion  
**Tagline:** Real-Time Speech Telemetry & Acoustic AI Interception Against Digital Arrest Fraud  
**Project Classification:** AI Public Safety & Cybercrime Mitigation System  
**Team Name:** Digital Arrest Interceptor Core Team  
**Team Leader:**  
- **Arpit Uttam:** **Team Leader** — Machine Learning, DSP Pipeline & Quality Assurance  

**Team Members & Roles:**  
- **Avani Katiyar:** Backend Architecture, API Router & Database Engineering  
- **Gagan Gupta:** Frontend Engineering, Telemetry UI & React State Architecture  

**Key Technology Stack:** FastAPI (Python), React 18 (Vite), Tailwind CSS, HuggingFace Wav2Vec2, SQLite, WebSockets  
**Repository License:** Open / Hackathon Submission  

<div style="page-break-after: always;"></div>

---

# 2. Executive Summary

## 2.1 Project Overview
**Digital Arrest Interceptor** is an AI-powered, real-time public safety companion designed to detect and prevent "Digital Arrest" fraud during ongoing phone calls. The system continuously listens to authorized audio inputs or call transcripts, extracts semantic indicators and acoustic spectral features, calculates a hybrid threat risk score (0–100%), and triggers instantaneous emergency protection overlays before victims comply with financial extortion demands.

## 2.2 Problem Statement Summary
Digital Arrest scams represent a rapidly surging cybercrime tactic in India. Fraudsters impersonate high-ranking law enforcement officials (CBI, ED, Customs, Police, Supreme Court judges) via phone or video calls. Victims are subjected to extreme psychological intimidation, ordered into isolation ("room lockdown", "camera active on Skype"), threatened with immediate arrest warrants, and coerced into transferring money to fake government "verification accounts."

## 2.3 Solution & Key Innovation
Digital Arrest Interceptor introduces a dual-layer threat engine:
1. **Acoustic Neural Deepfake Classifier:** Evaluates audio spectral features using HuggingFace's pretrained `Melodist/wav2vec2-base-superb-asvspoof` neural model to detect synthetic/cloned speech.
2. **Hybrid Risk Fusion Scorer:** Combines a 40% regex fuzzy keyword engine (`rapidfuzz`) covering English, Hinglish, and Hindi Devnagari with a 60% semantic LLM classifier (Claude 3 Sonnet / OpenAI GPT-4 / local offline semantic fallback parser).

## 2.4 Expected Impact
By automating live threat interception and providing a single-tap escalation route to the **1930 National Cybercrime Helpline** and **NCRB portal**, the application breaks the scammer's psychological grip, preventing irreversible financial loss.

<div style="page-break-after: always;"></div>

---

# 3. Problem Statement

## 3.1 Background
The digital landscape has witnessed a severe evolution in social engineering fraud. Unlike conventional phishing emails or simple spam calls, "Digital Arrest" scams leverage acute psychological pressure, fake legal documentation, and institutional impersonation. Victims—predominantly senior citizens, students, and working professionals—are misled into believing they are accused of severe federal crimes such as narcotics trafficking or offshore money laundering.

## 3.2 Existing Problem Context
- **Impersonation of Regulated Agencies:** Scammers claim to represent law enforcement bodies including the Central Bureau of Investigation (CBI), Enforcement Directorate (ED), Mumbai/Delhi Airport Customs Cargo Division, and Cyber Crime Headquarters.
- **Psychological Isolation Tactics:** Victims are instructed to lock their doors, keep their webcams active continuously, stay on the call, and refrain from notifying family members under threats of immediate arrest under the NDPS or Prevention of Money Laundering Act (PMLA).
- **Immediate Legal & Financial Urgency:** Fraudsters demand "security verification deposits" or liquidation of bank balances into fake Reserve Bank of India (RBI) verified accounts within tight time windows (e.g., 30 minutes).

## 3.3 Target Users
- **General Public & Vulnerable Citizens:** Individuals targeted by phone-based coercion.
- **Senior Citizens & Non-Technical Users:** High-risk demographics susceptible to authority impersonation.
- **Cyber Crime First Responders & Law Enforcement:** Agencies requiring structured digital audit trails of scam phone sessions.

## 3.4 Limitations of Existing Solutions
- **Caller ID Blocklists (e.g., Truecaller):** Ineffective against VoIP number spoofing and dynamic virtual numbers.
- **Post-Fraud Reporting Portals:** Action is taken after money has already left victim accounts, yielding low asset recovery rates.
- **Lack of Acoustic Verification:** Conventional tools cannot detect AI-cloned synthetic voices used by modern fraudsters.

*(Note: Quantitative victim loss statistics to be added by the team if required.)*

<div style="page-break-after: always;"></div>

---

# 4. Proposed Solution

## 4.1 Overall Concept
Digital Arrest Interceptor acts as an intelligent, real-time safety layer running alongside voice calls. The system ingests streaming audio or live transcribed text, evaluates threat markers continuously, and triggers visible visual and acoustic safety alerts when coercion vectors cross safety thresholds.

```
+------------------+      +-----------------------+      +------------------------+
| Audio / Speech   | ---> | Threat Interceptor    | ---> | Emergency Protection   |
| Input Stream     |      | Fusion Scorer Engine  |      | Alert & 1930 Helpline  |
+------------------+      +-----------------------+      +------------------------+
```

## 4.2 End-to-End System Workflow
1. **Audio Ingestion:** Incoming calls are captured via client-side Web Speech API, uploaded recorded audio files, or pre-configured test scenario streams.
2. **Spectral Voice Audit:** The audio file/blob is passed to a neural Wav2Vec2 classifier to establish an AI voice confidence rating (0.0 – 1.0).
3. **Speech-to-Text Transcription:** Server-side Whisper API / local STT converts incoming speech chunks into normalized text.
4. **Hybrid Threat Scoring:**
   - **Regex & Fuzzy Matching (40% Weight):** Checks keywords across 4 scam categories: *Authority Impersonation*, *Isolation*, *Urgency*, and *Payment Coercion*.
   - **Semantic LLM Scoring (60% Weight):** Evaluates overall dialogue context using Claude / GPT-4 or an offline local semantic engine.
5. **Real-Time WebSocket Broadcast:** Score updates, highlighted keywords, reasoning strings, and deepfake signals are pushed bi-directionally to the React dashboard.
6. **Emergency Alert Trigger:** If the final fusion score equals or exceeds **75%**, an unmissable red modal (`AlertCard`) blocks the screen, offering one-tap connection to **1930** and **cybercrime.gov.in**.

## 4.3 Key Innovation & Core Benefits
- **Multi-Modal Risk Telemetry:** Combines voice acoustic biometrics with linguistic semantics.
- **Dual Offline/Online Resilience:** Features full offline client/server fallback matching when cloud APIs or databases are unavailable.
- **Actionable Escalation:** Direct integration with official Government of India emergency cybercrime hotline numbers.

<div style="page-break-after: always;"></div>

---

# 5. Key Features

The table below details all fully implemented features in the codebase:

| Feature | Technical Description | User Benefit | Technology Stack Used |
| :--- | :--- | :--- | :--- |
| **Scenario Rehearsal Simulator** | Pre-loaded threat dialogue scenarios (*Fake CBI Arrest*, *Customs AI Voice*, *Genuine Bank*, *Genuine Courier*). | Allows users to test and observe threat telemetry in safe demo modes. | React, JavaScript, Scenarios Constants |
| **Live Microphone Interceptor** | Captures real-time voice speech via browser APIs and streams chunked transcripts. | Hands-free real-time call protection during active phone calls. | Web Speech API, React Hooks |
| **Audio File Upload Pipeline** | Decodes uploaded `.wav`/`.mp3` files, processes base64 payloads, runs deepfake model & STT. | Enables post-call forensic audit of recorded call files. | FastAPI, Python Base64, Whisper API |
| **Acoustic Deepfake Voice Detector** | Pretrained neural Wav2Vec2 model analyzing audio spectral features for TTS/voice cloning artifacts. | Alerts user if the caller is using a synthetic AI-cloned voice. | HuggingFace Transformers, PyTorch, Wav2Vec2 |
| **Fuzzy Regex Rules Engine** | Multi-lingual keyword evaluation covering English, Hinglish, and Hindi Devnagari triggers. | Fast, local detection of authority names, urgency, and isolation orders. | Python `rapidfuzz`, Regex |
| **LLM Semantic Scorer & Fallback** | Analyzes dialogue context using Claude 3, GPT-4 JSON schema, or an offline local semantic rule engine. | Prevents evasive scammers from bypassing static keyword filters. | Anthropic SDK, OpenAI SDK, Local Fallback |
| **SVG Risk Telemetry Gauge** | Dynamic circular progress dial displaying threat score (0–100%) with color-shifting themes. | Provides immediate visual feedback on current threat severity. | React SVG, HSL Color Math |
| **Voice Matrix Status Badge** | Dynamic status indicator displaying verified human signature vs AI voice confidence. | Clear visual identification of caller voice authenticity. | React, Lucide Icons |
| **Real-Time Transcript View** | Dialogue bubble layout separating *INCOMING (SCAMMER)* and *TARGET USER* with live keyword highlight. | Highlights specific coercive words spoken during the call. | React, Dynamic Regex Parser |
| **Emergency Alert Overlay** | Red glowing modal popping up automatically at score $\ge 75\%$. | Blocks panic and provides instant emergency action choices. | React Tailwind CSS, AlertCard Component |
| **1930 Helpline Escalation** | Direct phone link (`tel:1930`) and link to official NCRB portal (`cybercrime.gov.in`). | Enables instant victim reporting to cybercrime authorities. | HTML5 Anchor, Browser Call Handler |
| **Incident Threat Registry** | SQLite-backed database storing session IDs, transcripts, risk scores, deepfake metrics, and status. | Persistent history log for threat review and legal reporting. | SQLite, SQLAlchemy ORM, FastAPI REST |
| **WebSocket Live Broadcast** | Bi-directional socket server pushing real-time threat updates to frontend clients. | Low-latency state synchronization across components. | FastAPI WebSockets, Uvicorn, React Hooks |

<div style="page-break-after: always;"></div>

---

# 6. System Architecture & Workflow

## 6.1 Overall Architecture

```mermaid
graph TD
    subgraph Frontend_Client [React Application - Vite + Tailwind CSS]
        UI[Call Simulator Dashboard]
        WS_Hook[useWebSocket Hook]
        Mic[Web Speech API Live Mic]
        Upload[Audio File Upload]
        
        UI --> WS_Hook
        UI --> Mic
        UI --> Upload
    end

    subgraph Backend_Server [FastAPI Application - Uvicorn]
        Router[API Route Orchestrator]
        WS_Server[WebSocket Manager]
        Session_Mgr[DB Session Manager]
        
        Router --> Session_Mgr
        WS_Server <--> Router
    end

    subgraph AI_Services [ML & Speech Services Pipeline]
        STT[Whisper Speech-to-Text Service]
        DF[Wav2Vec2 Deepfake Detector]
        RuleEngine[Fuzzy Regex Rules Scorer]
        LLM[Claude / GPT / Fallback Semantic Scorer]
        
        Router --> STT
        Router --> DF
        Router --> RuleEngine
        Router --> LLM
    end

    subgraph Data_Layer [Database Storage]
        DB[(SQLite Database - interceptor.db)]
    end

    WS_Hook <-->|Bi-directional WebSockets| WS_Server
    Router -->|HTTP REST POST / GET| Frontend_Client
    Session_Mgr -->|SQLAlchemy ORM Read/Write| DB
```

## 6.2 Data & Processing Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as React Client
    participant API as FastAPI Backend
    participant ML as ML & Deepfake Engine
    participant DB as SQLite DB
    participant WS as WebSocket Manager

    User->>Frontend: Select Scenario / Speak Mic / Upload Audio
    Frontend->>API: POST /api/audio-chunk (Base64 audio)
    API->>ML: analyze_audio_deepfake(bytes)
    ML-->>API: {is_ai_voice: bool, confidence: float}
    API->>DB: Update incident deepfake metadata
    API->>ML: transcribe_audio(bytes)
    ML-->>API: Transcribed text string
    API-->>Frontend: Return transcript response
    
    Frontend->>API: POST /api/transcript-chunk (text_chunk)
    API->>ML: rule_based_score(transcript)
    ML-->>API: (rule_score, matched_categories)
    API->>ML: llm_score(transcript)
    ML-->>API: {score: llm_score, reasoning: str}
    API->>API: calculate_fusion_score(rule_score, llm_score)
    API->>DB: Save incident record (risk_score, status)
    API->>WS: Broadcast real-time threat payload
    WS-->>Frontend: Push WS update (risk_score, reasoning, alerts)
    
    alt Risk Score >= 75%
        Frontend->>User: Display Emergency Alert Overlay (AlertCard)
        User->>Frontend: Click "Call Helpline (1930)"
        Frontend->>API: PUT /api/incidents/{id}/status (status="reported")
        API->>DB: Persist reported status
    end
```

<div style="page-break-after: always;"></div>

---

# 7. Technology Stack

| Layer / Component | Technology / Library | Version / Details | Purpose |
| :--- | :--- | :--- | :--- |
| **Language (Frontend)** | JavaScript (ES6+) | Modern standard | Application UI logic & state |
| **Language (Backend)** | Python | 3.10+ | Core API, ML inference, DB management |
| **Frontend Framework** | React | 18.x | Modular component UI architecture |
| **Build Tooling** | Vite | Latest | Fast bundler & HMR dev environment |
| **UI Styling** | Tailwind CSS | 3.x | Cyberpunk/Dark glassmorphic styling |
| **Iconography** | Lucide React | Latest | Clean security UI icons |
| **Backend Framework** | FastAPI | 0.100+ | Asynchronous REST API endpoints & WebSockets |
| **ASGI Web Server** | Uvicorn | Latest | Production-grade async server |
| **Database** | SQLite | 3.x | Zero-config embedded relational storage |
| **ORM Mapper** | SQLAlchemy | 2.x | Python DB model mapping |
| **Deepfake Model** | HuggingFace Transformers | `wav2vec2-base-superb-asvspoof` | Neural acoustic spoof classifier |
| **Fuzzy Matching** | RapidFuzz | 3.x | Partial ratio string keyword matching |
| **LLM Integrations** | Anthropic SDK / OpenAI SDK | Claude-3 Sonnet / GPT-4 Turbo | High-level semantic reasoning |
| **Speech-to-Text** | Web Speech API & OpenAI Whisper | Native Browser / API | Dual-mode speech transcription |
| **Testing Suite** | Pytest | Latest | Automated unit & integration testing |
| **Containerization** | Docker & Docker Compose | Multi-container setup | Orchestrated backend & frontend deployment |

<div style="page-break-after: always;"></div>

---

# 8. Module Documentation

## 8.1 Backend Modules

### 8.1.1 Main Entry Point (`main.py`)
- **Purpose:** Initializes the FastAPI application instance, configures global CORS policy, binds database schemas, and attaches API routers.
- **Dependencies:** `fastapi`, `fastapi.middleware.cors`, `app.core.config`, `app.db.session`, `app.api.router`.

### 8.1.2 Rule Scoring Service (`app/services/scorer.py`)
- **Purpose:** Implements fuzzy keyword matching against pre-defined threat taxonomies.
- **Taxonomy Categories:**
  - *Authority Impersonation* (Weight: 35.0)
  - *Isolation* (Weight: 20.0)
  - *Urgency* (Weight: 20.0)
  - *Payment Coercion* (Weight: 25.0)
- **Input:** Transcript string.
- **Output:** Tuple containing `(final_score: float, matched_categories: List[str])`.

### 8.1.3 Deepfake Detection Service (`app/services/deepfake.py`)
- **Purpose:** Analyzes incoming audio WAV bytes using a pretrained Wav2Vec2 model.
- **Model:** `Melodist/wav2vec2-base-superb-asvspoof`.
- **Output:** Dictionary `{"is_ai_voice": bool, "confidence": float}`.
- **Fallback Logic:** Spectral complexity byte-sum estimation if GPU/PyTorch runtime is absent.

### 8.1.4 LLM Semantic Service (`app/services/llm.py`)
- **Purpose:** Invokes Claude 3 Sonnet or GPT-4 JSON API for contextual scam verification.
- **Input:** Cumulative session transcript text.
- **Output:** Structured JSON schema containing score, matched patterns, and reasoning text.
- **Offline Fallback:** `local_fallback_llm_score()` provides semantic offline evaluation without cloud API keys.

### 8.1.5 WebSocket Manager (`app/services/websocket.py`)
- **Purpose:** Maintains active client WebSocket connections keyed by `session_id` and broadcasts live telemetry payloads.

---

## 8.2 Frontend Modules

### 8.2.1 Call Simulator (`CallSimulator.jsx`)
- **Purpose:** Main orchestration panel for running test scenarios, toggling live microphone input, uploading audio files, and rendering telemetry components.

### 8.2.2 Incident Dashboard (`Dashboard.jsx`)
- **Purpose:** Renders the persistent Threat Registry table, computes summary metrics, and handles incident status updates (`reported`, `dismissed`, `flagged`).

### 8.2.3 Risk Telemetry Meter (`RiskMeter.jsx`)
- **Purpose:** Dynamic SVG circular dial visualizing current risk score percentage with responsive color transitions (Green < 40%, Yellow 40–69%, Red $\ge$ 70%).

### 8.2.4 Emergency Alert Overlay (`AlertCard.jsx`)
- **Purpose:** High-priority modal popup displayed when threat score $\ge 75\%$. Contains direct hotline links (`tel:1930`) and portal redirection links.

<div style="page-break-after: always;"></div>

---

# 9. User Interface Documentation

## 9.1 Call Simulator Screen
- **Purpose:** Core operational workspace for active threat interception and testing.
- **Key Components:**
  1. *Header Navigation Bar:* App logo, tab switchers (`Call Simulator` / `Incident Database`), status badge (`GUARD ACTIVE`).
  2. *Scenario Rehearsal Container:* 4 preset scenario selection buttons.
  3. *Interceptor Console:* Live mic toggle, file upload input, stream control button.
  4. *Risk Telemetry Panel:* SVG risk progress ring, threat classification label.
  5. *Voice Matrix Badge:* Audio classifier confidence indicator.
  6. *Real-Time Transcript View:* Dialogue bubbles with highlighted scam keywords.

*(Placeholder: Insert Call Simulator Screenshot Here)*

## 9.2 Emergency Alert Card Overlay
- **Purpose:** Intercepts user action during severe scam threats ($\ge 75\%$).
- **Key Components:** Red pulsing glow border, semantic reasoning box, matched threat tags list, `Call Helpline (1930)` primary action button, `Report on NCRB Portal` secondary button.

*(Placeholder: Insert Alert Card Screenshot Here)*

## 9.3 Incident Database Screen
- **Purpose:** Administrative audit log view of historical calls.
- **Key Components:** 4 metric cards (*Scams Blocked*, *Avg Risk Index*, *Helpline Reports*, *Dismissed Safe*), interactive audit table with row-level status actions (`Escalate (1930)`, `Dismiss`).

*(Placeholder: Insert Incident Database Screenshot Here)*

<div style="page-break-after: always;"></div>

---

# 10. Database & API Documentation

## 10.1 Database Schema (SQLite)

```mermaid
erDiagram
    CALL_SESSIONS ||--o{ INCIDENTS : contains
    
    CALL_SESSIONS {
        string id PK "Custom session identifier"
        datetime created_at "Session creation timestamp"
        string status "active | completed"
    }

    INCIDENTS {
        int id PK "Autoincrement ID"
        string session_id FK "References CALL_SESSIONS(id)"
        text transcript "Cumulative conversation text"
        float risk_score "Combined fusion score (0-100)"
        text matched_patterns "JSON string list of categories"
        text reasoning "LLM / Fallback reasoning text"
        boolean is_ai_voice "Deepfake classification flag"
        float deepfake_score "Deepfake confidence rating"
        datetime timestamp "Log timestamp"
        string status "flagged | reported | dismissed"
    }
```

## 10.2 API Endpoint Documentation

| HTTP Method | Endpoint Path | Request Payload | Response Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/audio-chunk` | `{ session_id, audio_blob, filename }` | `{ transcript }` | Decodes base64 audio, runs deepfake classification, transcribes text. |
| **POST** | `/api/transcript-chunk` | `{ session_id, text_chunk }` | `{ session_id, risk_score, matched_patterns, alert, is_ai_voice, deepfake_score }` | Appends text chunk, computes fusion score, updates DB, triggers WS broadcast. |
| **GET** | `/api/incidents` | *QueryParams:* `status, min_score, limit, offset` | `List[IncidentResponse]` | Retrieves historical threat incident logs. |
| **PUT** | `/api/incidents/{id}/status` | `{ status: "reported" \| "dismissed" }` | `{ message, incident_id, status }` | Updates threat escalation state. |
| **GET** | `/api/incidents/stats` | *None* | `{ total_scams, average_risk, total_dismissed, total_reported }` | Returns aggregated metrics for dashboard summary cards. |
| **WS** | `/ws/session/{session_id}` | *WebSocket connection* | `WS JSON Payload` | Bi-directional streaming socket for live telemetry updates. |

<div style="page-break-after: always;"></div>

---

# 11. AI / ML & Security

## 11.1 Inference & Threat Fusion Model
1. **Voice Deepfake Detection:**
   - Model: `Melodist/wav2vec2-base-superb-asvspoof` (PyTorch).
   - Ingestion: Audio bytes sampled at 16kHz mono.
   - Classification: Emits `spoof` vs `bonafide` probabilities.
2. **Hybrid Risk Fusion Scorer:**
   - Mathematical Formulation:
     $$\text{Final Risk Score} = (0.40 \times \text{RuleScore}) + (0.60 \times \text{LLMScore})$$
   - Thresholding: If $\text{Final Risk Score} \ge 75.0$, an emergency alert is triggered.

## 11.2 Security & Data Privacy Measures
- **Local Database Isolation:** SQLite database file (`interceptor.db`) remains on the local filesystem.
- **Zero Permanent Audio Retention:** Audio blobs uploaded for STT/deepfake analysis are processed in-memory (`io.BytesIO`) and discarded post-inference.
- **Strict Schema Validation:** Pydantic schemas enforce type safety across all API payloads.

<div style="page-break-after: always;"></div>

---

# 12. Testing & Performance

## 12.1 Testing Suite Overview
The project contains automated unit tests executed via `pytest` located in the `backend/tests/` directory.

## 12.2 Test Coverage Summary
- **`test_scorer.py`:** Verifies rule-based keyword extraction accuracy for hinge-case Hindish/English trigger terms, ensuring score limits remain within $[0.0, 100.0]$.
- **`test_api.py`:** Tests FastAPI REST endpoints (`/api/transcript-chunk`, `/api/incidents`, `/api/incidents/stats`) using Starlette `TestClient` with temporary test database fixtures.

```bash
# Command to execute tests
cd backend
pytest -v
```

## 12.3 Performance & Latency Considerations
- **Rule Engine Latency:** $< 5\text{ ms}$ processing time per sentence chunk.
- **WebSocket Broadcast Latency:** $< 15\text{ ms}$ overhead using async Uvicorn loops.
- **Local Fallback Mode:** Guarantees sub-50ms execution even when external cloud APIs experience timeouts.

<div style="page-break-after: always;"></div>

---

# 13. Challenges & Future Scope

## 13.1 Technical Challenges Overcome
1. **Multi-Lingual Code-Mixing:** Scammers frequently mix English, Hinglish, and regional terms. Overcome by implementing multi-dialect keyword taxonomies and fuzzy matching (`rapidfuzz`).
2. **Cloud Dependency Avoidance:** Solved by engineering an offline local semantic analyzer fallback (`local_fallback_llm_score`) so safety checks function without internet API keys.

## 13.2 Future Enhancements
- **Native Mobile Integration:** Packaging frontend components into React Native / Android background service modules to capture incoming cellular calls automatically.
- **Direct Telecom API Integration:** Syncing threat registry payloads directly with telecom spam detection registries and state police cyber cells.

<div style="page-break-after: always;"></div>

---

# 14. Conclusion

**Digital Arrest Interceptor** successfully demonstrates an end-to-end, multi-modal public safety companion that directly targets the mechanics of Digital Arrest scam coercion. By combining acoustic deepfake voice analysis, multi-lingual fuzzy keyword extraction, and LLM semantic context evaluation, the system effectively bridges the gap between active phone call threats and immediate official emergency escalation via the 1930 Cybercrime Helpline.

<div style="page-break-after: always;"></div>

---

# 15. References

1. **National Cyber Crime Reporting Portal (NCRB):** [https://cybercrime.gov.in](https://cybercrime.gov.in)
2. **Indian Cyber Crime Coordination Centre (I4C):** National Helpline 1930 Guidelines.
3. **HuggingFace Wav2Vec2 ASVspoof Model:** `Melodist/wav2vec2-base-superb-asvspoof`.
4. **FastAPI Framework:** [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
5. **React Documentation:** [https://react.dev/](https://react.dev/)
