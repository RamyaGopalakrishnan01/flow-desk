import { Link } from 'react-router-dom';
import { Zap, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { label: 'GH', title: 'GitHub' },
    { label: 'X', title: 'X (Twitter)' },
    { label: 'in', title: 'LinkedIn' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
                <Zap size={15} className="text-white" />
              </div>
              <span className="text-white font-display font-bold text-lg">FlowDesk</span>
            </div>
            <p className="text-sm leading-relaxed mb-5 text-slate-500">
              Your personal productivity command center. Tasks, goals, schedules, and insights — all in one place.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ label, title }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={title}
                  title={title}
                  className="w-8 h-8 bg-slate-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors duration-200 text-xs font-bold text-slate-300 hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5">
              {['Features', 'Changelog', 'Roadmap', 'Pricing', 'API Docs'].map(item => (
                <li key={item}><a href="#" className="text-sm hover:text-white transition-colors duration-200">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'My Tasks', to: '/dashboard/tasks' },
                { label: 'Goals', to: '/dashboard/goals' },
                { label: 'Analytics', to: '/dashboard/analytics' },
                { label: 'AI Assistant', to: '/dashboard/ai' },
              ].map(({ label, to }) => (
                <li key={label}><Link to={to} className="text-sm hover:text-white transition-colors duration-200">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:hello@flowdesk.app" className="flex items-center gap-2 text-sm hover:text-white transition-colors duration-200">
                  <Mail size={14} /> hello@flowdesk.app
                </a>
              </li>
              {['Support Center', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-2 text-sm hover:text-white transition-colors duration-200">
                    <ExternalLink size={14} /> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-6">
          <p className="text-center text-sm text-slate-500">
            &copy; {year} Ramya Gopalakrishnan. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
