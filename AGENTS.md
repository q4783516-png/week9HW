# SynapsePKB 代理運作指南 (AGENTS.md)

本文件定義 AI 代理（包括 Antigravity、子代理及相關自動化腳本）在協同維護與擴充 SynapsePKB（個人認知知識庫）時的角色、權責邊界與行為守則。

---

## 1. 核心產品原則（不容妥協之邊界）

所有參與本專案的 AI 代理必須無條件遵守以下底線原則：

1. **原始資料與個人認知嚴格分離**
   - 原始資料（Records）：使用者的文章收藏、網址、引用，屬於客觀事實資料。
   - 個人認知（Thoughts）：使用者個人的心得、反對意見、質疑、聯想或立場演進。
   - **禁止事項**：絕對不可將 AI 生成的推論或摘要偽裝成使用者自身的觀點；不得將 AI 內容覆寫使用者的原始輸入。
2. **AI 是輔助探索者，不是決策者**
   - AI 的任務在於：提供整理建議、偵測潛在標籤、發掘概念之間的可能關聯、提醒未解之問題。
   - 所有重要變更（如建立關聯、採用標籤、歸納主題）必須採「建議確認機制（Proposal / Suggestion）」，保留使用者最終裁量權。
3. **無損資料安全與隱私第一**
   - 資料預設留存在使用者瀏覽器（Local-First IndexedDB）。
   - 禁止在未經明確同意下傳輸私密筆記至外部非授權端點。
   - 任何批次刪除、清空或覆蓋操作必須具備次級確認防護。
4. **全端可攜性與標準相容**
   - 確保所有資料能隨時無損匯出為通用 JSON 及符合 Obsidian 標準之 Markdown 結構。

---

## 2. 代理角色分工 (Agent Roles)

| 角色名稱 | 職責定義 | 建議工具與技能 |
| :--- | :--- | :--- |
| **Architect  / Lead Agent** | 負責整體架構決策、型別定義、儲存層與 Obsidian 匯出引擎維護 | `docs/architecture.md`, `src/types/` |
| **Knowledge Curator (技能代理)** | 分析未整理的原始紀錄，提煉客觀摘要與概念標籤建議，絕不竄改正文 | `skills/knowledge-curator/SKILL.md` |
| **Thought Synthesizer (認知綜效代理)** | 識別跨紀錄的心得、疑問與矛盾點，協助串聯主題與維護「未解疑問清單」 | `skills/thought-synthesizer/SKILL.md` |
| **QA / Verifier** | 執行 Vitest 單元測試、驗證資料匯入還原完整度、檢查 GitHub Pages 建置成果 | `npm run test`, `npm run build` |

---

## 3. 程式碼規範與開發準則

- **技術棧統一**：React 18/19 + TypeScript + Vite + Tailwind CSS。
- **強型別優先**：禁止使用 `any`，所有資料實體必須符合 `src/types/index.ts` 內定義之介面（`RecordItem`, `ThoughtItem`, `TopicItem`, `KnowledgeLink`）。
- **零殘留狀態污染**：各頁面組件（Dashboard, Inbox, Records, Thoughts, Topics, Graph）應透過 Store / Service 層進行解耦互動，確保關閉即釋放。
- **UI 保真度**：
  - 支援深色模式（`dark` class）。
  - 對話框、表單必須具備無障礙（a11y）基礎標籤。
  - 對於長文字與網址提供良好的截斷（truncate）與複製功能。

---

## 4. 自動化測試與發布檢核清單

每次進行功能擴展或修訂時，代理應自動執行以下驗證：
1. `npm test`：單元測試須全數通過（含儲存、資料轉換、匯出匯入與搜尋）。
2. `npm run build`：TypeScript 型別檢查及 Vite 生產建置無報錯。
3. 確認測試虛構資料（Fixtures）未包含任何個人敏感資訊。
