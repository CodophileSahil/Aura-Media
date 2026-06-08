# Software Requirements Specification (SRS)
## Project Title: Smart Voice Activated Media Content Management & Distribution Platform

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the "Smart Voice Activated Media Content Management and Distribution Platform using AI/ML Technology". It outlines the functional scope, architecture boundaries, hardware/software specifications, user roles, security benchmarks, and non-functional requirements. This document serves as the design framework for developers, testing teams, and academic evaluators.

### 1.2 Scope
The system is a MERN stack web platform designed to store, distribute, filter, and moderate digital media assets (images, video, audio, text documents). It incorporates natural language processing (NLP) and speech command engines to control the application layout and operations hands-free. AI routines automatically run tagging, summarization, speech transcribing, and vector embeddings indexes upon upload.

### 1.3 Intended Audience
- Master of Computer Applications (MCA) Project Evaluators & Viva Board Examiners.
- Academic Guides and Project Supervisors.
- Development and QA Engineering Teams.

---

## 2. Overall Description

### 2.1 Product Perspective
This product is a self-contained web application operating on a client-server architecture model. The UI client operates in the browser using React.js and communicates with the Node.js Express server using REST APIs and real-time Socket.io. MySQL is utilized as the database layer via the Sequelize ORM.

### 2.2 Product Functions
- **Role-Based Portals**: Distinct dashboards for Admin, Creator, and Viewer roles.
- **Voice Control Console**: Hands-free navigation and action controls utilizing browser Web Speech interfaces.
- **AI File Indexer**: Automated descriptions and keywords generation on file drop.
- **Distribution Hub**: Secure downloads, publication release scheduling, and cryptographic sharing links.
- **Analytics Visuals**: Chronology charts, type distributions, and audits tables.
- **Sync Alerts**: Live push alerts for uploads and AI completions.

### 2.3 User Classes and Characteristics
1. **Admin**: Has full access. Manages user directories, updates roles, deletes accounts, reviews audit logs, and monitors system analytics charts.
2. **Content Creator**: Uploads media assets, specifies manually category/tags, defines distribution schedules, views personal uploads views/downloads stats, and reads AI insights.
3. **Viewer**: Queries library items using text/speech/embeddings, downloads files, reads AI summaries/keywords, receives recommendations feed, and views shared links.

### 2.4 Design Constraints
- Application must operate locally on standard browser environments (e.g. Google Chrome, Microsoft Edge) supporting Web Speech API.
- Files size uploads must be bounded (limited to 50MB per media file).
- The system must function gracefully even in offline modes or if AI API keys are not supplied (leveraging local rules-based simulation algorithms).

---

## 3. Specific Requirements

### 3.1 External Interface Requirements
- **User Interfaces**: Premium SaaS dark/light templates built on Tailwind CSS, featuring responsive flex grids, sidebars, header profiles, floating mics, and charts.
- **Software Interfaces**: Node.js runtime, Sequelize ORM, Express.js web server, MySQL Database, and OpenAI REST completions.
- **Communication Interfaces**: Secure JSON Web Tokens inside authorization headers; WebSockets for socket.io alerts payloads.

### 3.2 System Features

#### 3.2.1 Voice Assistant Module
- **Stimulus**: Spoken input through Web Speech API.
- **Action**: Converts speech to text, matches command tokens against regex intent models, speaks replies using SpeechSynthesis, updates route, and logs query metrics.

#### 3.2.2 AI Metadata Generation
- **Stimulus**: Media upload completion trigger.
- **Action**: Runs background files analyzer. Generates image descriptions, audio transcripts, video tag highlights, and document summaries. Updates database records.

#### 3.2.3 Semantic Vector Search
- **Stimulus**: Search query form input.
- **Action**: Computes embeddings vectors. Ranks matches using memory-based cosine similarity computations. Returns relevance percentage metrics.

---

## 4. Non-Functional Requirements

### 4.1 Security
- Password credentials crypted using bcrypt hashing salts.
- Session authorization verifying signature payloads of JSON Web Tokens.
- Input validation sanitizers blocking cross-site scripting (XSS) and injection attempts.
- Server protection headers enabled via Helmet middleware.
- Request rate limiters blocking IP flooding.

### 4.2 Performance
- API requests response latency should remain under 500ms for database queries.
- Background AI metadata indexing updates should process asynchronously and push alerts under 2 seconds.

### 4.3 Availability & Portability
- Platform is completely responsive, functioning across smartphones, tablets, and desktops.
- Compatible with all platforms supporting modern Node.js and MySQL database engines.
