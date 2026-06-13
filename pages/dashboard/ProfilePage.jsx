import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User, Mail, Lock, Moon, Sun, Bell, Shield, Trash2,
  Camera, CheckCircle, Eye, EyeOff, Save, AlertTriangle,
} from 'lucide-react';

function Section({ title, desc, children }) {
  return (
    <div className="card p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-base text-slate-900 dark:text-white">{title}</h2>
        {desc && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser, darkMode, setDarkMode, tasks, goals } = useApp();

  const [profile, setProfile] = useState({ name: user?.name || '', bio: user?.bio || '', email: user?.email || '' });
  const [profileSaved, setProfileSaved] = useState(false);

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);

  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklyReport: true,
    goalAlerts: false,
  });

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const saveProfile = () => {
    if (!profile.name.trim()) return;
    updateUser({ name: profile.name, bio: profile.bio });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const savePassword = () => {
    if (pwForm.current !== 'demo123') { setPwMsg({ ok: false, text: 'Current password is incorrect' }); return; }
    if (pwForm.next.length < 6) { setPwMsg({ ok: false, text: 'New password must be at least 6 characters' }); return; }
    if (pwForm.next !== pwForm.confirm) { setPwMsg({ ok: false, text: 'Passwords do not match' }); return; }
    setPwMsg({ ok: true, text: 'Password updated successfully' });
    setPwForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwMsg(null), 3000);
  };

  const completionRate = tasks.length
    ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
    : 0;

  const statItems = [
    { label: 'Total Tasks', value: tasks.length, color: 'text-brand-600 dark:text-brand-400' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Active Goals', value: goals.filter(g => g.status === 'active').length, color: 'text-violet-600 dark:text-violet-400' },
    { label: 'Completion Rate', value: `${completionRate}%`, color: 'text-amber-600 dark:text-amber-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Profile & Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {initials}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
              <Camera size={14} className="text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{user?.email}</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Member since {user?.joinDate}</p>
            {user?.bio && <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 max-w-sm">{user.bio}</p>}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {statItems.map(({ label, value, color }) => (
              <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-center">
                <p className={`font-display font-bold text-xl ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit profile */}
        <Section title="Edit Profile" desc="Update your personal information">
          <div className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-9"
                  value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-9 opacity-60 cursor-not-allowed"
                  value={profile.email}
                  disabled
                  placeholder="Email address"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed in demo mode</p>
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea
                className="input resize-none"
                rows={3}
                value={profile.bio}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
              />
            </div>
            <button
              onClick={saveProfile}
              className="btn-primary flex items-center gap-2"
            >
              {profileSaved ? <CheckCircle size={15} /> : <Save size={15} />}
              {profileSaved ? 'Saved!' : 'Save Profile'}
            </button>
          </div>
        </Section>

        {/* Change password */}
        <Section title="Change Password" desc="Keep your account secure">
          <div className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pl-9 pr-10"
                  value={pwForm.current}
                  onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                  placeholder="Current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pl-9"
                  value={pwForm.next}
                  onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
                  placeholder="At least 6 characters"
                />
              </div>
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pl-9"
                  value={pwForm.confirm}
                  onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            {pwMsg && (
              <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${pwMsg.ok ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                {pwMsg.ok ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                {pwMsg.text}
              </div>
            )}

            <button onClick={savePassword} className="btn-primary flex items-center gap-2">
              <Shield size={15} />
              Update Password
            </button>
            <p className="text-xs text-slate-400">Demo hint: current password is <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">demo123</code></p>
          </div>
        </Section>

        {/* Appearance */}
        <Section title="Appearance" desc="Customize how FlowDesk looks">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={18} className="text-brand-500" /> : <Sun size={18} className="text-amber-500" />}
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {darkMode ? 'Dark Mode' : 'Light Mode'}
                  </p>
                  <p className="text-xs text-slate-500">Toggle theme</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${darkMode ? 'bg-brand-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'System', icon: '💻' },
                { label: 'Compact', icon: '📐' },
              ].map(({ label, icon }) => (
                <div key={label} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center cursor-pointer hover:border-brand-400 transition-colors">
                  <span className="text-xl">{icon}</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label} (soon)</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" desc="Control what you hear about">
          <div className="space-y-3">
            {Object.entries({
              emailNotifications: 'Email notifications',
              taskReminders: 'Task due date reminders',
              weeklyReport: 'Weekly productivity report',
              goalAlerts: 'Goal milestone alerts',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                </div>
                <button
                  onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${prefs[key] ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${prefs[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Danger zone */}
      <Section title="Danger Zone" desc="Irreversible account actions">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              if (window.confirm('Reset all data to defaults? This cannot be undone.')) {
                localStorage.removeItem('pd_tasks');
                localStorage.removeItem('pd_goals');
                localStorage.removeItem('pd_planner');
                window.location.reload();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 text-sm font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
          >
            <AlertTriangle size={15} />
            Reset All Data
          </button>
          <button
            onClick={() => window.confirm('Delete account? (Demo: this will sign you out)') && (() => { })()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={15} />
            Delete Account
          </button>
        </div>
      </Section>
    </div>
  );
}
