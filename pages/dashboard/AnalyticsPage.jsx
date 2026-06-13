import { useApp } from '../../context/AppContext';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function AnalyticsPage() {
  const { tasks, goals, stats } = useApp();

  const weeklyData = [
    { day: 'Mon', completed: 3, added: 2 },
    { day: 'Tue', completed: 5, added: 4 },
    { day: 'Wed', completed: 2, added: 3 },
    { day: 'Thu', completed: 7, added: 5 },
    { day: 'Fri', completed: 4, added: 2 },
    { day: 'Sat', completed: 6, added: 3 },
    { day: 'Sun', completed: tasks.filter(t => t.status === 'completed').length, added: tasks.length },
  ];

  const monthlyData = [
    { month: 'Jan', score: 62 }, { month: 'Feb', score: 71 }, { month: 'Mar', score: 58 },
    { month: 'Apr', score: 80 }, { month: 'May', score: 75 }, { month: 'Jun', score: stats.score },
  ];

  const catData = ['Work', 'Learning', 'Health', 'Personal', 'Other'].map(cat => ({
    name: cat,
    value: tasks.filter(t => t.category === cat).length || 0,
  })).filter(d => d.value > 0);

  const priorityData = [
    { name: 'High', total: tasks.filter(t => t.priority === 'High').length, done: tasks.filter(t => t.priority === 'High' && t.status === 'completed').length },
    { name: 'Medium', total: tasks.filter(t => t.priority === 'Medium').length, done: tasks.filter(t => t.priority === 'Medium' && t.status === 'completed').length },
    { name: 'Low', total: tasks.filter(t => t.priority === 'Low').length, done: tasks.filter(t => t.priority === 'Low' && t.status === 'completed').length },
  ];

  const tooltipStyle = { backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#e2e8f0', fontSize: 12 };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Your productivity at a glance</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Productivity Score', value: `${stats.score}%`, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-50 dark:bg-brand-900/20' },
          { label: 'Completion Rate', value: `${stats.total ? Math.round(stats.completed / stats.total * 100) : 0}%`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Goals Progress', value: `${goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0}%`, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
          { label: 'Active Streak', value: '7 days', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`card p-5 ${bg}`}>
            <div className={`font-display font-bold text-2xl ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly tasks */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Weekly Task Activity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} name="Completed" />
              <Bar dataKey="added" fill="#c7d2fe" radius={[6, 6, 0, 0]} name="Added" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly score */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Monthly Productivity Score</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} name="Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category distribution */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Tasks by Category</h3>
          {catData.length === 0 ? <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet</div> : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {catData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                    <span className="font-semibold text-slate-900 dark:text-white ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Priority breakdown */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Priority Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="total" fill="#e0e7ff" radius={[0, 6, 6, 0]} name="Total" />
              <Bar dataKey="done" fill="#6366f1" radius={[0, 6, 6, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals progress */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-5">Goal Progress Tracker</h3>
        <div className="space-y-4">
          {goals.map((goal, i) => (
            <div key={goal.id} className="flex items-center gap-4">
              <div className="w-32 text-sm text-slate-600 dark:text-slate-400 truncate">{goal.title.split(' ').slice(0, 3).join(' ')}...</div>
              <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${goal.progress}%`, backgroundColor: COLORS[i % COLORS.length] }} />
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 w-10 text-right">{goal.progress}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
