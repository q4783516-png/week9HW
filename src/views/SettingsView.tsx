import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  FolderArchive,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Sun,
  Moon,
  Laptop,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { exportToObsidianZip, triggerDownload } from '../services/obsidianExporter';
import { storage } from '../services/storage';

export const SettingsView: React.FC = () => {
  const { data, exportBackup, importBackup, resetToFixtures, clearAll } = useKnowledgeBase();

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(
    storage.getTheme()
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isExportingObsidian, setIsExportingObsidian] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleExportJSON = () => {
    const backup = exportBackup();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const filename = `SynapsePKB-Backup-${new Date().toISOString().substring(0, 10)}.json`;
    triggerDownload(blob, filename);
    showStatus('已成功匯出 JSON 完整備份！');
  };

  const handleExportObsidian = async () => {
    setIsExportingObsidian(true);
    try {
      const blob = await exportToObsidianZip(data);
      const filename = `SynapsePKB-Obsidian-Vault-${new Date().toISOString().substring(0, 10)}.zip`;
      triggerDownload(blob, filename);
      showStatus('已成功產生並下載符合 Obsidian 規格的 Markdown 壓縮包！');
    } catch (err) {
      console.error(err);
      showStatus('匯出 Obsidian 格式失敗，請重試');
    } finally {
      setIsExportingObsidian(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        importBackup(parsed, 'replace');
        showStatus('已成功還原備份資料！');
      } catch (err: any) {
        alert(`還原失敗: ${err.message || '無效的備份檔案'}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(theme);
    storage.setTheme(theme);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          資料管理、備份與系統設定
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          保證資料主權與可攜性。你的知識庫資料 100% 留存在本地，隨時可無損備份、轉移至 Obsidian 或重置。
        </p>
      </div>

      {statusMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Theme Settings */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          介面模式 (Theme)
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          提供淺色、深色及跟隨系統外觀設定，保護閱讀視力。
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { id: 'light', label: '淺色模式 (Light)', icon: Sun },
            { id: 'dark', label: '深色模式 (Dark)', icon: Moon },
            { id: 'system', label: '跟隨系統 (System)', icon: Laptop },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = currentTheme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleThemeChange(item.id as any)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20 dark:bg-brand-950/60 dark:text-brand-300'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Obsidian Export Card */}
      <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-r from-purple-50/50 to-indigo-50/30 p-6 shadow-xs dark:border-purple-900/50 dark:from-purple-950/20 dark:to-indigo-950/10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-base font-bold text-purple-950 dark:text-purple-200">
              <FolderArchive className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span>匯出為 Obsidian 相容知識庫 (Vault ZIP)</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              符合規格第 6 節「長期相容性與資料可攜性」。將所有原始記錄、個人認知、主題集合與關聯，一鍵打包為結構化 Markdown 檔案包，包含 YAML Frontmatter、雙向連結 <code>[[wikilinks]]</code> 及標籤，可直接以 Obsidian 開啟為 Vault。
            </p>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleExportObsidian}
            disabled={isExportingObsidian}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{isExportingObsidian ? '打包生成中...' : '下載 Obsidian Markdown 壓縮包 (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* JSON Backup & Restore Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          完整資料備份與還原 (JSON)
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          匯出包含所有紀錄、想法、主題與圖譜網絡關係的完整 JSON 檔案；在其他瀏覽器或電腦上一鍵無損還原。
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Download className="h-4 w-4 text-brand-500" />
            <span>匯出完整 JSON 備份</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Upload className="h-4 w-4 text-emerald-500" />
            <span>從 JSON 備份檔案還原</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Fixtures & Danger Zone */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          測試展示資料與重置
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          載入符合規格要求之虛構測試資料（含卡片筆記法、Transformer、系統思考等情境），或完全清空本地資料。
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => {
              resetToFixtures();
              showStatus('已成功重置並載入預設虛構測試資料！');
            }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4 text-blue-500" />
            <span>載入完整虛構測試資料 (Fixtures)</span>
          </button>

          <button
            onClick={() => setConfirmClearOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <Trash2 className="h-4 w-4" />
            <span>清空所有本機資料</span>
          </button>
        </div>
      </div>

      {/* Confirm Clear Modal */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-red-200 bg-white p-6 shadow-2xl dark:border-red-900 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                確定要清空資料嗎？
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              規格第 5 條要求：任何可能造成資料遺失的操作都應有清楚的提示與保護方式。此操作將清空瀏覽器中的所有紀錄、想法、主題與關聯網絡。
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300"
              >
                取消保留
              </button>
              <button
                onClick={() => {
                  clearAll();
                  setConfirmClearOpen(false);
                  showStatus('已清空所有本機資料！');
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                確認清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
