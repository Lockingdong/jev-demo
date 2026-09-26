import { PresetScenario } from "./types";

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "noul-ramen-complaint",
    title: "🍜 Noul 布林判定：拉麵負評危機審查",
    category: "Noul (布林判定)",
    badge: "Noul 範例",
    description: "輸出 0.0 ~ 1.0 真實機率值，判定顧客負評是否包含重大態度衝突或公關危機。",
    model: "typesafe/jev-1.13",
    state:
      "排隊一小時結果湯鹹得像醬油、肉全肥油。跟店員反應竟然被翻白眼說本來就這樣，服務態度極差，發誓絕不再來！",
    questions: {
      is_crisis_review: {
        type: "noul",
        instructions: "評論是否屬態度惡劣或抵制言論之危機負評？",
        criteria: {
          true: "指控店員態度差、強烈指責雷店或呼籲抵制",
          false: "一般口味鹹淡偏好反映或客觀普通評價",
        },
      },
    },
  },
  {
    id: "choice-steakhouse-feedback",
    title: "🥩 Choice 單選分類：牛排館客訴主因",
    category: "Choice (單選分類)",
    badge: "Choice 範例",
    description: "在常見客訴維度中計算各選項機率，自動精準定位核心不滿癥結點。",
    model: "typesafe/jev-1.13",
    state:
      "五分熟牛排煎成全熟焦柴，反應後重做竟然等了 40 分鐘，朋友都吃飽了我的才來。結帳照收服務費且無致歉，體驗超差。",
    questions: {
      primary_complaint_cause: {
        type: "choice",
        instructions: "此則負評最主要核心不滿為何？",
        criteria: {
          food_doneness_failure: "熟度失誤（全熟焦柴）",
          kitchen_remake_delay: "重做等待過久（等 40 分鐘）",
          service_compensation_lacking: "缺乏補償與致歉",
          price_value_mismatch: "消費高價但體驗落差大",
        },
      },
    },
  },
  {
    id: "score-hotpot-satisfaction",
    title: "🍲 Score 階梯量規：麻辣火鍋滿意度",
    category: "Score (階梯評分)",
    badge: "Score 範例",
    description: "透過 0 ~ 4 階梯量規評估全篇評價，輸出浮點星級分數與活躍等級高亮。",
    model: "typesafe/jev-1.13",
    state:
      "紅白鴛鴦鍋底香濃溫潤，溫體牛與鴨血極為驚艷，加湯服務勤快且招待烏梅汁與冰淇淋，全家吃得非常滿意，一定會再回訪！",
    questions: {
      dining_satisfaction_score: {
        type: "score",
        instructions: "評估顧客用餐綜合滿意度等級（0~4 分）？",
        criteria: [
          "0 分 (極差) - 難吃且服務惡劣，極度不滿",
          "1 分 (欠佳) - 多項關鍵失誤，體驗不佳",
          "2 分 (普通) - 中規中矩，符合基本期待",
          "3 分 (滿意) - 菜品美味服務好，愉快推薦",
          "4 分 (驚艷) - 食材招待極致驚艷，必回訪",
        ],
      },
    },
  },
];
