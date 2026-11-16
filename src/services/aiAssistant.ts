import { RecordItem, ThoughtItem, TopicItem, KnowledgeBaseData, AIMetadata, KnowledgeLink } from '../types';

export interface AISuggestionResult {
  metadata: AIMetadata;
  suggestedLinks: Array<{
    targetId: string;
    targetType: 'record' | 'thought' | 'topic';
    relationType: KnowledgeLink['relationType'];
    reason: string;
  }>;
  suggestedQuestions: string[];
}

/**
 * 智慧啟發式輔助分析器
 * 100% 本地即時運算，保護隱私，提供客觀摘要、概念標籤、思考關聯與未解問題建議
 */
export function analyzeRecordHeuristic(
  record: RecordItem,
  knowledgeBase: KnowledgeBaseData
): AISuggestionResult {
  const content = (record.rawContent || '') + ' ' + (record.title || '');
  
  // 1. 產生客觀摘要
  let summary = '';
  if (record.rawContent.length <= 120) {
    summary = `原始片段摘要：${record.rawContent.trim()}`;
  } else {
    // 擷取前幾句與關鍵句
    const sentences = record.rawContent.split(/[。！？\n.]+/).filter((s) => s.trim().length > 5);
    const firstSentence = sentences[0] || record.title;
    const secondSentence = sentences[1] ? `。${sentences[1]}` : '';
    summary = `本資料主要探討「${record.title}」，指出：${firstSentence.trim()}${secondSentence.trim()}。`;
  }

  // 2. 標籤與概念推薦（比對現有知識庫詞庫）
  const existingTags = new Set<string>();
  knowledgeBase.records.forEach((r) => r.tags.forEach((t) => existingTags.add(t)));
  knowledgeBase.thoughts.forEach((th) => th.tags.forEach((t) => existingTags.add(t)));

  const suggestedTags: string[] = [];
  existingTags.forEach((tag) => {
    if (content.toLowerCase().includes(tag.toLowerCase()) && !record.tags.includes(tag)) {
      suggestedTags.push(tag);
    }
  });

  // 常見知識領域標籤推薦
  const domainKeywords: Record<string, string[]> = {
    '人工智慧': ['ai', 'transformer', 'llm', '模型', '神經網絡', 'prompt', '機器學習'],
    '知識管理': ['筆記', '卡片', 'second brain', '整理', '記憶', '分類', '庫'],
    '認知科學': ['思考', '工作記憶', '理解', '認知', '偏誤', '大腦', '心智'],
    '系統思維': ['系統', '反饋', '迴路', '複雜', '動態', '因果'],
    '生產力': ['專注', '效率', '時間', '深度工作', '流程'],
  };

  Object.entries(domainKeywords).forEach(([category, kws]) => {
    if (!record.tags.includes(category) && !suggestedTags.includes(category)) {
      if (kws.some((kw) => content.toLowerCase().includes(kw))) {
        suggestedTags.push(category);
      }
    }
  });

  // 3. 建議與現有個人想法或主題的關聯
  const suggestedLinks: AISuggestionResult['suggestedLinks'] = [];

  // 比對 thoughts
  knowledgeBase.thoughts.forEach((thg) => {
    if (thg.relatedRecordIds.includes(record.id)) return; // 已經手動關聯

    // 若有共同標籤或關鍵詞重疊
    const commonTags = thg.tags.filter((t) => record.tags.includes(t) || suggestedTags.includes(t));
    if (commonTags.length > 0) {
      suggestedLinks.push({
        targetId: thg.id,
        targetType: 'thought',
        relationType: thg.thoughtType === 'objection' ? 'challenges' : 'relates_to',
        reason: `發現共同概念標籤 [${commonTags.join(', ')}]，此想法可能與該來源存在相關或對比`,
      });
    }
  });

  // 4. 探詢未解問題建議
  const suggestedQuestions: string[] = [];
  if (content.includes('極限') || content.includes('容量') || content.includes('負擔')) {
    suggestedQuestions.push(`這份資料所提及的限制，如何應用在我們自身的思考習慣調整中？`);
  }
  if (content.includes('AI') || content.includes('模型') || content.includes('自動化')) {
    suggestedQuestions.push(`這項技術的普及，會對使用者的自主判斷能力帶來正面還是負面影響？`);
  }
  if (suggestedQuestions.length === 0) {
    suggestedQuestions.push(`這筆資料帶給你的最大疑問或不同意之處是什麼？`);
  }

  return {
    metadata: {
      summary,
      suggestedTags: suggestedTags.slice(0, 4),
      analyzedAt: new Date().toISOString(),
    },
    suggestedLinks: suggestedLinks.slice(0, 3),
    suggestedQuestions,
  };
}
