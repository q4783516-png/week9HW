import { KnowledgeBaseData, RecordItem, ThoughtItem, TopicItem, KnowledgeLink, BackupPayload } from '../types';
import { initialFixtures } from '../data/fixtures';

const STORAGE_KEY = 'synapse_pkb_data_v1';
const THEME_KEY = 'synapse_pkb_theme';

type Listener = () => void;

class StorageService {
  private data: KnowledgeBaseData;
  private listeners: Set<Listener> = new Set();
  private isInitialized = false;

  constructor() {
    this.data = {
      records: [],
      thoughts: [],
      topics: [],
      links: [],
    };
  }

  public init(): KnowledgeBaseData {
    if (this.isInitialized) {
      return this.data;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.records)) {
          this.data = parsed;
          this.isInitialized = true;
          return this.data;
        }
      }
    } catch (err) {
      console.warn('Failed to load from localStorage, initializing with defaults', err);
    }

    // Default to initial fixtures for rich initial experience
    this.data = JSON.parse(JSON.stringify(initialFixtures));
    this.save();
    this.isInitialized = true;
    return this.data;
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  public getData(): KnowledgeBaseData {
    if (!this.isInitialized) {
      this.init();
    }
    return this.data;
  }

  // ============ RECORDS ============
  public addRecord(record: Omit<RecordItem, 'id' | 'createdAt' | 'updatedAt'>): RecordItem {
    const now = new Date().toISOString();
    const newRecord: RecordItem = {
      ...record,
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.records.unshift(newRecord);
    this.save();
    return newRecord;
  }

  public updateRecord(id: string, updates: Partial<RecordItem>): RecordItem | null {
    const index = this.data.records.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updated: RecordItem = {
      ...this.data.records[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.records[index] = updated;
    this.save();
    return updated;
  }

  public deleteRecord(id: string): boolean {
    const initialLen = this.data.records.length;
    this.data.records = this.data.records.filter((r) => r.id !== id);
    // Also remove links referencing this record
    this.data.links = this.data.links.filter(
      (l) => !(l.sourceId === id && l.sourceType === 'record') && !(l.targetId === id && l.targetType === 'record')
    );
    // Remove references in thoughts
    this.data.thoughts = this.data.thoughts.map((t) => ({
      ...t,
      relatedRecordIds: t.relatedRecordIds.filter((rid) => rid !== id),
    }));

    if (this.data.records.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public setRecordStatus(id: string, status: RecordItem['status']): boolean {
    const record = this.data.records.find((r) => r.id === id);
    if (!record) return false;
    record.status = status;
    record.updatedAt = new Date().toISOString();
    this.save();
    return true;
  }

  // ============ THOUGHTS ============
  public addThought(thought: Omit<ThoughtItem, 'id' | 'createdAt' | 'updatedAt'>): ThoughtItem {
    const now = new Date().toISOString();
    const newThought: ThoughtItem = {
      ...thought,
      id: `thg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.thoughts.unshift(newThought);

    // Auto-create links for relatedRecordIds if specified
    thought.relatedRecordIds.forEach((recordId) => {
      this.addLink({
        sourceId: newThought.id,
        sourceType: 'thought',
        targetId: recordId,
        targetType: 'record',
        relationType: thought.thoughtType === 'objection' ? 'challenges' : 'references',
        origin: 'user',
        note: `建立個人想法時連結至原始來源`,
      });
    });

    this.save();
    return newThought;
  }

  public updateThought(id: string, updates: Partial<ThoughtItem>): ThoughtItem | null {
    const index = this.data.thoughts.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updated: ThoughtItem = {
      ...this.data.thoughts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.thoughts[index] = updated;
    this.save();
    return updated;
  }

  public deleteThought(id: string): boolean {
    const initialLen = this.data.thoughts.length;
    this.data.thoughts = this.data.thoughts.filter((t) => t.id !== id);
    // Clean up links
    this.data.links = this.data.links.filter(
      (l) => !(l.sourceId === id && l.sourceType === 'thought') && !(l.targetId === id && l.targetType === 'thought')
    );

    if (this.data.thoughts.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // ============ TOPICS ============
  public addTopic(topic: Omit<TopicItem, 'id' | 'createdAt' | 'updatedAt'>): TopicItem {
    const now = new Date().toISOString();
    const newTopic: TopicItem = {
      ...topic,
      id: `top-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.topics.push(newTopic);
    this.save();
    return newTopic;
  }

  public updateTopic(id: string, updates: Partial<TopicItem>): TopicItem | null {
    const index = this.data.topics.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updated: TopicItem = {
      ...this.data.topics[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.topics[index] = updated;
    this.save();
    return updated;
  }

  public deleteTopic(id: string): boolean {
    const initialLen = this.data.topics.length;
    this.data.topics = this.data.topics.filter((t) => t.id !== id);
    // Remove topic references in thoughts
    this.data.thoughts = this.data.thoughts.map((t) => ({
      ...t,
      topicIds: t.topicIds.filter((tid) => tid !== id),
    }));
    // Clean up links
    this.data.links = this.data.links.filter(
      (l) => !(l.sourceId === id && l.sourceType === 'topic') && !(l.targetId === id && l.targetType === 'topic')
    );

    if (this.data.topics.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public addUnresolvedQuestion(topicId: string, question: string): boolean {
    const topic = this.data.topics.find((t) => t.id === topicId);
    if (!topic || !question.trim()) return false;
    topic.unresolvedQuestions.push(question.trim());
    topic.updatedAt = new Date().toISOString();
    this.save();
    return true;
  }

  public removeUnresolvedQuestion(topicId: string, index: number): boolean {
    const topic = this.data.topics.find((t) => t.id === topicId);
    if (!topic || index < 0 || index >= topic.unresolvedQuestions.length) return false;
    topic.unresolvedQuestions.splice(index, 1);
    topic.updatedAt = new Date().toISOString();
    this.save();
    return true;
  }

  // ============ LINKS ============
  public addLink(link: Omit<KnowledgeLink, 'id' | 'createdAt'>): KnowledgeLink {
    // Avoid exact duplicate
    const existing = this.data.links.find(
      (l) =>
        ((l.sourceId === link.sourceId && l.targetId === link.targetId) ||
          (l.sourceId === link.targetId && l.targetId === link.sourceId)) &&
        l.relationType === link.relationType
    );
    if (existing) return existing;

    const newLink: KnowledgeLink = {
      ...link,
      id: `lnk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.links.push(newLink);
    this.save();
    return newLink;
  }

  public deleteLink(id: string): boolean {
    const len = this.data.links.length;
    this.data.links = this.data.links.filter((l) => l.id !== id);
    if (this.data.links.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  public confirmAILink(id: string): boolean {
    const link = this.data.links.find((l) => l.id === id);
    if (!link) return false;
    link.origin = 'user';
    this.save();
    return true;
  }

  // ============ DATA MANAGEMENT ============
  public exportBackup(): BackupPayload {
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'SynapsePKB',
      stats: {
        recordCount: this.data.records.length,
        thoughtCount: this.data.thoughts.length,
        topicCount: this.data.topics.length,
        linkCount: this.data.links.length,
      },
      data: JSON.parse(JSON.stringify(this.data)),
      settings: {
        theme: this.getTheme(),
      },
    };
  }

  public importBackup(payload: BackupPayload, strategy: 'replace' | 'merge' = 'replace'): boolean {
    if (!payload || !payload.data || !Array.isArray(payload.data.records)) {
      throw new Error('無效的備份檔案格式');
    }

    if (strategy === 'replace') {
      this.data = {
        records: payload.data.records || [],
        thoughts: payload.data.thoughts || [],
        topics: payload.data.topics || [],
        links: payload.data.links || [],
      };
    } else {
      // Merge strategy: avoid duplicates by ID
      const recordMap = new Map(this.data.records.map((r) => [r.id, r]));
      (payload.data.records || []).forEach((r) => recordMap.set(r.id, r));

      const thoughtMap = new Map(this.data.thoughts.map((t) => [t.id, t]));
      (payload.data.thoughts || []).forEach((t) => thoughtMap.set(t.id, t));

      const topicMap = new Map(this.data.topics.map((tp) => [tp.id, tp]));
      (payload.data.topics || []).forEach((tp) => topicMap.set(tp.id, tp));

      const linkMap = new Map(this.data.links.map((l) => [l.id, l]));
      (payload.data.links || []).forEach((l) => linkMap.set(l.id, l));

      this.data = {
        records: Array.from(recordMap.values()),
        thoughts: Array.from(thoughtMap.values()),
        topics: Array.from(topicMap.values()),
        links: Array.from(linkMap.values()),
      };
    }

    if (payload.settings?.theme) {
      this.setTheme(payload.settings.theme);
    }

    this.save();
    return true;
  }

  public resetToFixtures(): void {
    this.data = JSON.parse(JSON.stringify(initialFixtures));
    this.save();
  }

  public clearAll(): void {
    this.data = {
      records: [],
      thoughts: [],
      topics: [],
      links: [],
    };
    this.save();
  }

  // ============ THEME ============
  public getTheme(): 'light' | 'dark' | 'system' {
    return (localStorage.getItem(THEME_KEY) as 'light' | 'dark' | 'system') || 'system';
  }

  public setTheme(theme: 'light' | 'dark' | 'system'): void {
    localStorage.setItem(THEME_KEY, theme);
    this.applyTheme(theme);
    this.notify();
  }

  public applyTheme(theme?: 'light' | 'dark' | 'system'): void {
    const activeTheme = theme || this.getTheme();
    const root = document.documentElement;
    if (activeTheme === 'dark') {
      root.classList.add('dark');
    } else if (activeTheme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
}

export const storage = new StorageService();
