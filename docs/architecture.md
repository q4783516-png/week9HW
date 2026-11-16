# 系統架構與技術方案設計

## 1. 系統整體架構

本系統名為 **SynapsePKB (個人認知知識庫)**，依據《專案概念規格》設計，定位為輕量、可靠、個人認知優先且具備高度資料可攜性的現代知識管理系統。

```
+--------------------------------------------------------------------------+
|                            SynapsePKB Web App                            |
|                                                                          |
|  +--------------------+  +----------------------+  +------------------+  |
|  |     Views / UI     |  |   Knowledge Engine   |  |  Data Management |  |
|  |  - Dashboard       |  |  - Full-Text Search  |  |  - JSON Backup   |  |
|  |  - Inbox           |  |  - Graph / Link Mesh |  |  - JSON Restore  |  |
|  |  - Records (Raw)   |  |  - Topic Aggregator  |  |  - Obsidian Zip  |  |
|  |  - Thoughts (Cog.) |  |  - Assistant (AI/    |  |    Exporter      |  |
|  |  - Collections     |  |    Heuristic Analyzer|  |  - Fixture Seed  |  |
|  |  - Graph View      |  |                      |  |                  |  |
|  +--------------------+  +----------------------+  +------------------+  |
|                                     |                                    |
|                       +---------------------------+                      |
|                       |  State / Repository Layer |                      |
|                       |   (Zustand / Event Bus)   |                      |
|                       +---------------------------+                      |
|                                     |                                    |
|              +---------------------------------------------+             |
|              | Persistence Engine (IndexedDB / LocalStorage)|             |
|              +---------------------------------------------+             |
+--------------------------------------------------------------------------+
                                     |
                       +---------------------------+
                       |  Target Deploy: GH Pages  |
                       +---------------------------+
```

---

## 2. 技術選型理由與決策

| 領域 | 選定技術 | 決策考量與優勢 |
| :--- | :--- | :--- |
| **建置工具** | Vite 6 | 極速熱重載（HMR）、現代 ESM 標準、極小 Production Bundle、天然支援 GitHub Pages 靜態託管。 |
| **前端框架** | React 19 + TypeScript | 強型別防範資料結構混淆（確保 Record 與 Thought 邊界清晰）、組件化架構易於維護與單元測試。 |
| **樣式系統** | Tailwind CSS v3 / Modern CSS | 簡潔現代的設計語言（Notion / Linear 設計風格），天然支援無縫深色（Dark）/淺色（Light）模式切換。 |
| **圖標庫** | Lucide React | 豐富、簡約、現代且無額外體積負擔的向量圖標。 |
| **狀態管理與儲存** | Local-First Storage (IndexedDB + Storage Provider) | 零伺服器依賴、100% 本地隱私保障、無網路環境仍可流暢運作、容量遠超 localStorage（可達數百 MB）。 |
| **關聯網路視覺化** | Canvas-based Interactive Knowledge Graph | 輕量高效能 2D 圖形渲染，直觀展示 Record、Thought、Topic 之間的雙向網絡與 AI 建議關聯。 |
| **Obsidian 匯出** | JSZip | 客戶端一鍵生成符合 Obsidian 規格的 Markdown 壓縮包（含 Frontmatter 元資料與 `[[wikilinks]]`），無須伺服器參與。 |
| **測試框架** | Vitest + Testing Library | 與 Vite 原生整合，極速執行單元測試，全面覆蓋資料模型、搜尋、關聯與匯入匯出邏輯。 |

---

## 3. 資料結構設計（Separation of Concerns）

本系統最核心的設計原則是：**「原始資料與個人認知分開」**。

### 3.1 資料模型實體

#### A. 原始紀錄（Record）
代表使用者收藏或記錄的客觀資訊出處，不代表使用者已理解或同意。
```typescript
export interface RecordItem {
  id: string;                    // UUID
  title: string;                 // 標題或網頁名稱
  url?: string;                  // 原始網址（若有）
  rawContent: string;            // 原始內容、摘錄或筆記文字
  type: 'link' | 'text' | 'quote' | 'media';
  status: 'unread' | 'read' | 'archived'; // 收件匣待處理與已閱讀狀態
  sourceMeta?: {
    domain?: string;
    author?: string;
    savedAt: string;             // ISO 時間字串
  };
  tags: string[];                // 使用者自訂標籤
  aiMetadata?: {
    summary?: string;            // AI 摘要（需明確標示為 AI 產出）
    suggestedTags?: string[];    // AI 建議標籤
    analyzedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

#### B. 個人想法（Thought）
代表使用者個人的主觀心得、疑問、批判或認知轉變，可獨立存在，亦可關聯至一或多個來源。
```typescript
export type ThoughtType = 
  | 'insight'       // 心得與理解
  | 'question'      // 疑問與待釐清處
  | 'objection'     // 反對意見或批判
  | 'association'   // 靈感與跨領域聯想
  | 'evolution';    // 觀點轉變與認知歷程

export interface ThoughtItem {
  id: string;
  title?: string;
  content: string;               // 使用者原汁原味的想法
  thoughtType: ThoughtType;
  relatedRecordIds: string[];    // 關聯的一至多筆來源（可為空）
  topicIds: string[];            // 關聯的主題（可為空）
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

#### C. 主題與集合（Topic / Collection）
跨越多個來源與想法形成的結構化主題或集合，可持續追蹤該主題下的「未解疑問」。
```typescript
export interface TopicItem {
  id: string;
  name: string;
  description: string;
  color?: string;
  unresolvedQuestions: string[]; // 規格第 3 節情境 5：未解問題追蹤
  createdAt: string;
  updatedAt: string;
}
```

#### D. 知識關聯（KnowledgeLink）
連結網絡的實體，清楚區分「使用者確認」與「AI 建議」。
```typescript
export interface KnowledgeLink {
  id: string;
  sourceId: string;              // 來源 ID (Record / Thought / Topic)
  sourceType: 'record' | 'thought' | 'topic';
  targetId: string;              // 目標 ID (Record / Thought / Topic)
  targetType: 'record' | 'thought' | 'topic';
  relationType: 'references' | 'challenges' | 'supports' | 'derives_from' | 'relates_to';
  origin: 'user' | 'ai_suggested'; // 規格要求：嚴格區分 AI 提出與使用者確認
  note?: string;                 // 關聯說明
  createdAt: string;
}
```

---

## 4. 目錄結構規劃

```
week9/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 自動部屬 CI/CD
├── docs/
│   ├── specification_analysis.md # 規格深度分析與需求對照
│   ├── architecture.md          # 系統架構與技術決策
│   ├── data_model_and_obsidian.md# 資料模型與 Obsidian 相容規範
│   └── deployment_guide.md      # 部署與驗收指南
├── skills/
│   ├── knowledge-curator/
│   │   └── SKILL.md            # Antigravity 知識整理技能
│   └── thought-synthesizer/
│       └── SKILL.md            # Antigravity 認知綜效與觀點演進技能
├── src/
│   ├── assets/                 # 靜態資源
│   ├── components/             # 可重用 UI 組件
│   │   ├── common/             # Button, Modal, Badge, Input, Card...
│   │   ├── layout/             # Sidebar, Navbar, PageContainer
│   │   ├── quick-add/          # 快速新增對話框
│   │   ├── records/            # 原始資料卡片、檢視與編輯抽屜
│   │   ├── thoughts/           # 個人想法卡片、認知類型標籤
│   │   ├── topics/             # 主題與未解疑問清單
│   │   ├── graph/              # 知識網絡視覺化 (Canvas Graph)
│   │   └── settings/           # 資料管理（匯出/還原/Obsidian/測試資料）
│   ├── data/
│   │   └── fixtures.ts         # 豐富虛構測試資料（驗證各情境）
│   ├── hooks/                  # 自定義 React Hooks
│   ├── services/               # 儲存層、匯出匯入、Obsidian 轉換
│   │   ├── storage.ts          # IndexedDB / LocalStorage 持久層
│   │   ├── obsidianExporter.ts # 產生 Obsidian 相容 Markdown 壓縮包
│   │   ├── searchEngine.ts     # 客戶端即時全文檢索
│   │   └── aiAssistant.ts      # 本地啟發式分析與 AI 輔助建議
│   ├── types/                  # TypeScript 型別定義
│   ├── utils/                  # 工具函式
│   ├── views/                  # 主要頁面
│   │   ├── DashboardView.tsx   # 首頁儀表板
│   │   ├── InboxView.tsx       # 收件匣（待處理資料）
│   │   ├── RecordsView.tsx     # 原始紀錄檢視
│   │   ├── ThoughtsView.tsx    # 個人想法檢視
│   │   ├── TopicsView.tsx      # 主題集合與未解疑問
│   │   ├── GraphView.tsx       # 知識圖譜探索
│   │   └── SettingsView.tsx    # 資料管理與主題設定
│   ├── App.tsx                 # 主應用程式進入點與路由
│   ├── main.tsx                # React 渲染入口
│   └── index.css               # Tailwind 與基礎樣式
├── tests/                      # 單元測試與功能測試
│   ├── storage.test.ts
│   ├── obsidianExporter.test.ts
│   ├── searchEngine.test.ts
│   └── dataModel.test.ts
├── AGENTS.md                   # 代理協作規範與指令
├── README.md                   # 專案說明與操作指南
├── package.json
├── tsconfig.json
├── vite.config.ts
└── 專案概念規格.md
```
