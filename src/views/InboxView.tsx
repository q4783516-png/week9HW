import React, { useState } from 'react';
import {
  Inbox,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  Sparkles,
  Trash2,
  FolderPlus,
  Clock,
} from 'lucide-react';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { analyzeRecordHeuristic } from '../services/aiAssistant';
import { RecordItem } from '../types';

interface InboxViewProps {
  onAddThoughtForRecord: (recordId: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({ onAddThoughtForRecord }) => {
  const { data, records, topics, setRecordStatus, updateRecord, deleteRecord } =
    useKnowledgeBase();

  const unreadRecords = records.filter((r) => r.status === 'unread');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [selectedRecordForTopic, setSelectedRecordForTopic] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              收件匣 (Inbox)
            </h1>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              {unreadRecords.length} 筆待處理
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            集中存放尚未閱讀或未整理的原始資料。處理完成後標記已讀，資料依然完整保留在知識庫中。
          </p>
        </div>
      </div>

      {unreadRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">
            收件匣已全數清空！
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-400">
            所有原始紀錄均已妥善閱讀或整理。隨時使用「快速新增」保存新看到的網址與文字。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {unreadRecords.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        item.type === 'link'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.type}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.rawContent}
                  </p>

                  {/* Source Metadata */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-400"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>開啟原始網址</span>
                      </a>
                    )}
                    {item.sourceMeta?.author && (
                      <span>作者: {item.sourceMeta.author}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.createdAt.substring(0, 10)}
                    </span>
                  </div>

                  {/* AI Metadata Display if exists */}
                  {item.aiMetadata?.summary && (
                    <div className="mt-3 rounded-xl border border-purple-100 bg-purple-50/60 p-3 text-xs dark:border-purple-900/40 dark:bg-purple-950/30">
                      <div className="flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>AI 輔助整理建議 (待確認)</span>
                      </div>
                      <p className="mt-1 text-slate-700 dark:text-slate-300">
                        {item.aiMetadata.summary}
                      </p>
                      {item.aiMetadata.suggestedTags && item.aiMetadata.suggestedTags.length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-400">建議標籤:</span>
                          {item.aiMetadata.suggestedTags.map((t) => (
                            <button
                              key={t}
                              onClick={() => {
                                updateRecord(item.id, {
                                  tags: [...item.tags, t],
                                  aiMetadata: {
                                    ...item.aiMetadata,
                                    suggestedTags: item.aiMetadata?.suggestedTags?.filter((tg) => tg !== t),
                                  },
                                });
                              }}
                              className="rounded-md bg-purple-200/50 px-1.5 py-0.5 text-[10px] font-medium text-purple-800 hover:bg-purple-200 dark:bg-purple-900/70 dark:text-purple-200"
                            >
                              + {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                  <button
                    onClick={() => setRecordStatus(item.id, 'read')}
                    className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>標記已讀</span>
                  </button>

                  <button
                    onClick={() => onAddThoughtForRecord(item.id)}
                    className="flex items-center gap-1 rounded-xl border border-purple-200 bg-purple-50/70 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>記錄想法</span>
                  </button>

                  <button
                    onClick={() => handleRunAI(item)}
                    disabled={analyzingId === item.id}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                    <span>{analyzingId === item.id ? '分析中...' : 'AI 摘要建議'}</span>
                  </button>

                  <button
                    onClick={() => deleteRecord(item.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50"
                    title="刪除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
