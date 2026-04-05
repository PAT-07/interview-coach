export default function TopHeader({ sessionState }) {
  const statusMap = {
    idle:      { label: 'Idle',      dot: 'bg-slate-400' },
    recording: { label: 'Recording', dot: 'bg-red-500 blink' },
    stopped:   { label: 'Stopped',   dot: 'bg-amber-400' },
  };
  const { label, dot } = statusMap[sessionState] ?? statusMap.idle;

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-base font-semibold text-slate-800">Practice Session</h1>
        <p className="text-xs text-slate-400">Behavioral Interview Training</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <span className="text-xs font-medium text-slate-600">{label}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">U</div>
      </div>
    </header>
  );
}
