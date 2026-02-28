
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: any) => void;
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, user, onLogout }) => {
  // Common menu items shown to everyone
  // Assessment, Results, and Analytics are protected in App.tsx navigation logic
  const menuItems = [
    { label: user ? 'Dashboard' : 'Home', value: user ? 'dashboard' : 'home' },
    { label: 'Roles', value: 'roles' },
    { label: 'Assessment', value: 'assessment' },
    { label: 'Results', value: 'results' },
    { label: 'Analytics', value: 'analytics' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate(user ? 'dashboard' : 'home')}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/20">
            C
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Career Compass
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {menuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onNavigate(item.value)}
              className={`text-sm font-medium transition-all hover:text-indigo-400 relative py-1 ${
                currentPage === item.value ? 'text-indigo-500' : 'text-slate-400'
              }`}
            >
              {item.label}
              {currentPage === item.value && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full animate-in fade-in zoom-in duration-300"></span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end justify-center">
                <span className="text-xs font-bold text-white leading-tight">{user.fullName}</span>
              </div>
              <button 
                onClick={onLogout}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('login')}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => onNavigate('signup')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
