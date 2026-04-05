const NAV = [
  { icon: '⊞', label: 'Dashboard', active: false },
  { icon: '🎙', label: 'Practice Sessions', active: true },
  { icon: '📋', label: 'History', active: false },
  { icon: '⚙', label: 'Settings', active: false },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col py-6 px-3 shrink-0">
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">IC</div>
        <span className="font-bold text-slate-800 text-sm">Interview Coach</span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ icon, label, active }) => (
          <button
            key={label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left w-full
              ${active
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
      <div className="mt-auto px-3">
        <div className="rounded-xl bg-indigo-50 p-3 text-xs text-indigo-700">
          <p className="font-semibold mb-1">Pro Tip</p>
          <p className="text-indigo-500 leading-relaxed">Use the STAR method for structured, compelling answers.</p>
        </div>
      </div>
    </aside>
  );
}
