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
          <div className="w-8 h-8 rounded-full bg-mystic-600 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
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
                  <Wand2 className="text-mystic-500" size={24} />
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
                    <Edit2 className="text-mystic-500" size={24} />
                    <h2 className="text-2xl font-bold">自訂牌陣</h2>
                  </div>
                  <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-mystic-600 hover:bg-mystic-500 text-white rounded-lg transition-colors text-sm font-medium"
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
                  <h2 className="text-3xl font-bold mb-2 gold-text">{selectedSpread.name}</h2>
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
                      placeholder="請輸入你的困惑或想了解的事情..."
                      className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-mystic-800 bg-slate-50 dark:bg-mystic-950 focus:ring-2 focus:ring-mystic-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="bg-mystic-50 dark:bg-mystic-800/50 p-4 rounded-xl border border-mystic-100 dark:border-mystic-700">
                    <div className="flex items-start gap-3">
                      <Info className="text-mystic-500 mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-sm font-medium text-mystic-900 dark:text-mystic-100">牌陣資訊</p>
                        <p className="text-xs text-mystic-600 dark:text-mystic-400 mt-1">
                          此牌陣將抽取 {selectedSpread.count} 張牌，分別代表：
                          {selectedSpread.positions.join('、')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleDraw}
                    className="w-full py-4 bg-mystic-600 hover:bg-mystic-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-mystic-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={20} /> 開始抽牌
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
                  <h2 className="text-2xl font-bold gold-text">{selectedSpread.name}</h2>
                  <p className="text-slate-500 dark:text-mystic-400">問題：{question || '未輸入'}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setView('draw')}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-mystic-800 hover:bg-slate-50 dark:hover:bg-mystic-900 transition-colors text-sm font-medium"
                  >
                    重新抽牌
                  </button>
                </div>
              </div>

              <SpreadLayoutEngine spread={selectedSpread} cards={drawnCards} />

              <div className="bg-white dark:bg-mystic-900 p-6 rounded-2xl border border-slate-100 dark:border-mystic-800 text-center">
                <p className="text-slate-600 dark:text-mystic-300 italic">
                  「牌卡只是指引，真正的答案在你的內心。」
                </p>
              </div>

              {/* Fixed Bottom Action Bar */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-mystic-950/80 backdrop-blur-md border-t border-slate-200 dark:border-mystic-800 flex flex-col items-center gap-2 z-40">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={copyToClipboard}
                    className="px-8 py-3 rounded-xl bg-mystic-600 hover:bg-mystic-500 text-white shadow-lg shadow-mystic-500/20 transition-all hover:-translate-y-1 active:scale-95 font-bold flex items-center gap-2"
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
        <h3 className="text-lg font-bold group-hover:text-mystic-500 transition-colors">{spread.name}</h3>
        <span className="text-xs font-medium text-slate-500 dark:text-mystic-400">{spread.count} 張牌</span>
      </div>
      <p className="text-sm text-slate-500 dark:text-mystic-400 line-clamp-2">{spread.hint || `自訂牌陣 · ${spread.count} 張`}</p>
      
      {isCustom && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-mystic-800 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 text-slate-400 dark:text-mystic-500 hover:text-mystic-600 dark:hover:text-mystic-400 transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="p-1.5 text-slate-400 dark:text-mystic-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function TarotCardDisplay({ card, index, isAbsolute }: { card: DrawnCard; index: number; isAbsolute?: boolean; key?: string | number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, type: 'spring' }}
      className={`flex flex-col items-center gap-2 w-full ${isAbsolute ? '' : 'h-full'}`}
    >
      <div className={`text-[10px] sm:text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider bg-slate-100/90 dark:bg-black/80 px-2 py-0.5 rounded shadow whitespace-nowrap text-center ${isAbsolute ? 'absolute -top-6 left-1/2 -translate-x-1/2 z-20 whitespace-normal min-w-[120%]' : ''}`}>
        {index + 1}. {card.positionName}
        {isAbsolute && <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5">{card.nameCN} {card.isReversed ? '(逆)' : ''}</div>}
      </div>
      
      <div className={`relative w-full aspect-[2/3.5] max-w-[180px] rounded-xl overflow-hidden border-2 sm:border-4 transition-all duration-500 ${
        card.isReversed ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]' : 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
      }`}>
        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-2">
          <div className="absolute inset-1.5 border-2 border-slate-700/50 rounded pointer-events-none" />
          
          <div className={`flex flex-col items-center justify-center text-center transition-transform duration-700 w-full h-full ${card.isReversed ? 'rotate-180' : ''}`}>
            <div className="text-3xl sm:text-4xl mb-2">🎴</div>
            <div className="text-white font-extrabold text-[10px] sm:text-sm leading-tight mb-1 px-1">{card.nameCN}</div>
            <div className="text-slate-400 font-bold text-[8px] sm:text-[10px] leading-tight px-1">{card.nameEN}</div>
          </div>
        </div>

        {card.isReversed && (
          <div className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black px-1 rounded shadow-sm z-10">
            逆
          </div>
        )}
      </div>

      {!isAbsolute && (
        <div className="text-center mt-1 bg-white/90 dark:bg-black/80 px-3 py-1 rounded-lg shadow whitespace-nowrap">
          <div className="font-extrabold text-slate-900 dark:text-white text-sm">{card.nameCN}</div>
          <div className={`text-xs font-black ${card.isReversed ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-300'}`}>
            {card.isReversed ? '逆位' : '正位'}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function SpreadLayoutEngine({ spread, cards }: { spread: Spread, cards: DrawnCard[] }) {
  const LAYOUTS: Record<string, { w: string, cards: { left: string, top: string, rotation?: number }[] }> = {
    celtic: {
      w: 'aspect-[3/4] sm:aspect-[4/3] w-full max-w-4xl relative',
      cards: [
        { left: '40%', top: '50%' }, // 1 現況
        { left: '40%', top: '50%', rotation: 90 }, // 2 挑戰
        { left: '40%', top: '80%' }, // 3 潛意識
        { left: '15%', top: '50%' }, // 4 過去
        { left: '40%', top: '20%' }, // 5 可能結果
        { left: '65%', top: '50%' }, // 6 近未來
        { left: '90%', top: '80%' }, // 7 自我認知
        { left: '90%', top: '60%' }, // 8 外在環境
        { left: '90%', top: '40%' }, // 9 希望與恐懼
        { left: '90%', top: '20%' }, // 10 最終結果
      ]
    },
    choice: {
      w: 'aspect-[4/3] sm:aspect-video w-full max-w-3xl relative',
      cards: [
        { left: '50%', top: '80%' }, // 1
        { left: '30%', top: '50%' }, // 2
        { left: '15%', top: '20%' }, // 3
        { left: '70%', top: '50%' }, // 4
        { left: '85%', top: '20%' }, // 5
      ]
    },
    lovers: {
      w: 'aspect-[4/3] sm:aspect-video w-full max-w-3xl relative',
      cards: [
        { left: '20%', top: '30%' }, // 1
        { left: '80%', top: '30%' }, // 2
        { left: '50%', top: '50%' }, // 3
        { left: '35%', top: '80%' }, // 4
        { left: '65%', top: '80%' }, // 5
        { left: '50%', top: '20%' }, // 6
      ]
    }
  };

  const layout = spread.isCustom ? null : LAYOUTS[spread.id];

  const TableclothWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className="tarot-tablecloth w-full overflow-hidden flex items-center justify-center min-h-[50vh]">
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </div>
  );

  if (layout && layout.cards.length === cards.length) {
    return (
      <TableclothWrapper className={layout.w}>
        {cards.map((card, idx) => {
          const pos = layout.cards[idx];
          return (
            <div 
              key={idx} 
              className="absolute w-[22%] sm:w-[15%] max-w-[130px] z-10 transition-all duration-300 hover:z-30 hover:scale-[1.15]"
              style={{ 
                left: pos.left, 
                top: pos.top, 
                transform: `translate(-50%, -50%) ${pos.rotation ? `rotate(${pos.rotation}deg)` : ''}` 
              }}
            >
              <TarotCardDisplay card={card} index={idx} isAbsolute />
            </div>
          );
        })}
      </TableclothWrapper>
    );
  }

  // Fallback / default generic layout (Flex Wrap, clean horizontal)
  return (
    <TableclothWrapper>
      <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 py-10 px-4 max-w-5xl mx-auto">
        {cards.map((card, index) => (
          <div key={index} className="w-[110px] sm:w-[140px] z-10 hover:z-20 hover:-translate-y-2 transition-transform duration-300">
            <TarotCardDisplay card={card} index={index} />
          </div>
        ))}
      </div>
    </TableclothWrapper>
  );
}
