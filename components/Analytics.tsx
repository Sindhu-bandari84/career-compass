
import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts';

interface TrendData {
  name: string;
  growth: number;
  color: string;
  domain: string;
}

interface AnalyticsProps {
  onNavigate: (page: any) => void;
  hasAssessment: boolean;
}

const ANALYTICS_DATA: TrendData[] = [
  { name: 'AI/ML Engineer', growth: 56, color: '#6366f1', domain: 'AI/ML' },
  { name: 'Prompt Engineer', growth: 124, color: '#818cf8', domain: 'AI/ML' },
  { name: 'Cloud Architect', growth: 42, color: '#4f46e5', domain: 'Cloud' },
  { name: 'Cybersecurity Analyst', growth: 38, color: '#4338ca', domain: 'Security' },
  { name: 'Data Engineer', growth: 35, color: '#3730a3', domain: 'Data' },
  { name: 'Full Stack Developer', growth: 28, color: '#4f46e5', domain: 'Web' },
  { name: 'DevOps Specialist', growth: 45, color: '#6366f1', domain: 'Cloud' },
  { name: 'Blockchain Dev', growth: 18, color: '#312e81', domain: 'Blockchain' },
  { name: 'UI/UX Researcher', growth: 22, color: '#818cf8', domain: 'Design' },
  { name: 'QA Automation', growth: 15, color: '#4338ca', domain: 'QA' },
];

const EMERGING_SKILLS = [
  { name: 'Large Language Models (LLMs)', growth: 185, type: 'Rising' },
  { name: 'Zero Trust Security', growth: 64, type: 'Steady' },
  { name: 'Edge Computing', growth: 42, type: 'Steady' },
  { name: 'Quantum Programming', growth: 12, type: 'Niche' },
  { name: 'Sustainable Tech (Green IT)', growth: 28, type: 'Rising' },
];

const Analytics: React.FC<AnalyticsProps> = ({ onNavigate, hasAssessment }) => {
  const [region, setRegion] = useState('Global');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [timeframe, setTimeframe] = useState('2024-2025');

  const filteredData = useMemo(() => {
    let base = [...ANALYTICS_DATA];

    // 1. Domain Filtering
    if (domainFilter !== 'All Domains') {
      base = base.filter(d => d.domain === domainFilter);
    }

    // 2. Data Simulation Logic based on Timeframe and Region
    return base.map(d => {
      let growthValue = d.growth;

      // Simulate historical data vs forecast
      if (timeframe === '2023-2024') {
        // Historical values were generally lower for AI, higher for standard Web
        if (d.domain === 'AI/ML') growthValue = Math.round(growthValue * 0.6);
        else if (d.domain === 'Web') growthValue = Math.round(growthValue * 1.2);
        else growthValue = Math.round(growthValue * 0.85);
      }

      // Region Multipliers
      if (region === 'India') {
        growthValue = Math.round(growthValue * 1.15);
      } else if (region === 'North America') {
        growthValue = Math.round(growthValue * 1.05);
      } else if (region === 'Europe') {
        growthValue = Math.round(growthValue * 0.95);
      }

      return { ...d, growth: growthValue };
    }).sort((a, b) => b.growth - a.growth);
  }, [domainFilter, region, timeframe]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">{payload[0].payload.domain}</p>
          <p className="text-sm font-bold text-white mb-2">{label}</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">+{payload[0].value}%</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Growth YoY</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
            Market Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Software Industry Trends</h1>
          <p className="text-slate-400 text-lg">Real-time analysis of technical role demand and skill acceleration.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Live Updates Active</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-10 bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Market Region</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-slate-900 border-2 border-white/5 rounded-xl px-4 py-2 text-sm font-bold text-slate-300 focus:border-indigo-500 outline-none transition-all cursor-pointer"
          >
            <option>Global</option>
            <option>India</option>
            <option>North America</option>
            <option>Europe</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Vertical Domain</label>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="bg-slate-900 border-2 border-white/5 rounded-xl px-4 py-2 text-sm font-bold text-slate-300 focus:border-indigo-500 outline-none transition-all cursor-pointer"
          >
            <option>All Domains</option>
            <option>AI/ML</option>
            <option>Cloud</option>
            <option>Data</option>
            <option>Security</option>
            <option>Web</option>
            <option>Design</option>
          </select>
        </div>

        <div className="flex-1"></div>

        <div className="flex flex-col gap-1.5 items-end">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mr-1">Time Horizon</label>
          <div className="flex p-1 bg-slate-900 rounded-xl border border-white/10">
            {['2023-2024', '2024-2025'].map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${timeframe === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Primary Growth Chart */}
        <div className="lg:col-span-2 glass p-8 md:p-10 rounded-[48px] border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black tracking-tight">Role Demand Growth</h3>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Percentage Increase YoY ({timeframe})</div>
          </div>

          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={filteredData}
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                  unit="%"
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="growth" radius={[0, 12, 12, 0]} barSize={32}>
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                  ))}
                </Bar>
                <ReferenceLine x={0} stroke="rgba(255,255,255,0.1)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          {/* Emerging Skills Momentum */}
          <div className="glass p-8 rounded-[40px] border border-white/10">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-lg">🚀</span>
              Skill Momentum
            </h3>
            <div className="space-y-6">
              {EMERGING_SKILLS.map(skill => (
                <div key={skill.name} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="block text-sm font-bold text-slate-200">{skill.name}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${skill.type === 'Rising' ? 'text-emerald-400' :
                          skill.type === 'Steady' ? 'text-indigo-400' : 'text-amber-400'
                        }`}>
                        {skill.type}
                      </span>
                    </div>
                    <span className="text-white font-black text-sm">+{skill.growth}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out rounded-full ${skill.type === 'Rising' ? 'bg-emerald-500' :
                          skill.type === 'Steady' ? 'bg-indigo-500' : 'bg-amber-500'
                        }`}
                      style={{ width: `${Math.min(skill.growth / 2, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Quick Stats Card */}
          <div className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
            <h4 className="text-white font-black text-lg mb-6 flex items-center gap-3 relative z-10">
              <span className="text-2xl">💡</span>
              Market Insight
            </h4>
            <p className="text-indigo-100 text-sm leading-relaxed mb-8 relative z-10">
              The shift toward <span className="font-bold text-white">Generative AI</span> has created a 3x demand surge for data professionals with orchestration skills in {timeframe}.
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between relative z-10 border border-white/10">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-indigo-200">Top Sector</span>
                <span className="text-white font-bold text-sm">FinTech / Healthcare</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-black uppercase tracking-widest text-indigo-200">Avg. Salary Growth</span>
                <span className="text-white font-bold text-sm">+22% YoY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Drivers Grid */}
      <div className="mt-20 grid md:grid-cols-3 gap-8">
        {[
          {
            title: 'Massive Automation',
            desc: '72% of Global 2000 companies are automating 40% of their tech infrastructure by 2026.',
            icon: '⚡',
            stat: '72%',
            color: 'text-indigo-400'
          },
          {
            title: 'The AI Pivot',
            desc: 'Job descriptions mentioning "LLM Integration" or "RAG Architectures" grew 400% in 12 months.',
            icon: '🧠',
            stat: '4.5x',
            color: 'text-emerald-400'
          },
          {
            title: 'Remote Global Shift',
            desc: 'Cross-border hiring for niche security roles is reaching an all-time high in emerging markets.',
            icon: '🌍',
            stat: 'High',
            color: 'text-amber-400'
          }
        ].map((driver, i) => (
          <div key={i} className="glass p-10 rounded-[40px] border border-white/10 hover:-translate-y-2 transition-all">
            <div className="flex items-center justify-between mb-8">
              <span className="text-4xl">{driver.icon}</span>
              <span className={`text-2xl font-black ${driver.color}`}>{driver.stat}</span>
            </div>
            <h3 className="text-xl font-black mb-4">{driver.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {driver.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center border-t border-white/5 pt-20">
        <h3 className="text-2xl font-black mb-4">Ready to ride the next wave?</h3>
        <p className="text-slate-500 mb-10 max-w-xl mx-auto">Don't just watch the trends—align your skills with the market's highest demand trajectories today.</p>
        <button
          onClick={() => onNavigate(hasAssessment ? 'results' : 'assessment')}
          className="px-10 py-5 bg-white text-slate-950 rounded-3xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
        >
          {hasAssessment ? 'View Your Personalized Roadmap' : 'Get Your Personalized Roadmap'}
        </button>
      </div>
    </div>
  );
};

export default Analytics;
