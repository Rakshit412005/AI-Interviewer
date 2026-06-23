# Due to Render's free instance this application's services are currently facing very serious irregularity issues, Trying to fix it ASAP also the code in the github is complete.

````md
# AI Interviewer

AI Interviewer is a full-stack mock interview platform that helps users practice technical interviews with AI-generated questions, speech-based answers, code-based answers and instant feedback. It supports both coding and oral responses, stores interview history, and provides performance summaries after each session.

## Features

- Role-based interview generation
- Support for multiple difficulty levels
- Coding + oral interview modes
- Voice answer capture and transcription
- Code editor for programming answers
- AI evaluation with score and feedback
- Interview history and review page
- Google login
- JWT-based authentication
- Real-time session updates
- Responsive UI for desktop and mobile

## Tech Stack

### Frontend
- React
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Monaco Editor
- Socket.IO client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.IO

### AI Service
- Python
- FastAPI
- Gemini 3.1 Flash Lite
- Whisper
- FFmpeg
- PyDub

## Architecture

The project uses three services:

- **Frontend**: Handles the user interface, interview flow, code editor, voice recording, and results pages.
- **Backend**: Handles authentication, session management, database operations, and communication with the AI service.
- **AI Service**: Generates interview questions, transcribes voice answers, and evaluates responses using AI.

````

## Project Structure

```bash
AI_INTERVIEWER/
├── ai-service/
├── backend/
├── frontend/
├── README.md
└── .gitignore
````

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/AI-Interviewer.git
cd AI-Interviewer
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

### 3. AI service setup

```bash
cd ../ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `ai-service` folder:

```env
AI_SERVICE_PORT=8000
GEMINI_MODEL_NAME=gemini-3.1-flash-lite
GEMINI_API_KEY=your_gemini_api_key
```

Start the AI service:

```bash
python main.py
```

### 4. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the frontend:

```bash
npm run dev
```

## Important Setup Notes

* FFmpeg must be installed and available in system PATH for voice transcription.
* The same Google Client ID should be used in both backend and frontend `.env` files.
* Do not commit `.env` files or `venv` to GitHub.
* Make sure the backend and AI service are both running before starting an interview.

## Interview Flow

1. User logs in or registers.
2. User selects role, level, number of questions, and interview type.
3. The AI service generates interview questions.
4. The user answers through voice and/or code.
5. The backend sends the answer to the AI service for transcription and evaluation.
6. Feedback, scores, and ideal answers are stored in MongoDB.
7. The user can review the full session after completion.

## Deployment

The project is designed to be deployed in three parts:

* Frontend: Vercel
* Backend: Render
* AI Service: Render

The AI service uses Whisper and FFmpeg, so deployment should ensure those dependencies are available in the runtime environment.

## Challenges Solved During Development

* Fixed Python FFmpeg path issues for Whisper transcription
* Solved Gemini quota limitations by moving to a higher-RPD model
* Corrected question-type mapping between frontend/backend and AI service
* Fixed interview completion flow
* Added Google login
* Improved AI evaluation scoring consistency

## Future Improvements

* Batch evaluation to reduce API calls per interview
* Additional interview roles
* Better analytics on performance trends
* Optional custom timer and proctoring features

## License

This project is open for educational and demonstration purposes.

