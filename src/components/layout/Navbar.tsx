import React from 'react';
import { Plus, Sun, Moon, Search, BrainCircuit } from 'lucide-react';
import { storage } from '../../services/storage';

interface NavbarProps {
  onOpenQuickAdd: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentTheme: 'light' | 'dark' | 'system';
  onThemeToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuickAdd,
  searchQuery,
  onSearchChange,
  currentTheme,
  onThemeToggle,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 lg:px-8">
      {/* Brand & Mobile Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-sm shadow-brand-500/20">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Synapse<span className="text-brand-500">PKB</span>
          </span>
          <span className="ml-2 hidden rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:inline">
            個人認知知識庫
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative mx-4 flex max-w-md flex-1 items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜尋原始資料、個人想法、標籤或主題..."
          className="w-full rounded-full border border-slate-200 bg-slate-50/70 py-1.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-brand-400 dark:focus:bg-slate-900"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            清除
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={onThemeToggle}
          title={`當前模式: ${currentTheme}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          {document.documentElement.classList.contains('dark') ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </button>

        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">快速新增</span>
        </button>
      </div>
    </header>
  );
};
