import React, { useState } from 'react';
import { X, Link2, FileText, Lightbulb, Check } from 'lucide-react';
import { RecordItem, ThoughtItem, ThoughtType } from '../../types';
import { useKnowledgeBase } from '../../hooks/useKnowledgeBase';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecordId?: string; // Pre-select a record when adding a thought from record view
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  defaultRecordId,
}) => {
  const { records, topics, addRecord, addThought } = useKnowledgeBase();

  const [activeTab, setActiveTab] = useState<'url' | 'text' | 'thought'>(
    defaultRecordId ? 'thought' : 'url'
  );

  // URL Tab state
  const [url, setUrl] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [urlNotes, setUrlNotes] = useState('');
  const [urlTags, setUrlTags] = useState('');

  // Text Tab state
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [textAuthor, setTextAuthor] = useState('');
  const [textType, setTextType] = useState<'text' | 'quote'>('text');
  const [textTags, setTextTags] = useState('');

  // Thought Tab state
  const [thoughtContent, setThoughtContent] = useState('');
  const [thoughtTitle, setThoughtTitle] = useState('');
  const [thoughtType, setThoughtType] = useState<ThoughtType>('insight');
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>(
    defaultRecordId ? [defaultRecordId] : []
  );
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [thoughtTags, setThoughtTags] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSubmitting(true);
    let domain = '';
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      domain = parsed.hostname;
    } catch {
      domain = 'web';
    }

    const title = urlTitle.trim() || `網頁收藏: ${domain}`;
    const tags = urlTags
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    addRecord({
      title,
      url: url.trim(),
      rawContent: urlNotes.trim() || `保存之原始網址：${url.trim()}`,
      type: 'link',
      status: 'unread', // Default to Inbox
      sourceMeta: {
        domain,
        savedAt: new Date().toISOString(),
      },
      tags,
    });

    setIsSubmitting(false);
    onClose();
    resetForm();
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim()) return;

    setIsSubmitting(true);
    const title = textTitle.trim() || textContent.trim().substring(0, 30) + '...';
    const tags = textTags
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    addRecord({
      title,
      rawContent: textContent.trim(),
      type: textType,
      status: 'unread', // Default to Inbox
      sourceMeta: {
        author: textAuthor.trim() || undefined,
        savedAt: new Date().toISOString(),
      },
      tags,
    });

    setIsSubmitting(false);
    onClose();
    resetForm();
  };

  const handleThoughtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thoughtContent.trim()) return;

    setIsSubmitting(true);
    const tags = thoughtTags
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    addThought({
      title: thoughtTitle.trim() || undefined,
      content: thoughtContent.trim(),
      thoughtType,
      relatedRecordIds: selectedRecordIds,
      topicIds: selectedTopicIds,
      tags,
    });

    setIsSubmitting(false);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setUrl('');
    setUrlTitle('');
    setUrlNotes('');
    setUrlTags('');
    setTextContent('');
    setTextTitle('');
    setTextAuthor('');
    setTextTags('');
    setThoughtContent('');
    setThoughtTitle('');
    setThoughtTags('');
    setSelectedRecordIds([]);
    setSelectedTopicIds([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-slate-900 dark:text-white">
              快速新增紀錄
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              低紀錄負擔 · 隨時補充
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 px-6 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 border-b-2 py-3 text-sm font-medium transition ${
              activeTab === 'url'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Link2 className="h-4 w-4" />
            <span>儲存網址來源</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`ml-6 flex items-center gap-2 border-b-2 py-3 text-sm font-medium transition ${
              activeTab === 'text'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>文字與摘錄</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('thought')}
            className={`ml-6 flex items-center gap-2 border-b-2 py-3 text-sm font-medium transition ${
              activeTab === 'thought'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            <span>個人想法 (認知)</span>
          </button>
        </div>

        {/* Tab 1: URL Input */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4 p-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                網址 (URL) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-brand-400"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                僅輸入網址即可立即儲存，標題或資訊若未填將自動容錯保留。
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                自訂標題 (選填)
              </label>
              <input
                type="text"
                placeholder="留空將自動以網域或網址命名"
                value={urlTitle}
                onChange={(e) => setUrlTitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                附註摘錄文字 (選填)
              </label>
              <textarea
                rows={2}
                placeholder="這篇文章吸引你的核心段落或筆記..."
                value={urlNotes}
                onChange={(e) => setUrlNotes(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                標籤 (以逗號或空格分隔，選填)
              </label>
              <input
                type="text"
                placeholder="例如: 機器學習, 系統架構"
                value={urlTags}
                onChange={(e) => setUrlTags(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
              >
                存入收件匣
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Text / Quote */}
        {activeTab === 'text' && (
          <form onSubmit={handleTextSubmit} className="space-y-4 p-6">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  內容片段 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setTextType('text')}
                    className={`rounded-md px-2 py-0.5 font-medium ${
                      textType === 'text'
                        ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300'
                        : 'text-slate-400'
                    }`}
                  >
                    一般筆記
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextType('quote')}
                    className={`rounded-md px-2 py-0.5 font-medium ${
                      textType === 'quote'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                        : 'text-slate-400'
                    }`}
                  >
                    引述佳句
                  </button>
                </div>
              </div>
              <textarea
                required
                autoFocus
                rows={4}
                placeholder="貼上保存的文字、閱讀片段或名言佳句..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  標題 (選填)
                </label>
                <input
                  type="text"
                  placeholder="留空將自動取前 30 字"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  作者 / 出處 (選填)
                </label>
                <input
                  type="text"
                  placeholder="例如: 盧曼, 赫伯特·西蒙"
                  value={textAuthor}
                  onChange={(e) => setTextAuthor(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                標籤 (選填)
              </label>
              <input
                type="text"
                placeholder="例如: 認知科學, 心理學"
                value={textTags}
                onChange={(e) => setTextTags(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
              >
                存入原始資料庫
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Personal Thought */}
        {activeTab === 'thought' && (
          <form onSubmit={handleThoughtSubmit} className="space-y-4 p-6">
            {/* Thought Type Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                認知類型 <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  { id: 'insight', label: '💡 心得領會', desc: '個人理解與體悟' },
                  { id: 'question', label: '❓ 疑問待解', desc: '盲點、待探究' },
                  { id: 'objection', label: '⚠️ 批判反對', desc: '質疑不同意之處' },
                  { id: 'association', label: '🔗 跨界聯想', desc: '概念跳躍觸類旁通' },
                  { id: 'evolution', label: '🔄 觀點演進', desc: '過去與現在看法轉變' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setThoughtType(item.id as ThoughtType)}
                    className={`rounded-xl border p-2 text-left transition ${
                      thoughtType === item.id
                        ? 'border-purple-500 bg-purple-50/70 text-purple-900 ring-2 ring-purple-500/20 dark:border-purple-500 dark:bg-purple-950/40 dark:text-purple-200'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                想法標題 (選填)
              </label>
              <input
                type="text"
                placeholder="一個好標題讓未來的自己快速重溫"
                value={thoughtTitle}
                onChange={(e) => setThoughtTitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                思考內文 <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                autoFocus
                rows={4}
                placeholder="記錄你自己的原汁原味想法、反對意見、聯想或疑惑..."
                value={thoughtContent}
                onChange={(e) => setThoughtContent(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Link to Records (Optional) */}
            {records.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  關聯原始來源 (選填，可多選或獨立建立)
                </label>
                <div className="mt-1.5 max-h-24 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-2 dark:border-slate-800 dark:bg-slate-800/50">
                  {records.map((r) => {
                    const isSelected = selectedRecordIds.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelectedRecordIds((prev) =>
                            isSelected ? prev.filter((id) => id !== r.id) : [...prev, r.id]
                          );
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-left text-xs transition ${
                          isSelected
                            ? 'bg-purple-100 font-medium text-purple-900 dark:bg-purple-900/60 dark:text-purple-200'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="truncate">{r.title}</span>
                        {isSelected && <Check className="ml-2 h-3.5 w-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Assign to Topics (Optional) */}
            {topics.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  歸屬主題集合 (選填，可多選)
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {topics.map((tp) => {
                    const isSelected = selectedTopicIds.includes(tp.id);
                    return (
                      <button
                        key={tp.id}
                        type="button"
                        onClick={() => {
                          setSelectedTopicIds((prev) =>
                            isSelected ? prev.filter((id) => id !== tp.id) : [...prev, tp.id]
                          );
                        }}
                        className={`rounded-lg border px-2.5 py-1 text-xs transition ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50 font-medium text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {tp.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
              >
                儲存個人認知
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
