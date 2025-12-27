import React, { useState } from 'react';
import { UserProfile, QuizState, QuizQuestion } from '../types';
import { 
  SchoolIcon, ArrowLeftIcon, QuizIcon, LuckyIcon,
  MathIcon, ScienceIcon, BookIcon, GlobeIcon, AtomIcon,
  BeakerIcon, LeafIcon, PillarIcon, ComputerIcon, BrainIcon, LanguageIcon
} from './Icons';
import { generateQuiz } from '../geminiService';

interface QuizTabProps { profile: UserProfile; }

const QuizTab: React.FC<QuizTabProps> = ({ profile }) => {
  const [step, setStep] = useState<'subject' | 'difficulty' | 'loading' | 'quiz' | 'results'>('subject');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const subjects = ['Mathematics','Science','English','Social Studies','Physics','Chemistry','Biology','History','Geography','Computer Science','AI','Hindi'];

  const subjectIcons: Record<string, React.FC<{className?: string}>> = {
    'Mathematics': MathIcon, 'Science': ScienceIcon, 'English': BookIcon, 'Social Studies': GlobeIcon,
    'Physics': AtomIcon, 'Chemistry': BeakerIcon, 'Biology': LeafIcon, 'History': PillarIcon,
    'Geography': GlobeIcon, 'Computer Science': ComputerIcon, 'AI': BrainIcon, 'Hindi': LanguageIcon
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
                <div className="text-slate-700 font-black uppercase tracking-widest text-xs text-center group-hover:text-violet-600">{s}</div>
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
          {['Easy', 'Medium', 'Hard'].map(d => (
            <button key={d} onClick={() => startQuizGeneration(d as any)} className="w-full py-10 bg-violet-600 text-white rounded-[40px] font-black text-3xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">{d} Mode</button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-8">
        <div className="w-24 h-24 bg-white text-violet-600 rounded-[32px] flex items-center justify-center animate-bounce shadow-2xl border border-violet-50">
          <QuizIcon className="w-12 h-12" />
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-slate-800 mb-2">Assembling Your Quiz...</p>
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
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Question {quizState.currentIndex + 1} / {quizState.questions.length}</p>
        </div>
        <div className="bg-white rounded-[48px] p-10 md:p-16 shadow-xl border border-slate-100">
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-14">{q.question}</h3>
          <div className="grid gap-5">
            {q.options.map((opt, i) => {
              let btnClass = hasAnswered 
                ? (i === q.correctAnswer ? "bg-emerald-500 text-white" : (i === userAnswer ? "bg-rose-500 text-white" : "bg-slate-50 opacity-50"))
                : "bg-white border-slate-100 hover:border-violet-400 hover:bg-violet-50";
              return (
                <button key={i} disabled={hasAnswered} onClick={() => handleAnswer(i)} className={`w-full p-6 md:p-8 rounded-[28px] font-black text-xl text-left transition-all ${btnClass}`}>{opt}</button>
              );
            })}
          </div>
          {hasAnswered && (
            <div className="mt-12 p-8 bg-indigo-600 text-white rounded-[32px]">
              <p className="text-xl font-medium mb-10">{q.explanation}</p>
              <button onClick={nextQuestion} className="w-full py-6 bg-white text-indigo-700 rounded-2xl font-black text-2xl">Next Challenge</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'results' && quizState) {
    return (
      <div className="min-h-[600px] flex items-center justify-center animate-in zoom-in duration-500">
        <div className="bg-white rounded-[60px] p-12 md:p-16 shadow-2xl border border-slate-100 text-center max-w-lg w-full">
          <div className="text-9xl mb-8">🏆</div>
          <h2 className="text-5xl font-black text-slate-900 mb-4">Mastery Achieved!</h2>
          <div className="text-8xl font-black text-violet-600 mb-12">{quizState.score} / {quizState.questions.length}</div>
          <button onClick={() => setStep('subject')} className="w-full py-6 bg-violet-600 text-white rounded-[28px] font-black text-2xl shadow-xl">Try Another Quiz</button>
        </div>
      </div>
    );
  }
  return null;
};

export default QuizTab;