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

  // 4 cards
  { id: "elements", name: "四元素全貌", count: 4, positions: ["火元素 (行動與熱情)", "水元素 (潛意識與情感)", "風元素 (思維與溝通)", "土元素 (物質與現實)"], hint: "從四大元素看清問題的全貌", exampleQuestion: "面對即將到來的面試，我目前的整體狀態如何？" },

  // 5 cards
  { id: "blindspot", name: "盲點洞察", count: 5, positions: ["公開表現的面貌", "沒被察覺的盲點", "刻意隱藏的秘密", "尚未發掘的潛能", "破除盲點的建議"], hint: "揭露認知落差的盲點與潛藏能量", exampleQuestion: "為什麼最近總是和伴侶起衝突，有什麼是我們都沒注意到的？" },
  { id: "choice", name: "命運二擇一", count: 5, positions: ["決策當下的現況", "選擇A的發展軌跡", "選擇A的結果", "選擇B的發展軌跡", "選擇B的結果"], hint: "面對岔路時，推演不同選擇的發展與結果", exampleQuestion: "我該留在原公司，還是接受獵頭提供的新 offer？" },
  { id: "karma", name: "靈魂業力課題", count: 5, positions: ["過去糾結的舊業", "反覆出現的課題", "隱藏的珍貴禮物", "打破迴圈的行動", "成長後的最終局"], hint: "探索生命中不斷重複的深層課題與解法", exampleQuestion: "為什麼總是重複遇到同一種類型的主管？" },

  // 6 cards
  { id: "subconscious", name: "潛意識深探", count: 6, positions: ["表層的想法認知", "被壓抑的舊經驗", "深層渴望原動力", "道德與自我批評", "潛意識防衛機制", "自我療癒的建議"], hint: "像冰山一樣，挖掘沒有被察覺的內心", exampleQuestion: "對於更換跑道這件事情，我總是猶豫不決的深層原因是什麼？" },
  { id: "lovers", name: "戀人三角", count: 6, positions: ["雙方親密與信任", "感情激情與吸引", "未來承諾與責任", "目前的關係挑戰", "改善關係的建議", "未來的走向預測"], hint: "從親密、激情、承諾，為感情狀態把脈", exampleQuestion: "我和目前的曖昧對象，這段關係是否有機會晉升為戀人？" },
  { id: "mirror", name: "雙方鏡像關係", count: 6, positions: ["主角眼中的自己", "對象眼中的主角", "主角眼中的對象", "對象眼中的自己", "互動產生的誤解", "關係發展的建議"], hint: "跳脫主觀本位，看清雙方的真實想法與落差", exampleQuestion: "我跟前任目前各自對彼此真實的看法是什麼？" },

  // 7 cards
  { id: "hero", name: "英雄之旅", count: 7, positions: ["現狀與出發點", "冒險的召喚", "越過門檻的考驗", "指引導師與盟友", "墜入深淵與試煉", "獲得啟示與轉化", "帶著恩賜歸來"], hint: "把旅途化作一場冒險，看看正處於哪一章", exampleQuestion: "我決定離職去旅行，這段人生的新旅程將如何展開？" },
  { id: "hexagram", name: "六芒星指引", count: 7, positions: ["過去的軌跡", "現在的處境", "未來的趨勢", "潛意識的拉扯", "客觀環境", "最佳的應對策略", "最終的因果歸宿"], hint: "測吉凶、問對策，看清內外環境的百搭牌陣", exampleQuestion: "這份新的事業計畫整體的吉凶與走向如何？" },
  { id: "horseshoe", name: "馬蹄鐵牌陣", count: 7, positions: ["過去狀況", "當前問題點", "可預期的未來", "建議付出的行動", "外界的客觀干擾", "無法預知的障礙", "最後的結局發展"], hint: "針對單一具體難題，掃描前方阻礙與解決方案", exampleQuestion: "我想在下個月搬家換城市生活，這會是正確的決定嗎？" },

  // 8 cards
  { id: "octagon", name: "八方全覽", count: 8, positions: ["提問核心", "精神與思維狀態", "情感與內心世界", "金錢與現實資源", "專長與隱藏潛能", "被忽略的危機", "破局的轉機", "最後的收穫歸宿"], hint: "遇到十字路口？一次盤點所有現況", exampleQuestion: "我最近面臨人生十字路口，不知該怎麼全盤整理生活並找到方向？" },

  // 9 cards
  { id: "matrix", name: "九宮格全局觀", count: 9, positions: ["目前心境", "潛意識動機", "外界觀感", "舊有基礎", "核心干擾", "意外助力", "預期發展", "意外轉折", "最終成就"], hint: "拉遠視角，看懂未來的長遠局勢與變化", exampleQuestion: "未來半年內，我若開啟新副業的整體局勢會是如何？" },

  // 10 cards
  { id: "celtic", name: "凱爾特十字", count: 10, positions: ["現況", "挑戰與阻礙", "顯意識目標", "潛意識與過去", "可能預期結果", "近未來", "自我認知", "外在環境影響", "希望與恐懼", "最終結果"], hint: "塔羅最經典！像剝洋蔥般，把複雜問題看到透", exampleQuestion: "我目前深陷生活與財務壓力中，我該如何看清全局並突破現狀？" },

  // 12 cards
  { id: "astrology", name: "黃道十二宮", count: 12, positions: ["本命自我(一)", "財富資源(二)", "溝通學習(三)", "家庭根基(四)", "愛情創造(五)", "健康服務(六)", "伴侶合作(七)", "變革與深層恐懼(八)", "理想與遠行(九)", "事業成就(十)", "人際願景(十一)", "潛意識與秘密(十二)"], hint: "結合占星宮位，進行全面大體檢", exampleQuestion: "請幫我看看明年整年度在十二個生活領域中，各別的運勢發展？" },
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

export const TAROT_TRIVIA = [
  "偉特塔羅牌由亞瑟·偉特設計、帕梅拉繪製，是目前最普及的版本。",
  "塔羅牌共有78張：22張大阿爾克那代表靈魂課題，56張小阿爾克那代表日常細節。",
  "抽牌時保持心情平靜，深呼吸三次，有助於直覺與牌卡產生連結。",
  "逆位牌不一定代表壞事，通常暗示能量的阻礙、延遲，或需要反思的內在層面。",
  "愚者（The Fool）編號為 0，代表無限的可能性與未知的旅程，是所有牌的起點。",
  "寶劍牌組與「風」元素有關，代表理智與溝通；聖杯與「水」有關，代表情感與關係。",
  "權杖牌組與「火」有關，代表行動力與熱情；錢幣與「土」有關，代表物質與現實基礎。",
  "別害怕抽到「死神」或「高塔」，它們通常代表結束舊有模式、帶來實質的改變與重生。"
];
