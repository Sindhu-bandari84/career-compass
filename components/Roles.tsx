
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ALL_ROLES } from '../constants';
import { CareerRole, User } from '../types';

interface RolesProps {
  user: User | null;
  onNavigate: (page: any) => void;
}

const Roles: React.FC<RolesProps> = ({ user, onNavigate }) => {
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [activeRole, setActiveRole] = useState<CareerRole | null>(null);

  // Custom Dropdown States
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const domainRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);

  const domains = ['All Domains', ...new Set(ALL_ROLES.map(r => r.domain))];
  const levels = ['All Levels', 'Entry Level', 'Mid Level', 'Senior Level'];

  // Handle outside clicks for custom dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (domainRef.current && !domainRef.current.contains(e.target as Node)) setIsDomainOpen(false);
      if (levelRef.current && !levelRef.current.contains(e.target as Node)) setIsLevelOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRoles = useMemo(() => {
    return ALL_ROLES.filter(role => {
      // Improved multi-keyword partial matching
      const keywords = search.toLowerCase().split(' ').filter(k => k.length > 0);
      const matchesSearch = keywords.length === 0 || keywords.every(keyword =>
        role.name.toLowerCase().includes(keyword) ||
        role.domain.toLowerCase().includes(keyword) ||
        role.description.toLowerCase().includes(keyword) ||
        role.skills.some(s => s.toLowerCase().includes(keyword))
      );

      const matchesDomain = selectedDomain === 'All Domains' || role.domain === selectedDomain;
      const matchesLevel = selectedLevel === 'All Levels' || role.level === selectedLevel;

      return matchesSearch && matchesDomain && matchesLevel;
    });
  }, [search, selectedDomain, selectedLevel]);

  const handleCardClick = (role: CareerRole) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    setActiveRole(role);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedDomain('All Domains');
    setSelectedLevel('All Levels');
  };

  const isFilterActive = search !== '' || selectedDomain !== 'All Domains' || selectedLevel !== 'All Levels';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Role Library</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Explore in-demand tech roles. Deep-dive into roadmaps, required technologies, and project ideas.
          </p>
        </div>
        {isFilterActive && (
          <button
            onClick={clearFilters}
            className="text-indigo-400 font-bold text-sm hover:text-indigo-300 transition-colors flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/5 border border-indigo-500/20"
          >
            Clear All Filters ✕
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-12 relative z-40">
        {/* Search Input */}
        <div className="flex-1 relative group">
          <input
            type="text"
            placeholder="Search roles, domains, or specific skills (e.g. 'React Python')..."
            className="w-full bg-white/5 border-2 border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-white placeholder:text-slate-600 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* Custom Domain Dropdown */}
        <div className="relative min-w-[200px]" ref={domainRef}>
          <button
            onClick={() => setIsDomainOpen(!isDomainOpen)}
            className={`w-full flex items-center justify-between bg-white/5 border-2 rounded-2xl px-6 py-4 transition-all hover:bg-white/10 ${isDomainOpen ? 'border-indigo-500' : 'border-white/5'}`}
          >
            <span className={`text-sm font-bold ${selectedDomain === 'All Domains' ? 'text-slate-400' : 'text-indigo-400'}`}>
              {selectedDomain}
            </span>
            <svg className={`w-4 h-4 transition-transform ${isDomainOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {isDomainOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {domains.map(d => (
                <button
                  key={d}
                  onClick={() => { setSelectedDomain(d); setIsDomainOpen(false); }}
                  className={`w-full px-6 py-3 text-left text-sm font-semibold transition-colors hover:bg-indigo-600/10 ${selectedDomain === d ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400 hover:text-white'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Level Dropdown */}
        <div className="relative min-w-[200px]" ref={levelRef}>
          <button
            onClick={() => setIsLevelOpen(!isLevelOpen)}
            className={`w-full flex items-center justify-between bg-white/5 border-2 rounded-2xl px-6 py-4 transition-all hover:bg-white/10 ${isLevelOpen ? 'border-indigo-500' : 'border-white/5'}`}
          >
            <span className={`text-sm font-bold ${selectedLevel === 'All Levels' ? 'text-slate-400' : 'text-indigo-400'}`}>
              {selectedLevel}
            </span>
            <svg className={`w-4 h-4 transition-transform ${isLevelOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {isLevelOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {levels.map(l => (
                <button
                  key={l}
                  onClick={() => { setSelectedLevel(l); setIsLevelOpen(false); }}
                  className={`w-full px-6 py-3 text-left text-sm font-semibold transition-colors hover:bg-indigo-600/10 ${selectedLevel === l ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400 hover:text-white'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredRoles.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleCardClick(role)}
              className="glass p-8 rounded-[40px] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-indigo-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl grayscale group-hover:grayscale-0 transition-all duration-500 scale-90 group-hover:scale-110">
                  {role.icon}
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  {role.domain}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3 flex items-center justify-between">
                {role.name}
              </h3>

              <div className="flex gap-2 mb-6">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tighter ${role.level === 'Entry Level' ? 'bg-emerald-500/10 text-emerald-400' :
                    role.level === 'Mid Level' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                  {role.level}
                </span>
              </div>

              <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-2">
                {role.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {role.skills.slice(0, 4).map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-xl bg-white/5 text-[11px] text-slate-300 font-bold border border-white/5 group-hover:border-indigo-500/10 transition-colors">
                    {skill}
                  </span>
                ))}
                {role.skills.length > 4 && (
                  <span className="text-[10px] text-slate-500 font-bold self-center">+{role.skills.length - 4} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center glass rounded-[40px] border border-dashed border-white/10">
          <div className="text-6xl mb-6 opacity-20">🔍</div>
          <h2 className="text-2xl font-bold mb-2">No roles found matching your search</h2>
          <p className="text-slate-500 mb-8">Try adjusting your keywords or clearing the filters.</p>
          <button
            onClick={clearFilters}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Role Details Modal - Maintained from original logic but styled */}
      {activeRole && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 w-full max-w-5xl rounded-[48px] p-8 md:p-12 relative max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-300 custom-scrollbar">
            <button
              onClick={() => setActiveRole(null)}
              className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group"
            >
              <span className="text-xl group-hover:rotate-90 transition-transform">✕</span>
            </button>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
              <span className="text-7xl md:text-8xl drop-shadow-2xl">{activeRole.icon}</span>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-lg bg-indigo-600/10 text-indigo-400 text-[10px] font-black tracking-widest uppercase">
                    {activeRole.domain}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-black tracking-widest uppercase">
                    {activeRole.level}
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight">{activeRole.name}</h2>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_350px] gap-12 lg:gap-20">
              <div className="space-y-12">
                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">The Opportunity</h3>
                  <p className="text-slate-300 text-lg leading-relaxed font-medium">
                    {activeRole.overview || activeRole.description}
                  </p>
                </section>

                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Tech Stack & Tools</h3>
                  <div className="flex flex-wrap gap-3">
                    {(activeRole.tools || activeRole.skills).map(tool => (
                      <div key={tool} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all group">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:shadow-[0_0_8px_rgba(99,102,241,0.8)] transition-all"></span>
                        <span className="text-sm font-bold text-slate-200">{tool}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Capstone Project Ideas</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(activeRole.projects || ['E-commerce Application', 'Task Manager API', 'Real-time Chat App']).map((p, idx) => (
                      <div key={idx} className="p-6 rounded-3xl bg-indigo-600/5 border border-indigo-500/10 flex gap-4">
                        <span className="text-xl">🚀</span>
                        <p className="text-slate-300 text-sm font-bold leading-snug">{p}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-12">
                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">8-Week Blueprint</h3>
                  <div className="space-y-4">
                    {(activeRole.roadmap8Week || [
                      'Foundations & Core Logic',
                      'Intermediate Tooling',
                      'Advanced Architectures',
                      'Deployment & Optimization'
                    ]).map((week, idx) => (
                      <div key={idx} className="flex gap-5 group">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs font-black text-slate-500 group-hover:border-indigo-500 group-hover:text-indigo-400 transition-all">
                            0{idx + 1}
                          </div>
                          {idx !== 3 && <div className="w-0.5 flex-1 bg-white/5 my-2"></div>}
                        </div>
                        <div className="py-2">
                          <p className="text-slate-200 font-bold text-sm group-hover:text-white transition-colors">{week}</p>
                          <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">Phase {idx + 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Verified Resources</h3>
                  <div className="space-y-3">
                    {(activeRole.resources || [
                      { name: 'Official Documentation', url: '#', type: 'doc' },
                      { name: 'Best Practice Guide', url: '#', type: 'doc' },
                      { name: 'Masterclass Video', url: '#', type: 'video' }
                    ]).map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/20 hover:bg-white/10 transition-all group"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-300 group-hover:text-indigo-400 transition-colors">
                            {res.name}
                          </p>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-black mt-1">{res.type}</p>
                        </div>
                        <span className="text-slate-700 group-hover:text-indigo-500 transition-all">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </span>
                      </a>
                    ))}
                  </div>
                </section>

                <button
                  onClick={() => onNavigate('assessment')}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                >
                  Analyze My Fit
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
