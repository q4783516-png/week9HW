import React, { useState } from 'react';
import {
  Lightbulb,
  Search,
  Filter,
  Trash2,
  Edit3,
  Link2,
  FolderTree,
  Plus,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { ThoughtItem, ThoughtType } from '../types';
import { thoughtTypeLabels } from '../services/obsidianExporter';

interface ThoughtsViewProps {
  onOpenQuickAdd: () => void;
  externalSearchQuery?: string;
}

export const ThoughtsView: React.FC<ThoughtsViewProps> = ({
  onOpenQuickAdd,
  externalSearchQuery = '',
}) => {
  const { thoughts, records, topics, updateThought, deleteThought } = useKnowledgeBase();

  const [search, setSearch] = useState(externalSearchQuery);
  const [selectedType, setSelectedType] = useState<ThoughtType | 'all'>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string | 'all'>('all');
  const [editingThought, setEditingThought] = useState<ThoughtItem | null>(null);

  const filtered = thoughts.filter((t) => {
    if (selectedType !== 'all' && t.thoughtType !== selectedType) return false;
    if (selectedTopicId !== 'all' && !t.topicIds.includes(selectedTopicId)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const inTitle = t.title ? t.title.toLowerCase().includes(q) : false;
      const inContent = t.content.toLowerCase().includes(q);
      const inTags = t.tags.some((tg) => tg.toLowerCase().includes(q));
      return inTitle || inContent || inTags;
    }
    return true;
  });

  const getThoughtBadgeStyle = (type: ThoughtType) => {
    switch (type) {
      case 'insight':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'question':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'objection':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800';
      case 'association':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'evolution':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            個人認知與想法 (Thoughts)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            以個人認知為核心。記錄心得、質疑、聯想與觀點轉變，展現心智模型的成長歷程。
          </p>
        </div>
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          <span>記錄新想法</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋個人想法或關鍵字..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">所有認知類型</option>
            <option value="insight">💡 心得領會 (Insight)</option>
            <option value="question">❓ 疑問盲點 (Question)</option>
            <option value="objection">⚠️ 批判反對 (Objection)</option>
            <option value="association">🔗 跨界聯想 (Association)</option>
            <option value="evolution">🔄 觀點演進 (Evolution)</option>
          </select>

          {/* Topic Filter */}
          {topics.length > 0 && (
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="all">所有主題集合</option>
              {topics.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {tp.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Thoughts Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900">
            目前無符合條件的個人想法
          </div>
        ) : (
          filtered.map((t) => {
            const linkedRecords = records.filter((r) => t.relatedRecordIds.includes(r.id));
            const linkedTopics = topics.filter((tp) => t.topicIds.includes(tp.id));

            return (
              <div
                key={t.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  {/* Top Bar with Type Badge & Date */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getThoughtBadgeStyle(
                        t.thoughtType
                      )}`}
                    >
                      {thoughtTypeLabels[t.thoughtType]}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{t.createdAt.substring(0, 10)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  {t.title && (
                    <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-white">
                      {t.title}
                    </h3>
                  )}

                  {/* Content */}
                  <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {t.content}
                  </p>

                  {/* Tags */}
                  {t.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {t.tags.map((tg) => (
                        <span
                          key={tg}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        >
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Section: Sources and Topics */}
                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                  {linkedRecords.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400">關聯來源:</span>
                      {linkedRecords.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center gap-1.5 truncate text-[11px] text-brand-600 dark:text-brand-400"
                        >
                          <Link2 className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{r.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {linkedTopics.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {linkedTopics.map((tp) => (
                        <span
                          key={tp.id}
                          className="flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          <FolderTree className="h-3 w-3 text-slate-400" />
                          <span>{tp.name}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex justify-end gap-1">
                    <button
                      onClick={() => setEditingThought(t)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                      title="編輯"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteThought(t.id)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                      title="刪除"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Thought Modal */}
      {editingThought && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">編輯個人想法</h3>
              <button
                onClick={() => setEditingThought(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateThought(editingThought.id, editingThought);
                setEditingThought(null);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  標題
                </label>
                <input
                  type="text"
                  value={editingThought.title || ''}
                  onChange={(e) =>
                    setEditingThought({ ...editingThought, title: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  認知類型
                </label>
                <select
                  value={editingThought.thoughtType}
                  onChange={(e) =>
                    setEditingThought({ ...editingThought, thoughtType: e.target.value as any })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800"
                >
                  <option value="insight">💡 心得領會 (Insight)</option>
                  <option value="question">❓ 疑問盲點 (Question)</option>
                  <option value="objection">⚠️ 批判反對 (Objection)</option>
                  <option value="association">🔗 跨界聯想 (Association)</option>
                  <option value="evolution">🔄 觀點演進 (Evolution)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  思考內容
                </label>
                <textarea
                  rows={5}
                  value={editingThought.content}
                  onChange={(e) =>
                    setEditingThought({ ...editingThought, content: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingThought(null)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-medium text-white hover:bg-purple-700"
                >
                  儲存變更
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
