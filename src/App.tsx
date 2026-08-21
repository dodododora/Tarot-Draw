import React, { useState, useEffect, useLayoutEffect, useCallback, type MouseEvent, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { Moon, Sun, Plus, Trash2, Edit2, Copy, ArrowLeft, Sparkles, Wand2, Info, X, History, CheckCircle2, Compass, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_CARDS, THOTH_SPREADS, WAITE_SPREADS, WAITE_SPREAD_IDS, THOTH_SPREAD_IDS, getCardEmoji, getCardImagePath, TAROT_TRIVIA, LENORMAND_CARDS, LENORMAND_SPREADS, LENORMAND_TRIVIA, THOTH_ALL_CARDS, THOTH_TRIVIA, ORACLE_DATA, type Spread, type TarotCard, type LenormandCard } from './constants';
import { shuffleAndDraw } from './deckEngine';
import { downloadShareCard, type ShareCardCard } from './shareCard';
import { trackEvent } from './analytics';

export interface DrawHistory {
  id: string;
  date: number;
  question: string;
  spread: Spread;
  cards: DrawnCard[];
  lenormandCards?: DrawnLenormandCard[];
  mode?: 'waite' | 'lenormand' | 'thoth';
  bottomCard?: DrawnCard;
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
        ? 'radial-gradient(ellipse at 20% 30%, #4c1d9540 0%, transparent 60%), radial-gradient(ellipse at 85% 80%, #1e3a5f30 0%, transparent 50%), #0e0b16'
        : 'radial-gradient(ellipse at 50% 0%, #fde04720 0%, transparent 70%), #f7f3e8'
    }}
  >
    {/* Subtle star dots — dark only */}
    {theme === 'dark' && (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <g fill="#e0e7ff" opacity="0.15">
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




// Shuffle animation duration — change here to adjust the animation length
const SHUFFLE_ANIMATION_MS = 2300; // 2s animation + 0.3s hold at gathered pile state

/** Card back component — shows system-specific card back image */
const CardBack = ({ system, featured }: { system?: 'waite' | 'thoth' | 'lenormand'; featured?: boolean }) => {
  const backImage = system ? ({
    waite: '/cards/back_waite.webp',
    thoth: '/cards/back_thoth.webp',
    lenormand: '/cards/back_lenormand.webp',
  } as const)[system] : '/cards/back_waite.webp';

  return (
    <div
      className={`w-full h-full rounded-lg overflow-hidden${featured ? ' ring-2 ring-white/20' : ''}`}
      style={{
        backgroundImage: `url(${backImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
};

const SHUFFLE_ANIMATIONS = ['slide', 'arc', 'diagonal'] as const;
type ShuffleAnim = typeof SHUFFLE_ANIMATIONS[number];

/** Pure function — computes Framer Motion keyframes for one card.
 *  gatherX: pre-computed transform offset that moves card to visual center of container.
 *  Left cards cross RIGHT (+x), right cards cross LEFT (-x), center yields.
 */
function getCardAnimation(offset: number, animType: ShuffleAnim, gatherX: number) {
  const absOffset = Math.abs(offset);
  const side = offset < 0 ? -1 : offset > 0 ? 1 : 0;
  const crossX = side * -150 * absOffset;   // crosses the center line

  if (animType === 'slide') {
    if (offset === 0) return {
      x: [0, 0, 0, 0, gatherX], y: [0, 0, -50, -50, 0], scale: [1, 1, 0.9, 0.9, 1], zIndex: [2, 2, 0, 0, 2],
    };
    return {
      x: [0, 0, crossX, crossX, gatherX],
      y: [0, 0, 0, 0, 0],
      rotate: [0, 0, 0, 0, side * 3],
      zIndex: side < 0 ? [1, 1, 10, 10, 1] : [1, 1, 1, 1, 1],
    };
  }

  if (animType === 'arc') {
    if (offset === 0) return {
      x: [0, 0, 0, 0, gatherX], y: [0, 0, 0, 0, 0], scale: [1, 1, 0.8, 0.8, 1], zIndex: [2, 2, 0, 0, 2],
    };
    const arcY = side * -60 * absOffset;
    return {
      x: [0, 0, crossX, crossX, gatherX],
      y: [0, side * -20 * absOffset, arcY, arcY, 0],
      rotate: [0, side * -10 * absOffset, side * -20 * absOffset, side * -20 * absOffset, side * 3],
      zIndex: side < 0 ? [1, 1, 10, 10, 1] : [1, 1, 1, 1, 1],
    };
  }

  // diagonal
  if (offset === 0) return {
    x: [0, 0, 0, 0, gatherX], y: [0, 0, 0, 0, 0], scale: [1, 1, 0.85, 0.85, 1], zIndex: [2, 2, 0, 0, 2],
  };
  const diagY = side * 60 * absOffset;
  return {
    x: [0, 0, crossX, crossX, gatherX],
    y: [0, 0, diagY, diagY, 0],
    rotate: [0, 0, side * 15 * absOffset, side * 15 * absOffset, side * 3],
    zIndex: side < 0 ? [1, 1, 10, 10, 1] : [1, 1, 1, 1, 1],
  };
}


/** Full-screen shuffle animation overlay — random card count (5-7) and random style */
function ShuffleOverlay({ question, mode }: { question: string; mode: 'waite' | 'thoth' | 'lenormand' }) {
  const [animType] = useState<ShuffleAnim>(
    () => SHUFFLE_ANIMATIONS[Math.floor(Math.random() * SHUFFLE_ANIMATIONS.length)]
  );
  const [cardCount] = useState(() => Math.floor(Math.random() * 3) + 5); // 5, 6, or 7

  const ease = [0.2, 0, 0.8, 1] as [number, number, number, number];
  const T = { duration: 2, repeat: 0, ease, times: [0, 0.15, 0.5, 0.75, 1] };
  const T_stagger = { duration: 2, repeat: 0, ease, times: [0, 0.25, 0.5, 0.75, 1] };

  const centerIndex = Math.floor(cardCount / 2);
  // Container wide enough for all cards (non-center 68px, center 86px, gap 16px)
  const containerW = cardCount * 68 + (cardCount - 1) * 16 + 18;
  const containerCenter = containerW / 2;

  // Compute each card's natural center x (within container coords)
  // then gatherX = how much transform to apply to reach containerCenter
  const cardGatherX: number[] = [];
  let cursor = 0;
  for (let i = 0; i < cardCount; i++) {
    const w = i === centerIndex ? 86 : 68;
    const cardCenterX = cursor + w / 2;
    cardGatherX.push(containerCenter - cardCenterX);
    cursor += w + 16;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-14"
      style={{ background: 'rgba(20, 15, 40, 0.85)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Card row — overflow visible so cross/fan cards can travel outside bounds */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 16, height: 148,
        position: 'relative', width: containerW, justifyContent: 'center', overflow: 'visible'
      }}>
        {Array.from({ length: cardCount }, (_, i) => {
          const isCenter = i === centerIndex;
          const offset = i - centerIndex;
          const useStagger = animType === 'arc' && offset > 0;
          return (
            <motion.div
              key={i}
              style={{
                width: isCenter ? 86 : 68, height: isCenter ? 134 : 108,
                originX: 0.5, originY: 1, flexShrink: 0, position: 'relative'
              }}
              animate={getCardAnimation(offset, animType, cardGatherX[i])}
              transition={useStagger ? T_stagger : T}
            >
              <CardBack featured={isCenter} system={mode} />
            </motion.div>
          );
        })}
      </div>

      {/* Question area */}
      <div className="text-center flex flex-col items-center gap-3 px-8">
        <p style={{ color: 'rgba(180,150,255,0.7)', fontSize: '0.7rem', letterSpacing: '0.25em', fontWeight: 500, textTransform: 'uppercase' }}>
          讓心靜下來，將問題放入心中⋯
        </p>
        {question.trim() && (
          <p style={{ color: 'rgba(252,211,77,0.9)' }} className="text-base sm:text-lg font-semibold max-w-sm leading-relaxed">
            {question.trim()}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/** Guards the /result route: redirects to / if there's no drawn card data */
function ResultGuard({ hasData, children }: { hasData: boolean; children: React.ReactNode }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasData) navigate('/', { replace: true });
  }, [hasData, navigate]);
  if (!hasData) return null;
  return <>{children}</>;
}

/** Resets scroll position to top on every route change — fires before paint to avoid visible jump */
function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [mode, setMode] = useState<'waite' | 'lenormand' | 'thoth'>('waite');
  const [lang, setLang] = useState<'zh' | 'en'>(() => {
    return (localStorage.getItem('tarot_lang') as 'zh' | 'en') || 'zh';
  });
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const [gtQuerent, setGtQuerent] = useState<'woman' | 'man'>('woman');
  const [gtPartner, setGtPartner] = useState<'opposite' | 'same' | 'none'>('opposite');
  const [gtTheme, setGtTheme] = useState<'general' | 'love' | 'career' | 'money' | 'health'>('general');
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
  const [choiceCount, setChoiceCount] = useState(2);
  const [peopleCount, setPeopleCount] = useState(2);
  const [drawInputMode, setDrawInputMode] = useState<'random' | 'manual'>('random');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'week' | 'month' | 'older'>('all');
  const [historySelectMode, setHistorySelectMode] = useState(false);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<Set<string>>(new Set());
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);
  const [manualInputs, setManualInputs] = useState<{ name: string; reversed: boolean }[]>([]);
  const translatedSelectedSpread = React.useMemo(() => {
    if (!selectedSpread) return null;
    if (lang === 'zh') return selectedSpread;
    return {
      ...selectedSpread,
      name: SPREAD_TRANSLATIONS[selectedSpread.id]?.name ?? selectedSpread.name,
      hint: SPREAD_TRANSLATIONS[selectedSpread.id]?.hint ?? selectedSpread.hint,
      positions: POSITION_TRANSLATIONS[selectedSpread.id] ?? selectedSpread.positions
    };
  }, [selectedSpread, lang]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [bottomCard, setBottomCard] = useState<DrawnCard | null>(null);
  const [isCustomOpen, setIsCustomOpen] = useState(true);
  const [isBuiltinOpen, setIsBuiltinOpen] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const currentTrivia = React.useMemo(() => {
    let pool = TAROT_TRIVIA;
    if (mode === 'lenormand') pool = LENORMAND_TRIVIA;
    if (mode === 'thoth') pool = THOTH_TRIVIA;
    const base = pool[Math.floor(Math.random() * pool.length)];
    return lang === 'en' ? (TRIVIA_TRANSLATIONS[base] ?? base) : base;
  }, [location.pathname, selectedSpread, mode, lang]);

  const filteredHistory = React.useMemo(() => {
    const now = Date.now();
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
    return history.filter(r => {
      const age = now - r.date;
      if (historyFilter === 'week') return age <= ONE_WEEK;
      if (historyFilter === 'month') return age <= ONE_MONTH;
      if (historyFilter === 'older') return age > ONE_MONTH;
      return true;
    });
  }, [history, historyFilter]);

  const allFilteredSelected = React.useMemo(() =>
    filteredHistory.length > 0 && filteredHistory.every(r => selectedHistoryIds.has(r.id)),
    [filteredHistory, selectedHistoryIds]
  );

  const historyTabCounts = React.useMemo(() => {
    const now = Date.now();
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
    let week = 0, month = 0, older = 0;
    for (const r of history) {
      const age = now - r.date;
      if (age <= ONE_WEEK) week++;
      else if (age <= ONE_MONTH) month++;
      else older++;
    }
    return { all: history.length, week, month, older };
  }, [history]);

  // Memoized spread categories — only recompute when mode changes
  const categorizedSpreads = React.useMemo(() => {
    const masterPool = [
      ...THOTH_SPREADS,
      ...WAITE_SPREADS.filter(s => !THOTH_SPREADS.some(t => t.id === s.id)),
    ];
    const allowedIds = mode === 'waite' ? WAITE_SPREAD_IDS : THOTH_SPREAD_IDS;
    const spreads = masterPool.filter(s => allowedIds.includes(s.id));
    const cats = mode === 'waite'
      ? [
        { label: t('✦ 快速一問', '✦ Quick Guide'), ids: ['single', 'waite-triangle', 'body-mind-spirit'] },
        { label: t('✦ 做決定', '✦ Decisions'), ids: ['breakthrough', 'choice'] },
        { label: t('✦ 關係與他人', '✦ Relationships'), ids: ['now-connect', 'lovers-pyramid', 'reconciliation', 'attraction', 'rel-seasons', 'mirror'] },
        { label: t('✦ 深入探索', '✦ Deep Dive'), ids: ['celtic', 'cycle', 'hero', 'resource'] },
      ]
      : [
        { label: t('✦ 快速一問', '✦ Quick Guide'), ids: ['single', 'waite-triangle', 'body-mind-spirit'] },
        { label: t('✦ 做決定', '✦ Decisions'), ids: ['breakthrough', 'choice'] },
        { label: t('✦ 關係與他人', '✦ Relationships'), ids: ['now-connect', 'lovers-pyramid', 'reconciliation', 'energy-resonance', 'mirror-mirror', 'mirror'] },
        { label: t('✦ 深入探索', '✦ Deep Dive'), ids: ['johari', 'cycle', 'iceberg', 'resource', 'elements'] },
      ];
    return cats
      .map(({ label, ids }) => ({ label, catSpreads: spreads.filter(s => ids.includes(s.id)) }))
      .filter(c => c.catSpreads.length > 0);
  }, [mode, lang]);

  // Memoized drawnCards partitions — filter once, reuse everywhere in result view
  const { mainCards, extraCards, hasExtraCards } = React.useMemo(() => {
    const main = drawnCards.filter(c => !c.extraQuestion);
    const extra = drawnCards.filter(c => !!c.extraQuestion);
    return { mainCards: main, extraCards: extra, hasExtraCards: extra.length > 0 };
  }, [drawnCards]);

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
          name: "岔路推演",
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

  // Dynamic energy-resonance spread modifier (reuses peopleCount)
  useEffect(() => {
    if (selectedSpread?.id === 'energy-resonance') {
      const base = ['我的底層渴望', '對方的底層渴望', '碰撞製造的東西', '各自迴避的部分', '去除投射後的核心'];
      const positions = [...base];
      for (let i = 1; i < peopleCount - 1; i++) {
        const char = String.fromCharCode(65 + i);
        positions.splice(1 + i, 0, `對象${char}的底層渴望`);
      }
      const expectedCount = 4 + (peopleCount - 1);
      if (selectedSpread.count !== expectedCount) {
        setSelectedSpread({
          ...selectedSpread,
          name: peopleCount === 2 ? '能量共振' : `能量共振 (${peopleCount}人局)`,
          count: expectedCount,
          positions,
        });
      }
    }
  }, [peopleCount, selectedSpread]);

  // Dynamic mirror-mirror spread modifier (reuses peopleCount)
  useEffect(() => {
    if (selectedSpread?.id === 'mirror-mirror') {
      const base = ['你在對方身上受不了的', '這件事在你身上的根', '對方從你身上照見的', '你們共同迴避的', '這段關係真正的課題'];
      const positions = [...base];
      for (let i = 1; i < peopleCount - 1; i++) {
        const char = String.fromCharCode(65 + i);
        positions.splice(2 + i, 0, `對象${char}從你身上照見的`);
      }
      const expectedCount = 4 + (peopleCount - 1);
      if (selectedSpread.count !== expectedCount) {
        setSelectedSpread({
          ...selectedSpread,
          name: peopleCount === 2 ? '鏡中鏡' : `鏡中鏡 (${peopleCount}人局)`,
          count: expectedCount,
          positions,
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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        document.querySelectorAll('img').forEach((img) => {
          if (!img.complete || img.naturalHeight === 0) {
            img.src = img.src;
          }
        });
        setForceUpdate(prev => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title,
      });
    }
    if (location.pathname === '/result') {
      trackEvent('view_result', {
        spread_name: selectedSpread?.name ?? '',
        system: mode,
        has_question: question.trim().length > 0 ? 'true' : 'false',
      });
    }
  }, [location.pathname]);

  const toggleTheme = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // ─── Stable spread selection handlers (keep React.memo on SpreadCard effective)
  const handleTarotSpreadSelect = useCallback((spread: Spread) => {
    setSelectedSpread(spread);
    setBottomCard(null);
    if (spread.id === 'choice') setChoiceCount(2);
    if (spread.id === 'mirror') setPeopleCount(2);
    trackEvent('select_spread', { spread_name: spread.name, spread_count: spread.count, system: mode });
    navigate('/draw');
    setQuestion('');
  }, [navigate, mode]);

  const handleLenormandSpreadSelect = useCallback((spread: Spread) => {
    setSelectedSpread(spread);
    setLenormandDrawnCards([]);
    trackEvent('select_spread', { spread_name: spread.name, spread_count: spread.count, system: mode });
    navigate('/draw');
    setQuestion('');
  }, [navigate, mode]);

  const handleCustomSpreadSelect = useCallback((spread: Spread) => {
    setSelectedSpread(spread);
    trackEvent('select_custom_spread', { spread_name: spread.name, card_count: spread.count, system: mode });
    navigate('/draw');
    setQuestion('');
  }, [navigate, mode]);

  const handleSpreadEdit = useCallback((spread: Spread, e: MouseEvent) => {
    e.stopPropagation();
    setEditingSpread({ ...spread });
    setIsModalOpen(true);
  }, []);

  const handleSpreadDelete = useCallback((spread: Spread, e: MouseEvent) => {
    e.stopPropagation();
    setCustomSpreads(prev => prev.filter(s => s.id !== spread.id));
    showToast(t('已刪除自訂牌陣', 'Custom spread deleted'));
  }, [showToast]);

  const handleDraw = () => {
    if (!selectedSpread) return;

    if (mode === 'lenormand') {
      const { drawn } = shuffleAndDraw(LENORMAND_CARDS, 'lenormand', selectedSpread.count);
      const lenResults: DrawnLenormandCard[] = drawn.map((card, index) => ({
        id: card.id,
        nameCN: card.nameCN,
        nameEN: card.nameEN,
        suit: LENORMAND_CARDS.find(c => c.id === card.id)!.suit,
        emoji: LENORMAND_CARDS.find(c => c.id === card.id)!.emoji,
        keywords: LENORMAND_CARDS.find(c => c.id === card.id)!.keywords,
        positionName: selectedSpread.positions[index] || `位置 ${index + 1}`,
      }));
      setLenormandDrawnCards(lenResults);
      const newHistoryId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      setCurrentHistoryId(newHistoryId);
      setHistory(prev => [{ id: newHistoryId, date: Date.now(), question: question || '', spread: selectedSpread, cards: [], lenormandCards: lenResults, mode: 'lenormand' as const }, ...prev]);
      drawn.forEach(card => { const img = new Image(); img.src = getCardImagePath('lenormand', card.id); });
      setIsShuffling(true);
      trackEvent('draw_cards', { spread_name: selectedSpread.name, spread_count: selectedSpread.count, system: mode, has_question: (question.trim().length > 0) });
      setTimeout(() => { setIsShuffling(false); navigate('/result'); }, SHUFFLE_ANIMATION_MS);
      return;
    }

    // ─── Tarot / Thoth ──────────────────────────────────────────────────────
    const system = mode === 'thoth' ? 'thoth' : 'waite';
    const sourceCards = mode === 'thoth' ? THOTH_ALL_CARDS : ALL_CARDS;
    const { drawn, bottom } = shuffleAndDraw(sourceCards, system, selectedSpread.count);

    const results: DrawnCard[] = drawn.map((card, index) => ({
      ...sourceCards.find(c => c.id === card.id)!,
      isReversed: card.reversed,
      positionName: selectedSpread.positions[index] || `位置 ${index + 1}`,
    }));

    const bottomResult: DrawnCard = {
      ...sourceCards.find(c => c.id === bottom.id)!,
      isReversed: mode === 'thoth' ? false : bottom.reversed,
      positionName: '底牌',
    };
    setBottomCard(bottomResult);

    setDrawnCards(results);
    const newHistoryId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setCurrentHistoryId(newHistoryId);
    setHistory(prev => [{ id: newHistoryId, date: Date.now(), question: question || '', spread: selectedSpread, cards: results, mode, bottomCard: bottomResult }, ...prev]);
    drawn.forEach(card => { const img = new Image(); img.src = getCardImagePath(mode === 'thoth' ? 'thoth' : 'waite', card.id); });
    setIsShuffling(true);
    trackEvent('draw_cards', { spread_name: selectedSpread.name, spread_count: selectedSpread.count, system: mode, has_question: (question.trim().length > 0) });
    setTimeout(() => { setIsShuffling(false); navigate('/result'); }, SHUFFLE_ANIMATION_MS);
  };

  const handleManualSubmit = () => {
    if (!selectedSpread) return;
    setIsShuffling(false); // reset stale shuffle state
    const filled = manualInputs.filter(i => i.name.trim());
    if (filled.length === 0) { showToast('請至少填入一張牌'); return; }
    const unfilled = selectedSpread.positions.map((pos, i) => ({ pos, i, name: manualInputs[i]?.name?.trim() || '' })).filter(x => !x.name);
    if (unfilled.length > 0) {
      showToast(`請填入第 ${unfilled.map(x => x.i + 1).join('、')} 張牌`);
      return;
    }

    trackEvent('manual_submit', { spread_name: selectedSpread.name, system: mode });
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
      const newId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      setCurrentHistoryId(newId);
      setHistory(prev => [{ id: newId, date: Date.now(), question: question || '', spread: selectedSpread, cards: [], lenormandCards: results, mode: 'lenormand' as const }, ...prev]);
      navigate('/result');
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
      const newId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      setCurrentHistoryId(newId);
      setHistory(prev => [{ id: newId, date: Date.now(), question: question || '', spread: selectedSpread, cards: results, mode }, ...prev]);
      navigate('/result');
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
    trackEvent('draw_extra', { spread_name: selectedSpread?.name ?? '', system: mode, extra_question: (extraQuestion.trim().length > 0) });
    setExtraQuestion('');
  };

  const copyToClipboard = (type: 'all' | 'main' | 'extra' = 'all', record?: DrawHistory) => {
    const isEn = lang === 'en';
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

      const systemHeaderRegular = isEn ? `[System] Lenormand (Regular Spread)
[Rules]
1. Must build a narrative using adjacent card pairs. Interpreting single cards is strictly prohibited.
2. Focus on concrete reality. Extensions into spiritual or psychological realms are absolutely forbidden.
3. Conclude with a single sentence giving the most clear and direct answer.` : `【系統】雷諾曼（常規牌陣）
【規則】
1. 必須以相鄰牌對組合建立敘事，嚴禁單牌解讀。
2. 鎖定具體現實事務，絕對禁止延伸至靈性或心理學層面。
3. 結尾必須用一句話給出最明確、直接的結論。`;

      const systemHeaderGrand = isEn ? `[System] Lenormand (Grand Tableau)
[Rules]
1. Must build a narrative using adjacent card pairs. Interpreting single cards is strictly prohibited.
2. Focus on concrete reality. Extensions into spiritual or psychological realms are absolutely forbidden.
3. Conclude with a single sentence giving the most clear and direct answer.` : `【系統】雷諾曼（大展開）
【規則】
1. 必須以相鄰牌對組合建立敘事，嚴禁單牌解讀。
2. 鎖定具體現實事務，絕對禁止延伸至靈性或心理學層面。
3. 結尾必須用一句話給出最明確、直接的結論。`;

      let prompt = '';

      if (cards.length === 9) {
        const [c1, c2, c3, c4, c5, c6, c7, c8, c9] = cards;
        const f = (c: DrawnLenormandCard) => `${c.nameCN} (${c.nameEN})`;
        prompt = isEn ? `${systemHeaderRegular}

I'd like to divine using Lenormand cards for the following:
[Question] ${targetQuestion.trim() || 'Exploring current overall state'}
[Spread] ${targetSpread.name}

Cards drawn:
${cardList}

Please interpret this spread from the following three perspectives:

(1) Timeline (Columns)
  - Past (Left Column): ${f(c1)}, ${f(c4)}, ${f(c7)}
  - Present (Middle Column): ${f(c2)}, ${f(c5)}, ${f(c8)}
  - Future (Right Column): ${f(c3)}, ${f(c6)}, ${f(c9)}
  Interpret the thematic focus of each time period.

(2) Three Layers of Consciousness (Rows)
  - Conscious (Top Row): ${f(c1)}, ${f(c2)}, ${f(c3)}
  - Reality (Middle Row): ${f(c4)}, ${f(c5)}, ${f(c6)}
  - Subconscious (Bottom Row): ${f(c7)}, ${f(c8)}, ${f(c9)}
  Explore the messages revealed by each layer.

(3) Cross Method
  - Core (Position 5): ${f(c5)}
  - Cross (Positions 2, 4, 6, 8): ${f(c2)}, ${f(c4)}, ${f(c6)}, ${f(c8)}
  - Corners (Positions 1, 3, 7, 9): ${f(c1)}, ${f(c3)}, ${f(c7)}, ${f(c9)}

Finally, highlight any notable card combinations and the overall meaning of all 9 cards.` : `${systemHeaderRegular}

我想透過 Lenormand 卡牌占卜以下問題：
【問題】${targetQuestion.trim() || '探索當下整體狀態'}
【牌陣】${targetSpread.name}

抽出的牌：
${cardList}

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
        prompt = isEn ? `${systemHeaderRegular}

I'd like to divine using Lenormand cards for the following:
[Question] ${targetQuestion.trim() || 'Exploring current overall state'}
[Spread] ${targetSpread.name}

Cards drawn:
${cardList}

Please interpret these five cards from the following perspectives:

(1) Flow (Timeline)
  ${f(c1)} → ${f(c2)} → ${f(c3)} → ${f(c4)} → ${f(c5)}
  Explain the development or causal relationship from left to right.

(2) Adjacent Card Pairings (Note directionality: A+B ≠ B+A)
  - Card 1+2: ${f(c1)} + ${f(c2)}
  - Card 2+3: ${f(c2)} + ${f(c3)} (Transition into core)
  - Card 3+4: ${f(c3)} + ${f(c4)}
  - Card 4+5: ${f(c4)} + ${f(c5)}
  Sequentially analyze the specific meaning of each pairing.

(3) Core Axis
  The center card ${f(c3)} is the core of the spread. Analyze how it affects the direction of both sides.

(4) Overall Message
  Synthesize the context of the five cards and provide a concrete and direct answer.` : `${systemHeaderRegular}

我想透過 Lenormand 卡牌占卜以下問題：
【問題】${targetQuestion.trim() || '探索當下整體狀態'}
【牌陣】${targetSpread.name}

抽出的牌：
${cardList}

請從以下層次解讀這五張牌：

（一）左右流向（時間軸）
  ${f(c1)} → ${f(c2)} → ${f(c3)} → ${f(c4)} → ${f(c5)}
  從左到右說明事件發展脈絡或因果關係。

（二）鄰牌配對解讀（注意方向性，A+B ≠ B+A）
  - 牌1+牌2：${f(c1)} + ${f(c2)}
  - 牌2+牌3：${f(c2)} + ${f(c3)}（過渡核心）
  - 牌3+牌4：${f(c3)} + ${f(c4)}
  - 牌4+牌5：${f(c4)} + ${f(c5)}
  請依序解析每組配對的具體含義。

（三）中心牌的軸心
  中心牌 ${f(c3)} 是整個牌陣的核心，分析它如何影響左右兩側的走向。

（四）整體訊息
  綜合五張牌的脈絡，給出具體且直接的答案。`;
      } else if (cards.length === 3) {
        const [c1, c2, c3] = cards;
        const f = (c: DrawnLenormandCard) => `${c.nameCN}${c.nameEN ? ` (${c.nameEN})` : ''}`;
        prompt = isEn ? `${systemHeaderRegular}

I'd like to divine using Lenormand cards for the following:
[Question] ${targetQuestion.trim() || 'Exploring current overall state'}
[Spread] ${targetSpread.name}

Cards drawn:
${cardList}

Please interpret these three cards from the following perspectives:

(1) Flow
  ${f(c1)} → ${f(c2)} → ${f(c3)}

(2) Adjacent Card Pairings (Note directionality: A+B ≠ B+A)
  - Left+Middle: Meaning of ${f(c1)} + ${f(c2)}
  - Middle+Right: Meaning of ${f(c2)} + ${f(c3)}
  Sequentially analyze, and explain how the change in direction affects the interpretation.

(3) Overall Message
  The core theme and answer described by the three cards together.` : `${systemHeaderRegular}

我想透過 Lenormand 卡牌占卜以下問題：
【問題】${targetQuestion.trim() || '探索當下整體狀態'}
【牌陣】${targetSpread.name}

抽出的牌：
${cardList}

請從以下層次解讀這三張牌：

（一）左右流向
  ${f(c1)} → ${f(c2)} → ${f(c3)}

（二）鄰牌配對解讀（注意方向性，A+B ≠ B+A）
  - 左+中：${f(c1)} + ${f(c2)}的組合含義
  - 中+右：${f(c2)} + ${f(c3)}的組合含義
  請依序解析，並說明方向改變如何影響解讀。

（三）整體訊息
  三張牌合在一起描述的核心主題與答案。`;
      } else if (cards.length === 36) {
        const f = (c: DrawnLenormandCard) => `${c.nameCN}(${c.nameEN})`;
        const posMap = cards.map((c, i) => isEn ? `${String(i+1).padStart(2,'0')}. House of ${LENORMAND_CARDS[i]?.nameEN} → ${f(c)}` : `${String(i+1).padStart(2,'0')}. ${LENORMAND_CARDS[i]?.nameCN}宮 → ${f(c)}`);

        // 1. Identify Querent
        const qCardId = gtQuerent === 'woman' ? 29 : 28;
        const qIdx = cards.findIndex(c => c.id === qCardId);
        const qCard = qIdx >= 0 ? cards[qIdx] : null;
        const qRow = qIdx >= 0 ? Math.floor(qIdx / 9) : -1;
        const qCol = qIdx >= 0 ? qIdx % 9 : -1;
        const qPos = qIdx + 1;

        // 2. Identify Partner
        let pCardId = -1;
        if (gtPartner === 'opposite') {
          pCardId = qCardId === 29 ? 28 : 29;
        } else if (gtPartner === 'same') {
          pCardId = 18; // Use Dog (#18) to represent same-sex partner / companion
        }
        const pIdx = pCardId > 0 ? cards.findIndex(c => c.id === pCardId) : -1;
        const pCard = pIdx >= 0 ? cards[pIdx] : null;
        const pRow = pIdx >= 0 ? Math.floor(pIdx / 9) : -1;
        const pCol = pIdx >= 0 ? pIdx % 9 : -1;
        const pPos = pIdx + 1;

        // 3. Identify Theme card
        let tCardId = -1;
        if (gtTheme === 'love') tCardId = 24;      // Heart
        else if (gtTheme === 'career') tCardId = 35; // Anchor
        else if (gtTheme === 'money') tCardId = 34;  // Fish
        else if (gtTheme === 'health') tCardId = 5;  // Tree
        const tIdx = tCardId > 0 ? cards.findIndex(c => c.id === tCardId) : -1;
        const tCard = tIdx >= 0 ? cards[tIdx] : null;
        const tRow = tIdx >= 0 ? Math.floor(tIdx / 9) : -1;
        const tCol = tIdx >= 0 ? tIdx % 9 : -1;
        const tPos = tIdx + 1;

        // 4. Surrounding cards (上下左右 + 對角) around Querent
        const na = isEn ? 'N/A' : '無';
        const above = (qIdx >= 0 && qRow > 0) ? f(cards[qIdx - 9]) : na;
        const below = (qIdx >= 0 && qRow < 3) ? f(cards[qIdx + 9]) : na;
        const left  = (qIdx >= 0 && qCol > 0) ? f(cards[qIdx - 1]) : na;
        const right = (qIdx >= 0 && qCol < 8) ? f(cards[qIdx + 1]) : na;
        const diagTL = (qIdx >= 0 && qRow > 0 && qCol > 0) ? f(cards[qIdx - 10]) : na;
        const diagTR = (qIdx >= 0 && qRow > 0 && qCol < 8) ? f(cards[qIdx - 8])  : na;
        const diagBL = (qIdx >= 0 && qRow < 3 && qCol > 0) ? f(cards[qIdx + 8])  : na;
        const diagBR = (qIdx >= 0 && qRow < 3 && qCol < 8) ? f(cards[qIdx + 10]) : na;

        // 5. Knighting from Querent
        const knightOffsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        const knightCards = qIdx >= 0 ? knightOffsets.map(([dr, dc]) => {
          const r2 = qRow + dr, c2 = qCol + dc;
          return (r2 >= 0 && r2 < 4 && c2 >= 0 && c2 < 9) ? f(cards[r2 * 9 + c2]) : null;
        }).filter(Boolean) : [];

        // 6. Mirroring for Querent
        const mirrorRow = 3 - qRow, mirrorCol = 8 - qCol;
        const mirrorCard = qIdx >= 0 ? f(cards[mirrorRow * 9 + mirrorCol]) : na;

        // 7. House of Querent (the card that landed in Querent's natural house)
        const houseCard = qCard ? f(cards[qCardId - 1]) : na;

        // 8. Distance descriptions (Chebyshev distance / King's move distance)
        const getDistanceDesc = (idx1: number, idx2: number) => {
          if (idx1 < 0 || idx2 < 0) return na;
          const r1 = Math.floor(idx1 / 9), c1 = idx1 % 9;
          const r2 = Math.floor(idx2 / 9), c2 = idx2 % 9;
          const dist = Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2));
          const text = isEn 
            ? (dist <= 2 ? 'Close' : dist >= 5 ? 'Far' : 'Medium distance')
            : (dist <= 2 ? '近' : dist >= 5 ? '遠' : '中度距離');
          const stepText = isEn ? 'steps' : '步';
          return `${dist} ${stepText} (${text})`;
        };
        const partnerDist = pIdx >= 0 ? getDistanceDesc(qIdx, pIdx) : (isEn ? 'No partner' : '無對象');
        const themeDist = tIdx >= 0 ? getDistanceDesc(qIdx, tIdx) : (isEn ? 'No specific theme' : '無特定主題');

        // 9. Facing direction and high-low power comparison
        let heightComparison = '';
        if (qIdx >= 0 && pIdx >= 0) {
          if (qRow < pRow) heightComparison = isEn ? 'Querent is in upper row (higher initiative/control)' : '問事者在上行（主動性或掌控度較高）';
          else if (qRow > pRow) heightComparison = isEn ? 'Partner is in upper row (partner has higher influence)' : '對象在上行（對方目前影響力較高）';
          else heightComparison = isEn ? 'Same row' : '雙方等高';
        }

        let facingDesc = '';
        if (qIdx >= 0 && pIdx >= 0) {
          if (pCardId === 18) {
            facingDesc = isEn ? 'Same-sex partner (Dog #18). No traditional facing rules, mainly read distance and height.' : '同性伴侶關係（以#18狗代表對象），無傳統性別視線背向規則，主要以高低位與距離解讀。';
          } else if ((qCardId === 29 && pCardId === 28) || (qCardId === 28 && pCardId === 29)) {
            const wCol = qCardId === 29 ? qCol : pCol;
            const mCol = qCardId === 28 ? qCol : pCol;
            if (wCol < mCol) {
              facingDesc = isEn ? 'Facing away (Lack of communication/attention, or alienated)' : '背對彼此（女人在左、男人在右，雙方視線向外看，暗示缺乏溝通、互不關注或有隔閡）';
            } else {
              facingDesc = isEn ? 'Facing each other (Good communication, mutual attention)' : '面對彼此（女人在右、男人在左，雙方視線交會，代表溝通順暢、意願一致或彼此關注）';
            }
          } else {
            facingDesc = isEn ? 'General character relation, mainly read distance and height.' : '一般角色關係，主要觀察距離與高低位。';
          }
        }

        // Spine and corners
        const spineCards = [4, 13, 22, 31].map(i => isEn ? `House ${i+1}(${LENORMAND_CARDS[i]?.nameEN ?? ''}) → ${f(cards[i])}` : `第${i+1}宮(${LENORMAND_CARDS[i]?.nameCN ?? ''}宮) → ${f(cards[i])}`).join(isEn ? ', ' : '、');
        const corners = isEn ? `Pos 1:${f(cards[0])}, Pos 9:${f(cards[8])}, Pos 28:${f(cards[27])}, Pos 36:${f(cards[35])}` : `位置1:${f(cards[0])}、位置9:${f(cards[8])}、位置28:${f(cards[27])}、位置36:${f(cards[35])}`;
        const sigRowCards = (qRow >= 0 && qRow < 4) ? cards.slice(qRow * 9, qRow * 9 + 9) : [];
        const sigRowText = sigRowCards.map(f).join(' → ');

        const farNote = qCol <= 2 ? (isEn ? 'Left side (past influence)' : '偏左側(象徵過去影響)')
          : qCol >= 6 ? (isEn ? 'Right side (future development)' : '偏右側(象徵未來發展)')
          : (isEn ? 'Center (current core)' : '居中(當下核心)');

        const sigNote = qCard
          ? (isEn 
             ? `- Querent card: ${f(qCard)} at Row ${qRow+1}, Col ${qCol+1} (${farNote}, House ${qPos}·${LENORMAND_CARDS[qPos-1]?.nameEN ?? ''})`
             : `- 問事者指示牌：${f(qCard)} 落在第${qRow+1}行第${qCol+1}列（${farNote}，第 ${qPos} 宮·${LENORMAND_CARDS[qPos-1]?.nameCN ?? ''}宮）`)
          : (isEn ? '- Querent card: Querent not found.' : '- 問事者指示牌：未定位到問事者。');

        const partnerNote = pCard
          ? (isEn
             ? `- Partner card: ${f(pCard)} at Row ${pRow+1}, Col ${pCol+1} (House ${pPos}·${LENORMAND_CARDS[pPos-1]?.nameEN ?? ''})\n  * Distance: ${partnerDist}\n  * Height: ${heightComparison || (isEn ? 'N/A' : '無')}\n  * Facing: ${facingDesc}`
             : `- 伴侶/對象指示牌：${f(pCard)} 落在第${pRow+1}行第${pCol+1}列（第 ${pPos} 宮·${LENORMAND_CARDS[pPos-1]?.nameCN ?? ''}宮）\n  * 雙方距離：${partnerDist}\n  * 雙方高低：${heightComparison || '無'}\n  * 雙方視線：${facingDesc}`)
          : (isEn ? '- Partner card: N/A' : '- 伴侶/對象指示牌：未指定或未在牌面中定位。');

        const themeNote = tCard
          ? (isEn
             ? `- Theme card: ${f(tCard)} at Row ${tRow+1}, Col ${tCol+1} (House ${tPos}·${LENORMAND_CARDS[tPos-1]?.nameEN ?? ''}), distance to Querent is ${themeDist}`
             : `- 占卜主題牌：${f(tCard)} 落在第${tRow+1}行第${tCol+1}列（第 ${tPos} 宮·${LENORMAND_CARDS[tPos-1]?.nameCN ?? ''}宮），距離問事者 ${themeDist}`)
          : (isEn ? '- Theme card: N/A' : '- 占卜主題牌：無特定主題牌。');

        prompt = isEn ? `${systemHeaderGrand}

I'd like to divine using Lenormand Grand Tableau (4x9):
[Question] ${targetQuestion.trim() || 'Exploring current overall state'}

[Card vs House Mapping]
${posMap.join('\n')}

[Key Relational Info]
${sigNote}
${partnerNote}
${themeNote}
- Querent neighbors (Top/Bottom/Left/Right): Top=${above}, Bottom=${below}, Left=${left}, Right=${right}
- Querent diagonal neighbors: TopLeft=${diagTL}, TopRight=${diagTR}, BottomLeft=${diagBL}, BottomRight=${diagBR}
- Row of Querent: ${sigRowText}
- Querent mirror card: ${mirrorCard}
- Querent knight's jump cards: ${knightCards.join(', ') || 'N/A'}
- House of Querent (where their natural card landed): ${houseCard}
- Corner cards: ${corners}
- Spine cards: ${spineCards}

Please combine the above layout and relational information to provide an in-depth reading of this Grand Tableau.

[Interpretation Guidelines]:
1. Organic Interweaving: Do not mechanically split the reading into isolated technical jargon like "the neighbor means... the mirror means...". Use your intuition as a diviner to weave neighbors, mirrors, knight jumps, distances, and lines of sight into a coherent, realistic storyline with cause and effect.
2. Structured Formatting: Provide detailed analysis, but you must use standard Markdown formatting (using headings, lists, and bold text for key card names) to clearly organize the reading and maintain distinct layers.
3. Conclusion: Interpret with the most concrete, daily-life orientation possible. Conclude with a clear bottom line and actionable advice.` : `${systemHeaderGrand}

我想透過 Lenormand 大展開 (Grand Tableau 4x9) 占卜：
【問題】${targetQuestion.trim() || '探索當下整體狀態'}

【牌面與宮位對照】
${posMap.join('\n')}

【關鍵關聯資訊】
${sigNote}
${partnerNote}
${themeNote}
- 問事者鄰牌（上下左右）：上=${above}、下=${below}、左=${left}、右=${right}
- 問事者對角鄰牌（四周）：左上=${diagTL}、右上=${diagTR}、左下=${diagBL}、右下=${diagBR}
- 橫讀問事者所在整行：${sigRowText}
- 問事者鏡像反射牌：${mirrorCard}
- 問事者騎士跳躍牌：${knightCards.join('、') || '無'}
- 問事者對應宮位的卡牌：${houseCard}
- 四角牌：${corners}
- 中軸脊骨牌：${spineCards}

請結合上述配置與關聯資訊，為此雷諾曼大展開進行深度解讀。

【解讀規範】：
1. 線索有機交織：請勿機械化地將解讀切分為「鄰牌意為... 鏡像牌意為...」這種孤立的技術名詞解說。請發揮占卜師直覺，將鄰牌、鏡像、騎士跳、遠近法與視線關係有機織入，還原出一個前因後果連貫的真實事件故事線。
2. 結構化排版：請詳細展開分析，但必須使用標準 Markdown 格式（使用標題、清單、粗體字標記關鍵卡牌名）來進行清晰的排版，保持層次分明。
3. 結論收尾：請以最具實體、日常事務性的導向進行解讀，尾聲以一段明確的結論與行動建議收尾。`;
      } else {
        // len-1: Lenormand single — direct Yes/No format, no analysis
        const card = cards[0];
        prompt = isEn ? `[System] Lenormand
[Card] ${card.nameEN} (${card.nameCN})
[Question] ${targetQuestion.trim() || 'Please interpret the current guidance of this card'}
[Core Instructions]
1. Do not do combination reading. Just give a concrete "Yes / No / Neutral" judgment based purely on this card's literal symbolism.
2. Spiritual/psychological extensions or preaching are strictly forbidden.
3. Keep it brief and crisp, absolutely no more than 3 sentences.` : `【系統】雷諾曼
【牌】${card.nameCN}（${card.nameEN}）
【問題】${targetQuestion.trim() || '請直接解讀此牌當下的指引'}
【核心指令】
1. 不做組合解讀，僅根據此牌的字面象徵，直接給出一個具體的「是／否／中性」判斷。
2. 嚴禁任何靈性、心理延伸或說教。
3. 輸出簡短俐落，絕對不得超過 3 句話。`;
      }

      navigator.clipboard.writeText(prompt).then(() => {
        if (record) {
          showToast(isEn ? 'AI prompt copied!' : '已複製 AI 解讀 Prompt！');
        } else {
          setShowCopySuccess('all');
          setTimeout(() => setShowCopySuccess(null), 2000);
        }
      });
      return;
    }

    const mainCards = targetCards.filter(c => !c.extraQuestion);
    const extraCards = targetCards.filter(c => c.extraQuestion);

    const mainText = mainCards.map((card, i) => {
      const orientation = targetMode === 'thoth' ? '' : ` (${card.isReversed ? (isEn ? 'Reversed' : '逆位') : (isEn ? 'Upright' : '正位')})`;
      const posName = isEn && POSITION_TRANSLATIONS[targetSpread.id] ? POSITION_TRANSLATIONS[targetSpread.id][i] : card.positionName;
      return `  ${i + 1}. ${posName}: ${isEn ? card.nameEN : card.nameCN} (${isEn ? card.nameCN : card.nameEN})${orientation}`;
    }).join('\n');
    const extraText = extraCards.length > 0
      ? (isEn 
        ? `\n\n[Additional Guidance] The following are extra cards drawn for sub-questions. Please focus on interpreting them in the context of the original spread, treating them as a magnifying glass rather than a new reading.\n${extraCards.map(card => {
            const orientation = targetMode === 'thoth' ? '' : ` (${card.isReversed ? 'Reversed' : 'Upright'})`;
            return `  Q: ${card.extraQuestion}\n  👉 ${card.nameEN} (${card.nameCN})${orientation}`;
          }).join('\n\n')}`
        : `\n\n【補充指引】以下為針對子問題補抽的牌，請在原牌陣基礎上聚焦解讀，視為放大鏡而非新占卜。\n${extraCards.map(card => {
            const orientation = targetMode === 'thoth' ? '' : `（${card.isReversed ? '逆位' : '正位'}）`;
            return `  Q: ${card.extraQuestion}\n  👉 ${card.nameCN} ${card.nameEN}${orientation}`;
          }).join('\n\n')}`)
      : '';

    let text = '';

    // Generate AI interpretation guide based on Tarot spread
    let analysisPrompt = '';
    if (targetSpread.isCustom) {
      analysisPrompt = isEn ? `\n\nPlease provide a comprehensive reading and concrete advice based on the defined positions of my custom spread, combining the upright/reversed meanings.` : `\n\n請依據我自訂牌陣中每個位置的定義，結合正逆位牌意，為我進行綜合解讀，並給出具體的建議。`;
    } else {
      switch (targetSpread.id) {
        // Thoth Spreads
        case 'celtic':
          analysisPrompt = isEn ? `\n\nPlease interpret based on the spread positions and card info, analyzing the gap between conscious/subconscious, timeline, and final outcome.` : `\n\n請依據上述牌陣位置定義與牌面資訊進行解讀，分析顯隱意識落差、時間軸走向與最終走向。`;
          break;
        case 'choice': {
          const numChoices = (mainCards.length - 1) / 2;
          const letters = Array.from({ length: numChoices }, (_, i) => String.fromCharCode(65 + i));
          const pathDesc = letters.map(l => isEn ? `Option ${l}` : `選擇${l}`).join(isEn ? ', ' : '、');
          analysisPrompt = isEn ? `\n\nPlease analyze the development trends, potential costs, and core foundations of each path, and provide decision-making guidance.` : `\n\n請分析各條路徑的發展趨勢、潛在代價與底層核心，並給出決策指引。`;
          break;
        }
        case 'mirror': {
          const numPeople = Math.round(mainCards.length / 3);
          if (numPeople <= 2) {
            analysisPrompt = isEn ? `\n\nPlease analyze the cognitive gap between the two roles, core interaction patterns, and hidden blind spots, and provide concrete action advice.` : `\n\n請分析雙方角色的認知落差、核心互動模式與隱藏盲點，並給出具體行動建議。`;
          } else {
            const chars = Array.from({ length: numPeople - 1 }, (_, i) => String.fromCharCode(65 + i));
            const peopleList = chars.map(c => isEn ? `Target ${c}` : `對象${c}`).join(isEn ? ', ' : '、');
            analysisPrompt = isEn ? `\n\nPlease analyze the protagonist's self-awareness, cognitive gaps and interaction patterns with each target, pointing out the core blind spots in the relationship network and advice for balance.` : `\n\n請分析主角的自我認知，以及與各個對象的認知落差與互動模式，指出關係網絡的核心盲點與平衡建議。`;
          }
          break;
        }
        case 'johari':
          analysisPrompt = isEn ? `\n\nPlease interpret the behavioral patterns in the blind area, the unutilized advantages in the hidden area, and the development direction for unknown potentials.` : `\n\n請解讀盲目區的行為模式、隱藏區的未善用優勢以及未知潛能的開發方向。`;
          break;
        case 'breakthrough':
          analysisPrompt = isEn ? `\n\nPlease point out the core bottlenecks and sunk costs, and identify the breakthrough point with the highest leverage and the crucial first step.` : `\n\n請指出核心瓶頸與沉沒成本，找出具備最大槓桿效益的突破口與關鍵第一步。`;
          break;
        case 'cycle':
          analysisPrompt = isEn ? `\n\nPlease analyze the tension between the death of the old state and the budding of new opportunities, and point out what key assets should be released and retained.` : `\n\n請分析舊狀態消亡與新契機萌芽間的張力，並指出應放下與應保留的關鍵資產。`;
          break;
        case 'iceberg':
          analysisPrompt = isEn ? `\n\nPlease dissect the true emotions, core beliefs, and defense mechanisms beneath the surface behavior, and provide an integration strategy.` : `\n\n請剖析表層行為底下的真實情緒、核心信念與防衛機制，並提供整合策略。`;
          break;
        case 'resource':
          analysisPrompt = isEn ? `\n\nPlease inventory available resources and systemic resistance, evaluate external variables, and point out the next milestone.` : `\n\n請盤點現有可用資源與系統阻力，評估外部變數並指出下一個里程碑。`;
          break;
        case 'hero':
          analysisPrompt = isEn ? `\n\nPlease interpret the nature of the call to adventure, current trials, available tools, and guide towards the final transformation and growth.` : `\n\n請解讀旅程召喚的本質、當前試煉與可用的工具，並指引最終的轉化與成長。`;
          break;
        case 'energy-resonance':
          analysisPrompt = isEn ? `\n\nPlease reveal the resonance points of both energy fields after removing projections, analyze intangible influences, and give adjustment advice.` : `\n\n請揭示雙方能量場去投射後的共鳴點，分析無形影響並給出調整建議。`;
          break;
        case 'mirror-mirror':
          analysisPrompt = isEn ? `\n\nPlease point out the nature of inner projections seen in the other person, analyze its impact on the relationship and the true lessons to be learned.` : `\n\n請點出在對方身上看到的內在投射本質，剖析其對關係造成的影響與真實課題。`;
          break;
        case 'lovers-pyramid':
          analysisPrompt = isEn ? `\n\nPlease interpret the true feelings of both parties, obstacles, and the final outcome of the relationship.` : `\n\n請解讀雙方的真實心意、阻礙點與關係最終發展結果。`;
          break;
        case 'reconciliation':
          analysisPrompt = isEn ? `\n\nPlease analyze the main reason for the break/no-contact, true willingness of both, reconciliation obstacles, and evaluate the final possibility of getting back together.` : `\n\n請分析斷聯/破裂的主因、雙方的真實意願與復合障礙，並評估最終復合可能性。`;
          break;

        // Waite Spreads
        case 'waite-triangle':
          analysisPrompt = isEn ? `\n\nPlease analyze past influences, present state, and current shifts, and interpret future development trends and action advice.` : `\n\n請分析過去影響、現在狀態與當下轉變，並解讀未來的發展趨勢與行動建議。`;
          break;
        case 'body-mind-spirit':
          analysisPrompt = isEn ? `\n\nPlease interpret each card as the message from Body, Mind, and Spirit respectively. Analyze where these three dimensions are misaligned and provide concrete advice for realignment.` : `\n\n請分別解讀身體、心智與靈性三個維度各自傳遞的訊息，分析三者的失衡之處，並提供具體的重新對齊建議。`;
          break;
        case 'attraction':
          analysisPrompt = isEn ? `\n\nPlease analyze the connection between current emitted frequency and core desires, find blind spots hindering manifestation, and provide alignment advice.` : `\n\n請解析當前散發頻率與核心渴望的關聯，找出阻礙顯化的盲點並提供對齊建議。`;
          break;
        case 'rel-seasons':
          analysisPrompt = isEn ? `\n\nPlease determine the current season state and turning point of the relationship, and give the most appropriate mindset for getting along.` : `\n\n請判斷關係目前所處的季節狀態與轉變契機，並給出最適宜的相處心態。`;
          break;
        case 'single':
          analysisPrompt = isEn ? `\n\nPlease interpret the core energy state of this card and provide a direct conclusion and guidance.` : `\n\n請解讀此牌的核心能量狀態，並提供直接的結論與指引。`;
          break;
        default:
          analysisPrompt = isEn ? `\n\nPlease provide a comprehensive reading and core advice based on the definition of each position and upright/reversed card meanings.` : `\n\n請依據各個位置的定義與正逆位牌意，為我進行綜合解讀並提供核心建議。`;
          break;
      }
    }

    const waiteHeader = isEn ? `[System] Waite Tarot
[Rules]
1. Interpret combining upright/reversed card positions.
2. Pay attention to the distribution ratio and connections between Major and Minor Arcana.` : `【系統】偉特塔羅
【規則】
1. 結合牌面正逆位進行解讀。
2. 留意牌陣中大牌與小牌的分佈比例與關聯性。`;

    const thothHeader = isEn ? `[System] Thoth Tarot
[Rules]
1. Focus on analyzing elemental interactions (strengthening, weakening, or neutralizing) and the energy resonance of astrological and Kabbalistic paths.
2. Court cards represent specific personality traits or catalysts in the environment.` : `【系統】托特塔羅
【規則】
1. 著重分析牌面元素交互作用（加強、削弱或中和）與占星、卡巴拉路徑的能量共鳴。
2. 宮廷牌代表特定人格特質或環境中的催化劑。`;

    const systemHeader = targetMode === 'thoth' ? thothHeader : waiteHeader;
    const modeName = targetMode === 'thoth' ? (isEn ? 'Thoth' : '托特') : (isEn ? 'Waite' : '偉特');
    const effectiveBottomCard = record?.bottomCard ?? (record ? undefined : bottomCard);
    const bottomText = effectiveBottomCard
      ? (isEn
        ? `\n\n[Bottom Card] ${effectiveBottomCard.nameEN} (${effectiveBottomCard.nameCN})${targetMode === 'thoth' ? '' : ` (${effectiveBottomCard.isReversed ? 'Reversed' : 'Upright'})`}\nRepresents hidden motivation or underlying state. Please add a dedicated paragraph at the end of the overall reading to supplement its key influence.`
        : `\n\n【底牌】${effectiveBottomCard.nameCN} ${effectiveBottomCard.nameEN}${targetMode === 'thoth' ? '' : `（${effectiveBottomCard.isReversed ? '逆位' : '正位'}）`}\n代表潛藏動機或底層狀態。請在整體解讀的最後，獨立用一段話補充其關鍵影響。`)
      : '';
    const spreadName = isEn ? (SPREAD_TRANSLATIONS[targetSpread.id]?.name ?? targetSpread.name) : targetSpread.name;
    const questionLabel = isEn ? 'Question' : '問題';
    const spreadLabel = isEn ? 'Spread' : '牌陣';
    const defaultQuestion = isEn ? 'Exploring current overall state' : '探索當下整體狀態';
    const cardsDrawnLabel = isEn ? 'Cards drawn:' : '抽出的牌：';
    if (type === 'all') {
      text = isEn
        ? `${systemHeader}\n\nI'd like to divine using ${modeName} Tarot for the following:\n\n[${questionLabel}] ${targetQuestion.trim() || defaultQuestion}\n\n[${spreadLabel}] ${spreadName}\n\n${cardsDrawnLabel}\n${mainText}${bottomText}${extraText}${analysisPrompt}`
        : `${systemHeader}\n\n我想透過${modeName}塔羅牌占卜以下問題：\n\n【問題】${targetQuestion.trim() || defaultQuestion}\n\n【牌陣】${spreadName}\n\n抽出的牌：\n${mainText}${bottomText}${extraText}${analysisPrompt}`;
    } else if (type === 'main') {
      text = isEn
        ? `${systemHeader}\n\nI'd like to divine using ${modeName} Tarot for the following:\n\n[${questionLabel}] ${targetQuestion.trim() || defaultQuestion}\n\n[${spreadLabel}] ${spreadName} (Main Spread)\n\n${cardsDrawnLabel}\n${mainText}${bottomText}${analysisPrompt}`
        : `${systemHeader}\n\n我想透過${modeName}塔羅牌占卜以下問題：\n\n【問題】${targetQuestion.trim() || defaultQuestion}\n\n【牌陣】${spreadName}（主牌陣）\n\n抽出的牌：\n${mainText}${bottomText}${analysisPrompt}`;
    } else if (type === 'extra') {
      text = isEn
        ? `I'd like to ask further questions about the ${modeName} Tarot reading results. Please interpret the following additional cards:\n\n[Original Question] ${targetQuestion.trim() || defaultQuestion}\n\n[Derived from Spread] ${spreadName}\n\n${extraText.replace('[Additional Guidance] The following are extra cards drawn for sub-questions. Please focus on interpreting them in the context of the original spread, treating them as a magnifying glass rather than a new reading.\n', '')}\n\nPlease interpret the specific meaning of these additional cards and how they respond to my questions.`
        : `我想針對剛剛的${modeName}塔羅牌占卜結果，進行進一步的提問。請為我解讀以下補抽的牌卡：\n\n【原問題】${targetQuestion.trim() || defaultQuestion}\n\n【衍生自牌陣】${spreadName}\n\n${extraText.replace('【補充指引】以下為針對子問題補抽的牌，請在原牌陣基礎上聚焦解讀，視為放大鏡而非新占卜。\n', '')}\n\n請為我解讀這幾張補抽牌的具體含義，以及它們如何回應我的提問。`;
    }

    navigator.clipboard.writeText(text).then(() => {
      if (record) {
        trackEvent('copy_prompt', { spread_name: targetSpread.name, system: targetMode, type: 'history' });
        showToast(isEn ? 'AI prompt copied!' : '已複製 AI 解讀 Prompt！');
      } else {
        trackEvent('copy_prompt', { spread_name: targetSpread.name, system: targetMode, type });
        setShowCopySuccess(type);
        setTimeout(() => setShowCopySuccess(null), 2000);
      }
    });
  };

  const openAddModal = useCallback(() => {
    setEditingSpread({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: '',
      count: 3,
      positions: ['', '', ''],
      hint: '',
      isCustom: true,
      category: ''
    });
    setIsModalOpen(true);
  }, []);

  const saveSpread = (e: FormEvent) => {
    e.preventDefault();
    if (!editingSpread) return;

    const isNew = !customSpreads.find(s => s.id === editingSpread.id);
    setCustomSpreads(prev => {
      if (editingSpread.id && prev.find(s => s.id === editingSpread.id)) {
        return prev.map(s => s.id === editingSpread.id ? editingSpread : s);
      }
      return [...prev, editingSpread];
    });
    if (isNew) trackEvent('create_custom_spread', { card_count: editingSpread.count });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative z-0">
      <GlobalBackground theme={theme} />

      {/* Shuffle animation overlay — appears on top of everything */}
      <AnimatePresence>
        {isShuffling && <ShuffleOverlay question={question} mode={mode} />}
      </AnimatePresence>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/60 dark:bg-mystic-950/50 backdrop-blur-xl border-b border-white/20 dark:border-mystic-800/50 px-4 py-4 flex justify-between items-center transition-colors duration-500">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <TarotLogoSVG />
          <h1 className="hidden sm:block text-xl sm:text-2xl font-extrabold tracking-tight gold-text drop-shadow-sm font-serif-tc">Tarot Draw</h1>
        </div>
        {/* System selector — two groups: Tarot systems | Lenormand */}
        <div className="flex items-center gap-1">
          {/* Tarot group */}
          <div className="flex items-center bg-stone-100/80 dark:bg-mystic-900/80 rounded-xl p-1 border border-stone-200 dark:border-mystic-800">
            <button
              onClick={() => { setMode('waite'); navigate('/'); setSelectedSpread(null); trackEvent('select_system', { system: 'waite' }); }}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${mode === 'waite'
                ? 'bg-amber-700/70 dark:bg-mystic-600/80 text-white shadow-sm'
                : 'text-stone-500 dark:text-mystic-400 hover:text-stone-700 dark:hover:text-mystic-200'
                }`}
            >
              🔮<span className="text-[10px] sm:text-xs"> {t("偉特", "Waite")}</span>
            </button>
            <button
              onClick={() => { setMode('thoth'); navigate('/'); setSelectedSpread(null); trackEvent('select_system', { system: 'thoth' }); }}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${mode === 'thoth'
                ? 'bg-purple-600 dark:bg-purple-700 text-white shadow-sm'
                : 'text-stone-500 dark:text-mystic-400 hover:text-stone-700 dark:hover:text-mystic-200'
                }`}
            >
              🌌<span className="text-[10px] sm:text-xs"> {t("托特", "Thoth")}</span>
            </button>
          </div>

          {/* Visual separator */}
          <span className="text-stone-300 dark:text-mystic-700 text-base select-none px-0.5">|</span>

          {/* Lenormand — independent system */}
          <div className="flex items-center bg-stone-100/80 dark:bg-mystic-900/80 rounded-xl p-1 border border-stone-200 dark:border-mystic-800">
            <button
              onClick={() => { setMode('lenormand'); navigate('/'); setSelectedSpread(null); trackEvent('select_system', { system: 'lenormand' }); }}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${mode === 'lenormand'
                ? 'bg-teal-700/70 dark:bg-teal-700/70 text-white shadow-sm'
                : 'text-stone-500 dark:text-mystic-400 hover:text-stone-700 dark:hover:text-mystic-200'
                }`}
            >
              🃏<span className="text-[10px] sm:text-xs"> {t("雷諾曼", "Lenormand")}</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language toggle */}
          <button
            onClick={() => {
              const nextLang = lang === 'zh' ? 'en' : 'zh';
              setLang(nextLang);
              localStorage.setItem('tarot_lang', nextLang);
              trackEvent('toggle_lang', { lang: nextLang });
            }}
            className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-mystic-800 hover:bg-stone-300/50 dark:hover:bg-mystic-800/50 transition-colors text-xs font-bold text-stone-600 dark:text-mystic-300 select-none"
          >
            {lang === 'zh' ? '🌐 EN' : '🌐 中文'}
          </button>
          <button
            onClick={() => { setIsHistoryOpen(true); trackEvent('open_history'); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-stone-300/50 dark:hover:bg-mystic-800/50 transition-colors text-sm font-semibold text-stone-700 dark:text-mystic-200"
          >
            <History size={18} /> <span className="hidden sm:inline">{t("歷史紀錄", "History")}</span>
          </button>
          <button
            onClick={() => { toggleTheme(); trackEvent('toggle_theme', { theme: theme === 'light' ? 'dark' : 'light' }); }}
            className="p-2.5 rounded-xl hover:bg-stone-300/50 dark:hover:bg-mystic-800/50 transition-colors text-stone-700 dark:text-mystic-200"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <ScrollToTop />
        <AnimatePresence mode="sync">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="flex flex-col min-h-full gap-12"
              >
                {/* How-to flow */}
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="flex items-center justify-start sm:justify-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-mystic-500 min-w-max mx-auto px-1">
                    {[
                      { n: '1', label: t('選系統', 'System') },
                      { n: '2', label: t('選牌陣', 'Spread') },
                      { n: '3', label: t('輸入問題', 'Question') },
                      { n: '4', label: t('抽牌', 'Draw') },
                      { n: '5', label: t('複製解讀', 'Reading') },
                    ].map(({ n, label }, i, arr) => (
                      <React.Fragment key={n}>
                        <span className="flex items-center gap-1 text-slate-500 dark:text-mystic-500">
                          <span className="w-4 h-4 rounded-full bg-stone-100 dark:bg-mystic-800 text-stone-600 dark:text-mystic-400 flex items-center justify-center text-[9px] font-bold shrink-0">{n}</span>
                          {label}
                        </span>
                        {i < arr.length - 1 && <span className="text-slate-300 dark:text-mystic-700">›</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Lenormand Home — collapsible */}
                {mode === 'lenormand' && (
                  <section>
                    <div
                      className="flex items-center justify-between mb-0 cursor-pointer select-none"
                      onClick={() => setIsBuiltinOpen(v => !v)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🃏</span>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-serif-tc">{t("雷諾曼牌陣", "Lenormand Spreads")}</h2>
                      </div>
                      <span className={`text-stone-400 dark:text-mystic-500 transition-transform duration-300 ${isBuiltinOpen ? 'rotate-180' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                      </span>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isBuiltinOpen ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                      <p className="text-sm text-slate-500 dark:text-mystic-400 mb-6">{t("共 36 張牌・無正逆位・著重具體事件與組合連讀", "36 cards · No reversals · Event and combination oriented")}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mx-auto">
                        {LENORMAND_SPREADS.map((spread) => (
                          <SpreadCard
                            key={spread.id}
                            spread={spread}
                            onSelect={handleLenormandSpreadSelect}
                            t={t}
                            lang={lang}
                          />
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Spreads — tarot / thoth — collapsible */}
                {(mode === 'waite' || mode === 'thoth') && (
                  <section>
                    <div
                      className="flex items-center justify-between mb-0 cursor-pointer select-none"
                      onClick={() => setIsBuiltinOpen(v => !v)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{mode === 'waite' ? '🔮' : '🌌'}</span>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-serif-tc">
                          {mode === 'waite' ? t('偉特牌陣', 'Waite Spreads') : t('托特牌陣', 'Thoth Spreads')}
                        </h2>
                      </div>
                      <span className={`text-stone-400 dark:text-mystic-500 transition-transform duration-300 ${isBuiltinOpen ? 'rotate-180' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                      </span>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isBuiltinOpen ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                      <p className="text-sm text-slate-500 dark:text-mystic-400 mb-6">
                        {mode === 'waite'
                          ? t('共 78 張牌・含正逆位・適合敘事與心理探索', '78 cards · Reversals included · Narrative & psychological focus')
                          : t('共 78 張牌・無逆位・著重能量狀態與深層解析', '78 cards · No reversals · Energy state & deep analytical focus')}
                      </p>
                      <div className="space-y-8">
                        {categorizedSpreads.map(({ label, catSpreads }) => (
                          <div key={label}>
                            <p className="text-xs font-bold text-stone-500 dark:text-mystic-400 uppercase tracking-widest mb-3">{label}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                              {catSpreads.map(spread => (
                                <SpreadCard
                                  key={spread.id}
                                  spread={spread}
                                  onSelect={handleTarotSpreadSelect}
                                  t={t}
                                  lang={lang}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}


                {/* Custom Spreads (Tarot & Thoth) — collapsible */}
                {(mode === 'waite' || mode === 'thoth') && (
                  <section>
                    {/* Toggle header */}
                    <div
                      className="flex items-center justify-between mb-0 cursor-pointer select-none group"
                      onClick={() => setIsCustomOpen(v => !v)}
                    >
                      <div className="flex items-center gap-3">
                        <Edit2 className="text-stone-600 dark:text-mystic-500" size={24} />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-serif-tc">
                          {t("我的牌陣", "My Spreads")}
                          {customSpreads.length > 0 && (
                            <span className="ml-2 text-sm font-semibold text-stone-500 dark:text-mystic-500">{customSpreads.length}</span>
                          )}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); openAddModal(); }}
                          className="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 text-stone-50 dark:text-white rounded-lg transition-colors text-sm font-medium shadow-md dark:shadow-mystic-500/20"
                        >
                          <Plus size={18} /> {t("新增牌陣", "Add Spread")}
                        </button>
                        <span className={`text-stone-400 dark:text-mystic-500 transition-transform duration-300 ${isCustomOpen ? 'rotate-180' : ''}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                        </span>
                      </div>
                    </div>

                    {/* Collapsible content */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCustomOpen ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                      {customSpreads.length > 0 ? (
                        <div className="space-y-6">
                          {Object.entries(
                            customSpreads.reduce<Record<string, typeof customSpreads>>((acc, s) => {
                              const key = s.category?.trim() || t('其他', 'Other');
                              acc[key] = acc[key] ? [...acc[key], s] : [s];
                              return acc;
                            }, {})
                          )
                            .sort(([a], [b]) => a === t('其他', 'Other') ? 1 : b === t('其他', 'Other') ? -1 : a.localeCompare(b, 'zh'))
                            .map(([cat, spreads]) => (
                              <div key={cat}>
                                <p className="text-xs font-bold text-stone-500 dark:text-mystic-400 uppercase tracking-widest mb-3">{cat}</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                                  {spreads.map((spread) => (
                                    <SpreadCard
                                      key={spread.id}
                                      spread={spread}
                                      isCustom
                                      onSelect={handleCustomSpreadSelect}
                                      onEdit={handleSpreadEdit}
                                      onDelete={handleSpreadDelete}
                                      t={t}
                                      lang={lang}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      ) : (
                        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-mystic-800 rounded-xl text-slate-500 dark:text-mystic-400">
                          <p>{t("尚未建立自訂牌陣", "No custom spreads created yet")}</p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Donation + Legal footer */}
                <div className="mt-auto pt-8 pb-2 border-t border-stone-200/60 dark:border-mystic-800/40 flex flex-col items-center gap-3">
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
                </div>
              </motion.div>
            } />

            <Route path="/draw" element={selectedSpread ? (
                <motion.div
                  key="draw"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="max-w-2xl mx-auto space-y-8"
                >
                  <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-mystic-600 dark:hover:text-mystic-400 transition-colors"
                  >
                    <ArrowLeft size={18} /> {t("返回首頁", "Back to Home")}
                  </button>

                  <div className="bg-white dark:bg-mystic-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-mystic-800">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-mystic-700 to-indigo-500 bg-clip-text text-transparent dark:from-mystic-200 dark:to-indigo-300 drop-shadow-sm">{translatedSelectedSpread.name}</h2>
                      <p className="text-slate-500 dark:text-mystic-400">{translatedSelectedSpread.hint}</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-mystic-300">
                          {t("你想問的問題？", "What is your question?")}
                        </label>
                        <textarea
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder={selectedSpread.exampleQuestion ? `${t("例如：", "e.g. ")} ${t(selectedSpread.exampleQuestion, SPREAD_TRANSLATIONS[selectedSpread.id]?.exampleQuestion ?? selectedSpread.exampleQuestion)}` : t("請輸入你的困惑或想了解的事情...", "Please enter your confusion or what you want to know...")}
                          className="w-full h-32 px-4 py-3 rounded-xl border border-amber-200 dark:border-mystic-800 bg-white/80 dark:bg-mystic-950 focus:ring-2 focus:ring-amber-400 dark:focus:ring-mystic-500 outline-none transition-all resize-none shadow-inner"
                        />
                        {question.trim().length > 0 && question.trim().length < 10 && (
                          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                            <span className="text-base">💡</span>
                            {t("問題越具體，AI 解讀越準確——試著加上時間、情境或對象", "The more specific the question, the more accurate the AI interpretation. Try adding time, context, or subjects.")}
                          </p>
                        )}
                      </div>

                      {selectedSpread.id === 'len-36' && mode === 'lenormand' && (
                        <div className="border border-stone-200 dark:border-mystic-800 rounded-xl p-4 bg-stone-50/50 dark:bg-mystic-950/40">
                          <details className="group">
                            <summary className="flex items-center justify-between cursor-pointer select-none text-xs font-bold text-stone-600 dark:text-mystic-300 uppercase tracking-widest list-none">
                              <span className="flex items-center gap-1.5 select-none">
                                {t("🔮 大展開設定 (展開可自訂角色/主題)", "🔮 Grand Tableau Settings (Click to Customize)")}
                              </span>
                              <span className="text-stone-400 group-open:rotate-180 transition-transform duration-200 select-none">
                                ▼
                              </span>
                            </summary>
                            <div className="mt-4 space-y-4 text-sm border-t border-stone-200/50 dark:border-mystic-800/50 pt-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <span className="font-bold text-xs text-stone-500 dark:text-mystic-400">{t("問事者代表牌 (Querent)", "Querent Card")}</span>
                                <div className="flex gap-1.5">
                                  {[
                                    { label: t('👩 女人 (#29)', '👩 Lady (#29)'), value: 'woman' },
                                    { label: t('👨 男人 (#28)', '👨 Gentleman (#28)'), value: 'man' }
                                  ].map(opt => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => setGtQuerent(opt.value as any)}
                                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all select-none ${
                                        gtQuerent === opt.value
                                          ? 'border-teal-500 bg-teal-50/30 text-teal-700 dark:text-teal-400'
                                          : 'border-stone-200 dark:border-mystic-800 hover:bg-stone-50 dark:hover:bg-mystic-900/50 text-stone-600 dark:text-mystic-300'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <span className="font-bold text-xs text-stone-500 dark:text-mystic-400">{t("對象/伴侶代表 (Partner)", "Partner Card")}</span>
                                <div className="flex gap-1.5">
                                  {[
                                    { label: t('異性/對立能量', 'Opposite/Dual Energy'), value: 'opposite' },
                                    { label: t('同性 (以 #18 狗代表)', 'Same-sex (Dog #18)'), value: 'same' },
                                    { label: t('無對象', 'No Partner'), value: 'none' }
                                  ].map(opt => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => setGtPartner(opt.value as any)}
                                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all select-none ${
                                        gtPartner === opt.value
                                          ? 'border-teal-500 bg-teal-50/30 text-teal-700 dark:text-teal-400'
                                          : 'border-stone-200 dark:border-mystic-800 hover:bg-stone-50 dark:hover:bg-mystic-900/50 text-stone-600 dark:text-mystic-300'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <span className="font-bold text-xs text-stone-500 dark:text-mystic-400">{t("占卜主題與指示牌 (Theme)", "Reading Theme / Significator")}</span>
                                <div className="flex gap-1.5 flex-wrap justify-end">
                                  {[
                                    { label: t('綜合運勢', 'General Fortune'), value: 'general' },
                                    { label: t('💞 感情 (#24 心)', '💞 Love (Heart #24)'), value: 'love' },
                                    { label: t('💼 事業 (#35 錨)', '💼 Career (Anchor #35)'), value: 'career' },
                                    { label: t('💰 財運 (#34 魚)', '💰 Wealth (Fish #34)'), value: 'money' },
                                    { label: t('🌲 健康 (#5 樹)', '🌲 Health (Tree #5)'), value: 'health' }
                                  ].map(opt => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => setGtTheme(opt.value as any)}
                                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all select-none ${
                                        gtTheme === opt.value
                                          ? 'border-teal-500 bg-teal-50/30 text-teal-700 dark:text-teal-400'
                                          : 'border-stone-200 dark:border-mystic-800 hover:bg-stone-50 dark:hover:bg-mystic-900/50 text-stone-600 dark:text-mystic-300'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </details>
                        </div>
                      )}

                      {/* Draw Mode Toggle */}
                      <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-mystic-700 p-0.5 gap-0.5 bg-slate-100/70 dark:bg-mystic-800/50">
                        <button
                          onClick={() => setDrawInputMode('random')}
                          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${drawInputMode === 'random'
                            ? 'bg-white dark:bg-mystic-700 text-stone-800 dark:text-white shadow'
                            : 'text-slate-400 dark:text-mystic-500'
                            }`}
                        >
                          {t("🎴 隨機抽牌", "🎴 Random Draw")}
                        </button>
                        <button
                          onClick={() => setDrawInputMode('manual')}
                          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${drawInputMode === 'manual'
                            ? 'bg-white dark:bg-mystic-700 text-stone-800 dark:text-white shadow'
                            : 'text-slate-400 dark:text-mystic-500'
                            }`}
                        >
                          {t("✍️ 手動輸入", "✍️ Manual Input")}
                        </button>
                      </div>

                    {drawInputMode === 'random' ? (
                      <>
                        <button
                          onClick={handleDraw}
                          className="w-full py-4 bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 dark:hover:from-mystic-500 dark:hover:to-mystic-400 text-stone-50 dark:text-white rounded-lg font-bold text-lg shadow-lg shadow-stone-800/20 dark:shadow-mystic-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Compass size={20} /> {t('開始抽牌', 'Draw Cards')}
                        </button>
                        <p className="text-center text-[11px] text-slate-400 dark:text-mystic-600">
                          {t('✨ 抽牌後可一鍵複製 AI 解讀 Prompt，貼入 ChatGPT・Claude・Gemini 獲得深度解讀', '✨ After drawing, copy the AI prompt with one click and paste into ChatGPT · Claude · Gemini for deep interpretation')}
                        </p>
                      </>
                    ) : (() => {
                      const deck = mode === 'lenormand'
                        ? LENORMAND_CARDS
                        : mode === 'thoth' ? THOTH_ALL_CARDS : ALL_CARDS;
                      return (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-400 dark:text-mystic-500 text-center">
                            搜尋你實體抽到的牌名{mode === 'waite' ? '，按「逆」切換逆位' : ''}
                          </p>
                          <div className="space-y-2 w-fit mx-auto">
                            {selectedSpread.positions.map((pos, i) => {
                              const query = manualInputs[i]?.name || '';
                              const isExactMatch = deck.some(c => c.nameCN === query);
                              const matches = query.length > 0 && !isExactMatch
                                ? deck.filter(c =>
                                  c.nameCN.includes(query) ||
                                  c.nameEN.toLowerCase().includes(query.toLowerCase())
                                ).slice(0, 8)
                                : [];
                              return (
                                <div key={i} className="flex items-start gap-2 max-w-sm">
                                  <span className="mt-2.5 text-xs font-bold text-amber-600 dark:text-mystic-400 w-5 flex-shrink-0 text-right">{i + 1}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-slate-400 dark:text-mystic-600 mb-0.5 truncate">{pos}</p>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={query}
                                        onChange={e => setManualInputs(prev => {
                                          const next = [...prev];
                                          next[i] = { ...(next[i] || { name: '', reversed: false }), name: e.target.value };
                                          return next;
                                        })}
                                        placeholder="輸入牌名搜尋…"
                                        autoComplete="off"
                                        className={`w-full px-2.5 py-1.5 rounded-lg border border-amber-200/70 dark:border-mystic-700 bg-white/80 dark:bg-mystic-950 text-sm outline-none focus:ring-1 focus:ring-amber-400 dark:focus:ring-mystic-500 transition-all ${mode === 'waite' ? 'pr-10' : ''}`}
                                      />
                                      {mode === 'waite' && (
                                        <button
                                          onClick={() => setManualInputs(prev => {
                                            const next = [...prev];
                                            next[i] = { ...(next[i] || { name: '', reversed: false }), reversed: !next[i]?.reversed };
                                            return next;
                                          })}
                                          className={`absolute right-1 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded border transition-all ${manualInputs[i]?.reversed
                                            ? 'border-purple-500/70 dark:border-purple-500/60 text-purple-700 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-900/40 font-semibold'
                                            : 'border-stone-400/40 dark:border-mystic-600/50 text-stone-400 dark:text-mystic-500 bg-transparent hover:bg-stone-100/50 dark:hover:bg-mystic-700/50'
                                            }`}
                                        >
                                          逆
                                        </button>
                                      )}
                                      {matches.length > 0 && (
                                        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-mystic-900 border border-stone-200 dark:border-mystic-700 rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                                          {matches.map(card => (
                                            <button
                                              key={card.id}
                                              type="button"
                                              onPointerDown={e => {
                                                e.preventDefault();
                                                setManualInputs(prev => {
                                                  const next = [...prev];
                                                  next[i] = { ...(next[i] || { name: '', reversed: false }), name: card.nameCN };
                                                  return next;
                                                });
                                              }}
                                              className="w-full text-left px-3 py-2 text-sm hover:bg-stone-100 dark:hover:bg-mystic-800 transition-colors flex items-center justify-between gap-2"
                                            >
                                              <span className="font-medium text-stone-800 dark:text-mystic-100">{card.nameCN}</span>
                                              <span className="text-xs text-stone-400 dark:text-mystic-500 shrink-0">{card.nameEN}</span>
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <button
                            onClick={handleManualSubmit}
                            className="w-full py-4 bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 dark:hover:from-mystic-500 dark:hover:to-mystic-400 text-stone-50 dark:text-white rounded-lg font-bold text-lg shadow-lg shadow-stone-800/20 dark:shadow-mystic-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={20} /> {t("確認輸入", "Confirm Input")}
                          </button>
                        </div>
                      );
                    })()}

                    {selectedSpread.id === 'choice' && (
                      <div className="bg-indigo-50/50 dark:bg-mystic-800/30 p-4 rounded-xl border border-indigo-100 dark:border-mystic-700/50">
                        <label className="text-sm font-bold text-indigo-900 dark:text-mystic-200 block mb-3">
                          {t("這題有幾個選項需要比較？（目前：", "How many options to compare? (Current: ")}{choiceCount}{t(" 個）", " options)")}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <button
                              key={num}
                              onClick={() => setChoiceCount(num)}
                              className={`w-[42px] h-[42px] sm:w-11 sm:h-11 rounded-full font-bold text-sm sm:text-base flex items-center justify-center transition-all duration-300 ${choiceCount === num
                                ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-500/30 scale-105 ring-2 ring-indigo-300 dark:ring-indigo-700 ring-offset-1 dark:ring-offset-mystic-900'
                                : 'bg-white/80 dark:bg-mystic-900 shadow-sm text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-mystic-600 hover:bg-indigo-100 dark:hover:bg-mystic-800'
                                }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-indigo-700/80 dark:text-mystic-400 mt-4 leading-relaxed">
                          {t("直接點擊數字切換。每多一個選擇，系統就會對應多抽出「發展」與「結果」2 張牌喔。", "Click numbers to change. Each option adds 2 cards (Development & Outcome) to the draw.")}
                        </p>
                      </div>
                    )}

                    {(selectedSpread.id === 'mirror' || selectedSpread.id === 'energy-resonance' || selectedSpread.id === 'mirror-mirror') && (
                      <div className="bg-teal-50/50 dark:bg-teal-950/20 p-4 rounded-xl border border-teal-200/50 dark:border-teal-800/30">
                        <label className="text-sm font-bold text-teal-900 dark:text-teal-300 block mb-3">
                          {t("這段關係牽涉多少人？（包含你，目前：", "How many people in this relationship? (Including you, current: ")}{peopleCount}{t(" 人）", " people)")}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[2, 3, 4, 5, 6].map(num => (
                            <button
                              key={num}
                              onClick={() => setPeopleCount(num)}
                              className={`w-[42px] h-[42px] sm:w-11 sm:h-11 rounded-full font-bold text-sm sm:text-base flex items-center justify-center transition-all duration-300 ${peopleCount === num
                                ? 'bg-teal-600/80 dark:bg-teal-600/80 text-white shadow-md shadow-teal-500/20 scale-105 ring-2 ring-teal-300/50 dark:ring-teal-700 ring-offset-1 dark:ring-offset-mystic-900'
                                : 'bg-white/80 dark:bg-mystic-900 shadow-sm text-teal-700 dark:text-teal-400 border border-teal-200/50 dark:border-mystic-600 hover:bg-teal-50 dark:hover:bg-mystic-800'
                                }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-teal-700/80 dark:text-teal-400 mt-4 leading-relaxed">
                          {t("最高支援 6 人局。系統將為每一位「對象」配置專屬的心態牌，協助你跳脫框架看清全局。", "Supports up to 6 people. The system assigns a mindset card for each person to help clarify the situation.")}
                        </p>
                      </div>
                    )}

                    <div className="bg-mystic-50/80 dark:bg-mystic-800/50 p-4 sm:px-5 rounded-2xl border border-mystic-200/50 dark:border-mystic-700/30 flex items-start gap-3">
                      <Info className="text-mystic-500/80 dark:text-mystic-400 mt-0.5 flex-shrink-0" size={18} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-mystic-900 dark:text-mystic-100 mb-2 tracking-wide">{t("牌陣資訊", "Spread Info")}</p>
                        <p className="text-xs text-mystic-700/70 dark:text-mystic-500 mb-2">{t(`將抽取 ${translatedSelectedSpread.count} 張牌，位置如下：`, `Will draw ${translatedSelectedSpread.count} cards in these positions:`)}</p>
                        {/* Scrollable pill row with fade mask */}
                        <div className="relative">
                          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {translatedSelectedSpread.positions.map((pos, i) => (
                              <span
                                key={i}
                                className="shrink-0 text-[11px] font-semibold text-mystic-800 dark:text-mystic-300 bg-mystic-100/80 dark:bg-mystic-700/60 border border-mystic-200/50 dark:border-mystic-600 px-2.5 py-1 rounded-full whitespace-nowrap"
                              >
                                <span className="text-mystic-500 dark:text-mystic-500 mr-1">{i + 1}.</span>{pos}
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
                        <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1.5 tracking-wide">{mode === 'lenormand' ? t('雷諾曼小知識', 'Lenormand Trivia') : mode === 'thoth' ? t('托特小知識', 'Thoth Trivia') : t('塔羅小知識', 'Tarot Trivia')}</p>
                        <p className="text-sm text-indigo-800/80 dark:text-indigo-200/70 leading-relaxed italic">
                          {currentTrivia}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : <Navigate to="/" replace />} />

            <Route path="/result" element={
              <ResultGuard hasData={!!(selectedSpread && (drawnCards.length > 0 || lenormandDrawnCards.length > 0))}>
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8 pb-24"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        {mode === 'lenormand' && <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-400/25 dark:bg-teal-400/20 px-2 py-0.5 rounded-full border border-teal-500/50 dark:border-teal-400/30 mb-1 inline-block">{t("雷諾曼", "Lenormand")}</span>}
                        {mode === 'thoth' && <span className="text-xs font-bold text-mystic-700 dark:text-mystic-300 bg-mystic-400/25 dark:bg-mystic-400/20 px-2 py-0.5 rounded-full border border-mystic-500/50 dark:border-mystic-400/30 mb-1 inline-block">{t("托特塔羅", "Thoth Tarot")}</span>}
                        {mode === 'tarot' && <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-400/25 dark:bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-500/50 dark:border-amber-400/30 mb-1 inline-block">{t("偉特塔羅", "Waite Tarot")}</span>}
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-mystic-700 to-indigo-500 bg-clip-text text-transparent dark:from-mystic-200 dark:to-indigo-300 drop-shadow-sm font-serif-tc">{translatedSelectedSpread?.name}</h2>
                        <p className="text-slate-500 dark:text-mystic-400">{t("問題：", "Question: ")}{question.trim() || t('探索當下整體狀態', 'Exploring Current Situation')}</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            flushSync(() => {
                              setCurrentHistoryId(null);
                              setDrawnCards([]);
                              setLenormandDrawnCards([]);
                            });
                            trackEvent('redraw', { spread_name: selectedSpread?.name ?? '', system: mode });
                            navigate('/draw');
                          }}
                          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-mystic-800 hover:bg-slate-50 dark:hover:bg-mystic-900 transition-colors text-sm font-medium"
                        >
                          {t("重新抽牌", "Draw Again")}
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

                            // Lenormand has no reversals; effectiveScore == baseScore
                            const { label, theme, bg } = oracleUI(oracle.score, lang);

                            return (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.25, ease: 'easeOut', delay: 0.15 }}
                                className={`w-full px-6 py-4 rounded-2xl border-2 ${bg} shadow-lg flex flex-col items-center gap-2 transition-all backdrop-blur-sm`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`text-[10px] sm:text-xs font-black ${theme} opacity-70 uppercase tracking-[0.2em]`}>{t("神諭指引", "Oracle Guide")}</span>
                                  <span className={`text-xl sm:text-2xl font-black ${theme} tracking-tight`}>{label}</span>
                                </div>
                                <p className={`text-xs sm:text-sm font-bold ${theme} opacity-90`}>{lang === 'en' ? (ORACLE_TRANSLATIONS[oracle.message] ?? oracle.message) : oracle.message}</p>
                              </motion.div>
                            );
                          })()}
                        </div>
                      )}
                      {(lenormandDrawnCards.length === 3 || lenormandDrawnCards.length === 5) ? (
                        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-center gap-1 sm:gap-2 w-full max-w-3xl mx-auto overflow-x-auto py-2">
                          {lenormandDrawnCards.map((card, index) => (
                            <React.Fragment key={index}>
                              <LenormandCardDisplay card={card} index={index} isCenter={false} lang={lang} spreadId={selectedSpread?.id} />
                              {index < lenormandDrawnCards.length - 1 && (
                                <span className="flex-shrink-0 text-stone-400 dark:text-stone-600 text-xl sm:text-2xl font-bold leading-none select-none">→</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      ) : lenormandDrawnCards.length === 36 ? (
                        <div className="relative z-10 w-full overflow-x-auto pb-2">
                          <div className="flex flex-col gap-2 mx-auto" style={{ minWidth: '580px', maxWidth: '920px' }}>
                            {[
                              { label: t('第一行 (位置 1–9)', 'Row 1 (Pos 1–9)'), color: 'text-stone-700 dark:text-stone-300', bg: 'bg-stone-100/50 dark:bg-mystic-900/40' },
                              { label: t('第二行 (位置 10–18)', 'Row 2 (Pos 10–18)'), color: 'text-stone-700 dark:text-stone-300', bg: 'bg-stone-100/50 dark:bg-mystic-900/40' },
                              { label: t('第三行 (位置 19–27)', 'Row 3 (Pos 19–27)'), color: 'text-stone-700 dark:text-stone-300', bg: 'bg-stone-100/50 dark:bg-mystic-900/40' },
                              { label: t('第四行 (位置 28–36)', 'Row 4 (Pos 28–36)'), color: 'text-stone-700 dark:text-stone-300', bg: 'bg-stone-100/50 dark:bg-mystic-900/40' },
                            ].map((row, rowIdx) => (
                              <div key={rowIdx} className={`rounded-xl px-2 pt-1 pb-2 ${row.bg}`}>
                                <div className={`text-[10px] font-bold mb-1.5 flex items-center gap-2 ${row.color}`}>
                                  <span className="uppercase tracking-widest">{row.label}</span>
                                </div>
                                <div className="grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns: 'repeat(9, minmax(0, 1fr))' }}>
                                  {lenormandDrawnCards.slice(rowIdx * 9, rowIdx * 9 + 9).map((card, colIdx) => {
                                    const globalIdx = rowIdx * 9 + colIdx;
                                    return (
                                      <LenormandCardDisplay
                                        key={card.id}
                                        card={card}
                                        index={globalIdx}
                                        isCenter={false}
                                        isCompact={true}
                                        isSpine={colIdx === 4}
                                        lang={lang}
                                        spreadId={selectedSpread?.id}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                            <p className="text-center text-[10px] text-stone-400 dark:text-stone-500 mt-1">
                              {t("✦ 金色邊框為中軸脊骨宮位（第 5、14、23、32 宮），是各行主題的核心", "✦ Gold border highlights the spine houses (5, 14, 23, 32), which form the core axis of each row")}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className={`relative z-10 grid gap-3 sm:gap-5 justify-center w-full max-w-3xl mx-auto ${lenormandDrawnCards.length === 9 ? 'grid-cols-3' :
                          lenormandDrawnCards.length === 1 ? 'grid-cols-1' :
                            lenormandDrawnCards.length === 4 ? 'grid-cols-2' :
                              lenormandDrawnCards.length === 6 ? 'grid-cols-3' :
                                lenormandDrawnCards.length === 7 ? 'grid-cols-4' :
                                  lenormandDrawnCards.length === 10 ? 'grid-cols-3 sm:grid-cols-5' :
                                    'grid-cols-3 sm:grid-cols-4'
                          }`}>
                          {lenormandDrawnCards.map((card, index) => (
                            <LenormandCardDisplay key={card.id} card={card} index={index} isCenter={lenormandDrawnCards.length === 9 && index === 4} lang={lang} spreadId={selectedSpread?.id} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tarot Tablecloth Layout */}
                  {(mode === 'waite' || mode === 'thoth') && (
                    <div className="relative bg-white/40 dark:bg-mystic-950 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl shadow-amber-900/5 dark:shadow-mystic-900/50 border-4 border-amber-100/50 dark:border-mystic-800/30 overflow-hidden backdrop-blur-sm">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-50/40 via-white/40 to-amber-100/30 dark:from-mystic-800/20 dark:via-mystic-900/80 dark:to-mystic-950 pointer-events-none"></div>

                      <div className="relative z-10 w-full max-w-6xl mx-auto">
                        <TarotSpreadLayout spread={selectedSpread} cards={mainCards} mode={mode === 'thoth' ? 'thoth' : 'waite'} lang={lang} />
                      </div>

                      {hasExtraCards && (
                        <div className="relative z-10 mt-16 pt-16 border-t border-amber-200/50 dark:border-mystic-800/50">
                          <h3 className="text-center text-xl font-bold gold-text mb-8 tracking-widest">{t("✨ 補充指引", "✨ Follow-up Guidance")}</h3>
                          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
                            {extraCards.map((card, index) => (
                              <div key={index} className="flex flex-col items-center gap-4">
                                <div className="text-amber-800 dark:text-mystic-300 text-[13px] sm:text-sm font-medium text-center bg-white/80 dark:bg-mystic-900/80 px-4 py-2.5 rounded-xl border border-amber-200 dark:border-mystic-800 shadow-lg max-w-[160px] sm:max-w-[200px]">
                                  <span className="text-amber-500 dark:text-mystic-500 mr-1">Q:</span>{card.extraQuestion}
                                </div>
                                <TarotCardDisplay card={card} index={index} isExtra={true} system={mode === 'thoth' ? 'thoth' : 'waite'} lang={lang} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="relative z-10 mt-16 flex flex-col items-center justify-center w-full">
                        <div className="flex flex-col items-center gap-4 bg-white/60 dark:bg-mystic-900/60 p-6 sm:p-8 rounded-[2rem] border border-amber-200/50 dark:border-mystic-800 w-full max-w-md backdrop-blur shadow-xl dark:shadow-2xl">
                          <div className="text-center mb-1">
                            <h4 className="font-bold text-lg text-amber-800 dark:text-mystic-300">{t("追加牌卡指引", "Ask Follow-up Questions")}</h4>
                            <p className="text-xs text-amber-600 dark:text-mystic-500 mt-1">{t("若對上述結果有不懂之處，請在此發問", "If you have questions about the reading, ask here")}</p>
                          </div>
                          <input
                            type="text"
                            value={extraQuestion}
                            onChange={(e) => setExtraQuestion(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') drawExtraCard(); }}
                            placeholder={t("請輸入補抽想深入了解的事...", "What would you like to clarify or explore deeper?")}
                            className="w-full px-5 py-3.5 rounded-xl border border-amber-200 dark:border-mystic-700 bg-white/70 dark:bg-mystic-950/80 focus:ring-2 focus:ring-amber-400 dark:focus:ring-mystic-500 outline-none text-slate-800 dark:text-white text-center text-sm shadow-inner transition-colors"
                          />
                          <button
                            onClick={drawExtraCard}
                            className="w-full py-3 mt-1 bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 dark:hover:from-mystic-500 dark:hover:to-mystic-400 text-stone-50 dark:text-white rounded-xl font-bold shadow-lg shadow-stone-800/10 dark:shadow-mystic-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Sparkles size={18} /> {t("補抽一張", "Draw Follow-up Card")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Card — tarot/thoth only */}
                  {(mode === 'waite' || mode === 'thoth') && bottomCard && (
                    <div className="relative bg-white/40 dark:bg-mystic-950 rounded-[2rem] p-6 sm:p-8 shadow-xl border-2 border-dashed border-amber-200/60 dark:border-mystic-700/40 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-center">
                          <p className="text-xs font-bold text-amber-700 dark:text-mystic-400 uppercase tracking-widest">{t("底牌", "Bottom Card")}</p>
                          <p className="text-[11px] text-slate-500 dark:text-mystic-500 mt-0.5">{t("牌堆最底的一張，反映潛藏的動機或心理狀態", "The card at the bottom of the deck, reflecting underlying motivations or states")}</p>
                        </div>
                        <TarotCardDisplay card={bottomCard} index={0} isExtra={true} system={mode === 'thoth' ? 'thoth' : 'waite'} lang={lang} />
                      </div>
                    </div>
                  )}

                  <div className="bg-white/80 dark:bg-mystic-900 p-6 rounded-2xl border border-amber-100 dark:border-mystic-800 text-center shadow-sm">
                    <p className="text-amber-800 dark:text-mystic-300 italic font-medium">
                      {mode === 'lenormand'
                        ? t('「雷諾曼牌訴說的是日常的故事，而你才是故事的主角。」', '“Lenormand cards tell stories of daily life, but you are the protagonist.”')
                        : mode === 'thoth'
                          ? t('「能量沒有好壞，只有是否被意識到。」', '“Energy is neither good nor bad, it only awaits awareness.”')
                          : t('「牌卡只是指引，真正的答案在你的內心。」', '“The cards are only guides, the true answer lies in your heart.”')}
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
                          ✅ {t("已複製", "Copied")} {showCopySuccess === 'all' ? t('全部結果', 'all results') : showCopySuccess === 'main' ? t('主牌陣', 'main spread') : t('補抽指引', 'follow-up cards')} {t("到剪貼簿", "to clipboard")}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {hasExtraCards ? (
                        <>
                          <button
                            onClick={() => copyToClipboard('all')}
                            className="px-5 py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 hover:dark:from-mystic-500 hover:dark:to-mystic-400 text-stone-50 dark:text-white shadow-lg shadow-stone-800/10 dark:shadow-mystic-500/20 transition-all hover:-translate-y-1 active:scale-95 font-bold flex items-center gap-2 text-sm"
                          >
                            <Copy size={16} /> {t("複製全部", "Copy All")}
                          </button>
                          <button
                            onClick={() => copyToClipboard('main')}
                            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-mystic-800 dark:hover:bg-mystic-700 text-amber-700 dark:text-mystic-300 border border-amber-200 dark:border-mystic-700 transition-all hover:-translate-y-1 active:scale-95 font-bold flex items-center gap-2 text-sm"
                          >
                            <Copy size={14} /> {t("僅主牌陣", "Main Only")}
                          </button>
                          <button
                            onClick={() => copyToClipboard('extra')}
                            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-mystic-800 dark:hover:bg-mystic-700 text-amber-700 dark:text-mystic-300 border border-amber-200 dark:border-mystic-700 transition-all hover:-translate-y-1 active:scale-95 font-bold flex items-center gap-2 text-sm"
                          >
                            <Copy size={14} /> {t("僅補抽", "Follow-up Only")}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => copyToClipboard('all')}
                          className="px-8 py-3 rounded-xl bg-stone-700 hover:bg-stone-600 dark:bg-gradient-to-r dark:from-mystic-600 dark:to-mystic-500 dark:hover:from-mystic-500 dark:hover:to-mystic-400 text-stone-50 dark:text-white shadow-lg shadow-stone-800/10 dark:shadow-mystic-500/20 transition-all hover:-translate-y-1 active:scale-95 font-bold flex items-center gap-2"
                        >
                          <Copy size={18} /> {t("複製 AI 解讀 Prompt", "Copy AI Prompt")}
                        </button>
                      )}
                    </div>

                    {/* Share card download */}
                    <div className="flex justify-center mt-1">
                      <button
                        onClick={() => {
                          const cardList: ShareCardCard[] = (mode === 'lenormand'
                            ? lenormandDrawnCards.map(c => ({ nameCN: c.nameCN, nameEN: c.nameEN, isReversed: false, positionName: c.positionName, emoji: c.emoji }))
                            : drawnCards.filter(c => !c.extraQuestion).map(c => ({ nameCN: c.nameCN, nameEN: c.nameEN, isReversed: c.isReversed, positionName: c.positionName }))
                          );
                          downloadShareCard({ spreadName: selectedSpread?.name ?? '', question, cards: cardList, mode });
                          trackEvent('download_share_image', { spread_name: selectedSpread?.name ?? '', system: mode });
                        }}
                        className="px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all hover:-translate-y-1 active:scale-95 font-bold flex items-center gap-2 text-sm"
                      >
                        {t("🖼 儲存分享圖", "🖼 Save Share Image")}
                      </button>
                    </div>

                    {/* AI Quick-open shortcuts */}
                    {showCopySuccess && (
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="text-xs text-slate-500 dark:text-mystic-500 font-medium">{t('貼入 AI 開始解讀 →', 'Paste into AI to interpret →')}</span>
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
              </ResultGuard>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* History Sidebar */}
      <AnimatePresence>
        {isHistoryOpen && (() => {
          const toggleSelectMode = () => {
            setHistorySelectMode(prev => !prev);
            setSelectedHistoryIds(new Set());
            setShowBatchDeleteConfirm(false);
          };

          const toggleRecord = (id: string) => {
            setSelectedHistoryIds(prev => {
              const next = new Set(prev);
              next.has(id) ? next.delete(id) : next.add(id);
              return next;
            });
          };

          const toggleSelectAll = () => {
            if (allFilteredSelected) {
              setSelectedHistoryIds(new Set());
            } else {
              setSelectedHistoryIds(new Set(filteredHistory.map(r => r.id)));
            }
          };

          const executeBatchDelete = () => {
            const toDelete = selectedHistoryIds;
            setHistory(prev => prev.filter(h => !toDelete.has(h.id)));
            if (currentHistoryId && toDelete.has(currentHistoryId)) {
              setCurrentHistoryId(null);
              setDrawnCards([]);
              navigate('/');
            }
            setSelectedHistoryIds(new Set());
            setHistorySelectMode(false);
            setShowBatchDeleteConfirm(false);
             showToast(t(`已刪除 ${toDelete.size} 筆紀錄`, `Deleted ${toDelete.size} records`));
           };
 
           const FILTER_TABS: { key: typeof historyFilter; label: string }[] = [
             { key: 'all', label: t('全部', 'All') },
             { key: 'week', label: t('本週', 'This Week') },
             { key: 'month', label: t('本月', 'This Month') },
             { key: 'older', label: t('更早', 'Older') },
           ];
 
           return (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.18, ease: 'easeIn' }}
               className="fixed inset-0 z-[100] flex justify-end bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm"
               onClick={() => { setIsHistoryOpen(false); setHistorySelectMode(false); setSelectedHistoryIds(new Set()); }}
             >
               <motion.div
                 variants={{
                   hidden: { x: '100%' },
                   visible: { x: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
                   exit: { x: '100%', transition: { duration: 0.18, ease: [0.36, 0.66, 0.04, 1] } },
                 }}
                 initial="hidden"
                 animate="visible"
                 exit="exit"
                 className="w-full max-w-sm sm:max-w-md lg:w-[40vw] lg:max-w-2xl h-full bg-[#f7f3e8]/95 dark:bg-mystic-950/95 backdrop-blur-2xl shadow-[-20px_0_40px_rgba(68,64,60,0.05)] dark:shadow-[-20px_0_40px_rgba(0,0,0,0.3)] border-l border-stone-200 dark:border-mystic-800/80 flex flex-col"
                 onClick={(e) => e.stopPropagation()}
               >
                 {/* Header */}
                 <div className="px-6 lg:px-8 py-5 border-b border-stone-200 dark:border-mystic-800/50 flex items-center justify-between bg-[#f0ead6]/80 dark:bg-mystic-900/50 shrink-0">
                   <h2 className="text-xl font-bold flex items-center gap-2">
                     <History size={20} className="text-stone-600 dark:text-mystic-500" /> {t("歷史紀錄", "History")}
                   </h2>
                   <div className="flex items-center gap-2">
 
                     {history.some(r => !r.question.trim()) && !historySelectMode && (
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           setHistory(prev => prev.filter(r => r.question.trim() !== ''));
                         }}
                         className="p-2 text-slate-400 hover:text-amber-600 transition-colors flex items-center gap-1 text-sm font-medium bg-slate-100/50 hover:bg-amber-50 dark:bg-mystic-800/50 dark:hover:bg-amber-900/20 rounded-lg px-3"
                         title={t("清除未輸入問題的紀錄", "Clear records with no question input")}
                       >
                         <Trash2 size={16} />
                         <span className="hidden sm:inline">{t("清空未填", "Clear Blank")}</span>
                       </button>
                     )}
                     {history.length > 0 && (
                       <button
                         onClick={toggleSelectMode}
                         className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${historySelectMode
                             ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200'
                             : 'bg-slate-100/50 dark:bg-mystic-800/50 text-slate-600 dark:text-mystic-300 hover:bg-slate-200 dark:hover:bg-mystic-700'
                           }`}
                       >
                         {historySelectMode ? t('取消', 'Cancel') : t('管理', 'Manage')}
                       </button>
                     )}
                    <button onClick={() => { setIsHistoryOpen(false); setHistorySelectMode(false); setSelectedHistoryIds(new Set()); }} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-1">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Filter tabs */}
                <div className="px-4 lg:px-8 pt-3 pb-0 shrink-0 flex gap-1">
                  {FILTER_TABS.map(({ key, label }) => {
                    const count = historyTabCounts[key];
                    return (
                      <button
                        key={key}
                        onClick={() => { setHistoryFilter(key); setSelectedHistoryIds(new Set()); }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${historyFilter === key
                            ? 'bg-amber-100 dark:bg-mystic-700 text-amber-700 dark:text-mystic-200 shadow-sm'
                            : 'text-slate-500 dark:text-mystic-500 hover:bg-stone-100 dark:hover:bg-mystic-800/60'
                          }`}
                      >
                        {label}
                        {count > 0 && <span className="opacity-60 text-[10px]">({count})</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Select-all row (only in manage mode) */}
                {historySelectMode && filteredHistory.length > 0 && (
                  <div className="px-4 lg:px-8 py-2 shrink-0 flex items-center gap-3 border-b border-stone-200/60 dark:border-mystic-800/40">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                      id="select-all-history"
                    />
                    <label htmlFor="select-all-history" className="text-sm font-semibold text-slate-600 dark:text-mystic-300 cursor-pointer select-none">
                      {t("全選（", "Select All (")}{filteredHistory.length}{t(" 筆）", " items)")}
                    </label>
                    <button
                      onClick={() => {
                        const noQuestionIds = filteredHistory
                          .filter(r => !r.question?.trim() || r.question.trim() === t('探索當下整體狀態', 'Exploring Current Situation'))
                          .map(r => r.id);
                        setSelectedHistoryIds(prev => new Set([...prev, ...noQuestionIds]));
                      }}
                      className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-lg border border-stone-300/60 dark:border-mystic-700 text-slate-500 dark:text-mystic-400 hover:bg-stone-100 dark:hover:bg-mystic-800 transition-colors select-none"
                    >
                      {t("選取未提問的紀錄", "Select empty questions")}
                    </button>
                  </div>
                )}

                {/* Record list */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((record) => (
                      <div key={record.id} className={`relative group bg-stone-50/80 dark:bg-mystic-900 p-1 sm:p-2 rounded-[1.25rem] border transition-all flex flex-col ${historySelectMode && selectedHistoryIds.has(record.id)
                          ? 'border-amber-400 dark:border-amber-500 ring-1 ring-amber-300/50 shadow-md'
                          : 'border-stone-200/80 dark:border-mystic-800 shadow-sm hover:shadow-md hover:border-stone-400 dark:hover:border-mystic-600'
                        }`}>
                        <div
                          className="p-4 sm:p-5 cursor-pointer flex-1 flex gap-3"
                          onClick={() => {
                            if (historySelectMode) { toggleRecord(record.id); return; }
                            flushSync(() => {
                              setSelectedSpread(record.spread);
                              setQuestion(record.question);
                              if (record.mode === 'lenormand' && record.lenormandCards) {
                                setMode('lenormand');
                                setLenormandDrawnCards(record.lenormandCards);
                                setDrawnCards([]);
                              } else {
                                setMode(record.mode === 'thoth' ? 'thoth' : 'waite');
                                setDrawnCards(record.cards);
                                setBottomCard(record.bottomCard ?? null);
                                setLenormandDrawnCards([]);
                              }
                              setCurrentHistoryId(record.id);
                            });
                            trackEvent('view_history_record', { spread_name: record.spread?.name ?? '', system: record.mode ?? 'waite' });
                            trackEvent('revisit_history', { spread_name: record.spread?.name ?? '', system: record.mode ?? 'waite' });
                            setIsHistoryOpen(false);
                            navigate('/result');
                          }}
                        >
                          {/* Checkbox in select mode */}
                          {historySelectMode && (
                            <div className="flex items-start pt-1 shrink-0">
                              <input
                                type="checkbox"
                                checked={selectedHistoryIds.has(record.id)}
                                onChange={() => toggleRecord(record.id)}
                                onClick={e => e.stopPropagation()}
                                className="w-4 h-4 accent-amber-500 cursor-pointer"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-bold gold-text leading-tight font-serif-tc">{lang === 'en' ? (SPREAD_TRANSLATIONS[record.spread.id]?.name ?? record.spread.name) : record.spread.name}</h3>
                              <span className="text-[11px] text-stone-600 dark:text-slate-400 bg-stone-200/50 dark:bg-mystic-800/50 px-2 py-1 rounded-md shrink-0 ml-2">
                                {new Date(record.date).toLocaleString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-mystic-300 line-clamp-2 min-h-[2.5rem] mb-3">
                              {record.question?.trim() || t('探索當下整體狀態', 'Exploring Current Situation')}
                            </p>
                            <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-mystic-400">
                              {record.mode === 'lenormand' && <span className="text-teal-700 dark:text-teal-300 bg-teal-400/25 dark:bg-teal-400/20 px-1.5 py-0.5 rounded-md border border-teal-500/50 dark:border-teal-400/30">{t("雷諾曼", "Lenormand")}</span>}
                              {record.mode === 'thoth' && <span className="text-mystic-700 dark:text-mystic-300 bg-mystic-400/25 dark:bg-mystic-400/20 px-1.5 py-0.5 rounded-md border border-mystic-500/50 dark:border-mystic-400/30">{t("托特", "Thoth")}</span>}
                              {record.mode === 'tarot' && <span className="text-amber-700 dark:text-amber-300 bg-amber-400/25 dark:bg-amber-400/20 px-1.5 py-0.5 rounded-md border border-amber-500/50 dark:border-amber-400/30">{t("偉特", "Waite")}</span>}
                              <span>{(record.lenormandCards?.length ?? record.cards.length)} {t("張牌卡", "cards")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Per-record action buttons (hidden in select mode) */}
                        {!historySelectMode && (
                          <div className="flex items-center gap-2 p-2 pt-0">
                            <button
                              onClick={() => {
                                flushSync(() => {
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
                                });
                                setIsHistoryOpen(false);
                                navigate('/result');
                              }}
                              className="flex-[3] py-3.5 bg-mystic-600/70 dark:bg-mystic-700/70 text-white hover:bg-mystic-600/90 dark:hover:bg-mystic-700/90 rounded-xl shadow-sm transition-all active:scale-95 text-[15px] font-bold flex items-center justify-center gap-2"
                            >
                              {t("👁️ 查看", "👁️ View")}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); copyToClipboard('all', record); }}
                              className="flex-[3] py-3.5 bg-transparent border border-mystic-400/40 text-mystic-300 hover:bg-mystic-400/10 transition-all rounded-xl active:scale-95 text-[15px] font-bold flex items-center justify-center gap-2"
                              title={t("直接複製完整 AI 解讀 Prompt", "Copy full AI prompt directly")}
                            >
                              <Copy size={18} />
                              <span>{t("複製解讀", "Copy Prompt")}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setHistory(prev => prev.filter(h => h.id !== record.id));
                                trackEvent('delete_history', { type: 'single', count: 1 });
                                showToast(t('已刪除紀錄', 'Record deleted'));
                              }}
                              className="flex-1 py-3.5 bg-transparent text-red-400/90 hover:text-red-400 hover:scale-110 transition-all rounded-xl active:scale-95 flex items-center justify-center"
                              aria-label="刪除紀錄"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 text-slate-500 dark:text-mystic-400">
                      <p>{history.length === 0 ? t('尚未有任何抽牌紀錄', 'No reading records yet') : t('此時間區間無紀錄', 'No records in this period')}</p>
                    </div>
                  )}
                </div>

                {/* Batch action bar */}
                <AnimatePresence>
                  {historySelectMode && (
                    <motion.div
                      initial={{ y: 80, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 80, opacity: 0 }}
                      className="shrink-0 px-4 lg:px-8 py-3 border-t border-stone-200 dark:border-mystic-800/60 bg-[#f0ead6]/90 dark:bg-mystic-900/80 flex items-center justify-between gap-3"
                    >
                      <span className="text-sm font-semibold text-slate-600 dark:text-mystic-300">
                        {t("已選", "Selected")} <span className="text-amber-600 dark:text-amber-400 font-black">{selectedHistoryIds.size}</span> {t("筆", "items")}
                      </span>
                      <button
                        disabled={selectedHistoryIds.size === 0}
                        onClick={() => setShowBatchDeleteConfirm(true)}
                        className="px-5 py-2 rounded-xl font-bold text-sm bg-red-400/80 hover:bg-red-500/80 text-white shadow-lg shadow-red-500/20 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {t("刪除選取", "Delete Selected")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Batch delete confirm panel */}
                <AnimatePresence>
                  {showBatchDeleteConfirm && (
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
                        <h3 className="text-lg font-bold text-red-600 dark:text-red-400">{t("確定刪除", "Are you sure you want to delete")} {selectedHistoryIds.size} {t("筆紀錄？", " records?")}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{t("此動作無法復原，請確認是否要繼續。", "This action cannot be undone. Are you sure you want to proceed?")}</p>
                        <div className="flex w-full gap-3 mt-1">
                          <button onClick={() => setShowBatchDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl font-bold bg-slate-100 dark:bg-mystic-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-mystic-700 transition-colors">{t("取消", "Cancel")}</button>
                          <button onClick={() => { executeBatchDelete(); trackEvent('delete_history', { type: 'batch', count: selectedHistoryIds.size }); }} className="flex-1 py-2.5 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all active:scale-95">
                            {t("確認刪除", "Confirm Delete")}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            </motion.div>
          );
        })()}
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
                <h3 className="text-xl font-bold">{t("自訂牌陣", "Custom Spread")}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={saveSpread} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("牌陣名稱", "Spread Name")}</label>
                  <input
                    required
                    value={editingSpread.name}
                    onChange={e => setEditingSpread({ ...editingSpread, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-mystic-800 bg-slate-50 dark:bg-mystic-950"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("提示文字", "Hint Text")}</label>
                  <input
                    value={editingSpread.hint}
                    onChange={e => setEditingSpread({ ...editingSpread, hint: e.target.value })}
                    placeholder={t("例如：深入剖析...", "e.g. Deep analysis...")}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-mystic-800 bg-slate-50 dark:bg-mystic-950"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("分類標籤", "Category Tag")} <span className="text-slate-400 font-normal">{t("(選填)", "(Optional)")}</span></label>
                  <input
                    value={editingSpread.category ?? ''}
                    onChange={e => setEditingSpread({ ...editingSpread, category: e.target.value })}
                    placeholder={t("例如：關係、日常、工作…", "e.g. Relationship, Daily, Work...")}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-mystic-800 bg-slate-50 dark:bg-mystic-950"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("抽牌張數 (", "Number of Cards (")}{editingSpread.count}{t(")", ")")}</label>
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
                      setEditingSpread({ ...editingSpread, count, positions });
                    }}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">{t("各位置名稱", "Position Names")}</label>
                  {editingSpread.positions.map((pos, i) => (
                    <input
                      key={i}
                      required
                      placeholder={`${t("位置", "Position")} ${i + 1} ${t("名稱", "Name")}`}
                      value={pos}
                      onChange={e => {
                        const newPos = [...editingSpread.positions];
                        newPos[i] = e.target.value;
                        setEditingSpread({ ...editingSpread, positions: newPos });
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-mystic-800 bg-slate-50 dark:bg-mystic-950 text-sm"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-mystic-600 hover:bg-mystic-500 text-white rounded-xl font-bold transition-colors"
                >
                  {t("儲存牌陣", "Save Spread")}
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
      <footer className="text-center py-4 border-t border-stone-100/60 dark:border-mystic-900/60 bg-white/30 dark:bg-mystic-950/30 backdrop-blur-sm flex flex-col items-center gap-1.5">
        <p className="text-xs text-slate-400 dark:text-mystic-600">{t("© 2026 Tarot Draw｜本站內容僅供娛樂與自我探索參考", "© 2026 Tarot Draw | Content is for entertainment & self-exploration only")}</p>
        <a
          href="https://forms.gle/oXj1gXmqR83f3cfP8"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('click_feedback')}
          className="text-xs text-slate-400 dark:text-mystic-600 hover:text-amber-600 dark:hover:text-mystic-400 transition-colors"
        >
          {t("有想反饋的嗎？點這裡 →", "Feedback? Click here →")}
        </a>
      </footer>
    </div>

  );
}

const SPREAD_TRANSLATIONS: Record<string, { name: string; hint: string; exampleQuestion: string }> = {
  'single': { 
    name: 'Single Card Guidance', 
    hint: 'Draw one card for a quick, direct answer or daily focus.', 
    exampleQuestion: 'What mindset should I hold for today\'s meeting?' 
  },
  'waite-triangle': { 
    name: 'Holy Triangle', 
    hint: 'Three cards mapping Past root, Present status, and Future trajectory.', 
    exampleQuestion: 'What is the past, present, and future of this relationship?' 
  },
  'body-mind-spirit': { 
    name: 'Body-Mind-Spirit', 
    hint: 'Realign when feeling scattered — hear what each dimension is telling you.', 
    exampleQuestion: 'I\'ve been exhausted lately — what are my body, mind, and spirit each trying to tell me?' 
  },
  'cycle': { 
    name: 'Transition Cycle', 
    hint: 'Gain clarity on what is currently fading and what is beginning.', 
    exampleQuestion: 'How should I view my current transitional phase?' 
  },
  'breakthrough': { 
    name: 'Breakthrough Strategy', 
    hint: 'Unearth the main deadlock and locate your primary leverage step.', 
    exampleQuestion: 'How can I adjust my strategy to break through this project deadlock?' 
  },
  'choice': { 
    name: 'Choice & Path', 
    hint: 'Compare the developments and final outcomes of two different options.', 
    exampleQuestion: 'Should I choose stable corporate employment or join a startup?' 
  },
  'iceberg': { 
    name: 'Subconscious Iceberg', 
    hint: 'Expose hidden mental blocks, true desires, and defense systems.', 
    exampleQuestion: 'What are the deep subconscious reasons for my lack of motivation?' 
  },
  'energy-resonance': { 
    name: 'Energy Resonance', 
    hint: 'Reveal the implicit energy exchange and mutual lesson between two paths.', 
    exampleQuestion: 'What is the underlying dynamic of my interaction with this person?' 
  },
  'celtic': { 
    name: 'Celtic Cross', 
    hint: 'The most comprehensive classic 10-card layout for deep situation analysis.', 
    exampleQuestion: 'Please analyze my current life difficulties and show me the path forward.' 
  },
  'elements': { 
    name: 'Four Elements Balance', 
    hint: 'Audit the current state of your actions, emotions, mind, and physical life.', 
    exampleQuestion: 'What messages do the four elemental dimensions reveal about my situation?' 
  },
  'now-connect': { 
    name: 'Current Connection', 
    hint: 'A pure reflection of how two hearts stand relative to each other right now.', 
    exampleQuestion: 'What are our respective feelings and states in this relationship right now?' 
  },
  'lovers-pyramid': { 
    name: 'Lovers\' Pyramid', 
    hint: 'Investigate your feelings, their thoughts, key friction points, and the final path.', 
    exampleQuestion: 'How will my romantic relationship with this person develop?' 
  },
  'reconciliation': { 
    name: 'Relationship Reconciliation', 
    hint: 'Evaluate the root split causes, mutual desires, and the final likelihood of reunion.', 
    exampleQuestion: 'We broke up two months ago; is there a chance of getting back together?' 
  },
  'attraction': { 
    name: 'Personal Attraction', 
    hint: 'Map out the specific frequencies and relationship dynamics you are drawing.', 
    exampleQuestion: 'What energies am I attracting in my current relational state?' 
  },
  'rel-seasons': { 
    name: 'Relationship Seasons', 
    hint: 'Identify the active seasonal cycle of your relationship and how to nourish it.', 
    exampleQuestion: 'What season is this relationship in, and how can I flow with it?' 
  },
  'len-1': { 
    name: 'Single Oracle', 
    hint: 'Ideal for Yes/No, quickly confirm your current direction.', 
    exampleQuestion: 'What is the outcome of meeting this client today?' 
  },
  'len-3': { 
    name: 'Past, Present & Future', 
    hint: 'Understand the context of the event and its subsequent trend.', 
    exampleQuestion: 'What is the past, present, and future direction of this relationship?' 
  },
  'len-5': { 
    name: 'Event Deduction', 
    hint: 'Track the event from its origin all the way to the final result.', 
    exampleQuestion: 'What is the overall development of this job opportunity for me?' 
  },
  'len-9': { 
    name: 'Nine-Box Overview', 
    hint: 'Comprehensively scan hidden keys and blind spots.', 
    exampleQuestion: 'What is the overall energy and direction of my current relationship?' 
  },
  'len-36': { 
    name: 'Grand Tableau', 
    hint: 'Spread all 36 cards to read the complete grid of houses, lines, and futures.', 
    exampleQuestion: 'What does my overall life path look like for the upcoming year?' 
  }
};

const POSITION_TRANSLATIONS: Record<string, string[]> = {
  'single': ['Direct Guidance'],
  'waite-triangle': ['Past Background', 'Present Situation & Shift', 'Future Outcome & Advice'],
  'body-mind-spirit': ['Body', 'Mind', 'Spirit'],
  'cycle': ['Fading Old State', 'Sprouting New Opportunity', 'Core Challenge', 'What You Must Release', 'Strength to Carry Forward'],
  'breakthrough': ['Core Deadlock', 'Baggage/Obstacle to Let Go', 'Breakthrough Opportunity', 'Next Action Step'],
  'choice': ['Current Situation', 'Option A: Near Future', 'Option A: Outcome', 'Option B: Near Future', 'Option B: Outcome'],
  'iceberg': ['Surface Behavior', 'Rational Belief', 'Deep Emotion', 'Core Value/Belief', 'Defense Mechanism', 'Integration Advice'],
  'energy-resonance': ['My Deep Heart', 'Their Deep Heart', 'Relational Tension', 'Mutual Blindspot', 'Core Lesson'],
  'celtic': [
    'Core Situation', 'Direct Obstacle', 'Conscious Goal', 'Subconscious Root',
    'Past Influences', 'Near Future', 'Self-Perception', 'External Environment',
    'Hopes & Fears', 'Final Outcome'
  ],
  'elements': ['Fire (Action & Passion)', 'Water (Emotion & Flow)', 'Air (Intellect & Communication)', 'Earth (Resource & Material)'],
  'now-connect': ['Relational State', 'My Mindset', 'Their Mindset'],
  'lovers-pyramid': ['Your State & Heart', 'Their State & Heart', 'Interaction/Obstacles', 'Future Direction'],
  'reconciliation': ['Core Cause of Split', 'Your True Attachment', 'Their Current Heart', 'Key Reconnect Block', 'Future Path/Reunion Opportunity'],
  'attraction': ['My Current Aura', 'Types of People/Events Attracted', 'Old Relationship Habits to Release'],
  'rel-seasons': ['Current Relationship Season & Temp', 'Core Driver Behind This Rhythm', 'Nourishment Needed Now', 'Upcoming Natural Shift'],
  'len-1': ['Guidance'],
  'len-3': ['Past Influence', 'Present Status', 'Future Direction'],
  'len-5': ['Distant Cause', 'Immediate Cause', 'Core Situation', 'Near Trend', 'Final Outcome'],
  'len-9': [
    'Top-Left: Past Context', 'Top: Recent Influence', 'Top-Right: External Environment',
    'Left: Hidden Factor', 'Center: Core Theme', 'Right: Others\' Perspective',
    'Bottom-Left: Inner Feelings', 'Bottom: Recent Actions', 'Bottom-Right: Final Trend'
  ],
  'len-36': [
    "House 1 (Rider)", "House 2 (Clover)", "House 3 (Ship)", "House 4 (House)", "House 5 (Tree)",
    "House 6 (Clouds)", "House 7 (Snake)", "House 8 (Coffin)", "House 9 (Bouquet)", "House 10 (Scythe)",
    "House 11 (Whip)", "House 12 (Birds)", "House 13 (Child)", "House 14 (Fox)", "House 15 (Bear)",
    "House 16 (Stars)", "House 17 (Stork)", "House 18 (Dog)", "House 19 (Tower)", "House 20 (Garden)",
    "House 21 (Mountain)", "House 22 (Crossroads)", "House 23 (Mice)", "House 24 (Heart)", "House 25 (Ring)",
    "House 26 (Book)", "House 27 (Letter)", "House 28 (Man)", "House 29 (Woman)", "House 30 (Lilies)",
    "House 31 (Sun)", "House 32 (Moon)", "House 33 (Key)", "House 34 (Fish)", "House 35 (Anchor)",
    "House 36 (Cross)"
  ]
};

const TRIVIA_TRANSLATIONS: Record<string, string> = {
  "塔羅牌的英文 Tarot 源自義大利語 Tarocchi，最早的塔羅牌出現在 15 世紀的義大利，當時是作為宮廷遊戲牌使用。":
    "The word 'Tarot' originates from the Italian 'Tarocchi'. The earliest tarot cards appeared in 15th-century Italy, used as a court card game.",
  "塔羅牌由 78 張牌組成，分為 22 張大秘儀（Major Arcana）與 56 張小秘儀（Minor Arcana），大秘儀象徵靈性旅程，小秘儀代表日常事件。":
    "Tarot consists of 78 cards: 22 Major Arcana (representing spiritual journeys) and 56 Minor Arcana (representing daily life events).",
  "正逆位解讀是後來的發展。早期占卜並不一定使用逆位，逆位通常代表能量的阻塞、過度、不足或內化表現。":
    "Reversal interpretations came later. Early readers didn't always use reversals; they usually signify blocked, excessive, or internalized energy.",
  "托特塔羅牌由阿萊斯特·克勞利 (Aleister Crowley) 與畫家芙瑞達·哈里斯 (Frieda Harris) 女士共同創作，耗時五年完成。":
    "The Thoth Tarot was co-created by Aleister Crowley and Lady Frieda Harris, taking five years to complete.",
  "托特牌融入了占星學、卡巴拉生命之樹、鍊金術、古埃及神話與易經，是符號學與神祕學密度最高的塔羅牌。":
    "The Thoth deck integrates astrology, Kabbalah, alchemy, Egyptian mythology, and the I Ching, making it highly dense in occult symbolism.",
  "與偉特牌不同，托特牌的「正義」與「力量」分別改名為「調節 (Adjustment)」與「慾望 (Lust)」，且排在第 8 與第 11 的位置。":
    "Unlike Waite-Smith, Thoth renames 'Justice' to 'Adjustment' (#8) and 'Strength' to 'Lust' (#11).",
  "托特牌的小秘儀宮廷牌結構與傳統不同，分別是：公主 (Princess)、王子 (Prince)、皇后 (Queen)、騎士 (Knight)。":
    "The Thoth court cards are structured differently: Princess, Prince, Queen, and Knight.",
  "在托特系統中，錢幣 (Pentacles) 被替換為圓盤 (Disks)，象徵物質界更為動態與宇宙尺度的能量。":
    "In the Thoth system, Pentacles are replaced by Disks, symbolizing more dynamic, cosmic-scale physical energy.",
  "克勞利認為舊時代（奧西里斯時代）已經結束，世界進入了荷魯斯的新紀元，因此將第 20 張牌「審判」改名為「新紀元 (The Aeon)」。":
    "Crowley believed the old Aeon of Osiris had ended, entering the new Aeon of Horus; hence, Judgement (#20) is renamed to 'The Aeon'.",
  "傳統的「節制 (Temperance)」在托特牌中被改為「藝術 (Art)」，強調鍊金術中火與水結合的轉化與昇華過程。":
    "Traditional 'Temperance' is renamed 'Art', highlighting the alchemical merging of fire and water.",
  "本站模擬實體洗牌：透過多次切牌、交錯疊合、翻轉牌疊，讓每次抽牌的結果都來自完整的洗牌過程。":
    "This site simulates physical shuffling: cutting, interleaving, and flipping decks, ensuring every draw is from a fully randomized shuffle.",
  "問題越清晰，答案越清晰。輸入問題時，盡量具體描述想了解的事，避免一次問多個問題。":
    "Closer questions yield clearer answers. Try to be specific and avoid asking multiple questions at once.",
  "雷諾曼牌以法國占卜師瑪麗·安·雷諾曼（Marie Anne Lenormand，1772-1843）命名，她曾為拿破崙皇后約瑟芬占卜。":
    "Lenormand is named after the French cartomancer Marie Anne Lenormand, who read for Napoleon's Empress Josephine.",
  "雷諾曼牌只有 36 張，遠少於塔羅牌的 78 張，每張牌都對應一張標準撲克牌花色，起源可追溯到德國遊戲牌。":
    "Lenormand consists of only 36 cards, each mapped to a playing card suit, originating from German game cards.",
  "雷諾曼牌的解讀方式與塔羅截然不同——重點不在單張牌義，而在於「相鄰牌的組合」所產生的故事脈絡。":
    "Lenormand's reading style differs from Tarot—focusing not on single cards, but on combinations of adjacent cards to tell a story.",
  "雷諾曼牌沒有正逆位的概念，每張牌都以正立方式解讀，牌義傾向具體的日常事件而非抽象的心理狀態。":
    "Lenormand has no reversals. Cards are read upright, focusing on concrete daily events rather than abstract psychology.",
  "第 28 號「男人」與第 29 號「女人」是雷諾曼牌中的「指示牌」，代表問事者本人，是牌陣中的基準點。":
    "Card 28 (Man) and 29 (Woman) are signifiers representing the querent, serving as reference anchors in the spread.",
  "九宮格（Grand Tableau 的縮版）是雷諾曼最經典的牌陣，透過中心牌與四周牌的位置關係進行整體解讀。":
    "The 3x9 grid (mini Grand Tableau) is a classic Lenormand layout, reading relationships between center and surrounding cards.",
  "雷諾曼牌中的「棺材（Coffin）」不一定代表死亡，更常見的牌義是結束、休眠或某件事物的轉化與暫停。":
    "The Coffin card doesn't necessarily mean death; it commonly signifies endings, dormancy, transformation, or pauses.",
  "「三葉草（Clover）」是雷諾曼牌中最輕快的牌之一，代表小小的好運與意外之喜，通常是短暫但真實的機會。":
    "Clover is one of the lightest cards, representing small strokes of luck and pleasant surprises.",
  "「鑰匙（Key）」在雷諾曼體系中代表「是」或「必然」，通常是整張牌陣中最確定且正向的指示之一。":
    "The Key signifies 'yes' or 'inevitability', usually one of the most positive signs in a spread.",
  "「魚（Fish）」代表流動、財務與豐盛，最初源自占卜師將牌義與日耳曼民間傳說中「魚帶來財富」的信仰結合。":
    "Fish stands for flow, finances, and abundance, deriving from German folklore associating fish with wealth.",
  "完整版的大展開牌陣（Grand Tableau）需要全部 36 張牌，一次性鋪開排成 4 行 9 列，是雷諾曼最複雜的讀法。":
    "The Grand Tableau uses all 36 cards laid out in a 4x9 grid, which is the most complex reading method in Lenormand.",
  "雷諾曼牌在德語系國家（德國、奧地利、瑞士）至今仍非常盛行，甚至比塔羅牌更廣泛地出現在日常占卜場合。":
    "Lenormand remains highly popular in German-speaking countries, often used more widely than Tarot for daily matters.",
  "問題越清晰，答案越清晰。雷諾曼擅長回答具體的事務性問題，問題越明確，牌陣的故事脈絡就越清晰。":
    "Lenormand excels at concrete, practical questions. The clearer the question, the cleaner the storyline."
};

const ORACLE_TRANSLATIONS: Record<string, string> = {
  "跳就對了，但前路未明": "Just leap, but the road ahead is unclear",
  "你有資源，能量到位": "You have the resources, energy is in place",
  "答案在內心，需要傾聽": "The answer is within, you need to listen",
  "豐盛、創造、滋養": "Abundance, creativity, nourishment",
  " need to structure & discipline": "Structure and discipline are required",
  " need to structure and discipline": "Structure and discipline are required",
  "需要結構與紀律才行": "Structure and discipline are required",
  "看是否符合傳統或規範": "Check if it conforms to tradition or norms",
  "對齊的選擇，順流": "Aligned choice, flow",
  "意志驅動，會成功": "Willpower-driven, will succeed",
  "溫和堅定地達成": "Accomplishing with gentle firmness",
  "現在不是時候，需獨處": "Now is not the time, solitude is needed",
  "機運轉動，傾向好": "Wheel of fortune turns, tilting positive",
  "因果決定，看你做了什麼": "Karmic decision, depends on your actions",
  "停滯,需要轉換視角": "Stagnant, need to change perspective",
  "必須結束才能開始": "Must end to begin anew",
  "會成,但需要耐心與平衡": "Will succeed, but needs patience & balance",
  "被困住,有執著或誘惑": "Trapped, hold onto attachments or temptations",
  "崩壞、突發、否": "Collapse, sudden disruption, No",
  "希望、療癒、Yes": "Hope, healing, Yes",
  "迷霧、不明朗、暫不宜": "Foggy, unclear, not recommended for now",
  "最強烈的 Yes": "The strongest Yes",
  "重生、覺醒,通常正面": "Rebirth, awakening, usually positive",
  "圓滿達成": "Completed successfully",
  "新火花,行動的開始": "New spark, beginning of action",
  "規劃中,前景看好": "Under planning, promising outlook",
  "拓展,船已啟航": "Expansion, the ship has sailed",
  "慶祝、穩固、團圓": "Celebration, stability, reunion",
  "競爭與衝突": "Competition and conflict",
  "勝利、被認可": "Victory, recognized",
  "需堅守立場才能贏": "Must stand ground to win",
  "快速進展、訊息來": "Swift progress, message arrives",
  "疲憊但接近終點": "Exhausted but near the finish line",
  "負擔過重,難以為繼": "Overburdened, hard to sustain",
  "新機會、新想法": "New opportunity, new idea",
  "衝動行動,結果快但急": "Impulsive action, fast but rushed outcome",
  "自信、魅力、成功": "Confidence, charm, success",
  "領導力、願景實現": "Leadership, vision realized",
  "情感豐沛、新關係": "Abundant emotions, new relationship",
  "連結、互相、和諧": "Connection, mutuality, harmony",
  "慶祝、友誼、開心": "Celebration, friendship, joy",
  "冷漠、錯失、不滿": "Apathy, missed chance, discontent",
  "失落、後悔": "Loss, regret",
  "懷舊、回歸、純粹": "Nostalgia, return, purity",
  "太多選項、幻想多": "Too many options, high illusion",
  "離開、放下、轉身": "Leaving, letting go, walking away",
  "願望實現之牌": "Wish fulfillment card",
  "圓滿幸福": "Complete happiness",
  "直覺訊息、新感受": "Intuitive message, new feeling",
  "浪漫提案、感性行動": "Romantic proposal, emotional action",
  "直覺準、情感成熟": "Accurate intuition, emotional maturity",
  "情緒穩定、有智慧": "Stable emotions, wise",
  "清晰、突破、真相": "Clarity, breakthrough, truth",
  "僵局、無法決定": "Deadlock, unable to decide",
  "心碎、傷害": "Heartbreak, hurt",
  "休息、暫停、不動": "Rest, pause, stillness",
  "衝突、空虛勝利": "Conflict, hollow victory",
  "渡過、移動到更好處": "Moving on, moving to a better place",
  "欺瞞、不光明的手段": "Deception, dishonorable methods",
  "自我設限、看似困住": "Self-imposed limits, seemingly trapped",
  "焦慮、惡夢": "Anxiety, nightmares",
  "結束、低谷": "Ending, rock bottom",
  "觀察中、消息未明": "Observing, news unclear",
  "快速行動,但急躁": "Fast action, but rash",
  "理性判斷、孤獨": "Rational judgment, loneliness",
  "智慧決斷、客觀": "Wise decision, objective",
  "物質新機會、實在": "New material opportunity, concrete",
  "平衡中、看處理能力": "In balance, depends on coping ability",
  "合作、技藝、被認可": "Collaboration, craft, recognized",
  "守成、不願改變": "Holding on, reluctant to change",
  "匱乏、被排除": "Scarcity, excluded",
  "給予與接受平衡": "Balanced giving and receiving",
  "評估中、需耐心": "Evaluating, patience required",
  "努力學習、累積中": "Studying hard, accumulating",
  "獨立豐盛": "Independent abundance",
  "長期富足、家族": "Long-term wealth, legacy",
  "學習新事物、機會": "Learning new things, opportunity",
  "緩慢但穩定前進": "Slow but steady progress",
  "豐盛照料、實際": "Abundant care, practical",
  "物質成功、穩固": "Material success, stable",

  // Thoth Oracle Messages
  "純粹開始,信任之躍": "Pure beginning, leap of faith",
  "意志與技藝兼備": "Both will and skill equipped",
  "神秘、需內省": "Mysterious, introspection needed",
  "創造、愛、豐盛": "Creation, love, abundance",
  "需建立權威結構": "Authority structure needed",
  "看是否合於傳統": "See if it aligns with tradition",
  "結合的選擇,需審視": "Unifying choice, needs scrutiny",
  "勝利、推進": "Victory, advancement",
  "業力平衡、看公正": "Karmic balance, justice",
  "內在探尋,慢": "Inner search, slow",
  "輪轉,傾向有利": "Turning wheel, tilting favorable",
  "強烈生命力、駕馭": "Strong vitality, control",
  "犧牲、停滯": "Sacrifice, stagnation",
  "轉化,但需經歷結束": "Transformation, but requires ending",
  "煉金、整合、成功": "Alchemy, integration, success",
  "物質、慾望,但有力量": "Materiality, desire, yet powerful",
  "突發瓦解": "Sudden collapse",
  "希望、療癒": "Hope, healing",
  "幻象、迷失、最暗的時刻": "Illusion, lost, the darkest hour",
  "光明、活力、Yes": "Light, vitality, Yes",
  "覺醒、新時代": "Awakening, new aeon",
  "火的根源、創造力": "Root of Fire, creativity",
  "主宰、規劃中": "Dominion, planning",
  "美德、堅定的善": "Virtue, established good",
  "完成、穩固": "Completion, stability",
  "衝突、爭鬥": "Conflict, strife",
  "勝利": "Victory",
  "勇氣對抗,結果不定": "Courageous confrontation, uncertain outcome",
  "迅速、訊息到": "Swiftness, message arrives",
  "巨大力量、接近完成": "Great strength, near completion",
  "壓迫、過度": "Oppression, excess",
  "火元素青春": "Youth of Fire element",
  "行動力強的領導者": "Active leader",
  "火元素的成熟力量": "Mature power of Fire element",
  "衝擊力、果決": "Impact, decisive",
  "情感之源": "Source of emotion",
  "愛、和諧結合": "Love, harmonious union",
  "豐盈、滿溢": "Abundance, overflowing",
  "享樂中藏著厭倦": "Pleasure hiding weariness",
  "失望": "Disappointment",
  "愉悅、但短暫": "Pleasure, but transient",
  "沉溺、腐敗": "Debauchery, corruption",
  "倦怠、放棄": "Satiety, abandonment",
  "幸福、願願牌": "Happiness, wish card",
  "幸福、願望牌": "Happiness, wish card",
  "滿足、但接近滿溢點": "Satiety, but near overflow point",
  "細膩、夢幻": "Delicate, dreamlike",
  "浪漫、變動": "Romantic, change",
  "情感深邃": "Deep emotions",
  "感性行動者": "Sensible actor",
  "風的根源、清晰": "Root of Air, clarity",
  "暫時的平衡與和解": "Temporary peace and truce",
  "悲傷、心碎": "Sorrow, heartbreak",
  "停戰、暫歇": "Truce, rest",
  "失敗": "Failure",
  "智識成功、平衡": "Intellectual success, balance",
  "徒勞、計謀失敗": "Futility, failed scheme",
  "干擾、阻礙": "Interference, obstacle",
  "殘酷、絕望": "Cruelty, despair",
  "毀滅、結束": "Ruin, ending",
  "觀察、不穩定": "Observation, unstable",
  "思想行動者、急": "Active thinker, rushed",
  "敏銳、孤立": "Sharp, isolated",
  "思想衝鋒、快": "Thought charge, fast",
  "物質根源、新基礎": "Root of disks, new foundation",
  "變動中、需靈活": "Change, needs flexibility",
  "工作完成、被肯定": "Work completed, recognized",
  "守成的力量": "Power of preservation",
  "擔憂、匱乏": "Worry, lack",
  "物質成功": "Material success",
  "失敗、徒勞": "Failure, futility",
  "橫讀問事者所在整行": "Horizontal reading of Querent's entire row",
  "謹慎、技藝累積": "Prudence, skill accumulation",
  "獲得、豐盛": "Gain, abundance",
  "富足、巔峰": "Wealth, peak",
  "實際、成長中": "Practical, growing",
  "穩定建設者": "Stable builder",
  "豐盛照料": "Abundant nurturing",
  "緩慢穩固": "Slow but stable",

  // Lenormand Oracle Messages
  "好消息來、Yes": "Good news arriving, Yes",
  "小幸運、Yes": "Small stroke of luck, Yes",
  "進展中、有方向": "In progress, directed",
  "穩定、家、安全": "Stable, home, security",
  "緩慢、健康相關需耐心": "Slow, patience needed for health matters",
  "混亂、不明、No": "Confusion, unclear, No",
  "複雜、欺瞞、繞路": "Complex, deception, detour",
  "結束、停止": "Ending, stop",
  "禮物、美好、Yes": "Gift, pleasantness, Yes",
  "突然中斷、切斷": "Sudden disruption, severed",
  "衝突、爭吵、否": "Conflict, quarrel, No",
  "焦慮、八卦、看情況": "Anxiety, gossip, depends on context",
  "新開始、小規模 Yes": "New beginning, small scale Yes",
  "警覺、有詐": "Vigilant, warning",
  "力量、財富、保護": "Strength, wealth, protection",
  "希望、引導、Yes": "Hope, guidance, Yes",
  "改變、通常正面": "Change, usually positive",
  "忠誠、朋友、Yes": "Loyalty, friend, Yes",
  "結構、官方、孤立": "Structure, official, isolation",
  "公開場合、社交、Yes": "Public setting, social, Yes",
  "阻礙、停滯、No": "Obstacle, stagnation, No",
  "選擇、岔路": "Choice, crossroads",
  "損失、被侵蝕": "Loss, eroded",
  "愛、真心、Yes": "Love, sincerity, Yes",
  "承諾、契約": "Commitment, contract",
  "秘密、未知、學習": "Secret, unknown, learning",
  "消息來、文件": "News arriving, document",
  "代表人物": "Representative figure",
  "純粹、成熟、和諧": "Pure, mature, harmony",
  "成功、最強 Yes": "Success, strongest Yes",
  "認可、情緒、有名望": "Recognition, emotions, prestigious",
  "確定、解答、Yes": "Certainty, solution, Yes",
  "財富、流動": "Wealth, flow",
  "穩定、長久": "Stable, long-lasting",
  "負擔、苦難": "Burden, suffering"
};

const LENORMAND_KEYWORD_TRANSLATIONS: Record<number, string[]> = {
  1: ["Good news", "Messenger", "Speed"],
  2: ["Small luck", "Opportunity", "Fortune"],
  3: ["Travel", "Distance", "Adventure"],
  4: ["Family", "Security", "Foundation"],
  5: ["Health", "Growth", "Roots"],
  6: ["Confusion", "Doubt", "Uncertainty"],
  7: ["Complexity", "Temptation", "Detour"],
  8: ["Ending", "Transformation", "Stillness"],
  9: ["Gift", "Surprise", "Gratitude"],
  10: ["Severance", "Danger", "Decisiveness"],
  11: ["Conflict", "Repetition", "Discipline"],
  12: ["Conversation", "Anxiety", "Communication"],
  13: ["New start", "Innocence", "Small matter"],
  14: ["Caution", "Deception", "Strategy"],
  15: ["Strength", "Authority", "Wealth"],
  16: ["Hope", "Inspiration", "Direction"],
  17: ["Change", "Migration", "Upgrade"],
  18: ["Friendship", "Loyalty", "Trust"],
  19: ["Institution", "Isolation", "Official"],
  20: ["Social", "Public", "Gathering"],
  21: ["Obstacle", "Challenge", "Persistence"],
  22: ["Choice", "Crossroads", "Freedom"],
  23: ["Loss", "Anxiety", "Erosion"],
  24: ["Love", "Emotion", "Kindness"],
  25: ["Commitment", "Contract", "Cycle"],
  26: ["Secret", "Knowledge", "Learning"],
  27: ["Message", "Document", "Communication"],
  28: ["Male lead", "Him", "Protagonist"],
  29: ["Female lead", "Her", "Protagonist"],
  30: ["Maturity", "Purity", "Serenity"],
  31: ["Success", "Vitality", "Light"],
  32: ["Fame", "Intuition", "Subconscious"],
  33: ["Answer", "Achievement", "Unlock"],
  34: ["Finance", "Flow", "Abundance"],
  35: ["Stability", "Persistence", "Long-term"],
  36: ["Fate", "Burden", "Faith"]
};

const SpreadCard = React.memo(function SpreadCard({ spread, isCustom, onSelect, onEdit, onDelete, t, lang }: {
  spread: Spread;
  isCustom?: boolean;
  onSelect: (spread: Spread) => void;
  onEdit?: (spread: Spread, e: MouseEvent) => void;
  onDelete?: (spread: Spread, e: MouseEvent) => void;
  t: (zh: string, en: string) => string;
  lang: 'zh' | 'en';
}) {
  const translatedSpread = React.useMemo(() => {
    if (lang === 'zh') return spread;
    const trans = SPREAD_TRANSLATIONS[spread.id];
    const posTrans = POSITION_TRANSLATIONS[spread.id];
    if (!trans) return spread;
    return {
      ...spread,
      name: trans.name,
      hint: trans.hint,
      positions: posTrans || spread.positions
    };
  }, [spread, lang]);

  return (
    <div
      onClick={() => onSelect(spread)}
      className="relative bg-white dark:bg-mystic-900/80 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-stone-200/80 dark:border-mystic-800 hover:border-stone-300 dark:hover:border-mystic-600 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col min-h-[160px] sm:min-h-[220px] overflow-hidden"
    >
      <div className="flex justify-between items-start mb-2 sm:mb-4 relative z-10 gap-2">
        <h3 className="text-base sm:text-xl font-bold text-stone-800 dark:text-mystic-100 group-hover:text-stone-600 dark:group-hover:text-mystic-300 transition-colors drop-shadow-sm leading-tight line-clamp-2">
          {translatedSpread.name}
        </h3>
        <span className="shrink-0 px-2 sm:px-3 py-1 bg-stone-100 dark:bg-mystic-800 text-stone-600 dark:text-mystic-400 text-[10px] sm:text-xs font-bold rounded-full border border-stone-200 dark:border-mystic-700 shadow-sm whitespace-nowrap">
          {translatedSpread.count} {t("張牌", "Cards")}
        </span>
      </div>

      {/* Hint (Theory/Description) */}
      <p className="text-xs sm:text-sm text-slate-600 dark:text-mystic-300 line-clamp-2 mb-4 sm:mb-6 relative z-10 font-medium leading-relaxed">
        {translatedSpread.hint || t(`自訂牌陣 · ${translatedSpread.count} 張`, `Custom · ${translatedSpread.count} Cards`)}
      </p>

      {/* Positions Area (Horizontal Scroll) */}
      <div className="mt-auto relative z-10 w-full overflow-hidden rounded-lg bg-stone-50/50 dark:bg-mystic-950/30 p-2 sm:p-3 border border-stone-100 dark:border-mystic-800/50 shadow-inner">
        <div className="relative">
          {/* Right fade-out gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-stone-50 dark:from-mystic-900 via-stone-50/80 dark:via-mystic-900/80 to-transparent pointer-events-none z-10 rounded-r-lg" />

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pr-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {translatedSpread.positions.map((pos, idx) => (
              <div key={idx} className="flex items-center gap-2.5 shrink-0">
                <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white dark:bg-mystic-900/80 rounded-md text-slate-700 dark:text-mystic-200 text-xs sm:text-sm font-semibold whitespace-nowrap shadow-sm border border-stone-200 dark:border-mystic-700">
                  <span className="w-5 h-5 rounded-full bg-stone-100 dark:bg-mystic-800 text-stone-600 dark:text-mystic-300 flex items-center justify-center text-[10px] sm:text-xs">
                    {idx + 1}
                  </span>
                  {pos}
                </div>
                {idx < translatedSpread.positions.length - 1 && (
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
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onEdit?.(spread, e); }}
            className="p-1.5 text-slate-400 dark:text-mystic-500 hover:text-amber-600 dark:hover:text-mystic-400 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete?.(spread, e); }}
            className="p-1.5 text-slate-400 dark:text-mystic-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
});

// ─── Oracle helpers (single source of truth for label + colour) ──────────────
function getEffectiveScore(baseScore: number, reversed: boolean): number {
  if (!reversed) return baseScore;
  // Reversal = energy blocked/diminished, not a simple negation.
  // +2 → -1  (was Yes, now leans Maybe No)
  // +1 → -1  (was Maybe Yes, now leans Maybe No)
  //  0 → -1  (neutral becomes slightly unfavourable when reversed)
  // -1 → -2  (already bad, gets worse)
  // -2 → -2  (floor)
  if (baseScore >= 1) return -1;
  if (baseScore === 0) return -1;
  return -2;
}

interface OracleUI {
  label: string;
  theme: string;
  bg: string;
}

function oracleUI(effectiveScore: number, lang: 'zh' | 'en'): OracleUI {
  switch (effectiveScore) {
    case 2: return { label: lang === 'en' ? 'Yes' : '是 (Yes)', theme: 'text-teal-700 dark:text-teal-400', bg: 'bg-teal-50/80 dark:bg-teal-900/30 border-teal-200/60 dark:border-teal-800/50' };
    case 1: return { label: lang === 'en' ? 'Maybe Yes' : '偏向是 (Maybe Yes)', theme: 'text-teal-600/80 dark:text-teal-400/70', bg: 'bg-teal-50/50 dark:bg-teal-900/20 border-teal-200/40 dark:border-teal-800/30' };
    case 0: return { label: lang === 'en' ? 'Maybe' : '不確定 (Maybe)', theme: 'text-stone-600 dark:text-stone-400', bg: 'bg-stone-100/80 dark:bg-stone-800/30 border-stone-300/50 dark:border-stone-700/40' };
    case -1: return { label: lang === 'en' ? 'Maybe No' : '偏向否 (Maybe No)', theme: 'text-rose-700/80 dark:text-rose-300/80', bg: 'bg-rose-100/50 dark:bg-rose-950/40 border-rose-300/40 dark:border-rose-700/30' };
    case -2: return { label: lang === 'en' ? 'No' : '否 (No)', theme: 'text-rose-800 dark:text-rose-200', bg: 'bg-rose-100/70 dark:bg-rose-950/60 border-rose-300/60 dark:border-rose-700/50' };
    default: return { label: lang === 'en' ? 'Maybe' : '不確定 (Maybe)', theme: 'text-stone-600 dark:text-stone-400', bg: 'bg-stone-100/80 dark:bg-stone-800/30 border-stone-300/50 dark:border-stone-700/40' };
  }
}

function TarotSpreadLayout({ spread, cards, mode, lang }: { spread: Spread; cards: DrawnCard[]; mode: 'waite' | 'thoth'; lang: 'zh' | 'en' }) {
  const renderCard = (index: number) => {
    if (index >= cards.length) return null;
    return <TarotCardDisplay card={cards[index]} index={index} system={mode} lang={lang} spreadId={spread.id} />;
  };

  switch (spread.id) {
    case 'single': {
      const card = cards[0];
      if (!card) return null;

      const oracle = ORACLE_DATA[mode][card.id];
      if (!oracle) return null;

      const effectiveScore = getEffectiveScore(oracle.score, card.isReversed);
      const { label, theme, bg } = oracleUI(effectiveScore, lang);

      return (
        <div className="flex flex-col items-center gap-8 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.15 }}
            className={`px-8 py-5 rounded-2xl border-2 ${bg} shadow-xl flex flex-col items-center gap-2 transition-all backdrop-blur-md`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-[10px] sm:text-xs font-black ${theme} opacity-70 uppercase tracking-[0.2em]`}>{lang === 'en' ? 'Oracle Guide' : '神諭指引'}</span>
              <span className={`text-xl sm:text-2xl font-black ${theme} tracking-tight`}>{label}</span>
            </div>
            <p className={`text-xs sm:text-sm font-bold ${theme} opacity-90 text-center`}>
              {lang === 'en' ? (ORACLE_TRANSLATIONS[oracle.message] ?? oracle.message) : oracle.message}
            </p>
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

    case 'lovers-pyramid':
      return (
        <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-8 place-items-center w-full max-w-xl mx-auto">
          <div className="col-span-2">{renderCard(3)}</div>
          <div className="col-span-2">{renderCard(2)}</div>
          <div>{renderCard(0)}</div>
          <div>{renderCard(1)}</div>
        </div>
      );

    case 'reconciliation':
      return (
        <div className="grid grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-8 place-items-center w-full max-w-3xl mx-auto">
          <div className="col-start-2">{renderCard(0)}</div>
          <div className="col-start-1 row-start-2">{renderCard(1)}</div>
          <div className="col-start-2 row-start-2">{renderCard(3)}</div>
          <div className="col-start-3 row-start-2">{renderCard(2)}</div>
          <div className="col-start-2 row-start-3">{renderCard(4)}</div>
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
        <div className={`grid gap-6 sm:gap-10 justify-center w-full mx-auto ${cards.length === 1 ? 'grid-cols-1' :
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

function TarotCardDisplay({ card, index, isExtra, system, lang, spreadId }: { card: DrawnCard; index: number; isExtra?: boolean; system?: 'waite' | 'thoth'; lang?: 'zh' | 'en'; spreadId?: string }) {
  const imgSrc = card.id >= 0 ? getCardImagePath(system ?? 'waite', card.id) : null;
  const isMajor = card.id < 22;

  const displayPositionName = React.useMemo(() => {
    if (lang === 'en' && spreadId && POSITION_TRANSLATIONS[spreadId]) {
      return POSITION_TRANSLATIONS[spreadId][index] || card.positionName;
    }
    return card.positionName;
  }, [card.positionName, index, lang, spreadId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.2), duration: 0.22, ease: 'easeOut' }}
      className="flex flex-col items-center gap-2 shrink-0 mx-auto"
    >
      {!isExtra && (
        <div className="relative w-[110px] sm:w-[130px]">
          <div className="overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-[10px] sm:text-xs font-bold text-amber-700 dark:text-mystic-400 uppercase tracking-wide text-center drop-shadow-sm pr-4">
            {index + 1}. {displayPositionName}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white dark:from-mystic-950 to-transparent" />
        </div>
      )}

      <div className={`relative w-[110px] sm:w-[130px] aspect-[2/3] rounded-xl overflow-hidden border-2 ${card.isReversed ? 'border-red-300/70 dark:border-red-400/45 shadow-red-400/20 dark:shadow-red-500/15' :
          isExtra ? 'border-amber-300/70 dark:border-amber-500/45 shadow-amber-400/20 dark:shadow-amber-500/15' :
            'border-amber-200/80 dark:border-gold-500/45 shadow-amber-400/20 dark:shadow-gold-500/15'
        } shadow-lg`}>

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={lang === 'en' ? card.nameEN : card.nameCN}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover block"
            style={{ transform: card.isReversed ? 'rotate(180deg)' : 'none' }}
          />
        ) : (
          /* Fallback for manually-entered cards with no id */
          <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 ${isMajor ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/80 via-orange-50/50 to-white dark:from-mystic-800/80 dark:via-mystic-900 dark:to-mystic-950' : 'bg-white/90 dark:bg-mystic-900'
            }`}>
            <div className={`flex flex-col items-center justify-center text-center h-full w-full p-2 ${card.isReversed ? 'rotate-180' : ''
              }`}>
              <div className="text-4xl sm:text-5xl mb-2">{getCardEmoji(card.id, system)}</div>
              <div className={`font-extrabold text-sm sm:text-base mb-0.5 leading-tight ${isMajor ? 'text-amber-900 dark:text-amber-50' : 'text-slate-800 dark:text-mystic-100'
                }`}>{lang === 'en' ? card.nameEN : card.nameCN}</div>
            </div>
          </div>
        )}

        {/* Reversed badge */}
        {card.isReversed && (
          <div className="absolute top-2 right-2 bg-red-400/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
            {lang === 'en' ? 'Rev' : '逆'}
          </div>
        )}
      </div>

      <div className="text-center w-[110px] sm:w-[130px]">
        <div className="font-bold text-sm text-slate-800 dark:text-mystic-100 truncate">{lang === 'en' ? card.nameEN : card.nameCN}</div>
        <div className={`text-xs font-bold ${card.isReversed ? 'text-red-500 dark:text-red-400' : 'text-amber-600 dark:text-mystic-400'
          }`}>
          {card.isReversed ? (lang === 'en' ? 'Reversed' : '逆位') : (lang === 'en' ? 'Upright' : '正位')}
        </div>
      </div>
    </motion.div>
  );
}

function LenormandCardDisplay({ card, index, isCenter, isCompact, isSpine, lang, spreadId }: { key?: React.Key; card: DrawnLenormandCard; index: number; isCenter?: boolean; isCompact?: boolean; isSpine?: boolean; lang?: 'zh' | 'en'; spreadId?: string }) {
  const imgSrc = card.id > 0 ? getCardImagePath('lenormand', card.id) : null;

  const displayPositionName = React.useMemo(() => {
    if (lang === 'en' && spreadId && POSITION_TRANSLATIONS[spreadId]) {
      return POSITION_TRANSLATIONS[spreadId][index] || card.positionName;
    }
    return card.positionName;
  }, [card.positionName, index, lang, spreadId]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.015, 0.3), duration: 0.18, ease: 'easeOut' }}
      className="flex flex-col items-center gap-1"
    >
      {!isCompact && (
        <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center leading-tight ${
          isCenter ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-mystic-400'
        }`}>
          {displayPositionName}
        </div>
      )}

      <div className={`relative aspect-[2/3] rounded-md overflow-hidden border transition-all duration-300 ${
        isCompact ? 'w-[52px] sm:w-[68px]' : 'w-[90px] sm:w-[110px] rounded-lg sm:rounded-xl shadow-lg'
      } ${
        isSpine
          ? 'border-2 border-amber-400/80 dark:border-amber-500/70 shadow-md shadow-amber-400/25 ring-1 ring-amber-300/40 dark:ring-amber-600/30 scale-105'
          : isCenter
            ? 'border-2 border-teal-400/50 dark:border-teal-600/40 shadow-teal-400/15 scale-110 ring-2 ring-teal-300/30 dark:ring-teal-700/25'
            : isCompact
              ? 'border border-stone-300/60 dark:border-stone-600/40 shadow-sm'
              : 'border-2 border-teal-300/50 dark:border-teal-700/35 shadow-teal-400/10'
      }`}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={lang === 'en' ? card.nameEN : card.nameCN}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover block"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-teal-50/30 to-emerald-50/50 dark:from-slate-900 dark:via-teal-950/40 dark:to-emerald-950/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`drop-shadow-sm select-none ${isCompact ? 'text-xl' : 'text-4xl sm:text-5xl'}`} role="img" aria-label={card.nameEN}>
                {card.emoji}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="text-center">
        <div className={`font-bold leading-tight text-slate-800 dark:text-mystic-100 ${
          isCompact ? 'text-[9px] sm:text-[10px]' : 'text-sm sm:text-base'
        }`}>{lang === 'en' ? card.nameEN : card.nameCN}</div>
        {!isCompact && (
          <>
            <div className="text-[10px] sm:text-xs text-slate-500 dark:text-mystic-400 leading-snug">{lang === 'en' ? card.nameCN : card.nameEN}</div>
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {(lang === 'en' ? (LENORMAND_KEYWORD_TRANSLATIONS[card.id] ?? card.keywords) : card.keywords).map((kw, i) => (
                <span key={i} className="text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-teal-50/80 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-700/30 rounded-full font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
