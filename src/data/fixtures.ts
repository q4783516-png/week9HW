import { KnowledgeBaseData } from '../types';

/**
 * 虛構與演示測試資料（Fixture Data）
 * 符合規格第 8 條第 9 款：展示五大情境、各資料類型與真實知識管理案例
 */
export const initialFixtures: KnowledgeBaseData = {
  records: [
    {
      id: 'rec-001',
      title: 'How to Take Smart Notes: One Simple Technique to Boost Writing and Learning',
      url: 'https://example.org/articles/smart-notes-intro',
      rawContent: '卡片盒筆記法的核心不在於收藏筆記，而在於讓筆記之間產生自主對話。每一張卡片應該只包含一個原子化的觀點，並且用自己的話重寫，而非單純複製貼上。',
      type: 'link',
      status: 'read',
      sourceMeta: {
        domain: 'example.org',
        author: 'Sönke Ahrens',
        savedAt: '2026-11-10T08:30:00Z',
      },
      tags: ['卡片盒筆記', '知識管理', '學習法'],
      aiMetadata: {
        summary: '本文介紹盧曼卡片盒筆記法的核心精神，強調筆記原子化與自己的語言重寫的重要性。',
        suggestedTags: ['心智模型', '原子寫作'],
        analyzedAt: '2026-11-10T08:35:00Z',
      },
      createdAt: '2026-11-10T08:30:00Z',
      updatedAt: '2026-11-10T08:35:00Z',
    },
    {
      id: 'rec-002',
      title: 'Attention Is All You Need: The Foundation of Modern Transformers',
      url: 'https://arxiv.example.org/abs/1706.03762',
      rawContent: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence and entirely relying on an attention mechanism to draw global dependencies between input and output.',
      type: 'link',
      status: 'read',
      sourceMeta: {
        domain: 'arxiv.example.org',
        author: 'Vaswani et al.',
        savedAt: '2026-11-12T14:10:00Z',
      },
      tags: ['人工智慧', 'Transformer', '機器學習'],
      aiMetadata: {
        summary: 'Transformer 架構論文原文，拋棄傳統遞歸與卷積神經網絡，完全仰賴自注意力機制捕捉全局依賴。',
        suggestedTags: ['深度學習', '注意力機制'],
        analyzedAt: '2026-11-12T14:15:00Z',
      },
      createdAt: '2026-11-12T14:10:00Z',
      updatedAt: '2026-11-12T14:15:00Z',
    },
    {
      id: 'rec-003',
      title: 'Thinking in Systems: A Primer - Chapter 2 Quotes',
      rawContent: '「系統是一個由相互連接的元素組成的實體，其組織方式達成了一定的目標或功能。任何系統中的關鍵在於『反饋迴路（Feedback Loops）』，而非個別組件的靜態屬性。」',
      type: 'quote',
      status: 'read',
      sourceMeta: {
        author: 'Donella H. Meadows',
        savedAt: '2026-11-13T09:20:00Z',
      },
      tags: ['系統思考', '複雜系統', '反饋迴路'],
      createdAt: '2026-11-13T09:20:00Z',
      updatedAt: '2026-11-13T09:20:00Z',
    },
    {
      id: 'rec-004',
      title: 'Deep Work: Rules for Focused Success in a Distracted World (待讀摘要)',
      url: 'https://calnewport.example.com/books/deep-work',
      rawContent: '深度工作能力在當前經濟中正變得越來越罕見，同時也變得越來越有價值。真正推動創造力爆發的不是零散的快速反饋，而是長時間免於干擾的單一深度投入。',
      type: 'link',
      status: 'unread', // Inbox 未讀項目
      sourceMeta: {
        domain: 'calnewport.example.com',
        author: 'Cal Newport',
        savedAt: '2026-11-16T11:00:00Z',
      },
      tags: ['專注力', '生產力'],
      createdAt: '2026-11-16T11:00:00Z',
      updatedAt: '2026-11-16T11:00:00Z',
    },
    {
      id: 'rec-005',
      title: '關於工作記憶（Working Memory）容量極限的心理學片段',
      rawContent: '喬治·米勒著名的「神奇數字 7±2」在近年神經科學研究中被重新檢討，現代觀點普遍認為真正即時可維持的工作記憶槽位其實只有 4 個左右。這代表外化知識庫（External Scaffold）對減輕認知負擔是生理上的硬需求。',
      type: 'text',
      status: 'unread', // Inbox 未讀項目
      sourceMeta: {
        savedAt: '2026-11-16T16:45:00Z',
      },
      tags: ['認知心理學', '工作記憶', '第二大腦'],
      createdAt: '2026-11-16T16:45:00Z',
      updatedAt: '2026-11-16T16:45:00Z',
    },
    {
      id: 'rec-006',
      title: '如何提供有效安慰 (YouTube 知識影片)',
      url: 'https://www.youtube.com/watch?v=BaxuGWxUv9A',
      rawContent: '情緒不是我們要解決的問題，安慰也不是為了消滅情緒。\n\n有效安慰的本質，不是讓對方從情緒中走出來，而是讓一個處在情緒漩渦中的人知道：他不是一個人，他的感受不會被否定，他也不需要因為有這樣的情緒而感到羞恥。',
      type: 'link',
      status: 'read',
      sourceMeta: {
        domain: 'youtube.com',
        author: '心理學與人際溝通頻道',
        savedAt: '2026-11-17T03:00:00Z',
      },
      tags: ['情緒陪伴', '同理心', '溝通心理學', '人際關係'],
      aiMetadata: {
        summary: '影片探討有效安慰的核心本質：並非急於消滅情緒或替對方解決問題，而是給予情緒接納與陪伴，消除對方的孤獨感與情緒羞恥感。',
        suggestedTags: ['情緒接納', '非暴力溝通'],
        analyzedAt: '2026-11-17T03:05:00Z',
      },
      createdAt: '2026-11-17T03:00:00Z',
      updatedAt: '2026-11-17T03:05:00Z',
    },
    {
      id: 'rec-007',
      title: '個人知識庫：從 LLM Wiki 到資料輸入設計 (ChatGPT 對話紀錄)',
      rawContent: `【核心討論要點紀錄】

1. LLM Wiki 與個人知識庫架構：
LLM Wiki 源自 Andrej Karpathy 構想，是一種由 Agentic AI 輔助的知識管理架構，核心在於利用 LLM 預先建立、整合並持續演進知識庫，不同於傳統 RAG 僅在查詢時單向檢索原始文件。

2. 個人知識庫的核心矛盾與破局之道：
- 矛盾一：若為了知識庫而改變筆記方式，會造成額外負擔與工具異化。
- 矛盾二：知識多來自 YouTube 影片或零碎對話，難以先產出教科書式完整筆記。
- 解方：確立「原始資料（外部輸入）」、「個人認知紀錄（個人觀點與疑問）」與「AI 知識整理」三者徹底分開。

3. 關鍵設計原則確立：
- 原始資料與個人認知獨立：AI 整理絕不覆寫使用者原話，亦不可標示為已掌握的個人知識。
- 知識是網絡而非資料夾：未閱讀/待觀看的資料也能成為網絡節點，透過情境式重新發現（Contextual Rediscovery）提早參與思考。
- 靈感驅動與來源追溯（Source-first）：回顧的目的往往是因新靈感而重新檢視原始素材。
- 最低輸入摩擦：支援純文字 Markdown (.md) 匯入與快捷網址儲存。`,
      type: 'text',
      status: 'read',
      sourceMeta: {
        domain: 'chatgpt.com',
        author: 'User & ChatGPT',
        savedAt: '2026-11-16T12:00:00Z',
      },
      tags: ['個人知識庫', 'LLM Wiki', '資料輸入設計', 'PKM'],
      aiMetadata: {
        summary: '深入探討個人知識庫的設計哲學，確立了「原始資料與個人認知徹底分開」、「低輸入門檻」、「未讀資料的網絡價值」與「來源可追溯性」等關鍵原則。',
        suggestedTags: ['認知架構', '系統設計', '心智模型'],
        analyzedAt: '2026-11-16T12:10:00Z',
      },
      createdAt: '2026-11-16T12:00:00Z',
      updatedAt: '2026-11-16T12:10:00Z',
    },
  ],
  thoughts: [
    {
      id: 'thg-001',
      title: '原子化卡片是否會破壞原始敘事的連貫性？',
      content: '讀完 Ahrens 的《Smart Notes》後，我發現原子化雖然有利於卡片重新混搭，但在複雜論證中，切碎概念往往遺失了原作者層層推進的語境與張力。我們需要一種既能保留論證脈絡，又能靈活跨鏈接的機制。',
      thoughtType: 'objection', // 質疑 / 反對
      relatedRecordIds: ['rec-001'],
      topicIds: ['top-001'],
      tags: ['知識管理', '批判思考', '原子化'],
      createdAt: '2026-11-11T10:00:00Z',
      updatedAt: '2026-11-11T10:00:00Z',
    },
    {
      id: 'thg-002',
      title: '注意力機制與人類記憶檢索的相似性',
      content: 'Transformer 的自注意力（Self-Attention）透過 Query-Key-Value 矩陣計算權重，這和人類大腦提取記憶的方式驚人相似：當前遇到的問題（Query）與長期記憶庫中的索引（Key）進行比對，進而加權激活最相關的上下文（Value）。這是不是某種外化知識庫的自動化方向？',
      thoughtType: 'association', // 跨領域聯想
      relatedRecordIds: ['rec-002'],
      topicIds: ['top-002'],
      tags: ['人工智慧', '注意力機制', '認知模型'],
      createdAt: '2026-11-12T16:20:00Z',
      updatedAt: '2026-11-12T16:20:00Z',
    },
    {
      id: 'thg-003',
      title: '我的筆記觀念演進：從分類歸檔轉變為問題驅動',
      content: '過去我總是把筆記依照主題資料夾（如「科技」、「心理學」、「哲學」）分類，結果存進去後再也沒打開過。現在我逐漸明白，真正能讓知識活起來的是「我當下關心的未解問題」。資料夾是存放處，問題才是引力中心。',
      thoughtType: 'evolution', // 觀點轉變歷程
      relatedRecordIds: [],
      topicIds: ['top-001'],
      tags: ['觀點演進', '心智模式', '問題導向'],
      createdAt: '2026-11-14T09:15:00Z',
      updatedAt: '2026-11-14T09:15:00Z',
    },
    {
      id: 'thg-004',
      title: '反饋延遲在個人學習系統中的盲點',
      content: 'Meadows 提到的反饋延遲（Feedback Delay）在知識積累中非常致命。如果只是持續閱讀而不主動寫下個人心得或嘗試向他人解釋，我們往往會產生「我已經懂了」的流暢性錯覺，直到數週後才發現自己根本無法運用。',
      thoughtType: 'insight', // 心得領會
      relatedRecordIds: ['rec-003'],
      topicIds: ['top-003', 'top-001'],
      tags: ['系統思考', '學習錯覺', '反饋迴路'],
      createdAt: '2026-11-14T15:40:00Z',
      updatedAt: '2026-11-14T15:40:00Z',
    },
    {
      id: 'thg-005',
      title: 'AI 是否會導致「外包思考」後理解力的退化？',
      content: '當 AI 能在幾秒內產生結構化的文章摘要時，我省下了閱讀時間，但我也跳過了自己在大腦中進行語意重構的掙扎過程。如果理解的本質正是那段「重構的阻力」，那麼一鍵摘要是否反而剝奪了長期理解的形成？',
      thoughtType: 'question', // 疑問
      relatedRecordIds: ['rec-002'],
      topicIds: ['top-002'],
      tags: ['AI認知', '深度理解', '批判性問題'],
      createdAt: '2026-11-15T11:20:00Z',
      updatedAt: '2026-11-15T11:20:00Z',
    },
    {
      id: 'thg-006',
      title: '「解決問題導向」在情緒安慰中的反效果',
      content: '我們習慣把問題解決思維帶入人際溝通，看到對方難過就急著給建議或理性分析。但這支影片點醒了我：當對方處於情緒漩渦時，過早的理性建議反而暗示了「你現在的情緒是不合宜、需要被修正的」，進而引發次級的羞恥感。先建立連結，再談解決。',
      thoughtType: 'insight', // 心得領會
      relatedRecordIds: ['rec-006'],
      topicIds: ['top-004'],
      tags: ['同理心', '溝通盲點', '情緒接納'],
      createdAt: '2026-11-17T03:15:00Z',
      updatedAt: '2026-11-17T03:15:00Z',
    },
    {
      id: 'thg-007',
      title: '待觀看資料是否應具備網絡節點身分？',
      content: '過去我總認為「沒看過、沒消化的資料不配進入知識庫」。但這次討論讓我反思：待觀看的影片只要有初步的標題與索引，就可以作為潛在的邊界節點。當新的思考問題出現時，系統能將這些潛在資料召回，讓我更早處理它們。這徹底翻轉了線性的待辦思維。',
      thoughtType: 'evolution', // 觀點轉變歷程
      relatedRecordIds: ['rec-007', 'rec-004'],
      topicIds: ['top-001'],
      tags: ['知識網絡', '待讀佇列', '觀點演進'],
      createdAt: '2026-11-16T12:30:00Z',
      updatedAt: '2026-11-16T12:30:00Z',
    },
  ],
  topics: [
    {
      id: 'top-001',
      name: '個人認知與知識管理',
      description: '探索如何有效保存資訊、減輕記憶負荷，並維持獨立思考能力與思維演進。',
      color: '#0e8ce9',
      unresolvedQuestions: [
        '如何衡量一個外化知識庫真正提升了理解，而不只是製造了收藏焦慮？',
        '原子化筆記與脈絡連貫性之間的最佳平衡點在哪裡？',
        '如何設計最低摩擦力的輸入流程，讓對話與影片能自然進入知識庫？',
      ],
      createdAt: '2026-11-10T08:00:00Z',
      updatedAt: '2026-11-16T13:00:00Z',
    },
    {
      id: 'top-002',
      name: 'AI 時代的心智模型與認知重塑',
      description: '探討生成式 AI、注意力機制與人機協同如何改變人類獲取知識與形成觀點的模式。',
      color: '#8b5cf6',
      unresolvedQuestions: [
        'AI 生成的摘要在多大程度上削弱或輔助了使用者的深度理解？',
        '如何確保個人知識庫不被 AI 的平均觀點稀釋，保持個人獨特洞見？',
      ],
      createdAt: '2026-11-11T14:00:00Z',
      updatedAt: '2026-11-15T12:00:00Z',
    },
    {
      id: 'top-003',
      name: '複雜系統與決策思維',
      description: '研究非線性關係、反饋迴路、延遲效應與心智陷阱，提升在不確定環境下的決策品質。',
      color: '#10b981',
      unresolvedQuestions: [
        '如何在個人日常決策中建立快速顯性化的反饋迴路？',
      ],
      createdAt: '2026-11-13T09:00:00Z',
      updatedAt: '2026-11-13T09:00:00Z',
    },
    {
      id: 'top-004',
      name: '情緒溝通與同理心實踐',
      description: '探討情緒接納、同理陪伴與人際連結的本質，克服理性解決問題導向的溝通盲點。',
      color: '#ec4899',
      unresolvedQuestions: [
        '如何在陪伴他人強烈情緒的同時，維持自我心理邊界而不被情緒耗竭？',
        '當理性的解決方案與對方的情感接納需求衝突時，最佳的介入時機如何判斷？',
      ],
      createdAt: '2026-11-17T03:00:00Z',
      updatedAt: '2026-11-17T03:00:00Z',
    },
  ],
  links: [
    {
      id: 'lnk-001',
      sourceId: 'thg-001',
      sourceType: 'thought',
      targetId: 'rec-001',
      targetType: 'record',
      relationType: 'challenges',
      origin: 'user', // 使用者親自建立
      note: '對 Smart Notes 的原子化原則提出語境割裂的質疑',
      createdAt: '2026-11-11T10:05:00Z',
    },
    {
      id: 'lnk-002',
      sourceId: 'thg-002',
      sourceType: 'thought',
      targetId: 'rec-002',
      targetType: 'record',
      relationType: 'derives_from',
      origin: 'user',
      note: '受 Transformer 自注意力架構啟發聯想人類記憶檢索',
      createdAt: '2026-11-12T16:25:00Z',
    },
    {
      id: 'lnk-003',
      sourceId: 'thg-004',
      sourceType: 'thought',
      targetId: 'rec-003',
      targetType: 'record',
      relationType: 'supports',
      origin: 'user',
      note: '以個人學習錯覺印證系統論中的反饋延遲理論',
      createdAt: '2026-11-14T15:45:00Z',
    },
    {
      id: 'lnk-004',
      sourceId: 'thg-005',
      sourceType: 'thought',
      targetId: 'rec-002',
      targetType: 'record',
      relationType: 'challenges',
      origin: 'user',
      note: '探討 AI 普及化對人類深層重構理解能力的潛在削弱',
      createdAt: '2026-11-15T11:25:00Z',
    },
    {
      id: 'lnk-005',
      sourceId: 'thg-005',
      sourceType: 'thought',
      targetId: 'thg-002',
      targetType: 'thought',
      relationType: 'challenges',
      origin: 'ai_suggested', // AI 發現並建議的思考張力（未經使用者確認前明確標籤）
      note: 'AI 建議：thg-005 提出的認知退化隱憂，與 thg-002 對 AI 作為外化記憶的樂觀看法形成對比張力',
      createdAt: '2026-11-15T11:30:00Z',
    },
    {
      id: 'lnk-006',
      sourceId: 'thg-006',
      sourceType: 'thought',
      targetId: 'rec-006',
      targetType: 'record',
      relationType: 'derives_from',
      origin: 'user',
      note: '由影片中對情緒羞恥感的闡述，反思個人習慣急於給建議的溝通盲點',
      createdAt: '2026-11-17T03:20:00Z',
    },
    {
      id: 'lnk-007',
      sourceId: 'thg-007',
      sourceType: 'thought',
      targetId: 'rec-007',
      targetType: 'record',
      relationType: 'derives_from',
      origin: 'user',
      note: '在對話中確立待觀看資料應作為網絡節點之重要認知演進',
      createdAt: '2026-11-16T12:35:00Z',
    },
    {
      id: 'lnk-008',
      sourceId: 'thg-007',
      sourceType: 'thought',
      targetId: 'rec-004',
      targetType: 'record',
      relationType: 'relates_to',
      origin: 'ai_suggested',
      note: 'AI 建議：thg-007 探討待讀資料的網絡價值，可能與收件匣中未讀的 Deep Work 摘錄產生連結',
      createdAt: '2026-11-16T12:40:00Z',
    },
  ],
};
