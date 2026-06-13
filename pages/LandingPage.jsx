import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Footer from '../components/layout/Footer';
import {
  Zap, CheckCircle, Target, BarChart3, Calendar, Sparkles,
  ArrowRight, Star, TrendingUp, Users, Clock, Brain
} from 'lucide-react';

const FEATURES = [
  { icon: CheckCircle, title: 'Smart Task Management', desc: 'Create, prioritize, and track tasks with deadlines, categories, and priority levels. Stay on top of what matters.', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
  { icon: Target, title: 'Goal Tracking', desc: 'Set ambitious goals, track your progress visually, and celebrate milestones as you move closer to what you want.', color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' },
  { icon: Calendar, title: 'Calendar & Planner', desc: 'Visualize your schedule, plan your day by the hour, and see deadlines at a glance on a beautiful monthly view.', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { icon: BarChart3, title: 'Productivity Analytics', desc: 'Beautiful charts showing weekly and monthly trends, task completion rates, and your personal productivity score.', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  { icon: Sparkles, title: 'AI Assistant', desc: 'Get personalized suggestions, focus recommendations, and smart prioritization tips powered by AI.', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
  { icon: Brain, title: 'Daily Planning', desc: 'Build a structured daily plan with drag-and-drop time blocks. Own your day before it owns you.', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' },
];

const STATS = [
  { value: '10,000+', label: 'Active Users', icon: Users },
  { value: '98%', label: 'Task Completion Rate', icon: TrendingUp },
  { value: '3.2x', label: 'Productivity Increase', icon: Zap },
  { value: '4.9★', label: 'Average Rating', icon: Star },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Product Manager, TechCorp', text: 'FlowSpace completely changed how I plan my week. The analytics alone are worth it — I can actually see where my time goes.', avatar: 'P' },
  { name: 'Arjun Mehta', role: 'Freelance Developer', text: 'As a freelancer juggling multiple clients, goal tracking has been a game changer. I hit my 3-month targets for the first time.', avatar: 'A' },
  { name: 'Divya Nair', role: 'MBA Student, IIM-B', text: 'The AI assistant gives surprisingly useful suggestions. It helped me reorganize my study schedule and I actually kept up with it.', avatar: 'D' },
];

export default function LandingPage() {
  const { user, darkMode, setDarkMode } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-md shadow-brand-500/30">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white">FlowSpace</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</a>
            <a href="#stats" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Stats</a>
            <a href="#testimonials" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="btn-ghost p-2 text-slate-500">
              {darkMode ? '☀️' : '🌙'}
            </button>
            {user ? (
              <Link to="/dashboard" className="btn-primary">Dashboard →</Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary hidden sm:inline-flex">Sign In</Link>
                <Link to="/register" className="btn-primary">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-400/10 dark:bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-400/10 dark:bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles size={14} />
            Now with AI-powered productivity suggestions
          </div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-slate-900 dark:text-white mb-6 leading-tight animate-slide-up">
            Your productivity,<br /><span className="gradient-text">finally organized.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Tasks, goals, schedules, and analytics — all in one clean dashboard. Stop juggling apps and start actually getting things done.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40">
              Start for free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary inline-flex items-center gap-2 px-8 py-4 text-base">
              Try demo account
            </Link>
          </div>
          <p className="mt-5 text-sm text-slate-400">No credit card required · 100% free · Runs in your browser</p>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="card p-6 text-center">
              <div className="inline-flex w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 items-center justify-center mb-3">
                <Icon size={20} className="text-brand-600 dark:text-brand-400" />
              </div>
              <div className="font-display font-bold text-2xl text-slate-900 dark:text-white">{value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">Everything you need to be productive</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">Six powerful modules, designed to work together seamlessly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6 hover:-translate-y-1 transition-transform duration-200">
                <div className={`inline-flex w-11 h-11 rounded-xl ${color} items-center justify-center mb-4`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">Trusted by productive people</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, avatar }) => (
              <div key={name} className="card p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold">{avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{name}</p>
                    <p className="text-xs text-slate-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-12 bg-gradient-to-br from-brand-600 to-violet-600 border-0 text-white">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">Ready to own your productivity?</h2>
            <p className="text-brand-100 mb-8 text-lg">Join thousands of people who plan smarter and achieve more with FlowSpace.</p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-4 rounded-xl hover:bg-brand-50 transition-all shadow-lg">
              Get started free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
