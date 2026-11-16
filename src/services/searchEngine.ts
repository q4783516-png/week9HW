import { KnowledgeBaseData, RecordItem, ThoughtItem, TopicItem, FilterOptions } from '../types';

export interface SearchResult {
  records: RecordItem[];
  thoughts: ThoughtItem[];
  topics: TopicItem[];
  totalMatches: number;
}

export function searchAndFilter(data: KnowledgeBaseData, options: FilterOptions): SearchResult {
  const query = (options.query || '').trim().toLowerCase();
  const { recordType, recordStatus, thoughtType, tag, topicId } = options;

  // 1. Filter Records
  let filteredRecords = data.records;

  if (recordType && recordType !== 'all') {
    filteredRecords = filteredRecords.filter((r) => r.type === recordType);
  }

  if (recordStatus && recordStatus !== 'all') {
    filteredRecords = filteredRecords.filter((r) => r.status === recordStatus);
  }

  if (tag) {
    const targetTag = tag.toLowerCase();
    filteredRecords = filteredRecords.filter(
      (r) =>
        r.tags.some((t) => t.toLowerCase() === targetTag) ||
        r.aiMetadata?.suggestedTags?.some((t) => t.toLowerCase() === targetTag)
    );
  }

  if (topicId) {
    // A record belongs to a topic if thoughts linked to this record belong to the topic
    const recordIdsInTopic = new Set<string>();
    data.thoughts
      .filter((t) => t.topicIds.includes(topicId))
      .forEach((t) => t.relatedRecordIds.forEach((rid) => recordIdsInTopic.add(rid)));
    filteredRecords = filteredRecords.filter((r) => recordIdsInTopic.has(r.id));
  }

  if (query) {
    filteredRecords = filteredRecords.filter((r) => {
      const inTitle = r.title.toLowerCase().includes(query);
      const inContent = r.rawContent.toLowerCase().includes(query);
      const inUrl = r.url ? r.url.toLowerCase().includes(query) : false;
      const inTags = r.tags.some((t) => t.toLowerCase().includes(query));
      const inSummary = r.aiMetadata?.summary?.toLowerCase().includes(query) || false;
      return inTitle || inContent || inUrl || inTags || inSummary;
    });
  }

  // 2. Filter Thoughts
  let filteredThoughts = data.thoughts;

  if (thoughtType && thoughtType !== 'all') {
    filteredThoughts = filteredThoughts.filter((t) => t.thoughtType === thoughtType);
  }

  if (tag) {
    const targetTag = tag.toLowerCase();
    filteredThoughts = filteredThoughts.filter((t) => t.tags.some((tg) => tg.toLowerCase() === targetTag));
  }

  if (topicId) {
    filteredThoughts = filteredThoughts.filter((t) => t.topicIds.includes(topicId));
  }

  if (query) {
    filteredThoughts = filteredThoughts.filter((t) => {
      const inTitle = t.title ? t.title.toLowerCase().includes(query) : false;
      const inContent = t.content.toLowerCase().includes(query);
      const inTags = t.tags.some((tg) => tg.toLowerCase().includes(query));
      return inTitle || inContent || inTags;
    });
  }

  // 3. Filter Topics
  let filteredTopics = data.topics;

  if (tag) {
    // Topics don't have direct tags, keep if thoughts in topic match tag
    const matchingTopicIds = new Set<string>();
    data.thoughts
      .filter((t) => t.tags.some((tg) => tg.toLowerCase() === tag.toLowerCase()))
      .forEach((t) => t.topicIds.forEach((tid) => matchingTopicIds.add(tid)));
    filteredTopics = filteredTopics.filter((tp) => matchingTopicIds.has(tp.id));
  }

  if (topicId) {
    filteredTopics = filteredTopics.filter((tp) => tp.id === topicId);
  }

  if (query) {
    filteredTopics = filteredTopics.filter((tp) => {
      const inName = tp.name.toLowerCase().includes(query);
      const inDesc = tp.description.toLowerCase().includes(query);
      const inQuestions = tp.unresolvedQuestions.some((q) => q.toLowerCase().includes(query));
      return inName || inDesc || inQuestions;
    });
  }

  return {
    records: filteredRecords,
    thoughts: filteredThoughts,
    topics: filteredTopics,
    totalMatches: filteredRecords.length + filteredThoughts.length + filteredTopics.length,
  };
}
