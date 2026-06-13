import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, RefreshCw, Clock, Target, Zap, Brain, MessageCircle, Send } from 'lucide-react';

const MOCK_SUGGESTIONS = {
  prioritization: [
    { title: 'Focus on Q3 Report first', reason: 'It has the nearest deadline (Jun 15) and is marked High priority. Tackle it during your peak hours — typically 9–11 AM.', icon: Target, color: 'brand' },
    { title: 'Batch similar tasks', reason: 'You have 3 learning tasks this week. Schedule them in dedicated 90-minute blocks instead of spreading them throughout the day.', icon: Brain, color: 'violet' },
    { title: 'Grocery shopping is quick', reason: 'Combine your personal errands with natural energy valleys (like 3–4 PM) so peak hours stay for cognitively demanding work.', icon: Clock, color: 'amber' },
  ],
  focus: [
    'Your high-priority task count is elevated. Try a Pomodoro session: 25 minutes focused on one task, 5-minute break.',
    'You have 5 pending tasks. Try the "2-minute rule" — if a task takes less than 2 minutes, do it now.',
    'Consider blocking social media during your peak morning hours to maximize deep work output.',
  ],
  timeManagement: [
    'You tend to have the most energy between 9 AM and 12 PM. Reserve that window for your most cognitively demanding tasks.',
    'Weekly review every Sunday evening takes just 20 minutes and dramatically improves Monday clarity.',
    'Your goal deadlines are spread across the next 3 months. Set weekly milestones to prevent end-of-period crunches.',
  ],
};

const CHAT_STARTERS = [
  "How should I prioritize my tasks today?",
  "I'm feeling overwhelmed, help me focus",
  "What's the best way to track my goals?",
  "Tips for beating procrastination?",
];

const CHAT_RESPONSES = {
  "How should I prioritize my tasks today?": "Based on your current tasks, I suggest focusing on: 1) **Q3 Report** (High priority, due soon), 2) **Team standup prep** (High priority, due tomorrow), then 3) anything medium priority during your afternoon energy valley. Use the Eisenhower Matrix: urgent + important first.",
  "I'm feeling overwhelmed, help me focus": "That's completely normal! Here's a simple reset: Close all tabs except one task. Set a 25-minute timer. Do just that one thing. You don't have to finish it — just start. Momentum beats perfection. After the session, take a real break (no phone). Repeat.",
  "What's the best way to track my goals?": "The most effective approach is to break big goals into weekly milestones, then into daily tasks. Your 'Land a Data Analytics Internship' goal at 70% progress is great — just make sure it maps to 3–5 concrete tasks this week, not just a vague intention.",
  "Tips for beating procrastination?": "Three tactics that actually work: 1) Make starting absurdly easy — commit to just 2 minutes, not the whole task. 2) Remove friction — if your task requires opening your laptop, keep it charged and open. 3) Use implementation intentions — 'When I sit down at 9 AM with coffee, I will open the report doc.'",
};

export default function AIAssistantPage() {
  const { tasks, goals, stats } = useApp();
  const [activeTab, setActiveTab] = useState('suggestions');
  const [refreshKey, setRefreshKey] = useState(0);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI productivity assistant. I can help you prioritize tasks, manage your time better, and hit your goals. What would you like help with today?" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setTyping(true);
    setTimeout(() => {
      const response = CHAT_RESPONSES[msg] ||
        `That's a great question! Based on your current ${tasks.filter(t => t.status === 'pending').length} pending tasks and ${stats.score}% productivity score, I'd recommend focusing on your highest-priority items first. Would you like me to suggest a specific action plan?`;
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
      setTyping(false);
    }, 1200);
  };

  const colorMap = { brand: 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400', violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400', amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' };

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">AI Assistant</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Personalized productivity guidance</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          AI Active
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['suggestions', 'Suggestions'], ['chat', 'Chat Assistant'], ['tips', 'Tips']].map(([k, l]) => (
          <button key={k} onClick={() => setActiveTab(k)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === k ? 'bg-brand-600 text-white' : 'btn-secondary'}`}>{l}</button>
        ))}
      </div>

      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Personalized to your current {tasks.filter(t => t.status === 'pending').length} pending tasks</p>
            <button onClick={() => setRefreshKey(k => k + 1)} className="btn-ghost flex items-center gap-1.5 text-xs">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div className="card p-5 bg-gradient-to-br from-brand-50 to-violet-50 dark:from-brand-900/20 dark:to-violet-900/20 border-brand-200 dark:border-brand-800">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-brand-600 dark:text-brand-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Today's Focus Recommendation</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              With a {stats.score}% productivity score and {tasks.filter(t => t.status === 'pending').length} pending tasks, your best move today is to start with the Q3 Report during your morning peak hours, then handle admin and learning tasks in the afternoon. Protect at least one 90-minute uninterrupted block.
            </p>
          </div>

          <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Task Prioritization</h3>
          {MOCK_SUGGESTIONS.prioritization.map(({ title, reason, icon: Icon, color }) => (
            <div key={title} className="card p-4 flex gap-4">
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 ${colorMap[color]} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="card flex flex-col" style={{ height: '520px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                    <Sparkles size={14} className="text-white" />
                  </div>
                )}
                <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 mr-2"><Sparkles size={14} className="text-white" /></div>
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1.5">
                    {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Quick starters */}
          <div className="px-4 pb-2 flex gap-2 flex-wrap">
            {CHAT_STARTERS.map(s => (
              <button key={s} onClick={() => sendMessage(s)} className="text-xs px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
                {s}
              </button>
            ))}
          </div>
          {/* Input */}
          <div className="border-t border-slate-100 dark:border-slate-800 p-4 flex gap-2">
            <input
              className="input flex-1"
              placeholder="Ask anything about productivity..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={() => sendMessage()} className="btn-primary p-2.5"><Send size={16} /></button>
          </div>
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="space-y-4">
          {[
            { title: 'Focus Techniques', tips: MOCK_SUGGESTIONS.focus, icon: Brain, color: 'violet' },
            { title: 'Time Management', tips: MOCK_SUGGESTIONS.timeManagement, icon: Clock, color: 'brand' },
          ].map(({ title, tips, icon: Icon, color }) => (
            <div key={title} className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-9 h-9 rounded-xl ${colorMap[color]} flex items-center justify-center`}><Icon size={18} /></div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
              </div>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
