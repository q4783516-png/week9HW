import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Lightbulb,
  FolderTree,
  Network,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'inbox' | 'records' | 'thoughts' | 'topics' | 'graph' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  inboxCount: number;
  recordsCount: number;
  thoughtsCount: number;
  topicsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  inboxCount,
  recordsCount,
  thoughtsCount,
  topicsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: '首頁儀表板',
      icon: LayoutDashboard,
    },
    {
      id: 'inbox' as ActiveTab,
      label: '收件匣 (Inbox)',
      icon: Inbox,
      badge: inboxCount > 0 ? inboxCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'records' as ActiveTab,
      label: '原始紀錄 (Records)',
      icon: FileText,
      count: recordsCount,
    },
    {
      id: 'thoughts' as ActiveTab,
      label: '個人認知 (Thoughts)',
      icon: Lightbulb,
      count: thoughtsCount,
    },
    {
      id: 'topics' as ActiveTab,
      label: '主題集合 (Topics)',
      icon: FolderTree,
      count: topicsCount,
    },
    {
      id: 'graph' as ActiveTab,
      label: '知識圖譜 (Graph)',
      icon: Network,
    },
    {
      id: 'settings' as ActiveTab,
      label: '資料管理與備份',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/50">
      <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        知識工作區
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}

              {item.count !== undefined && item.badge === undefined && (
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Safety & Philosophy Badge */}
      <div className="mt-8 rounded-xl border border-slate-200/70 bg-white/60 p-3 shadow-xs dark:border-slate-800/70 dark:bg-slate-800/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>核心原則保障</span>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          原始資料與個人認知分開；AI 提供整理建議，不覆寫使用者觀點。
        </p>
      </div>
    </aside>
  );
};
