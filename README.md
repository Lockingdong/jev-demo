# ⚡ Jev Model (System One) Local Demo 專案

本專案是依據 [OpenRouter System One API 官方文件](https://openrouter.ai/docs/api/api-reference/systemone/submit-a-system-one-request) 所打造的本機互動式 Web 視覺化 Demo 儀表板，專門展示與測試 TypeSafe 開發的 **Jev** 決策模型（`typesafe/jev-1.13`）。

---

## 🌟 核心特色

1. **極速單一指令啟動**：基於 Next.js App Router 全端架構，內建 `/api/systemone` 伺服端代理轉發，免除前端 CORS 問題，同時確保 API Key 隱私安全。
2. **純 `.env.local` 設定**：僅讀取本機環境變數 `OPENROUTER_API_KEY`，前端介面自動偵測連線狀態。
3. **精簡直覺的 3 大餐點評論專屬情境 (Noul / Choice / Score 各一組)**：
   - 🍜 **Noul 布林判定**：拉麵負評危機審查（輸出 0.0 ~ 1.0 真實機率值，判斷是否為公關危機級負評）
   - 🥩 **Choice 單選分類**：牛排館客訴主因（多維度客訴分析，自動定位主要核心不滿癥結點）
   - 🍲 **Score 階梯量規**：麻辣火鍋滿意度（0 ~ 4 階梯量規浮點評分與滿意度等級活躍高亮）
4. **完整支援三種 Jev 決策問題類型**：
   - **`noul`（布林機率判定）**：輸出 0.0 ~ 1.0 的機率值，並附帶 `true` / `false` 判定準則與百分比進度條。
   - **`choice`（分類選擇）**：自動選出最佳方案（Winner Badge）、計算信心指數（Confidence %）以及所有候選選項的機率分佈長條圖。
   - **`score`（階梯量規數值評分）**：自訂 0 ~ N 級的階梯描述，輸出浮點數評分、階梯活躍高亮與各等級機率分佈。
5. **高度可自訂與除錯體驗**：
   - 即時編輯 `state`（支援純文字或多層 JSON 物件，具備一鍵美化功能）。
   - 動態新增、刪除、修改 questions 及其 criteria。
   - 即時推論耗時（Latency ms）、Token 用量（Input / Output）、估算費用（Cost in USD）。
   - 一鍵切換檢視「視覺化決策報告」、「原始 API 回應 (JSON)」、「送出 Payload (JSON)」，並支援一鍵複製。
   - 快捷鍵支援：按下 `⌘ + Enter` 或 `Ctrl + Enter` 即可快速觸發評估。

---

## 🚀 快速開始

### 1. 配置 OpenRouter API Key

在專案根目錄建立 `.env.local` 檔案（可參考 `.env.example`）：

```bash
# 建立並編輯 .env.local
echo "OPENROUTER_API_KEY=sk-or-v1-你的OpenRouter金鑰" > .env.local
```

### 2. 啟動本機開發伺服器

```bash
npm run dev
```

啟動後，使用瀏覽器開啟：
👉 **http://localhost:3000**

---

## 🛠️ 專案架構一覽

```
jev-demo/
├── app/
│   ├── api/
│   │   └── systemone/
│   │       └── route.ts         # 後端 API Proxy：讀取 .env.local 轉發 OpenRouter /systemone
│   ├── globals.css              # 精美暗黑玻璃擬態 (Glassmorphism) 設計系統與視覺化樣式
│   ├── layout.tsx               # 根 Layout
│   └── page.tsx                 # 主互動儀表板頁面
├── components/
│   ├── Header.tsx               # 頂部導覽列（模型切換、Key 狀態檢查、官方文件連結）
│   ├── PresetSelector.tsx       # 生活化情境快速切換卡片
│   ├── StateEditor.tsx          # State 內容輸入編輯器（支援 JSON/Text 與格式化）
│   ├── QuestionsBuilder.tsx     # 決策問題建置器（支援 noul / choice / score 之 CRUD）
│   └── ResultsViewer.tsx        # 視覺化結果卡片、機率條、量規與 JSON 檢視器
├── lib/
│   ├── presets.ts               # 生活化情境範本資料集
│   └── types.ts                 # Jev System One API 與專案 TypeScript 型別定義
├── .env.example                 # 環境變數範本
├── package.json
└── README.md
```

---

## 📖 Jev API 規範說明 (OpenRouter System One)

- **API Endpoint**: `POST https://openrouter.ai/api/v1/systemone`
- **相容 Model ID**: `typesafe/jev-1.13`（或簡寫 `jev-1.13`）
- **主要請求結構**:
  ```json
  {
    "model": "typesafe/jev-1.13",
    "state": { "ticket": "...", "tier": "..." },
    "questions": {
      "is_bug": {
        "type": "noul",
        "instructions": "是否為軟體缺陷？",
        "criteria": { "true": "...", "false": "..." }
      },
      "team": {
        "type": "choice",
        "instructions": "應由哪個團隊負責？",
        "criteria": { "payments": "...", "frontend": "..." }
      },
      "urgency": {
        "type": "score",
        "instructions": "緊急程度等級？",
        "criteria": ["可等待下次發版", "本週修復", "阻塞金流中"]
      }
    }
  }
  ```
