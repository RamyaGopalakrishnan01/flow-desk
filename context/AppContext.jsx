import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

// ── Demo users ────────────────────────────────────────────────────────────────
const DEMO_USERS = [
  {
    id: 1,
    email: 'demo@productivity.app',
    password: 'demo123',
    name: 'Ramya Gopalakrishnan',
    role: 'Admin',
    avatar: null,
    joinDate: '2024-01-15',
    bio: 'Productivity enthusiast & full-stack developer.',
  },
];

// ── Seed data ─────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().split('T')[0];
const addDays = (n) => {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

const SEED_TASKS = [
  { id: 1, title: 'Complete project proposal', category: 'Work', priority: 'High', status: 'pending', dueDate: addDays(2), createdAt: addDays(-5), notes: 'Finalize Q3 product roadmap' },
  { id: 2, title: 'Morning workout routine', category: 'Health', priority: 'Medium', status: 'completed', dueDate: TODAY, createdAt: addDays(-3), notes: '45 min cardio + strength' },
  { id: 3, title: 'Read "Atomic Habits"', category: 'Learning', priority: 'Low', status: 'pending', dueDate: addDays(7), createdAt: addDays(-4), notes: 'Finish chapters 5-8' },
  { id: 4, title: 'Team standup meeting', category: 'Work', priority: 'High', status: 'completed', dueDate: TODAY, createdAt: addDays(-1), notes: 'Daily sync with dev team' },
  { id: 5, title: 'Review analytics dashboard', category: 'Work', priority: 'Medium', status: 'pending', dueDate: TODAY, createdAt: addDays(-2), notes: 'Check Q2 performance metrics' },
  { id: 6, title: 'Grocery shopping', category: 'Personal', priority: 'Medium', status: 'completed', dueDate: addDays(-1), createdAt: addDays(-3), notes: 'Weekly groceries' },
  { id: 7, title: 'Write blog post', category: 'Learning', priority: 'Low', status: 'pending', dueDate: addDays(12), createdAt: addDays(-6), notes: 'Tech blog about React patterns' },
  { id: 8, title: 'Update portfolio website', category: 'Work', priority: 'High', status: 'pending', dueDate: addDays(5), createdAt: addDays(-2), notes: 'Add new projects and skills' },
  { id: 9, title: 'Dentist appointment', category: 'Health', priority: 'High', status: 'completed', dueDate: addDays(-2), createdAt: addDays(-7), notes: 'Annual checkup' },
  { id: 10, title: 'Learn TypeScript generics', category: 'Learning', priority: 'Medium', status: 'pending', dueDate: addDays(10), createdAt: addDays(-1), notes: 'Complete the advanced TypeScript course' },
];

const SEED_GOALS = [
  { id: 1, title: 'Learn React Advanced Patterns', category: 'Learning', progress: 65, target: addDays(48), status: 'active', description: 'Master hooks, context, and performance optimization' },
  { id: 2, title: 'Run 5K under 25 minutes', category: 'Health', progress: 80, target: addDays(17), status: 'active', description: 'Improve running speed and endurance' },
  { id: 3, title: 'Read 12 books this year', category: 'Personal', progress: 42, target: addDays(200), status: 'active', description: 'One book per month across different genres' },
  { id: 4, title: 'Save ₹1,00,000 emergency fund', category: 'Finance', progress: 100, target: addDays(-13), status: 'completed', description: 'Emergency fund savings goal' },
  { id: 5, title: 'Launch personal side project', category: 'Career', progress: 30, target: addDays(80), status: 'active', description: 'Build and deploy a SaaS product' },
];

const SEED_PLANNER = [
  { id: 1, title: 'Morning meditation', time: '06:00', duration: 30, color: 'emerald', completed: true, date: TODAY },
  { id: 2, title: 'Check emails & messages', time: '08:00', duration: 20, color: 'brand', completed: true, date: TODAY },
  { id: 3, title: 'Deep work: coding session', time: '09:00', duration: 120, color: 'brand', completed: false, date: TODAY },
  { id: 4, title: 'Team standup', time: '11:00', duration: 30, color: 'violet', completed: false, date: TODAY },
  { id: 5, title: 'Lunch break', time: '13:00', duration: 60, color: 'amber', completed: false, date: TODAY },
  { id: 6, title: 'Review code PRs', time: '14:00', duration: 60, color: 'brand', completed: false, date: TODAY },
  { id: 7, title: 'Evening run', time: '18:00', duration: 45, color: 'emerald', completed: false, date: TODAY },
];

function load(key, fallback) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; }
  catch { return fallback; }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App state
  const [tasks, setTasks] = useState(() => load('pd_tasks', SEED_TASKS));
  const [goals, setGoals] = useState(() => load('pd_goals', SEED_GOALS));
  const [plannerItems, setPlannerItems] = useState(() => load('pd_planner', SEED_PLANNER));
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('pd_dark') === 'true');

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('pd_user') || sessionStorage.getItem('pd_user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
    setAuthLoading(false);
  }, []);

  // Persist
  useEffect(() => { localStorage.setItem('pd_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('pd_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('pd_planner', JSON.stringify(plannerItems)); }, [plannerItems]);
  useEffect(() => {
    localStorage.setItem('pd_dark', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // ── Auth methods ─────────────────────────────────────────────────────────
  const login = (email, password, remember = false) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!found) return { ok: false, error: 'Invalid email or password. Try demo@productivity.app / demo123' };
    const { password: _, ...safe } = found;
    setUser(safe);
    const target = remember ? localStorage : sessionStorage;
    target.setItem('pd_user', JSON.stringify(safe));
    if (remember) localStorage.setItem('pd_remember', '1');
    return { ok: true };
  };

  const register = (name, email, password) => {
    if (DEMO_USERS.find(u => u.email === email)) return { ok: false, error: 'Email already registered' };
    const newUser = { id: Date.now(), email, name, role: 'User', avatar: null, joinDate: TODAY, bio: '' };
    DEMO_USERS.push({ ...newUser, password });
    setUser(newUser);
    sessionStorage.setItem('pd_user', JSON.stringify(newUser));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pd_user');
    localStorage.removeItem('pd_remember');
    sessionStorage.removeItem('pd_user');
  };

  const updateUser = (updates) => {
    const u = { ...user, ...updates };
    setUser(u);
    const remember = localStorage.getItem('pd_remember');
    (remember ? localStorage : sessionStorage).setItem('pd_user', JSON.stringify(u));
  };

  // ── Task CRUD ────────────────────────────────────────────────────────────
  const addTask = (t) => setTasks(p => [{ ...t, id: Date.now(), createdAt: TODAY, status: 'pending' }, ...p]);
  const updateTask = (id, u) => setTasks(p => p.map(t => t.id === id ? { ...t, ...u } : t));
  const deleteTask = (id) => setTasks(p => p.filter(t => t.id !== id));
  const toggleTask = (id) => setTasks(p => p.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));

  // ── Goal CRUD ────────────────────────────────────────────────────────────
  const addGoal = (g) => setGoals(p => [{ ...g, id: Date.now(), progress: 0, status: 'active' }, ...p]);
  const updateGoal = (id, u) => setGoals(p => p.map(g => g.id === id ? { ...g, ...u } : g));
  const deleteGoal = (id) => setGoals(p => p.filter(g => g.id !== id));

  // ── Planner CRUD ─────────────────────────────────────────────────────────
  const addPlannerItem = (item) => setPlannerItems(p => [...p, { ...item, id: Date.now(), completed: false }]);
  const updatePlannerItem = (id, u) => setPlannerItems(p => p.map(i => i.id === id ? { ...i, ...u } : i));
  const deletePlannerItem = (id) => setPlannerItems(p => p.filter(i => i.id !== id));
  const togglePlannerItem = (id) => setPlannerItems(p => p.map(i => i.id === id ? { ...i, completed: !i.completed } : i));

  // ── Computed stats ────────────────────────────────────────────────────────
  const completed = tasks.filter(t => t.status === 'completed').length;
  const stats = {
    total: tasks.length,
    completed,
    pending: tasks.filter(t => t.status === 'pending').length,
    goalsAchieved: goals.filter(g => g.status === 'completed' || g.progress >= 100).length,
    score: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
  };

  return (
    <AppContext.Provider value={{
      // auth
      user, authLoading, login, register, logout, updateUser,
      // data
      tasks, goals, plannerItems, stats, darkMode,
      // setters
      setDarkMode,
      addTask, updateTask, deleteTask, toggleTask,
      addGoal, updateGoal, deleteGoal,
      addPlannerItem, updatePlannerItem, deletePlannerItem, togglePlannerItem,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
