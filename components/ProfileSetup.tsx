
import React, { useState } from 'react';
import { UserProfile, ClassLevel, BoardType, AppLanguage, SecondLanguage } from '../types';
import { LuckyIcon } from './Icons';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>('10');
  const [board, setBoard] = useState<BoardType>('CBSE');
  const [language, setLanguage] = useState<AppLanguage>('English');
  const [secondLanguage, setSecondLanguage] = useState<SecondLanguage>('None');

  const showSecondLang = board === 'CBSE' && (classLevel === '9' || classLevel === '10');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const profile: UserProfile = {
      name,
      classLevel,
      board,
      language,
      secondLanguage: showSecondLang ? secondLanguage : undefined
    };

    onComplete(profile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF] p-6">
      <div className="bg-white rounded-[48px] shadow-[0_40px_100px_-20px_rgba(79,70,229,0.15)] p-10 md:p-16 max-w-xl w-full border border-slate-50 animate-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[28px] flex items-center justify-center text-white mb-6 shadow-2xl rotate-3">
             <LuckyIcon className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter leading-none">Welcome to Lucky</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-[280px]">Your personal AI learning journey starts here.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-4">Full Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-8 py-5 bg-slate-50 text-slate-900 border border-transparent rounded-[24px] focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none transition-all font-bold text-lg shadow-inner"
              placeholder="e.g. Alex Johnson"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-4">Class</label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                className="w-full px-8 py-5 bg-slate-50 text-slate-900 border border-transparent rounded-[24px] focus:bg-white focus:border-violet-500 outline-none transition-all font-bold appearance-none cursor-pointer shadow-inner"
              >
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="Intermediate">Intermediate</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-4">Board</label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value as BoardType)}
                className="w-full px-8 py-5 bg-slate-50 text-slate-900 border border-transparent rounded-[24px] focus:bg-white focus:border-violet-500 outline-none transition-all font-bold appearance-none cursor-pointer shadow-inner"
              >
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-4">Medium of Instruction</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              className="w-full px-8 py-5 bg-slate-50 text-slate-900 border border-transparent rounded-[24px] focus:bg-white focus:border-violet-500 outline-none transition-all font-bold appearance-none cursor-pointer shadow-inner"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
              <option value="Tamil">Tamil</option>
              <option value="Malayalam">Malayalam</option>
            </select>
          </div>

          {showSecondLang && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-4">Second Language</label>
              <select
                value={secondLanguage}
                onChange={(e) => setSecondLanguage(e.target.value as SecondLanguage)}
                className="w-full px-8 py-5 bg-slate-50 text-slate-900 border border-transparent rounded-[24px] focus:bg-white focus:border-violet-500 outline-none transition-all font-bold appearance-none cursor-pointer shadow-inner"
              >
                <option value="None">None</option>
                <option value="Hindi">Hindi</option>
                <option value="Sanskrit">Sanskrit</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-[24px] font-black text-xl shadow-2xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6"
          >
            Start Learning Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
