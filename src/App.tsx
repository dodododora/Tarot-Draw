import React, { useState, useEffect, type MouseEvent, type FormEvent } from 'react';
import { Moon, Sun, Plus, Trash2, Edit2, Copy, ArrowLeft, Sparkles, Wand2, Info, X, History, CheckCircle2, Compass, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_CARDS, THOTH_SPREADS, WAITE_SPREADS, getCardEmoji, TAROT_TRIVIA, LENORMAND_CARDS, LENORMAND_SPREADS, LENORMAND_TRIVIA, THOTH_ALL_CARDS, THOTH_TRIVIA, ORACLE_DATA, type Spread, type TarotCard, type LenormandCard } from './constants';

export interface DrawHistory {
  id: string;
  date: number;
  question: string;
  spread: Spread;
  cards: DrawnCard[];
  lenormandCards?: DrawnLenormandCard[];
  mode?: 'tarot' | 'lenormand' | 'thoth';
}

interface DrawnCard extends TarotCard {
  isReversed: boolean;
  positionName: string;
  extraQuestion?: string;
}

interface DrawnLenormandCard extends LenormandCard {
  positionName: string;
}
const TarotLogoSVG = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-sm rounded-xl overflow-hidden group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(252,211,77,0.5)] transition-all duration-300 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ll-bg" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#3730a3" />
        <stop offset="100%" stopColor="#0a0718" />
      </radialGradient>
    </defs>
    {/* Background */}
    <rect width="100" height="100" fill="url(#ll-bg)" />
    {/* Outer dashed ring */}
    <circle cx="50" cy="50" r="46" stroke="#FBBF24" strokeWidth="0.8" strokeDasharray="3 6" opacity="0.35" />
    {/* Tarot card frame */}
    <rect x="20" y="10" width="60" height="80" rx="6" stroke="#FBBF24" strokeWidth="2" fill="rgba(255,255,255,0.03)" />
    <rect x="24" y="14" width="52" height="72" rx="4" stroke="#FBBF24" strokeWidth="0.7" fill="none" opacity="0.4" />
    {/* Crescent moon at top */}
    <path d="M36 24 A16 16 0 0 1 64 24 A12 12 0 0 0 36 24 Z" fill="#FBBF24" opacity="0.82" />
    {/* Hexagram (Star of David) — triangle up */}
    <path d="M50 37 L59 53 L41 53 Z" stroke="#FBBF24" strokeWidth="1.6" fill="rgba(251,191,36,0.12)" />
    {/* Hexagram — triangle down */}
    <path d="M50 63 L41 47 L59 47 Z" stroke="#FBBF24" strokeWidth="1.6" fill="rgba(251,191,36,0.12)" />
    {/* Center circle */}
    <circle cx="50" cy="50" r="4" fill="#FBBF24" />
    <circle cx="51.5" cy="48.5" r="1.4" fill="#0a0718" opacity="0.8" />
    {/* Corner dots */}
    <circle cx="28" cy="22" r="2" fill="#FBBF24" opacity="0.6" />
    <circle cx="72" cy="22" r="2" fill="#FBBF24" opacity="0.6" />
    <circle cx="28" cy="78" r="2" fill="#FBBF24" opacity="0.6" />
    <circle cx="72" cy="78" r="2" fill="#FBBF24" opacity="0.6" />
    {/* Bottom horizon lines */}
    <line x1="38" y1="71" x2="62" y2="71" stroke="#FBBF24" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
    <line x1="33" y1="75" x2="67" y2="75" stroke="#FBBF24" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
    <line x1="41" y1="79" x2="59" y2="79" stroke="#FBBF24" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
    {/* Side sparkles */}
    <path d="M29 50 L30.4 53.6 L34 55 L30.4 56.4 L29 60 L27.6 56.4 L24 55 L27.6 53.6 Z" fill="#FBBF24" opacity="0.5" />
    <path d="M71 42 L72 44.5 L74.5 45.5 L72 46.5 L71 49 L70 46.5 L67.5 45.5 L70 44.5 Z" fill="#FBBF24" opacity="0.45" />
  </svg>
);

const GlobalBackground = ({ theme }: { theme: 'light' | 'dark' }) => (
  <div className="fixed inset-0 pointer-events-none -z-10 transition-colors duration-700 overflow-hidden"
    style={{
      background: theme === 'dark'
        ? 'radial-gradient(ellipse at 20% 30%, #4c1d9540 0%, transparent 60%), radial-gradient(ellipse at 85% 80%, #1e3a8a30 0%, transparent 60%), #0b0a14'
        : 'radial-gradient(ellipse at 50% 0%, #fde04720 0%, transparent 70%), #f7f3e8'
    }}
  >
    {/* Subtle star dots — dark only */}
    {theme === 'dark' && (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <g fill="#e0e7ff" opacity="0.25">
          <circle cx="150" cy="200" r="2" />
          <circle cx="850" cy="180" r="1.5" />
          <circle cx="700" cy="800" r="2.5" />
          <circle cx="200" cy="750" r="1.5" />
          <circle cx="900" cy="500" r="2" />
          <circle cx="100" cy="500" r="1.5" />
          <circle cx="450" cy="100" r="1" />
          <circle cx="600" cy="300" r="1" />
        </g>
      </svg>
    )}
  </div>
);



export default function App() {
  const [mode, setMode] = useState<'tarot' | 'lenormand' | 'thoth'>('tarot');
  const [view, setView] = useState<'home' | 'draw' | 'result'>('home');
  const [lenormandDrawnCards, setLenormandDrawnCards] = useState<DrawnLenormandCard[]>([]);
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
  const [choiceCount, setChoiceCount] = useState(2);
  const [peopleCount, setPeopleCount] = useState(2);
  const [drawInputMode, setDrawInputMode] = useState<'random' | 'manual'>('random');
  const [manualInputs, setManualInputs] = useState<{name: string; reversed: boolean}[]>([]);

  const currentTrivia = React.useMemo(() => {
    let pool = TAROT_TRIVIA;
    if (mode === 'lenormand') pool = LENORMAND_TRIVIA;
    if (mode === 'thoth') pool = THOTH_TRIVIA;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [view, selectedSpread, mode]);

  // Dynamic choice spread modifier
  useEffect(() => {
    if (selectedSpread?.id === 'choice') {
      const positions = ["決策當下的現況"];
      for (let i = 0; i < choiceCount; i++) {
        const char = String.fromCharCode(65 + i);
        positions.push(`選擇${char}的發展軌跡`, `選擇${char}的結果`);
      }
      
      const expectedCount = 1 + choiceCount * 2;
      if (selectedSpread.count !== expectedCount) {
        setSelectedSpread({
          ...selectedSpread,
          name: choiceCount === 2 ? "命運二擇一" : `命運多擇一 (${choiceCount} 選項)`,
          count: expectedCount,
          positions,
          exampleQuestion: choiceCount > 2 ? "我該如何從多個不同的潛在選擇中做出決定？" : "我該留在原公司，還是接受獵頭提供的新 offer？"
        });
      }
    }
  }, [choiceCount, selectedSpread]);

  // Dynamic mirror spread modifier
  useEffect(() => {
    if (selectedSpread?.id === 'mirror') {
      const positions = ["主角眼中的自己"];
      for (let i = 0; i < peopleCount - 1; i++) {
        const char = peopleCount === 2 ? "" : String.fromCharCode(65 + i);
        const label = `對象${char}`;
        positions.push(
          `${label}眼中的主角`,
          `主角眼中的${label}`,
          `${label}眼中的自己`
        );
      }
      
      positions.push(
        peopleCount === 2 ? "互動產生的誤解" : "多方互動的盲點",
        peopleCount === 2 ? "關係發展的建議" : "群體關係的建議"
      );
      
      const expectedCount = 1 + (peopleCount - 1) * 3 + 2;
      
      if (selectedSpread.count !== expectedCount) {
        setSelectedSpread({
          ...selectedSpread,
          name: peopleCount === 2 ? "雙方鏡像關係" : `多方鏡像關係 (${peopleCount}人局)`,
          count: expectedCount,
          positions,
          exampleQuestion: peopleCount > 2 ? "我與團隊中另外幾位同事彼此之間真實的看法是什麼？" : "我跟前任目前各自對彼此真實的看法是什麼？"
        });
      }
    }
  }, [peopleCount, selectedSpread]);

  // Reset manual inputs when spread card count changes
  useEffect(() => {
    if (selectedSpread) {
      setManualInputs(prev =>
        Array.from({ length: selectedSpread.count }, (_, i) =>
          prev[i] ?? { name: '', reversed: false }
        )
      );
    }
  }, [selectedSpread?.count]);
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

    if (mode === 'lenormand') {
      // Lenormand draw — no reversed
      const deck = [...LENORMAND_CARDS];
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      const lenResults: DrawnLenormandCard[] = deck.slice(0, selectedSpread.count).map((card, index) => ({
        ...card,
        positionName: selectedSpread.positions[index] || `位置 ${index + 1}`,
      }));
      setLenormandDrawnCards(lenResults);
      setView('result');
      const newHistoryId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      setCurrentHistoryId(newHistoryId);
      setHistory(prev => [{ id: newHistoryId, date: Date.now(), question: question || '', spread: selectedSpread, cards: [], lenormandCards: lenResults, mode: 'lenormand' as const }, ...prev]);
      return;
    }
    
    // Fisher-Yates Shuffle (Tarot & Thoth)
    const deck = mode === 'thoth' ? [...THOTH_ALL_CARDS] : [...ALL_CARDS];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const results: DrawnCard[] = deck.slice(0, selectedSpread.count).map((card, index) => ({
      ...card,
      isReversed: mode === 'thoth' ? false : Math.random() > 0.5,
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
      mode: mode,
    };
    
    setHistory(prev => [newHistoryEntry, ...prev]);
  };

  const handleManualSubmit = () => {
    if (!selectedSpread) return;
    const filled = manualInputs.filter(i => i.name.trim());
    if (filled.length === 0) { showToast('請至少填入一張牌'); return; }

    if (mode === 'lenormand') {
      const results: DrawnLenormandCard[] = selectedSpread.positions.map((pos, i) => {
        const input = manualInputs[i] ?? { name: '', reversed: false };
        const cleanName = input.name.trim();
        const matched = LENORMAND_CARDS.find(c =>
          cleanName && (c.nameCN.includes(cleanName) || c.nameEN.toLowerCase().includes(cleanName.toLowerCase()))
        );
        return {
          ...(matched ?? { id: -(i + 1), nameCN: cleanName || '（未填）', nameEN: '', keywords: [] }),
          positionName: pos || `位置 ${i + 1}`,
        };
      });
      setLenormandDrawnCards(results);
      setView('result');
      const newId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      setCurrentHistoryId(newId);
      setHistory(prev => [{ id: newId, date: Date.now(), question: question || '', spread: selectedSpread, cards: [], lenormandCards: results, mode: 'lenormand' as const }, ...prev]);
    } else {
      const deck = mode === 'thoth' ? THOTH_ALL_CARDS : ALL_CARDS;
      const results: DrawnCard[] = selectedSpread.positions.map((pos, i) => {
        const input = manualInputs[i] ?? { name: '', reversed: false };
        const cleanName = input.name.trim();
        const matched = deck.find(c =>
          cleanName && (c.nameCN.includes(cleanName) || c.nameEN.toLowerCase().includes(cleanName.toLowerCase()))
        );
        return {
          ...(matched ?? { id: -(i + 1), nameCN: cleanName || '（未填）', nameEN: '', keywords: [] }),
          isReversed: mode === 'thoth' ? false : input.reversed,
          positionName: pos || `位置 ${i + 1}`,
        };
      });
      setDrawnCards(results);
      setView('result');
      const newId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      setCurrentHistoryId(newId);
      setHistory(prev => [{ id: newId, date: Date.now(), question: question || '', spread: selectedSpread, cards: results, mode }, ...prev]);
    }
  };

  const drawExtraCard = () => {
    if (!selectedSpread) return;
    if (extraQuestion.trim() === '') {
      showToast('請先輸入補抽想問的問題');
      return;
    }
    const availableCards = (mode === 'thoth' ? THOTH_ALL_CARDS : ALL_CARDS).filter(c => !drawnCards.some(dc => dc.id === c.id));
    if (availableCards.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const newCard = availableCards[randomIndex];
    const extraCard: DrawnCard = {
      ...newCard,
      isReversed: mode === 'thoth' ? false : Math.random() > 0.5,
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

  const copyToClipboard = (type: 'all' | 'main' | 'extra' = 'all', record?: DrawHistory) => {
    const targetSpread = record ? record.spread : selectedSpread;
    const targetQuestion = record ? record.question : question;
    const targetMode = record ? (record.mode || 'tarot') : mode;
    const targetCards = record ? record.cards : drawnCards;
    const targetLenormandCards = record ? (record.lenormandCards || []) : lenormandDrawnCards;

    if (!targetSpread) return;

    if (targetMode === 'lenormand') {
      const cards = targetLenormandCards;
      const cardList = cards.map((card, i) =>
        `  ${i + 1}. ${card.positionName}：${card.nameCN} (${card.nameEN})`
      ).join('\n');

      let prompt = `我想透過 Lenormand 卡牌占卜以下問題：\n\n【問題】${targetQuestion.trim() || '探索當下整體狀態'}\n\n【牌陣】${targetSpread.name}\n\n抽出的牌：\n${cardList}`;

      if (cards.length === 9) {
        const [c1, c2, c3, c4, c5, c6, c7, c8, c9] = cards;
        const f = (c: DrawnLenormandCard) => `${c.nameCN} (${c.nameEN})`;
        prompt += `

請從以下三個角度為我解讀這個牌陣：

（一）時間軸（直欄）
  - 過去（左欄）：${f(c1)}、${f(c4)}、${f(c7)}
  - 現在（中欄）：${f(c2)}、${f(c5)}、${f(c8)}
  - 未來（右欄）：${f(c3)}、${f(c6)}、${f(c9)}
  分別解讀每欄的時段主題。

（二）三層意識（橫列）
  - 意識層（上列）：${f(c1)}、${f(c2)}、${f(c3)}
  - 現實層（中列）：${f(c4)}、${f(c5)}、${f(c6)}
  - 潛意識層（下列）：${f(c7)}、${f(c8)}、${f(c9)}
  探索每一層次想揭示的訊息。

（三）十字法
  - 核心（位置 5）：${f(c5)}
  - 十字（位置 2、4、6、8）：${f(c2)}、${f(c4)}、${f(c6)}、${f(c8)}
  - 四角（位置 1、3、7、9）：${f(c1)}、${f(c3)}、${f(c7)}、${f(c9)}

最後，點出值得注意的卡牌組合，以及 9 張牌整體的意義。`;
      } else if (cards.length === 5) {
        const [c1, c2, c3, c4, c5] = cards;
        const f = (c: DrawnLenormandCard) => `${c.nameCN}${c.nameEN ? ` (${c.nameEN})` : ''}`;
        prompt += `\n\n請從以下層次解讀這五張牌：\n\n（一）左右流向（時間軸）\n  ${f(c1)} → ${f(c2)} → ${f(c3)} → ${f(c4)} → ${f(c5)}\n  從左到右說明事件發展脈絡或因果關係。\n\n（二）鄰牌配對解讀（注意方向性，A+B ≠ B+A）\n  - 牌1+牌2：${f(c1)} + ${f(c2)}\n  - 牌2+牌3：${f(c2)} + ${f(c3)}（過渡核心）\n  - 牌3+牌4：${f(c3)} + ${f(c4)}\n  - 牌4+牌5：${f(c4)} + ${f(c5)}\n  請依序解析每組配對的具體含義。\n\n（三）中心牌的軸心\n  中心牌 ${f(c3)} 是整個牌陣的核心，分析它如何影響左右兩側的走向。\n\n（四）整體訊息\n  綜合五張牌的脈絡，給出具體且直接的答案。`;
      } else if (cards.length === 3) {
        const [c1, c2, c3] = cards;
        const f = (c: DrawnLenormandCard) => `${c.nameCN}${c.nameEN ? ` (${c.nameEN})` : ''}`;
        prompt += `\n\n請從以下層次解讀這三張牌：\n\n（一）左右流向\n  ${f(c1)} → ${f(c2)} → ${f(c3)}\n\n（二）鄰牌配對解讀（注意方向性，A+B ≠ B+A）\n  - 左+中：${f(c1)} + ${f(c2)}的組合含義\n  - 中+右：${f(c2)} + ${f(c3)}的組合含義\n  請依序解析，並說明方向改變如何影響解讀。\n\n（三）整體訊息\n  三張牌合在一起描述的核心主題與答案。`;
      } else {
        prompt += `\n\n請為我解讀這張牌的含義。`;
      }

      navigator.clipboard.writeText(prompt).then(() => {
        if (record) {
          showToast('已複製 AI 解讀 Prompt！');
        } else {
          setShowCopySuccess('all');
          setTimeout(() => setShowCopySuccess(null), 2000);
        }
      });
      return;
    }
    
    const mainCards = targetCards.filter(c => !c.extraQuestion);
    const extraCards = targetCards.filter(c => c.extraQuestion);

    const mainText = mainCards.map((card, i) => `  ${i + 1}. ${card.positionName}：${card.nameCN} ${card.nameEN}（${card.isReversed ? '逆位' : '正位'}）`).join('\n');
    const extraText = extraCards.length > 0 
      ? `\n\n【補充指引（針對後續提問補抽）】\n${extraCards.map(card => `  Q: ${card.extraQuestion}\n  👉 ${card.nameCN} ${card.nameEN}（${card.isReversed ? '逆位' : '正位'}）`).join('\n\n')}`
      : '';

    let text = '';
    
    // Generate AI interpretation guide based on Tarot spread
    let analysisPrompt = '';
    if (targetSpread.isCustom) {
      analysisPrompt = `\n\n請依據我自訂牌陣中每個位置的定義，結合正逆位牌意，為我進行綜合解讀，並給出具體的建議。`;
    } else {
      switch (targetSpread.id) {
        // Thoth Spreads
        case 'celtic':
          analysisPrompt = `\n\n請從以下角度為我深入解讀這個牌陣：\n（一）核心狀況：分析【現況】與【挑戰】的交鋒。\n（二）深層心理：對比【顯意識】與【潛意識】的拉扯。\n（三）時間流向：從【過去】看往【近未來】的演化趨勢。\n（四）內外解析：結合【自我認知】與【環境變數】的互動。\n（五）最終走向：綜觀【焦慮與渴望】，推演【最終演化】。`;
          break;
        case 'choice': {
          const numChoices = (mainCards.length - 1) / 2;
          const letters = Array.from({length: numChoices}, (_, i) => String.fromCharCode(65 + i));
          const pathDesc = letters.map(l => `選擇${l}（發展軌跡→結果）`).join('、');
          analysisPrompt = `\n\n請從以下角度為我深入解讀這個 ${numChoices} 選項的決策牌陣：\n（一）底層邏輯：評估【決策當下的現況】揭示的核心變數與限制條件。\n（二）路徑推演：分別解讀 ${pathDesc} 的發展軌跡與機會成本差異。\n（三）決策指引：綜合 ${numChoices} 條路徑，給予具體且高維度的決策建議，並明確指出你認為最值得關注的選擇及原因。`;
          break;
        }
        case 'mirror': {
          const numPeople = Math.round(mainCards.length / 3);
          if (numPeople <= 2) {
            analysisPrompt = `\n\n請從以下角度為我深入解讀這段雙方關係的系統性結構：\n（一）認知落差：對比雙方視角——【對象眼中的主角】vs【主角眼中的對象】——點出彼此的投射與盲點。\n（二）自我定位：分析【主角眼中的自己】與【對象眼中的自己】各自揭示的深層狀態。\n（三）互動動力：深挖【互動產生的誤解】的根源，以及雙方之間的隱形拉力。\n（四）破冰策略：基於上述洞察，給出具體且成熟的互動建議。`;
          } else {
            const chars = Array.from({length: numPeople - 1}, (_, i) => String.fromCharCode(65 + i));
            const peopleList = chars.map(c => `對象${c}`).join('、');
            analysisPrompt = `\n\n請從以下角度為我深入解讀這個 ${numPeople} 人局的關係系統：\n（一）自我視角：分析【主角眼中的自己】揭示的核心自我認知。\n（二）多方關係：逐一解讀 ${peopleList} 各自的視角差異（他眼中的主角、主角眼中的他、他眼中的自己），找出最關鍵的感知落差。\n（三）系統盲點：分析【多方互動的盲點】與整體關係網絡的張力來源。\n（四）群體建議：基於全局視角，給出在 ${numPeople} 人關係中找到平衡的具體建議。`;
          }
          break;
        }
        case 'johari':
          analysisPrompt = `\n\n請依據周哈里窗模型為我深入解讀，特別點出【盲目區】與【隱藏區】揭示的認知盲點，並說明如何探索【未知區】的潛能以達成自我整合。`;
          break;
        case 'breakthrough':
          analysisPrompt = `\n\n請為我深入解讀目前的僵局，殘酷地指出我的【錯誤的發力點】，並告訴我如何利用【隱藏的槓桿】作為【關鍵行動】來突破【核心限制】。`;
          break;
        case 'cycle':
          analysisPrompt = `\n\n請為我深入解讀這段生命週期的能量代謝，明確指出什麼是【正在消亡的】與【必須放下的】，並指導我如何將【必須帶走的】資產投入到【正在萌芽的】事物中。`;
          break;
        case 'pattern':
          analysisPrompt = `\n\n請為我進行深度的心理模式解構，分析【觸發機制】與【表層防禦】背後的【核心恐懼】，點出我留在【舒適圈的代價】，並給出【阻斷慣性的行動】建議。`;
          break;
        case 'iceberg':
          analysisPrompt = `\n\n請依據薩提爾冰山理論為我深入解讀，穿透【表層行為】與【理性認知】，看見底下的【真實情緒】與【核心價值觀】，分析我的【防衛機制】，並給出【整合策略】。`;
          break;
        case 'resource':
          analysisPrompt = `\n\n請為我進行全盤的局勢審計。分析【內部可用資源】與【隱藏的推力】如何對抗【外部不可控變數】與【系統性阻力】，並評估這是否能帶領我達成【當前北極星目標】與【下階段里程碑】。`;
          break;
        case 'hero':
          analysisPrompt = `\n\n請將這段經歷視作一場「英雄之旅」，為我解讀目前所在的階段。分析我面臨的【冒險的召喚】與【最深的試煉】，以及我將如何透過【關鍵的導師與工具】獲得啟示，最終【帶著恩賜歸來】。`;
          break;
          
        // Waite Spreads
        case 'waite-triangle':
          analysisPrompt = `\n\n請為我解讀這三張牌如何分別反映出我目前【身體的感受】、【心智的邏輯】與【靈魂的渴望】。幫助我釐清這三個維度是否有衝突，並給我整合身心靈的建議。`;
          break;
        case 'waite-clarity':
          analysisPrompt = `\n\n請幫我穿透迷霧，對比【我以為的問題】與【真正的核心問題】，點出我正在【逃避的恐懼】，並解析【宇宙給予的建議】來幫助我破局。`;
          break;
        case 'waite-healing':
          analysisPrompt = `\n\n請引導我進行情緒釋放。分析【當前糾結的情緒結】背後【未被滿足的需求】，指出我目前【錯誤的索求或防禦方式】，並給予【正確的情緒釋放管道】的具體建議。`;
          break;
        case 'waite-focus':
          analysisPrompt = `\n\n請為我校準焦點。指出我【浪費能量的地方】與【真正該專注的核心】，揭示【隱藏的內在動力】與【即將面臨的考驗】，並給予【最高指引】。`;
          break;
        case 'waite-shadow':
          analysisPrompt = `\n\n請帶領我進行陰影整合。探索【我極力隱藏的特質】與它帶給我的【保護機制】。分析這份陰影【造成的破壞】，並指導我【如何溫柔地接納它】，以獲得【整合後的完整力量】。`;
          break;
        case 'waite-connection':
          analysisPrompt = `\n\n請為這段關係提供滋養的指引。分析【我在關係中的匱乏】與【對方的真實狀態】，透視【當下的能量流動】與【共同的學習課題】，最後給予【如何給予彼此對等滋養】的建議。`;
          break;
        case 'waite-crossroad':
          analysisPrompt = `\n\n請為站在十字路口的我提供指引。盤點【過去未解的遺憾】與【當下的籌碼】，對齊【內心的真實渴望】。推演【未來的可能性】與【隱藏的危機】，並指出【邁出下一步的關鍵行動】。`;
          break;
        case 'waite-year':
          analysisPrompt = `\n\n請為我進行深度的階段總結。分析本階段的【核心主題】與【已學會的靈性教訓】。盤點【尚未跨越的世俗障礙】、【物質事業發展】與【情感內在進化】。最後點出【宇宙的潛在資源】與即將【收穫的果實】。`;
          break;
        default:
          analysisPrompt = `\n\n請依據牌陣中每個位置的定義，結合正逆位牌意，為我進行綜合解讀，並點出值得注意的牌組互動與最終建議。`;
          break;
      }
    }

    const modeName = targetMode === 'thoth' ? '托特' : '偉特';
    if (type === 'all') {
      text = `我想透過${modeName}塔羅牌占卜以下問題：\n\n【問題】${targetQuestion.trim() || '探索當下整體狀態'}\n\n【牌陣】${targetSpread.name}\n\n抽出的牌：\n${mainText}${extraText}${analysisPrompt}`;
    } else if (type === 'main') {
      text = `我想透過${modeName}塔羅牌占卜以下問題：\n\n【問題】${targetQuestion.trim() || '探索當下整體狀態'}\n\n【牌陣】${targetSpread.name}（主牌陣）\n\n抽出的牌：\n${mainText}${analysisPrompt}`;
    } else if (type === 'extra') {
      text = `我想針對剛剛的${modeName}塔羅牌占卜結果，進行進一步的提問。請為我解讀以下補抽的牌卡：\n\n【原問題】${targetQuestion.trim() || '探索當下整體狀態'}\n\n【衍生自牌陣】${targetSpread.name}\n\n${extraText.replace('【補充指引（針對後續提問補抽）】\n', '')}\n\n請為我解讀這幾張補抽牌的具體含義，以及它們如何回應我的提問。`;
    }

    navigator.clipboard.writeText(text).then(() => {
      if (record) {
        showToast('已複製 AI 解讀 Prompt！');
      } else {
        setShowCopySuccess(type);
        setTimeout(() => setShowCopySuccess(null), 2000);
      }
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
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <TarotLogoSVG />
          <h1 className="hidden sm:block text-xl sm:text-2xl font-extrabold tracking-tight gold-text drop-shadow-sm">Tarot Draw</h1>
        </div>
        {/* Mode Toggle */}
        <div className="flex items-center bg-stone-100/80 dark:bg-mystic-900/80 rounded-xl p-1 border border-stone-200 dark:border-mystic-800">
          <button
            onClick={() => { setMode('tarot'); setView('home'); setSelectedSpread(null); }}
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              mode === 'tarot'
                ? 'bg-amber-600 dark:bg-mystic-600 text-white shadow-sm'
                : 'text-stone-500 dark:text-mystic-400 hover:text-stone-700 dark:hover:text-mystic-200'
            }`}
          >
            🔮<span className="text-[10px] sm:text-xs"> 偉特</span>
          </button>
          <button
            onClick={() => { setMode('thoth'); setView('home'); setSelectedSpread(null); }}
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              mode === 'thoth'
                ? 'bg-purple-600 dark:bg-purple-700 text-white shadow-sm'
                : 'text-stone-500 dark:text-mystic-400 hover:text-stone-700 dark:hover:text-mystic-200'
            }`}
          >
            🌌<span className="text-[10px] sm:text-xs"> 托特</span>
          </button>
          <button
            onClick={() => { setMode('lenormand'); setView('home'); setSelectedSpread(null); }}
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              mode === 'lenormand'
                ? 'bg-emerald-600 dark:bg-emerald-700 text-white shadow-sm'
                : 'text-stone-500 dark:text-mystic-400 hover:text-stone-700 dark:hover:text-mystic-200'
            }`}
          >
            🃏<span className="text-[10px] sm:text-xs"> 雷諾曼</span>
          </button>
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
              {/* How-to flow */}
              <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex items-center justify-start sm:justify-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-mystic-500 min-w-max mx-auto px-1">
                  {[
                    { n: '1', label: '選系統' },
                    { n: '2', label: '選牌陣' },
                    { n: '3', label: '輸入問題' },
                    { n: '4', label: '抽牌' },
                    { n: '5', label: '複製給 AI 解讀' },
                  ].map(({ n, label }, i, arr) => (
                    <React.Fragment key={n}>
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-mystic-800 text-amber-700 dark:text-mystic-400 flex items-center justify-center text-[9px] font-bold shrink-0">{n}</span>
                        {label}
                      </span>
                      {i < arr.length - 1 && <span className="text-slate-300 dark:text-mystic-700">›</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Lenormand Home */}
              {mode === 'lenormand' && (
                <section>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🃏</span>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">雷諾曼牌陣</h2>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-mystic-400 mb-6">共 36 張牌・無正逆位・著重具體事件與組合連讀</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mx-auto">
                    {LENORMAND_SPREADS.map((spread) => (
                      <SpreadCard
                        key={spread.id}
                        spread={spread}
                        onClick={() => {
                          setSelectedSpread(spread);
                          setLenormandDrawnCards([]);
                          setView('draw');
                          setQuestion('');
                        }}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Built-in Spreads — categorized */}
              <section className="space-y-8">
                <div className="flex items-center gap-3 mb-1">
                  <Wand2 className="text-stone-600 dark:text-mystic-500" size={24} />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">內建牌陣</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-mystic-400 mb-6">
                  {mode === 'lenormand' ? '共 36 張・無正逆位・雷諾曼體系' : mode === 'thoth' ? '共 78 張・無逆位・克勞利體系' : '共 78 張・支援正逆位・萊德偉特體系'}
                </p>

                {(() => {
                  const allSpreads = [...THOTH_SPREADS, ...WAITE_SPREADS.filter(s => !THOTH_SPREADS.some(t => t.id === s.id))];
                  const cats = [
                    { label: '🌟 經典牌陣', ids: ['single', 'waite-triangle', 'celtic'] },
                    { label: '💡 洞察探索', ids: ['johari', 'cycle', 'pattern', 'iceberg', 'mirror'] },
                    { label: '🧭 決策與資源', ids: ['breakthrough', 'choice', 'resource', 'hero'] },
                  ];
                  return cats.map(({ label, ids }) => {
                    const spreads = allSpreads.filter(s => ids.includes(s.id));
                    if (!spreads.length) return null;
                    return (
                      <div key={label}>
                        <p className="text-xs font-bold text-amber-700 dark:text-mystic-400 uppercase tracking-widest mb-3">{label}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                          {spreads.map(spread => (
                            <SpreadCard
                              key={spread.id}
                              spread={spread}
                              onClick={() => {
                                setSelectedSpread(spread);
                                if (spread.id === 'choice') setChoiceCount(2);
                                if (spread.id === 'mirror') setPeopleCount(2);
                                setView('draw');
                                setQuestion('');
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </section>


              {/* Custom Spreads (Tarot & Thoth) */}
              {(mode === 'tarot' || mode === 'thoth') && (
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mx-auto">
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
              )}

              {/* Donation + Legal footer */}
              <div className="mt-8 pt-6 border-t border-stone-200/60 dark:border-mystic-800/40 flex flex-col items-center gap-3">
                {/* TODO: 打賞功能暫時停用，之後換上 Buy Me a Coffee 連結再取消注釋
                <a
                  href="https://www.buymeacoffee.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 dark:text-mystic-600 hover:text-amber-600 dark:hover:text-mystic-400 transition-colors"
                >
                  ☕ 請我喝杯咖啡
                </a>
                */}
                <p className="text-[11px] leading-relaxed text-slate-400 dark:text-mystic-600 max-w-2xl mx-auto text-center">
                  本網站提供之塔羅牌陣與解讀內容僅供娛樂與自我探索參考，不構成任何醫療、心理、法律或財務建議。請勿依據占卜結果做出重大決定。
                </p>
              </div>
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
                    {question.trim().length > 0 && question.trim().length < 10 && (
                      <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <span className="text-base">💡</span>
                        問題越具體，AI 解讀越準確——試著加上時間、情境或對象
                      </p>
                    )}
                  </div>

                  {/* Draw Mode Toggle */}
                  <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-mystic-700 p-0.5 gap-0.5 bg-slate-100/70 dark:bg-mystic-800/50">
                    <button
                      onClick={() => setDrawInputMode('random')}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                        drawInputMode === 'random'
                          ? 'bg-white dark:bg-mystic-700 text-stone-800 dark:text-white shadow'
                          : 'text-slate-400 dark:text-mystic-500'
                      }`}
                    >
                      🎴 隨機抽牌
                    </button>
                    <button
                      onClick={() => setDrawInputMode('manual')}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                        drawInputMode === 'manual'
                          ? 'bg-white dark:bg-mystic-700 text-stone-800 dark:text-white shadow'
                          : 'text-slate-400 dark:text-mystic-500'
                      }`}
                    >
                      ✍️ 手動輸入
                    </button>
                  </div>

                  {drawInputMode === 'random' ? (
                    <>
                      <button
                        onClick={handleDraw}
                        className="w-full py-4 bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 dark:hover:from-mystic-500 dark:hover:to-mystic-400 text-stone-50 dark:text-white rounded-xl font-bold text-lg shadow-lg shadow-stone-800/20 dark:shadow-mystic-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Compass size={20} /> 開始抽牌
                      </button>
                      <p className="text-center text-[11px] text-slate-400 dark:text-mystic-600">
                        ✨ 抽牌後可一鍵複製 AI 解讀 Prompt，貼入 ChatGPT・Claude・Gemini 獲得深度解讀
                      </p>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-400 dark:text-mystic-500 text-center">
                        輸入你實體抽到的牌名{mode === 'tarot' ? '，按「逆」切換逆位' : ''}
                      </p>
                      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                        {selectedSpread.positions.map((pos, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="mt-2.5 text-xs font-bold text-amber-600 dark:text-mystic-400 w-5 flex-shrink-0 text-right">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-slate-400 dark:text-mystic-600 mb-0.5 truncate">{pos}</p>
                              <input
                                type="text"
                                value={manualInputs[i]?.name || ''}
                                onChange={e => setManualInputs(prev => {
                                  const next = [...prev];
                                  next[i] = { ...(next[i] || { name: '', reversed: false }), name: e.target.value };
                                  return next;
                                })}
                                placeholder="牌名..."
                                className="w-full px-2.5 py-1.5 rounded-lg border border-amber-200/70 dark:border-mystic-700 bg-white/80 dark:bg-mystic-950 text-sm outline-none focus:ring-1 focus:ring-amber-400 dark:focus:ring-mystic-500 transition-all"
                              />
                            </div>
                            {mode === 'tarot' && (
                              <button
                                onClick={() => setManualInputs(prev => {
                                  const next = [...prev];
                                  next[i] = { ...(next[i] || { name: '', reversed: false }), reversed: !next[i]?.reversed };
                                  return next;
                                })}
                                className={`mt-5 flex-shrink-0 px-2 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                                  manualInputs[i]?.reversed
                                    ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                                    : 'bg-slate-100 dark:bg-mystic-800 text-slate-400 dark:text-mystic-500 border-slate-200 dark:border-mystic-700'
                                }`}
                              >
                                逆
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={handleManualSubmit}
                        className="w-full py-4 bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 dark:hover:from-mystic-500 dark:hover:to-mystic-400 text-stone-50 dark:text-white rounded-xl font-bold text-lg shadow-lg shadow-stone-800/20 dark:shadow-mystic-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={20} /> 確認輸入
                      </button>
                    </div>
                  )}

                  {selectedSpread.id === 'choice' && (
                    <div className="bg-indigo-50/50 dark:bg-mystic-800/30 p-4 rounded-xl border border-indigo-100 dark:border-mystic-700/50">
                      <label className="text-sm font-bold text-indigo-900 dark:text-mystic-200 block mb-3">
                        這題有幾個選項需要比較？（目前：{choiceCount} 個）
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <button
                            key={num}
                            onClick={() => setChoiceCount(num)}
                            className={`w-[42px] h-[42px] sm:w-11 sm:h-11 rounded-full font-bold text-sm sm:text-base flex items-center justify-center transition-all duration-300 ${
                              choiceCount === num 
                                ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-500/30 scale-105 ring-2 ring-indigo-300 dark:ring-indigo-700 ring-offset-1 dark:ring-offset-mystic-900' 
                                : 'bg-white/80 dark:bg-mystic-900 shadow-sm text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-mystic-600 hover:bg-indigo-100 dark:hover:bg-mystic-800'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-indigo-700/80 dark:text-mystic-400 mt-4 leading-relaxed">
                        直接點擊數字切換。每多一個選擇，系統就會對應多抽出「發展」與「結果」2 張牌喔。
                      </p>
                    </div>
                  )}

                  {selectedSpread.id === 'mirror' && (
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                      <label className="text-sm font-bold text-emerald-900 dark:text-emerald-300 block mb-3">
                        這段關係牽涉多少人？（包含你，目前：{peopleCount} 人）
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[2, 3, 4, 5, 6].map(num => (
                          <button
                            key={num}
                            onClick={() => setPeopleCount(num)}
                            className={`w-[42px] h-[42px] sm:w-11 sm:h-11 rounded-full font-bold text-sm sm:text-base flex items-center justify-center transition-all duration-300 ${
                              peopleCount === num 
                                ? 'bg-emerald-600 dark:bg-emerald-600 text-white shadow-md shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300 dark:ring-emerald-700 ring-offset-1 dark:ring-offset-mystic-900' 
                                : 'bg-white/80 dark:bg-mystic-900 shadow-sm text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-mystic-600 hover:bg-emerald-100 dark:hover:bg-mystic-800'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-emerald-700/80 dark:text-emerald-400 mt-4 leading-relaxed">
                        最高支援 6 人局。系統將為每一位「對象」配置專屬的心態牌，協助你跳脫框架看清全局。
                      </p>
                    </div>
                  )}

                  <div className="bg-amber-50 dark:bg-mystic-800/50 p-4 sm:px-5 rounded-2xl border border-amber-100/80 dark:border-mystic-700 flex items-start gap-3">
                    <Info className="text-amber-500/80 dark:text-mystic-400 mt-0.5 flex-shrink-0" size={18} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-amber-900 dark:text-mystic-100 mb-2 tracking-wide">牌陣資訊</p>
                      <p className="text-xs text-amber-700/70 dark:text-mystic-500 mb-2">將抽取 {selectedSpread.count} 張牌，位置如下：</p>
                      {/* Scrollable pill row with fade mask */}
                      <div className="relative">
                        <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          {selectedSpread.positions.map((pos, i) => (
                            <span
                              key={i}
                              className="shrink-0 text-[11px] font-semibold text-amber-800 dark:text-mystic-300 bg-amber-100/80 dark:bg-mystic-700/60 border border-amber-200 dark:border-mystic-600 px-2.5 py-1 rounded-full whitespace-nowrap"
                            >
                              <span className="text-amber-500 dark:text-mystic-500 mr-1">{i + 1}.</span>{pos}
                            </span>
                          ))}
                        </div>
                        {/* Right fade-out hint */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-amber-50/95 dark:from-[#1e1a36]/95 to-transparent" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50/60 dark:bg-indigo-950/30 p-4 sm:px-5 rounded-2xl border border-indigo-100/60 dark:border-indigo-900/30 flex items-start gap-3">
                    <Lightbulb className="text-indigo-400 dark:text-indigo-400 mt-0.5 flex-shrink-0" size={18} />
                    <div>
                      <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1.5 tracking-wide">塔羅小知識</p>
                      <p className="text-sm text-indigo-800/80 dark:text-indigo-200/70 leading-relaxed italic">
                        {currentTrivia}
                      </p>
                    </div>
                  </div>
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
                  {mode === 'lenormand' && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 mb-1 inline-block">雷諾曼</span>}
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-mystic-700 to-indigo-500 bg-clip-text text-transparent dark:from-mystic-200 dark:to-indigo-300 drop-shadow-sm">{selectedSpread.name}</h2>
                  <p className="text-slate-500 dark:text-mystic-400">問題：{question.trim() || '探索當下整體狀態'}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setView('draw');
                      setCurrentHistoryId(null);
                      setDrawnCards([]);
                      setLenormandDrawnCards([]);
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-mystic-800 hover:bg-slate-50 dark:hover:bg-mystic-900 transition-colors text-sm font-medium"
                  >
                    重新抽牌
                  </button>
                </div>
              </div>

              {/* Lenormand Result Layout */}
              {mode === 'lenormand' && lenormandDrawnCards.length > 0 && (
                <div className="relative bg-white/40 dark:bg-mystic-950 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl shadow-emerald-900/5 dark:shadow-mystic-900/50 border-4 border-emerald-100/50 dark:border-emerald-900/20 overflow-hidden backdrop-blur-sm">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-50/30 via-white/20 to-teal-50/20 dark:from-emerald-950/30 dark:via-mystic-900/80 dark:to-mystic-950 pointer-events-none" />
                  {lenormandDrawnCards.length === 1 && (
                    <div className="relative z-10 flex flex-col items-center gap-6 mb-8 w-full max-w-lg mx-auto">
                      {(() => {
                        const card = lenormandDrawnCards[0];
                        const oracle = ORACLE_DATA.lenormand[card.id];
                        if (!oracle) return null;
                        
                        let answer = '不確定 (Maybe)';
                        let theme = 'text-amber-600 dark:text-amber-400';
                        let bg = 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';

                        if (oracle.score === 2) {
                          answer = '是 (Yes)';
                          theme = 'text-green-600 dark:text-green-400';
                          bg = 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
                        } else if (oracle.score === 1) {
                          answer = '偏向是 (Maybe Yes)';
                          theme = 'text-green-600/80 dark:text-green-400/80';
                          bg = 'bg-green-50/50 dark:bg-green-900/20 border-green-100 dark:border-green-800/50';
                        } else if (oracle.score === -1) {
                          answer = '偏向否 (Maybe No)';
                          theme = 'text-red-500/80 dark:text-red-400/80';
                          bg = 'bg-red-50/50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50';
                        } else if (oracle.score === -2) {
                          answer = '否 (No)';
                          theme = 'text-red-600 dark:text-red-400';
                          bg = 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
                        }

                        return (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`w-full px-6 py-4 rounded-[2rem] border-2 ${bg} shadow-lg flex flex-col items-center gap-2 transition-all backdrop-blur-sm`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] sm:text-xs font-black ${theme} opacity-70 uppercase tracking-[0.2em]`}>神諭指引</span>
                              <span className={`text-xl sm:text-2xl font-black ${theme} tracking-tight`}>{answer}</span>
                            </div>
                            <p className={`text-xs sm:text-sm font-bold ${theme} opacity-90`}>{oracle.message}</p>
                          </motion.div>
                        );
                      })()}
                    </div>
                  )}
                  {(lenormandDrawnCards.length === 3 || lenormandDrawnCards.length === 5) ? (
                    <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-center gap-1 sm:gap-2 w-full max-w-3xl mx-auto overflow-x-auto py-2">
                      {lenormandDrawnCards.map((card, index) => (
                        <React.Fragment key={index}>
                          <LenormandCardDisplay card={card} index={index} isCenter={false} />
                          {index < lenormandDrawnCards.length - 1 && (
                            <span className="flex-shrink-0 text-emerald-400 dark:text-emerald-500 text-xl sm:text-2xl font-bold leading-none select-none">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div className={`relative z-10 grid gap-3 sm:gap-5 justify-center w-full max-w-3xl mx-auto ${
                      lenormandDrawnCards.length === 9 ? 'grid-cols-3' :
                      lenormandDrawnCards.length === 1 ? 'grid-cols-1' :
                      lenormandDrawnCards.length === 4 ? 'grid-cols-2' :
                      lenormandDrawnCards.length === 6 ? 'grid-cols-3' :
                      lenormandDrawnCards.length === 7 ? 'grid-cols-4' :
                      lenormandDrawnCards.length === 10 ? 'grid-cols-3 sm:grid-cols-5' :
                      'grid-cols-3 sm:grid-cols-4'
                    }`}>
                      {lenormandDrawnCards.map((card, index) => (
                        <LenormandCardDisplay key={index} card={card} index={index} isCenter={lenormandDrawnCards.length === 9 && index === 4} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tarot Tablecloth Layout */}
              {(mode === 'tarot' || mode === 'thoth') && (
              <div className="relative bg-white/40 dark:bg-mystic-950 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl shadow-amber-900/5 dark:shadow-mystic-900/50 border-4 border-amber-100/50 dark:border-mystic-800/30 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-50/40 via-white/40 to-amber-100/30 dark:from-mystic-800/20 dark:via-mystic-900/80 dark:to-mystic-950 pointer-events-none"></div>
                
                <div className="relative z-10 w-full max-w-6xl mx-auto">
                  <TarotSpreadLayout spread={selectedSpread} cards={drawnCards.filter(c => !c.extraQuestion)} mode={mode === 'thoth' ? 'thoth' : 'tarot'} />
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
              )}

              <div className="bg-white/80 dark:bg-mystic-900 p-6 rounded-2xl border border-amber-100 dark:border-mystic-800 text-center shadow-sm">
                <p className="text-amber-800 dark:text-mystic-300 italic font-medium">
                  {mode === 'lenormand'
                    ? '「雷諾曼牌訴說的是日常的故事，而你才是故事的主角。」'
                    : '「牌卡只是指引，真正的答案在你的內心。」'}
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
                      <Copy size={18} /> 複製 AI 解讀 Prompt
                    </button>
                  )}
                </div>

                {/* AI Quick-open shortcuts */}
                {showCopySuccess && (
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <span className="text-xs text-slate-500 dark:text-mystic-500 font-medium">貼入 AI 開始解讀 →</span>
                    <a
                      href="https://chat.openai.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10a37f]/10 hover:bg-[#10a37f]/20 text-[#10a37f] dark:text-emerald-400 border border-[#10a37f]/30 text-xs font-bold transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                      <span>🤖</span> ChatGPT
                    </a>
                    <a
                      href="https://claude.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-400/30 text-xs font-bold transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                      <span>🧠</span> Claude
                    </a>
                    <a
                      href="https://gemini.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-400/30 text-xs font-bold transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                      <span>✨</span> Gemini
                    </a>
                  </div>
                )}
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
                          if (record.mode === 'lenormand' && record.lenormandCards) {
                            setMode('lenormand');
                            setLenormandDrawnCards(record.lenormandCards);
                            setDrawnCards([]);
                          } else {
                            setMode('tarot');
                            setDrawnCards(record.cards);
                            setLenormandDrawnCards([]);
                          }
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
                          {record.question?.trim() || '探索當下整體狀態'}
                        </p>
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-mystic-400">
                          {record.mode === 'lenormand' && <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">雷諾曼</span>}
                          {record.mode === 'thoth' && <span className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">托特</span>}
                          {record.mode === 'tarot' && <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">偉特</span>}
                          <span>{(record.lenormandCards?.length ?? record.cards.length)} 張牌卡</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 pt-0">
                        <button 
                          onClick={() => {
                            setSelectedSpread(record.spread);
                            setQuestion(record.question);
                            if (record.mode === 'lenormand' && record.lenormandCards) {
                              setMode('lenormand');
                              setLenormandDrawnCards(record.lenormandCards);
                              setDrawnCards([]);
                            } else {
                              setMode(record.mode === 'thoth' ? 'thoth' : 'tarot');
                              setDrawnCards(record.cards);
                              setLenormandDrawnCards([]);
                            }
                            setCurrentHistoryId(record.id);
                            setIsHistoryOpen(false);
                            setView('result');
                          }}
                          className="flex-[3] py-3.5 bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 dark:hover:from-mystic-500 dark:hover:to-mystic-400 text-stone-50 dark:text-white rounded-xl shadow-lg shadow-stone-800/10 dark:shadow-mystic-500/20 transition-all active:scale-95 text-[15px] font-bold flex items-center justify-center gap-2"
                        >
                          👁️ 查看
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard('all', record);
                          }}
                          className="flex-[3] py-3.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all rounded-xl active:scale-95 text-[15px] font-bold flex items-center justify-center gap-2"
                          title="直接複製完整 AI 解讀 Prompt"
                        >
                          <Copy size={18} />
                          <span>複製解讀</span>
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
                    type="range" min="1" max="20"
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

      {/* Global Footer */}
      <footer className="text-center py-4 border-t border-stone-100/60 dark:border-mystic-900/60 bg-white/30 dark:bg-mystic-950/30 backdrop-blur-sm">
        <a
          href="https://forms.gle/oXj1gXmqR83f3cfP8"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 dark:text-mystic-600 hover:text-amber-600 dark:hover:text-mystic-400 transition-colors"
        >
          有想反饋的嗎？點這裡 →
        </a>
      </footer>
    </div>

  );
}

function SpreadCard({ spread, isCustom, onClick, onEdit, onDelete }: { 
  spread: Spread; 
  isCustom?: boolean; 
  onClick: () => void;
  onEdit?: (e: MouseEvent) => void;
  onDelete?: (e: MouseEvent) => void;
}) {
  return (
    <div 
      onClick={onClick}
      className="relative bg-white/70 dark:bg-mystic-900/60 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-amber-100 dark:border-mystic-800 hover:border-amber-300 dark:hover:border-mystic-600 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col min-h-[160px] sm:h-[220px] overflow-hidden"
    >
      <div className="flex justify-between items-start mb-2 sm:mb-4 relative z-10 gap-2">
        <h3 className="text-base sm:text-xl font-bold text-amber-900 dark:text-mystic-100 group-hover:text-amber-600 dark:group-hover:text-indigo-400 transition-colors drop-shadow-sm leading-tight line-clamp-2">
          {spread.name}
        </h3>
        <span className="shrink-0 px-2 sm:px-3 py-1 bg-amber-50 dark:bg-mystic-800 text-amber-700 dark:text-mystic-400 text-[10px] sm:text-xs font-bold rounded-full border border-amber-200 dark:border-mystic-700 shadow-sm whitespace-nowrap">
          {spread.count} 張牌
        </span>
      </div>
      
      {/* Hint (Theory/Description) */}
      <p className="text-xs sm:text-sm text-slate-600 dark:text-mystic-300 line-clamp-2 mb-4 sm:mb-6 relative z-10 font-medium leading-relaxed">
        {spread.hint || `自訂牌陣 · ${spread.count} 張`}
      </p>
      
      {/* Positions Area (Horizontal Scroll) */}
      <div className="mt-auto relative z-10 w-full overflow-hidden rounded-lg bg-stone-50/50 dark:bg-mystic-950/30 p-2 sm:p-3 border border-stone-100 dark:border-mystic-800/50 shadow-inner">
        <div className="relative">
          {/* Right fade-out gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-stone-50 dark:from-mystic-900 via-stone-50/80 dark:via-mystic-900/80 to-transparent pointer-events-none z-10 rounded-r-lg" />
          
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pr-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {spread.positions.map((pos, idx) => (
              <div key={idx} className="flex items-center gap-2.5 shrink-0">
                <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white dark:bg-mystic-900/80 rounded-md text-slate-700 dark:text-mystic-200 text-xs sm:text-sm font-semibold whitespace-nowrap shadow-sm border border-stone-200 dark:border-mystic-700">
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-mystic-800 text-amber-700 dark:text-mystic-400 flex items-center justify-center text-[10px] sm:text-xs">
                    {idx + 1}
                  </span>
                  {pos}
                </div>
                {idx < spread.positions.length - 1 && (
                  <span className="text-stone-300 dark:text-mystic-600 text-sm">➔</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isCustom && (
        <div className="mt-4 pt-4 border-t border-amber-100 dark:border-mystic-800 flex justify-end gap-2 transition-opacity relative z-10">
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

function TarotSpreadLayout({ spread, cards, mode }: { spread: Spread; cards: DrawnCard[]; mode: 'tarot' | 'thoth' }) {
  const renderCard = (index: number) => {
    if (index >= cards.length) return null;
    return <TarotCardDisplay key={index} card={cards[index]} index={index} />;
  };

  switch (spread.id) {
    case 'single': {
      const card = cards[0];
      if (!card) return null;
      
      const oracle = ORACLE_DATA[mode][card.id];
      if (!oracle) return null;
      
      let answer = '不確定 (Maybe)';
      let theme = 'text-amber-600 dark:text-amber-400';
      let bg = 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
      let score = oracle.score;

      if (score === 2) {
        answer = '是 (Yes)';
        theme = 'text-green-600 dark:text-green-400';
        bg = 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      } else if (score === 1) {
        answer = '偏向是 (Maybe Yes)';
        theme = 'text-green-600/80 dark:text-green-400/80';
        bg = 'bg-green-50/50 dark:bg-green-900/20 border-green-100 dark:border-green-800/50';
      } else if (score === -1) {
        answer = '偏向否 (Maybe No)';
        theme = 'text-red-500/80 dark:text-red-400/80';
        bg = 'bg-red-50/50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50';
      } else if (score === -2) {
        answer = '否 (No)';
        theme = 'text-red-600 dark:text-red-400';
        bg = 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      }

      if (card.isReversed) {
        if (score > 0) {
          answer = '偏向是 - 可能有變數 (Maybe Yes)';
          theme = 'text-amber-600 dark:text-amber-400';
          bg = 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
        } else if (score < 0) {
          answer = '偏向否 - 可能有轉機 (Unlikely)';
          theme = 'text-amber-600 dark:text-amber-400';
          bg = 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
        }
      }

      return (
        <div className="flex flex-col items-center gap-8 w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`px-8 py-5 rounded-[2.5rem] border-2 ${bg} shadow-xl flex flex-col items-center gap-2 transition-all backdrop-blur-md`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-[10px] sm:text-xs font-black ${theme} opacity-70 uppercase tracking-[0.2em]`}>神諭指引</span>
              <span className={`text-xl sm:text-2xl font-black ${theme} tracking-tight`}>{answer}</span>
            </div>
            <p className={`text-xs sm:text-sm font-bold ${theme} opacity-90 text-center`}>{oracle.message}</p>
          </motion.div>
          {renderCard(0)}
        </div>
      );
    }
    
    case 'johari':
    case 'cycle':
    case 'waite-clarity':
    case 'waite-healing':
      return (
        <div className="grid grid-cols-2 gap-8 sm:gap-12 place-items-center w-full max-w-2xl mx-auto">
          {renderCard(0)} {renderCard(1)}
          {renderCard(2)} {renderCard(3)}
        </div>
      );
      
    case 'breakthrough':
      return (
        <div className="grid grid-cols-3 gap-6 sm:gap-10 place-items-center w-full max-w-3xl mx-auto">
          <div className="col-start-2">{renderCard(0)}</div>
          <div className="col-start-1 row-start-2">{renderCard(1)}</div>
          <div className="col-start-3 row-start-2">{renderCard(2)}</div>
          <div className="col-start-2 row-start-3">{renderCard(3)}</div>
        </div>
      );

    case 'choice': {
      const numChoices = Math.round((cards.length - 1) / 2);
      const letters = Array.from({ length: numChoices }, (_, i) => String.fromCharCode(65 + i));
      const colClass =
        numChoices <= 2 ? 'grid-cols-2' :
        numChoices === 3 ? 'grid-cols-3' :
        numChoices === 4 ? 'grid-cols-4' :
        'grid-cols-5';
      return (
        <div className="flex flex-col items-center gap-8 w-full">
          <div className={`grid ${colClass} gap-x-4 sm:gap-x-6 gap-y-8 place-items-center w-full max-w-5xl mx-auto`}>
            {/* Column labels */}
            {letters.map(l => (
              <div key={l} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 whitespace-nowrap">
                選擇{l}
              </div>
            ))}
            {/* Results row (index 2, 4, 6, 8...) */}
            {Array.from({ length: numChoices }, (_, i) => (
              <div key={`res-${i}`}>{renderCard(2 + i * 2)}</div>
            ))}
            {/* Development row (index 1, 3, 5, 7...) */}
            {Array.from({ length: numChoices }, (_, i) => (
              <div key={`dev-${i}`}>{renderCard(1 + i * 2)}</div>
            ))}
          </div>
          {/* Current situation — always card 0 */}
          <div>{renderCard(0)}</div>
        </div>
      );
    }
      
    case 'pattern':
      return (
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 justify-center items-center flex-wrap max-w-4xl mx-auto w-full">
          {cards.map((_, i) => renderCard(i))}
        </div>
      );

    case 'iceberg':
      return (
        <div className="flex flex-col gap-6 items-center w-full max-w-3xl mx-auto">
          <div className="z-10">{renderCard(0)}</div>
          <div className="w-full h-px bg-cyan-200/50 dark:bg-cyan-900/50 my-2 relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-white/40 dark:bg-mystic-950 text-xs text-cyan-600 dark:text-cyan-500 font-bold tracking-widest">水面之下</span>
          </div>
          <div className="flex gap-8 justify-center z-0">{renderCard(1)}{renderCard(2)}</div>
          <div className="flex gap-8 justify-center z-0">{renderCard(3)}{renderCard(4)}</div>
          <div className="mt-4 z-0">{renderCard(5)}</div>
        </div>
      );

    case 'mirror':
      return (
        <div className="grid grid-cols-2 gap-x-8 sm:gap-x-24 gap-y-10 place-items-center max-w-2xl mx-auto w-full">
          {cards.map((_, i) => renderCard(i))}
        </div>
      );
      
    case 'resource':
      return (
        <div className="grid grid-cols-3 gap-6 sm:gap-10 place-items-center max-w-4xl mx-auto w-full">
          {renderCard(3)} {renderCard(0)} {renderCard(2)}
          {renderCard(1)} {renderCard(4)} {renderCard(5)}
        </div>
      );

    case 'hero':
      return (
        <div className="grid grid-cols-3 gap-x-6 sm:gap-x-12 gap-y-10 place-items-center max-w-4xl mx-auto w-full">
          <div>{renderCard(0)}</div> <div className="invisible"></div> <div>{renderCard(6)}</div>
          <div>{renderCard(1)}</div> <div className="invisible"></div> <div>{renderCard(5)}</div>
          <div>{renderCard(2)}</div> <div>{renderCard(3)}</div> <div>{renderCard(4)}</div>
        </div>
      );

    case 'celtic':
      return (
        <div className="flex flex-col xl:flex-row gap-12 sm:gap-16 items-center justify-center w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-4 sm:gap-8 place-items-center">
            <div className="col-start-2 col-span-2 row-start-1 flex justify-center w-full">{renderCard(2)}</div>
            <div className="col-start-1 row-start-2">{renderCard(4)}</div>
            <div className="col-start-2 row-start-2">{renderCard(0)}</div>
            <div className="col-start-3 row-start-2">{renderCard(1)}</div>
            <div className="col-start-4 row-start-2">{renderCard(5)}</div>
            <div className="col-start-2 col-span-2 row-start-3 flex justify-center w-full">{renderCard(3)}</div>
          </div>
          <div className="flex flex-col gap-6 sm:gap-8">
            {renderCard(9)}
            {renderCard(8)}
            {renderCard(7)}
            {renderCard(6)}
          </div>
        </div>
      );

    default:
      return (
        <div className={`grid gap-6 sm:gap-10 justify-center w-full mx-auto ${
          cards.length === 1 ? 'grid-cols-1' :
          cards.length === 2 ? 'grid-cols-2' :
          cards.length === 3 ? 'grid-cols-3' :
          cards.length === 4 ? 'grid-cols-2 sm:grid-cols-4' :
          cards.length === 5 ? 'grid-cols-3 sm:grid-cols-5' :
          cards.length === 6 ? 'grid-cols-3' :
          cards.length === 7 ? 'grid-cols-3 sm:grid-cols-4' :
          cards.length === 8 ? 'grid-cols-4' :
          cards.length === 10 ? 'grid-cols-3 sm:grid-cols-5' :
          cards.length === 12 ? 'grid-cols-4 sm:grid-cols-6' :
          'grid-cols-3 sm:grid-cols-4'
        }`}>
          {cards.map((_, i) => renderCard(i))}
        </div>
      );
  }
}

function TarotCardDisplay({ card, index, isExtra }: { card: DrawnCard; index: number; isExtra?: boolean; key?: string | number }) {
  const emoji = getCardEmoji(card.id);
  const isMajor = card.id < 22;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.08, 0.32), duration: 0.3 }}
      className="flex flex-col items-center gap-2 shrink-0 mx-auto"
    >
      {!isExtra && (
        <div className="relative w-[110px] sm:w-[130px]">
          <div className="overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-[10px] sm:text-xs font-bold text-amber-700 dark:text-mystic-400 uppercase tracking-wide text-center drop-shadow-sm pr-4">
            {index + 1}. {card.positionName}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white dark:from-mystic-950 to-transparent" />
        </div>
      )}
      
      <div className={`relative aspect-square w-[110px] sm:w-[130px] rounded-2xl overflow-hidden border-4 ${
        card.isReversed ? 'border-red-400/80 dark:border-red-500/50 shadow-red-500/20' : 
        isExtra ? 'border-amber-400/80 dark:border-mystic-500/50 shadow-amber-500/20 dark:shadow-mystic-500/20' : 
        'border-amber-300/80 dark:border-gold-500/50 shadow-amber-500/20 dark:shadow-gold-500/20'
      } shadow-lg`}>
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
            <div className={`font-extrabold text-sm sm:text-base mb-0.5 leading-tight ${
              isMajor ? 'text-amber-900 dark:text-amber-50 drop-shadow-sm' : 'text-slate-800 dark:text-mystic-100'
            }`}>{card.nameCN}</div>
            <div className={`text-[9px] sm:text-[10px] tracking-wide uppercase leading-tight max-w-full line-clamp-1 ${
              isMajor ? 'text-amber-600 font-bold dark:text-gold-400/80' : 'text-amber-700/60 dark:text-mystic-400 font-semibold'
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

      <div className="text-center w-[110px] sm:w-[130px]">
        <div className="font-bold text-sm text-slate-800 dark:text-mystic-100 truncate">{card.nameCN}</div>
        <div className={`text-xs font-bold ${card.isReversed ? 'text-red-500 dark:text-red-400' : 'text-amber-600 dark:text-mystic-400'}`}>
          {card.isReversed ? '逆位' : '正位'}
        </div>
      </div>
    </motion.div>
  );
}

function LenormandCardDisplay({ card, index, isCenter }: { card: DrawnLenormandCard; index: number; isCenter?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 200, damping: 18 }}
      className="flex flex-col items-center gap-2"
    >
      <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center leading-tight ${isCenter ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-mystic-400'}`}>
        {card.positionName}
      </div>

      <div className={`relative w-[90px] sm:w-[110px] aspect-[2/3] rounded-xl sm:rounded-2xl overflow-hidden border-2 shadow-lg transition-all duration-300 ${
        isCenter
          ? 'border-emerald-400 dark:border-emerald-500 shadow-emerald-400/30 scale-110 ring-2 ring-emerald-300/50 dark:ring-emerald-600/30'
          : 'border-teal-200/80 dark:border-teal-900/50 shadow-teal-600/10'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-teal-50/30 to-emerald-50/50 dark:from-slate-900 dark:via-teal-950/40 dark:to-emerald-950/30" />
        <div className="absolute top-1.5 left-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-black/40 px-1 py-0.5 rounded leading-none">
          {card.suit}
        </div>
        <div className="absolute top-1.5 right-1.5 text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-900/50 px-1 py-0.5 rounded leading-none">
          {card.id}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl sm:text-5xl drop-shadow-sm select-none" role="img" aria-label={card.nameEN}>
            {card.emoji}
          </span>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="text-center">
        <div className="font-bold text-sm sm:text-base text-slate-800 dark:text-mystic-100 leading-tight">{card.nameCN}</div>
        <div className="text-[10px] sm:text-xs text-slate-500 dark:text-mystic-400 leading-snug">{card.nameEN}</div>
        <div className="flex flex-wrap justify-center gap-1 mt-1">
          {card.keywords.map((kw, i) => (
            <span key={i} className="text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-full font-medium">
              {kw}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
