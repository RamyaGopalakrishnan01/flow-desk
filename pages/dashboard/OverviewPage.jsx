import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { CheckSquare, Target, Clock, TrendingUp, Plus, CalendarDays, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        {sub && <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">{sub}</span>}
      </div>
      <div className="font-display font-bold text-3xl text-slate-900 dark:text-white">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
    </div>
  );
}

export default function OverviewPage() {
  const { user, stats, tasks, goals } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.dueDate === today);
  const urgentTasks = tasks.filter(t => t.priority === 'High' && t.status === 'pending');
  const recentTasks = tasks.slice(0, 5);
  const activeGoals = goals.filter(g => g.status === 'active').slice(0, 3);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  const QUICK = [
    { label: 'Add Task', icon: Plus, to: '/dashboard/tasks', color: 'bg-brand-600 text-white hover:bg-brand-700' },
    { label: 'Add Goal', icon: Target, to: '/dashboard/goals', color: 'bg-violet-600 text-white hover:bg-violet-700' },
    { label: 'View Calendar', icon: CalendarDays, to: '/dashboard/calendar', color: 'bg-blue-600 text-white hover:bg-blue-700' },
    { label: 'AI Suggestions', icon: Sparkles, to: '/dashboard/ai', color: 'bg-amber-500 text-white hover:bg-amber-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Good {greeting}, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{today} · {todayTasks.length} tasks due today</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Tasks" value={stats.total} icon={CheckSquare} color="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400" />
        <StatCard label="Completed" value={stats.completed} icon={CheckSquare} color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" sub="✓" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" />
        <StatCard label="Goals Achieved" value={stats.goalsAchieved} icon={Target} color="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" />
        <div className="card p-5 col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
            <TrendingUp size={20} />
          </div>
          <div className="font-display font-bold text-3xl text-slate-900 dark:text-white">{stats.score}%</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Productivity Score</div>
          <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full transition-all duration-700" style={{ width: `${stats.score}%` }} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK.map(({ label, icon: Icon, to, color }) => (
            <Link key={label} to={to} className={`${color} p-4 rounded-xl flex flex-col gap-2 transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md`}>
              <Icon size={20} /><span className="text-sm font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><AlertCircle size={18} className="text-red-500" /><h3 className="font-semibold text-slate-900 dark:text-white">High Priority</h3></div>
            <Link to="/dashboard/tasks" className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {urgentTasks.length === 0 ? <div className="text-center py-8 text-slate-400 text-sm">🎉 No urgent tasks!</div> : (
            <div className="space-y-2">
              {urgentTasks.slice(0, 4).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.title}</p>
                    <p className="text-xs text-slate-400">Due {task.dueDate}</p>
                  </div>
                  <span className="badge-high">{task.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Target size={18} className="text-violet-500" /><h3 className="font-semibold text-slate-900 dark:text-white">Active Goals</h3></div>
            <Link to="/dashboard/goals" className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {activeGoals.length === 0 ? <div className="text-center py-8 text-slate-400 text-sm">No active goals yet</div> : (
            <div className="space-y-3">
              {activeGoals.map(goal => (
                <div key={goal.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{goal.title}</p>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 ml-2">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full" style={{ width: `${goal.progress}%` }} />
                  </div>
                  <p className="text-xs text-slate-400">Target: {goal.target}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">Recent Tasks</h3>
          <Link to="/dashboard/tasks" className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
        </div>
        <div className="space-y-1">
          {recentTasks.map(task => (
            <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{task.title}</p>
                <p className="text-xs text-slate-400">{task.category} · Due {task.dueDate}</p>
              </div>
              <span className={task.priority === 'High' ? 'badge-high' : task.priority === 'Medium' ? 'badge-medium' : 'badge-low'}>{task.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
