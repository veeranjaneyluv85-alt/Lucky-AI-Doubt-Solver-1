
import React, { useState, useEffect } from 'react';
import { UserProfile, TabType } from './types';
import { HomeIcon, LuckyIcon, QuizIcon, GearIcon } from './components/Icons';
import ProfileSetup from './components/ProfileSetup';
import HomeTab from './components/HomeTab';
import LuckyTab from './components/LuckyTab';
import QuizTab from './components/QuizTab';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('lucky_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setIsInitialized(true);
  }, []);

  const handleProfileComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('lucky_profile', JSON.stringify(newProfile));
  };

  const handleReset = () => {
    if (confirm("Reset profile and settings? This will clear all local data.")) {
      localStorage.removeItem('lucky_profile');
      setProfile(null);
      setActiveTab('home');
    }
  };

  if (!isInitialized) return null;

  if (!profile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  const NavItem = ({ tab, icon: Icon, label }: { tab: TabType, icon: any, label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-4 p-3 md:px-5 md:py-4 rounded-2xl md:w-full transition-all group relative ${
          isActive 
            ? 'bg-violet-600 text-white shadow-xl shadow-violet-200 ring-1 ring-violet-400/50' 
            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
        }`}
      >
        <div className={`p-1 rounded-lg ${isActive ? 'bg-white/10' : ''}`}>
          <Icon className={`w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
        </div>
        <span className="text-[10px] md:text-sm font-extrabold uppercase tracking-widest">{label}</span>
        {isActive && (
          <span className="hidden md:block absolute right-0 translate-x-1/2 w-1.5 h-6 bg-white rounded-full"></span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col md:flex-row text-slate-900 overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col items-center py-10 w-[140px] bg-white border-r border-slate-100 h-screen sticky top-0 z-50">
        <div className="mb-12 group cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[22px] flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-500">
            <LuckyIcon className="w-10 h-10" />
          </div>
          <div className="mt-2 text-center text-[10px] font-black text-violet-600 uppercase tracking-tighter">LUCKY</div>
        </div>
        <div className="flex flex-col gap-6 w-full px-4">
          <NavItem tab="home" icon={HomeIcon} label="Home" />
          <NavItem tab="lucky" icon={LuckyIcon} label="Lucky" />
          <NavItem tab="quiz" icon={QuizIcon} label="Quiz" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <LuckyIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">LUCKY A.I</h1>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                Class {profile.classLevel} • {profile.board}
              </p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-rose-100 hover:text-rose-600 transition-all active:scale-90 border border-transparent hover:border-rose-200"
            title="Settings"
          >
            <GearIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:p-10 max-w-[1200px] mx-auto w-full">
          {activeTab === 'home' && <HomeTab profile={profile} />}
          {activeTab === 'lucky' && <LuckyTab profile={profile} />}
          {activeTab === 'quiz' && <QuizTab profile={profile} />}
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[32px] p-2 flex items-center justify-around shadow-[0_20px_50px_rgba(124,58,237,0.15)] ring-1 ring-slate-900/5">
          <NavItem tab="home" icon={HomeIcon} label="Home" />
          <NavItem tab="lucky" icon={LuckyIcon} label="Lucky" />
          <NavItem tab="quiz" icon={QuizIcon} label="Quiz" />
        </nav>
        
        {/* Padding for mobile nav */}
        <div className="md:hidden h-28"></div>
      </main>
    </div>
  );
};

export default App;
