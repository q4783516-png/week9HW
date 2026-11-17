import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../src/services/storage';
import { initialFixtures } from '../src/data/fixtures';
import { generateRecordMarkdown } from '../src/services/obsidianExporter';

describe('Real World Knowledge Management Cases', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.resetToFixtures();
  });

  it('應包含 YouTube 知識影片案例（如何提供有效安慰）與相關思考', () => {
    const data = storage.getData();
    const ytRecord = data.records.find((r) => r.url?.includes('youtube.com/watch?v=BaxuGWxUv9A'));
    expect(ytRecord).toBeDefined();
    expect(ytRecord?.title).toContain('如何提供有效安慰');
    expect(ytRecord?.rawContent).toContain('情緒不是我們要解決的問題');

    // 檢查關聯的個人認知想法
    const relatedThought = data.thoughts.find((t) => t.relatedRecordIds.includes(ytRecord!.id));
    expect(relatedThought).toBeDefined();
    expect(relatedThought?.title).toContain('解決問題導向');
    expect(relatedThought?.thoughtType).toBe('insight');

    // 檢查主題
    const topic = data.topics.find((tp) => tp.id === 'top-004');
    expect(topic?.name).toBe('情緒溝通與同理心實踐');
    expect(topic?.unresolvedQuestions.length).toBeGreaterThan(0);
  });

  it('應包含 ChatGPT 對話紀錄案例（LLM Wiki 到資料輸入設計）與觀點演進', () => {
    const data = storage.getData();
    const chatRecord = data.records.find((r) => r.id === 'rec-007');
    expect(chatRecord).toBeDefined();
    expect(chatRecord?.title).toContain('LLM Wiki 到資料輸入設計');

    // 檢查觀點演進思考（待觀看資料是否應具備網絡節點身分）
    const evolutionThought = data.thoughts.find(
      (t) => t.id === 'thg-007' && t.thoughtType === 'evolution'
    );
    expect(evolutionThought).toBeDefined();
    expect(evolutionThought?.content).toContain('待觀看的影片只要有初步的標題與索引');

    // 檢查跨紀錄多對多關聯：thg-007 連結了 rec-007 與 rec-004
    expect(evolutionThought?.relatedRecordIds).toContain('rec-007');
    expect(evolutionThought?.relatedRecordIds).toContain('rec-004');
  });

  it('單筆 Record 匯出 Markdown 應保留出處與 AI 標註', () => {
    const ytRecord = initialFixtures.records.find((r) => r.id === 'rec-006')!;
    const md = generateRecordMarkdown(ytRecord, [], []);
    expect(md).toContain('如何提供有效安慰');
    expect(md).toContain('https://www.youtube.com/watch?v=BaxuGWxUv9A');
    expect(md).toContain('> [!NOTE] AI 產出聲明');
    expect(md).toContain('影片探討有效安慰的核心本質');
  });
});
