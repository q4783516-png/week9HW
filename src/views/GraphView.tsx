import React, { useRef, useEffect, useState } from 'react';
import {
  Network,
  Sparkles,
  CheckCircle,
  Plus,
  Trash2,
  Info,
  Layers,
  ZoomIn,
  ZoomOut,
  RefreshCw,
} from 'lucide-react';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { KnowledgeLink, EntityType } from '../types';

interface Node {
  id: string;
  type: EntityType;
  title: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const GraphView: React.FC = () => {
  const { records, thoughts, topics, links, confirmAILink, deleteLink, addLink } =
    useKnowledgeBase();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedLink, setSelectedLink] = useState<KnowledgeLink | null>(null);

  // Filter toggles
  const [showRecords, setShowRecords] = useState(true);
  const [showThoughts, setShowThoughts] = useState(true);
  const [showTopics, setShowTopics] = useState(true);
  const [showAISuggestions, setShowAISuggestions] = useState(true);

  // Manual link modal
  const [isLinking, setIsLinking] = useState(false);
  const [linkTargetId, setLinkTargetId] = useState('');
  const [linkRelationType, setLinkRelationType] = useState<KnowledgeLink['relationType']>('relates_to');

  const nodesRef = useRef<Node[]>([]);
  const isDraggingRef = useRef<boolean>(false);
  const draggedNodeRef = useRef<Node | null>(null);

  // Initialize nodes
  useEffect(() => {
    const width = 800;
    const height = 550;
    const currentNodes: Node[] = [];

    if (showRecords) {
      records.forEach((r, idx) => {
        currentNodes.push({
          id: r.id,
          type: 'record',
          title: r.title,
          x: width / 2 + Math.cos((idx / records.length) * Math.PI * 2) * 200 + (Math.random() - 0.5) * 40,
          y: height / 2 + Math.sin((idx / records.length) * Math.PI * 2) * 200 + (Math.random() - 0.5) * 40,
          vx: 0,
          vy: 0,
          radius: 14,
          color: '#0e8ce9', // blue
        });
      });
    }

    if (showThoughts) {
      thoughts.forEach((t, idx) => {
        currentNodes.push({
          id: t.id,
          type: 'thought',
          title: t.title || t.content.substring(0, 20),
          x: width / 2 + Math.cos((idx / thoughts.length) * Math.PI * 2) * 120 + (Math.random() - 0.5) * 30,
          y: height / 2 + Math.sin((idx / thoughts.length) * Math.PI * 2) * 120 + (Math.random() - 0.5) * 30,
          vx: 0,
          vy: 0,
          radius: 12,
          color: '#8b5cf6', // purple
        });
      });
    }

    if (showTopics) {
      topics.forEach((tp, idx) => {
        currentNodes.push({
          id: tp.id,
          type: 'topic',
          title: tp.name,
          x: width / 2 + Math.cos((idx / Math.max(1, topics.length)) * Math.PI * 2) * 60,
          y: height / 2 + Math.sin((idx / Math.max(1, topics.length)) * Math.PI * 2) * 60,
          vx: 0,
          vy: 0,
          radius: 18,
          color: tp.color || '#10b981', // emerald
        });
      });
    }

    nodesRef.current = currentNodes;
  }, [records, thoughts, topics, showRecords, showThoughts, showTopics]);

  // Canvas render loop & subtle force physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const nodes = nodesRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Force layout calculation
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 100) {
            const force = (100 - dist) / 100;
            const fx = (dx / dist) * force * 0.5;
            const fy = (dy / dist) * force * 0.5;
            if (draggedNodeRef.current !== n1) {
              n1.x -= fx;
              n1.y -= fy;
            }
            if (draggedNodeRef.current !== n2) {
              n2.x += fx;
              n2.y += fy;
            }
          }
        }
      }

      // Draw Edges
      links.forEach((link) => {
        if (!showAISuggestions && link.origin === 'ai_suggested') return;

        const sourceNode = nodes.find((n) => n.id === link.sourceId);
        const targetNode = nodes.find((n) => n.id === link.targetId);

        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);

          if (link.origin === 'ai_suggested') {
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = '#f59e0b'; // amber dashed for AI
            ctx.lineWidth = 1.8;
          } else {
            ctx.setLineDash([]);
            ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#475569' : '#cbd5e1';
            ctx.lineWidth = 1.2;
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Draw Nodes
      nodes.forEach((node) => {
        // Outer glow if selected
        if (selectedNode?.id === node.id) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 168, 248, 0.3)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node Label
        ctx.font = '10px sans-serif';
        ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#334155';
        ctx.textAlign = 'center';
        const label = node.title.length > 12 ? node.title.substring(0, 11) + '…' : node.title;
        ctx.fillText(label, node.x, node.y + node.radius + 12);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [links, selectedNode, showAISuggestions]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const clickedNode = nodesRef.current.find((n) => {
      const dist = Math.sqrt((n.x - mouseX) ** 2 + (n.y - mouseY) ** 2);
      return dist <= n.radius + 4;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode);
      draggedNodeRef.current = clickedNode;
      isDraggingRef.current = true;
    } else {
      setSelectedNode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !draggedNodeRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    draggedNodeRef.current.x = e.clientX - rect.left;
    draggedNodeRef.current.y = e.clientY - rect.top;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    draggedNodeRef.current = null;
  };

  const handleAddManualLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNode || !linkTargetId) return;

    const targetNode = nodesRef.current.find((n) => n.id === linkTargetId);
    if (!targetNode) return;

    addLink({
      sourceId: selectedNode.id,
      sourceType: selectedNode.type,
      targetId: targetNode.id,
      targetType: targetNode.type,
      relationType: linkRelationType,
      origin: 'user',
      note: '手動建立關聯',
    });

    setIsLinking(false);
    setLinkTargetId('');
  };

  const connectedLinks = selectedNode
    ? links.filter((l) => l.sourceId === selectedNode.id || l.targetId === selectedNode.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            知識圖譜 (Knowledge Graph)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            視覺化探索原始資料、個人認知與主題集合之間的雙向網絡。清晰區隔「使用者確認」與「AI 建議」連結。
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-400">原始資料 (Records)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-600 dark:text-slate-400">個人認知 (Thoughts)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">主題集合 (Topics)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-amber-500 border-dashed" />
            <span className="text-amber-600 dark:text-amber-400 font-medium">AI 建議連結</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Controls Overlay */}
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2 rounded-xl bg-white/90 p-2 shadow-md backdrop-blur-md dark:bg-slate-800/90">
          <button
            onClick={() => setShowRecords(!showRecords)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              showRecords ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'text-slate-400'
            }`}
          >
            原始紀錄
          </button>
          <button
            onClick={() => setShowThoughts(!showThoughts)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              showThoughts ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300' : 'text-slate-400'
            }`}
          >
            個人想法
          </button>
          <button
            onClick={() => setShowTopics(!showTopics)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              showTopics ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' : 'text-slate-400'
            }`}
          >
            主題集合
          </button>
          <button
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              showAISuggestions ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300' : 'text-slate-400'
            }`}
          >
            ✨ AI 建議連結
          </button>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={900}
          height={560}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="h-[560px] w-full cursor-grab active:cursor-grabbing"
        />

        {/* Selected Node Sidebar Inspector */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 top-4 z-10 w-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                  style={{ backgroundColor: selectedNode.color }}
                >
                  {selectedNode.type}
                </span>
                <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  {selectedNode.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Quick Action: Add Link */}
            <div className="mt-4">
              <button
                onClick={() => setIsLinking(!isLinking)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>建立手動關聯</span>
              </button>
            </div>

            {isLinking && (
              <form onSubmit={handleAddManualLink} className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  連結目標節點:
                </label>
                <select
                  value={linkTargetId}
                  onChange={(e) => setLinkTargetId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-1.5 dark:border-slate-700 dark:bg-slate-900"
                  required
                >
                  <option value="">選擇目標...</option>
                  {nodesRef.current
                    .filter((n) => n.id !== selectedNode.id)
                    .map((n) => (
                      <option key={n.id} value={n.id}>
                        [{n.type}] {n.title}
                      </option>
                    ))}
                </select>

                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  關聯性質:
                </label>
                <select
                  value={linkRelationType}
                  onChange={(e) => setLinkRelationType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 p-1.5 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="relates_to">相關聯 (Relates To)</option>
                  <option value="references">引用來源 (References)</option>
                  <option value="challenges">批判質疑 (Challenges)</option>
                  <option value="supports">支持論點 (Supports)</option>
                  <option value="derives_from">延伸啟發 (Derives From)</option>
                </select>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsLinking(false)}
                    className="rounded px-2 py-1 text-slate-500"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-brand-600 px-2.5 py-1 text-white font-medium"
                  >
                    確立關聯
                  </button>
                </div>
              </form>
            )}

            {/* Connected Links List */}
            <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400">
                關聯網絡節點 ({connectedLinks.length}):
              </span>
              <div className="mt-2 space-y-2">
                {connectedLinks.length === 0 ? (
                  <p className="text-xs text-slate-400">目前尚無其他連結。</p>
                ) : (
                  connectedLinks.map((link) => {
                    const otherId = link.sourceId === selectedNode.id ? link.targetId : link.sourceId;
                    const otherNode = nodesRef.current.find((n) => n.id === otherId);
                    const isAISuggested = link.origin === 'ai_suggested';

                    return (
                      <div
                        key={link.id}
                        className={`rounded-xl border p-2.5 text-xs transition ${
                          isAISuggested
                            ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/30'
                            : 'border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                              isAISuggested
                                ? 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {isAISuggested ? '✨ AI 建議關聯' : '已確認'}
                          </span>

                          <div className="flex items-center gap-1">
                            {isAISuggested && (
                              <button
                                onClick={() => confirmAILink(link.id)}
                                className="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-emerald-600"
                                title="確認採用此 AI 關聯"
                              >
                                採用
                              </button>
                            )}
                            <button
                              onClick={() => deleteLink(link.id)}
                              className="text-slate-400 hover:text-red-500"
                              title="解除連結"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                          {otherNode?.title || otherId}
                        </div>
                        {link.note && (
                          <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 italic">
                            {link.note}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
