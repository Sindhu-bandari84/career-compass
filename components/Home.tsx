
import React from 'react';

interface HomeProps {
  onNavigate: (page: any) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            AI-Powered Career Guidance
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Find the <span className="text-indigo-500">right career.</span><br />
            Build the <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">right skills.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Get personalized career recommendations, identify skill gaps, and follow a structured roadmap to your dream tech role.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('assessment')}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-bold transition-all shadow-xl shadow-indigo-600/30 hover:-translate-y-1 active:scale-95"
            >
              Start Your Journey
            </button>
            <button
              onClick={() => onNavigate('roles')}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-lg font-bold transition-all"
            >
              Explore Careers
            </button>
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-4">
            {[

              { label: 'Curated Resources', icon: '📚' },
              { label: '4-Week Roadmaps', icon: '🗺️' }
            ].map((chip) => (
              <div key={chip.label} className="flex items-center gap-3 px-6 py-4 glass rounded-2xl border border-white/5">
                <span className="text-2xl">{chip.icon}</span>
                <span className="font-semibold text-slate-200">{chip.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="mt-32">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 glass rounded-3xl group hover:border-indigo-500/30 transition-all">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-500 text-2xl mb-6">🎯</div>
              <h3 className="text-xl font-bold mb-4">Personalized Matching</h3>
              <p className="text-slate-400 leading-relaxed">Our AI analyzes your skills, interests, and academics to suggest the perfect fit.</p>
            </div>
            <div className="p-8 glass rounded-3xl group hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-500 text-2xl mb-6">⚒️</div>
              <h3 className="text-xl font-bold mb-4">Skill Gap Analysis</h3>
              <p className="text-slate-400 leading-relaxed">Identify exactly what you're missing for your target role and get a direct path to learn.</p>
            </div>
            <div className="p-8 glass rounded-3xl group hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 text-2xl mb-6">📈</div>
              <h3 className="text-xl font-bold mb-4">Industry Insights</h3>
              <p className="text-slate-400 leading-relaxed">Stay updated with the latest trends and growth data across various tech domains.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
