export default function QuestionPanel({ question, loading, error, onGenerate }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interview Question</span>
        <span className="text-xs bg-indigo-100 text-indigo-600 font-medium px-2 py-0.5 rounded-full">Behavioral</span>
      </div>
      <p className={`text-base leading-relaxed mb-4 min-h-[3rem] ${question ? 'text-slate-800 font-medium' : 'text-slate-400 italic'}`}>
        {question ?? 'Generate a question to get started…'}
      </p>
      {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>}
      <button
        onClick={onGenerate}
        disabled={loading}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
      >
        {loading
          ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full spin" /> Generating…</>
          : '✦ Generate Question'}
      </button>
    </div>
  );
}
