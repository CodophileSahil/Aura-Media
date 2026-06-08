# Quality Assurance Test Cases Matrix

This document presents structured test cases testing authentication, speech interaction, AI processing pipelines, semantic search, distribution features, and security compliance.

| Test ID | Test Scenario | Input / Spoken Phrase | Expected Behavior | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | User Registration Form Validation | Username: "a", Email: "invalid", Pass: "123" | Reject submission; display validation errors (username >=3 chars, valid email syntax, pass >=6 chars). | Passed |
| **TC-02** | Role-Based Access Control | Viewer tries uploading files (POST to `/api/media/upload`) | Server blocks request with status code `403 Forbidden` and error payload: "role is not authorized". | Passed |
| **TC-03** | Voice Command - Layout Change | User speaks: `"Open library"` | Web Speech recognizes command, speaks: `"Opening your media library"`, changes layout to `/library`. | Passed |
| **TC-04** | Voice Command - Play Media | User speaks: `"Play media"` | Web Speech recognises command, speaks: `"Playing content"`, triggers play callback on the active video/audio. | Passed |
| **TC-05** | File Upload Constraints | Large Video file drop (> 50MB limits check) | Multer middleware intercepts upload, returns `400 Bad Request` or file limit exception payload. | Passed |
| **TC-06** | AI Metadata Generation | Upload Image: `nature-walk.jpg` | API responds success. Background promise analyzes content and updates tags to `['scenery', 'outdoor', 'nature']`. | Passed |
| **TC-07** | Smart Search - Text Filter | Query: `"Aura"` | Server returns matches where Title or tags matches regex: `(/Aura/i)`. | Passed |
| **TC-08** | Smart Search - Semantic AI | Query: `"coding guidelines"` | Server calculates embeddings vectors, returns files related to technology with similarity match scores. | Passed |
| **TC-09** | Scheduled Content Release | Scheduled media date <= Current local timestamp | System scheduled task updates file status from `draft` to `published`, making it visible to Viewers. | Passed |
| **TC-10** | Shared Media link expiry | Click share link expired token (or validity token expired) | Server returns `410 Gone` HTTP status page showing: "Shareable link has expired". | Passed |
| **TC-11** | Real-Time Sync Notifications | Complete file analysis backend task | WebSocket broadcasts `notification` event. Bell icon badge increments dynamically. | Passed |
| **TC-12** | Database Audits Logging | User triggers Login action | DB writes action item `Login` to `ActivityLogs` recording email, IP address, and browser User Agent. | Passed |
