# Smart Voice Activated Media Content Management and Distribution Platform

A complete, production-ready MERN stack application designed as an MCA Final-Year capstone project. Leveraging AI/ML processing for automatic media tagging, speech transcription, text summarization, vector-based semantic search, and browser-native Web Speech interfaces.

---

## 🎙️ Platform Highlights
- **Speech Assistant Controls**: Navigate, play items, generate logs, or perform voice searches using built-in microphone speech recognition.
- **AI Processing Pipeline**: Automatically analyzes uploaded files. Auto-tags/describes images, transcribes audio files, extracts summaries from video streams, and categories document files.
- **Role-Based dashboards**: Tailored interfaces for Admins (system timeline, user controls), Creators (upload, metrics graphs), and Viewers (AI recommendation systems).
- **Hardened Security**: Session checking with JSON Web Tokens, password hashing with bcrypt, Multer MIME constraints, and request rate-limiting.
- **Real-Time Push Alerts**: WebSocket connections utilizing Socket.io instantly push processing completions or uploads updates.

---

## 🛠️ Technology Stack
- **Frontend SPA**: React.js, React Router, Redux Toolkit, Tailwind CSS, Recharts, Axios.
- **Backend API**: Node.js, Express.js, MySQL Database, Sequelize ORM, Socket.io, Multer, Helmet.
- **AI Core**: OpenAI GPT models integrations (fallback: localized keyword & regex parser).
- **Speech Controls**: Browser Web Speech Recognition & SpeechSynthesis APIs.

---

## 📂 Folder Layout
```
/voice-activated-media-platform
│
├── /backend
│   ├── /config       # Sequelize database connection config
│   ├── /controllers  # Express controllers (auth, media, voice, search, analytics)
│   ├── /middleware   # Route checkers (RBAC auth, file size uploads, error formatters)
│   ├── /models       # Schemas (Users, Media, Notification, Log, Recommendation, Voice)
│   ├── /routes       # API routes mapping
│   ├── /services     # AI OpenAI + Fallback engines, Socket WS integrations
│   ├── /uploads      # Local directory hosting uploaded media files
│   ├── server.js     # Master backend loader
│   └── package.json
│
├── /frontend
│   ├── /public       
│   ├── /src
│   │   ├── /components  # Layout blocks (Sidebar, Header, Cards, Buttons)
│   │   ├── /hooks       # Web Speech Recognition React hooks
│   │   ├── /pages       # Auth pages, dashboards, library table, admin panels
│   │   ├── /redux       # Slices (auth, media list, notifications store)
│   │   ├── main.jsx     # Bootstrap mounting entry point
│   │   └── App.jsx      # Router configuration and layout wrappers
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── /docs             # SRS specs, API endpoints docs, ERD DFD Diagrams, Test cases
```

---

## ⚙️ Installation & Launch

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MySQL Database** (Running local MySQL service, e.g., MySQL80)

### 2. Backend Configurations
Navigate to the `/backend` folder and create a `.env` file:
```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=voice_media_platform
JWT_SECRET=aura_voice_media_jwt_secret_key_987654321_abc
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=
```
*Note: If no `OPENAI_API_KEY` is provided, the backend automatically activates a robust, high-fidelity local keyword extraction, transcription, and similarity engine. The platform is 100% functional and ready for evaluation immediately!*

### 3. Start Backend Server
```bash
cd backend
npm install
npm start
```
The server starts listening on `http://localhost:5000`.

### 4. Start Frontend Client
```bash
cd ../frontend
npm install
npm run dev
```
The client dashboard opens on `http://localhost:3000`.

---

## 🗣️ Demonstration Voice Guide
1. Create a user account or click any of the **Demo autofill badges** on the Login screen to log in as an Admin, Creator, or Viewer.
2. Click the floating **Microphone Button** in the bottom-right corner.
3. Speak any of the following triggers:
   - **"Open library"** (to load media files)
   - **"Open dashboard"** (to view metrics graphs)
   - **"Upload media"** (to open files upload panel)
   - **"Play media"** (to trigger active audio/video players)
   - **"Search for technology"** (to run vector similarity filters)
   - **"Generate report"** (to export data logs files)
4. Aura AI will confirm using voice synthesis and execute the navigation.
