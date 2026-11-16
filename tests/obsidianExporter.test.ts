import { describe, it, expect } from 'vitest';
import {
  generateRecordMarkdown,
  generateThoughtMarkdown,
  generateTopicMarkdown,
  exportToObsidianZip,
  sanitizeFilename,
} from '../src/services/obsidianExporter';
import { initialFixtures } from '../src/data/fixtures';

describe('ObsidianExporter (Markdown & Data Portability)', () => {
  it('sanitizeFilename 應過濾非法字元', () => {
    expect(sanitizeFilename('什麼是「卡片盒筆記」？/\\:*?"<>|')).not.toMatch(/[\\/:*?"<>|]/);
  });

  it('產生 Record Markdown 應包含 YAML Frontmatter 與出處 Callout', () => {
    const record = initialFixtures.records[0];
    const relatedThoughts = initialFixtures.thoughts.filter((t) =>
      t.relatedRecordIds.includes(record.id)
    );
    const md = generateRecordMarkdown(record, relatedThoughts, []);

    expect(md).toContain('---');
    expect(md).toContain('type: record');
    expect(md).toContain(record.title);
    expect(md).toContain('> [!INFO] 資料來源出處');
    expect(md).toContain(record.rawContent);

    // AI 摘要必須包含免責與獨立宣告 Callout
    if (record.aiMetadata?.summary) {
      expect(md).toContain('> [!NOTE] AI 產出聲明');
      expect(md).toContain(record.aiMetadata.summary);
    }
  });

  it('產生 Thought Markdown 應突顯個人認知類型與關聯出處雙向連結', () => {
    const thought = initialFixtures.thoughts[0];
    const relatedRecords = initialFixtures.records.filter((r) =>
      thought.relatedRecordIds.includes(r.id)
    );
    const md = generateThoughtMarkdown(thought, relatedRecords, []);

    expect(md).toContain('type: thought');
    expect(md).toContain(`thoughtType: ${thought.thoughtType}`);
    expect(md).toContain('> [!IMPORTANT] 個人主觀認知');
    expect(md).toContain(thought.content);

    // 關聯來源應以 Obsidian [[wikilink]] 呈現
    if (relatedRecords.length > 0) {
      expect(md).toContain('[[Records/');
    }
  });

  it('產生 Topic Markdown 應包含待解決問題清單 (Unresolved Questions)', () => {
    const topic = initialFixtures.topics[0];
    const md = generateTopicMarkdown(topic, [], []);

    expect(md).toContain('type: topic');
    expect(md).toContain(topic.name);
    expect(md).toContain('## 待解決之核心問題 (Unresolved Questions)');
    topic.unresolvedQuestions.forEach((q) => {
      expect(md).toContain(`- [ ] ${q}`);
    });
  });

  it('exportToObsidianZip 應成功打包為 ZIP Blob', async () => {
    const zipBlob = await exportToObsidianZip(initialFixtures);
    expect(zipBlob).toBeInstanceOf(Blob);
    expect(zipBlob.size).toBeGreaterThan(0);
  });
});
