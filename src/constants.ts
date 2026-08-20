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
  category?: string;
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
  "本站模擬實體洗牌：透過多次切牌、交錯疊合、翻轉牌疊，讓每次抽牌的結果都來自完整的洗牌過程。",
  "問題越清晰，答案越清晰。輸入問題時，盡量具體描述想了解的事，避免一次問多個問題。",
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
    name: "單張神諭",
    count: 1,
    positions: ["指引"],
    hint: "適合 Yes/No，快速確認當下方向。",
    exampleQuestion: "今天與這位客戶的會面結果如何？"
  },
  {
    id: "len-3",
    name: "過去現在未來",
    count: 3,
    positions: ["過去的影響", "現在的狀態", "未來的走向"],
    hint: "了解事件來龍去脈與後續走向。",
    exampleQuestion: "這段感情的過去、現在、未來走向？"
  },
  {
    id: "len-5",
    name: "事件推演",
    count: 5,
    positions: ["遠因", "近因", "核心現況", "近期走向", "最終結果"],
    hint: "從起因一路追蹤到最終結果。",
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
    hint: "全面掃描隱藏關鍵與盲點因素。",
    exampleQuestion: "我目前這段關係的整體能量與走向如何？"
  },
  {
    id: "len-36",
    name: "大展開牌陣",
    count: 36,
    positions: [
      // Row 1 (1–9): 過去與根源層
      "R1C1·過去的根源", "R1C2·舊有的影響", "R1C3·遠方的因", "R1C4·埋下的種子", "R1C5·過去的核心", "R1C6·留下的印記", "R1C7·已結束的篇章", "R1C8·遠因的方向", "R1C9·過去的終點",
      // Row 2 (10–18): 現實與環境層
      "R2C1·外在現況", "R2C2·近期環境", "R2C3·身邊的人", "R2C4·現實阻力", "R2C5·當下核心", "R2C6·外在助力", "R2C7·他人眼中的你", "R2C8·近期的事件", "R2C9·外在走向",
      // Row 3 (19–27): 內在與心理層
      "R3C1·內心的感受", "R3C2·隱藏的想法", "R3C3·潛意識的恐懼", "R3C4·內在的阻力", "R3C5·心理核心", "R3C6·內在的渴望", "R3C7·你真正想要的", "R3C8·情感的走向", "R3C9·內在的結局",
      // Row 4 (28–36): 未來與命運層
      "R4C1·最終的根基", "R4C2·未來的線索", "R4C3·即將到來的事", "R4C4·發展的阻礙", "R4C5·命運的核心", "R4C6·最終的助力", "R4C7·結果的形成", "R4C8·最終的方向", "R4C9·命運的歸宿"
    ],
    hint: "全部 36 張牌一次鋪開，縱讀每行掌握時間脈絡，橫讀每列把握人生維度，從指示牌（男人/女人）周圍的牌展開故事。",
    exampleQuestion: "請用大展開告訴我，接下來這段時間我的整體人生走勢如何？"
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
  "問題越清晰，答案越清晰。雷諾曼擅長回答具體的事務性問題，問題越明確，牌陣的故事脈絡就越清晰。",
];

export const THOTH_SPREADS: Spread[] = [
  { id: "single",           name: "單張速覽",    count: 1,  positions: ["當下指引"],                                                                                                                hint: "抽一張牌，快速確認 Yes/No。",                                    exampleQuestion: "針對今天的重要會議，我最該穩住的心態是什麼？" },
  { id: "johari",           name: "盲點揭露",    count: 4,  positions: ["公開區", "盲目區", "隱藏區", "未知潛能"],                                                                                  hint: "看清自我認知與他人眼中的落差。",                                  exampleQuestion: "在目前團隊中，我對自己角色的認知與實際情況有何落差？" },
  { id: "cycle",            name: "過渡期指引",  count: 5,  positions: ["正在消亡的", "正在萌芽的", "此刻的張力", "必須放下的", "必須帶走的"],                                                              hint: "看清現狀結束與新階段的開展。",                                    exampleQuestion: "邁入30歲的轉折，我該如何看待目前的職涯過渡期？" },
  { id: "breakthrough",     name: "破局策略",    count: 4,  positions: ["核心瓶頸", "沉沒成本", "隱藏槓桿", "第一步"],                                                                              hint: "陷入僵局時，找出最佳的突破點。",                                  exampleQuestion: "這個專案推動不下去，我該如何調整策略來破局？" },
  { id: "choice",           name: "岔路推演",    count: 5,  positions: ["底層邏輯", "A 的隱藏成本", "A 的演化", "B 的隱藏成本", "B 的演化"],                                                       hint: "推演不同選項的代價與未來發展。",                                  exampleQuestion: "我該選擇去大企業求穩，還是加入新創團隊承擔風險？" },
  { id: "iceberg",          name: "潛意識深索",  count: 6,  positions: ["表層行為", "理性認知", "真實情緒", "核心信念", "防衛機制", "整合策略"],                                                    hint: "挖出內心深處的防衛與真實動機。",                                  exampleQuestion: "我明明想追求事業成功，卻總是提不起勁的深層原因？" },
  { id: "mirror",           name: "關係鏡像",    count: 6,  positions: ["我的投射", "我的底線", "對方的投射", "對方需求", "系統摩擦", "共振點"],                                                    hint: "客觀看透雙方互動的真實結構。",                                    exampleQuestion: "我與合夥人摩擦頻繁，這段合作關係底層的問題出在哪？" },
  { id: "resource",         name: "現狀大盤點",  count: 6,  positions: ["北極星目標", "可用資源", "外部變數", "系統阻力", "隱藏推力", "下一里程碑"],                                                hint: "認清手邊籌碼、風險與下一步。",                                    exampleQuestion: "對於明年的創業計畫，我目前的資源與風險盤點為何？" },
  { id: "hero",             name: "英雄之旅",    count: 7,  positions: ["現狀", "冒險召喚", "內在阻力", "導師與工具", "深淵試煉", "啟示與轉化", "帶著恩賜歸來"],                                    hint: "定位你目前處於人生哪個考驗階段。",                                exampleQuestion: "我決定徹底轉換跑道，這段旅程將面臨什麼挑戰與成長？" },
  { id: "energy-resonance", name: "交會效應",    count: 5,  positions: ["我的底層渴望", "對方的底層渴望", "碰撞製造的東西", "各自迴避的部分", "去除投射後的核心"],         hint: "兩人相會時，檯面下的真實互動。",                                 exampleQuestion: "我與這個人之間的互動底層透露了什麼？" },
  { id: "mirror-mirror",    name: "內在投射鏡",  count: 5,  positions: ["你在對方身上受不了的", "這件事在你身上的根", "對方從你身上照見的", "你們共同迴避的", "這段關係真正的課題"],      hint: "從他人身上看見自己隱藏的情緒。",                                 exampleQuestion: "我在這段關係中反覆被觸發，背後真正的課題是什麼？" },
  { id: "celtic",           name: "凱爾特十字",  count: 10, positions: ["現況", "主要挑戰", "顯意識", "潛意識", "過去", "近未來", "自我認知", "外在環境", "焦慮與渴望", "最終演化"],                hint: "層層剝開複雜局勢的深層因果。",                                    exampleQuestion: "我目前面臨人生的巨大低潮，請幫我全盤檢視各維度的問題與解法。" },
  { id: "elements",         name: "四元素平衡",  count: 4,  positions: ["火・行動力", "水・情感", "風・思維", "土・物質"],                                                                          hint: "從行動、情感、思維與物質全面剖析現狀。",                           exampleQuestion: "目前的處境從四個面向來看，各自透露了什麼訊息？",         category: "深入探索" },
  { id: "now-connect",       name: "當下連結",    count: 3,  positions: ["這段關係的現狀", "我此刻展現的模樣", "對方此刻展現的模樣"],                                                              hint: "純粹照見這段關係此刻的樣子。",                                    exampleQuestion: "不問對錯，這段關係此刻各自的狀態是什麼？" },
];

export const WAITE_SPREADS: Spread[] = [
  { id: "single",         name: "單張速覽",  count: 1, positions: ["當下指引"],                                        hint: "抽一張牌，快速確認 Yes/No。",                        exampleQuestion: "這份工作對我目前的靈性發展是否有益？" },
  { id: "waite-triangle", name: "身心靈對話", count: 3, positions: ["身體感受", "心智邏輯", "靈魂渴望"],                  hint: "思緒混亂時，重新對齊內外狀態。",                     exampleQuestion: "我最近疲憊且提不起勁，身心靈分別在傳遞什麼訊息？" },
  { id: "attraction",     name: "個人引力",  count: 3, positions: ["我目前散發的頻率", "正在召喚的連結模式", "值得鬆開的舊有慣性"],  hint: "解析你目前的狀態正吸引哪種人事物。",              exampleQuestion: "我目前的狀態在感情關係中吸引著什麼？" },
  { id: "rel-seasons",    name: "感情四季",  count: 4, positions: ["現在的關係節奏", "推動這個節奏的核心力量", "需要給予的滋養", "即將來臨的自然轉變"],  hint: "找出當下最順其自然的相處模式。",    exampleQuestion: "這段感情現在處於什麼節奏？我將如何與它同行？" },
  { id: "now-connect",    name: "當下連結",    count: 3, positions: ["這段關係現在的樣子", "我目前傳遞給對方的狀態", "對方目前傳遞給我的狀態"],              hint: "純粹照見這段關係此刻的樣子。",          exampleQuestion: "不問對錯，這段關係此刻各自的狀態是什麼？" },
];

// Which spread IDs are available in each system
// Waite: narrative/event-oriented + classic structures
export const WAITE_SPREAD_IDS = [
  'single', 'waite-triangle', 'celtic',
  'cycle', 'hero',
  'attraction', 'rel-seasons', 'mirror', 'now-connect',
  'breakthrough', 'choice', 'resource',
];
// Thoth: energy-state / psychological structure
export const THOTH_SPREAD_IDS = [
  'single', 'waite-triangle',
  'johari', 'iceberg',
  'cycle',
  'energy-resonance', 'mirror-mirror', 'mirror', 'now-connect',
  'breakthrough', 'choice', 'resource',
  'elements',
];

export function getCardImagePath(
  system: 'waite' | 'thoth' | 'lenormand',
  cardId: number
): string {
  const base = '/cards';
  const sys = system;

  if (sys === 'lenormand') {
    const LENORMAND_NAMES = [
      'rider', 'clover', 'ship', 'house', 'tree',
      'clouds', 'snake', 'coffin', 'bouquet', 'scythe',
      'whip', 'birds', 'child', 'fox', 'bear',
      'stars', 'stork', 'dog', 'tower', 'garden',
      'mountain', 'crossroads', 'mice', 'heart', 'ring',
      'book', 'letter', 'gentleman', 'lady', 'lily',
      'sun', 'moon', 'key', 'fish', 'anchor', 'cross',
    ];
    const num = String(cardId).padStart(2, '0');
    return `${base}/lenormand_${num}_${LENORMAND_NAMES[cardId - 1]}.webp`;
  }

  // ── Major Arcana (id 0–21) ───────────────────────────────────────────
  if (cardId < 22) {
    const num = String(cardId).padStart(2, '0');
    const WAITE_MAJOR: Record<number, string> = {
      0: 'the-fool', 1: 'the-magician', 2: 'the-high-priestess',
      3: 'the-empress', 4: 'the-emperor', 5: 'the-hierophant',
      6: 'the-lovers', 7: 'the-chariot', 8: 'strength',
      9: 'the-hermit', 10: 'wheel-of-fortune', 11: 'justice',
      12: 'the-hanged-man', 13: 'death', 14: 'temperance',
      15: 'the-devil', 16: 'the-tower', 17: 'the-star',
      18: 'the-moon', 19: 'the-sun', 20: 'judgement', 21: 'the-world',
    };
    const THOTH_MAJOR: Record<number, string> = {
      0: 'the-fool', 1: 'the-magus', 2: 'the-priestess',
      3: 'the-empress', 4: 'the-emperor', 5: 'the-hierophant',
      6: 'the-lovers', 7: 'the-chariot', 8: 'adjustment',
      9: 'the-hermit', 10: 'fortune', 11: 'lust',
      12: 'the-hanged-man', 13: 'death', 14: 'art',
      15: 'the-devil', 16: 'the-tower', 17: 'the-star',
      18: 'the-moon', 19: 'the-sun', 20: 'the-aeon', 21: 'the-universe',
    };
    const name = sys === 'thoth' ? THOTH_MAJOR[cardId] : WAITE_MAJOR[cardId];
    return `${base}/${sys}_major_${num}_${name}.webp`;
  }

  // ── Minor Arcana (id 22–77) ──────────────────────────────────────────
  const WAITE_SUITS  = ['wands', 'cups', 'swords', 'pentacles'];
  const THOTH_SUITS  = ['wands', 'cups', 'swords', 'disks'];
  const WAITE_MINOR  = ['ace','two','three','four','five','six','seven','eight','nine','ten','page','knight','queen','king'];
  const THOTH_WANDS  = ['ace','dominion','virtue','completion','strife','victory','valour','swiftness','strength','oppression','princess','prince','queen','knight'];
  const THOTH_CUPS   = ['ace','love','abundance','luxury','disappointment','pleasure','debauch','indolence','happiness','satiety','princess','prince','queen','knight'];
  const THOTH_SWORDS = ['ace','peace','sorrow','truce','defeat','science','futility','interference','cruelty','ruin','princess','prince','queen','knight'];
  const THOTH_DISKS  = ['ace','change','works','power','worry','success','failure','prudence','gain','wealth','princess','prince','queen','knight'];
  const THOTH_MINOR  = [THOTH_WANDS, THOTH_CUPS, THOTH_SWORDS, THOTH_DISKS];

  const minorId   = cardId - 22;
  const suitIndex = Math.floor(minorId / 14);
  const cardIndex = minorId % 14;
  const suit      = sys === 'thoth' ? THOTH_SUITS[suitIndex] : WAITE_SUITS[suitIndex];
  const num       = String(cardIndex + 1).padStart(2, '0');
  const cardName  = sys === 'thoth' ? THOTH_MINOR[suitIndex][cardIndex] : WAITE_MINOR[cardIndex];

  return `${base}/${sys}_${suit}_${num}_${cardName}.webp`;
}

export function getCardEmoji(cardId: number, system?: 'waite' | 'thoth'): string {
  if (cardId < 22) {
    const MAJOR_EMOJIS = [
      "🚶", // 0 愚者
      "🧙", // 1 魔術師
      "📜", // 2 女教皇/女祭司
      "👸", // 3 皇后
      "🤴", // 4 皇帝
      "🗝️", // 5 教皇
      "💞", // 6 戀人
      "🎠", // 7 戰車
      "🦁", // 8 偉特:力量(Leo) / 托特:調節(Libra→swap)
      "🏮", // 9 隱者
      "🎡", // 10 命運之輪
      "⚖️", // 11 偉特:正義(Libra) / 托特:慾望(Leo→swap)
      "🙃", // 12 倒吊人
      "💀", // 13 死亡
      "👼", // 14 偉特:節制 / 托特:藝術
      "👿", // 15 惡魔
      "🌩️", // 16 高塔
      "⭐", // 17 星星
      "🌕", // 18 月亮
      "☀️", // 19 太陽
      "📯", // 20 偉特:審判 / 托特:新紀元
      "🌍"  // 21 世界/宇宙
    ];
    // Thoth: position 8 = 調節 Adjustment (Libra ⚖️), position 11 = 慾望 Lust (Leo 🦁)
    if (system === 'thoth') {
      const t = [...MAJOR_EMOJIS];
      t[8] = "⚖️"; t[11] = "🦁";
      return t[cardId] || "⭐";
    }
    return MAJOR_EMOJIS[cardId] || "⭐";
  }

  const suitIndex = Math.floor((cardId - 22) / 14);
  switch (suitIndex) {
    case 0: return "🪄"; // Wands
    case 1: return "🍶"; // Cups
    case 2: return cardId === 51 ? "⚔️" : "🗡️"; // Swords — Two of Swords = ⚔️, rest = 🗡️
    case 3: return system === 'thoth' ? "🔘" : "🪙"; // Disks vs Pentacles
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
  "「月亮」牌底部的甲殼類生物正從深水中爬上陸地，象徵著從最深層潛意識中逐漸浮現出、難以名狀的原始恐懼。",
  "本站模擬實體洗牌：透過多次切牌、交錯疊合、翻轉牌疊，讓每次抽牌的結果都來自完整的洗牌過程。",
  "問題越清晰，答案越清晰。輸入問題時，盡量具體描述想了解的事，避免一次問多個問題。",
];



export interface OracleInfo {
  score: number;
  message: string;
}

export const ORACLE_DATA: Record<string, Record<number, OracleInfo>> = {
  waite: {
    // Majors
    0: { score: 1, message: "跳就對了，但前路未明" },
    1: { score: 2, message: "你有資源，能量到位" },
    2: { score: 0, message: "答案在內心，需要傾聽" },
    3: { score: 2, message: "豐盛、創造、滋養" },
    4: { score: 1, message: "需要結構與紀律才行" },
    5: { score: 0, message: "看是否符合傳統或規範" },
    6: { score: 2, message: "對齊的選擇，順流" },
    7: { score: 2, message: "意志驅動，會成功" },
    8: { score: 2, message: "溫和堅定地達成" },
    9: { score: 0, message: "現在不是時候，需獨處" },
    10: { score: 1, message: "機運轉動，傾向好" },
    11: { score: 0, message: "因果決定，看你做了什麼" },
    12: { score: -1, message: "停滯,需要轉換視角" },
    13: { score: -1, message: "必須結束才能開始" },
    14: { score: 1, message: "會成,但需要耐心與平衡" },
    15: { score: -2, message: "被困住,有執著或誘惑" },
    16: { score: -2, message: "崩壞、突發、否" },
    17: { score: 2, message: "希望、療癒、Yes" },
    18: { score: -1, message: "迷霧、不明朗、暫不宜" },
    19: { score: 2, message: "最強烈的 Yes" },
    20: { score: 1, message: "重生、覺醒,通常正面" },
    21: { score: 2, message: "圓滿達成" },
    // Wands (22-35)
    22: { score: 2, message: "新火花,行動的開始" },
    23: { score: 1, message: "規劃中,前景看好" },
    24: { score: 2, message: "拓展,船已啟航" },
    25: { score: 2, message: "慶祝、穩固、團圓" },
    26: { score: -1, message: "競爭與衝突" },
    27: { score: 2, message: "勝利、被認可" },
    28: { score: 0, message: "需堅守立場才能贏" },
    29: { score: 2, message: "快速進展、訊息來" },
    30: { score: 0, message: "疲憊但接近終點" },
    31: { score: -1, message: "負擔過重,難以為繼" },
    32: { score: 1, message: "新機會、新想法" },
    33: { score: 1, message: "衝動行動,結果快但急" },
    34: { score: 2, message: "自信、魅力、成功" },
    35: { score: 2, message: "領導力、願景實現" },
    // Cups (36-49)
    36: { score: 2, message: "情感豐沛、新關係" },
    37: { score: 2, message: "連結、互相、和諧" },
    38: { score: 2, message: "慶祝、友誼、開心" },
    39: { score: -1, message: "冷漠、錯失、不滿" },
    40: { score: -2, message: "失落、後悔" },
    41: { score: 1, message: "懷舊、回歸、純粹" },
    42: { score: 0, message: "太多選項、幻想多" },
    43: { score: -1, message: "離開、放下、轉身" },
    44: { score: 2, message: "願望實現之牌" },
    45: { score: 2, message: "圓滿幸福" },
    46: { score: 1, message: "直覺訊息、新感受" },
    47: { score: 1, message: "浪漫提案、感性行動" },
    48: { score: 1, message: "直覺準、情感成熟" },
    49: { score: 1, message: "情緒穩定、有智慧" },
    // Swords (50-63)
    50: { score: 1, message: "清晰、突破、真相" },
    51: { score: 0, message: "僵局、無法決定" },
    52: { score: -2, message: "心碎、傷害" },
    53: { score: 0, message: "休息、暫停、不動" },
    54: { score: -2, message: "衝突、空虛勝利" },
    55: { score: 1, message: "渡過、移動到更好處" },
    56: { score: -1, message: "欺瞞、不光明的手段" },
    57: { score: -1, message: "自我設限、看似困住" },
    58: { score: -2, message: "焦慮、惡夢" },
    59: { score: -2, message: "結束、低谷" },
    60: { score: 0, message: "觀察中、消息未明" },
    61: { score: 1, message: "快速行動,但急躁" },
    62: { score: 0, message: "理性判斷、孤獨" },
    63: { score: 1, message: "智慧決斷、客觀" },
    // Pentacles (64-77)
    64: { score: 2, message: "物質新機會、實在" },
    65: { score: 0, message: "平衡中、看處理能力" },
    66: { score: 2, message: "合作、技藝、被認可" },
    67: { score: 0, message: "守成、不願改變" },
    68: { score: -2, message: "匱乏、被排除" },
    69: { score: 1, message: "給予與接受平衡" },
    70: { score: 0, message: "評估中、需耐心" },
    71: { score: 1, message: "努力學習、累積中" },
    72: { score: 2, message: "獨立豐盛" },
    73: { score: 2, message: "長期富足、家族" },
    74: { score: 1, message: "學習新事物、機會" },
    75: { score: 1, message: "緩慢但穩定前進" },
    76: { score: 2, message: "豐盛照料、實際" },
    77: { score: 2, message: "物質成功、穩固" },
  },
  thoth: {
    // Majors
    0: { score: 1, message: "純粹開始,信任之躍" },
    1: { score: 2, message: "意志與技藝兼備" },
    2: { score: 0, message: "神秘、需內省" },
    3: { score: 2, message: "創造、愛、豐盛" },
    4: { score: 1, message: "需建立權威結構" },
    5: { score: 0, message: "看是否合於傳統" },
    6: { score: 1, message: "結合的選擇,需審視" },
    7: { score: 2, message: "勝利、推進" },
    8: { score: 0, message: "業力平衡、看公正" },
    9: { score: 0, message: "內在探尋,慢" },
    10: { score: 1, message: "輪轉,傾向有利" },
    11: { score: 2, message: "強烈生命力、駕馭" },
    12: { score: -1, message: "犧牲、停滯" },
    13: { score: -1, message: "轉化,但需經歷結束" },
    14: { score: 2, message: "煉金、整合、成功" },
    15: { score: -1, message: "物質、慾望,但有力量" },
    16: { score: -2, message: "突發瓦解" },
    17: { score: 2, message: "希望、療癒" },
    18: { score: -2, message: "幻象、迷失、最暗的時刻" },
    19: { score: 2, message: "光明、活力、Yes" },
    20: { score: 1, message: "覺醒、新時代" },
    21: { score: 2, message: "圓滿完成" },
    // Wands
    22: { score: 2, message: "火的根源、創造力" },
    23: { score: 1, message: "主宰、規劃中" },
    24: { score: 2, message: "美德、堅定的善" },
    25: { score: 2, message: "完成、穩固" },
    26: { score: -2, message: "衝突、爭鬥" },
    27: { score: 2, message: "勝利" },
    28: { score: 0, message: "勇氣對抗,結果不定" },
    29: { score: 2, message: "迅速、訊息到" },
    30: { score: 1, message: "巨大力量、接近完成" },
    31: { score: -2, message: "壓迫、過度" },
    32: { score: 1, message: "火元素青春" },
    33: { score: 2, message: "行動力強的領導者" },
    34: { score: 2, message: "火元素的成熟力量" },
    35: { score: 1, message: "衝擊力、果決" },
    // Cups
    36: { score: 2, message: "情感之源" },
    37: { score: 2, message: "愛、和諧結合" },
    38: { score: 2, message: "豐盈、滿溢" },
    39: { score: -1, message: "享樂中藏著厭倦" },
    40: { score: -2, message: "失望" },
    41: { score: 1, message: "愉悅、但短暫" },
    42: { score: -2, message: "沉溺、腐敗" },
    43: { score: -2, message: "倦怠、放棄" },
    44: { score: 2, message: "幸福、願望牌" },
    45: { score: 1, message: "滿足、但接近滿溢點" },
    46: { score: 1, message: "細膩、夢幻" },
    47: { score: 1, message: "浪漫、變動" },
    48: { score: 1, message: "情感深邃" },
    49: { score: 1, message: "感性行動者" },
    // Swords
    50: { score: 1, message: "風的根源、清晰" },
    51: { score: 1, message: "暫時的平衡與和解" },
    52: { score: -2, message: "悲傷、心碎" },
    53: { score: 0, message: "停戰、暫歇" },
    54: { score: -2, message: "失敗" },
    55: { score: 1, message: "智識成功、平衡" },
    56: { score: -2, message: "徒勞、計謀失敗" },
    57: { score: -1, message: "干擾、阻礙" },
    58: { score: -2, message: "殘酷、絕望" },
    59: { score: -2, message: "毀滅、結束" },
    60: { score: 0, message: "觀察、不穩定" },
    61: { score: 1, message: "思想行動者、急" },
    62: { score: 0, message: "敏銳、孤立" },
    63: { score: 1, message: "思想衝鋒、快" },
    // Disks
    64: { score: 2, message: "物質根源、新基礎" },
    65: { score: 0, message: "變動中、需靈活" },
    66: { score: 2, message: "工作完成、被肯定" },
    67: { score: 1, message: "守成的力量" },
    68: { score: -2, message: "擔憂、匱乏" },
    69: { score: 2, message: "物質成功" },
    70: { score: -2, message: "失敗、徒勞" },
    71: { score: 1, message: "謹慎、技藝累積" },
    72: { score: 2, message: "獲得、豐盛" },
    73: { score: 2, message: "富足、巔峰" },
    74: { score: 1, message: "實際、成長中" },
    75: { score: 1, message: "穩定建設者" },
    76: { score: 2, message: "豐盛照料" },
    77: { score: 1, message: "緩慢穩固" },
  },
  lenormand: {
    1: { score: 2, message: "好消息來、Yes" },
    2: { score: 2, message: "小幸運、Yes" },
    3: { score: 1, message: "進展中、有方向" },
    4: { score: 1, message: "穩定、家、安全" },
    5: { score: 0, message: "緩慢、健康相關需耐心" },
    6: { score: -2, message: "混亂、不明、No" },
    7: { score: -1, message: "複雜、欺瞞、繞路" },
    8: { score: -2, message: "結束、停止" },
    9: { score: 2, message: "禮物、美好、Yes" },
    10: { score: -2, message: "突然中斷、切斷" },
    11: { score: -2, message: "衝突、爭吵、否" },
    12: { score: 0, message: "焦慮、八卦、看情況" },
    13: { score: 1, message: "新開始、小規模 Yes" },
    14: { score: -1, message: "警覺、有詐" },
    15: { score: 1, message: "力量、財富、保護" },
    16: { score: 2, message: "希望、引導、Yes" },
    17: { score: 1, message: "改變、通常正面" },
    18: { score: 2, message: "忠誠、朋友、Yes" },
    19: { score: 0, message: "結構、官方、孤立" },
    20: { score: 1, message: "公開場合、社交、Yes" },
    21: { score: -2, message: "阻礙、停滯、No" },
    22: { score: 0, message: "選擇、岔路" },
    23: { score: -2, message: "損失、被侵蝕" },
    24: { score: 2, message: "愛、真心、Yes" },
    25: { score: 1, message: "承諾、契約" },
    26: { score: 0, message: "秘密、未知、學習" },
    27: { score: 1, message: "消息來、文件" },
    28: { score: 0, message: "代表人物" },
    29: { score: 0, message: "代表人物" },
    30: { score: 1, message: "純粹、成熟、和諧" },
    31: { score: 2, message: "成功、最強 Yes" },
    32: { score: 1, message: "認可、情緒、有名望" },
    33: { score: 2, message: "確定、解答、Yes" },
    34: { score: 1, message: "財富、流動" },
    35: { score: 1, message: "穩定、長久" },
    36: { score: -2, message: "負擔、苦難" },
  }
};
