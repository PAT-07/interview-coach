# Implementation Plan: Interview Coach

## Overview

Build a two-process local web app: a React (Vite) frontend and a Node.js/Express backend. The backend handles all AWS communication (Bedrock for question generation and feedback, Transcribe Streaming for speech-to-text). The frontend communicates via two REST endpoints and one WebSocket connection.

## Tasks

- [x] 1. Initialize project structure
  - Create `package.json` for the backend in `server/` with dependencies: `express`, `ws`, `@aws-sdk/client-bedrock-runtime`, `@aws-sdk/client-transcribe-streaming`
  - Create `package.json` for the frontend using Vite + React (`npm create vite`)
  - Configure Vite `server.proxy` to forward `/api/*` (HTTP) and `/transcribe` (WS) to `localhost:3001`
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 2. Implement backend entry point and env validation
  - [x] 2.1 Create `server/index.js` with Express app setup, HTTP server, and env validation
    - Validate `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` at startup; log missing variable names and call `process.exit(1)` if absent
    - Mount `ws` WebSocket server on the HTTP server at path `/transcribe`
    - Read `PORT` from env, default to `3001`
    - _Requirements: 6.4, 6.5, 6.6_
  - [ ] 2.2 Write property test for env validation (Property 10)
    - **Property 10: Missing required environment variable causes startup failure**
    - **Validates: Requirements 6.6**

- [x] 3. Implement Bedrock service
  - [x] 3.1 Create `server/services/bedrock.js` with `BedrockRuntimeClient` wrapper
    - Export `generateQuestion()`: calls `ConverseCommand` with `amazon.nova-pro-v1:0`, prompt instructs model to return one behavioral question for college students/entry-level candidates from the required categories
    - Export `analyzeFeedback(question, transcript)`: calls `ConverseCommand`, prompt instructs model to return a JSON object matching `FeedbackReport`; parse response with `JSON.parse`
    - Use `inferenceConfig: { maxTokens: 512, temperature: 0.7 }`
    - Catch and re-throw errors with descriptive messages
    - _Requirements: 1.1, 1.2, 1.3, 4.2, 4.3, 4.4, 4.6, 6.4_

- [x] 4. Implement question and feedback routes
  - [x] 4.1 Create `server/routes/question.js` — `POST /api/question` handler
    - Call `generateQuestion()`, return `{ question }` on success
    - Catch errors, return HTTP 500 with `{ error: err.message }`
    - _Requirements: 1.1, 1.4, 1.5, 6.1_
  - [x] 4.2 Create `server/routes/feedback.js` — `POST /api/feedback` handler
    - Accept `{ question, transcript }` from request body
    - Call `analyzeFeedback(question, transcript)`, return `{ feedback }` on success
    - Catch errors, return HTTP 500 with `{ error: err.message }`
    - _Requirements: 4.1, 4.2, 4.5, 4.7, 6.2_
  - [x] 4.3 Mount both routes in `server/index.js` with `express.json()` middleware
    - _Requirements: 6.1, 6.2_

- [x] 5. Implement Transcribe streaming service and WebSocket bridge
  - [x] 5.1 Create `server/services/transcribe.js`
    - Export `startTranscriptionSession(ws)`: creates `TranscribeStreamingClient`, calls `StartStreamTranscriptionCommand` with `LanguageCode: 'en-US'`, `MediaSampleRateHertz: 44100`, `MediaEncoding: 'pcm'`
    - Pipe incoming binary WS frames to the Transcribe input stream
    - Forward partial and final transcript segments as JSON text frames `{ type: 'transcript', text, isFinal }` to the WS client
    - On Transcribe stream error, send `{ type: 'error', message }` over WS and close the connection
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.3, 6.5_
  - [x] 5.2 Wire WebSocket server in `server/index.js` to call `startTranscriptionSession(ws)` on each connection
    - _Requirements: 3.1, 6.3_

- [x] 6. Checkpoint — backend complete
  - Verify `POST /api/question` and `POST /api/feedback` respond correctly with mocked AWS credentials
  - Verify WebSocket endpoint at `/transcribe` accepts connections
  - Ask the user if questions arise before proceeding to frontend.

- [x] 7. Implement frontend hooks
  - [x] 7.1 Create `src/hooks/useQuestion.js`
    - Manage `question`, `loading`, `error` state
    - Export `fetchQuestion()`: calls `POST /api/question`, sets question on success, sets error on failure, disables re-entrant calls while loading
    - _Requirements: 1.1, 1.4, 1.5, 1.6_
  - [x] 7.2 Create `src/hooks/useFeedback.js`
    - Manage `feedback`, `loading`, `error` state
    - Export `fetchFeedback(question, transcript)`: calls `POST /api/feedback`, sets feedback on success, sets error on failure
    - _Requirements: 4.1, 4.5, 4.7_
  - [x] 7.3 Create `src/hooks/useSession.js`
    - Manage `sessionState` (`'idle' | 'recording' | 'stopped'`), `transcript`, `error` state
    - `startSession()`: requests microphone access, creates `MediaRecorder` with `timeslice` ≤ 250 ms, opens WebSocket to `/transcribe`, streams audio chunks as binary frames, accumulates transcript segments from WS messages
    - `stopSession()`: stops `MediaRecorder`, closes WebSocket, transitions to `'stopped'`
    - On microphone denial: set error, stay in `'idle'`
    - On unexpected WS close: set transcription error, transition to `'stopped'`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.5, 3.6, 3.7_

- [x] 8. Implement frontend components
  - [x] 8.1 Create `src/components/Timer.jsx`
    - Accept `seconds` prop, render elapsed time as `MM:SS` with zero-padding
    - _Requirements: 2.3_
  - [x] 8.2 Create `src/components/QuestionPanel.jsx`
    - Display question text or placeholder; show error if present
    - Render "Generate Question" button, disabled while `loading` is true
    - _Requirements: 1.4, 1.5, 1.6, 5.1, 5.5_
  - [x] 8.3 Create `src/components/SessionControls.jsx`
    - Render "Start Practice Session" button (disabled when `sessionState === 'recording'`)
    - Render "Stop Session" button (disabled when `sessionState !== 'recording'`)
    - _Requirements: 2.1, 2.4, 2.5, 2.6, 5.1_
  - [x] 8.4 Create `src/components/TranscriptionDisplay.jsx`
    - Display accumulated transcript text; show placeholder when empty; show error if present
    - _Requirements: 3.5, 3.6, 3.7, 5.1, 5.5_
  - [x] 8.5 Create `src/components/FeedbackPanel.jsx`
    - Render `FeedbackReport`: per-STAR-component presence indicators, strengths, areas for improvement, actionable tips list
    - Show placeholder when no feedback; show "no speech detected" message when applicable; show error if present
    - _Requirements: 4.3, 4.4, 4.5, 4.7, 4.8, 5.1, 5.5_

- [x] 9. Implement App.jsx and wire everything together
  - [x] 9.1 Create `src/App.jsx` as root layout
    - Compose `useQuestion`, `useSession`, `useFeedback` hooks
    - Pass state and callbacks as props to all components
    - On session stop with non-empty transcript: call `fetchFeedback(question, transcript)`
    - On session stop with empty transcript: set feedback panel to "no speech detected" state
    - On new question generated: clear transcript and feedback state
    - Render `QuestionPanel`, `SessionControls`, `Timer`, `TranscriptionDisplay`, `FeedbackPanel` in a single-page layout
    - _Requirements: 4.1, 4.8, 5.1, 5.6_
  - [x] 9.2 Apply black and white minimalist CSS
    - Use only black, white, and greyscale tones
    - Add adequate white space between major components
    - Optimize layout for viewport widths ≥ 1024px
    - _Requirements: 5.2, 5.3, 5.4_

- [x] 10. Final checkpoint — Ensure all tests pass
  - Verify the full session flow: generate question → start session → speak → stop session → feedback appears
  - Confirm timer counts in MM:SS, buttons enable/disable correctly, transcript is retained after stop, new question clears transcript and feedback
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped
- No test infrastructure is required per project constraints; property test sub-tasks document intended future tests only
- All AWS credentials are loaded from environment variables; no hardcoded credentials
- The Vite proxy eliminates any CORS concerns between frontend and backend
