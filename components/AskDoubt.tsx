
import React, { useState, useRef, useEffect } from 'react';
import { ClassLevel, ChatMessage, ChatSession, GroundingChunk } from '../types';
import { CLASSES, Icons } from '../constants';
import { askLucky } from '../services/geminiService';

const AskDoubt: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [classLevel, setClassLevel] = useState<ClassLevel>(ClassLevel.CLASS_10);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMediaMenuOpen, setIsMediaMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mediaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lucky_doubt_history');
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch (e) {
        console.error("Storage error", e);
      }
    }
    
    const profile = localStorage.getItem('lucky_user_profile');
    if (profile) {
      try {
        setClassLevel(JSON.parse(profile).classLevel);
      } catch(e) {}
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (mediaMenuRef.current && !mediaMenuRef.current.contains(event.target as Node)) {
        setIsMediaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem('lucky_doubt_history', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, currentSessionId, isLoading, error]);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const extractYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^& \n?]+)/);
    return match ? match[1] : null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setIsMediaMenuOpen(false);
      };
      reader.readAsDataURL(file);
    }
    // Reset inputs to allow selecting same file again
    e.target.value = '';
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input || (selectedImage ? "Look at this image..." : ""),
      image: selectedImage || undefined,
      timestamp: Date.now(),
    };

    let targetId = currentSessionId;
    if (!targetId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: input ? (input.slice(0, 40) + (input.length > 40 ? '...' : '')) : "Image Question",
        classLevel,
        messages: [userMessage],
        lastUpdated: Date.now(),
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      targetId = newSession.id;
    } else {
      setSessions(prev => prev.map(s => 
        s.id === targetId ? { ...s, messages: [...s.messages, userMessage], lastUpdated: Date.now() } : s
      ));
    }

    const query = input || "Please explain the content of this image.";
    const imageToUpload = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const luckyResponse = await askLucky(query, classLevel, imageToUpload || undefined);
      const luckyMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'lucky',
        content: luckyResponse.text,
        grounding: luckyResponse.grounding,
        timestamp: Date.now(),
      };
      setSessions(prev => prev.map(s => 
        s.id === targetId ? { ...s, messages: [...s.messages, luckyMessage], lastUpdated: Date.now() } : s
      ));
    } catch (err: any) {
      setError(err.message || "Lucky had a small glitch. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-64px)] overflow-hidden animate-tab-content bg-slate-50">
      {/* Sidebar - Desktop/Mobile drawer */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <button onClick={() => { setCurrentSessionId(null); setIsSidebarOpen(false); }} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              <Icons.Plus /> New Question
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {sessions.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs font-bold uppercase tracking-widest">No history yet</div>
            ) : (
              sessions.map(s => (
                <div key={s.id} onClick={() => { setCurrentSessionId(s.id); setClassLevel(s.classLevel); setIsSidebarOpen(false); }} className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${currentSessionId === s.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-50 hover:border-gray-100'}`}>
                  <div className="text-[10px] font-black text-blue-600 uppercase mb-1">{s.classLevel}</div>
                  <div className="text-sm font-bold text-gray-800 line-clamp-1">{s.title}</div>
                  <div className="text-[9px] text-gray-400 mt-2">{new Date(s.lastUpdated).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-gray-50 rounded-xl text-gray-600"><Icons.History /></button>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Icons.Robot /></div>
            <div>
              <h2 className="font-black text-gray-900 leading-none">Lucky AI</h2>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Online</span>
            </div>
          </div>
          <select value={classLevel} onChange={(e) => setClassLevel(e.target.value as ClassLevel)} className="bg-gray-100 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </header>

        {/* Message Container */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50/50 custom-scrollbar">
          {messages.length === 0 && !error && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto opacity-60">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mb-6 text-4xl shadow-inner animate-pulse">🤖</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Hello, I'm Lucky!</h3>
              <p className="text-sm font-medium text-gray-500">Ask me any educational doubt, or send me a picture of your homework question.</p>
            </div>
          )}

          {messages.map(m => {
            const youtubeId = m.grounding?.map(g => g.web?.uri ? extractYouTubeId(g.web.uri) : null).find(id => id !== null);
            
            return (
              <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[90%] md:max-w-[80%] p-4 md:p-6 rounded-[2rem] shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                  {m.image && (
                    <div className="mb-4 rounded-2xl overflow-hidden shadow-lg border border-white/20">
                      <img src={m.image} alt="Doubt Attachment" className="w-full max-h-[300px] object-contain bg-black/5" />
                    </div>
                  )}
                  
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">{m.content}</p>
                  
                  {m.role === 'lucky' && youtubeId && (
                    <div className="mt-6 border-t border-gray-100 pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-red-100 text-red-600 rounded-lg flex items-center justify-center scale-75">
                          <Icons.Plus />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Video Guide</span>
                      </div>
                      <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-xl border border-gray-100">
                        <iframe 
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${youtubeId}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {m.role === 'lucky' && m.grounding && m.grounding.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Lucky's Sources</div>
                      <div className="flex flex-wrap gap-2">
                        {m.grounding.map((chunk, i) => chunk.web && (
                          <a 
                            key={i}
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black hover:bg-blue-100 transition-colors flex items-center gap-2 border border-blue-100"
                          >
                            <Icons.ChevronRight /> {chunk.web.title || 'Source'}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`text-[9px] mt-3 font-black uppercase tracking-widest opacity-40 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-white p-5 rounded-[2rem] border border-gray-100 flex flex-col gap-3 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Searching Brain...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-5 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-sm font-bold flex flex-col items-center gap-3 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <Icons.X /> <span>{error}</span>
              </div>
              <button onClick={() => { setError(null); handleSend({ preventDefault: () => {} } as any); }} className="px-6 py-2 bg-white rounded-xl shadow-sm border border-red-200 hover:bg-red-50 transition-colors font-black text-[10px] uppercase tracking-widest">Try Again</button>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="p-4 md:p-6 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="max-w-5xl mx-auto relative">
            {selectedImage && (
              <div className="absolute bottom-full mb-6 left-0 p-3 bg-white rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setSelectedImage(null)} className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-lg">
                    <Icons.X />
                  </button>
                </div>
                <div className="pr-4">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Attached Image</div>
                  <div className="text-xs font-bold text-gray-900 truncate max-w-[150px]">Question Ready</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="relative" ref={mediaMenuRef}>
                <button 
                  type="button" 
                  onClick={() => setIsMediaMenuOpen(!isMediaMenuOpen)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${isMediaMenuOpen ? 'bg-blue-600 text-white rotate-45' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  <Icons.Plus />
                </button>
                
                {isMediaMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-4 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-2 w-48 animate-in fade-in slide-in-from-bottom-4">
                    <button 
                      type="button" 
                      onClick={() => cameraInputRef.current?.click()}
                      className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 rounded-2xl text-sm font-black text-gray-700 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                        <Icons.Camera />
                      </div>
                      Camera
                    </button>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 rounded-2xl text-sm font-black text-gray-700 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Icons.Image />
                      </div>
                      Gallery
                    </button>
                  </div>
                )}
              </div>

              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder={selectedImage ? "Add a note or tap send..." : `Ask anything about ${classLevel}...`} 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl py-4 px-6 text-gray-900 font-medium placeholder:text-gray-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" 
              />
              
              <button 
                type="submit" 
                disabled={(!input.trim() && !selectedImage) || isLoading} 
                className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-20 shadow-lg shadow-blue-200 active:scale-90 transition-all"
              >
                <Icons.Send />
              </button>
            </div>
          </form>
          
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleFileChange} />
        </div>
      </div>
    </div>
  );
};

export default AskDoubt;
