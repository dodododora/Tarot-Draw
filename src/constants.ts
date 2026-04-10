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
  { id: "single", name: "單張牌指引", count: 1, positions: ["指引"], hint: "一張牌，一個方向" },
  { id: "lovers", name: "戀人金字塔", count: 6, positions: ["你的狀態", "對方的狀態", "關係現況", "挑戰", "建議", "未來走向"], hint: "深入剖析雙方的情感連結" },
  { id: "elements", name: "四元素", count: 4, positions: ["火（行動/熱情）", "水（情感/直覺）", "風（思維/溝通）", "土（物質/現實）"], hint: "從四元素看問題的全貌" },
  { id: "blindspot", name: "盲點", count: 3, positions: ["你看見的", "你忽略的", "你需要知道的"], hint: "揭露你沒注意到的事" },
  { id: "celtic", name: "凱爾特十字", count: 10, positions: ["現況", "挑戰", "潛意識", "過去", "可能結果", "近未來", "自我認知", "外在環境", "希望與恐懼", "最終結果"], hint: "經典全面解析牌陣" },
  { id: "flow", name: "時間之流", count: 5, positions: ["過去", "現在", "隱藏的影響", "建議", "未來"], hint: "順著時間線理解事件脈絡" },
  { id: "choice", name: "二擇一", count: 5, positions: ["現況", "選擇A的發展", "選擇A的結果", "選擇B的發展", "選擇B的結果"], hint: "面對岔路時的決策參考" },
  { id: "goal", name: "目標顯化", count: 4, positions: ["目標", "障礙", "資源", "行動建議"], hint: "聚焦你想實現的事" },
  { id: "mirror", name: "鏡像關係", count: 6, positions: ["你眼中的自己", "對方眼中的你", "你眼中的對方", "對方眼中的自己", "關係核心課題", "發展建議"], hint: "從雙方視視角看關係全貌" },
  { id: "subconscious", name: "潛意識", count: 3, positions: ["表意識", "潛意識", "整合建議"], hint: "探索內在深層的訊息" },
  { id: "karma", name: "業力", count: 3, positions: ["過去的業力", "現在的課題", "靈魂的方向"], hint: "理解靈魂層面的功課" },
  { id: "shadow", name: "影子自我", count: 4, positions: ["你展現的面貌", "你壓抑的面貌", "影子的根源", "整合之道"], hint: "面對與接納你的暗面" },
  { id: "hero", name: "英雄之旅", count: 7, positions: ["出發點", "召喚", "考驗", "導師/盟友", "深淵", "轉化", "歸來"], hint: "你的故事正走到哪一章？" },
];
