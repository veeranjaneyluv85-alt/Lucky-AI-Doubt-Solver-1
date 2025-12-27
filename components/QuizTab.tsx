
import React, { useState } from 'react';
import { UserProfile, QuizState, QuizQuestion } from '../types';
import { 
  SchoolIcon, 
  ArrowLeftIcon, 
  QuizIcon, 
  LuckyIcon,
  MathIcon,
  ScienceIcon,
  BookIcon,
  GlobeIcon,
  AtomIcon,
  BeakerIcon,
  LeafIcon,
  PillarIcon,
  ComputerIcon,
  BrainIcon,
  LanguageIcon
} from './Icons';
import { generateQuiz } from '../geminiService';

interface QuizTabProps { profile: UserProfile; }

const QuizTab: React.FC<QuizTabProps> = ({ profile }) => {
  const [step, setStep] = useState<'subject' | 'difficulty' | 'loading' | 'quiz' | 'results'>('subject');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const baseSubjects = ['Mathematics','Science','English','Social Studies','Physics','Chemistry','Biology','History','Geography','Computer Science','AI','Hindi'];
  const subjects = [...baseSubjects];
  if (profile.secondLanguage && profile.secondLanguage !== 'None' && !subjects.includes(profile.secondLanguage)) {
    subjects.push(profile.secondLanguage);
  }

  // Icon mapping for subjects
  const subjectIcons: Record<string, React.FC<{className?: string}>> = {
    'Mathematics': MathIcon,
    'Science': ScienceIcon,
    'English': BookIcon,
    'Social Studies': GlobeIcon,
    'Physics': AtomIcon,
    'Chemistry': BeakerIcon,
    'Biology': LeafIcon,
    'History': PillarIcon,
    'Geography': GlobeIcon,
    'Computer Science': ComputerIcon,
    'AI': BrainIcon,
    'Hindi': LanguageIcon
  };

  const startQuizGeneration = async (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    setStep('loading');
    try {
      const questions = await generateQuiz(selectedSubject, difficulty, profile);
      setQuizState({ subject: selectedSubject, difficulty, questions, currentIndex: 0, score: 0, isFinished: false });
      setUserAnswers([]);
      setShowExplanation(false);
      setStep('quiz');
    } catch (e) {
      alert("Error generating quiz. Please try again.");
      setStep('subject');
    }
  };

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    const currentQ = quizState!.questions[quizState!.currentIndex];
    const isCorrect = index === currentQ.correctAnswer;
    setUserAnswers([...userAnswers, index]);
    if (isCorrect) { setQuizState(prev => prev ? ({ ...prev, score: prev.score + 1 }) : null); }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (quizState!.currentIndex === quizState!.questions.length - 1) { setStep('results'); } 
    else { setQuizState(prev => prev ? ({ ...prev, currentIndex: prev.currentIndex + 1 }) : null); setShowExplanation(false); }
  };

  if (step === 'subject') {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <div className="w-20 h-20 bg-violet-100 rounded-[32px] flex items-center justify-center text-violet-600 mb-6 shadow-xl shadow-violet-50">
            <SchoolIcon className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Select Discipline</h2>
          <p className="text-slate-500 font-medium text-lg">Pick a subject to challenge your knowledge.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subjects.map(s => {
            const Icon = subjectIcons[s] || SchoolIcon;
            return (
              <button
                key={s}
                onClick={() => { setSelectedSubject(s); setStep('difficulty'); }}
                className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(124,58,237,0.1)] hover:border-violet-200 hover:scale-[1.05] transition-all duration-300 group flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-violet-50 transition-colors">
                  <Icon className="w-6 h-6 text-slate-400 group-hover:text-violet-600 transition-colors" />
                </div>
                <div className="text-slate-700 font-black uppercase tracking-widest text-xs text-center group-hover:text-violet-600">
                  {s}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === 'difficulty') {
    return (
      <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-right-8 duration-500">
        <button onClick={() => setStep('subject')} className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-violet-600 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" /> Back to Subjects
        </button>
        <div className="text-center">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4">{selectedSubject}</h2>
          <p className="text-slate-500 font-bold text-xl">How sharp is your edge today?</p>
        </div>
        <div className="flex flex-col gap-6">
          {[
            { label: 'Easy Mode', color: 'bg-emerald-500 shadow-emerald-100', val: 'Easy' },
            { label: 'Medium Mode', color: 'bg-amber-500 shadow-amber-100', val: 'Medium' },
            { label: 'Hard Mode', color: 'bg-rose-500 shadow-rose-100', val: 'Hard' }
          ].map(d => (
            <button
              key={d.val}
              onClick={() => startQuizGeneration(d.val as any)}
              className={`w-full py-10 ${d.color} text-white rounded-[40px] font-black text-3xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-8 animate-in fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-400 rounded-full blur-2xl animate-pulse opacity-20"></div>
          <div className="w-24 h-24 bg-white text-violet-600 rounded-[32px] flex items-center justify-center animate-bounce shadow-2xl border border-violet-50">
            <QuizIcon className="w-12 h-12" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-slate-800 mb-2">Assembling Your Quiz...</p>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Lucky is selecting questions</p>
        </div>
      </div>
    );
  }

  if (step === 'quiz' && quizState) {
    const q = quizState.questions[quizState.currentIndex];
    const hasAnswered = showExplanation;
    const userAnswer = userAnswers[quizState.currentIndex];

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-violet-600 transition-all duration-500" style={{width: `${((quizState.currentIndex + 1) / quizState.questions.length) * 100}%`}}></div>
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Question {quizState.currentIndex + 1} / {quizState.questions.length}</p>
          </div>
          <span className="bg-violet-600 text-white px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-violet-100">
            {quizState.subject}
          </span>
        </div>

        <div className="bg-white rounded-[48px] p-10 md:p-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
             <LuckyIcon className="w-32 h-32" />
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-[1.1] mb-14 relative z-10">
            {q.question}
          </h3>

          <div className="grid gap-5 relative z-10">
            {q.options.map((opt, i) => {
              let btnClass = "bg-slate-50 border-2 border-slate-100 text-slate-700";
              if (hasAnswered) {
                if (i === q.correctAnswer) btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-100 ring-4 ring-emerald-50";
                else if (i === userAnswer) btnClass = "bg-rose-500 border-rose-500 text-white shadow-xl shadow-rose-100 ring-4 ring-rose-50";
                else btnClass = "bg-slate-50 border-slate-50 text-slate-200 opacity-50";
              } else {
                btnClass = "bg-white border-slate-100 text-slate-700 hover:border-violet-400 hover:bg-violet-50 hover:shadow-lg";
              }
              return (
                <button
                  key={i} disabled={hasAnswered} onClick={() => handleAnswer(i)}
                  className={`w-full p-6 md:p-8 rounded-[28px] font-black text-xl text-left transition-all duration-300 ${btnClass} flex items-center justify-between group`}
                >
                  <span className="max-w-[85%]">{opt}</span>
                  {!hasAnswered && <div className="w-8 h-8 rounded-full border-2 border-slate-100 group-hover:border-violet-400 transition-all"></div>}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className="mt-12 animate-in fade-in slide-in-from-top-6 duration-500">
              <div className="bg-indigo-600 rounded-[32px] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <QuizIcon className="w-24 h-24" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                     <LuckyIcon className="w-6 h-6" />
                  </div>
                  <h4 className="text-2xl font-black tracking-tight">Lucky's Explanation</h4>
                </div>
                <p className="text-xl font-medium leading-relaxed mb-10 opacity-90">{q.explanation}</p>
                <button
                  onClick={nextQuestion}
                  className="w-full py-6 bg-white text-indigo-700 rounded-2xl font-black text-2xl shadow-xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  {quizState.currentIndex === quizState.questions.length - 1 ? 'Unlock Results' : 'Next Challenge'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'results' && quizState) {
    return (
      <div className="min-h-[600px] flex items-center justify-center animate-in zoom-in duration-500">
        <div className="bg-white rounded-[60px] p-12 md:p-16 shadow-[0_50px_100px_-20px_rgba(124,58,237,0.2)] border border-slate-100 text-center max-w-lg w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 to-transparent pointer-events-none"></div>
          <div className="text-9xl mb-8 filter drop-shadow-2xl">🏆</div>
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Mastery Achieved!</h2>
          <p className="text-slate-400 font-black mb-10 uppercase tracking-[0.2em] text-sm">
            {quizState.subject} • {quizState.difficulty}
          </p>
          <div className="inline-flex items-baseline gap-2 mb-12">
            <span className="text-8xl font-black text-violet-600">{quizState.score}</span>
            <span className="text-4xl font-black text-slate-300">/ {quizState.questions.length}</span>
          </div>
          <button
            onClick={() => setStep('subject')}
            className="w-full py-6 bg-violet-600 text-white rounded-[28px] font-black text-2xl shadow-2xl shadow-violet-200 hover:bg-violet-700 transition-all active:scale-95"
          >
            Try Another Quiz
          </button>
        </div>
      </div>
    );
  }
  return null;
};

export default QuizTab;
