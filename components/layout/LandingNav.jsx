import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg">FlowDesk</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Statistics', 'Testimonials'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link text-sm">{item}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/register" className="btn-primary text-sm">Get started free</Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 pb-4 animate-slide-up">
          <div className="flex flex-col gap-3 pt-2">
            {['Features', 'Statistics', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-link py-2" onClick={() => setOpen(false)}>{item}</a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Link to="/login" className="btn-secondary text-center text-sm">Sign in</Link>
              <Link to="/register" className="btn-primary text-center text-sm">Get started free</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
