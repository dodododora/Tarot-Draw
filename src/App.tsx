import React, { useState, useEffect, type MouseEvent, type FormEvent } from 'react';
import { Moon, Sun, Plus, Trash2, Edit2, Copy, ArrowLeft, Sparkles, Wand2, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_CARDS, BUILTIN_SPREADS, type Spread, type TarotCard } from './constants';

interface DrawnCard extends TarotCard {
  isReversed: boolean;
  positionName: string;
}

export default function App() {
  const [view, setView] = useState<'home' | 'draw' | 'result'>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [customSpreads, setCustomSpreads] = useState<Spread[]>([]);
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpread, setEditingSpread] = useState<Spread | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('tarot-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tarot-custom-spreads', JSON.stringify(customSpreads));
    }
  }, [customSpreads, isLoaded]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

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
  };

  const copyToClipboard = () => {
    if (!selectedSpread) return;
    
    const text = `🔮 塔羅牌抽牌結果

📌 問題：${question || '未輸入'}
🃏 牌陣：${selectedSpread.name}（${selectedSpread.count} 張）

${drawnCards.map((card, i) => `${i + 1}. ${card.positionName}：${card.nameCN} ${card.nameEN}（${card.isReversed ? '逆位' : '正位'}）`).join('\n')}`;

    navigator.clipboard.writeText(text).then(() => {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
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
    if (window.confirm('確定要刪除此自訂牌陣嗎？')) {
      setCustomSpreads(prev => prev.filter(s => s.id !== id));
    }
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
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-mystic-950/80 backdrop-blur-md border-b border-slate-200 dark:border-mystic-800 px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-mystic-600 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
            <Sparkles size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight gold-text">✦ Tarot Draw</h1>
        </div>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-mystic-800 transition-colors text-slate-600 dark:text-slate-400"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
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
                  <Wand2 className="text-slate-800 dark:text-slate-200" size={24} />
                  <h2 className="text-2xl font-bold">內建牌陣</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <Edit2 className="text-slate-800 dark:text-slate-200" size={24} />
                    <h2 className="text-2xl font-bold">自訂牌陣</h2>
                  </div>
                  <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-mystic-600 dark:hover:bg-mystic-500 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <Plus size={18} /> 新增牌陣
                  </button>
                </div>
                {customSpreads.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300">
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
                className="flex items-center gap-2 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={18} /> 返回首頁
              </button>

              <div className="bg-white dark:bg-mystic-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-mystic-800">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2 gold-text tracking-wide">{selectedSpread.name}</h2>
                  <p className="text-slate-700 dark:text-slate-200 text-lg font-medium">{selectedSpread.hint}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-white">
                      你想問的問題？
                    </label>
                    <textarea 
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="請輸入你的困惑或想了解的事情..."
                      className="w-full h-32 px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-slate-800 dark:focus:ring-mystic-400 outline-none transition-all resize-none text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                      <Info className="text-slate-700 dark:text-slate-300 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-base font-bold text-slate-900 dark:text-white">牌陣資訊</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
                          此牌陣將抽取 {selectedSpread.count} 張牌，分別代表：
                          {selectedSpread.positions.join('、')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleDraw}
                    className="w-full py-4 bg-slate-800 hover:bg-slate-900 dark:bg-mystic-600 dark:hover:bg-mystic-500 text-white rounded-xl font-bold text-xl shadow-lg transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={24} /> 開始抽牌
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
                  <h2 className="text-2xl font-bold gold-text tracking-wider">{selectedSpread.name}</h2>
                  <p className="text-slate-700 dark:text-slate-200 text-lg font-bold">問題：{question || '未輸入'}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setView('draw')}
                    className="px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-bold text-slate-800 dark:text-white"
                  >
                    重新抽牌
                  </button>
                </div>
              </div>

              {/* 實體桌巾區域 (Tablecloth Container) */}
              <div className="relative bg-slate-200 dark:bg-slate-900 p-8 rounded-3xl shadow-inner border-4 border-slate-300 dark:border-slate-800 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-transparent to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-wrap justify-center items-center gap-x-6 gap-y-10 min-h-[300px]">
                  {drawnCards.map((card, index) => (
                    <TarotCardDisplay key={index} card={card} index={index} />
                  ))}
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-700 text-center">
                <p className="text-slate-800 dark:text-white font-bold text-lg">
                  「牌卡只是指引，真正的答案在你的內心。」
                </p>
              </div>

              {/* Fixed Bottom Action Bar */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-mystic-950/80 backdrop-blur-md border-t border-slate-200 dark:border-mystic-800 flex flex-col items-center gap-2 z-40">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={copyToClipboard}
                    className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-mystic-600 dark:hover:bg-mystic-500 text-white shadow-lg transition-all hover:-translate-y-1 active:scale-95 font-bold flex items-center gap-2"
                  >
                    <Copy size={18} /> 📋 一鍵複製結果
                  </button>
                  <AnimatePresence>
                    {showCopySuccess && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="text-sm font-medium text-green-500 dark:text-green-400"
                      >
                        ✅ 已複製到剪貼簿
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

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
      className="group relative bg-white dark:bg-mystic-900 p-6 rounded-2xl border border-slate-200 dark:border-mystic-800 hover:border-mystic-500 dark:hover:border-mystic-500 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1"
    >
      {isCustom && (
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-mystic-100 dark:bg-mystic-800 text-mystic-600 dark:text-mystic-400 text-[10px] font-bold rounded uppercase tracking-wider">
          自訂
        </span>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-bold group-hover:text-slate-600 dark:group-hover:text-white transition-colors text-slate-900 dark:text-white">{spread.name}</h3>
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{spread.count} 張牌</span>
      </div>
      <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-2">{spread.hint || `自訂牌陣 · ${spread.count} 張`}</p>
      
      {isCustom && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function TarotCardDisplay({ card, index }: { card: DrawnCard; index: number; key?: string | number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest bg-slate-100/50 dark:bg-black/20 px-2 py-1 rounded-md">
        {index + 1}. {card.positionName}
      </div>
      
      <div className={`relative w-full aspect-[2/3.5] max-w-[180px] rounded-xl overflow-hidden border-4 transition-all duration-500 ${
        card.isReversed ? 'border-red-500/50 shadow-red-500/20' : 'border-gold-500/50 shadow-gold-500/20'
      } shadow-2xl`}>
        {/* Card Background Decoration */}
        <div className="absolute inset-0 bg-mystic-900 flex flex-col items-center justify-center p-4">
          <div className="absolute inset-2 border border-mystic-800/50 rounded-lg pointer-events-none" />
          
          {/* Mystical Symbols */}
          <div className="absolute top-4 left-4 text-mystic-700 opacity-20"><Sparkles size={12} /></div>
          <div className="absolute top-4 right-4 text-mystic-700 opacity-20"><Sparkles size={12} /></div>
          <div className="absolute bottom-4 left-4 text-mystic-700 opacity-20"><Sparkles size={12} /></div>
          <div className="absolute bottom-4 right-4 text-mystic-700 opacity-20"><Sparkles size={12} /></div>

          {/* Card Content */}
          <div className={`flex flex-col items-center text-center transition-transform duration-700 ${card.isReversed ? 'rotate-180' : ''}`}>
            <div className="text-4xl mb-4">🎴</div>
            <div className="text-mystic-200 font-bold text-sm mb-1">{card.nameCN}</div>
            <div className="text-mystic-500 text-[10px] leading-tight px-2">{card.nameEN}</div>
          </div>
        </div>

        {/* Reversed Badge */}
        {card.isReversed && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
            逆
          </div>
        )}
      </div>

      <div className="text-center bg-slate-100/50 dark:bg-black/20 px-3 py-2 rounded-xl">
        <div className="font-bold text-slate-900 dark:text-white text-base">{card.nameCN}</div>
        <div className={`text-sm font-bold mt-1 ${card.isReversed ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
          {card.isReversed ? '逆位' : '正位'}
        </div>
      </div>
    </motion.div>
  );
}
