
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { LuckyIcon, CameraIcon, QuizIcon } from './Icons';

interface HomeTabProps {
  profile: UserProfile;
}

const HomeTab: React.FC<HomeTabProps> = ({ profile }) => {
  const [rating, setRating] = useState(0);

  const FeatureCard = ({ icon: Icon, color, title, desc }: any) => (
    <div className="bg-white p-8 rounded-[40px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-slate-50 group">
      <div className={`w-16 h-16 rounded-3xl ${color} flex items-center justify-center mb-6 transition-all duration-500 group-hover:rotate-6 shadow-lg`}>
        <Icon className="w-9 h-9 text-white" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed mb-4">{desc}</p>
      <div className="w-12 h-1 bg-slate-100 rounded-full group-hover:w-20 group-hover:bg-violet-400 transition-all duration-500"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-800 rounded-[48px] p-8 md:p-16 text-white overflow-hidden shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/10">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Intelligence Refined
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-[0.95]">
            Ignite Your <br className="hidden md:block"/> Mind, {profile.name}!
          </h1>
          <p className="text-lg md:text-xl font-medium text-indigo-50/80 mb-10 leading-relaxed max-w-lg">
            Lucky turns complex doubts into simple steps. Your dedicated AI partner for {profile.board} excellence.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/5 shadow-inner">
              {profile.board}
            </div>
            <div className="bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/5 shadow-inner">
              CLASS {profile.classLevel}
            </div>
            <div className="bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/5 shadow-inner">
              {profile.language}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <FeatureCard 
          icon={CameraIcon} 
          color="bg-amber-500" 
          title="Visual Solving" 
          desc="Snap any equation or diagram. Lucky analyzes the image to provide a complete breakdown of the solution."
        />
        <FeatureCard 
          icon={QuizIcon} 
          color="bg-emerald-500" 
          title="Quiz Mastery" 
          desc="Test your limits with adaptive quizzes. The more you solve, the smarter the questions become."
        />
      </div>

      {/* Rating Card */}
      <div className="bg-white rounded-[40px] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Enjoying Lucky?</h3>
          <p className="text-slate-500 font-medium">Your feedback helps me solve better.</p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="group transition-transform active:scale-90"
              >
                <svg
                  className={`w-10 h-10 ${
                    star <= rating ? 'text-amber-400 fill-current drop-shadow-xl' : 'text-slate-200'
                  } transition-all duration-300 group-hover:scale-110`}
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                  strokeWidth={star <= rating ? "0" : "1.5"}
                  fill={star <= rating ? "currentColor" : "none"}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full">
            {rating === 0 ? "Tap to Rate Your Experience" : `${rating}/5 Star Verified Experience`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
