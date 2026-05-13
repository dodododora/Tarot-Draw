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

// ─── Thoth Tarot ───────────────────────────────────────────────────────────────

export const THOTH_MAJOR_ARCANA: TarotCard[] = [
  { id: 0, nameCN: "愚者", nameEN: "The Fool" },
  { id: 1, nameCN: "魔術師", nameEN: "The Magus" },
  { id: 2, nameCN: "女祭司", nameEN: "The Priestess" },
  { id: 3, nameCN: "皇后", nameEN: "The Empress" },
  { id: 4, nameCN: "皇帝", nameEN: "The Emperor" },
  { id: 5, nameCN: "教皇", nameEN: "The Hierophant" },
  { id: 6, nameCN: "戀人", nameEN: "The Lovers" },
  { id: 7, nameCN: "戰車", nameEN: "The Chariot" },
  { id: 8, nameCN: "調節", nameEN: "Adjustment" },
  { id: 9, nameCN: "隱者", nameEN: "The Hermit" },
  { id: 10, nameCN: "命運", nameEN: "Fortune" },
  { id: 11, nameCN: "慾望", nameEN: "Lust" },
  { id: 12, nameCN: "倒吊人", nameEN: "The Hanged Man" },
  { id: 13, nameCN: "死亡", nameEN: "Death" },
  { id: 14, nameCN: "藝術", nameEN: "Art" },
  { id: 15, nameCN: "惡魔", nameEN: "The Devil" },
  { id: 16, nameCN: "高塔", nameEN: "The Tower" },
  { id: 17, nameCN: "星星", nameEN: "The Star" },
  { id: 18, nameCN: "月亮", nameEN: "The Moon" },
  { id: 19, nameCN: "太陽", nameEN: "The Sun" },
  { id: 20, nameCN: "新紀元", nameEN: "The Aeon" },
  { id: 21, nameCN: "宇宙", nameEN: "The Universe" },
];

const THOTH_SUITS = [
  { cn: "權杖", en: "Wands" },
  { cn: "聖杯", en: "Cups" },
  { cn: "寶劍", en: "Swords" },
  { cn: "圓盤", en: "Disks" },
];

const THOTH_RANKS = [
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
  { cn: "公主", en: "Princess" },
  { cn: "王子", en: "Prince" },
  { cn: "皇后", en: "Queen" },
  { cn: "騎士", en: "Knight" },
];

export const THOTH_MINOR_ARCANA: TarotCard[] = THOTH_SUITS.flatMap((suit, sIdx) =>
  THOTH_RANKS.map((rank, rIdx) => ({
    id: 22 + sIdx * 14 + rIdx,
    nameCN: `${suit.cn}${rank.cn}`,
    nameEN: `${rank.en} of ${suit.en}`,
  }))
);

export const THOTH_ALL_CARDS = [...THOTH_MAJOR_ARCANA, ...THOTH_MINOR_ARCANA];

export const THOTH_TRIVIA: string[] = [
  "托特塔羅牌由阿萊斯特·克勞利 (Aleister Crowley) 與畫家芙瑞達·哈里斯 (Frieda Harris) 女士共同創作，耗時五年完成。",
  "托特牌融入了占星學、卡巴拉生命之樹、鍊金術、古埃及神話與易經，是符號學與神祕學密度最高的塔羅牌。",
  "與偉特牌不同，托特牌的「正義」與「力量」分別改名為「調節 (Adjustment)」與「慾望 (Lust)」，且排在第 8 與第 11 的位置。",
  "托特牌的小秘儀宮廷牌結構與傳統不同，分別是：公主 (Princess)、王子 (Prince)、皇后 (Queen)、騎士 (Knight)。",
  "在托特系統中，錢幣 (Pentacles) 被替換為圓盤 (Disks)，象徵物質界更為動態與宇宙尺度的能量。",
  "克勞利認為舊時代（奧西里斯時代）已經結束，世界進入了荷魯斯的新紀元，因此將第 20 張牌「審判」改名為「新紀元 (The Aeon)」。",
  "傳統的「節制 (Temperance)」在托特牌中被改為「藝術 (Art)」，強調鍊金術中火與水結合的轉化與昇華過程。",
];

// ─── Lenormand ───────────────────────────────────────────────────────────────

export interface LenormandCard {
  id: number;      // 1–36
  nameCN: string;
  nameEN: string;
  suit: string;    // playing card correspondence, e.g. "♥9"
  emoji: string;   // visual symbol
  keywords: string[];
}

export const LENORMAND_CARDS: LenormandCard[] = [
  { id: 1,  nameCN: "騎士",   nameEN: "Rider",       suit: "♥9",  emoji: "🏇", keywords: ["好消息", "使者", "速度"] },
  { id: 2,  nameCN: "三葉草", nameEN: "Clover",      suit: "♣6",  emoji: "🍀", keywords: ["小確幸", "機遇", "幸運"] },
  { id: 3,  nameCN: "船",     nameEN: "Ship",        suit: "♠10", emoji: "⛵", keywords: ["旅行", "遠方", "冒險"] },
  { id: 4,  nameCN: "房屋",   nameEN: "House",       suit: "♥K",  emoji: "🏠", keywords: ["家庭", "安全", "根基"] },
  { id: 5,  nameCN: "樹",     nameEN: "Tree",        suit: "♥7",  emoji: "🌳", keywords: ["健康", "成長", "根源"] },
  { id: 6,  nameCN: "雲",     nameEN: "Clouds",      suit: "♣K",  emoji: "☁️", keywords: ["混亂", "困惑", "不確定"] },
  { id: 7,  nameCN: "蛇",     nameEN: "Snake",       suit: "♣Q",  emoji: "🐍", keywords: ["複雜", "誘惑", "迂迴"] },
  { id: 8,  nameCN: "棺材",   nameEN: "Coffin",      suit: "♠9",  emoji: "⚰️", keywords: ["結束", "轉化", "靜止"] },
  { id: 9,  nameCN: "花束",   nameEN: "Bouquet",     suit: "♠Q",  emoji: "💐", keywords: ["禮物", "驚喜", "感謝"] },
  { id: 10, nameCN: "大鐮刀", nameEN: "Scythe",      suit: "♦J",  emoji: "⚔️", keywords: ["切斷", "危險", "果斷"] },
  { id: 11, nameCN: "鞭子",   nameEN: "Whip",        suit: "♣J",  emoji: "🪢", keywords: ["衝突", "重複", "磨練"] },
  { id: 12, nameCN: "鳥",     nameEN: "Birds",       suit: "♥7",  emoji: "🐦", keywords: ["談話", "焦慮", "溝通"] },
  { id: 13, nameCN: "小孩",   nameEN: "Child",       suit: "♠J",  emoji: "👶", keywords: ["新開始", "純真", "小事"] },
  { id: 14, nameCN: "狐狸",   nameEN: "Fox",         suit: "♣9",  emoji: "🦊", keywords: ["謹慎", "欺騙", "策略"] },
  { id: 15, nameCN: "熊",     nameEN: "Bear",        suit: "♣10", emoji: "🐻", keywords: ["力量", "權威", "財富"] },
  { id: 16, nameCN: "星星",   nameEN: "Stars",       suit: "♠6",  emoji: "⭐", keywords: ["希望", "靈感", "方向"] },
  { id: 17, nameCN: "鸛鳥",   nameEN: "Stork",       suit: "♥Q",  emoji: "🦢", keywords: ["變化", "遷移", "升級"] },
  { id: 18, nameCN: "狗",     nameEN: "Dog",         suit: "♥10", emoji: "🐕", keywords: ["友誼", "忠誠", "信任"] },
  { id: 19, nameCN: "塔",     nameEN: "Tower",       suit: "♠6",  emoji: "🗼", keywords: ["機構", "孤立", "官方"] },
  { id: 20, nameCN: "花園",   nameEN: "Garden",      suit: "♠8",  emoji: "🌷", keywords: ["社交", "公眾", "聚會"] },
  { id: 21, nameCN: "山",     nameEN: "Mountain",    suit: "♣8",  emoji: "⛰️", keywords: ["阻礙", "挑戰", "堅持"] },
  { id: 22, nameCN: "十字路口",nameEN: "Crossroads",  suit: "♦Q",  emoji: "🔀", keywords: ["選擇", "岔路", "自由"] },
  { id: 23, nameCN: "老鼠",   nameEN: "Mice",        suit: "♣7",  emoji: "🐭", keywords: ["流失", "焦慮", "損耗"] },
  { id: 24, nameCN: "心",     nameEN: "Heart",       suit: "♥J",  emoji: "❤️", keywords: ["愛情", "情感", "善意"] },
  { id: 25, nameCN: "戒指",   nameEN: "Ring",        suit: "♣A",  emoji: "💍", keywords: ["承諾", "合約", "循環"] },
  { id: 26, nameCN: "書",     nameEN: "Book",        suit: "♠10", emoji: "📖", keywords: ["秘密", "知識", "學習"] },
  { id: 27, nameCN: "信",     nameEN: "Letter",      suit: "♠7",  emoji: "📬", keywords: ["消息", "文件", "溝通"] },
  { id: 28, nameCN: "男人",   nameEN: "Man",         suit: "♥A",  emoji: "🧑", keywords: ["男性主角", "他", "主角"] },
  { id: 29, nameCN: "女人",   nameEN: "Woman",       suit: "♠A",  emoji: "👩", keywords: ["女性主角", "她", "主角"] },
  { id: 30, nameCN: "百合",   nameEN: "Lily",        suit: "♠K",  emoji: "🌸", keywords: ["成熟", "純潔", "平靜"] },
  { id: 31, nameCN: "太陽",   nameEN: "Sun",         suit: "♦10", emoji: "☀️", keywords: ["成功", "活力", "光明"] },
  { id: 32, nameCN: "月亮",   nameEN: "Moon",        suit: "♥8",  emoji: "🌙", keywords: ["名聲", "直覺", "潛意識"] },
  { id: 33, nameCN: "鑰匙",   nameEN: "Key",         suit: "♦8",  emoji: "🗝️", keywords: ["解答", "成就", "開啟"] },
  { id: 34, nameCN: "魚",     nameEN: "Fish",        suit: "♦K",  emoji: "🐟", keywords: ["財務", "流動", "豐盛"] },
  { id: 35, nameCN: "錨",     nameEN: "Anchor",      suit: "♠9",  emoji: "⚓", keywords: ["穩定", "堅持", "長期"] },
  { id: 36, nameCN: "十字架", nameEN: "Cross",       suit: "♣6",  emoji: "✝️", keywords: ["命運", "負擔", "信念"] },
];

export const LENORMAND_SPREADS: Spread[] = [
  {
    id: "len-1",
    name: "單張速覽",
    count: 1,
    positions: ["指引"],
    hint: "一張牌，快速獲得今日或當下的指引",
    exampleQuestion: "今天與這位客戶的會面結果如何？"
  },
  {
    id: "len-3",
    name: "過去現在未來",
    count: 3,
    positions: ["過去的影響", "現在的狀態", "未來的走向"],
    hint: "三張連讀，看清事件的時間脈絡",
    exampleQuestion: "這段感情的過去、現在、未來走向？"
  },
  {
    id: "len-5",
    name: "五牌線陣",
    count: 5,
    positions: ["遠因", "近因", "核心現況", "近期走向", "最終結果"],
    hint: "五張成一線，從根源到結果的完整推演",
    exampleQuestion: "這份工作機會對我而言的整體發展？"
  },
  {
    id: "len-9",
    name: "九宮格全局",
    count: 9,
    positions: [
      "左上·過去背景", "上方·近期影響", "右上·外在環境",
      "左側·隱藏因素", "中心·核心主題", "右側·他人視角",
      "左下·內在感受", "下方·近期行動", "右下·最終走向"
    ],
    hint: "九張牌環繞中心，全方位透視問題的所有面向",
    exampleQuestion: "我目前這段關係的整體能量與走向如何？"
  },
];

export const LENORMAND_TRIVIA: string[] = [
  "雷諾曼牌以法國占卜師瑪麗·安·雷諾曼（Marie Anne Lenormand，1772-1843）命名，她曾為拿破崙皇后約瑟芬占卜。",
  "雷諾曼牌只有 36 張，遠少於塔羅牌的 78 張，每張牌都對應一張標準撲克牌花色，起源可追溯到德國遊戲牌。",
  "雷諾曼牌的解讀方式與塔羅截然不同——重點不在單張牌義，而在於「相鄰牌的組合」所產生的故事脈絡。",
  "雷諾曼牌沒有正逆位的概念，每張牌都以正立方式解讀，牌義傾向具體的日常事件而非抽象的心理狀態。",
  "第 28 號「男人」與第 29 號「女人」是雷諾曼牌中的「指示牌」，代表問事者本人，是牌陣中的基準點。",
  "九宮格（Grand Tableau 的縮版）是雷諾曼最經典的牌陣，透過中心牌與四周牌的位置關係進行整體解讀。",
  "雷諾曼牌中的「棺材（Coffin）」不一定代表死亡，更常見的牌義是結束、休眠或某件事物的轉化與暫停。",
  "「三葉草（Clover）」是雷諾曼牌中最輕快的牌之一，代表小小的好運與意外之喜，通常是短暫但真實的機會。",
  "「鑰匙（Key）」在雷諾曼體系中代表「是」或「必然」，通常是整張牌陣中最確定且正向的指示之一。",
  "「魚（Fish）」代表流動、財務與豐盛，最初源自占卜師將牌義與日耳曼民間傳說中「魚帶來財富」的信仰結合。",
  "完整版的大展開牌陣（Grand Tableau）需要全部 36 張牌，一次性鋪開排成 4 行 9 列，是雷諾曼最複雜的讀法。",
  "雷諾曼牌在德語系國家（德國、奧地利、瑞士）至今仍非常盛行，甚至比塔羅牌更廣泛地出現在日常占卜場合。",
];

export const THOTH_SPREADS: Spread[] = [
  { id: "single", name: "單張神諭 (支援是非題)", count: 1, positions: ["當下最需關注的變數 / 是非結論"], hint: "在紛擾中提取唯一焦點，或用於明確的是非/選擇提問", exampleQuestion: "針對今天的重要會議，我最該穩住的心態是什麼？" },
  { id: "johari", name: "盲點矩陣", count: 4, positions: ["公開區 (皆知)", "盲目區 (人知我不知)", "隱藏區 (我知人不知)", "未知區 (皆不知的潛能)"], hint: "基於周哈里窗模型，解構認知落差", exampleQuestion: "在目前的工作團隊中，我對自己角色的認知與實際情況有何落差？" },
  { id: "breakthrough", name: "破局策略", count: 4, positions: ["核心限制 (真正的瓶頸)", "錯誤的發力點 (沉沒成本)", "隱藏的槓桿 (事半功倍之處)", "關鍵行動 (第一步)"], hint: "當陷入僵局時，尋找最具性價比的突破口", exampleQuestion: "這個專案推動不下去，我該如何調整策略來破局？" },
  { id: "choice", name: "決策推演", count: 5, positions: ["當下局勢的底層邏輯", "選擇 A 的隱藏成本", "選擇 A 的最終演化", "選擇 B 的隱藏成本", "選擇 B 的最終演化"], hint: "超越單純好壞，推演不同選擇的機會成本與演化路徑", exampleQuestion: "我該選擇去大企業求穩，還是加入新創團隊承擔風險？" },
  { id: "pattern", name: "模式解構", count: 5, positions: ["觸發機制 (何時發作)", "表層防禦 (我的慣性反應)", "核心恐懼 (真正在怕什麼)", "舒適圈的代價 (為何不願改)", "阻斷慣性的行動 (如何終止)"], hint: "深入心理分析，釐清為何反覆陷入相同的困境或關係模式", exampleQuestion: "為什麼我總是在關係深入時，會下意識地想逃避？" },
  { id: "iceberg", name: "冰山深探", count: 6, positions: ["表層行為 (展現出來的)", "理性認知 (我以為的理由)", "真實情緒 (壓抑的感受)", "核心價值觀 (底層信念)", "防衛機制 (如何保護自己)", "整合策略 (如何表裡如一)"], hint: "向下挖掘，看見冰山底下的真實驅動力與防衛機制", exampleQuestion: "我明明想追求事業成功，卻總是提不起勁的深層原因是什麼？" },
  { id: "mirror", name: "關係鏡像", count: 6, positions: ["我的投射與執念", "我的真實底線", "對方的投射與防備", "對方的真實需求", "系統性摩擦 (為何衝突)", "潛在共振點 (如何破冰)"], hint: "超越誰對誰錯，透視雙方互動的系統性結構", exampleQuestion: "我與合夥人最近摩擦頻繁，這段合作關係底層的問題出在哪？" },
  { id: "hero", name: "英雄之旅", count: 7, positions: ["現狀與舒適圈", "冒險的召喚", "拒絕與內在阻力", "關鍵的導師與工具", "最深的試煉與深淵", "獲得的啟示與轉化", "帶著恩賜歸來"], hint: "以神話學框架，定位你目前處於人生哪一個敘事階段", exampleQuestion: "我決定徹底轉換跑道，這段未知的旅程將會面臨什麼樣的挑戰與成長？" },
  { id: "celtic", name: "凱爾特十字", count: 10, positions: ["現況 (問題核心)", "挑戰 (交叉影響力)", "顯意識 (你能意識到的)", "潛意識 (深層驅動力)", "過去 (歷史軌跡)", "近未來 (初步趨勢)", "自我認知 (你的視角)", "環境變數 (他人/外界影響)", "焦慮與渴望 (情緒拉扯)", "最終演化 (自然發展結果)"], hint: "最經典的全景掃描，層層剝開複雜局勢的因果鏈", exampleQuestion: "我目前面臨人生的巨大低潮，請幫我全盤檢視各個維度的問題與解法。" },
];

export const WAITE_SPREADS: Spread[] = [
  { id: "single", name: "單張神諭 (支援是非題)", count: 1, positions: ["當下的最高指引 / 是非結論"], hint: "一張牌，一個方向。可用於快速釐清狀態或詢問明確的是非題", exampleQuestion: "這份工作對我目前的靈性發展是否有益？" },
  { id: "waite-triangle", name: "身心靈對話", count: 3, positions: ["身體的感受 (物質與行動)", "心智的邏輯 (思維與焦慮)", "靈魂的渴望 (內在指引)"], hint: "當思緒混亂時，重新對齊你三個維度的真實狀態", exampleQuestion: "我最近常常感到疲憊且提不起勁，我的身心靈分別在傳遞什麼訊息？" },
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
  "偉特塔羅牌由亞瑟·偉特設計、帕梅拉繪製，是第一副將 56 張小阿爾克那全都畫出具體情境圖像的牌卡。",
  "塔羅牌共有78張：22張大阿爾克那對應重大的靈魂課題，56張小阿爾克那則對應日常生活的細節。",
  "「死神」與「高塔」並非字面上的終結，它們通常代表著舊有模式的打破、帶來實質的改變或是浴火重生。",
  "逆位牌不一定代表純粹的壞事，它們通常暗示能量的阻礙、時間的延遲，或是代表需要反思的內在層面。",
  "愚者（The Fool）編號為 0，代表無限的可能性與未知的旅程，是所有塔羅牌的起點。",
  "寶劍對應「風」元素代表理智與溝通；聖杯對應「水」代表情感與關係。",
  "權杖對應「火」元素代表行動力與熱情；錢幣對應「土」代表物質與現實基礎。",
  "15世紀初，塔羅牌最初在義大利是作為貴族間的紙牌遊戲「塔羅奇」(Tarocchini) 流傳的。",
  "大阿爾克那 (Major Arcana) 的「Arcana」一詞源自拉丁文，意指「隱藏的秘密」。",
  "著名心理學家榮格認為，塔羅牌反映了人類的「集體潛意識」與各種心理原型。",
  "塔羅牌中的星星、月亮與太陽，象徵著從靈魂深處的潛意識逐漸走向意識覺醒的過程。",
  "「命運之輪」牌面上的四個生物分別代表了占星學中的四個固定星座：獅子、金牛、水瓶與天蠍。",
  "塔羅牌四大元素：火、水、風、土，分別對應著現代撲克牌裡的梅花、紅心、黑桃與方塊。",
  "「魔術師」(The Magician) 桌上的權杖、聖杯、寶劍與錢幣，象徵著他已經掌握顯化事物的四大基礎元素。",
  "侍者、騎士、王后與國王這十六張宮廷牌，最早的靈感往往對應著真實社會中的階級或人物性格特質。",
  "小阿爾克那的數字牌從 1(王牌) 到 10，描繪了該元素能量從最初的顯現到最終發展成熟的完整循環。",
  "「倒吊人」並不是受到懲罰，他平靜的表情象徵著透過視角的轉換或是自願的犧牲來獲得更高的智慧。",
  "塔羅牌並非固定命運的宣判，相反地，它是一面反映個人潛意識狀態與能量共鳴的鏡子。",
  "透特塔羅牌 (Thoth Tarot) 亦是著名的常見版本，由克勞利與哈里斯女士共同創作，牌面融合了豐富的占星與卡巴拉神祕學符號。",
  "馬賽塔羅牌 (Tarot de Marseille) 是現存最古老的經典標準圖案，畫風多採用木刻版畫風格與紅、藍、黃等強烈基本色。",
  "凱爾特十字牌陣是最古老且經典的塔羅牌陣之一，早期由亞瑟·偉特在他 1910 年出版的《塔羅圖解》中大力推廣。",
  "「隱者」牌中的提燈內含有一顆發光的六芒星，象徵著他憑藉內在的智慧與真理之光，在黑暗中獨自摸索前進。",
  "在傳統馬賽版本中，第 8 號是「正義」、第 11 號是「力量」，而偉特為了使牌義完全對應占星學順序，將這兩張牌的編號對調。",
  "「惡魔」牌的構圖與「戀人」牌極為相似，但男女是被寬鬆的鐵鍊綁著（且未上鎖），暗示束縛往往來自於個人的自我設限與慾望。",
  "「世界」牌代表一個階段完美的結束，被生命之環圍繞的女神呼應了首張牌「愚者」的啟程，象徵完整的人生循環。",
  "小阿爾克那中的每一張「王牌 (Ace)」都畫著一隻從雲端伸出並捧著法器的神祕之手，象徵宇宙賦予該元素最初始的純粹禮物。",
  "塔羅的英文 Tarot 詞源眾說紛紜，有一說是源自義大利發音 Tarocco，亦有學者指出可能來自阿拉伯文的 turuq（意指「道途」）。",
  "早期的塔羅牌並無占卜用途，直到 18 世紀的神祕學家考特·德·蓋伯林 (Court de Gébelin) 提出論點後，才開始將其與玄學占卜做出連結。",
  "偉特塔羅牌的畫家帕梅拉女士 (Pamela Colman Smith) 也是位戲劇佈景設計師，她的經歷讓偉特塔羅的小牌充滿了舞台劇場般的戲劇張力。",
  "聖杯三經常被稱為「閨蜜牌」或「派對牌」，描繪三名女子和諧共舞舉杯，象徵了真誠的友誼、慶祝與群體共享的連結。",
  "寶劍三視覺上畫著三把劍無情地刺穿一顆心，雖然象徵心碎，但也客觀提醒著人們：悲傷與看清真相是靈魂療癒必經的痛楚。",
  "錢幣十中不僅畫了擁有財富的老人、夫妻與小孩，還有兩隻安康的白狗，代表著不只金錢，還包含家庭血脈與精神安穩的代代延續。",
  "權杖八是少數沒有畫出任何人物輪廓的小阿爾克那牌，八根整齊劃一飛在空中的權杖，精準象徵了毫無阻力、極速發展的能量。",
  "「月亮」牌底部的甲殼類生物正從深水中爬上陸地，象徵著從最深層潛意識中逐漸浮現出、難以名狀的原始恐懼。"
];
