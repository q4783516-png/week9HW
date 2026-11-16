import JSZip from 'jszip';
import { KnowledgeBaseData, RecordItem, ThoughtItem, TopicItem } from '../types';

/**
 * 格式化標題以供安全作為檔案名稱
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 80) || 'untitled';
}

/**
 * 認知類型對應中文與圖標說明
 */
export const thoughtTypeLabels: Record<string, string> = {
  insight: '💡 心得領會 (Insight)',
  question: '❓ 疑問與盲點 (Question)',
  objection: '⚠️ 批判反對 (Objection)',
  association: '🔗 跨界聯想 (Association)',
  evolution: '🔄 觀點演進 (Evolution)',
};

/**
 * 產生單筆 Record 的 Markdown
 */
export function generateRecordMarkdown(
  record: RecordItem,
  relatedThoughts: ThoughtItem[],
  relatedTopics: TopicItem[]
): string {
  const dateStr = record.createdAt.substring(0, 10);
  const frontmatter = [
    '---',
    `id: ${record.id}`,
    'type: record',
    `recordType: ${record.type}`,
    `title: "${record.title.replace(/"/g, '\\"')}"`,
    record.url ? `url: "${record.url}"` : null,
    `status: ${record.status}`,
    `createdAt: "${record.createdAt}"`,
    record.tags.length > 0 ? `tags:\n${record.tags.map((t) => `  - ${t}`).join('\n')}` : null,
    record.aiMetadata ? `aiProcessed: true` : 'aiProcessed: false',
    '---',
  ]
    .filter(Boolean)
    .join('\n');

  let body = `${frontmatter}\n\n# ${record.title}\n\n`;

  body += `> [!INFO] 資料來源出處\n`;
  if (record.url) {
    body += `> - **原始網址**：${record.url}\n`;
  }
  if (record.sourceMeta?.author) {
    body += `> - **作者/發布者**：${record.sourceMeta.author}\n`;
  }
  body += `> - **保存時間**：${record.createdAt}\n`;
  body += `> - **狀態**：${record.status === 'unread' ? '待閱讀 (Inbox)' : '已閱讀'}\n\n`;

  body += `## 原始資料與內容\n\n${record.rawContent}\n\n`;

  if (record.aiMetadata?.summary || (record.aiMetadata?.suggestedTags && record.aiMetadata.suggestedTags.length > 0)) {
    body += `---\n\n## AI 輔助整理內容\n`;
    body += `> [!NOTE] AI 產出聲明\n`;
    body += `> 本區塊由 AI 自動整理與提取，僅供檢索輔助，不代表使用者的個人觀點或立場。\n\n`;
    if (record.aiMetadata.summary) {
      body += `**AI 摘要**：\n${record.aiMetadata.summary}\n\n`;
    }
    if (record.aiMetadata.suggestedTags && record.aiMetadata.suggestedTags.length > 0) {
      body += `**AI 建議標籤**：${record.aiMetadata.suggestedTags.map((t) => `#${t}`).join(' ')}\n\n`;
    }
  }

  if (relatedThoughts.length > 0) {
    body += `---\n\n## 相關個人認知與想法\n`;
    relatedThoughts.forEach((t) => {
      const title = t.title || t.content.substring(0, 30);
      body += `- [[Thoughts/${dateStr}-${sanitizeFilename(title)}|${title}]] (${thoughtTypeLabels[t.thoughtType] || t.thoughtType})\n`;
    });
    body += '\n';
  }

  if (relatedTopics.length > 0) {
    body += `---\n\n## 所屬主題\n`;
    relatedTopics.forEach((tp) => {
      body += `- [[Topics/${sanitizeFilename(tp.name)}|${tp.name}]]\n`;
    });
    body += '\n';
  }

  return body;
}

/**
 * 產生單筆 Thought 的 Markdown
 */
export function generateThoughtMarkdown(
  thought: ThoughtItem,
  relatedRecords: RecordItem[],
  relatedTopics: TopicItem[]
): string {
  const dateStr = thought.createdAt.substring(0, 10);
  const thoughtTitle = thought.title || thought.content.substring(0, 30);

  const frontmatter = [
    '---',
    `id: ${thought.id}`,
    'type: thought',
    `thoughtType: ${thought.thoughtType}`,
    `createdAt: "${thought.createdAt}"`,
    `updatedAt: "${thought.updatedAt}"`,
    thought.tags.length > 0 ? `tags:\n${thought.tags.map((t) => `  - ${t}`).join('\n')}` : null,
    '---',
  ]
    .filter(Boolean)
    .join('\n');

  let body = `${frontmatter}\n\n# ${thoughtTitle}\n\n`;

  body += `> [!IMPORTANT] 個人主觀認知\n`;
  body += `> **認知性質**：${thoughtTypeLabels[thought.thoughtType] || thought.thoughtType}\n`;
  body += `> **記錄時間**：${thought.createdAt}\n\n`;

  body += `## 思考內容\n\n${thought.content}\n\n`;

  if (relatedRecords.length > 0) {
    body += `---\n\n## 關聯來源出處 (Records)\n`;
    relatedRecords.forEach((r) => {
      const recDate = r.createdAt.substring(0, 10);
      body += `- [[Records/${recDate}-${sanitizeFilename(r.title)}|${r.title}]]\n`;
    });
    body += '\n';
  }

  if (relatedTopics.length > 0) {
    body += `---\n\n## 所屬主題集合 (Topics)\n`;
    relatedTopics.forEach((tp) => {
      body += `- [[Topics/${sanitizeFilename(tp.name)}|${tp.name}]]\n`;
    });
    body += '\n';
  }

  return body;
}

/**
 * 產生單筆 Topic 的 Markdown
 */
export function generateTopicMarkdown(
  topic: TopicItem,
  relatedRecords: RecordItem[],
  relatedThoughts: ThoughtItem[]
): string {
  const frontmatter = [
    '---',
    `id: ${topic.id}`,
    'type: topic',
    `name: "${topic.name.replace(/"/g, '\\"')}"`,
    `unresolvedCount: ${topic.unresolvedQuestions.length}`,
    `createdAt: "${topic.createdAt}"`,
    '---',
  ].join('\n');

  let body = `${frontmatter}\n\n# 主題：${topic.name}\n\n`;

  if (topic.description) {
    body += `> ${topic.description}\n\n`;
  }

  body += `## 待解決之核心問題 (Unresolved Questions)\n`;
  if (topic.unresolvedQuestions.length > 0) {
    topic.unresolvedQuestions.forEach((q) => {
      body += `- [ ] ${q}\n`;
    });
  } else {
    body += `*目前無懸掛問題，隨時新增記錄探索方向。*\n`;
  }
  body += '\n';

  if (relatedThoughts.length > 0) {
    body += `---\n\n## 累積之個人想法 (${relatedThoughts.length})\n`;
    relatedThoughts.forEach((t) => {
      const dateStr = t.createdAt.substring(0, 10);
      const title = t.title || t.content.substring(0, 30);
      body += `- [[Thoughts/${dateStr}-${sanitizeFilename(title)}|${title}]] - *${thoughtTypeLabels[t.thoughtType] || t.thoughtType}*\n`;
    });
    body += '\n';
  }

  if (relatedRecords.length > 0) {
    body += `---\n\n## 關聯原始資料 (${relatedRecords.length})\n`;
    relatedRecords.forEach((r) => {
      const dateStr = r.createdAt.substring(0, 10);
      body += `- [[Records/${dateStr}-${sanitizeFilename(r.title)}|${r.title}]]\n`;
    });
    body += '\n';
  }

  return body;
}

/**
 * 產生總覽導覽 index.md
 */
export function generateIndexMarkdown(data: KnowledgeBaseData): string {
  let index = `# SynapsePKB 知識庫總覽導覽 (Vault Index)\n\n`;
  index += `匯出時間：${new Date().toLocaleString('zh-TW')}\n\n`;
  index += `本知識庫採用「**原始資料與個人認知徹底分開**」與「**知識網絡化**」之核心理念建構。\n\n`;

  index += `## 統計摘要\n`;
  index += `- 📚 原始資料 (Records)：${data.records.length} 筆\n`;
  index += `- 💭 個人想法 (Thoughts)：${data.thoughts.length} 篇\n`;
  index += `- 🏷️ 主題集合 (Topics)：${data.topics.length} 個\n`;
  index += `- 🔗 知識網絡關聯 (Links)：${data.links.length} 條\n\n`;

  index += `## 主題集合目錄\n`;
  data.topics.forEach((tp) => {
    index += `- [[Topics/${sanitizeFilename(tp.name)}|${tp.name}]] (${tp.unresolvedQuestions.length} 個待解問題)\n`;
  });
  index += '\n';

  index += `## 最近個人想法\n`;
  data.thoughts.slice(0, 5).forEach((t) => {
    const dateStr = t.createdAt.substring(0, 10);
    const title = t.title || t.content.substring(0, 30);
    index += `- [[Thoughts/${dateStr}-${sanitizeFilename(title)}|${title}]] - ${thoughtTypeLabels[t.thoughtType] || t.thoughtType}\n`;
  });

  return index;
}

/**
 * 打包並下載 Obsidian Vault 壓縮包
 */
export async function exportToObsidianZip(data: KnowledgeBaseData): Promise<Blob> {
  const zip = new JSZip();

  // 1. Records folder
  const recordsFolder = zip.folder('Records');
  data.records.forEach((rec) => {
    const dateStr = rec.createdAt.substring(0, 10);
    const relatedThoughts = data.thoughts.filter((t) => t.relatedRecordIds.includes(rec.id));
    const relatedTopicIds = new Set<string>();
    relatedThoughts.forEach((t) => t.topicIds.forEach((tid) => relatedTopicIds.add(tid)));
    const relatedTopics = data.topics.filter((tp) => relatedTopicIds.has(tp.id));

    const content = generateRecordMarkdown(rec, relatedThoughts, relatedTopics);
    const filename = `${dateStr}-${sanitizeFilename(rec.title)}.md`;
    recordsFolder?.file(filename, content);
  });

  // 2. Thoughts folder
  const thoughtsFolder = zip.folder('Thoughts');
  data.thoughts.forEach((thg) => {
    const dateStr = thg.createdAt.substring(0, 10);
    const title = thg.title || thg.content.substring(0, 30);
    const relatedRecords = data.records.filter((r) => thg.relatedRecordIds.includes(r.id));
    const relatedTopics = data.topics.filter((tp) => thg.topicIds.includes(tp.id));

    const content = generateThoughtMarkdown(thg, relatedRecords, relatedTopics);
    const filename = `${dateStr}-${sanitizeFilename(title)}.md`;
    thoughtsFolder?.file(filename, content);
  });

  // 3. Topics folder
  const topicsFolder = zip.folder('Topics');
  data.topics.forEach((tp) => {
    const relatedThoughts = data.thoughts.filter((t) => t.topicIds.includes(tp.id));
    const recIdSet = new Set<string>();
    relatedThoughts.forEach((t) => t.relatedRecordIds.forEach((rid) => recIdSet.add(rid)));
    const relatedRecords = data.records.filter((r) => recIdSet.has(r.id));

    const content = generateTopicMarkdown(tp, relatedRecords, relatedThoughts);
    const filename = `${sanitizeFilename(tp.name)}.md`;
    topicsFolder?.file(filename, content);
  });

  // 4. Index.md
  zip.file('index.md', generateIndexMarkdown(data));

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * 觸發瀏覽器下載 Blob 檔案
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
