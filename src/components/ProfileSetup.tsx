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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onComplete({ name, classLevel, board, language });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF] p-6">
      <div className="bg-white rounded-[48px] shadow-2xl p-10 md:p-16 max-w-xl w-full border border-slate-50 animate-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[28px] flex items-center justify-center text-white mb-6 shadow-2xl">
             <LuckyIcon className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">Welcome to Lucky</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">Your personal AI learning journey starts here.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold text-lg" placeholder="Your Full Name" />
          <div className="grid grid-cols-2 gap-6">
            <select value={classLevel} onChange={(e) => setClassLevel(e.target.value as ClassLevel)} className="px-8 py-5 bg-slate-50 rounded-[24px] font-bold">
              <option value="5">Class 5</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="Intermediate">Intermediate</option>
            </select>
            <select value={board} onChange={(e) => setBoard(e.target.value as BoardType)} className="px-8 py-5 bg-slate-50 rounded-[24px] font-bold">
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
            </select>
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value as AppLanguage)} className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold">
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Telugu">Telugu</option>
            <option value="Tamil">Tamil</option>
            <option value="Malayalam">Malayalam</option>
          </select>
          <button type="submit" className="w-full py-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-[24px] font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-6">Start Learning Now</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;