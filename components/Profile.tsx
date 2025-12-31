
import React, { useState, useEffect } from 'react';
import { UserProfile, ClassLevel, Board, IntermediateGroup, BTechCourse, SecondLanguage, PermissionType } from '../types';
import { CLASSES, BOARDS, GROUPS, COURSES, AVATARS, Icons, getSubjectsForProfile } from '../constants';

const PermissionDialog: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  onSelect: (type: PermissionType) => void;
  description: string;
}> = ({ title, icon, onSelect, description }) => {
  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-500 max-w-md mx-auto py-8">
      <div className="text-center">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner border border-blue-100/50">
          {icon}
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{title} Permission</h2>
        <p className="text-gray-500 font-medium leading-relaxed px-4">{description}</p>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          type="button" 
          onClick={() => onSelect('always')}
          className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
        >
          <Icons.Check /> Allow while using the app
        </button>
        <button 
          type="button" 
          onClick={() => onSelect('once')}
          className="w-full py-5 bg-gray-100 text-gray-900 font-black rounded-3xl hover:bg-gray-200 active:scale-[0.98] transition-all"
        >
          Allow for this time
        </button>
        <button 
          type="button" 
          onClick={() => onSelect('none')}
          className="w-full py-5 bg-white border-2 border-gray-100 text-gray-400 font-black rounded-3xl hover:border-gray-200 active:scale-[0.98] transition-all"
        >
          Don't allow
        </button>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>(ClassLevel.CLASS_10);
  const [board, setBoard] = useState<Board>('CBSE');
  const [group, setGroup] = useState<IntermediateGroup>('MPC');
  const [course, setCourse] = useState<BTechCourse>('CSE');
  const [secondLanguage, setSecondLanguage] = useState<SecondLanguage | undefined>(undefined);
  const [goal, setGoal] = useState('');
  const [avatarId, setAvatarId] = useState(0);
  const [camPerm, setCamPerm] = useState<PermissionType>('none');
  const [galPerm, setGalPerm] = useState<PermissionType>('none');

  const loadProfile = () => {
    const saved = localStorage.getItem('lucky_user_profile');
    if (saved) {
      try {
        const parsed: UserProfile = JSON.parse(saved);
        setProfile(parsed);
        setName(parsed.name || '');
        setClassLevel(parsed.classLevel || ClassLevel.CLASS_10);
        setBoard(parsed.board || 'CBSE');
        setGroup(parsed.group || 'MPC');
        setCourse(parsed.course || 'CSE');
        setSecondLanguage(parsed.secondLanguage);
        setGoal(parsed.goal || '');
        setAvatarId(typeof parsed.avatarId === 'number' ? parsed.avatarId : 0);
        setCamPerm(parsed.permissions?.camera || 'none');
        setGalPerm(parsed.permissions?.gallery || 'none');
      } catch (e) {
        console.error("Profile load error", e);
      }
    } else {
      setIsEditing(true);
    }
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener('profileUpdated', loadProfile);
    return () => window.removeEventListener('profileUpdated', loadProfile);
  }, []);

  const handleEditClick = () => {
    if (profile) {
      setName(profile.name);
      setClassLevel(profile.classLevel);
      setBoard(profile.board || 'CBSE');
      setGroup(profile.group || 'MPC');
      setCourse(profile.course || 'CSE');
      setSecondLanguage(profile.secondLanguage);
      setGoal(profile.goal);
      setAvatarId(profile.avatarId);
      setCamPerm(profile.permissions?.camera || 'none');
      setGalPerm(profile.permissions?.gallery || 'none');
    }
    setIsEditing(true);
    setStep(1);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const newProfile: UserProfile = {
      name,
      classLevel,
      board: CLASSES.slice(0, 5).includes(classLevel) ? board : undefined,
      group: classLevel === ClassLevel.INTERMEDIATE ? group : undefined,
      course: classLevel === ClassLevel.BTECH ? course : undefined,
      secondLanguage: ['Class 9', 'Class 10', 'Intermediate'].includes(classLevel as string) ? secondLanguage : undefined,
      goal,
      avatarId,
      joinedAt: profile?.joinedAt || Date.now(),
      completedQuizzes: profile?.completedQuizzes || {},
      permissions: {
        camera: camPerm,
        gallery: galPerm,
      }
    };

    setProfile(newProfile);
    localStorage.setItem('lucky_user_profile', JSON.stringify(newProfile));
    setIsEditing(false);
    setStep(1);
    window.dispatchEvent(new Event('profileUpdated'));
  };

  const handleCancel = () => {
    if (profile) {
      setIsEditing(false);
      setStep(1);
    }
  };

  const resetAllData = () => {
    if (confirm("Reset everything? Your profile, history, and points will be permanently deleted.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (isEditing) {
    const totalSteps = 5;
    const progress = (step / totalSteps) * 100;

    return (
      <div className="max-w-3xl mx-auto py-8 md:py-16 px-4 animate-tab-content">
        <div className="bg-white rounded-[3.5rem] p-8 sm:p-14 shadow-2xl border border-gray-100 overflow-hidden relative">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-3 bg-gray-50">
            <div className="h-full bg-blue-600 transition-all duration-700 ease-in-out" style={{ width: `${progress}%` }}></div>
          </div>

          {profile && (
            <button 
              onClick={handleCancel}
              className="absolute top-8 right-8 p-3 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"
            >
              <Icons.X />
            </button>
          )}

          <div className="space-y-10">
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center">
                  <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">{profile ? 'Update Identity' : 'Hello there!'}</h2>
                  <p className="text-gray-500 font-medium">Let's start with the basics.</p>
                </div>
                <div className="space-y-8">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4 text-center">Your Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="e.g. Rahul Sharma" 
                      className="w-full bg-slate-50 border border-gray-100 rounded-3xl py-7 px-8 text-2xl font-black text-gray-900 text-center focus:ring-8 focus:ring-blue-500/5 focus:border-blue-600 outline-none transition-all placeholder:text-gray-200" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4 text-center">Academic Grade</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {CLASSES.map(c => (
                        <button 
                          key={c} 
                          type="button" 
                          onClick={() => setClassLevel(c)} 
                          className={`py-5 rounded-2xl border-2 font-black transition-all text-xs tracking-tight ${classLevel === c ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-[1.03]' : 'border-gray-50 bg-white text-gray-400 hover:border-gray-200'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => name.trim() && setStep(2)} 
                  disabled={!name.trim()}
                  className="w-full py-6 bg-gray-900 text-white font-black rounded-[2rem] flex items-center justify-center gap-4 active:scale-[0.98] transition-all shadow-2xl disabled:opacity-20"
                >
                  Continue <Icons.ChevronRight />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <div className="text-center">
                  <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Academic Details</h2>
                  <p className="text-gray-500 font-medium">Specify your curriculum to get accurate help.</p>
                </div>

                <div className="space-y-10">
                  {CLASSES.slice(0, 5).includes(classLevel) && (
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5 text-center">Education Board</label>
                      <div className="grid grid-cols-3 gap-4">
                        {BOARDS.map(b => (
                          <button key={b} type="button" onClick={() => setBoard(b)} className={`py-5 rounded-[1.5rem] border-2 font-black transition-all ${board === b ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}>{b}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {classLevel === ClassLevel.INTERMEDIATE && (
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5 text-center">Select Group</label>
                      <div className="grid grid-cols-3 gap-4">
                        {GROUPS.map(g => (
                          <button key={g} type="button" onClick={() => setGroup(g)} className={`py-5 rounded-[1.5rem] border-2 font-black transition-all ${group === g ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}>{g}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {classLevel === ClassLevel.BTECH && (
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5 text-center">Engineering Stream</label>
                      <div className="grid grid-cols-3 gap-4">
                        {COURSES.map(c => (
                          <button key={c} type="button" onClick={() => setCourse(c)} className={`py-5 rounded-[1.5rem] border-2 font-black transition-all text-[10px] sm:text-xs ${course === c ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}>{c}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {['Class 9', 'Class 10', 'Intermediate'].includes(classLevel as string) && (
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5 text-center">Second Language</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['Hindi', 'Sanskrit'].map(l => (
                          <button key={l} type="button" onClick={() => setSecondLanguage(l as SecondLanguage)} className={`py-5 rounded-[1.5rem] border-2 font-black transition-all ${secondLanguage === l ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}>{l}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-gray-100 text-gray-600 font-black rounded-3xl hover:bg-gray-200 transition-all">Back</button>
                  <button type="button" onClick={() => setStep(3)} className="flex-[2] py-5 bg-gray-900 text-white font-black rounded-3xl active:scale-[0.98] transition-all shadow-xl">Next Step</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <div className="text-center">
                  <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Personalization</h2>
                  <p className="text-gray-500 font-medium">Add a bit of flavor to your profile.</p>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-6 text-center">Pick an Avatar</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 max-h-48 overflow-y-auto p-6 bg-slate-50 rounded-[2.5rem] border border-gray-100 custom-scrollbar">
                    {AVATARS.map((a, idx) => (
                      <button 
                        key={idx} 
                        type="button" 
                        onClick={() => setAvatarId(idx)} 
                        className={`w-full aspect-square flex items-center justify-center text-3xl rounded-2xl border-4 transition-all shadow-sm ${avatarId === idx ? 'border-blue-600 bg-white scale-110 shadow-blue-100' : 'border-transparent hover:bg-white hover:scale-105'}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4 text-center">Educational Goal</label>
                  <textarea 
                    value={goal} 
                    onChange={(e) => setGoal(e.target.value)} 
                    placeholder="e.g. To master Mathematics and top the finals!" 
                    className="w-full bg-slate-50 border border-gray-100 rounded-[2rem] py-6 px-8 font-bold text-center focus:ring-8 focus:ring-blue-500/5 focus:border-blue-600 outline-none transition-all min-h-[140px] placeholder:text-gray-200" 
                  />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-5 bg-gray-100 text-gray-600 font-black rounded-3xl hover:bg-gray-200 transition-all">Back</button>
                  <button type="button" onClick={() => setStep(4)} className="flex-[2] py-5 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-100 active:scale-[0.98] transition-all">Setup Permissions</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <PermissionDialog 
                title="Camera" 
                icon={<Icons.Camera />} 
                description="Lucky needs access to your camera so you can snap and send pictures of your homework doubts directly."
                onSelect={(type) => { setCamPerm(type); setStep(5); }} 
              />
            )}

            {step === 5 && (
              <PermissionDialog 
                title="Gallery" 
                icon={<Icons.Image />} 
                description="Lucky needs gallery access so you can upload saved screenshots or images of your study materials."
                onSelect={(type) => { setGalPerm(type); handleSave(); }} 
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  const quizRecord = profile?.completedQuizzes || {};
  const totalQuizzes = Object.values(quizRecord).reduce<number>((acc, val) => acc + (val as number), 0);
  const subjects = getSubjectsForProfile(profile || {});
  const accountAgeInDays = Math.floor((Date.now() - (profile?.joinedAt || Date.now())) / 86400000) + 1;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-tab-content">
      <div className="bg-white rounded-[4rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        {/* Banner Area */}
        <div className="h-72 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 relative flex items-center px-8 sm:px-16 overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none text-[250px] font-black -rotate-12 select-none translate-y-10">LUCKY</div>
          
          <button 
            onClick={handleEditClick} 
            className="absolute top-8 right-8 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-2xl text-[10px] font-black flex items-center gap-3 border border-white/20 shadow-2xl transition-all active:scale-95 uppercase tracking-widest z-20"
          >
            <Icons.Edit /> Edit Profile
          </button>
          
          <div className="flex items-center gap-8 sm:gap-12 z-10 w-full flex-col sm:flex-row mt-10 sm:mt-0">
            <div className="w-32 h-32 sm:w-44 sm:h-44 bg-white rounded-[3rem] sm:rounded-[4rem] shadow-2xl flex items-center justify-center text-6xl sm:text-8xl shrink-0 border-[10px] border-white/20 animate-in fade-in zoom-in duration-700 relative group">
              {AVATARS[profile?.avatarId || 0]}
              <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl group-hover:blur-3xl transition-all opacity-0 group-hover:opacity-100"></div>
            </div>
            <div className="text-white text-center sm:text-left flex-1 min-w-0">
              <span className="text-[10px] font-black bg-white/10 px-4 py-2 rounded-full uppercase tracking-widest border border-white/10 mb-4 inline-block">{profile?.classLevel}</span>
              <h1 className="text-4xl sm:text-7xl font-black tracking-tighter leading-none mb-6 truncate">{profile?.name || 'Student'}</h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                {profile?.board && <span className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">{profile.board}</span>}
                {profile?.group && <span className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">{profile.group}</span>}
                {profile?.course && <span className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">{profile.course}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-20">
          <div className="grid lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-16">
              {/* Analytics */}
              <section>
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-4">
                    <span className="w-10 h-px bg-gray-200"></span> Mastery Progress
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {subjects.length > 0 ? subjects.map(s => {
                    const count = quizRecord[s] || 0;
                    const progress = Math.min(count * 20, 100);
                    return (
                      <div key={s} className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100 group hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 border-2 border-transparent hover:border-blue-50">
                        <div className="flex justify-between items-center mb-6">
                          <span className="font-black text-gray-900 text-base">{s}</span>
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl uppercase tracking-widest">{count} Completed</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="mt-4 text-[9px] font-black text-gray-400 uppercase tracking-widest flex justify-between">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="col-span-2 text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                       <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Complete profile to see analytics</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Goal section */}
              <section>
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                    <span className="w-10 h-px bg-gray-200"></span> Academic Mission
                 </h3>
                 <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-12 md:p-16 rounded-[4rem] border border-indigo-100/50 text-center relative group overflow-hidden">
                    <div className="absolute -top-6 -left-6 w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-xl group-hover:rotate-12 transition-transform duration-500">🎯</div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl"></div>
                    <p className="text-2xl md:text-3xl font-black text-indigo-900 italic leading-tight mb-4 relative z-10">
                      "{profile?.goal || "The expert in anything was once a beginner. Start your journey with Lucky!"}"
                    </p>
                    <div className="w-12 h-1.5 bg-indigo-200 mx-auto rounded-full mt-8 opacity-40"></div>
                 </div>
              </section>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
              <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[80px]"></div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10">Student Statistics</div>
                  <div className="space-y-10">
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600/20 transition-all">🏆</div>
                        <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Mastery Pts</span>
                      </div>
                      <span className="text-3xl font-black tabular-nums">{(totalQuizzes * 50) + 100}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-600/20 transition-all">⚡</div>
                        <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Quests Won</span>
                      </div>
                      <span className="text-3xl font-black tabular-nums">{totalQuizzes}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-purple-600/20 transition-all">📅</div>
                        <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Learning Days</span>
                      </div>
                      <span className="text-2xl font-black tabular-nums">{accountAgeInDays}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="bg-white border-2 border-slate-50 p-10 rounded-[3.5rem] space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-center mb-4">Core Settings</h4>
                <button 
                  onClick={resetAllData} 
                  className="w-full py-5 bg-red-50 text-red-600 font-black rounded-[2rem] hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-4 group shadow-sm hover:shadow-red-200"
                >
                  <div className="group-hover:rotate-12 transition-transform">
                    <Icons.Trash />
                  </div>
                  Nuclear Reset
                </button>
                <div className="text-center">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Lucky v1.0 • Privacy Secured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
