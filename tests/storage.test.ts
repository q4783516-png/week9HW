import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../src/services/storage';

describe('StorageService (Repository & Data Model)', () => {
  beforeEach(() => {
    localStorage.clear();
    // Re-initialize storage with fixtures
    storage.resetToFixtures();
  });

  it('應能正確載入預設虛構資料', () => {
    const data = storage.getData();
    expect(data.records.length).toBeGreaterThan(0);
    expect(data.thoughts.length).toBeGreaterThan(0);
    expect(data.topics.length).toBeGreaterThan(0);
    expect(data.links.length).toBeGreaterThan(0);
  });

  it('應能新增原始資料（Record）並正確保留出處', () => {
    const newRecord = storage.addRecord({
      title: '測試文章出處',
      url: 'https://example.com/test-article',
      rawContent: '這是測試的原始內容段落。',
      type: 'link',
      status: 'unread',
      tags: ['測試標籤'],
    });

    expect(newRecord.id).toBeDefined();
    expect(newRecord.title).toBe('測試文章出處');
    expect(newRecord.status).toBe('unread');

    const all = storage.getData().records;
    expect(all.some((r) => r.id === newRecord.id)).toBe(true);
  });

  it('應能獨立新增個人想法（Thought）而不強制依附來源', () => {
    const newThought = storage.addThought({
      title: '突發靈感',
      content: '這是獨立產生的思考洞察，無需預先選擇來源。',
      thoughtType: 'insight',
      relatedRecordIds: [],
      topicIds: [],
      tags: ['靈感'],
    });

    expect(newThought.id).toBeDefined();
    expect(newThought.relatedRecordIds).toHaveLength(0);
    expect(newThought.thoughtType).toBe('insight');
  });

  it('嚴格遵守核心原則：個人想法與原始資料分開，更新想法絕不覆寫原始紀錄', () => {
    const initialRecords = [...storage.getData().records];
    const targetRecord = initialRecords[0];
    const originalContent = targetRecord.rawContent;

    // 新增關聯該 Record 的批判想法
    const thought = storage.addThought({
      title: '反對意見',
      content: '我強烈質疑原作者的論點。',
      thoughtType: 'objection',
      relatedRecordIds: [targetRecord.id],
      topicIds: [],
      tags: ['質疑'],
    });

    // 檢查原始 Record 的內容未受任何影響
    const recordAfterThought = storage.getData().records.find((r) => r.id === targetRecord.id);
    expect(recordAfterThought?.rawContent).toBe(originalContent);
  });

  it('收件匣待處理流程：標記已讀不影響資料完整性與唯一識別碼', () => {
    const unread = storage.getData().records.find((r) => r.status === 'unread');
    expect(unread).toBeDefined();

    if (unread) {
      const originalId = unread.id;
      const success = storage.setRecordStatus(unread.id, 'read');
      expect(success).toBe(true);

      const updated = storage.getData().records.find((r) => r.id === originalId);
      expect(updated?.status).toBe('read');
      expect(updated?.id).toBe(originalId);
    }
  });

  it('主題應能追蹤未解之核心問題（Unresolved Questions）', () => {
    const topic = storage.getData().topics[0];
    expect(topic).toBeDefined();

    const initialCount = topic.unresolvedQuestions.length;
    storage.addUnresolvedQuestion(topic.id, '這是一個新提出的待解決假說？');

    const updatedTopic = storage.getData().topics.find((t) => t.id === topic.id);
    expect(updatedTopic?.unresolvedQuestions.length).toBe(initialCount + 1);

    // 移除/標記解決
    storage.removeUnresolvedQuestion(topic.id, updatedTopic!.unresolvedQuestions.length - 1);
    const finalTopic = storage.getData().topics.find((t) => t.id === topic.id);
    expect(finalTopic?.unresolvedQuestions.length).toBe(initialCount);
  });

  it('完整資料備份與還原功能測試', () => {
    const backup = storage.exportBackup();
    expect(backup.version).toBe('1.0.0');
    expect(backup.appName).toBe('SynapsePKB');
    expect(backup.stats.recordCount).toBe(storage.getData().records.length);

    // 清空資料
    storage.clearAll();
    expect(storage.getData().records).toHaveLength(0);

    // 還原資料
    storage.importBackup(backup, 'replace');
    expect(storage.getData().records.length).toBe(backup.stats.recordCount);
  });
});
