
import React from 'react';
import { User } from '../types';

interface DashboardProps {
  user: User | null;
  onNavigate: (page: any) => void;
  hasAssessment: boolean;
  topMatch?: string;
  matchPercentage?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, hasAssessment, topMatch, matchPercentage = 85 }) => {
  if (!user) return null;

  const firstName = user.fullName.split(' ')[0];

  const actions = [
    {
      id: 'assessment',
      title: hasAssessment ? 'Refine Profile' : 'Discovery Assessment',
      description: hasAssessment
        ? 'Update your skills or interests to see how your career matches evolve over time.'
        : 'Take our AI-powered assessment to unlock your personalized tech career roadmap.',
      icon: '🎯',
      button: hasAssessment ? 'Retake Assessment' : 'Start Assessment',
      primary: !hasAssessment,
      status: !hasAssessment ? 'Recommended Start' : null,
      color: 'from-indigo-600 to-indigo-800'
    },
    {
      id: 'results',
      title: 'Your Strategy',
      description: 'Access your 4-week learning blueprint, project briefs, and curated resource library.',
      icon: '🗺️',
      button: 'View Roadmap',
      disabled: !hasAssessment,
      primary: hasAssessment,
      color: 'from-purple-600 to-purple-800'
    },
    {
      id: 'analytics',
      title: 'Market Pulse',
      description: 'Stay ahead of the curve with real-time demand data for roles and emerging technologies.',
      icon: '📈',
      button: 'Open Analytics',
      color: 'from-blue-600 to-blue-800'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Dynamic Hero Section */}
      <div className="relative mb-16 p-10 md:p-16 rounded-[56px] overflow-hidden border border-white/10 group bg-slate-900/40">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-600/10 to-transparent opacity-50"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
              Welcome back, {firstName}
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-[1.1]">
              {hasAssessment ? (
                <>Your career path is <span className="text-indigo-500">defined.</span></>
              ) : (
                <>Let's find your <span className="text-indigo-500">true path.</span></>
              )}
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              {hasAssessment
                ? `You're currently tracking towards a career as a ${topMatch}. Ready to continue your 4-week plan?`
                : "You haven't completed your profile yet. Start the assessment to get a personalized technical roadmap and skill-gap analysis."}
            </p>
          </div>

          {hasAssessment && (
            <div
              onClick={() => onNavigate('results')}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[40px] flex items-center gap-6 shadow-2xl hover:border-indigo-500/30 transition-all cursor-pointer group/card"
            >
              <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-4xl shadow-2xl shadow-indigo-600/40 group-hover/card:scale-110 transition-transform">
                🏆
              </div>
              <div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-1">Optimal Match</span>
                <h3 className="text-2xl font-black text-white">{topMatch}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${matchPercentage}%` }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{matchPercentage}% Score</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Actions */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`glass p-10 rounded-[48px] border-2 flex flex-col group transition-all duration-500 relative ${action.disabled
                ? 'opacity-40 grayscale border-white/5 cursor-not-allowed'
                : `hover:-translate-y-2 ${action.primary ? 'border-indigo-500/40 bg-indigo-500/[0.02]' : 'border-white/5 hover:border-white/20'}`
              }`}
          >
            {action.status && (
              <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest animate-pulse">
                {action.status}
              </div>
            )}

            <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${action.color} flex items-center justify-center text-3xl mb-10 shadow-2xl shadow-indigo-900/40 group-hover:scale-110 transition-transform duration-500`}>
              {action.icon}
            </div>

            <h3 className="text-2xl font-black mb-4 tracking-tight">{action.title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-12 flex-grow">
              {action.description}
            </p>

            <button
              disabled={action.disabled}
              onClick={() => onNavigate(action.id)}
              className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all ${action.primary
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/30 active:scale-95'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 active:scale-95'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {action.disabled ? 'Locked' : action.button}
            </button>
          </div>
        ))}
      </div>

      {/* Secondary Row: Tech Pulse & Tips */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
        <div className="glass p-10 rounded-[56px] border border-white/10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black tracking-tight mb-1">Industry Velocity</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time demand metrics</p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-indigo-400 font-bold text-xs hover:text-white transition-colors"
            >
              View Trends →
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'AI/ML Orchestration', growth: '+182%', trend: 'Surging', color: 'text-emerald-400' },
              { name: 'Cloud Native Arch', growth: '+56%', trend: 'High', color: 'text-indigo-400' },
              { name: 'Zero-Trust Security', growth: '+44%', trend: 'Steady', color: 'text-blue-400' },
              { name: 'Legacy Web Stack', growth: '-8%', trend: 'Declining', color: 'text-slate-500' }
            ].map(trend => (
              <div key={trend.name} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                <div>
                  <span className="block text-slate-200 font-black text-sm mb-1">{trend.name}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{trend.trend}</span>
                </div>
                <span className={`font-black text-lg ${trend.color}`}>{trend.growth}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-10 rounded-[56px] bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="text-8xl">🚀</span>
          </div>

          <h3 className="text-xl font-black mb-6 tracking-tight flex items-center gap-3 relative z-10">
            Strategic Advice
          </h3>
          <p className="text-slate-300 text-sm font-medium leading-relaxed mb-10 relative z-10">
            {hasAssessment
              ? "Consistency is the key to skill acquisition. Dedicate 2 hours daily to your roadmap tasks for maximum results."
              : "Early specialization in high-growth areas like AI or Security can lead to a 35% higher starting compensation package."}
          </p>

          <button
            onClick={() => onNavigate(hasAssessment ? 'roles' : 'assessment')}
            className="w-full py-4 rounded-2xl bg-white text-slate-950 font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all relative z-10 shadow-2xl shadow-white/5"
          >
            {hasAssessment ? 'See Career Options' : 'Take Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
