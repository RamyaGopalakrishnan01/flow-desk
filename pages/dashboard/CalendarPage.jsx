import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarPage() {
  const { tasks, goals } = useApp();
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(null);

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  const nav = (d) => setView(v => {
    let m = v.month + d, y = v.year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    return { year: y, month: m };
  });

  const getDateStr = (d) => `${view.year}-${String(view.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const getEvents = (d) => {
    const ds = getDateStr(d);
    return [
      ...tasks.filter(t => t.dueDate === ds).map(t => ({ ...t, type: 'task' })),
      ...goals.filter(g => g.target === ds).map(g => ({ ...g, type: 'goal' })),
    ];
  };

  const selectedEvents = selected ? getEvents(selected) : [];
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Calendar</h1>

      <div className="card p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-xl text-slate-900 dark:text-white">{MONTHS[view.month]} {view.year}</h2>
          <div className="flex gap-2">
            <button onClick={() => nav(-1)} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
            <button onClick={() => setView({ year: today.getFullYear(), month: today.getMonth() })} className="btn-secondary text-sm px-3">Today</button>
            <button onClick={() => nav(1)} className="btn-ghost p-2"><ChevronRight size={18} /></button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => <div key={d} className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 py-2">{d}</div>)}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
            const evs = getEvents(d);
            const ds = getDateStr(d);
            const isToday = ds === todayStr;
            const isSel = selected === d;
            return (
              <button
                key={d}
                onClick={() => setSelected(selected === d ? null : d)}
                className={`relative aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl text-sm font-medium transition-all ${isToday ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30' : isSel ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                {d}
                {evs.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center px-1">
                    {evs.slice(0, 3).map((ev, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white/70' : ev.type === 'task' ? (ev.priority === 'High' ? 'bg-red-500' : 'bg-brand-500') : 'bg-violet-500'}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          {[['bg-red-500', 'High Priority Task'], ['bg-brand-500', 'Task'], ['bg-violet-500', 'Goal'], ['bg-brand-600', 'Today']].map(([c, l]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className={`w-2.5 h-2.5 rounded-full ${c}`} />{l}
            </div>
          ))}
        </div>
      </div>

      {/* Selected day */}
      {selected && (
        <div className="card p-5 animate-slide-up">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            {MONTHS[view.month]} {selected}, {view.year}
          </h3>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-slate-400">No events on this day</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map(ev => (
                <div key={ev.id} className={`flex items-center gap-3 p-3 rounded-xl ${ev.type === 'task' ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/30' : 'bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-900/30'}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ev.type === 'task' ? (ev.priority === 'High' ? 'bg-red-500' : 'bg-brand-500') : 'bg-violet-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{ev.title}</p>
                    <p className="text-xs text-slate-400">{ev.type === 'task' ? `Task · ${ev.priority} priority · ${ev.category}` : `Goal · ${ev.progress}% progress`}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
