export default function VoicePanel({ sessionState, elapsed, onStart, onStop, error }) {
  const isRecording = sessionState === 'recording';
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Voice Control</span>
        {isRecording && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500 blink" /> Live
          </span>
        )}
      </div>

      {/* Mic button */}
      <div className="flex flex-col items-center gap-5 py-4">
        <div className="relative">
          {isRecording && (
            <>
              <span className="absolute inset-0 rounded-full bg-red-400/30 pulse-ring" />
              <span className="absolute inset-0 rounded-full bg-red-400/20 pulse-ring" style={{ animationDelay: '0.4s' }} />
            </>
          )}
          <button
            onClick={isRecording ? onStop : onStart}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg transition-all duration-200
              ${isRecording
                ? 'bg-red-500 hover:bg-red-600 scale-110'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'}`}
          >
            {isRecording ? '■' : '🎙'}
          </button>
        </div>

        {/* Timer */}
        <div className={`font-mono text-3xl font-bold tabular-nums ${isRecording ? 'text-red-500' : 'text-slate-300'}`}>
          {mm}:{ss}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onStart}
            disabled={isRecording}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            ▶ Start
          </button>
          <button
            onClick={onStop}
            disabled={!isRecording}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors"
          >
            ■ Stop
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mt-2">{error}</p>}
    </div>
  );
}
