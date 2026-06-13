import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, X, Clock } from 'lucide-react';

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6);
const COLORS = ['brand', 'emerald', 'violet', 'amber', 'rose', 'blue', 'cyan'];
const COLOR_CLASSES = {
  brand: 'bg-brand-100 dark:bg-brand-900/40 border-brand-400 text-brand-800 dark:text-brand-200',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-800 dark:text-emerald-200',
  violet: 'bg-violet-100 dark:bg-violet-900/40 border-violet-400 text-violet-800 dark:text-violet-200',
  amber: 'bg-amber-100 dark:bg-amber-900/40 border-amber-400 text-amber-800 dark:text-amber-200',
  rose: 'bg-rose-100 dark:bg-rose-900/40 border-rose-400 text-rose-800 dark:text-rose-200',
  blue: 'bg-blue-100 dark:bg-blue-900/40 border-blue-400 text-blue-800 dark:text-blue-200',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/40 border-cyan-400 text-cyan-800 dark:text-cyan-200',
};

function AddPlanModal({ onSave, onClose }) {
  const [form, setForm] = useState({ title: '', time: '09:00', duration: 60, color: 'brand', date: new Date().toISOString().split('T')[0] });
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Add to Planner</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <div><label className="label">Activity Title</label><input className="input" placeholder="What are you working on?" value={form.title} onChange={f('title')} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Date</label><input type="date" className="input" value={form.date} onChange={f('date')} /></div>
            <div><label className="label">Start Time</label><input type="time" className="input" value={form.time} onChange={f('time')} /></div>
          </div>
          <div>
            <label className="label">Duration</label>
            <select className="input" value={form.duration} onChange={f('duration')}>
              {[15,30,45,60,90,120,180].map(d => <option key={d} value={d}>{d >= 60 ? `${d/60}h${d%60 ? ` ${d%60}m` : ''}` : `${d}m`}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Color</label>
            <div className="flex gap-2 mt-1">
              {COLORS.map(c => (
                <button key={c} onClick={() => setForm(p => ({ ...p, color: c }))} className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : ''}`}
                  style={{ backgroundColor: { brand: '#6366f1', emerald: '#10b981', violet: '#8b5cf6', amber: '#f59e0b', rose: '#f43f5e', blue: '#3b82f6', cyan: '#06b6d4' }[c] }} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => { if (form.title.trim()) { onSave(form); onClose(); } }} className="btn-primary flex-1">Add Block</button>
        </div>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  const { plans, addPlan, deletePlan } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const dayPlans = plans.filter(p => p.date === date).sort((a, b) => a.time.localeCompare(b.time));
  const totalMins = dayPlans.reduce((a, p) => a + Number(p.duration), 0);

  const timeToPos = (t) => {
    const [h, m] = t.split(':').map(Number);
    return ((h - 6) * 60 + m) / (16 * 60) * 100;
  };
  const durationToHeight = (d) => (Number(d) / (16 * 60)) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      {showModal && <AddPlanModal onSave={(p) => addPlan(p)} onClose={() => setShowModal(false)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Daily Planner</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{dayPlans.length} blocks · {totalMins >= 60 ? `${Math.floor(totalMins/60)}h ${totalMins%60}m` : `${totalMins}m`} planned</p>
        </div>
        <div className="flex gap-2 items-center">
          <input type="date" className="input text-sm py-2 w-auto" value={date} onChange={e => setDate(e.target.value)} />
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Block</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Timeline */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Time Blocks</h3>
          <div className="relative" style={{ height: `${HOURS.length * 60}px` }}>
            {/* Hour lines */}
            {HOURS.map((h, i) => (
              <div key={h} className="absolute left-0 right-0 border-t border-slate-100 dark:border-slate-800 flex items-center" style={{ top: `${i * 60}px` }}>
                <span className="text-xs text-slate-400 w-12 pr-2 text-right flex-shrink-0">{h}:00</span>
              </div>
            ))}
            {/* Plan blocks */}
            <div className="absolute left-14 right-0 top-0 bottom-0">
              {dayPlans.map(plan => {
                const top = timeToPos(plan.time);
                const height = durationToHeight(plan.duration);
                return (
                  <div
                    key={plan.id}
                    className={`absolute left-1 right-1 rounded-xl border-l-4 px-3 py-2 ${COLOR_CLASSES[plan.color] || COLOR_CLASSES.brand} overflow-hidden group`}
                    style={{ top: `${top}%`, height: `${Math.max(height, 2.5)}%` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{plan.title}</p>
                        <p className="text-xs opacity-70"><Clock size={10} className="inline mr-0.5" />{plan.time} · {plan.duration >= 60 ? `${Math.floor(plan.duration/60)}h${plan.duration%60 ? ` ${plan.duration%60}m` : ''}` : `${plan.duration}m`}</p>
                      </div>
                      <button onClick={() => deletePlan(plan.id)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-600 flex-shrink-0 transition-opacity">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Schedule list */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Today's Schedule</h3>
          {dayPlans.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-400">No blocks planned</p>
              <button onClick={() => setShowModal(true)} className="mt-3 text-sm text-brand-600 dark:text-brand-400 hover:underline">Plan your day →</button>
            </div>
          ) : (
            <div className="space-y-2">
              {dayPlans.map(plan => (
                <div key={plan.id} className={`p-3 rounded-xl border-l-4 ${COLOR_CLASSES[plan.color] || COLOR_CLASSES.brand} flex items-center justify-between gap-2`}>
                  <div>
                    <p className="text-sm font-medium">{plan.title}</p>
                    <p className="text-xs opacity-70">{plan.time} · {plan.duration}m</p>
                  </div>
                  <button onClick={() => deletePlan(plan.id)} className="p-1 hover:text-red-600 flex-shrink-0"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
          {dayPlans.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <div className="flex justify-between"><span>Blocks planned</span><strong className="text-slate-700 dark:text-slate-200">{dayPlans.length}</strong></div>
                <div className="flex justify-between mt-1"><span>Total time</span><strong className="text-slate-700 dark:text-slate-200">{Math.floor(totalMins/60)}h {totalMins%60}m</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
