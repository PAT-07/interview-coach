import { useState, useEffect, useRef } from 'react';
import { useQuestion } from './hooks/useQuestion';
import { useFeedback } from './hooks/useFeedback';
import { useSession } from './hooks/useSession';
import TopHeader from './components/TopHeader';
import QuestionPanel from './components/QuestionPanel';
import VoicePanel from './components/VoicePanel';
import ChatPanel from './components/ChatPanel';
import FeedbackPanel from './components/FeedbackPanel';
import './App.css';

export default function App() {
  const { question, loading: qLoading, error: qError, fetchQuestion } = useQuestion();
  const { feedback, loading: fbLoading, error: fbError, fetchFeedback, clearFeedback } = useFeedback();
  const { sessionState, transcript, error: sessError, startSession, stopSession, clearSession } = useSession();

  const [noSpeech, setNoSpeech] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const prevQuestion = useRef(null);
  const prevTranscript = useRef('');

  // Timer
  useEffect(() => {
    if (sessionState !== 'recording') return;
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [sessionState]);

  // Accumulate chat messages from transcript
  useEffect(() => {
    if (transcript && transcript !== prevTranscript.current) {
      prevTranscript.current = transcript;
    }
  }, [transcript]);

  // On session stop
  useEffect(() => {
    if (sessionState !== 'stopped') return;
    if (transcript?.trim()) {
      setNoSpeech(false);
      fetchFeedback(question, transcript);
      setChatMessages(prev => [
        ...prev,
        { role: 'user', text: transcript, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    } else {
      setNoSpeech(true);
    }
  }, [sessionState]); // eslint-disable-line

  // On new question
  useEffect(() => {
    if (!question || question === prevQuestion.current) return;
    prevQuestion.current = question;
    clearSession();
    clearFeedback();
    setNoSpeech(false);
    setElapsed(0);
    prevTranscript.current = '';
    setChatMessages([{
      role: 'ai',
      text: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  }, [question, clearSession, clearFeedback]);

  function handleStart() {
    setElapsed(0);
    setNoSpeech(false);
    startSession();
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <TopHeader sessionState={sessionState} />
      <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left column */}
            <div className="flex flex-col gap-5">
              <QuestionPanel
                question={question}
                loading={qLoading}
                error={qError}
                onGenerate={fetchQuestion}
              />
              <VoicePanel
                sessionState={sessionState}
                elapsed={elapsed}
                onStart={handleStart}
                onStop={stopSession}
                error={sessError}
              />
            </div>
            {/* Right column */}
            <div className="flex flex-col gap-5">
              <ChatPanel messages={chatMessages} />
              <FeedbackPanel
                feedback={feedback}
                loading={fbLoading}
                error={fbError}
                noSpeech={noSpeech}
              />
            </div>
          </div>
        </main>
    </div>
  );
}
