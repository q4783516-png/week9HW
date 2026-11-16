/**
 * SynapsePKB 核心資料模型
 * 嚴格遵循《專案概念規格》：原始資料與個人認知徹底分開、保留來源出處與認知演進
 */

export type RecordType = 'link' | 'text' | 'quote' | 'media';
export type RecordStatus = 'unread' | 'read' | 'archived';

export interface AIMetadata {
  summary?: string;
  suggestedTags?: string[];
  suggestedTopicIds?: string[];
  analyzedAt?: string;
}

export interface RecordItem {
  id: string;
  title: string;
  url?: string;
  rawContent: string;
  type: RecordType;
  status: RecordStatus;
  sourceMeta?: {
    domain?: string;
    author?: string;
    savedAt: string;
  };
  tags: string[];
  aiMetadata?: AIMetadata;
  createdAt: string;
  updatedAt: string;
}

export type ThoughtType = 
  | 'insight'       // 心得與理解
  | 'question'      // 疑問與待釐清處
  | 'objection'     // 反對意見或批判
  | 'association'   // 靈感與跨領域聯想
  | 'evolution';    // 觀點轉變與認知歷程

export interface ThoughtItem {
  id: string;
  title?: string;
  content: string;               // 使用者原汁原味的心得/疑問
  thoughtType: ThoughtType;
  relatedRecordIds: string[];    // 關聯的一至多筆來源（可為空，允許獨立新增）
  topicIds: string[];            // 關聯的一至多個主題集合
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TopicItem {
  id: string;
  name: string;
  description: string;
  color?: string;
  unresolvedQuestions: string[]; // 規格第 3 節情境 5：未解問題追蹤清單
  createdAt: string;
  updatedAt: string;
}

export type EntityType = 'record' | 'thought' | 'topic';

export type RelationType = 
  | 'references'   // 引用 / 參考
  | 'challenges'   // 質疑 / 反對
  | 'supports'     // 支持 / 佐證
  | 'derives_from' // 由其延伸 / 啟發
  | 'relates_to';  // 相關聯

export interface KnowledgeLink {
  id: string;
  sourceId: string;
  sourceType: EntityType;
  targetId: string;
  targetType: EntityType;
  relationType: RelationType;
  origin: 'user' | 'ai_suggested'; // 規格要求：嚴格區分 AI 建議關聯與使用者確認關聯
  note?: string;                   // 關聯備註或說明
  createdAt: string;
}

export interface KnowledgeBaseData {
  records: RecordItem[];
  thoughts: ThoughtItem[];
  topics: TopicItem[];
  links: KnowledgeLink[];
}

export interface BackupPayload {
  version: '1.0.0';
  exportedAt: string;
  appName: 'SynapsePKB';
  stats: {
    recordCount: number;
    thoughtCount: number;
    topicCount: number;
    linkCount: number;
  };
  data: KnowledgeBaseData;
  settings?: {
    theme?: 'light' | 'dark' | 'system';
  };
}

export interface FilterOptions {
  query?: string;
  recordType?: RecordType | 'all';
  recordStatus?: RecordStatus | 'all';
  thoughtType?: ThoughtType | 'all';
  tag?: string;
  topicId?: string;
}
