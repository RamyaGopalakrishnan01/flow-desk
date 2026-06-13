import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Filter, Edit2, Trash2, Check, X, ChevronDown } from 'lucide-react';

const CATS = ['Work', 'Learning', 'Health', 'Personal', 'Other'];
const PRIOS = ['High', 'Medium', 'Low'];

function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(task || { title: '', category: 'Work', priority: 'Medium', dueDate: '', notes: '' });
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-slate-900 dark:text-white">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <div><label className="label">Title</label><input className="input" placeholder="What needs to be done?" value={form.title} onChange={f('title')} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Category</label>
              <select className="input" value={form.category} onChange={f('category')}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={f('priority')}>
                {PRIOS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div><label className="label">Due Date</label><input type="date" className="input" value={form.dueDate} onChange={f('dueDate')} /></div>
          <div><label className="label">Notes</label><textarea className="input resize-none" rows={3} placeholder="Additional notes..." value={form.notes} onChange={f('notes')} /></div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => { if (form.title.trim()) { onSave(form); onClose(); } }} className="btn-primary flex-1">
            {task ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const { tasks, addTask, editTask, deleteTask, toggleTask } = useApp();
  const [modal, setModal] = useState(null); // null | 'new' | task object
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ status: 'all', priority: 'all', category: 'all' });
  const [sort, setSort] = useState('created');

  const filtered = tasks
    .filter(t => {
      if (filter.status !== 'all' && t.status !== filter.status) return false;
      if (filter.priority !== 'all' && t.priority !== filter.priority) return false;
      if (filter.category !== 'all' && t.category !== filter.category) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'created') return b.createdAt.localeCompare(a.createdAt);
      if (sort === 'due') return (a.dueDate || 'z').localeCompare(b.dueDate || 'z');
      if (sort === 'priority') return PRIOS.indexOf(a.priority) - PRIOS.indexOf(b.priority);
      return 0;
    });

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      {modal && (
        <TaskModal
          task={modal === 'new' ? null : modal}
          onSave={(data) => modal === 'new' ? addTask(data) : editTask(modal.id, data)}
          onClose={() => setModal(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{tasks.filter(t => t.status === 'pending').length} pending · {tasks.filter(t => t.status === 'completed').length} completed</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2">
          <Search size={16} className="text-slate-400 flex-shrink-0" />
          <input className="bg-transparent text-sm flex-1 outline-none text-slate-700 dark:text-slate-300 placeholder-slate-400" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'status', opts: ['all', 'pending', 'completed'] },
            { key: 'priority', opts: ['all', ...PRIOS] },
            { key: 'category', opts: ['all', ...CATS] },
          ].map(({ key, opts }) => (
            <select key={key} className="input text-xs py-2 w-auto" value={filter[key]} onChange={e => setFilter(f => ({ ...f, [key]: e.target.value }))}>
              {opts.map(o => <option key={o} value={o}>{key === 'status' || o === 'all' ? o.charAt(0).toUpperCase() + o.slice(1) : o}</option>)}
            </select>
          ))}
          <select className="input text-xs py-2 w-auto" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="created">Sort: Latest</option>
            <option value="due">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
          </select>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-slate-500 dark:text-slate-400">No tasks match your filters</p>
          </div>
        )}
        {filtered.map(task => (
          <div key={task.id} className={`card p-4 flex items-start gap-3 group hover:shadow-md transition-all ${task.status === 'completed' ? 'opacity-60' : ''}`}>
            <button onClick={() => toggleTask(task.id)} className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-brand-500'}`}>
              {task.status === 'completed' && <Check size={10} />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{task.title}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => setModal(task)} className="btn-ghost p-1"><Edit2 size={14} /></button>
                  <button onClick={() => deleteTask(task.id)} className="btn-ghost p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={task.priority === 'High' ? 'badge-high' : task.priority === 'Medium' ? 'badge-medium' : 'badge-low'}>{task.priority}</span>
                <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg">{task.category}</span>
                {task.dueDate && <span className="text-xs text-slate-400">Due {task.dueDate}</span>}
              </div>
              {task.notes && <p className="text-xs text-slate-400 mt-1 truncate">{task.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
