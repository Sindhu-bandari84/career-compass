
import React, { useState, useEffect } from 'react';
import { User, AssessmentData, AIRecommendation } from './types';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Auth from './components/Auth';
import Roles from './components/Roles';
import Assessment from './components/Assessment';
import Results from './components/Results';
import Analytics from './components/Analytics';
import Dashboard from './components/Dashboard';
import { PersistenceService } from './services/persistence';

type Page = 'home' | 'dashboard' | 'roles' | 'assessment' | 'results' | 'analytics' | 'login' | 'signup';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Persistence: Check for active session and sync with DB
  useEffect(() => {
    const initSession = async () => {
      const savedUser = localStorage.getItem('career_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);

        // Sync assessment data from MongoDB
        setIsSyncing(true);
        const savedAssessment = await PersistenceService.getLatestAssessment(parsedUser.email);
        if (savedAssessment) {
          const sorted = [...savedAssessment.recommendations].sort((a, b) => b.matchPercentage - a.matchPercentage);
          setAssessmentData(savedAssessment.data);
          setRecommendations(sorted);
        }
        setIsSyncing(false);

        if (window.location.hash === '' || window.location.hash === '#home') {
          setCurrentPage('dashboard');
        }
      }
    };
    initSession();
  }, []);

  const handleNavigate = (page: Page) => {
    const protectedPages: Page[] = ['dashboard', 'assessment', 'results', 'analytics'];

    if (protectedPages.includes(page) && !user) {
      setCurrentPage('login');
      return;
    }

    if (page === 'results' && !assessmentData) {
      setCurrentPage('assessment');
      return;
    }

    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogin = async (u: User) => {
    setUser(u);
    localStorage.setItem('career_user', JSON.stringify(u));

    // Immediately check MongoDB for existing results for this user
    setIsSyncing(true);
    const savedAssessment = await PersistenceService.getLatestAssessment(u.email);
    if (savedAssessment) {
      const sorted = [...savedAssessment.recommendations].sort((a, b) => b.matchPercentage - a.matchPercentage);
      setAssessmentData(savedAssessment.data);
      setRecommendations(sorted);
    }
    setIsSyncing(false);

    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAssessmentData(null);
    setRecommendations([]);
    localStorage.removeItem('career_user');
    setCurrentPage('home');
  };

  const handleAssessmentComplete = async (data: AssessmentData, recs: AIRecommendation[]) => {
    // Sort high to low before setting state to ensure UI consistency
    const sorted = [...recs].sort((a, b) => b.matchPercentage - a.matchPercentage);
    setAssessmentData(data);
    setRecommendations(sorted);

    // Save to MongoDB in the background
    if (user) {
      await PersistenceService.saveAssessment(user, data, sorted);
    }

    setCurrentPage('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />

      {isSyncing && (
        <div className="fixed top-16 left-0 w-full h-1 bg-indigo-500/20 z-50">
          <div className="h-full bg-indigo-500 animate-[shimmer_2s_infinite_linear] w-1/3"></div>
        </div>
      )}

      <main className="pt-16">
        {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
        {currentPage === 'dashboard' && (
          <Dashboard
            user={user}
            onNavigate={handleNavigate}
            hasAssessment={!!assessmentData}
            topMatch={recommendations[0]?.roleName}
            matchPercentage={recommendations[0]?.matchPercentage}
          />
        )}
        {(currentPage === 'login' || currentPage === 'signup') && (
          <Auth
            mode={currentPage as 'login' | 'signup'}
            onSuccess={handleLogin}
            onToggle={() => setCurrentPage(currentPage === 'login' ? 'signup' : 'login')}
          />
        )}
        {currentPage === 'roles' && <Roles user={user} onNavigate={handleNavigate} />}
        {currentPage === 'assessment' && (
          <Assessment onComplete={handleAssessmentComplete} />
        )}
        {currentPage === 'results' && (
          <Results
            data={assessmentData}
            recommendations={recommendations}
            onRestart={() => setCurrentPage('assessment')}
          />
        )}
        {currentPage === 'analytics' && (
          <Analytics
            onNavigate={handleNavigate}
            hasAssessment={!!assessmentData}
          />
        )}
      </main>


    </div>
  );
};

export default App;
