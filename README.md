# Interview Coach

An AI-powered behavioral interview practice app built with React, Node.js, and AWS.

## What it does

- Generates realistic behavioral interview questions using Amazon Bedrock (Nova Pro)
- Records your spoken answer via microphone
- Transcribes your response in real time using Amazon Transcribe Streaming
- Analyzes your answer for STAR format compliance and returns structured AI feedback

## Tech Stack

| Layer    | Technology                            |
| -------- | ------------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS          |
| Backend  | Node.js, Express, ws                  |
| AI       | Amazon Bedrock (amazon.nova-pro-v1:0) |
| Speech   | Amazon Transcribe Streaming           |

## Project Structure

```
interview-coach/
├── server/                  # Express backend
│   ├── index.js             # Entry point, env validation, WS server
│   ├── routes/
│   │   ├── question.js      # POST /api/question
│   │   └── feedback.js      # POST /api/feedback
│   └── services/
│       ├── bedrock.js       # Bedrock client wrapper
│       └── transcribe.js    # Transcribe streaming bridge
├── src/                     # React frontend
│   ├── App.jsx
│   ├── hooks/
│   │   ├── useQuestion.js
│   │   ├── useFeedback.js
│   │   └── useSession.js
│   └── components/
│       ├── TopHeader.jsx
│       ├── QuestionPanel.jsx
│       ├── VoicePanel.jsx
│       ├── ChatPanel.jsx
│       └── FeedbackPanel.jsx
├── index.html
├── vite.config.js
└── package.json
```

## Prerequisites

- Node.js 18+
- AWS account with access to:
  - Amazon Bedrock (model: `amazon.nova-pro-v1:0` in `us-east-1`)
  - Amazon Transcribe Streaming (`transcribe:StartStreamTranscription`)

## Setup

### 1. Install dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### 2. Configure AWS credentials

```powershell
# PowerShell
$env:AWS_ACCESS_KEY_ID="your_access_key"
$env:AWS_SECRET_ACCESS_KEY="your_secret_key"
$env:AWS_SESSION_TOKEN="your_session_token"   # if using temporary credentials
```

### 3. Run the app

Open two terminals:

```bash
# Terminal 1 — backend (from server/)
node index.js

# Terminal 2 — frontend (from project root)
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Usage

1. Click **Generate Question** to get a behavioral interview question
2. Click **Start Session** (or the mic button) to begin recording
3. Speak your answer — the transcript appears in real time
4. Click **Stop** when done
5. AI feedback appears automatically with STAR analysis and a score

## Environment Variables

| Variable                | Required | Description                        |
| ----------------------- | -------- | ---------------------------------- |
| `AWS_ACCESS_KEY_ID`     | Yes      | AWS credential                     |
| `AWS_SECRET_ACCESS_KEY` | Yes      | AWS credential                     |
| `AWS_SESSION_TOKEN`     | No       | Required for temporary credentials |
| `PORT`                  | No       | Backend port (default: 3001)       |

## License

MIT
