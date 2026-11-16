import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  HelpCircle,
  FileText,
  Lightbulb,
  Check,
  Trash2,
  Edit3,
  X,
  ExternalLink,
} from 'lucide-react';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { TopicItem } from '../types';
import { thoughtTypeLabels } from '../services/obsidianExporter';

export const TopicsView: React.FC = () => {
  const {
    topics,
    records,
    thoughts,
    addTopic,
    updateTopic,
    deleteTopic,
    addUnresolvedQuestion,
    removeUnresolvedQuestion,
  } = useKnowledgeBase();

  const [activeTopicId, setActiveTopicId] = useState<string>(
    topics[0]?.id || ''
  );
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);

  // New topic state
  const [topicName, setTopicName] = useState('');
  const [topicDesc, setTopicDesc] = useState('');
  const [topicColor, setTopicColor] = useState('#0e8ce9');

  const currentTopic = topics.find((tp) => tp.id === activeTopicId) || topics[0];

  // Thoughts belonging to this topic
  const topicThoughts = currentTopic
    ? thoughts.filter((t) => t.topicIds.includes(currentTopic.id))
    : [];

  // Records referenced by thoughts in this topic
  const recordIds = new Set<string>();
  topicThoughts.forEach((t) => t.relatedRecordIds.forEach((rid) => recordIds.add(rid)));
  const topicRecords = records.filter((r) => recordIds.has(r.id));

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    const newTp = addTopic({
      name: topicName.trim(),
      description: topicDesc.trim(),
      color: topicColor,
      unresolvedQuestions: [],
    });

    setActiveTopicId(newTp.id);
    setIsAddTopicModalOpen(false);
    setTopicName('');
    setTopicDesc('');
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTopic || !newQuestionText.trim()) return;
    addUnresolvedQuestion(currentTopic.id, newQuestionText.trim());
    setNewQuestionText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            主題與集合 (Topics & Collections)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            跨來源聚集知識，追蹤未解問題。同一筆來源或想法可自由屬於多個主題。
          </p>
        </div>
        <button
          onClick={() => setIsAddTopicModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          <span>建立新主題</span>
        </button>
      </div>

      {topics.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900">
          目前尚未建立主題集合，點擊上方按鈕建立第一個主題。
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Topic Navigation Sidebar (1 col) */}
          <div className="space-y-2 lg:col-span-1">
            <span className="text-xs font-semibold uppercase text-slate-400">
              主題列表 ({topics.length})
            </span>
            <div className="space-y-1.5">
              {topics.map((tp) => {
                const isSelected = tp.id === currentTopic?.id;
                return (
                  <button
                    key={tp.id}
                    onClick={() => setActiveTopicId(tp.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition ${
                      isSelected
                        ? 'bg-white font-bold text-slate-900 shadow-xs ring-2 ring-brand-500/20 dark:bg-slate-900 dark:text-white dark:ring-brand-400/20'
                        : 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tp.color || '#0e8ce9' }}
                      />
                      <span className="truncate text-xs">{tp.name}</span>
                    </div>

                    {tp.unresolvedQuestions.length > 0 && (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        {tp.unresolvedQuestions.length} 問
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic Detail View (3 cols) */}
          {currentTopic && (
            <div className="space-y-6 lg:col-span-3">
              {/* Topic Hero Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: currentTopic.color || '#0e8ce9' }}
                      />
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {currentTopic.name}
                      </h2>
                    </div>
                    {currentTopic.description && (
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {currentTopic.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTopic(currentTopic.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                    title="刪除此主題"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Unresolved Questions Section */}
                <div className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                      <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span>待解決之核心問題 (Unresolved Questions)</span>
                    </div>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400">
                      持續探索導向
                    </span>
                  </div>

                  {/* Add Question input */}
                  <form onSubmit={handleAddQuestion} className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="新增此主題待探究或未解的問題..."
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      className="flex-1 rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-amber-400 focus:border-amber-500 focus:outline-none dark:border-amber-900/60 dark:bg-slate-900 dark:text-slate-100"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
                    >
                      新增問題
                    </button>
                  </form>

                  {/* Questions List */}
                  <div className="mt-3 space-y-2">
                    {currentTopic.unresolvedQuestions.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">
                        目前尚無未解問題，隨時記錄你在此主題中遇到的困惑或假說。
                      </p>
                    ) : (
                      currentTopic.unresolvedQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg bg-white/80 p-2.5 shadow-2xs dark:bg-slate-900/80"
                        >
                          <span className="text-xs text-slate-800 dark:text-slate-200">
                            • {q}
                          </span>
                          <button
                            onClick={() => removeUnresolvedQuestion(currentTopic.id, idx)}
                            className="text-xs text-slate-400 hover:text-emerald-600"
                            title="標記已解決/移除"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Two columns: Thoughts & Records in this Topic */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Topic Thoughts */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <Lightbulb className="h-4 w-4 text-purple-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      累積之個人想法 ({topicThoughts.length})
                    </h3>
                  </div>

                  <div className="mt-3 space-y-3">
                    {topicThoughts.length === 0 ? (
                      <p className="text-xs text-slate-400">尚未有想法歸入此主題。</p>
                    ) : (
                      topicThoughts.map((t) => (
                        <div
                          key={t.id}
                          className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                        >
                          <div className="flex items-center justify-between text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                            <span>{thoughtTypeLabels[t.thoughtType]}</span>
                            <span className="text-slate-400">{t.createdAt.substring(5, 10)}</span>
                          </div>
                          {t.title && (
                            <div className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                              {t.title}
                            </div>
                          )}
                          <p className="mt-1 line-clamp-3 text-xs text-slate-600 dark:text-slate-300">
                            {t.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Topic Records */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <FileText className="h-4 w-4 text-brand-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      引用之原始來源 ({topicRecords.length})
                    </h3>
                  </div>

                  <div className="mt-3 space-y-3">
                    {topicRecords.length === 0 ? (
                      <p className="text-xs text-slate-400">目前尚無關聯的原始來源資料。</p>
                    ) : (
                      topicRecords.map((r) => (
                        <div
                          key={r.id}
                          className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                              {r.title}
                            </span>
                            {r.url && (
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-brand-500"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-[11px] text-slate-500 dark:text-slate-400">
                            {r.rawContent}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Topic Modal */}
      {isAddTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">建立新主題集合</h3>
              <button
                onClick={() => setIsAddTopicModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  主題名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如: 認知科學與思維模型"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  主題描述
                </label>
                <textarea
                  rows={3}
                  placeholder="說明此主題探索的方向或範疇..."
                  value={topicDesc}
                  onChange={(e) => setTopicDesc(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  主題識別色彩
                </label>
                <div className="mt-2 flex gap-2">
                  {['#0e8ce9', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'].map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setTopicColor(c)}
                        className={`h-7 w-7 rounded-full border-2 transition ${
                          topicColor === c ? 'border-slate-900 scale-110 dark:border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTopicModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-medium text-white hover:bg-brand-700"
                >
                  建立主題
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
