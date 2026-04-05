import { useEffect, useRef } from 'react';

export default function ChatPanel({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col" style={{ minHeight: '220px', maxHeight: '320px' }}>
      <div className="px-5 py-3 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conversation</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400 italic text-center mt-6">Generate a question to begin…</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col gap-0.5 fade-in ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'ai'
                ? 'bg-indigo-50 text-indigo-900 rounded-tl-sm'
                : 'bg-indigo-600 text-white rounded-tr-sm'}`}>
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
