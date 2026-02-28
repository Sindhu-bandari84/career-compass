
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SKILL_CATEGORIES } from '../constants';
import { AssessmentData, SkillRating, AIRecommendation } from '../types';
import { getCareerRecommendations } from '../services/gemini';

interface AssessmentProps {
  onComplete: (data: AssessmentData, recs: AIRecommendation[]) => void;
}

const FIELD_OPTIONS = [
  { id: 'CSE', label: 'Computer Science & Engineering', icon: '💻', desc: 'Software, Algorithms, Systems' },
  { id: 'IT', label: 'Information Technology', icon: '🌐', desc: 'Networking, Databases, Web' },
  { id: 'AIML', label: 'AI & Machine Learning', icon: '🤖', desc: 'Neural Networks, Data Intelligence' },
  { id: 'DS', label: 'Data Science', icon: '📊', desc: 'Statistics, Analytics, Big Data' },
  { id: 'ECE', label: 'Electronics & Communication', icon: '📡', desc: 'Hardware, Signals, Embedded' },
  { id: 'IOT', label: 'Internet of Things', icon: '🏠', desc: 'Smart Devices, Sensors, Connectivity' },
  { id: 'CS', label: 'Cybersecurity', icon: '🛡️', desc: 'Network Security, Ethical Hacking' },
  { id: 'Mechanical', label: 'Mechanical Engineering', icon: '⚙️', desc: 'Robotics, Design, Manufacturing' },
  { id: 'Civil', label: 'Civil Engineering', icon: '🏗️', desc: 'Infrastructure, Planning, CAD' },
  { id: 'Other', label: 'Other / Custom Field', icon: '✨', desc: 'Multidisciplinary or Specialized' },
];

const loadingMessages = [
  "Initializing AI Engine...",
  "Connecting to Secure Backend...",
  "Syncing Profile with Database...",
  "Analyzing skill-role compatibility...",
  "Scanning industry trends...",
  "Synthesizing 4-week roadmap...",
  "Optimizing results for you..."
];

const Assessment: React.FC<AssessmentProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [otherInterest, setOtherInterest] = useState('');
  const [fieldSearch, setFieldSearch] = useState('');
  const [isFieldOpen, setIsFieldOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<AssessmentData>({
    userType: 'Current Student',
    field: 'CSE',
    cgpa: 8.0,
    interests: [],
    skills: [],
    aptitudeScore: 50
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fieldRef.current && !fieldRef.current.contains(event.target as Node)) {
        setIsFieldOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredFields = useMemo(() => {
    return FIELD_OPTIONS.filter(f =>
      f.label.toLowerCase().includes(fieldSearch.toLowerCase()) ||
      f.id.toLowerCase().includes(fieldSearch.toLowerCase())
    );
  }, [fieldSearch]);

  const selectedFieldData = useMemo(() =>
    FIELD_OPTIONS.find(f => f.id === data.field) || FIELD_OPTIONS[0]
    , [data.field]);

  const filteredContent = useMemo(() => {
    const f = data.field;
    const allInterests = [
      'Data Analysis', 'Web Development', 'Mobile Development',
      'Cloud Computing', 'Cybersecurity', 'AI/ML',
      'DevOps', 'Quality Assurance', 'UI/UX Design',
      'Blockchain', 'IoT', 'Embedded Systems', 'Robotics', 'Product Management'
    ];

    const interestMapping: Record<string, string[]> = {
      'CSE': ['Web Development', 'Mobile Development', 'Data Analysis', 'Cloud Computing', 'Cybersecurity', 'AI/ML', 'DevOps', 'UI/UX Design', 'Blockchain'],
      'IT': ['Web Development', 'Mobile Development', 'Data Analysis', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Quality Assurance'],
      'CS': ['AI/ML', 'Data Analysis', 'Web Development', 'Cybersecurity', 'Blockchain'],
      'AIML': ['AI/ML', 'Data Analysis', 'Robotics', 'Web Development'],
      'DS': ['Data Analysis', 'AI/ML', 'Cloud Computing'],
      'ECE': ['Embedded Systems', 'IoT', 'Robotics', 'Data Analysis', 'Cloud Computing', 'Cybersecurity'],
      'IOT': ['IoT', 'Embedded Systems', 'Cloud Computing', 'Cybersecurity', 'DevOps'],
      'Mechanical': ['Robotics', 'Embedded Systems', 'Data Analysis', 'Product Management'],
      'Civil': ['Data Analysis', 'Product Management', 'Web Development'],
      'Other': allInterests
    };

    const skillCategoryMapping: Record<string, string[]> = {
      'CSE': ['Programming', 'Web Technologies', 'Cloud & DevOps', 'Security', 'AI/ML'],
      'IT': ['Programming', 'Web Technologies', 'Cloud & DevOps', 'Security'],
      'CS': ['Programming', 'Web Technologies', 'AI/ML', 'Security'],
      'AIML': ['Programming', 'AI/ML', 'Data & Analytics'],
      'DS': ['Programming', 'Data & Analytics', 'AI/ML'],
      'ECE': ['Programming', 'Embedded & IoT', 'Security', 'Cloud & DevOps'],
      'IOT': ['Programming', 'Embedded & IoT', 'Cloud & DevOps', 'Security'],
      'Mechanical': ['Data & Analytics', 'Embedded & IoT', 'Programming', 'Business & Design'],
      'Civil': ['Data & Analytics', 'Programming', 'Business & Design'],
      'Other': SKILL_CATEGORIES.map(c => c.category)
    };

    const displayInterests = interestMapping[f] || allInterests;
    const displaySkillCategories = SKILL_CATEGORIES.filter(c =>
      (skillCategoryMapping[f] || []).includes(c.category)
    );

    return {
      interests: displayInterests,
      skillCategories: displaySkillCategories.length > 0 ? displaySkillCategories : SKILL_CATEGORIES
    };
  }, [data.field]);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
        setProgress((prev) => Math.min(prev + Math.floor(Math.random() * 20) + 10, 98));
      }, 1500);
    } else {
      setLoadingMsgIdx(0);
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleInterestToggle = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAddOtherInterest = () => {
    if (otherInterest.trim() && !data.interests.includes(otherInterest.trim())) {
      handleInterestToggle(otherInterest.trim());
      setOtherInterest('');
    }
  };

  const handleSkillChange = (skillName: string, rating: number) => {
    setData(prev => {
      const existingIndex = prev.skills.findIndex(s => s.name === skillName);
      if (rating === 0) {
        if (existingIndex === -1) return prev;
        return { ...prev, skills: prev.skills.filter(s => s.name !== skillName) };
      }
      if (existingIndex !== -1) {
        const newSkills = [...prev.skills];
        newSkills[existingIndex] = { name: skillName, rating };
        return { ...prev, skills: newSkills };
      }
      return { ...prev, skills: [...prev.skills, { name: skillName, rating }] };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log("Submitting assessment data to AI service...", data);
    try {
      const recs = await getCareerRecommendations(data);
      if (!recs || recs.length === 0) {
        throw new Error("The AI failed to generate recommendations. This usually happens if the API Key is invalid or rate limits are reached. Check the browser console for details.");
      }
      setProgress(100);
      setTimeout(() => {
        onComplete(data, recs);
      }, 400);
    } catch (err: any) {
      console.error("ASSESSMENT SUBMISSION FAILED:", err);
      alert(err.message || "We encountered an error analyzing your profile. Please check the console for more information.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <div className="relative mb-12">
          <div className="w-28 h-28 border-[6px] border-indigo-600/10 rounded-full"></div>
          <div className="absolute inset-0 w-28 h-28 border-t-[6px] border-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-black text-indigo-400 tracking-tighter">{progress}%</span>
          </div>
          <div className="absolute -inset-6 bg-indigo-500/10 blur-3xl rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-4xl font-black mb-6 tracking-tight">Processing <span className="text-indigo-500">Fast</span></h2>
        <div className="h-10">
          <p className="text-slate-400 font-medium text-lg tracking-wide" key={loadingMsgIdx}>
            {loadingMessages[loadingMsgIdx]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Career Assessment</h1>
        <p className="text-slate-400">Personalized for <span className="text-indigo-400 font-bold">{selectedFieldData.label}</span> experts</p>
      </div>

      <div className="mb-12 px-2">
        <div className="flex justify-between mb-4">
          {['Identity', 'Passion', 'Expertise', 'Review'].map((label, idx) => (
            <span key={label} className={`text-[10px] font-bold uppercase tracking-[0.2em] ${step >= idx + 1 ? 'text-indigo-400' : 'text-slate-600'}`}>
              {label}
            </span>
          ))}
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-[length:200%_100%] animate-shimmer transition-all duration-700" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      </div>

      <div className="glass p-8 md:p-12 rounded-[48px] border border-white/10 relative overflow-visible">
        {step === 1 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Basic Information</h2>
              <p className="text-slate-400 text-sm leading-relaxed">Help us understand your current academic or professional standing.</p>
            </div>

            <div className="space-y-6">
              <label className="text-xs font-bold uppercase tracking-widest text-indigo-400/80">Current Status</label>
              <div className="grid sm:grid-cols-3 gap-4">
                {['Current Student', 'Job Seeker', 'Working Professional'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setData({ ...data, userType: type })}
                    className={`relative p-5 rounded-3xl border-2 transition-all duration-300 text-left group ${data.userType === type ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                  >
                    <div className={`text-sm font-bold mb-1 transition-colors ${data.userType === type ? 'text-white' : 'text-slate-400'}`}>{type}</div>
                    {data.userType === type && <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4" ref={fieldRef}>
                <label className="text-xs font-bold uppercase tracking-widest text-indigo-400/80">Branch / Field of Study</label>
                <div className="relative">
                  <button
                    onClick={() => setIsFieldOpen(!isFieldOpen)}
                    className="w-full flex items-center justify-between bg-slate-900/50 border-2 border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer font-medium text-left hover:bg-slate-900/80"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedFieldData.icon}</span>
                      <div>
                        <div className="text-sm font-bold">{selectedFieldData.label}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{selectedFieldData.desc}</div>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 transition-transform ${isFieldOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {isFieldOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-white/5">
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search branches..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                          value={fieldSearch}
                          onChange={e => setFieldSearch(e.target.value)}
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {filteredFields.map(field => (
                          <div
                            key={field.id}
                            onClick={() => {
                              setData({ ...data, field: field.id, interests: [], skills: [] });
                              setIsFieldOpen(false);
                              setFieldSearch('');
                            }}
                            className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition-colors ${data.field === field.id ? 'bg-indigo-600/20' : 'hover:bg-white/5'}`}
                          >
                            <span className="text-xl">{field.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-bold truncate ${data.field === field.id ? 'text-indigo-400' : 'text-slate-300'}`}>{field.label}</div>
                              <div className="text-[10px] text-slate-500 truncate">{field.desc}</div>
                            </div>
                            {data.field === field.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-indigo-400/80">Academic Performance</label>
                  <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full font-bold text-sm border border-indigo-500/30">
                    {data.cgpa.toFixed(1)} CGPA
                  </span>
                </div>
                <div className="relative pt-4">
                  <input
                    type="range"
                    min="4" max="10" step="0.1"
                    className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                    value={data.cgpa}
                    onChange={e => setData({ ...data, cgpa: parseFloat(e.target.value) })}
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 font-bold mt-3">
                    <span>4.0</span>
                    <span>7.0</span>
                    <span>10.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Areas of Interest</h2>
              <p className="text-slate-400 text-sm leading-relaxed">Curated for {selectedFieldData.label} background. Select your passions.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredContent.interests.map(interest => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-5 rounded-3xl border-2 text-sm font-bold transition-all duration-300 ${data.interests.includes(interest)
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 block">Something else?</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="E.g. Bio-informatics, FinTech, Game Dev..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-indigo-500"
                  value={otherInterest}
                  onChange={e => setOtherInterest(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddOtherInterest()}
                />
                <button
                  onClick={handleAddOtherInterest}
                  className="px-6 py-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-2xl text-sm font-bold transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Technical Proficiency</h2>
              <p className="text-slate-400 text-sm leading-relaxed">Rate your existing skills within the {selectedFieldData.label} ecosystem.</p>
            </div>
            <div className="space-y-10 max-h-[550px] overflow-y-auto pr-4 custom-scrollbar">
              {filteredContent.skillCategories.map((cat) => (
                <div key={cat.category}>
                  <h3 className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {cat.category}
                  </h3>
                  <div className="space-y-3">
                    {cat.skills.map((skill) => {
                      const currentSkill = data.skills.find(s => s.name === skill);
                      return (
                        <div key={skill} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[32px] border-2 transition-all duration-300 ${currentSkill ? 'bg-indigo-600/5 border-indigo-500/20 shadow-lg shadow-indigo-600/5' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                          <div className="flex items-center gap-4 group/skill cursor-pointer" onClick={() => handleSkillChange(skill, currentSkill ? 0 : 3)}>
                            <div
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${currentSkill ? 'bg-indigo-600 border-indigo-500' : 'border-white/10 bg-transparent group-hover/skill:border-white/30'}`}
                            >
                              {currentSkill && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={`font-semibold text-sm tracking-tight transition-colors ${currentSkill ? 'text-white' : 'text-slate-500 group-hover/skill:text-slate-300'}`}>{skill}</span>
                          </div>
                          {currentSkill && (
                            <div className="flex gap-1.5">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                  key={num}
                                  onClick={() => handleSkillChange(skill, num)}
                                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${currentSkill.rating === num ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/10 text-slate-500 hover:bg-white/20'}`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Final Profile Review</h2>
              <p className="text-slate-400 text-sm leading-relaxed">Confirm your details before we compute your roadmap.</p>
            </div>

            <div className="p-10 rounded-[48px] bg-indigo-600/5 border border-indigo-500/20 grid grid-cols-2 gap-x-12 gap-y-8 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="text-9xl">✨</span>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block opacity-70">Current Status</span>
                <span className="text-white font-bold text-lg">{data.userType}</span>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block opacity-70">Primary Field</span>
                <span className="text-white font-bold text-lg">{selectedFieldData.label}</span>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block opacity-70">Academic Score</span>
                <span className="text-white font-bold text-lg">{data.cgpa} / 10.0</span>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block opacity-70">Expertise Logged</span>
                <span className="text-white font-bold text-lg">{data.skills.length} technical skills</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-center px-2">
                <div>
                  <label className="text-sm font-bold text-slate-300">Self-Assessed Logic Aptitude</label>
                  <p className="text-[10px] text-slate-500">Rate your problem-solving and logical reasoning confidence.</p>
                </div>
                <span className="text-indigo-400 font-black text-3xl tracking-tighter">{data.aptitudeScore}%</span>
              </div>
              <div className="relative pt-2">
                <input
                  type="range"
                  min="0" max="100"
                  className="w-full h-2.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                  value={data.aptitudeScore}
                  onChange={e => setData({ ...data, aptitudeScore: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 pt-10 border-t border-white/5 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>

          {step === 4 ? (
            <button
              onClick={handleSubmit}
              className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-600/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            >
              Analyze & Build Roadmap
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-3 group"
            >
              Next Phase
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
