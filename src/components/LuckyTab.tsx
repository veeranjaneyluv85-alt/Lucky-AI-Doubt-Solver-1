import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { CameraIcon, LuckyIcon, YouTubeIcon, ClipboardIcon } from './Icons';
import { solveDoubt } from '../geminiService';

interface LuckyTabProps {
  profile: UserProfile;
}

const LuckyTab: React.FC<LuckyTabProps> = ({ profile }) => {
  const [query, setQuery] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConsult = async () => {
    if (!query.trim() && !image) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await solveDoubt(query, image, profile);
      setResult(response);
    } catch (error) {
      setResult("Oops! Something went wrong. Please check your API key or connection.");
    } finally {
      setLoading(false);
    }
  };

  const openYouTube = (isPrimary: boolean) => {
    const searchTerm = encodeURIComponent(`${query} class ${profile.classLevel} ${profile.board} ${profile.language}`);
    const url = isPrimary 
      ? `https://www.youtube.com/results?search_query=${searchTerm}`
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' educational videos')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="bg-white rounded-[40px] p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <LuckyIcon className="w-24 h-24 text-violet-600" />
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-violet-500 rounded-3xl animate-pulse blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <img 
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=Lucky&backgroundColor=7c3aed`} 
            alt="Lucky Bot" 
            className="w-24 h-24 md:w-28 md:h-28 rounded-[32px] relative z-10 shadow-2xl bg-white p-2" 
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">I'm Lucky, your AI expert.</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
            Solving <span className="text-violet-600 font-bold">{profile.board}</span> problems in <span className="text-violet-600 font-bold">{profile.language}</span>. Paste text or upload a snap.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[48px] p-2 md:p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 group transition-all">
        <div className="relative p-6 md:p-8">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your query here... e.g. What is the Pythagorean theorem?"
            className="w-full h-[220px] text-xl md:text-2xl font-semibold p-4 bg-transparent text-slate-900 placeholder:text-slate-300 outline-none resize-none"
          />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-50">
             <div className="flex items-center gap-4 w-full md:w-auto">
               <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95"
              >
                <CameraIcon className="w-6 h-6 text-violet-500 transition-transform" />
                <span>Snap Problem</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              {image && (
                <div className="relative h-14 w-14 group/img">
                  <img src={image} alt="Preview" className="h-full w-full object-cover rounded-xl shadow-md ring-2 ring-violet-100" />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg font-bold text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
             </div>

             <button
              onClick={handleConsult}
              disabled={loading || (!query.trim() && !image)}
              className="w-full md:w-[280px] py-4 md:py-5 bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-2xl font-black text-lg md:text-xl shadow-xl shadow-violet-200 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 flex items-center justify-center gap-4"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                  Thinking...
                </>
              ) : (
                <>
                  <LuckyIcon className="w-6 h-6" />
                  CONSULT LUCKY
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-100 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <ClipboardIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">The Solution</h3>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
              Verified by AI
            </div>
          </div>
          <div className="p-8 md:p-12">
            <div className="text-slate-800 text-lg md:text-xl font-medium leading-loose whitespace-pre-wrap selection:bg-violet-100 selection:text-violet-900">
              {result}
            </div>
          </div>

          <div className="bg-slate-50/50 p-8 md:p-10 border-t border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h4 className="text-rose-600 font-black flex items-center gap-3 text-xl mb-1">
                  <YouTubeIcon className="w-8 h-8" />
                  Video Lessons
                </h4>
                <p className="text-slate-500 font-bold">Watch visual explanations of this topic.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button onClick={() => openYouTube(true)} className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-rose-700 transition-all shadow-lg active:scale-95">
                  Watch Top Result
                </button>
                <button onClick={() => openYouTube(false)} className="bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                  Browse Channels
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyTab;