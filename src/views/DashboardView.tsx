import React from 'react';
import {
  FileText,
  Lightbulb,
  FolderTree,
  Network,
  Inbox,
  ArrowRight,
  Clock,
  HelpCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { thoughtTypeLabels } from '../services/obsidianExporter';
import { ActiveTab } from '../components/layout/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenQuickAdd: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenQuickAdd,
}) => {
  const { records, thoughts, topics, links, setRecordStatus } = useKnowledgeBase();

  const unreadRecords = records.filter((r) => r.status === 'unread');
  const recentRecords = [...records]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  const recentThoughts = [...thoughts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Collect unresolved questions across topics
  const allUnresolved = topics.flatMap((tp) =>
    tp.unresolvedQuestions.map((q) => ({ topicName: tp.name, topicId: tp.id, question: q }))
  );

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Quick Stats */}
      <div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              知識探索儀表板
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              累積個人認知，看見知識網絡的自然連結與演進。
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={onOpenQuickAdd}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-500/20 hover:bg-brand-700"
            >
              + 快速記錄
            </button>
            <button
              onClick={() => onNavigate('graph')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
            >
              <Network className="h-4 w-4 text-brand-500" />
              <span>探索知識網絡</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div
            onClick={() => onNavigate('inbox')}
            className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-amber-400/60 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                待處理收件匣
              </span>
              <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500 dark:bg-amber-500/20">
                <Inbox className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {unreadRecords.length}
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400">
                {unreadRecords.length > 0 ? '待閱讀整理' : '已全部整理'}
              </span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('records')}
            className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-brand-400/60 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                原始資料出處
              </span>
              <div className="rounded-xl bg-brand-500/10 p-2 text-brand-500 dark:bg-brand-500/20">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {records.length}
              </span>
              <span className="text-xs text-slate-400">篇來源紀錄</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('thoughts')}
            className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-purple-400/60 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                個人認知觀點
              </span>
              <div className="rounded-xl bg-purple-500/10 p-2 text-purple-500 dark:bg-purple-500/20">
                <Lightbulb className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {thoughts.length}
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400">心得、質疑與聯想</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('topics')}
            className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-emerald-400/60 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                主題與關聯
              </span>
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500 dark:bg-emerald-500/20">
                <FolderTree className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {topics.length}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                {links.length} 條網絡連結
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Recent Records & Inbox (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Inbox Highlight Alert if unread exists */}
          {unreadRecords.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                    收件匣有 {unreadRecords.length} 筆資料等待閱讀或整理
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('inbox')}
                  className="flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
                >
                  <span>前往處理</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {unreadRecords.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-white/80 p-3 shadow-xs dark:bg-slate-900/80"
                  >
                    <div className="min-w-0 pr-4">
                      <div className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                        {item.title}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-slate-400">
                        {item.url || item.rawContent.substring(0, 60)}
                      </div>
                    </div>
                    <button
                      onClick={() => setRecordStatus(item.id, 'read')}
                      className="flex-shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      標記已讀
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Records */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-500" />
                <h2 className="font-bold text-slate-900 dark:text-white">近期原始紀錄</h2>
              </div>
              <button
                onClick={() => onNavigate('records')}
                className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                <span>查看全部 ({records.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/60">
              {recentRecords.map((r) => (
                <div key={r.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                            r.type === 'link'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : r.type === 'quote'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {r.type}
                        </span>
                        <h4 className="font-medium text-slate-800 dark:text-slate-200">
                          {r.title}
                        </h4>
                      </div>
                      <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {r.rawContent}
                      </p>
                      {r.aiMetadata?.summary && (
                        <div className="flex items-center gap-1.5 text-[11px] text-purple-600 dark:text-purple-400">
                          <Sparkles className="h-3 w-3" />
                          <span className="font-medium">AI 摘要：</span>
                          <span className="line-clamp-1">{r.aiMetadata.summary}</span>
                        </div>
                      )}
                    </div>

                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded p-1 text-slate-400 hover:text-brand-500"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Thoughts & Unresolved Questions (1 col) */}
        <div className="space-y-6">
          {/* Recent Thoughts */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-500" />
                <h2 className="font-bold text-slate-900 dark:text-white">個人認知歷程</h2>
              </div>
              <button
                onClick={() => onNavigate('thoughts')}
                className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                <span>瀏覽 ({thoughts.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {recentThoughts.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition dark:border-slate-800/60 dark:bg-slate-800/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {thoughtTypeLabels[t.thoughtType] || t.thoughtType}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {t.createdAt.substring(5, 10)}
                    </span>
                  </div>
                  {t.title && (
                    <div className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                      {t.title}
                    </div>
                  )}
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {t.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Unresolved Questions Tracker */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
              <HelpCircle className="h-5 w-5 text-amber-500" />
              <h2 className="font-bold text-slate-900 dark:text-white">主題未解疑問</h2>
            </div>
            <div className="mt-3 space-y-2.5">
              {allUnresolved.slice(0, 4).map((item, idx) => (
                <div key={idx} className="rounded-lg bg-amber-50/50 p-2.5 dark:bg-amber-950/20">
                  <span className="rounded bg-amber-200/60 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                    {item.topicName}
                  </span>
                  <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {item.question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
