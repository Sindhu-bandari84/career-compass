
import React, { useState, useMemo } from 'react';
import { AssessmentData, AIRecommendation } from '../types';

interface ResultsProps {
  data: AssessmentData | null;
  recommendations: AIRecommendation[];
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ data, recommendations, onRestart }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const [viewingProject, setViewingProject] = useState<{ name: string, week: number } | null>(null);

  // Explicitly sort recommendations from highest to lowest match percentage for the "Top Picks" section
  const sortedRecs = useMemo(() => {
    return [...recommendations].sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [recommendations]);

  const activeRec = sortedRecs[selectedIdx];

  if (!activeRec) return null;

  const toggleWeek = (weekNum: number) => {
    setActiveWeek(activeWeek === weekNum ? null : weekNum);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
            Strategizing for {data?.field}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Your Career Roadmap</h1>
          <p className="text-slate-400 text-lg">AI-powered skill gap analysis and development plan</p>
        </div>
        <button
          onClick={onRestart}
          className="text-slate-400 font-bold text-sm hover:text-white transition-colors flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
        >
          Retake Assessment ↺
        </button>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-10 items-start">
        {/* Left Column: AI Top Picks Sidebar (Sorted High to Low) */}
        <div className="space-y-4 sticky top-24">
          <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">AI Top Picks</h3>
            <span className="text-[9px] font-bold text-indigo-500 uppercase">Sorted by Match %</span>
          </div>

          {sortedRecs.map((rec, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedIdx(idx);
                setActiveWeek(null);
              }}
              className={`p-7 rounded-[32px] border-2 transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden ${selectedIdx === idx
                ? 'bg-indigo-600/10 border-indigo-500 shadow-2xl shadow-indigo-600/10'
                : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
            >
              {idx === 0 && (
                <div className="absolute -top-1 -right-4 bg-indigo-500 text-white text-[8px] font-black px-6 py-1 rotate-45 shadow-lg z-10">
                  OPTIMAL
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${selectedIdx === idx ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                  Path 0{idx + 1}
                </span>
                <div className="flex flex-col items-end">
                  <span className={`text-2xl font-black transition-colors ${selectedIdx === idx ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-300'}`}>
                    {rec.matchPercentage}%
                  </span>
                  <div className="h-1 w-12 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-1000"
                      style={{ width: `${rec.matchPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-black leading-tight mb-2">{rec.roleName}</h4>
              <p className={`text-xs leading-relaxed line-clamp-2 ${selectedIdx === idx ? 'text-indigo-200/70' : 'text-slate-500'}`}>
                {rec.reasons[0]}
              </p>
            </div>
          ))}
        </div>

        {/* Right Column: Active Path Details */}
        <div className="space-y-10">
          {/* Detailed Justification */}
          <div className="glass p-10 rounded-[48px] border border-white/10 relative overflow-hidden group">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
              <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
              Alignment Analysis
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {activeRec.reasons.map((reason, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <span className="text-indigo-400 text-lg">🎯</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed font-semibold">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Proficiency Matrix */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-[40px] border border-emerald-500/10 bg-emerald-500/[0.02]">
              <h3 className="text-lg font-black mb-6 flex items-center gap-3 text-emerald-400">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xs">✓</span>
                Current Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeRec.skillsHave.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-[11px] font-black border border-emerald-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="glass p-8 rounded-[40px] border border-red-500/10 bg-red-500/[0.02]">
              <h3 className="text-lg font-black mb-6 flex items-center gap-3 text-red-400">
                <span className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-xs">✕</span>
                Skill Deficit
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeRec.skillsMissing.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-[11px] font-black border border-red-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 4-Week Development Roadmap */}
          <div className="glass p-10 rounded-[48px] border border-white/10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
              <div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Technical Blueprint</h3>
                <p className="text-slate-500 text-sm font-medium">A structured timeline to bridge your identified skill gaps</p>
              </div>
              <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center gap-3">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Intensity Level: High</span>
              </div>
            </div>

            <div className="space-y-5">
              {activeRec.roadmap.map((week, idx) => {
                const isOpen = activeWeek === week.week;
                return (
                  <div key={idx} className="group/week">
                    <div
                      onClick={() => toggleWeek(week.week)}
                      className={`flex items-center justify-between p-7 rounded-[32px] border-2 transition-all cursor-pointer ${isOpen
                        ? 'bg-indigo-600/10 border-indigo-500/40 ring-1 ring-indigo-500/20'
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                        }`}
                    >
                      <div className="flex items-center gap-7">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-500 ${isOpen ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 rotate-6' : 'bg-slate-800 text-slate-500'
                          }`}>
                          0{week.week}
                        </div>
                        <div>
                          <h4 className={`text-lg font-black transition-colors ${isOpen ? 'text-white' : 'text-slate-300 group-hover/week:text-white'}`}>
                            {week.topics.join(' & ')}
                          </h4>
                          <span className={`text-[10px] font-black uppercase tracking-[0.25em] transition-colors mt-1 block ${isOpen ? 'text-indigo-400' : 'text-slate-600'}`}>
                            PHASE 0{week.week}
                          </span>
                        </div>
                      </div>
                      <div className={`text-slate-600 transition-all duration-500 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-5 grid md:grid-cols-2 gap-5 px-2 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="bg-slate-900/80 p-8 rounded-[40px] border border-white/5">
                          <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                            Milestone Tasks
                          </h5>
                          <ul className="space-y-5">
                            {week.tasks.map((task, i) => (
                              <li key={i} className="text-sm text-slate-300 flex gap-4 leading-relaxed group/item">
                                <span className="w-2 h-2 rounded-full bg-indigo-600/40 group-hover/item:bg-indigo-600 shrink-0 mt-1.5 transition-colors"></span>
                                <span className="font-medium">{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-indigo-600/5 p-8 rounded-[40px] border border-indigo-500/10 flex flex-col items-center justify-center text-center group/project relative overflow-hidden">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-6">Build & Deploy</span>
                          <div className="text-5xl mb-6 group-hover/project:scale-110 transition-transform">🏗️</div>
                          <h5 className="text-white font-black text-xl leading-tight mb-2 px-6">
                            {week.project}
                          </h5>
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-10">Application Project</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingProject({ name: week.project, week: week.week });
                            }}
                            className="w-full py-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-500/20 active:scale-95 shadow-xl hover:shadow-indigo-600/20"
                          >
                            Open Technical Brief →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Curated Resource Center */}
          <div className="glass p-10 rounded-[48px] border border-white/10">
            <h3 className="text-2xl font-black mb-10 tracking-tight">Verified Learning Resources</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {activeRec.resourceLinks.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-7 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {res.category.toLowerCase().includes('video') ? '🎬' :
                        res.category.toLowerCase().includes('doc') ? '📄' : '🎓'}
                    </div>
                    <div>
                      <span className="block font-black text-slate-200 group-hover:text-indigo-400 transition-colors">
                        {res.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1.5 block">{res.category}</span>
                    </div>
                  </div>
                  <span className="text-slate-700 group-hover:text-indigo-500 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7-7m7 7H3" /></svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Brief Modal */}
      {viewingProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-2xl rounded-[48px] p-10 md:p-14 relative shadow-2xl border border-white/10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <button
              onClick={() => setViewingProject(null)}
              className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group"
            >
              <span className="text-xl font-bold group-hover:rotate-90 transition-transform">✕</span>
            </button>

            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-indigo-600/20 rounded-[32px] flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl shadow-indigo-600/20">🚀</div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-2">Technical Application</h3>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">{viewingProject.name}</h2>
            </div>

            <div className="space-y-10 pr-6">
              <section>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Overview
                </h4>
                <p className="text-slate-300 leading-relaxed font-semibold bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                  Build a production-standard {viewingProject.name} to demonstrate mastery in {activeRec.roleName} fundamentals.
                </p>
              </section>

              <section>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Key Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Standard Architecture",
                    "State / Data Persistence",
                    "Optimized Performance",
                    "Error Handling",
                    "Technical Documentation",
                    "Cloud Deployment"
                  ].map(item => (
                    <div key={item} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 group/check">
                      <div className="w-5 h-5 rounded-md bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover/check:bg-indigo-600 group-hover/check:text-white transition-all">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-[11px] font-black text-slate-300 uppercase tracking-tighter">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setViewingProject(null)}
                className="px-10 py-5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-3xl font-black text-sm transition-all border border-white/10"
              >
                Close Brief
              </button>
              <button
                onClick={() => setViewingProject(null)}
                className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black text-sm transition-all shadow-2xl shadow-indigo-600/40 active:scale-95"
              >
                Accept Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
