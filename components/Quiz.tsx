import React, { useState, useEffect } from 'react';
import { ClassLevel, Difficulty, QuizQuestion, UserProfile } from '../types';
import { DIFFICULTIES, Icons, getSubjectsForProfile } from '../constants';
import { generateQuiz } from '../services/geminiService';

const Quiz: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [subject, setSubject] = useState<string>('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lucky_user_profile');
    if (saved) {
      const p = JSON.parse(saved);
      setProfile(p);
      const subs = getSubjectsForProfile(p);
      if (subs.length > 0) setSubject(subs[0]);
    }
  }, []);

  const startQuiz = async () => {
    if (!profile || !subject) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateQuiz(profile.classLevel, difficulty, subject);
      setQuestions(data);
      setCurrentIdx(0);
      setScore(0);
      setQuizFinished(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } catch (err: any) {
      setError("Lucky couldn't generate a quiz right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === questions[currentIdx].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      if (profile) {
        const updated = { ...profile };
        updated.completedQuizzes[subject] = (updated.completedQuizzes[subject] || 0) + 1;
        localStorage.setItem('lucky_user_profile', JSON.stringify(updated));
        window.dispatchEvent(new Event('profileUpdated'));
      }
    }
  };

  if (!profile) return (
    <div className="h-[80vh] flex items-center justify-center p-6 animate-tab-content">
      <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl max-w-md">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-2xl font-black mb-2">Profile Missing</h2>
        <p className="text-gray-500 mb-6">Lucky needs to know your class to generate the right questions.</p>
      </div>
    </div>
  );

  if (isLoading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-tab-content">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-8"></div>
      <h2 className="text-3xl font-black text-gray-900">Crafting Your Quest...</h2>
      <p className="text-gray-500 mt-2">Analyzing the {subject} syllabus for {profile.classLevel}</p>
    </div>
  );

  if (error) return (
    <div className="h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-tab-content">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-[2rem] flex items-center justify-center mb-6 text-4xl">⚠️</div>
      <h2 className="text-2xl font-black text-gray-900">Oops! Something went wrong.</h2>
      <p className="text-gray-500 mt-2 mb-8">{error}</p>
      <button onClick={startQuiz} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg">Retry Quest</button>
    </div>
  );

  if (quizFinished) return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-tab-content">
      <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-emerald-500"></div>
        <div className="text-6xl mb-8 animate-bounce">🏆</div>
        <h2 className="text-4xl font-black text-gray-900 mb-2">Subject Mastery!</h2>
        <p className="text-gray-500 mb-10 text-lg">You nailed the <b>{subject}</b> challenge.</p>
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 p-6 rounded-[2rem]">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Accuracy</div>
            <div className="text-3xl font-black text-gray-900">{Math.round((score/questions.length)*100)}%</div>
          </div>
          <div className="bg-blue-50 p-6 rounded-[2rem]">
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Correct</div>
            <div className="text-3xl font-black text-blue-900">{score} / {questions.length}</div>
          </div>
        </div>
        <button onClick={() => setQuestions([])} className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all">Back to Quest Menu</button>
      </div>
    </div>
  );

  if (questions.length > 0) {
    const q = questions[currentIdx];
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 animate-tab-content">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4 items-center">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black">{currentIdx + 1}</div>
             <div>
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</div>
               <div className="text-sm font-black text-blue-600">{subject}</div>
             </div>
          </div>
          <div className="w-32 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-gray-100 mb-6">
          <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-10 leading-tight">{q.question}</h3>
          <div className="grid gap-4">
            {q.options.map((opt, i) => {
              let btnClass = "w-full text-left p-6 rounded-2xl border-2 transition-all font-bold flex gap-4 items-center ";
              if (selectedAnswer === null) btnClass += "bg-gray-50 border-gray-50 hover:border-blue-200 hover:bg-blue-50 text-gray-700";
              else if (i === q.correctAnswerIndex) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-800";
              else if (i === selectedAnswer) btnClass += "bg-red-50 border-red-500 text-red-800";
              else btnClass += "bg-gray-50 border-transparent opacity-40";

              return (
                <button key={i} disabled={selectedAnswer !== null} onClick={() => handleAnswerSelect(i)} className={btnClass}>
                  <span className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center text-xs font-black">{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {showExplanation && (
          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 mb-6 animate-tab-content">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Lucky's Explanation</h4>
            <p className="font-bold leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {selectedAnswer !== null && (
          <button onClick={nextQuestion} className="w-full py-6 bg-gray-900 text-white font-black rounded-3xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl">
            {currentIdx === questions.length - 1 ? 'Finish Quest' : 'Next Question'}
            <Icons.ChevronRight />
          </button>
        )}
      </div>
    );
  }

  const userSubjects = getSubjectsForProfile(profile);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-tab-content">
      <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-2xl border border-gray-50">
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">⚡</div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Quiz Quest</h2>
          <p className="text-gray-500 text-lg">Pick a subject and prove your knowledge!</p>
        </div>

        <div className="space-y-12">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Your Subjects</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {userSubjects.map(s => (
                <button key={s} onClick={() => setSubject(s)} className={`p-6 rounded-[2rem] border-2 font-black transition-all text-sm flex flex-col items-center gap-3 ${subject === s ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xl shadow-blue-50 -translate-y-1' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100'}`}>
                   <span className="text-3xl">{s === 'English' ? '📖' : s.includes('Math') ? '📐' : s.includes('Science') ? '🧪' : '📓'}</span>
                   {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Intensity</label>
            <div className="flex justify-center gap-3">
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDifficulty(d)} className={`px-8 py-4 rounded-2xl border-2 font-bold transition-all text-sm ${difficulty === d ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={startQuiz} className="w-full mt-16 bg-blue-600 text-white font-black py-7 rounded-[2.5rem] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 active:scale-95">
          Start {subject} Challenge <Icons.ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Quiz;