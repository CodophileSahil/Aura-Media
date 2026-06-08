# Project UML and DFD Diagrams

This document contains standard academic diagrams representing system context, entity relationships, use cases, and modular flows using Mermaid format.

---

## 1. System Architecture Diagram
Represents the client-server interaction patterns and connections to services:

```mermaid
graph TD
    User([Platform User]) <--> |Speech/Clicks| React[React.js Frontend SPA]
    
    subgraph Browser Client
        React <--> |Speech Recognition/Synthesis| WebSpeech[Web Speech API Engine]
        React <--> |State Management| Redux[Redux Toolkit Store]
    end

    React <--> |CORS / HTTP Rest API| Express[Express.js Node Server]
    React <--> |Websockets Connection| SocketIO[Socket.io WS Layer]

    subgraph Backend Server
        Express <--> |MVC Route Controller| Controllers[Controllers Router Router]
        Controllers <--> |Secure Storage| Multer[Multer File Uploads Helper]
        Controllers <--> |AI Tagging Services| AIService[AI NLP Analysis Service]
        Multer --> UploadDir[(uploads/ Directory)]
    end

    AIService <--> |REST API| OpenAI[OpenAI API Vector Model]
    Controllers <--> |Sequelize ORM| Mongo[(MySQL Database)]
```

---

## 2. Entity-Relationship Diagram (ERD)
Illustrates tables structure and relational foreign key constraints inside MySQL:

```mermaid
erDiagram
    USER {
        INT id PK
        string username
        string email
        string password
        string role
        string profileImage
        date createdAt
    }
    MEDIA {
        INT id PK
        string title
        string description
        string category
        string tags
        INT ownerId FK
        string fileUrl
        string fileType
        string mediaType
        number fileSize
        string status
        boolean isScheduled
        date scheduledDate
        string aiSummary
        string aiKeywords
        string aiTranscript
        number downloadsCount
        number viewsCount
        array sharedLinks
        date createdAt
    }
    NOTIFICATION {
        INT id PK
        INT userId FK
        string title
        string message
        string type
        boolean isRead
        date createdAt
    }
    ACTIVITY_LOG {
        INT id PK
        INT userId FK
        string action
        string details
        string ipAddress
        string userAgent
        date createdAt
    }
    VOICE_COMMAND {
        INT id PK
        INT userId FK
        string rawTranscript
        string detectedIntent
        object recognizedEntities
        boolean isSuccess
        string errorDetail
        date createdAt
    }
    RECOMMENDATION {
        INT id PK
        INT userId FK
        INT mediaId FK
        number score
        string reason
        date createdAt
    }

    USER ||--o{ MEDIA : "uploads"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ ACTIVITY_LOG : "triggers"
    USER ||--o{ VOICE_COMMAND : "speaks"
    USER ||--o{ RECOMMENDATION : "gets"
    MEDIA ||--o{ RECOMMENDATION : "recommended"
```

---

## 3. Use Case Diagram
Specifies administrative privileges and creators/viewers actions scope:

```mermaid
left_to_right_direction
graph TD
    Viewer((Viewer User))
    Creator((Content Creator))
    Admin((System Admin))

    subgraph Use Cases
        UC1[Register & Authenticate]
        UC2[Voice Command Interface]
        UC3[Smart Text Search]
        UC4[Semantic Vector Search]
        UC5[Download File Assets]
        UC6[Create Media Links]
        
        UC7[Upload Media Files]
        UC8[Schedule Publishing Releases]
        UC9[Monitor personal Views Analytics]
        
        UC10[Manage User Privileges]
        UC11[Review System Audit Trails]
    end

    Viewer --> UC1
    Viewer --> UC2
    Viewer --> UC3
    Viewer --> UC4
    Viewer --> UC5

    Creator --> UC1
    Creator --> UC2
    Creator --> UC7
    Creator --> UC8
    Creator --> UC9
    Creator --> UC6

    Admin --> UC1
    Admin --> UC10
    Admin --> UC11
    Admin --> UC7
```

---

## 4. Data Flow Diagrams (DFD)

### 4.1 DFD Level 0 (Context Diagram)
Defines context boundary connecting actor interactions inputs/outputs:

```mermaid
graph LR
    User([System User]) --> |Spoken Speech Triggers / File Uploads / Login info| System["[Process 0.0] Smart Media Platform"]
    System --> |Synthesized Voice Replies / Files Previews / Reports / Notifications| User
```

### 4.2 DFD Level 1
Delineates primary processes, endpoints routers, and databases store queries:

```mermaid
graph TD
    User([System User]) <--> |Inputs/Outputs| P1["[1.0] User Authentication"]
    User <--> |Files dropped| P2["[2.0] Media Uploads Control"]
    User <--> |Voice Commands spoken| P4["[4.0] Speech Recognition & NLP Intent"]
    User <--> |Query typed/spoken| P5["[5.0] Standard/Semantic search"]
    
    P2 --> |Asynchronous Analysis Kicked off| P3["[3.0] AI tagging summary pipeline"]
    
    P3 --> |Compute vectors / metadata updates| DB[(MySQL database)]
    P1 <--> DB
    P2 <--> DB
    P4 <--> DB
    P5 <--> DB

    P3 --> |Trigger sockets notifications| SocketIO[Socket.io Push alerts]
    SocketIO --> User
```

### 4.3 DFD Level 2 (AI Upload Processing Pipeline Detail)
Expands on processes within Media Upload and background AI generation:

```mermaid
graph TD
    Creator([Content Creator]) --> |Uploads Media Binary| Multer["[2.1] Validate File Mimetype/Size via Multer"]
    Multer --> |Save File in backend/uploads| UploadFolder[(uploads/ storage folder)]
    Multer --> |Generate Database Stub Record| DB[(MySQL database)]
    
    DB --> |Triggers background process| AIParser["[3.1] Identify MediaType & Call AI Service"]
    
    AIParser --> |Image file| ImageAI["[3.2a] Extract Category / Auto-tags"]
    AIParser --> |Audio/Video file| AudioAI["[3.2b] Auto-Speech Transcription & Keywords"]
    AIParser --> |Document file| DocAI["[3.2c] Read text & compile summary"]
    
    ImageAI --> MergeMetadata["[3.3] Merge Tags & update DB Record"]
    AudioAI --> MergeMetadata
    DocAI --> MergeMetadata

    MergeMetadata --> |Save final tags/summary/transcript| DB
    MergeMetadata --> |Push WebSocket Broadcast Event| WSNotify["[3.4] Socket.io push alert to client UI"]
    WSNotify --> Creator
```
