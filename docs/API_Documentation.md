# API Endpoints Documentation
## Base URL: `http://localhost:5000`

All endpoints are prefixed with `/api`. Protected routes require a JSON Web Token provided in the Authorization header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication APIs

### 1.1 Register User
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "creator" // admin | creator | viewer
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "_id": "60c72b2f9b1d8b2bad0343a1",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "creator",
  "profileImage": "https://api.dicebear.com/7.x/initials/svg?seed=johndoe",
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

### 1.2 Login User
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "_id": "60c72b2f9b1d8b2bad0343a1",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "creator",
  "profileImage": "https://api.dicebear.com/7.x/initials/svg?seed=johndoe",
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

### 1.3 Get User Profile
- **Endpoint**: `GET /api/auth/profile`
- **Access**: Private (Protected)
- **Response (200 OK)**:
```json
{
  "success": true,
  "_id": "60c72b2f9b1d8b2bad0343a1",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "creator",
  "profileImage": "https://api.dicebear.com/7.x/initials/svg?seed=johndoe"
}
```

---

## 2. Media APIs

### 2.1 Upload Media File
- **Endpoint**: `POST /api/media/upload`
- **Access**: Private (Admin & Creator)
- **Content-Type**: `multipart/form-data`
- **Form Parameters**:
  - `file`: Media File binary (image, audio, video, document)
  - `title`: String (Optional)
  - `description`: String (Optional)
  - `category`: String (Optional)
  - `tags`: String (comma-separated, Optional)
  - `isScheduled`: Boolean (Optional, "true" or "false")
  - `scheduledDate`: ISO Date String (Optional)
- **Response (210 Created)**:
```json
{
  "success": true,
  "message": "File uploaded successfully. AI processing in progress.",
  "media": {
    "_id": "60c72b2f9b1d8b2bad0343a2",
    "title": "Aura Presentation",
    "description": "Smart Voice Media project documentation",
    "category": "Technology",
    "tags": ["project", "documentation"],
    "owner": "60c72b2f9b1d8b2bad0343a1",
    "fileUrl": "/uploads/file-1623678000000.pdf",
    "fileType": "application/pdf",
    "mediaType": "document",
    "fileSize": 1420500,
    "status": "published",
    "viewsCount": 0,
    "downloadsCount": 0,
    "createdAt": "2026-06-06T13:40:00.000Z"
  }
}
```

### 2.2 Get Media Library
- **Endpoint**: `GET /api/media`
- **Access**: Private (Filters results according to user role access constraints)
- **Query Parameters**:
  - `category`: String (Optional)
  - `mediaType`: String (Optional, e.g. "image")
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "media": [...]
}
```

### 2.3 Download Media
- **Endpoint**: `GET /api/media/:id/download`
- **Access**: Private
- **Response**: Serves file attachment stream binary. Increments download statistics.

### 2.4 Generate Sharing Link
- **Endpoint**: `POST /api/media/:id/share`
- **Access**: Private
- **Request Body**:
```json
{
  "hours": 24
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "shareUrl": "/api/media/shared/7c7b85c20b9e4d4e9a0044e1b4ec698f",
  "expiresAt": "2026-06-07T13:40:00.000Z"
}
```

---

## 3. Search APIs

### 3.1 Smart Search
- **Endpoint**: `GET /api/search`
- **Access**: Private
- **Query Parameters**:
  - `query`: String (Required, search text terms)
  - `type`: String (Optional, "text" or "semantic")
  - `category`: String (Optional)
  - `mediaType`: String (Optional)
- **Response (200 OK)**:
```json
{
  "success": true,
  "query": "documentation",
  "searchType": "semantic",
  "count": 1,
  "results": [
    {
      "media": { ... },
      "score": 92
    }
  ]
}
```

---

## 4. Voice APIs

### 4.1 Log Voice Command
- **Endpoint**: `POST /api/voice/log`
- **Access**: Private
- **Request Body**:
```json
{
  "rawTranscript": "open library",
  "detectedIntent": "navigation_library",
  "isSuccess": true
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "command": { ... }
}
```

---

## 5. WebSockets events (Socket.io)

WebSocket channels allow pushing status notifications instantly:

### 5.1 Client Connect Registration
On connecting, the UI client must register using:
- **Event**: `register_user`
- **Payload**: `userId`

### 5.2 Server Push Events
The server publishes live notification updates:
- **Event**: `notification`
- **Payload**:
```json
{
  "_id": "60c72b2f9b1d8b2bad0343a8",
  "user": "60c72b2f9b1d8b2bad0343a1",
  "title": "AI Processing Completed",
  "message": "AI analysis for Aura Presentation concluded.",
  "type": "success",
  "isRead": false
}
```
