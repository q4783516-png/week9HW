import { describe, it, expect } from 'vitest';
import { searchAndFilter } from '../src/services/searchEngine';
import { analyzeRecordHeuristic } from '../src/services/aiAssistant';
import { initialFixtures } from '../src/data/fixtures';

describe('SearchEngine & AIAssistant', () => {
  it('searchAndFilter 應能依關鍵字全文檢索跨來源與想法', () => {
    const result = searchAndFilter(initialFixtures, { query: 'Transformer' });
    expect(result.totalMatches).toBeGreaterThan(0);
    expect(result.records.some((r) => r.title.includes('Transformer'))).toBe(true);
  });

  it('searchAndFilter 應能依狀態篩選收件匣項目', () => {
    const unreadResult = searchAndFilter(initialFixtures, { recordStatus: 'unread' });
    expect(unreadResult.records.every((r) => r.status === 'unread')).toBe(true);
  });

  it('searchAndFilter 應能依認知類型篩選想法', () => {
    const objectionResult = searchAndFilter(initialFixtures, { thoughtType: 'objection' });
    expect(objectionResult.thoughts.every((t) => t.thoughtType === 'objection')).toBe(true);
  });

  it('analyzeRecordHeuristic 產出建議且絕不覆寫使用者原始文字', () => {
    const record = initialFixtures.records[3]; // Deep Work 待讀
    const analysis = analyzeRecordHeuristic(record, initialFixtures);

    expect(analysis.metadata.summary).toBeDefined();
    expect(analysis.metadata.suggestedTags).toBeInstanceOf(Array);
    expect(analysis.suggestedQuestions.length).toBeGreaterThan(0);

    // 驗證原 record 本身未被原地污染
    expect(record.rawContent).toContain('深度工作能力');
  });
});
