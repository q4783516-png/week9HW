# SynapsePKB - 個人認知知識庫 (Personal Knowledge Base)

> 專為長期保存資訊、累積個人主觀思考、探索知識網絡與觀點演進而設計的現代個人知識庫。
>
> 依據《專案概念規格》設計與實作，落實「**原始資料與個人認知徹底分開**」與「**以個人認知為核心**」之第一版（V1）全功能應用。

---

## 🌟 核心理念與產品哲學

1. **原始資料與個人認知徹底分開**：
   - **原始資料（Records）**：文章、網址、引用與筆記摘錄，保存客觀事實出處。
   - **AI 整理內容（AI Metadata）**：客觀摘要與概念標籤建議，清楚標示來源性質，絕不冒充使用者觀點，絕不覆寫原始內容。
   - **個人認知（Thoughts）**：使用者自身的心得（Insight）、待解疑問（Question）、批判質疑（Objection）、跨界聯想（Association）與觀點演進（Evolution）。
   - **知識整理（Topics）**：跨來源與想法的主題集合，持續追蹤核心的「未解疑問清單」。
2. **知識是網絡，不只是資料夾**：
   - 支援多對多關聯（同一筆資料可屬於多個主題，一個想法可連結多個來源）。
   - 互動式知識圖譜清楚區隔「**使用者確認之關聯**」（實線）與「**AI 提出之建議關聯**」（虛線高亮）。
3. **降低紀錄負擔（Low Capture Friction）**：
   - 快速新增面板支援「僅存網址」（具備容錯保存）、「片段文字」與「獨立想法」（不必強制先選來源）。
   - 收件匣（Inbox）集中存放待閱讀或待整理資料，標記已讀後依然安全保存在庫中，不遺失身分與連結。
4. **100% 本地隱私與長期資料可攜性（Obsidian 相容）**：
   - Local-First 本地優先架構，所有資料存於瀏覽器端，無外洩風險。
   - 支援完整 JSON 備份與一鍵還原。
   - 支援一鍵匯出符合 **Obsidian Vault** 規範的 Markdown 壓縮包（含 YAML Frontmatter 與 `[[wikilinks]]` 雙向連結）。

---

## 🚀 核心功能導覽

| 功能模組 | 規格落實說明 |
| :--- | :--- |
| **首頁 Dashboard** | 總覽近期紀錄、待處理收件匣統計、個人認知演進流、主題未解問題追蹤與快速入口。 |
| **快速新增 Quick Add** | 三合一極簡輸入面板（網址/文字/個人想法），支援快捷儲存與多來源關聯。 |
| **收件匣 Inbox** | 集中管理 `unread` 待讀資料，提供一鍵標記已讀、記錄想法、觸發 AI 輔助建議與歸屬主題。 |
| **原始紀錄 Records** | 依格式（網址/文字/引述）與狀態篩選，查看原始出處、AI 客觀摘要與關聯的想法清單。 |
| **個人想法 Thoughts** | 具備 5 種認知標籤（💡 心得、❓ 疑問、⚠️ 批判、🔗 聯想、🔄 觀點演進），呈現認知歷程。 |
| **主題與集合 Topics** | 多對多主題聚合，內建「待解決之核心問題 (Unresolved Questions)」清單追蹤。 |
| **知識圖譜 Graph View** | HTML5 Canvas 互動式網絡圖，支援節點拖曳、力導向佈局、節點檢視、手動關聯與 AI 建議審核。 |
| **資料管理與設定** | 完整 JSON 備份與還原、Obsidian Vault ZIP 打包下載、載入虛構測試資料、淺色/深色/系統主題切換。 |

---

## 🛠️ 技術選型與架構決策

- **建置工具**：Vite 6 + TypeScript 5.7
- **前端框架**：React 18 / 19 (Component-based + Custom Hooks)
- **樣式與主題**：Tailwind CSS v3（支援深色 Dark Mode 與淺色 Light Mode 無縫切換）
- **圖標庫**：Lucide React
- **資料儲存**：Local-First Storage Engine (具備訂閱發布模式與多頁籤同步)
- **知識網絡視覺化**：HTML5 Canvas 物理力導向知識圖譜
- **Obsidian 匯出**：JSZip 客戶端零伺服器打包
- **測試框架**：Vitest 3 + JSDOM + Testing Library (18 個單元測試全數通過)

---

## 💻 快速開始

### 環境需求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安裝與啟動
```bash
# 1. 複製專案並安裝依賴
npm install

# 2. 啟動本機開發伺服器
npm run dev

# 3. 執行單元測試
npm run test

# 4. 生產版本建置（含 TypeScript 型別檢查）
npm run build

# 5. 預覽生產版本
npm run preview
```

---

## 📦 GitHub Pages 部署指南

專案已預先設置好 `.github/workflows/deploy.yml` 與相對路徑 `base: './'`。

1. **推送程式碼至 GitHub 倉庫**：
   ```bash
   git add .
   git commit -m "feat: complete SynapsePKB v1"
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. **啟用 GitHub Pages**：
   - 進入 GitHub 倉庫的 **Settings** -> **Pages**。
   - 在 **Build and deployment** 下方的 **Source** 選擇 **GitHub Actions**。
   - 每次推送到 `main` 分支時，GitHub Actions 會自動執行單元測試、建置並自動部署。

---

## 📂 專案檔案結構

```
.
├── .github/workflows/deploy.yml # GitHub Pages 自動化部屬工作流
├── docs/                        # 專案架構與規範文件
│   ├── specification_analysis.md# 規格深度分析與需求對照
│   ├── architecture.md          # 系統架構與技術決策
│   ├── data_model_and_obsidian.md# 資料模型與 Obsidian 相容規範
│   └── deployment_guide.md      # 部署與驗收指南
├── skills/                      # Antigravity 技能擴充
│   ├── knowledge-curator/SKILL.md # 原始資料客觀整理技能
│   └── thought-synthesizer/SKILL.md# 個人認知探索與演進技能
├── src/
│   ├── components/              # 導航、側邊欄、快速新增對話框
│   ├── data/fixtures.ts         # 豐富虛構測試資料（無任何個人隱私）
│   ├── hooks/useKnowledgeBase.ts# 響應式資料倉儲 Hook
│   ├── services/                # 儲存層、Obsidian 匯出、全文檢索、AI 輔助
│   ├── types/index.ts           # 核心型別定義
│   ├── views/                   # 首頁、收件匣、紀錄、想法、主題、圖譜、設定
│   ├── App.tsx                  # 頂層視圖路由與協同
│   └── main.tsx                 # React 渲染入口
├── tests/                       # 單元與整合測試
├── AGENTS.md                    # AI 代理協作規範與權責邊界
├── 專案概念規格.md              # 產品唯一依據概念規格書
└── package.json
```

---

## 🧪 測試驗證成果

專案內建完整單元與整合測試，覆蓋資料模型、隔離原則、搜尋引擎、Obsidian 匯出與 UI 組件：
- `tests/storage.test.ts`：7 個測試（驗證新增、刪除、收件匣流程、認知不覆寫原始記錄原則、未解問題追蹤、JSON 匯出還原）。
- `tests/obsidianExporter.test.ts`：5 個測試（驗證 YAML Frontmatter、AI 聲明 Callout、`[[wikilinks]]` 雙向連結、ZIP 打包）。
- `tests/searchEngine.test.ts`：4 個測試（驗證全文檢索、狀態篩選、認知類型篩選、AI 啟發分析不變性）。
- `tests/App.test.tsx`：2 個測試（驗證視圖初始化與快速新增面板渲染）。

**測試結果：4 個測試套件，18 項測試全部通過 (100% Pass)。**
