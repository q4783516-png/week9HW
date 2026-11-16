# 資料模型規範與 Obsidian 相容性設計

本文件詳細規範 SynapsePKB 系統的資料交換格式、JSON 備份結構，以及向 Obsidian 雙向相容 Markdown 格式的轉換標準。

---

## 1. JSON 完整備份與還原結構 (Full Backup Schema)

為了確保使用者的資料不被鎖定在單一瀏覽器中，系統提供一鍵完整備份（Export JSON）與還原（Import/Restore JSON）機制。

### Backup Payload 結構

```typescript
export interface BackupPayload {
  version: '1.0.0';
  exportedAt: string;          // ISO 8601 Timestamp
  appName: 'SynapsePKB';
  stats: {
    recordCount: number;
    thoughtCount: number;
    topicCount: number;
    linkCount: number;
  };
  data: {
    records: RecordItem[];
    thoughts: ThoughtItem[];
    topics: TopicItem[];
    links: KnowledgeLink[];
  };
  settings?: {
    theme?: 'light' | 'dark' | 'system';
  };
}
```

### 資料驗證原則
1. **防禦性解析**：還原時必須檢查 `version` 與必要陣列屬性是否存在。
2. **無損合併 / 完整覆蓋確認**：使用者可選擇「覆蓋現有資料」或「合併現有資料（依 ID 略過重疊）」。
3. **無外洩保證**：匯入與匯出完全在瀏覽器端記憶體執行，無任何資料上傳第三方伺服器。

---

## 2. Obsidian 相容 Markdown 規範

依據規格第 6 節「長期相容性與資料可攜性」，Obsidian 作為重要相容目標。
系統生成的 ZIP 壓縮包具有以下階層結構：

```
SynapsePKB-Obsidian-Vault/
├── Records/                     # 原始資料與出處
│   ├── 2026-11-17-如何建立個人知識系統.md
│   └── ...
├── Thoughts/                    # 個人認知、心得、疑問與觀點演進
│   ├── 2026-11-17-反思卡片盒筆記法的局限.md
│   └── ...
├── Topics/                      # 跨領域主題整理與未解疑問
│   ├── 人工智慧與個人認知.md
│   └── ...
└── index.md                     # 知識庫總覽導覽頁
```

### 2.1 原始紀錄 Markdown 範本 (Records)

```markdown
---
id: rec_7f8a9b
type: record
recordType: link
title: "Building a Second Brain in Practice"
url: "https://example.com/basb-guide"
tags:
  - 知識管理
  - 生產力
savedAt: "2026-11-17T02:00:00Z"
readStatus: read
aiProcessed: true
---

# Building a Second Brain in Practice

> **出處來源**：[原始網址](https://example.com/basb-guide)
> **保存時間**：2026-11-17 10:00:00
> **狀態**：已閱讀

## 原始摘錄與內容
這是一段原始保存的重點內容或文章摘要...

---

## AI 輔助整理（AI Generated）
> [!NOTE] 以下內容由 AI 輔助生成，僅供參考，不代表個人觀點
> **摘要**：本文介紹了 PARA 架構與 CODE 模型在日常筆記中的落地實踐。
> **建議概念**：#第二大腦 #卡片筆記

---

## 相關個人想法
- [[2026-11-17-反思卡片盒筆記法的局限]]
- [[2026-11-17-關於階層分類的疑問]]
```

### 2.2 個人想法 Markdown 範本 (Thoughts)

```markdown
---
id: thg_3e4d5c
type: thought
thoughtType: objection
tags:
  - 知識管理
  - 認知科學
createdAt: "2026-11-17T02:30:00Z"
updatedAt: "2026-11-17T02:30:00Z"
---

# 反思卡片盒筆記法的局限

> **認知類型**：⚠️ 反對意見 / 批判性思考 (Objection)
> **建立時間**：2026-11-17 10:30:00

## 思考內容
雖然卡片盒筆記法強調原子化（Atomicity），但在實踐中容易導致上下文割裂。如果沒有明確的個人問題意識驅動，積累大量卡片反而會製造整理焦慮。

---

## 關聯來源出處
- [[2026-11-17-如何建立個人知識系統]] (反對與補充)

## 所屬主題
- [[主題-個人認知演進]]
```

### 2.3 主題與未解問題 Markdown 範本 (Topics)

```markdown
---
id: top_9a8b7c
type: topic
name: "個人認知演進"
unresolvedCount: 2
---

# 主題：個人認知演進

> 本主題旨在探索知識如何從外在資訊內化為長期直覺與獨立判斷。

## 待解決之核心問題 (Unresolved Questions)
- [ ] AI 生成的摘要究竟在多大程度上削弱了使用者自己的深度理解？
- [ ] 如何在低記錄負擔與高檢索精度之間取得平衡？

---

## 包含的原始紀錄
- [[2026-11-17-如何建立個人知識系統]]

## 包含的個人想法
- [[2026-11-17-反思卡片盒筆記法的局限]]
```

---

## 3. 相容性優勢總結

1. **零外掛依賴**：完全採用 Obsidian 原生的 YAML Frontmatter 與雙向連結語法 `[[Note Name]]`，任何 Obsidian 用戶直接將解壓縮資料夾作為 Vault 開啟即可使用。
2. **標籤無縫銜接**：自動提取 tags，Obsidian 標籤面版自動識別。
3. **明確視覺警示**：採用 Callout 語法 `> [!NOTE]` 警示 AI 生成內容，符合規格「AI 產出與個人認知必須分離」原則。
