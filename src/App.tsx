import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { QuickAddModal } from './components/quick-add/QuickAddModal';
import { DashboardView } from './views/DashboardView';
import { InboxView } from './views/InboxView';
import { RecordsView } from './views/RecordsView';
import { ThoughtsView } from './views/ThoughtsView';
import { TopicsView } from './views/TopicsView';
import { GraphView } from './views/GraphView';
import { SettingsView } from './views/SettingsView';
import { useKnowledgeBase } from './hooks/useKnowledgeBase';
import { storage } from './services/storage';

export function App() {
  const { records, thoughts, topics } = useKnowledgeBase();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddRecordId, setQuickAddRecordId] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => storage.getTheme());

  useEffect(() => {
    storage.applyTheme();
  }, []);

  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
    storage.setTheme(next);
  };

  const handleOpenQuickAdd = (recordId?: string) => {
    setQuickAddRecordId(recordId);
    setIsQuickAddOpen(true);
  };

  const unreadCount = records.filter((r) => r.status === 'unread').length;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Navbar */}
      <Navbar
        onOpenQuickAdd={() => handleOpenQuickAdd()}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && activeTab !== 'records' && activeTab !== 'thoughts') {
            setActiveTab('records');
          }
        }}
        currentTheme={theme}
        onThemeToggle={handleThemeToggle}
      />

      {/* Main App Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          inboxCount={unreadCount}
          recordsCount={records.length}
          thoughtsCount={thoughts.length}
          topicsCount={topics.length}
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {activeTab === 'dashboard' && (
              <DashboardView
                onNavigate={setActiveTab}
                onOpenQuickAdd={() => handleOpenQuickAdd()}
              />
            )}

            {activeTab === 'inbox' && (
              <InboxView onAddThoughtForRecord={(rid) => handleOpenQuickAdd(rid)} />
            )}

            {activeTab === 'records' && (
              <RecordsView
                onAddThoughtForRecord={(rid) => handleOpenQuickAdd(rid)}
                externalSearchQuery={searchQuery}
              />
            )}

            {activeTab === 'thoughts' && (
              <ThoughtsView
                onOpenQuickAdd={() => handleOpenQuickAdd()}
                externalSearchQuery={searchQuery}
              />
            )}

            {activeTab === 'topics' && <TopicsView />}

            {activeTab === 'graph' && <GraphView />}

            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => {
          setIsQuickAddOpen(false);
          setQuickAddRecordId(undefined);
        }}
        defaultRecordId={quickAddRecordId}
      />
    </div>
  );
}
export default App;
