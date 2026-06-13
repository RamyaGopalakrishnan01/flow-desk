import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, X, CheckCircle, Target } from 'lucide-react';

const CATS = ['Career', 'Health', 'Learning', 'Personal', 'Tech', 'Finance', 'Other'];
const COLOR_MAP = { Career: 'brand', Health: 'emerald', Learning: 'violet', Personal: 'amber', Tech: 'blue', Finance: 'rose', Other: 'slate' };

function GoalModal({ goal, onSave, onClose }) {
  const [form, setForm] = useState(goal || { title: '', description: '', category: 'Career', target: '', progress: 0 });
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-slate-900 dark:text-white">{goal ? 'Edit Goal' : 'New Goal'}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <div><label className="label">Goal Title</label><input className="input" placeholder="What do you want to achieve?" value={form.title} onChange={f('title')} /></div>
          <div><label className="label">Description</label><textarea className="input resize-none" rows={2} placeholder="Describe your goal..." value={form.description} onChange={f('description')} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Category</label>
              <select className="input" value={form.category} onChange={f('category')}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="label">Target Date</label><input type="date" className="input" value={form.target} onChange={f('target')} /></div>
          </div>
          {goal && (
            <div>
              <label className="label">Progress ({form.progress}%)</label>
              <input type="range" min={0} max={100} className="w-full accent-brand-600" value={form.progress} onChange={f('progress')} />
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => { if (form.title.trim()) { onSave({ ...form, progress: Number(form.progress) }); onClose(); } }} className="btn-primary flex-1">
            {goal ? 'Save Changes' : 'Create Goal'}
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalCard({ goal, onEdit, onDelete, onComplete }) {
  const c = COLOR_MAP[goal.category] || 'slate';
  const colorsMap = {
    brand: 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
    slate: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  };
  const barColors = {
    brand: 'from-brand-500 to-brand-400', emerald: 'from-emerald-500 to-emerald-400',
    violet: 'from-violet-500 to-violet-400', amber: 'from-amber-500 to-amber-400',
    blue: 'from-blue-500 to-blue-400', rose: 'from-rose-500 to-rose-400', slate: 'from-slate-500 to-slate-400',
  };
  return (
    <div className={`card p-5 group ${goal.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${colorsMap[c]}`}>{goal.category}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(goal)} className="btn-ghost p-1.5"><Edit2 size={14} /></button>
          <button onClick={() => onComplete(goal.id)} className="btn-ghost p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" title="Mark complete"><CheckCircle size={14} /></button>
          <button onClick={() => onDelete(goal.id)} className="btn-ghost p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={14} /></button>
        </div>
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{goal.title}</h3>
      {goal.description && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{goal.description}</p>}
      <div className="space-y-1.5 mt-4">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Progress</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{goal.progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${barColors[c]} rounded-full transition-all duration-700`} style={{ width: `${goal.progress}%` }} />
        </div>
      </div>
      {goal.target && <p className="text-xs text-slate-400 mt-2">Target: {goal.target}</p>}
      {goal.status === 'completed' && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle size={14} /> Goal Achieved!
        </div>
      )}
    </div>
  );
}

export default function GoalsPage() {
  const { goals, addGoal, editGoal, deleteGoal } = useApp();
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState('active');

  const shown = goals.filter(g => tab === 'active' ? g.status === 'active' : g.status === 'completed');

  const handleComplete = (id) => editGoal(id, { status: 'completed', progress: 100 });

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      {modal && (
        <GoalModal
          goal={modal === 'new' ? null : modal}
          onSave={(data) => modal === 'new' ? addGoal(data) : editGoal(modal.id, data)}
          onClose={() => setModal(null)}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Goals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{goals.filter(g => g.status === 'active').length} active · {goals.filter(g => g.status === 'completed').length} achieved</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Overall progress */}
      <div className="card p-5 flex items-center gap-6">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-700" />
            <circle cx="32" cy="32" r="26" fill="none" stroke="url(#goalGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 26}`}
              strokeDashoffset={`${2 * Math.PI * 26 * (1 - goals.filter(g => g.status === 'completed').length / Math.max(goals.length, 1))}`}
              className="transition-all duration-700"
            />
            <defs><linearGradient id="goalGrad" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient></defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
            {Math.round(goals.filter(g => g.status === 'completed').length / Math.max(goals.length, 1) * 100)}%
          </span>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">Overall Goal Completion</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{goals.filter(g => g.status === 'completed').length} of {goals.length} goals achieved</p>
        </div>
        <div className="ml-auto flex gap-6 text-center hidden sm:flex">
          {[{ v: goals.filter(g => g.status === 'active').length, l: 'Active' }, { v: goals.filter(g => g.status === 'completed').length, l: 'Done' }].map(({ v, l }) => (
            <div key={l}><div className="font-display font-bold text-2xl text-slate-900 dark:text-white">{v}</div><div className="text-xs text-slate-400">{l}</div></div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {['active', 'completed'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? 'bg-brand-600 text-white' : 'btn-secondary'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)} ({goals.filter(g => g.status === t).length})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="card p-12 text-center">
          <Target size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No {tab} goals yet. {tab === 'active' ? 'Create your first goal!' : ''}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map(goal => (
            <GoalCard key={goal.id} goal={goal} onEdit={setModal} onDelete={deleteGoal} onComplete={handleComplete} />
          ))}
        </div>
      )}
    </div>
  );
}
