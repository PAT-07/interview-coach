export default function TranscriptionDisplay({ transcript, error }) {
  return (
    <div className="card">
      <div className="card-label">Live Transcription</div>
      {error && <div className="error-msg">{error}</div>}
      <p className={`transcript-text${transcript ? '' : ' placeholder'}`}>
        {transcript || 'Your spoken answer will appear here in real time…'}
      </p>
    </div>
  );
}
