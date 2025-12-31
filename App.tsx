
import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import AskDoubt from './components/AskDoubt';
import Quiz from './components/Quiz';
import Profile from './components/Profile';
import { TabType, UserProfile } from './types';
import { Icons } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [hasProfile, setHasProfile] = useState<boolean>(true);

  const checkProfile = () => {
    const saved = localStorage.getItem('lucky_user_profile');
    setHasProfile(!!saved);
  };

  useEffect(() => {
    checkProfile();
    window.addEventListener('profileUpdated', checkProfile);
    return () => window.removeEventListener('profileUpdated', checkProfile);
  }, []);

  // If no profile, force profile setup view
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <Profile />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 md:pt-16">
      {/* Header (Desktop) */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-50 items-center justify-between px-8 shadow-sm">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setActiveTab('home')}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Icons.Robot />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">Lucky AI Doubt Solver</span>
        </div>

        <nav className="flex items-center gap-1">
          <button 
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'home' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('ask')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'ask' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Ask Doubt
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'quiz' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Quiz
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Profile
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'home' && <Home onNavigate={setActiveTab} />}
        {activeTab === 'ask' && <AskDoubt />}
        {activeTab === 'quiz' && <Quiz />}
        {activeTab === 'profile' && <Profile />}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex items-center justify-around px-4 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] transition-all ${activeTab === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
        >
          <Icons.Home />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('ask')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] transition-all ${activeTab === 'ask' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
        >
          <Icons.Chat />
          <span className="text-[10px] font-bold uppercase tracking-wider">Doubt</span>
        </button>
        <button 
          onClick={() => setActiveTab('quiz')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] transition-all ${activeTab === 'quiz' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
        >
          <Icons.Quiz />
          <span className="text-[10px] font-bold uppercase tracking-wider">Quiz</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] transition-all ${activeTab === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
        >
          <Icons.User />
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
