import { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { KnowledgeBaseData } from '../types';

export function useKnowledgeBase() {
  const [data, setData] = useState<KnowledgeBaseData>(() => storage.init());

  useEffect(() => {
    // Initial fetch
    setData({ ...storage.getData() });

    // Subscribe to storage changes
    const unsubscribe = storage.subscribe(() => {
      setData({ ...storage.getData() });
    });

    return unsubscribe;
  }, []);

  return {
    data,
    records: data.records,
    thoughts: data.thoughts,
    topics: data.topics,
    links: data.links,
    // Operations
    addRecord: storage.addRecord.bind(storage),
    updateRecord: storage.updateRecord.bind(storage),
    deleteRecord: storage.deleteRecord.bind(storage),
    setRecordStatus: storage.setRecordStatus.bind(storage),
    addThought: storage.addThought.bind(storage),
    updateThought: storage.updateThought.bind(storage),
    deleteThought: storage.deleteThought.bind(storage),
    addTopic: storage.addTopic.bind(storage),
    updateTopic: storage.updateTopic.bind(storage),
    deleteTopic: storage.deleteTopic.bind(storage),
    addUnresolvedQuestion: storage.addUnresolvedQuestion.bind(storage),
    removeUnresolvedQuestion: storage.removeUnresolvedQuestion.bind(storage),
    addLink: storage.addLink.bind(storage),
    deleteLink: storage.deleteLink.bind(storage),
    confirmAILink: storage.confirmAILink.bind(storage),
    exportBackup: storage.exportBackup.bind(storage),
    importBackup: storage.importBackup.bind(storage),
    resetToFixtures: storage.resetToFixtures.bind(storage),
    clearAll: storage.clearAll.bind(storage),
  };
}
