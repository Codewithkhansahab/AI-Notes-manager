# AI Notes Manager

A modern note-taking application with AI-powered summarization using FastAPI backend and React TypeScript frontend.

##  Quick Start

### Backend Setup

1. Navigate to the Backend directory:

   ```bash
   cd Backend
   ```

2. Install Python dependencies:

   ```bash
   pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-multipart google-generativeai pydantic[email]
   ```

3. Set up environment variables (create `.env` file in Backend directory):

   ```
   SECRET_KEY=your-secret-key-here
   GEMINI_API_KEY=your-gemini-api-key-here
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

4. Start the backend server:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   Or on Windows, double-click `start-backend.bat`

### Frontend Setup

1. Navigate to the Frontend directory:

   ```bash
   cd Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

##  Troubleshooting

### "Cannot connect to server" error

- Make sure the backend is running on `http://localhost:8000`
- Check that no firewall is blocking the connection
- Verify the backend started without errors

### React Router warnings

- These are just deprecation warnings and don't affect functionality
- They've been configured to use future flags to suppress warnings

##  Features

- **Authentication**: Secure login/register with JWT tokens
- **Notes Management**: Create, edit, delete, and search notes
- **AI Summarization**: Generate summaries using Google's Gemini AI
- **Modern UI**: Material-UI components with responsive design
- **Real-time Search**: Filter notes by title, content, or summary

##  Tech Stack

**Backend:**

- FastAPI
- SQLAlchemy
- Google Gemini AI
- JWT Authentication

**Frontend:**

- React 18 with TypeScript
- Material-UI (MUI)
- React Router v6
- Axios for API calls
