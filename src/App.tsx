import React, { useState, useEffect, type MouseEvent, type FormEvent } from 'react';
import { Moon, Sun, Plus, Trash2, Edit2, Copy, ArrowLeft, Sparkles, Wand2, Info, X, History, CheckCircle2, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_CARDS, BUILTIN_SPREADS, getCardEmoji, type Spread, type TarotCard } from './constants';

export interface DrawHistory {
  id: string;
  date: number;
  question: string;
  spread: Spread;
  cards: DrawnCard[];
}

interface DrawnCard extends TarotCard {
  isReversed: boolean;
  positionName: string;
  extraQuestion?: string;
}
const TarotLogoSVG = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-sm rounded-[10px] overflow-hidden group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(252,211,77,0.4)] transition-all duration-300 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="url(#logo-gradient)" />
    
    <path d="M-5 85 Q 25 72 55 88 T 105 82" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M 40 95 L 90 95" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" fill="none" />
    
    <circle cx="50" cy="74" r="5" stroke="#FBBF24" strokeWidth="4" fill="none" />
    <line x1="50" y1="58" x2="50" y2="69" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
    <line x1="26" y1="58" x2="74" y2="58" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" />
    <path d="M44 58 L48 20 Q 50 14 52 20 L56 58" stroke="#FBBF24" strokeWidth="4" strokeLinejoin="round" fill="none" />
    
    <path d="M22 20 Q 22 28 30 28 Q 22 28 22 36 Q 22 28 14 28 Q 22 28 22 20 Z" fill="#FBBF24" />
    <path d="M72 16 A 10 10 0 1 0 86 30 A 14 14 0 0 1 72 16 Z" fill="#FBBF24" />
    
    <circle cx="78" cy="50" r="2.5" fill="#FBBF24" />
    <circle cx="34" cy="42" r="2.5" fill="#FBBF24" />

    <defs>
      <radialGradient id="logo-gradient" cx="50%" cy="50%" r="70%" fx="50%" fy="30%">
        <stop offset="0%" stopColor="#2e1065" />
        <stop offset="100%" stopColor="#0f172a" />
      </radialGradient>
    </defs>
  </svg>
);

const GlobalBackground = ({ theme }: { theme: 'light' | 'dark' }) => (
  <div className="fixed inset-0 pointer-events-none -z-10 bg-[#f7f3e8] dark:bg-[#0b0a14] transition-colors duration-1000 overflow-hidden">
    {/* Sunlight Layer */}
    <svg className={`absolute inset-0 w-full h-full transition-opacity duration-1000 mix-blend-multiply ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sun-glow" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="1000" fill="url(#sun-glow)" />

      <g stroke="#d97706" fill="none" opacity="0.05" strokeWidth="1.5">
        <circle cx="500" cy="0" r="400" />
        <circle cx="500" cy="0" r="410" strokeDasharray="5,15" />
        <circle cx="500" cy="0" r="600" />
        <circle cx="500" cy="0" r="800" strokeDasharray="30,10" />
        <path d="M500 0 L200 1000 M500 0 L800 1000 M500 0 L0 800 M500 0 L1000 800 L0 0 M1000 0 L500 1000" strokeDasharray="15,20" />
      </g>

      <g stroke="#d97706" strokeWidth="1.5" fill="none" opacity="0.1">
        <path d="M100 200 L110 210 M110 200 L100 210" />
        <path d="M850 150 L860 160 M860 150 L850 160" />
        <path d="M200 800 L210 810 M210 800 L200 810" />
        <path d="M800 850 L810 860 M810 850 L800 860" />
      </g>
    </svg>

    {/* Mystic Night Layer */}
    <svg className={`absolute inset-0 w-full h-full transition-opacity duration-1000 mix-blend-screen ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="nebula1" cx="20%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nebula2" cx="85%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="1000" fill="url(#nebula1)" />
      <rect width="1000" height="1000" fill="url(#nebula2)" />
      
      <g stroke="#a5b4fc" fill="none" opacity="0.05" strokeWidth="1.5">
        <circle cx="500" cy="500" r="300" />
        <circle cx="500" cy="500" r="320" strokeDasharray="4,8" />
        <circle cx="500" cy="500" r="450" />
        <circle cx="500" cy="500" r="600" strokeDasharray="10,20" />
        <path d="M500 0 L500 1000 M0 500 L1000 500" strokeDasharray="10,15" />
        <path d="M146 146 L854 854 M146 854 L854 146" strokeDasharray="10,20" />
        
        <polygon points="500,200 759,350 759,650 500,800 241,650 241,350" strokeDasharray="5,10" />
      </g>
      
      <g fill="#e0e7ff" opacity="0.3">
        <circle cx="150" cy="200" r="2.5" />
        <circle cx="850" cy="180" r="1.5" />
        <circle cx="700" cy="800" r="3" opacity="0.4"/>
        <circle cx="200" cy="750" r="1.5" />
        <circle cx="450" cy="250" r="1" />
        <circle cx="900" cy="500" r="2" />
        <circle cx="100" cy="500" r="1.5" opacity="0.5"/>
        <circle cx="800" cy="900" r="2" />
      </g>
    </svg>
  </div>
);

export default function App() {
  const [view, setView] = useState<'home' | 'draw' | 'result'>('home');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [history, setHistory] = useState<DrawHistory[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [customSpreads, setCustomSpreads] = useState<Spread[]>([]);
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpread, setEditingSpread] = useState<Spread | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState<'all' | 'main' | 'extra' | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [extraQuestion, setExtraQuestion] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Initialize theme and custom spreads
  useEffect(() => {
    const savedTheme = localStorage.getItem('tarot-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    const savedSpreads = localStorage.getItem('tarot-custom-spreads');
    if (savedSpreads) {
      try {
        setCustomSpreads(JSON.parse(savedSpreads));
      } catch (e) {
        console.error('Failed to parse saved spreads', e);
      }
    }

    const savedHistory = localStorage.getItem('tarot-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse saved history', e);
      }
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('tarot-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tarot-custom-spreads', JSON.stringify(customSpreads));
      localStorage.setItem('tarot-history', JSON.stringify(history));
    }
  }, [customSpreads, history, isLoaded]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDraw = () => {
    if (!selectedSpread) return;
    
    // Fisher-Yates Shuffle
    const deck = [...ALL_CARDS];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const results: DrawnCard[] = deck.slice(0, selectedSpread.count).map((card, index) => ({
      ...card,
      isReversed: Math.random() > 0.5,
      positionName: selectedSpread.positions[index] || `位置 ${index + 1}`,
    }));

    setDrawnCards(results);
    setView('result');

    const newHistoryId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setCurrentHistoryId(newHistoryId);
    
    const newHistoryEntry: DrawHistory = {
      id: newHistoryId,
      date: Date.now(),
      question: question || '',
      spread: selectedSpread,
      cards: results,
    };
    
    setHistory(prev => [newHistoryEntry, ...prev]);
  };

  const drawExtraCard = () => {
    if (!selectedSpread) return;
    if (extraQuestion.trim() === '') {
      showToast('請先輸入補抽想問的問題');
      return;
    }
    const availableCards = ALL_CARDS.filter(c => !drawnCards.some(dc => dc.id === c.id));
    if (availableCards.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const newCard = availableCards[randomIndex];
    const extraCard: DrawnCard = {
      ...newCard,
      isReversed: Math.random() > 0.5,
      positionName: `補充指引`,
      extraQuestion: extraQuestion.trim(),
    };

    const newDrawnCards = [...drawnCards, extraCard];
    setDrawnCards(newDrawnCards);

    if (currentHistoryId) {
      setHistory(prev => prev.map(h => 
        h.id === currentHistoryId ? { ...h, cards: newDrawnCards } : h
      ));
    }
    setExtraQuestion('');
  };

  const copyToClipboard = (type: 'all' | 'main' | 'extra' = 'all') => {
    if (!selectedSpread) return;
    
    const mainCards = drawnCards.filter(c => !c.extraQuestion);
    const extraCards = drawnCards.filter(c => c.extraQuestion);

    const mainText = mainCards.map((card, i) => `${i + 1}. ${card.positionName}：${card.nameCN} ${card.nameEN}（${card.isReversed ? '逆位' : '正位'}）`).join('\n');
    const extraText = extraCards.length > 0 
      ? `${extraCards.map(card => `Q: ${card.extraQuestion}\n👉 ${card.nameCN} ${card.nameEN}（${card.isReversed ? '逆位' : '正位'}）`).join('\n\n')}`
      : '';

    let text = '';
    if (type === 'all') {
      text = `🔮 塔羅牌抽牌結果\n\n📌 問題：${question || '未輸入'}\n🃏 牌陣：${selectedSpread.name}（${selectedSpread.count} 張）\n\n${mainText}${extraText ? `\n\n✨ 補充指引\n${extraText}` : ''}`;
    } else if (type === 'main') {
      text = `🔮 塔羅牌抽牌結果（主牌陣）\n\n📌 問題：${question || '未輸入'}\n🃏 牌陣：${selectedSpread.name}（${selectedSpread.count} 張）\n\n${mainText}`;
    } else if (type === 'extra') {
      text = `✨ 塔羅牌補充指引\n\n📌 原問題：${question || '未輸入'}\n🃏 衍生自：${selectedSpread.name}\n\n${extraText}`;
    }

    navigator.clipboard.writeText(text).then(() => {
      setShowCopySuccess(type);
      setTimeout(() => setShowCopySuccess(null), 2000);
    });
  };

  const openAddModal = () => {
    setEditingSpread({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: '',
      count: 3,
      positions: ['', '', ''],
      hint: '',
      isCustom: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (spread: Spread) => {
    setEditingSpread({ ...spread });
    setIsModalOpen(true);
  };

  const deleteSpread = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setCustomSpreads(prev => prev.filter(s => s.id !== id));
    showToast('已刪除自訂牌陣');
  };

  const saveSpread = (e: FormEvent) => {
    e.preventDefault();
    if (!editingSpread) return;
    
    setCustomSpreads(prev => {
      if (editingSpread.id && prev.find(s => s.id === editingSpread.id)) {
        return prev.map(s => s.id === editingSpread.id ? editingSpread : s);
      }
      return [...prev, editingSpread];
    });
    
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative z-0">
      <GlobalBackground theme={theme} />
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/60 dark:bg-mystic-950/50 backdrop-blur-xl border-b border-white/20 dark:border-mystic-800/50 px-4 py-4 flex justify-between items-center transition-colors duration-500">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <TarotLogoSVG />
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight gold-text drop-shadow-sm ml-1">Tarot Draw</h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-amber-100/50 dark:hover:bg-mystic-800/50 transition-colors text-sm font-semibold text-amber-900 dark:text-mystic-200"
          >
            <History size={18} /> <span className="hidden sm:inline">歷史紀錄</span>
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-amber-100/50 dark:hover:bg-mystic-800/50 transition-colors text-amber-900 dark:text-mystic-200"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Built-in Spreads */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Wand2 className="text-stone-600 dark:text-mystic-500" size={24} />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">內建牌陣</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 mx-auto">
                  {BUILTIN_SPREADS.map((spread) => (
                    <SpreadCard 
                      key={spread.id} 
                      spread={spread} 
                      onClick={() => {
                        setSelectedSpread(spread);
                        setView('draw');
                        setQuestion('');
                      }} 
                    />
                  ))}
                </div>
              </section>

              {/* Custom Spreads */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Edit2 className="text-stone-600 dark:text-mystic-500" size={24} />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">自訂牌陣</h2>
                  </div>
                  <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 text-stone-50 dark:text-white rounded-lg transition-colors text-sm font-medium shadow-md dark:shadow-mystic-500/20"
                  >
                    <Plus size={18} /> 新增牌陣
                  </button>
                </div>
                {customSpreads.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 mx-auto">
                    {customSpreads.map((spread) => (
                      <SpreadCard 
                        key={spread.id} 
                        spread={spread} 
                        isCustom
                        onClick={() => {
                          setSelectedSpread(spread);
                          setView('draw');
                          setQuestion('');
                        }}
                        onEdit={(e) => {
                          e.stopPropagation();
                          openEditModal(spread);
                        }}
                        onDelete={(e) => deleteSpread(spread.id, e)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-mystic-800 rounded-2xl text-slate-500 dark:text-mystic-400">
                    <p>尚未建立自訂牌陣</p>
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {view === 'draw' && selectedSpread && (
            <motion.div 
              key="draw"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <button 
                onClick={() => setView('home')}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-mystic-600 dark:hover:text-mystic-400 transition-colors"
              >
                <ArrowLeft size={18} /> 返回首頁
              </button>

              <div className="bg-white dark:bg-mystic-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-mystic-800">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-mystic-700 to-indigo-500 bg-clip-text text-transparent dark:from-mystic-200 dark:to-indigo-300 drop-shadow-sm">{selectedSpread.name}</h2>
                  <p className="text-slate-500 dark:text-mystic-400">{selectedSpread.hint}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-mystic-300">
                      你想問的問題？
                    </label>
                    <textarea 
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder={selectedSpread.exampleQuestion ? `例如：${selectedSpread.exampleQuestion}` : "請輸入你的困惑或想了解的事情..."}
                      className="w-full h-32 px-4 py-3 rounded-xl border border-amber-200 dark:border-mystic-800 bg-white/80 dark:bg-mystic-950 focus:ring-2 focus:ring-amber-400 dark:focus:ring-mystic-500 outline-none transition-all resize-none shadow-inner"
                    />
                  </div>

                  <div className="bg-amber-50 dark:bg-mystic-800/50 p-4 rounded-xl border border-amber-100 dark:border-mystic-700">
                    <div className="flex items-start gap-3">
                      <Info className="text-amber-500 dark:text-mystic-500 mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-sm font-medium text-amber-900 dark:text-mystic-100">牌陣資訊</p>
                        <p className="text-xs text-amber-700 dark:text-mystic-400 mt-1">
                          此牌陣將抽取 {selectedSpread.count} 張牌，分別代表：
                          {selectedSpread.positions.join('、')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleDraw}
                    className="w-full py-4 bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 dark:hover:from-mystic-500 dark:hover:to-mystic-400 text-stone-50 dark:text-white rounded-xl font-bold text-lg shadow-lg shadow-stone-800/20 dark:shadow-mystic-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Compass size={20} /> 開始抽牌
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'result' && selectedSpread && (
            <motion.div 
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8 pb-24"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-mystic-700 to-indigo-500 bg-clip-text text-transparent dark:from-mystic-200 dark:to-indigo-300 drop-shadow-sm">{selectedSpread.name}</h2>
                  <p className="text-slate-500 dark:text-mystic-400">問題：{question || '未輸入'}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setView('draw');
                      setCurrentHistoryId(null);
                      setDrawnCards([]);
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-mystic-800 hover:bg-slate-50 dark:hover:bg-mystic-900 transition-colors text-sm font-medium"
                  >
                    重新抽牌
                  </button>
                </div>
              </div>

              {/* Tablecloth Layout */}
              <div className="relative bg-white/40 dark:bg-mystic-950 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl shadow-amber-900/5 dark:shadow-mystic-900/50 border-4 border-amber-100/50 dark:border-mystic-800/30 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-50/40 via-white/40 to-amber-100/30 dark:from-mystic-800/20 dark:via-mystic-900/80 dark:to-mystic-950 pointer-events-none"></div>
                
                <div className={`relative z-10 grid gap-6 sm:gap-10 justify-center w-full max-w-5xl mx-auto ${
                  drawnCards.filter(c => !c.extraQuestion).length === 1 ? 'grid-cols-1' :
                  drawnCards.filter(c => !c.extraQuestion).length === 2 ? 'grid-cols-2' :
                  drawnCards.filter(c => !c.extraQuestion).length === 3 ? 'grid-cols-2 sm:grid-cols-3' :
                  drawnCards.filter(c => !c.extraQuestion).length === 4 ? 'grid-cols-2 sm:grid-cols-4' :
                  drawnCards.filter(c => !c.extraQuestion).length === 5 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' :
                  'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {drawnCards.filter(c => !c.extraQuestion).map((card, index) => (
                    <TarotCardDisplay key={index} card={card} index={index} />
                  ))}
                </div>

                {drawnCards.some(c => c.extraQuestion) && (
                  <div className="relative z-10 mt-16 pt-16 border-t border-amber-200/50 dark:border-mystic-800/50">
                    <h3 className="text-center text-xl font-bold gold-text mb-8 tracking-widest">✨ 補充指引</h3>
                    <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
                      {drawnCards.filter(c => c.extraQuestion).map((card, index) => (
                        <div key={index} className="flex flex-col items-center gap-4">
                          <div className="text-amber-800 dark:text-mystic-300 text-[13px] sm:text-sm font-medium text-center bg-white/80 dark:bg-mystic-900/80 px-4 py-2.5 rounded-xl border border-amber-200 dark:border-mystic-800 shadow-lg max-w-[160px] sm:max-w-[200px]">
                            <span className="text-amber-500 dark:text-mystic-500 mr-1">Q:</span>{card.extraQuestion}
                          </div>
                          <TarotCardDisplay card={card} index={index} isExtra={true} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative z-10 mt-16 flex flex-col items-center justify-center w-full">
                  <div className="flex flex-col items-center gap-4 bg-white/60 dark:bg-mystic-900/60 p-6 sm:p-8 rounded-[2rem] border border-amber-200/50 dark:border-mystic-800 w-full max-w-md backdrop-blur shadow-xl dark:shadow-2xl">
                    <div className="text-center mb-1">
                      <h4 className="font-bold text-lg text-amber-800 dark:text-mystic-300">追加牌卡指引</h4>
                      <p className="text-xs text-amber-600 dark:text-mystic-500 mt-1">若對上述結果有不懂之處，請在此發問</p>
                    </div>
                    <input 
                      type="text" 
                      value={extraQuestion}
                      onChange={(e) => setExtraQuestion(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') drawExtraCard(); }}
                      placeholder="請輸入補抽想深入了解的事..."
                      className="w-full px-5 py-3.5 rounded-xl border border-amber-200 dark:border-mystic-700 bg-white/70 dark:bg-mystic-950/80 focus:ring-2 focus:ring-amber-400 dark:focus:ring-mystic-500 outline-none text-slate-800 dark:text-white text-center text-sm shadow-inner transition-colors"
                    />
                    <button 
                      onClick={drawExtraCard}
                      className="w-full py-3 mt-1 bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 dark:hover:from-mystic-500 dark:hover:to-mystic-400 text-stone-50 dark:text-white rounded-xl font-bold shadow-lg shadow-stone-800/10 dark:shadow-mystic-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Sparkles size={18} /> 補抽一張
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-mystic-900 p-6 rounded-2xl border border-amber-100 dark:border-mystic-800 text-center shadow-sm">
                <p className="text-amber-800 dark:text-mystic-300 italic font-medium">
                  「牌卡只是指引，真正的答案在你的內心。」
                </p>
              </div>

              {/* Fixed Bottom Action Bar */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/70 dark:bg-mystic-950/80 backdrop-blur-md border-t border-amber-100/50 dark:border-mystic-800 flex flex-col items-center justify-center gap-3 z-40 shadow-[0_-10px_40px_rgba(251,191,36,0.05)] dark:shadow-none">
                <AnimatePresence>
                  {showCopySuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -top-12 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full border border-green-200 dark:border-green-800 shadow-sm"
                    >
                      ✅ 已複製 {showCopySuccess === 'all' ? '全部結果' : showCopySuccess === 'main' ? '主牌陣' : '補抽指引'} 到剪貼簿
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {drawnCards.some(c => c.extraQuestion) ? (
                    <>
                      <button 
                        onClick={() => copyToClipboard('all')}
                        className="px-5 py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 hover:dark:from-mystic-500 hover:dark:to-mystic-400 text-stone-50 dark:text-white shadow-lg shadow-stone-800/10 dark:shadow-mystic-500/20 transition-all hover:-translate-y-1 active:scale-95 font-bold flex items-center gap-2 text-sm"
                      >
                        <Copy size={16} /> 複製全部
                      </button>
                      <button 
                        onClick={() => copyToClipboard('main')}
                        className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-mystic-800 dark:hover:bg-mystic-700 text-amber-700 dark:text-mystic-300 border border-amber-200 dark:border-mystic-700 transition-all hover:-translate-y-1 active:scale-95 font-bold flex items-center gap-2 text-sm"
                      >
                        <Copy size={14} /> 僅主牌陣
                      </button>
                      <button 
                        onClick={() => copyToClipboard('extra')}
                        className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-mystic-800 dark:hover:bg-mystic-700 text-amber-700 dark:text-mystic-300 border border-amber-200 dark:border-mystic-700 transition-all hover:-translate-y-1 active:scale-95 font-bold flex items-center gap-2 text-sm"
                      >
                        <Copy size={14} /> 僅補抽
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => copyToClipboard('all')}
                      className="px-8 py-3 rounded-xl bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 dark:hover:from-mystic-500 dark:hover:to-mystic-400 text-stone-50 dark:text-white shadow-lg shadow-stone-800/10 dark:shadow-mystic-500/20 transition-all hover:-translate-y-1 active:scale-95 font-bold flex items-center gap-2"
                    >
                      <Copy size={18} /> 📋 一鍵複製結果
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* History Sidebar */}
      <AnimatePresence>
        {isHistoryOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-sm sm:max-w-md h-full bg-[#f7f3e8]/95 dark:bg-mystic-950/95 backdrop-blur-2xl shadow-[-20px_0_40px_rgba(68,64,60,0.05)] dark:shadow-[-20px_0_40px_rgba(0,0,0,0.3)] border-l border-stone-200 dark:border-mystic-800/80 flex flex-col"
            >
              <div className="px-6 py-5 border-b border-stone-200 dark:border-mystic-800/50 flex items-center justify-between bg-[#f0ead6]/80 dark:bg-mystic-900/50 shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <History size={20} className="text-stone-600 dark:text-mystic-500" /> 歷史紀錄
                </h2>
                <div className="flex items-center gap-2">
                  {history.length > 0 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowClearConfirm(true);
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium bg-slate-100/50 hover:bg-red-50 dark:bg-mystic-800/50 dark:hover:bg-red-900/20 rounded-lg px-3"
                      title="清空全部紀錄"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">清空全部紀錄</span>
                    </button>
                  )}
                  <button onClick={() => setIsHistoryOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-1">
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {history.length > 0 ? (
                  history.map((record) => (
                    <div key={record.id} className="relative group bg-stone-50/80 dark:bg-mystic-900 p-1 sm:p-2 rounded-[1.25rem] border border-stone-200/80 dark:border-mystic-800 shadow-sm hover:shadow-md hover:border-stone-400 dark:hover:border-mystic-600 transition-all flex flex-col">
                      <div 
                        className="p-4 sm:p-5 cursor-pointer flex-1"
                        onClick={() => {
                          setSelectedSpread(record.spread);
                          setQuestion(record.question);
                          setDrawnCards(record.cards);
                          setCurrentHistoryId(record.id);
                          setIsHistoryOpen(false);
                          setView('result');
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold gold-text leading-tight">{record.spread.name}</h3>
                          <span className="text-[11px] text-stone-600 dark:text-slate-400 bg-stone-200/50 dark:bg-mystic-800/50 px-2 py-1 rounded-md shrink-0">
                            {new Date(record.date).toLocaleString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-mystic-300 line-clamp-2 min-h-[2.5rem] mb-3">
                          {record.question || '（未輸入問題）'}
                        </p>
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-mystic-400">
                          <span>{record.cards.length} 張牌卡</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 pt-0">
                        <button 
                          onClick={() => {
                            setSelectedSpread(record.spread);
                            setQuestion(record.question);
                            setDrawnCards(record.cards);
                            setCurrentHistoryId(record.id);
                            setIsHistoryOpen(false);
                            setView('result');
                          }}
                          className="flex-[4] py-3.5 bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 dark:hover:from-mystic-500 dark:hover:to-mystic-400 text-stone-50 dark:text-white rounded-xl shadow-lg shadow-stone-800/10 dark:shadow-mystic-500/20 transition-all active:scale-95 text-[15px] font-bold flex items-center justify-center gap-2"
                        >
                          👁️ 前往查看
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setHistory(prev => prev.filter(h => h.id !== record.id));
                            showToast('已刪除紀錄');
                          }}
                          className="flex-1 py-3.5 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all rounded-xl active:scale-95 flex items-center justify-center"
                          aria-label="刪除紀錄"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-slate-500 dark:text-mystic-400">
                    <p>尚未有任何抽牌紀錄</p>
                  </div>
                )}
              </div>
              
              <AnimatePresence>
                {showClearConfirm && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute bottom-6 left-4 right-4 bg-white dark:bg-mystic-900 rounded-2xl shadow-2xl border-2 border-red-200 dark:border-red-900/50 p-5 z-50 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-red-50/50 dark:bg-red-900/10 pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center text-red-500 mb-1">
                        <Trash2 size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-red-600 dark:text-red-400">確定要清空所有紀錄嗎？</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">此動作無法復原，請確認是否要繼續。</p>
                      <div className="flex w-full gap-3 mt-1">
                        <button 
                          onClick={() => setShowClearConfirm(false)}
                          className="flex-1 py-2.5 rounded-xl font-bold bg-slate-100 dark:bg-mystic-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-mystic-700 transition-colors"
                        >
                          取消
                        </button>
                        <button 
                          onClick={() => {
                            setHistory([]);
                            if (currentHistoryId && history.find(h => h.id === currentHistoryId)) {
                              setCurrentHistoryId(null);
                              setDrawnCards([]);
                              setView('home');
                            }
                            setShowClearConfirm(false);
                            showToast('已清空所有紀錄');
                          }}
                          className="flex-1 py-2.5 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all active:scale-95"
                        >
                          確認清空
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Spread Modal */}
      <AnimatePresence>
        {isModalOpen && editingSpread && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-mystic-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-mystic-800 flex justify-between items-center">
                <h3 className="text-xl font-bold">自訂牌陣</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={saveSpread} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium mb-1">牌陣名稱</label>
                  <input 
                    required
                    value={editingSpread.name}
                    onChange={e => setEditingSpread({...editingSpread, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-mystic-800 bg-slate-50 dark:bg-mystic-950"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">提示文字</label>
                  <input 
                    value={editingSpread.hint}
                    onChange={e => setEditingSpread({...editingSpread, hint: e.target.value})}
                    placeholder="例如：深入剖析..."
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-mystic-800 bg-slate-50 dark:bg-mystic-950"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">抽牌張數 ({editingSpread.count})</label>
                  <input 
                    type="range" min="1" max="10"
                    value={editingSpread.count}
                    onChange={e => {
                      const count = parseInt(e.target.value);
                      const positions = [...editingSpread.positions];
                      if (count > positions.length) {
                        for (let i = positions.length; i < count; i++) positions.push('');
                      } else {
                        positions.splice(count);
                      }
                      setEditingSpread({...editingSpread, count, positions});
                    }}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">各位置名稱</label>
                  {editingSpread.positions.map((pos, i) => (
                    <input 
                      key={i}
                      required
                      placeholder={`位置 ${i + 1} 名稱`}
                      value={pos}
                      onChange={e => {
                        const newPos = [...editingSpread.positions];
                        newPos[i] = e.target.value;
                        setEditingSpread({...editingSpread, positions: newPos});
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-mystic-800 bg-slate-50 dark:bg-mystic-950 text-sm"
                    />
                  ))}
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-mystic-600 hover:bg-mystic-500 text-white rounded-xl font-bold transition-colors"
                >
                  儲存牌陣
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 bg-mystic-800/95 backdrop-blur shadow-2xl text-white rounded-full font-medium tracking-wide flex items-center gap-3 border border-mystic-700/50"
          >
            <CheckCircle2 size={18} className="text-gold-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpreadCard({ spread, isCustom, onClick, onEdit, onDelete }: { 
  spread: Spread; 
  isCustom?: boolean; 
  onClick: () => void;
  onEdit?: (e: MouseEvent) => void;
  onDelete?: (e: MouseEvent) => void;
  key?: string | number;
}) {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white/60 dark:bg-mystic-900/60 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-[1.5rem] border border-stone-200/60 dark:border-mystic-800/60 hover:border-stone-400 dark:hover:border-mystic-500 transition-all cursor-pointer hover:shadow-xl hover:shadow-stone-500/10 dark:hover:shadow-mystic-500/10 hover:-translate-y-1 overflow-hidden flex flex-col h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-stone-500/0 via-transparent to-stone-500/5 dark:from-mystic-500/0 dark:via-transparent dark:to-mystic-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {isCustom && (
        <span className="absolute top-3 right-3 sm:top-4 sm:right-4 px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-stone-200/60 dark:bg-mystic-800/80 text-stone-700 dark:text-mystic-400 text-[9px] sm:text-[10px] font-bold rounded uppercase tracking-wider shadow-sm z-10">
          自訂
        </span>
      )}
      <div className="mb-3 sm:mb-4 relative z-10">
        <h3 className="text-[17px] sm:text-xl font-bold group-hover:text-stone-700 dark:group-hover:text-mystic-400 transition-colors drop-shadow-sm leading-tight pr-6 sm:pr-0">{spread.name}</h3>
        <span className="text-[10px] sm:text-xs font-semibold text-stone-500 dark:text-mystic-400 shrink-0 opacity-80 mt-0.5 sm:mt-1 block">{spread.count} 張牌</span>
      </div>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-mystic-300 line-clamp-2 mb-4 sm:mb-6 relative z-10 font-medium">{spread.hint || `自訂牌陣 · ${spread.count} 張`}</p>
      
      <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-auto relative z-10">
        {spread.positions.map((pos, idx) => (
          <span key={idx} className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-stone-100 dark:bg-mystic-800 text-slate-600 dark:text-mystic-300 text-[9px] sm:text-[10px] rounded sm:rounded-md font-medium whitespace-nowrap">
            {pos}
          </span>
        ))}
      </div>

      {isCustom && (
        <div className="mt-4 pt-4 border-t border-amber-100 dark:border-mystic-800 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (onEdit) onEdit(e);
            }} 
            className="p-1.5 text-slate-400 dark:text-mystic-500 hover:text-amber-600 dark:hover:text-mystic-400 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (onDelete) onDelete(e);
            }} 
            className="p-1.5 text-slate-400 dark:text-mystic-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function TarotCardDisplay({ card, index, isExtra }: { card: DrawnCard; index: number; isExtra?: boolean; key?: string | number }) {
  const emoji = getCardEmoji(card.id);
  const isMajor = card.id < 22;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center gap-3 shrink-0 mx-auto"
    >
      {!isExtra && (
        <div className="text-xs font-bold text-amber-700 dark:text-mystic-400 uppercase tracking-widest text-center h-4 drop-shadow-sm">
          {index + 1}. {card.positionName}
        </div>
      )}
      
      <div className={`relative aspect-square w-[130px] sm:w-[150px] rounded-2xl overflow-hidden border-4 transition-all duration-500 ${
        card.isReversed ? 'border-red-400/80 dark:border-red-500/50 shadow-red-500/20' : 
        isExtra ? 'border-amber-400/80 dark:border-mystic-500/50 shadow-amber-500/20 dark:shadow-mystic-500/20' : 
        'border-amber-300/80 dark:border-gold-500/50 shadow-amber-500/20 dark:shadow-gold-500/20'
      } shadow-xl backdrop-blur-sm`}>
        {/* Card Background Decoration */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-colors ${
          isMajor ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/80 via-orange-50/50 to-white dark:from-mystic-800/80 dark:via-mystic-900 dark:to-mystic-950' : 'bg-white/90 dark:bg-mystic-900'
        }`}>
          <div className={`absolute inset-2 border rounded-lg pointer-events-none ${
            isMajor ? 'border-amber-300/40 dark:border-gold-700/20' : 'border-amber-100 dark:border-mystic-800/50'
          }`} />
          
          {/* Mystical Symbols */}
          <div className="absolute top-3 left-3 flex items-center justify-center opacity-40 dark:opacity-30">
            {isMajor ? <Sparkles size={12} className="text-amber-500 dark:text-gold-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-300 dark:bg-mystic-500" />}
          </div>
          <div className="absolute top-3 right-3 flex items-center justify-center opacity-40 dark:opacity-30">
            {isMajor ? <Sparkles size={12} className="text-amber-500 dark:text-gold-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-300 dark:bg-mystic-500" />}
          </div>
          <div className="absolute bottom-3 left-3 flex items-center justify-center opacity-40 dark:opacity-30">
            {isMajor ? <Sparkles size={12} className="text-amber-500 dark:text-gold-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-300 dark:bg-mystic-500" />}
          </div>
          <div className="absolute bottom-3 right-3 flex items-center justify-center opacity-40 dark:opacity-30">
            {isMajor ? <Sparkles size={12} className="text-amber-500 dark:text-gold-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-300 dark:bg-mystic-500" />}
          </div>

          {/* Card Content */}
          <div className={`flex flex-col items-center justify-center text-center transition-transform duration-700 h-full w-full p-2 ${card.isReversed ? 'rotate-180' : ''}`}>
            <div className="text-4xl sm:text-5xl mb-2">{emoji}</div>
            <div className={`font-extrabold text-lg sm:text-xl mb-1 tracking-wider leading-tight ${
              isMajor ? 'text-amber-900 dark:text-amber-50 drop-shadow-sm dark:drop-shadow-md' : 'text-slate-800 dark:text-mystic-100'
            }`}>{card.nameCN}</div>
            <div className={`text-[10px] sm:text-[11px] tracking-widest uppercase leading-tight scale-90 ${
              isMajor ? 'text-amber-600 font-bold dark:text-gold-400/80 dark:font-semibold' : 'text-amber-700/60 dark:text-mystic-400 font-semibold'
            }`}>{card.nameEN}</div>
          </div>
        </div>

        {/* Reversed Badge */}
        {card.isReversed && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
            逆
          </div>
        )}
      </div>

      <div className="text-center">
        <div className="font-bold text-slate-800 dark:text-mystic-100">{card.nameCN}</div>
        <div className={`text-xs font-bold ${card.isReversed ? 'text-red-500 dark:text-red-400' : 'text-amber-600 dark:text-mystic-400'}`}>
          {card.isReversed ? '逆位' : '正位'}
        </div>
      </div>
    </motion.div>
  );
}
