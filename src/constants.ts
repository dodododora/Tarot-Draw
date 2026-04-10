export interface TarotCard {
  id: number;
  nameCN: string;
  nameEN: string;
}

export interface Spread {
  id: string;
  name: string;
  count: number;
  positions: string[];
  hint: string;
  isCustom?: boolean;
  exampleQuestion?: string;
}

export const MAJOR_ARCANA: TarotCard[] = [
  { id: 0, nameCN: "愚者", nameEN: "The Fool" },
  { id: 1, nameCN: "魔術師", nameEN: "The Magician" },
  { id: 2, nameCN: "女教皇", nameEN: "The High Priestess" },
  { id: 3, nameCN: "皇后", nameEN: "The Empress" },
  { id: 4, nameCN: "皇帝", nameEN: "The Emperor" },
  { id: 5, nameCN: "教皇", nameEN: "The Hierophant" },
  { id: 6, nameCN: "戀人", nameEN: "The Lovers" },
  { id: 7, nameCN: "戰車", nameEN: "The Chariot" },
  { id: 8, nameCN: "力量", nameEN: "The Strength" },
  { id: 9, nameCN: "隱者", nameEN: "The Hermit" },
  { id: 10, nameCN: "命運之輪", nameEN: "The Wheel of Fortune" },
  { id: 11, nameCN: "正義", nameEN: "The Justice" },
  { id: 12, nameCN: "倒吊人", nameEN: "The Hanged Man" },
  { id: 13, nameCN: "死亡", nameEN: "The Death" },
  { id: 14, nameCN: "節制", nameEN: "The Temperance" },
  { id: 15, nameCN: "惡魔", nameEN: "The Devil" },
  { id: 16, nameCN: "高塔", nameEN: "The Tower" },
  { id: 17, nameCN: "星星", nameEN: "The Star" },
  { id: 18, nameCN: "月亮", nameEN: "The Moon" },
  { id: 19, nameCN: "太陽", nameEN: "The Sun" },
  { id: 20, nameCN: "審判", nameEN: "The Judgement" },
  { id: 21, nameCN: "世界", nameEN: "The World" },
];

const SUITS = [
  { cn: "權杖", en: "Wands" },
  { cn: "聖杯", en: "Cups" },
  { cn: "寶劍", en: "Swords" },
  { cn: "錢幣", en: "Pentacles" },
];

const RANKS = [
  { cn: "一", en: "Ace" },
  { cn: "二", en: "Two" },
  { cn: "三", en: "Three" },
  { cn: "四", en: "Four" },
  { cn: "五", en: "Five" },
  { cn: "六", en: "Six" },
  { cn: "七", en: "Seven" },
  { cn: "八", en: "Eight" },
  { cn: "九", en: "Nine" },
  { cn: "十", en: "Ten" },
  { cn: "侍者", en: "Page" },
  { cn: "騎士", en: "Knight" },
  { cn: "皇后", en: "Queen" },
  { cn: "國王", en: "King" },
];

export const MINOR_ARCANA: TarotCard[] = SUITS.flatMap((suit, sIdx) =>
  RANKS.map((rank, rIdx) => ({
    id: 22 + sIdx * 14 + rIdx,
    nameCN: `${suit.cn}${rank.cn}`,
    nameEN: `${rank.en} of ${suit.en}`,
  }))
);

export const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export const BUILTIN_SPREADS: Spread[] = [
  // 1 card
  { id: "single", name: "單張牌指引", count: 1, positions: ["指引"], hint: "一張牌，一個方向", exampleQuestion: "請給我一個針對今天工作挑戰的簡單指引？" },
  // 3 cards
  { id: "karma", name: "靈魂業力課題", count: 3, positions: ["靈魂攜帶的舊業力", "今生重現的課題", "剪斷迴圈的剪刀"], hint: "理解靈魂層面的功課", exampleQuestion: "為什麼總是重複遇到同一種類型的主管？" },
  { id: "shadow", name: "暗影特質探索", count: 3, positions: ["展露的面貌", "隱藏的陰暗面", "接納整合之道"], hint: "面對與接納暗面特質", exampleQuestion: "為什麼有時候會突然對身邊的人發無名火？" },
  // 4 cards
  { id: "blindspot", name: "盲點洞察", count: 4, positions: ["公開的我", "隱藏的我", "盲點", "潛力"], hint: "揭露沒被注意到的事", exampleQuestion: "為什麼最近總是和伴侶起衝突，有什麼是沒注意到的？" },
  { id: "subconscious", name: "潛意識深探", count: 4, positions: ["表層的偽裝", "潛意識的渴望", "該釋放的執念", "靈魂的真實呼喚"], hint: "探索內在深層的訊息", exampleQuestion: "對於更換跑道這件事情，真實的想法到底是什麼？" },
  { id: "goal", name: "願望目標顯化", count: 4, positions: ["目前的立足點", "隱藏的階梯（助力）", "必須跨越的坎", "摘星之果（最終結果）"], hint: "聚焦想實現的事", exampleQuestion: "想在半年內創業，該怎麼開始準備？" },
  { id: "elements", name: "四元素全貌", count: 4, positions: ["火（行動/熱情）", "水（情感/直覺）", "風（思維/溝通）", "土（物質/現實）"], hint: "從四元素看問題的全貌", exampleQuestion: "面對即將到來的面試，該如何調整整體狀態？" },
  // 5 cards
  { id: "flow", name: "時間之流", count: 5, positions: ["過去", "現在", "隱藏的影響", "建議", "未來"], hint: "順著時間線理解事件脈絡", exampleQuestion: "我跟這個新認識的對象，未來的發展會如何？" },
  { id: "choice", name: "命運二擇一", count: 5, positions: ["現況", "選擇A的發展", "選擇A的結果", "選擇B的發展", "選擇B的結果"], hint: "面對岔路時的決策參考", exampleQuestion: "我該留在原公司，還是接受獵頭提供的新 offer？" },
  // 6 cards
  { id: "lovers", name: "戀人金字塔", count: 6, positions: ["你的狀態", "對方的狀態", "關係現況", "挑戰", "建議", "未來走向"], hint: "深入剖析雙方的情感連結", exampleQuestion: "我和目前的曖昧對象，這段關係是否有機會晉升為戀人？" },
  { id: "mirror", name: "雙方鏡像關係", count: 6, positions: ["你眼中的自己", "對方眼中的你", "你眼中的對方", "對方眼中的自己", "關係核心課題", "發展建議"], hint: "從雙方視角看關係全貌", exampleQuestion: "我跟前任目前各自對彼此的真實想法是什麼？" },
  // 7 cards
  { id: "hero", name: "英雄之旅", count: 7, positions: ["出發點", "召喚", "考驗", "導師/盟友", "深淵", "轉化", "歸來"], hint: "你的故事正走到哪一章？", exampleQuestion: "我決定離職去旅行，這段人生的新旅程將如何展開？" },
  // 10 cards
  { id: "celtic", name: "凱爾特十字", count: 10, positions: ["現況", "挑戰", "潛意識", "過去", "可能結果", "近未來", "自我認知", "外在環境", "希望與恐懼", "最終結果"], hint: "經典全面解析牌陣", exampleQuestion: "我目前深陷生活與財務壓力中，我該如何看清全局並突破現狀？" },
];

export function getCardEmoji(cardId: number): string {
  if (cardId < 22) {
    const MAJOR_EMOJIS = [
      "🚶", // 0 愚者
      "🧙", // 1 魔術師
      "📜", // 2 女教皇
      "👸", // 3 皇后
      "🤴", // 4 皇帝
      "🗝️", // 5 教皇
      "💞", // 6 戀人
      "🎠", // 7 戰車
      "🦁", // 8 力量
      "🏮", // 9 隱者
      "🎡", // 10 命運之輪
      "⚖️", // 11 正義
      "🙃", // 12 倒吊人
      "💀", // 13 死亡
      "👼", // 14 節制
      "👿", // 15 惡魔
      "🌩️", // 16 高塔
      "🌟", // 17 星星
      "🌕", // 18 月亮
      "☀️", // 19 太陽
      "📯", // 20 審判
      "🌍"  // 21 世界
    ];
    return MAJOR_EMOJIS[cardId] || "🌟";
  }
  
  const suitIndex = Math.floor((cardId - 22) / 14);
  switch (suitIndex) {
    case 0: return "🪄"; // Wands
    case 1: return "🏆"; // Cups
    case 2: return "⚔️"; // Swords
    case 3: return "🪙"; // Pentacles
    default: return "🎴";
  }
}
