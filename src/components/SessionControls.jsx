export default function SessionControls({ sessionState, onStart, onStop, seconds }) {
  const isRecording = sessionState === 'recording';
  return (
    <div className="card controls-card">
      <div className="controls-buttons">
        <button className="btn btn-primary" onClick={onStart} disabled={isRecording}>
          {isRecording ? <><span className="rec-dot" /> Recording…</> : '▶ Start Session'}
        </button>
        <button className="btn btn-danger" onClick={onStop} disabled={!isRecording}>
          ■ Stop
        </button>
      </div>
      <div className={`timer-display${isRecording ? ' recording' : ''}`}>
        {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
      </div>
    </div>
  );
}
