import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, CheckSquare, Target, Calendar, CalendarDays,
  BarChart3, Bot, Settings, LogOut, Zap, Sun, Moon,
} from 'lucide-react';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/dashboard/goals', icon: Target, label: 'Goals' },
  { to: '/dashboard/planner', icon: Calendar, label: 'Daily Planner' },
  { to: '/dashboard/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/dashboard/ai', icon: Bot, label: 'AI Assistant' },
  { to: '/dashboard/profile', icon: Settings, label: 'Profile' },
];

export default function Sidebar({ onClose }) {
  const { user, logout, darkMode, setDarkMode } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <aside className="w-64 h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-lg text-slate-900 dark:text-white">FlowDesk</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1 border-t border-slate-100 dark:border-slate-800 pt-3 shrink-0">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="sidebar-link w-full"
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* User chip */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 mt-1">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20 hover:!text-red-600"
        >
          <LogOut size={17} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
