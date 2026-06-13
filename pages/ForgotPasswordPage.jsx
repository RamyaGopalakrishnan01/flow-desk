import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="w-full max-w-md animate-slide-up">
        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <div className="inline-flex w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center mb-4">
                <CheckCircle size={28} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">Check your email</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">We sent a reset link to <strong className="text-slate-700 dark:text-slate-300">{email}</strong>. Check your inbox and follow the instructions.</p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2"><ArrowLeft size={16} /> Back to Login</Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex w-12 h-12 rounded-2xl bg-brand-600 items-center justify-center mb-4 shadow-lg shadow-brand-500/30">
                  <Zap size={22} className="text-white" />
                </div>
                <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Reset password</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">We'll send you a link to reset it</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" className="input pl-9" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex justify-center items-center gap-2 text-base">
                  {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <p className="text-center mt-6">
                <Link to="/login" className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-center gap-1.5"><ArrowLeft size={14} /> Back to Login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
