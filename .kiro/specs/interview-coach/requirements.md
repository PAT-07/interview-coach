# Requirements Document

## Introduction

An AI-powered interview coach web application that helps college students and entry-level candidates practice behavioral interview questions using the STAR format (Situation, Task, Action, Result). The application generates realistic behavioral questions, records and transcribes the user's spoken response in real time, and provides structured AI-generated feedback on STAR format compliance. The application is a lightweight, local-only, single-user tool with no authentication or data persistence.

## Glossary

- **Application**: The full-stack interview coach web application consisting of a React frontend and Node.js/Express backend.
- **Question_Generator**: The backend service that calls AWS Bedrock to produce a behavioral interview question.
- **Transcription_Service**: The backend service that streams audio to AWS Transcribe via WebSocket and returns live transcription text.
- **Feedback_Analyzer**: The backend service that calls AWS Bedrock to analyze a transcribed response for STAR format compliance.
- **STAR_Format**: A structured response framework consisting of four components: Situation, Task, Action, and Result.
- **Practice_Session**: A single recording session that begins when the user clicks "Start Practice Session" and ends when the user clicks "Stop Session".
- **Bedrock_Client**: The AWS SDK client used to invoke the Amazon Nova Pro model (`amazon.nova-pro-v1:0`) in region `us-east-1`.
- **Transcribe_Client**: The AWS SDK client used to stream audio to Amazon Transcribe Streaming in region `us-east-1`.
- **WebSocket_Server**: The server-side WebSocket endpoint that proxies audio chunks from the browser to the Transcribe_Client and forwards transcription results back to the browser.
- **Transcript**: The full text produced by the Transcription_Service for a single Practice_Session.
- **Feedback_Report**: The structured output from the Feedback_Analyzer containing STAR component analysis, strengths, areas for improvement, and actionable tips.

---

## Requirements

### Requirement 1: Question Generation

**User Story:** As a college student, I want to receive a realistic behavioral interview question, so that I have a relevant prompt to practice my response.

#### Acceptance Criteria

1. WHEN the user clicks "Generate Question", THE Question_Generator SHALL call the Bedrock_Client with the `amazon.nova-pro-v1:0` model to produce one behavioral interview question.
2. THE Question_Generator SHALL generate questions that belong to one of the following categories: leadership, teamwork, conflict resolution, problem-solving, failure/learning, or time management.
3. THE Question_Generator SHALL generate questions that are appropriate in scope and language for college students and entry-level candidates.
4. WHEN the Bedrock_Client returns a question, THE Application SHALL display the question text in the question display area within 10 seconds of the user clicking "Generate Question".
5. IF the Bedrock_Client returns an error, THEN THE Application SHALL display a descriptive error message in the question display area and leave the previous question (if any) unchanged.
6. WHILE a question is being generated, THE Application SHALL disable the "Generate Question" button to prevent duplicate requests.

---

### Requirement 2: Practice Session Lifecycle

**User Story:** As a college student, I want to start and stop a timed recording session, so that I can control when my answer is captured.

#### Acceptance Criteria

1. WHEN the user clicks "Start Practice Session", THE Application SHALL request microphone access from the browser and begin capturing audio.
2. IF the user denies microphone access, THEN THE Application SHALL display a descriptive error message and keep the session in the stopped state.
3. WHEN a Practice_Session is active, THE Application SHALL display a session timer showing elapsed time in MM:SS format, updated every second.
4. WHEN the user clicks "Stop Session", THE Application SHALL stop audio capture and end the Practice_Session.
5. WHILE a Practice_Session is active, THE Application SHALL disable the "Start Practice Session" button and enable the "Stop Session" button.
6. WHILE no Practice_Session is active, THE Application SHALL enable the "Start Practice Session" button and disable the "Stop Session" button.
7. THE Application SHALL allow the user to start a new Practice_Session after a previous session has ended.

---

### Requirement 3: Real-Time Transcription

**User Story:** As a college student, I want to see a live transcription of my spoken words as I practice, so that I can confirm my answer is being captured correctly.

#### Acceptance Criteria

1. WHEN a Practice_Session begins, THE Application SHALL open a WebSocket connection to the WebSocket_Server.
2. WHILE a Practice_Session is active, THE Application SHALL stream audio chunks from the microphone to the WebSocket_Server at a consistent interval not exceeding 250 milliseconds per chunk.
3. WHILE a Practice_Session is active, THE Transcription_Service SHALL forward audio chunks to the Transcribe_Client using the Amazon Transcribe Streaming API in region `us-east-1`.
4. WHEN the Transcribe_Client returns a partial or final transcript segment, THE WebSocket_Server SHALL forward the text to the Application over the WebSocket connection.
5. WHEN the Application receives a transcript segment, THE Application SHALL update the live transcription display area with the accumulated transcript text within 500 milliseconds of receipt.
6. WHEN the user clicks "Stop Session", THE Application SHALL close the WebSocket connection and retain the final accumulated Transcript in the transcription display area.
7. IF the WebSocket connection is lost during a Practice_Session, THEN THE Application SHALL display a descriptive error message in the transcription display area.

---

### Requirement 4: AI Coach Feedback

**User Story:** As a college student, I want to receive structured feedback on my STAR format compliance after I finish practicing, so that I know what to improve.

#### Acceptance Criteria

1. WHEN a Practice_Session ends and a non-empty Transcript is available, THE Application SHALL automatically submit the Transcript and the current question to the Feedback_Analyzer.
2. THE Feedback_Analyzer SHALL call the Bedrock_Client with the `amazon.nova-pro-v1:0` model to analyze the Transcript for STAR format compliance.
3. THE Feedback_Analyzer SHALL identify which of the four STAR components (Situation, Task, Action, Result) are present and which are missing in the Transcript.
4. THE Feedback_Analyzer SHALL produce a Feedback_Report containing: a per-component presence indicator for each STAR component, a Strengths section describing what the user did well, an Areas for Improvement section describing specific gaps, and an Actionable Tips section containing 2 to 3 concrete suggestions.
5. WHEN the Feedback_Analyzer returns a Feedback_Report, THE Application SHALL display the Feedback_Report in the feedback panel within 15 seconds of the Practice_Session ending.
6. THE Feedback_Analyzer SHALL use an encouraging, coach-like tone in all generated text within the Feedback_Report.
7. IF the Bedrock_Client returns an error during feedback analysis, THEN THE Application SHALL display a descriptive error message in the feedback panel.
8. IF the Practice_Session ends with an empty Transcript, THEN THE Application SHALL display a message in the feedback panel informing the user that no speech was detected and feedback cannot be generated.

---

### Requirement 5: User Interface Layout and Design

**User Story:** As a college student, I want a clean, easy-to-navigate interface, so that I can focus on practicing without distraction.

#### Acceptance Criteria

1. THE Application SHALL render a single-page layout containing: a question display area, a "Generate Question" button, a "Start Practice Session" button, a "Stop Session" button, a live transcription display area, a session timer display, and a feedback panel.
2. THE Application SHALL apply a black and white color scheme using only black, white, and greyscale tones throughout the interface.
3. THE Application SHALL use a minimalist design with adequate white space between all major components.
4. THE Application SHALL be optimized for laptop screen sizes (viewport widths of 1024px and above).
5. WHEN no Practice_Session has been started, THE Application SHALL display the transcription display area and feedback panel in an empty state with placeholder text.
6. WHEN a new question is generated, THE Application SHALL clear the transcription display area and the feedback panel to reflect the start of a new practice cycle.

---

### Requirement 6: Backend API

**User Story:** As a developer, I want well-defined REST and WebSocket endpoints, so that the frontend and backend communicate reliably.

#### Acceptance Criteria

1. THE Application SHALL expose a REST endpoint `POST /api/question` that invokes the Question_Generator and returns a JSON response containing the generated question text.
2. THE Application SHALL expose a REST endpoint `POST /api/feedback` that accepts a JSON request body containing the question text and Transcript, invokes the Feedback_Analyzer, and returns a JSON response containing the Feedback_Report.
3. THE Application SHALL expose a WebSocket endpoint at `ws://localhost:{port}/transcribe` that accepts audio data from the client and streams transcription results back.
4. THE Bedrock_Client SHALL load AWS credentials from environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` if present) and use region `us-east-1`.
5. THE Transcribe_Client SHALL load AWS credentials from environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` if present) and use region `us-east-1`.
6. IF a required environment variable is missing at startup, THEN THE Application SHALL log a descriptive error message to the console and exit.
