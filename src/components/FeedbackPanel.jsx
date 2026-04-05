const STAR = [
  { key: 'situation', label: 'Situation' },
  { key: 'task',      label: 'Task' },
  { key: 'action',    label: 'Action' },
  { key: 'result',    label: 'Result' },
];

function ScoreBar({ score }) {
  const pct = Math.round((score / 10) * 100);
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-2xl font-bold text-indigo-600">{score}<span className="text-sm text-slate-400 font-normal">/10</span></span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function FeedbackPanel({ feedback, loading, error, noSpeech }) {
  // Compute a simple score from STAR presence
  const score = feedback
    ? (Object.values(feedback.star).filter(c => c.present).length / 4 * 10).toFixed(1)
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Coach Feedback</span>
        {feedback && <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">Analysis Complete</span>}
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-6 justify-center text-slate-500 text-sm">
          <span className="w-4 h-4 border-2 border-slate-200 border-t-indigo-500 rounded-full spin" />
          AI is analyzing your response…
        </div>
      )}

      {!loading && (error || noSpeech) && (
        <p className="text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-3">
          {noSpeech ? 'No speech detected — please try again.' : error}
        </p>
      )}

      {!loading && !error && !noSpeech && !feedback && (
        <p className="text-sm text-slate-400 italic text-center py-6">Feedback will appear after your session ends.</p>
      )}

      {!loading && feedback && (
        <div className="fade-in">
          <ScoreBar score={parseFloat(score)} />

          {/* STAR grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {STAR.map(({ key, label }) => {
              const c = feedback.star[key];
              return (
                <div key={key} className={`rounded-xl p-3 border ${c.present ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-sm ${c.present ? 'text-green-600' : 'text-amber-500'}`}>{c.present ? '✅' : '⚠️'}</span>
                    <span className="text-xs font-bold text-slate-700">{label}</span>
                  </div>
                  {c.notes && <p className="text-[11px] text-slate-500 leading-snug">{c.notes}</p>}
                </div>
              );
            })}
          </div>

          {/* Strengths */}
          <div className="mb-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Strengths</p>
            <p className="text-sm text-slate-700 leading-relaxed">{feedback.strengths}</p>
          </div>

          {/* Improvements */}
          <div className="mb-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Areas for Improvement</p>
            <p className="text-sm text-slate-700 leading-relaxed">{feedback.areasForImprovement}</p>
          </div>

          {/* Tips */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Actionable Tips</p>
            <ul className="flex flex-col gap-1.5">
              {feedback.actionableTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-indigo-50 rounded-xl px-3 py-2">
                  <span className="text-indigo-400 font-bold mt-0.5">{i + 1}.</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
