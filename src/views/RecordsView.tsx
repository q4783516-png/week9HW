import React, { useState } from 'react';
import {
  FileText,
  Search,
  ExternalLink,
  Lightbulb,
  Sparkles,
  Trash2,
  Edit3,
  Check,
  X,
  Plus,
  Clock,
  Filter,
  Eye,
  Download,
  Youtube,
} from 'lucide-react';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { RecordItem, RecordType, RecordStatus } from '../types';
import { analyzeRecordHeuristic } from '../services/aiAssistant';
import {
  thoughtTypeLabels,
  generateRecordMarkdown,
  triggerDownload,
  sanitizeFilename,
} from '../services/obsidianExporter';

interface RecordsViewProps {
  onAddThoughtForRecord: (recordId: string) => void;
  externalSearchQuery?: string;
}

export const RecordsView: React.FC<RecordsViewProps> = ({
  onAddThoughtForRecord,
  externalSearchQuery = '',
}) => {
  const { data, records, thoughts, topics, updateRecord, deleteRecord, setRecordStatus } =
    useKnowledgeBase();

  const [search, setSearch] = useState(externalSearchQuery);
  const [selectedType, setSelectedType] = useState<RecordType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<RecordStatus | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Edit and View states
  const [editingRecord, setEditingRecord] = useState<RecordItem | null>(null);
  const [viewingRecord, setViewingRecord] = useState<RecordItem | null>(null);

  // AI analyzing state
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // Extract all tags
  const allTags = Array.from(new Set(records.flatMap((r) => r.tags))).filter(Boolean);

  // Filter records
  const filtered = records.filter((r) => {
    if (selectedType !== 'all' && r.type !== selectedType) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    if (selectedTag && !r.tags.includes(selectedTag)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const inTitle = r.title.toLowerCase().includes(q);
      const inContent = r.rawContent.toLowerCase().includes(q);
      const inTags = r.tags.some((t) => t.toLowerCase().includes(q));
      const inSummary = r.aiMetadata?.summary?.toLowerCase().includes(q);
      return inTitle || inContent || inTags || inSummary;
    }
    return true;
  });

  const handleRunAI = (record: RecordItem) => {
    setAnalyzingId(record.id);
    setTimeout(() => {
      const result = analyzeRecordHeuristic(record, data);
      updateRecord(record.id, {
        aiMetadata: result.metadata,
      });
      setAnalyzingId(null);
    }, 400);
  };

  const handleDownloadSingleMD = (record: RecordItem) => {
    const relatedThoughts = thoughts.filter((t) => t.relatedRecordIds.includes(record.id));
    const md = generateRecordMarkdown(record, relatedThoughts, []);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const filename = `${record.createdAt.substring(0, 10)}-${sanitizeFilename(record.title)}.md`;
    triggerDownload(blob, filename);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            原始紀錄 (Records)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            保存原始資料、出處與引文。原始內容與 AI 摘要明確隔離，不可被隨意覆蓋。
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋紀錄標題、內容或出處..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">所有格式</option>
            <option value="link">網址來源 (Link)</option>
            <option value="text">純文字/對話 (Text)</option>
            <option value="quote">引述佳句 (Quote)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">所有狀態</option>
            <option value="unread">未讀 (Inbox)</option>
            <option value="read">已讀 (Read)</option>
            <option value="archived">已封存</option>
          </select>
        </div>

        {/* Tag Pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400">標籤篩選:</span>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="flex items-center gap-1 rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200"
              >
                <span>全部</span>
                <X className="h-3 w-3" />
              </button>
            )}
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`rounded-md px-2 py-0.5 text-[11px] transition ${
                  selectedTag === tag
                    ? 'bg-brand-500 font-semibold text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Record List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900">
            未找到符合條件的原始紀錄
          </div>
        ) : (
          filtered.map((r) => {
            const relatedThoughts = thoughts.filter((t) => t.relatedRecordIds.includes(r.id));
            const isYt = r.url?.includes('youtube.com') || r.url?.includes('youtu.be');

            return (
              <div
                key={r.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Header Row */}
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                          isYt
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : r.type === 'link'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : r.type === 'quote'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {isYt ? 'YouTube 影片' : r.type}
                      </span>
                      <h3
                        onClick={() => setViewingRecord(r)}
                        className="cursor-pointer text-base font-bold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
                      >
                        {r.title}
                      </h3>
                      {r.status === 'unread' && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                          收件匣待讀
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-400"
                        >
                          {isYt ? <Youtube className="h-3 w-3 text-red-500" /> : <ExternalLink className="h-3 w-3" />}
                          <span>開啟原始出處</span>
                        </a>
                      )}
                      {r.sourceMeta?.author && <span>作者/來源: {r.sourceMeta.author}</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {r.createdAt.substring(0, 10)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setViewingRecord(r)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                      title="閱讀完整內容"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-500" />
                      <span>全文</span>
                    </button>

                    <button
                      onClick={() => onAddThoughtForRecord(r.id)}
                      className="flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50/50 px-2.5 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
                    >
                      <Lightbulb className="h-3.5 w-3.5" />
                      <span>記錄想法</span>
                    </button>

                    <button
                      onClick={() => handleDownloadSingleMD(r)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                      title="下載單筆 Markdown 檔案"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setEditingRecord(r)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      title="編輯"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => deleteRecord(r.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                      title="刪除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Raw Content Box */}
                <div className="mt-3 rounded-xl bg-slate-50/80 p-3.5 text-xs leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                  <div className="mb-1 text-[10px] font-semibold uppercase text-slate-400">
                    原始內容 / 摘錄
                  </div>
                  <p className="line-clamp-3 whitespace-pre-wrap">{r.rawContent}</p>
                  {r.rawContent.length > 200 && (
                    <button
                      onClick={() => setViewingRecord(r)}
                      className="mt-1 text-[11px] font-semibold text-brand-600 hover:underline dark:text-brand-400"
                    >
                      展開閱讀全文 ({r.rawContent.length} 字)...
                    </button>
                  )}
                </div>

                {/* Tags */}
                {r.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Assistant Section (Distinctly Badged) */}
                <div className="mt-4 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50/40 to-indigo-50/30 p-3.5 dark:border-purple-900/30 dark:from-purple-950/20 dark:to-indigo-950/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span>AI 輔助整理內容 (客觀摘要與概念)</span>
                    </div>

                    <button
                      onClick={() => handleRunAI(r)}
                      disabled={analyzingId === r.id}
                      className="rounded-lg border border-purple-200 bg-white px-2 py-0.5 text-[11px] font-medium text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:bg-slate-800 dark:text-purple-300"
                    >
                      {analyzingId === r.id ? '分析中...' : r.aiMetadata?.summary ? '重新分析' : '一鍵產生 AI 摘要建議'}
                    </button>
                  </div>

                  {r.aiMetadata?.summary ? (
                    <div className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      <p>{r.aiMetadata.summary}</p>
                      {r.aiMetadata.suggestedTags && r.aiMetadata.suggestedTags.length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                            AI 建議標籤:
                          </span>
                          {r.aiMetadata.suggestedTags.map((tg) => (
                            <button
                              key={tg}
                              onClick={() => {
                                updateRecord(r.id, {
                                  tags: [...r.tags, tg],
                                  aiMetadata: {
                                    ...r.aiMetadata,
                                    suggestedTags: r.aiMetadata?.suggestedTags?.filter((x) => x !== tg),
                                  },
                                });
                              }}
                              className="rounded bg-purple-200/60 px-1.5 py-0.5 text-[10px] text-purple-800 hover:bg-purple-300 dark:bg-purple-900 dark:text-purple-200"
                            >
                              + {tg}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1 text-[11px] text-slate-400">
                      尚未進行 AI 分析。點擊右上角按鈕即可自動取得客觀摘要與標籤建議（不影響原始文字）。
                    </p>
                  )}
                </div>

                {/* Related Personal Thoughts */}
                {relatedThoughts.length > 0 && (
                  <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800/60">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      關聯的個人認知想法 ({relatedThoughts.length}):
                    </div>
                    <div className="mt-1.5 space-y-1.5">
                      {relatedThoughts.map((th) => (
                        <div
                          key={th.id}
                          className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs dark:bg-slate-800/40"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                              {thoughtTypeLabels[th.thoughtType]}
                            </span>
                            <span className="truncate text-slate-700 dark:text-slate-300">
                              {th.title || th.content.substring(0, 40)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Full Content Reader Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="flex max-h-[88vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 p-5 dark:border-slate-800">
              <div>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {viewingRecord.type}
                </span>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                  {viewingRecord.title}
                </h3>
                {viewingRecord.url && (
                  <a
                    href={viewingRecord.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex items-center gap-1 text-xs text-brand-600 hover:underline dark:text-brand-400"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>{viewingRecord.url}</span>
                  </a>
                )}
              </div>
              <button
                onClick={() => setViewingRecord(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  原始完整內容
                </h4>
                <div className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
                  {viewingRecord.rawContent}
                </div>
              </div>

              {viewingRecord.aiMetadata?.summary && (
                <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-900/40 dark:bg-purple-950/20">
                  <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300 text-xs">
                    <Sparkles className="h-4 w-4" />
                    <span>AI 客觀摘要</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {viewingRecord.aiMetadata.summary}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-slate-800">
              <button
                onClick={() => handleDownloadSingleMD(viewingRecord)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Download className="h-3.5 w-3.5" />
                <span>下載為 Markdown (.md)</span>
              </button>
              <button
                onClick={() => setViewingRecord(null)}
                className="rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">編輯原始紀錄</h3>
              <button
                onClick={() => setEditingRecord(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateRecord(editingRecord.id, editingRecord);
                setEditingRecord(null);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  標題
                </label>
                <input
                  type="text"
                  value={editingRecord.title}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, title: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  原始內容
                </label>
                <textarea
                  rows={4}
                  value={editingRecord.rawContent}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, rawContent: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-medium text-white hover:bg-brand-700"
                >
                  儲存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
