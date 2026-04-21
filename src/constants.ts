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
  { id: "choice", name: "命運二擇一", count: 5, positions: ["決策當下的現況", "選擇A的發展軌跡", "選擇A的結果", "選擇B的發展軌跡", "選擇B的結果"], hint: "面對岔路時，推演不同選擇的發展與結果（可擴展至十擇一）", exampleQuestion: "我該留在原公司，還是接受獵頭提供的新 offer？" },
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
