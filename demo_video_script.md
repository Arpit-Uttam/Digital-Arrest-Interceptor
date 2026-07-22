# 🎬 DIGITAL ARREST INTERCEPTOR — HACKATHON DEMO SCRIPT & RECORDING PLAN

**Project Name:** Digital Arrest Interceptor — AI Public Safety Companion  
**Total Estimated Video Duration:** 4 minutes 45 seconds (Target Range: 4–6 minutes)  
**Target Audience:** Hackathon Judges, Cybersecurity Analysts, & Public Safety Evaluators  

---

## ⏱️ Video Timing Breakdown

| Section | Topic | Duration |
| :--- | :--- | :--- |
| **Part 1** | Project Introduction & Problem Statement | 0:25 (0:00 - 0:25) |
| **Part 2** | Solution Overview & Unique Value Proposition | 0:40 (0:25 - 1:05) |
| **Part 3** | Live Product Demonstration (Screens & Workflow) | 2:45 (1:05 - 3:50) |
| **Part 4** | Technical Architecture & AI/ML Pipeline | 0:50 (3:50 - 4:40) |
| **Part 5** | Impact, Security & Future Scope | 0:25 (4:40 - 5:05) |
| **Part 6** | Closing Statement | 0:15 (5:05 - 5:20) |

---

## Part 1 – Project Introduction (0:00 – 0:25)

> **Visual:** Camera ON (Talking Head) transitioning to crisp hero shot of the Digital Arrest Interceptor Dashboard with dark cyber-glass UI and active guard badge.

**Voiceover Script:**  
"Digital Arrest Interceptor is an AI-powered, real-time public safety companion designed to combat one of the fastest-growing cybercrimes in India—Digital Arrest scams. Thousands of innocent citizens are currently targeted by sophisticated criminal syndicates impersonating law enforcement officers from the CBI, Enforcement Directorate, and Customs. By leveraging psychological coercion, fake arrest warrants, orders to lock doors, and demands for immediate money transfers, fraudsters inflict massive financial and emotional trauma before the victim can even seek help. Digital Arrest Interceptor acts as an automated, on-device shield—evaluating call audio and transcripts live to intercept scam tactics before money leaves the victim’s account."

---

## Part 2 – Solution Overview (0:25 – 1:05)

> **Visual:** Screen Recording of the Call Simulator Interface with call telemetry, SVG risk dial, deepfake badge, and live transcript view.

**Voiceover Script:**  
"Our solution provides real-time protection by running a continuous threat evaluation pipeline directly alongside incoming call conversations. Rather than relying on simple phone number blocklists that scammers easily spoof, Digital Arrest Interceptor analyzes what is actually being said and how it is being spoken. 

Our unique value proposition lies in a hybrid multi-modal threat engine: it combines acoustic AI deepfake voice classification with a dual-layer semantic threat scorer—blending 40% regex-based scam signal matching with 60% LLM contextual reasoning. If a call crosses safety thresholds, an unmissable emergency alert pops up over the user's screen, offering a one-touch escalation path directly to the official 1930 National Cybercrime Helpline and NCRB reporting portal."

---

## Part 3 – Live Demo Script (1:05 – 3:50)

---

### Demo Step 1: Interface Overview & Real-Time Status

* **Screen Name:** Interceptor Control Console & Threat Telemetry (Call Simulator Tab)
* **Action:** Hover over the sticky top navbar highlighting the `GUARD ACTIVE` glowing badge, `DIGITAL ARREST INTERCEPTOR` title, and navigation tabs (`Call Simulator` vs `Incident Database`).
* **Voiceover:**  
  "Welcome to the Digital Arrest Interceptor interface. Built with a responsive cyber-themed layout, the application features an active guard telemetry status at the top and split-screen telemetry. On the left is our Interceptor Console and Scenario Rehearsal selector. On the right is our live Threat Analysis Console featuring a dynamic SVG Risk Telemetry dial, Voice Matrix classifier, AI reasoning breakdown, and Real-Time Call Transcript viewer."
* **Expected Result:** Clear visual layout display showing status indicators, clean neon borders, and idle baseline metrics ready for incoming call analysis.
* **Why this feature is useful:** Gives users immediate visual feedback that their safety companion is active and monitoring call risks silently in the background.

---

### Demo Step 2: Genuine Bank Verification Call (Baseline Test)

* **Screen Name:** Scenario Rehearsal — Bank Transaction (Genuine)
* **Action:** Click on the `Bank Transaction (Genuine)` scenario button in the Scenario Rehearsal panel.
* **Voiceover:**  
  "Let's first test a routine, authentic call. We select the 'Bank Transaction' rehearsal scenario. As the transcript streams—simulating a legitimate ICICI bank representative asking about a suspicious card charge—watch the risk telemetry."
* **Expected Result:**
  * Transcript streams line-by-line into dialogue bubbles (`INCOMING` vs `TARGET USER`).
  * Risk Telemetry gauge remains at **12% (SAFE CONVERSATION)** with a green stroke ring.
  * Voice Matrix displays **Verified Human Signature** (emerald badge).
  * Scam signals container displays: *'No threat signals triggered yet...'*.
  * Analysis reasoning states: *'Authentic transaction verification request. No coercion or credential requests.'*
* **Why this feature is useful:** Proves zero false-positives for everyday legitimate banking or service calls, maintaining user trust without nuisance alerts.

---

### Demo Step 3: Fake CBI Digital Arrest Scam Interception

* **Screen Name:** Scenario Rehearsal — Fake CBI Arrest (Scam)
* **Action:** Click on the `Fake CBI Arrest (Scam)` scenario button.
* **Voiceover:**  
  "Now, let me demonstrate a high-severity Digital Arrest scam. I click the 'Fake CBI Arrest' scenario. The caller claims to be from CBI Cyber Crime Headquarters in New Delhi, asserting that an offshore account linked to illegal drug cartel finances has been found under the user’s Aadhaar, and a Supreme Court warrant of arrest is issued."
* **Expected Result:**
  * As lines stream, keyword highlighting automatically marks phrases like `CBI`, `Supreme Court`, `arrest warrant`, `lock the door`, `fifty thousand rupees` in amber tags.
  * Risk Telemetry SVG dial dynamically climbs from 0% to **96% (CRITICAL THREAT BREACH)** with an intense red glow.
  * Scam Signals container populates badges: `Authority Impersonation`, `Isolation`, `Urgency`, `Payment Coercion`.
  * At 75% score threshold, the **DIGITAL ARREST SCAM WARNING** Alert Modal immediately pops up with pulsing red neon border.
* **Why this feature is useful:** Instantly interrupts the scammer’s psychological isolation spell before the victim can comply with demands.

---

### Demo Step 4: Emergency Escalation & Helpline 1930 Integration

* **Screen Name:** Emergency Alert Overlay (`AlertCard`)
* **Action:** Move cursor over the modal's action buttons: `Call Helpline (1930)` and `Report on NCRB Portal`. Click `Call Helpline (1930)`.
* **Voiceover:**  
  "When a critical threat is intercepted, the app doesn’t just warn the user—it provides an immediate emergency response vector. The victim can dial the National Cybercrime Helpline **1930** with one tap or file an official report on the NCRB portal. Clicking this button automatically flags the incident status in our audit registry and initiates official helpline connectivity."
* **Expected Result:** Button click triggers instant logging update, status switches to 'Reported', and user is guided to government safety mechanisms.
* **Why this feature is useful:** Converts passive awareness into active crime prevention by connecting victims directly to law enforcement support.

---

### Demo Step 5: AI Cloned Voice Detection (Deepfake Seizure Scenario)

* **Screen Name:** Scenario Rehearsal — Customs Seizure (Scam + AI Voice)
* **Action:** Click `Dismiss Safety Warning`, then select `Customs Seizure (Scam + AI Voice)` scenario.
* **Voiceover:**  
  "Modern scammers increasingly use AI voice cloning to impersonate officials convincingly. Let's run our 'Customs Seizure' scenario, which includes synthetic voice audio. Notice the top right Voice Matrix panel."
* **Expected Result:**
  * Voice Matrix badge changes from active scanning to **AI VOICE DETECTED (96% CONFIDENCE)** in a pulsing rose badge.
  * Text reads: *'Spectral signatures match text-to-speech / clone models. Handle with extreme caution.'*
  * Risk Score rises to **85%**, combining deepfake score with semantic threat signals (`Authority Impersonation`, `Urgency`, `Payment Coercion`).
* **Why this feature is useful:** Protects citizens against synthetic audio impersonation attacks where fraudsters synthesize voices of trusted authorities or relatives.

---

### Demo Step 6: Live Microphone Capture & Audio File Upload

* **Screen Name:** Interceptor Console — Live Input Modes
* **Action:** Click the `LIVE MICROPHONE` button, speak a trigger phrase ("This is Customs Officer calling, lock your door and transfer money immediately"), then test the `UPLOAD AUDIO` button.
* **Voiceover:**  
  "Beyond pre-loaded scenarios, the app supports live real-time analysis. Users can activate the Live Microphone button powered by Web Speech API to capture live call audio, or click 'Upload Audio' to run recorded call files directly through our server-side Whisper transcription and Wav2Vec2 neural model pipeline."
* **Expected Result:**
  * Live mic captures speech, highlights scam words live in transcript view, updates risk telemetry dynamically.
  * Audio file upload processes file chunks, returns neural deepfake score, and populates threat analysis.
* **Why this feature is useful:** Ensures complete deployment flexibility for live phone call streaming as well as post-call forensic audit.

---

### Demo Step 7: Incident Database & Threat Registry

* **Screen Name:** Incident Database Tab (`Dashboard.jsx`)
* **Action:** Click the `Incident Database` tab in the top navigation bar.
* **Voiceover:**  
  "Finally, let's navigate to the Incident Database tab. Here, security teams and users can review historical audit logs backed by our local SQLite database. Four metric cards display total blocked scams, average risk index, helpline reports, and dismissed safe calls. In the registry table, every call attempt is stored with exact timestamps, session IDs, transcript snippets, deepfake audit signatures, and escalation status—allowing one-click status updates or reporting to 1930."
* **Expected Result:**
  * Summary Cards show live metrics (e.g. Total Scams: 2, Avg Risk Index: 64.3%, Helpline Reports: 1).
  * Table rows present captured calls with `Reported to 1930`, `Flagged Threat`, or `Dismissed` badges and interactive action controls (`Escalate (1930)`, `Dismiss`).
* **Why this feature is useful:** Provides an immutable legal and forensic log of scam attempts for cybercrime law enforcement investigations.

---

## Part 4 – Technical Overview (3:50 – 4:40)

> **Visual:** Split screen showing the System Architecture diagram from `README.md` alongside backend terminal logs and FastAPI code architecture.

**Voiceover Script:**  
"Architecturally, Digital Arrest Interceptor is engineered as a high-throughput, low-latency stack:

* **Frontend:** Built with React 18 and Vite, styled using modern Tailwind CSS with a dark cybersecurity theme, custom SVG telemetry dials, and custom React hooks (`useWebSocket`) for bi-directional live streaming.
* **Backend:** Powered by Python FastAPI, Uvicorn, and WebSockets, implementing session routers and an event manager for real-time broadcast.
* **Machine Learning & DSP Engine:**
  1. **Audio Deepfake Classifier:** Employs the pretrained HuggingFace `wav2vec2-base-superb-asvspoof` neural model to inspect spectral audio frequencies for synthetic text-to-speech artifacts.
  2. **Speech-to-Text:** Integrates client-side Web Speech API alongside server-side Whisper models.
  3. **Hybrid Risk Fusion Model:** Combines a 40% regex fuzzy keyword engine (using `rapidfuzz` across English, Hinglish, and Hindi Devnagari) with a 60% semantic LLM scorer (supporting Claude 3 Sonnet and GPT-4, alongside an offline semantic analyzer for zero-latency local fallback).
* **Database & Persistence:** SQLite managed via SQLAlchemy for lightweight, zero-configuration local threat logging."

---

## Part 5 – Impact, Security & Future Scope (4:40 – 5:05)

> **Visual:** Camera ON / Overlaid UI metrics highlighting privacy features and helpline connectivity.

**Voiceover Script:**  
"**Impact:** Digital Arrest Interceptor empowers vulnerable citizens—especially senior citizens and students—against devastating psychological financial fraud.  
**Security & Privacy:** All audio processing and semantic analysis occur locally or over encrypted WebSocket channels with zero permanent audio retention, ensuring user privacy compliance.  
**Scalability & Future Scope:** Built modularly for cross-platform mobile deployment (Android/iOS background call receivers), direct integration with telecom anti-spam APIs, and automated telemetry sync with state cyber police command centers."

---

## Part 6 – Closing (5:05 – 5:20)

> **Visual:** Camera ON (Presenter confident and smiling) with Digital Arrest Interceptor logo and GitHub repo screen background.

**Voiceover Script:**  
"Digital Arrest Interceptor turns defensive hesitation into proactive protection. By fusing speech AI, neural voice verification, and instant emergency helpline escalation, we ensure no citizen has to face digital fraudsters alone. Thank you!"

---

## 📹 Shot-by-Shot Video Recording & Production Plan

### Screen Recording & Camera Sequence

| Time | Camera | Screen Recording Focus | Cursor & Zoom Action | Audio / Transition |
| :--- | :--- | :--- | :--- | :--- |
| **0:00 - 0:10** | **ON** | Intro title slide / Presenter introduce name & title | Presenter looking into camera | Upbeat cyber ambient intro audio |
| **0:10 - 0:25** | **OFF** | Hero view of app main screen (`App.jsx`) | Smooth pan across top header `GUARD ACTIVE` | Smooth cross-fade to UI |
| **0:25 - 1:05** | **OFF** | Call Simulator panel + Risk Telemetry gauge | Hover over split-panel components | Voiceover clear and focused |
| **1:05 - 1:30** | **OFF** | Scenario 1: Bank Transaction | Click `Bank Transaction` scenario card | Highlight green 12% Risk Meter |
| **1:30 - 2:15** | **OFF** | Scenario 2: Fake CBI Scam | Click `Fake CBI Arrest` scenario card | Zoom in on dynamic Risk Meter rising to 96% |
| **2:15 - 2:40** | **OFF** | Alert Modal (`AlertCard.jsx`) | Move cursor over `Call Helpline (1930)` | Pulse animation on Red Warning Box |
| **2:40 - 3:10** | **OFF** | Scenario 3: Customs AI Voice Deepfake | Click `Customs Seizure` scenario card | Highlight `AI VOICE DETECTED (96%)` badge |
| **3:10 - 3:50** | **OFF** | Live Mic & Incident Database Tab | Click `LIVE MICROPHONE`, then switch tab | Smooth cursor click to `Incident Database` |
| **3:50 - 4:40** | **OFF** | System Architecture Diagram / Codebase | Highlight FastAPI + Wav2Vec2 + LLM fusion | Overlay clean code snippets |
| **4:40 - 5:05** | **ON** (Picture-in-Picture) | App Summary & Key Metrics | Split view: Presenter + App Dashboard | Dynamic visual contrast |
| **5:05 - 5:20** | **ON** | Closing frame with Repo URL / Thank You | Presenter looking into camera with confidence | Fade out music |

---

## 🎞️ B-Roll Asset Guide (Only Implemented Features)

1. **B-Roll 1: Top Navigation Bar & Active Guard Telemetry**  
   *Close-up zoom on the top sticky header showing `Shield` icon, gradient title `DIGITAL ARREST INTERCEPTOR`, `Call Simulator` & `Incident Database` tabs, and `GUARD ACTIVE` emerald badge.*

2. **B-Roll 2: Scenario Rehearsal Cards**  
   *Cursor hovering over the 4 preset scenario cards showing scam categories (`Scam`, `Deepfake Scam`, `Genuine`).*

3. **B-Roll 3: Radial SVG Risk Meter Gauge**  
   *Dynamic recording of the circular SVG dial animating smooth progress fill from 0% green -> 96% glowing red.*

4. **B-Roll 4: Dynamic Keyword Highlighting in Call Transcript**  
   *Scrolling view of incoming dialogue turns with amber highlighted threat keywords (`cbi`, `supreme court`, `arrest warrant`, `lock the door`, `transfer money`).*

5. **B-Roll 5: Voice Matrix Deepfake Warning Badge**  
   *Close-up of the `AI VOICE DETECTED` badge displaying 96% confidence score and spectral analysis warning.*

6. **B-Roll 6: Red Neon Alert Modal Overlay (`AlertCard`)**  
   *Full-screen view of the emergency modal popup with 1930 helpline dial button and NCRB portal link.*

7. **B-Roll 7: Incident Database Metrics & Registry Table**  
   *Pan across the 4 summary metric blocks (Scams Blocked, Avg Risk, Helpline Reports, Dismissed) and table status updates (`Reported to 1930`, `Flagged Threat`, `Dismissed`).*

---

## 🎙️ Speaker Delivery & Gesture Guide

* **Pacing & Emphasis:**
  * **Emphasize key terms:** *"Digital Arrest"*, *"1930 Helpline"*, *"Wav2Vec2 deepfake classification"*, *"Hybrid Fusion Scorer"*, *"Real-time local privacy"*.
  * **Slow down:** When explaining the **96% Risk Score jump** and the **Emergency 1930 Helpline integration** so judges digest the key innovation.
  * **Natural Pauses:** Pause for 1 second right after the emergency red Alert Card pops up to let the visual impact land.

* **Camera & Body Language Cues:**
  * **Smile Cues:** Warm smile during Part 1 intro and Part 6 closing statement.
  * **Eye Contact:** Look directly into the camera lens (not at your screen) during Part 1, Part 5, and Part 6.
  * **Hand Gestures:**
    * Use open palm gestures when stating the problem (*"thousands of citizens targeted"*).
    * Bring hands together when introducing the solution (*"fusing deepfake detection with semantic analysis"*).
    * Point slightly toward the screen when directing attention to the live telemetry dial.
