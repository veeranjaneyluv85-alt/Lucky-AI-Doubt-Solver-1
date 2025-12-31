
import React, { useState, useEffect } from 'react';
import { Icons, AVATARS } from '../constants';
import { TabType, UserProfile } from '../types';

interface HomeProps {
  onNavigate: (tab: TabType) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const loadProfile = () => {
    const saved = localStorage.getItem('lucky_user_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener('profileUpdated', loadProfile);
    return () => window.removeEventListener('profileUpdated', loadProfile);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="text-center mb-16">
        {profile ? (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-md border-2 border-blue-50 flex items-center justify-center text-5xl mb-6 animate-bounce">
              {AVATARS[profile.avatarId]}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Welcome back, <span className="text-blue-600">{profile.name}</span>!
            </h1>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center justify-center p-4 bg-blue-100 text-blue-600 rounded-full mb-6">
              <Icons.Robot />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Meet <span className="text-blue-600">Lucky</span>
            </h1>
          </>
        )}
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your friendly AI robot friend who helps you master your studies from Class 6 to Engineering.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <button 
          onClick={() => onNavigate('ask')}
          className="group p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icons.Chat />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Ask a Doubt</h3>
          <p className="text-gray-500 mb-6">Got a tricky homework question? Lucky is here to explain it step-by-step.</p>
          <span className="inline-flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
            Start Chatting <Icons.ChevronRight />
          </span>
        </button>

        <button 
          onClick={() => onNavigate('quiz')}
          className="group p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icons.Quiz />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Take a Quiz</h3>
          <p className="text-gray-500 mb-6">Test your knowledge with fun, AI-powered quizzes tailored for your grade.</p>
          <span className="inline-flex items-center text-emerald-600 font-semibold group-hover:translate-x-1 transition-transform">
            Start Learning <Icons.ChevronRight />
          </span>
        </button>

        {!profile && (
          <button 
            onClick={() => onNavigate('profile')}
            className="md:col-span-2 group p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-sm hover:shadow-md transition-all text-left text-white"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Personalize Your Journey</h3>
                <p className="text-blue-100 mb-4 sm:mb-0">Tell Lucky about your grade and goals to get better help!</p>
              </div>
              <span className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold group-hover:scale-105 transition-transform">
                Complete Profile <Icons.ChevronRight />
              </span>
            </div>
          </button>
        )}
      </div>

      <div className="mt-20 p-8 bg-blue-600 rounded-3xl text-white">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">7+</div>
            <div className="text-blue-100 opacity-80 text-sm">Class Levels</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">Instant</div>
            <div className="text-blue-100 opacity-80 text-sm">Doubt Resolution</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">Dynamic</div>
            <div className="text-blue-100 opacity-80 text-sm">Quiz System</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
