import React, { useState } from 'react';
import {
  Workflow,
  WorkflowNode,
  NodeType,
  ExecutionRun,
} from '../types';
import {
  Play,
  Plus,
  Trash2,
  Settings,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Cpu,
  Share2,
  Bot,
  Zap,
  Split,
  Database,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

interface WorkflowCanvasProps {
  workflow: Workflow;
  onUpdateWorkflow: (updated: Workflow) => void;
  onExecute: (initialPayload?: any) => Promise<void>;
  isExecuting: boolean;
  currentExecution: ExecutionRun | null;
  activeStepIndex: number;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  workflow,
  onUpdateWorkflow,
  onExecute,
  isExecuting,
  currentExecution,
  activeStepIndex,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(workflow.nodes[0]?.id || '');
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [samplePayloadKey, setSamplePayloadKey] = useState<string>('lead');
  const [customPayloadJson, setCustomPayloadJson] = useState<string>(
    JSON.stringify(
      {
        fullName: 'Sarah Jenkins',
        email: 'sarah.jenkins@acme-logistics.com',
        company: 'Acme Logistics & Fleet Corp',
        fleetSize: '450 trucks',
        annualRevenue: '$85M',
        inquiry: 'We need real-time OCR parsing on fuel invoices and automated n8n sync into PostgreSQL.',
        urgency: 'high',
      },
      null,
      2
    )
  );

  const selectedNode = workflow.nodes.find((n) => n.id === selectedNodeId) || workflow.nodes[0];

  // Update selected node configuration
  const handleUpdateNode = (updatedNode: WorkflowNode) => {
    const newNodes = workflow.nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n));
    onUpdateWorkflow({ ...workflow, nodes: newNodes });
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    if (workflow.nodes.length <= 1) return;
    const newNodes = workflow.nodes.filter((n) => n.id !== nodeId);
    const newEdges = workflow.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
    onUpdateWorkflow({ ...workflow, nodes: newNodes, edges: newEdges });
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(newNodes[0]?.id || '');
    }
  };

  // Add node
  const handleAddNode = (type: NodeType) => {
    const id = `node-${Date.now()}`;
    const defaultConfigs: Record<NodeType, { name: string; tool: string; model?: string; summary: string }> = {
      trigger: {
        name: 'Webhook Event Listener',
        tool: 'Zapier Catch Hook',
        summary: 'Catches incoming HTTP POST requests from external CRM or form.',
      },
      n8n_webhook: {
        name: 'n8n Sub-workflow Call',
        tool: 'n8n Automation Engine',
        summary: 'Triggers self-hosted n8n workflow with JSON payload transformation.',
      },
      zapier_action: {
        name: 'Zapier Action Dispatch',
        tool: 'Zapier Actions',
        summary: 'Dispatches synced event to Slack, Gmail, or HubSpot via Zapier.',
      },
      llm_generate: {
        name: 'AI Extraction & Reasoning',
        tool: 'Google Gemini',
        model: 'gemini-3.8-flash',
        summary: 'Processes incoming payload with structured instructions in under 250ms.',
      },
      ai_agent: {
        name: 'Autonomous Triage Agent',
        tool: 'NexusFlow Agent',
        model: 'gemini-3.8-flash',
        summary: 'Multi-step autonomous agent with tool-calling and reflection capabilities.',
      },
      code_transform: {
        name: 'Data Schema Normalizer',
        tool: 'Node.js JS Runner',
        summary: 'Normalizes and filters payload attributes before database storage.',
      },
      router_condition: {
        name: 'Conditional Gateway',
        tool: 'NexusFlow Router',
        summary: 'Evaluates priorityScore or customer tier to route down distinct branches.',
      },
      notification: {
        name: 'Slack Notification',
        tool: 'Slack API',
        summary: 'Dispatches rich formatted alert block to dedicated engineering or sales channel.',
      },
    };

    const template = defaultConfigs[type];
    const newNode: WorkflowNode = {
      id,
      type,
      name: template.name,
      tool: template.tool,
      model: template.model,
      summary: template.summary,
      config: {
        endpoint: 'https://automation.nexusflow.internal/webhook/v1',
        method: 'POST',
        systemPrompt: 'Process and validate incoming fields. Output structured JSON.',
        temperature: 0.2,
      },
    };

    const lastNode = workflow.nodes[workflow.nodes.length - 1];
    const newEdges = [...workflow.edges];
    if (lastNode) {
      newEdges.push({
        source: lastNode.id,
        target: id,
        label: 'Payload',
      });
    }

    onUpdateWorkflow({
      ...workflow,
      nodes: [...workflow.nodes, newNode],
      edges: newEdges,
    });
    setSelectedNodeId(id);
    setShowAddMenu(false);
  };

  const handleExecuteWithPayload = () => {
    let payload = {};
    try {
      payload = JSON.parse(customPayloadJson);
    } catch {
      payload = { error: 'Invalid JSON payload' };
    }
    onExecute(payload);
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'trigger':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'n8n_webhook':
        return <Share2 className="w-4 h-4 text-emerald-400" />;
      case 'zapier_action':
        return <ExternalLink className="w-4 h-4 text-orange-400" />;
      case 'llm_generate':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'ai_agent':
        return <Bot className="w-4 h-4 text-purple-400" />;
      case 'router_condition':
        return <Split className="w-4 h-4 text-blue-400" />;
      default:
        return <Database className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Workflow Header / Summary Bar */}
      <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white tracking-tight">{workflow.title}</h1>
            <span className="text-xs text-slate-400">
              {workflow.category} · {workflow.nodes.length} Connected Steps
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${workflow.isLive ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
              {workflow.isLive ? 'LIVE ORCHESTRATION' : 'SANDBOX MODE'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl line-clamp-1">
            {workflow.description}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div>
              <span className="text-slate-500">Latency: </span>
              <span className="text-slate-200">{workflow.avgLatencyMs}ms avg</span>
            </div>
            <div>
              <span className="text-slate-500">Runs: </span>
              <span className="text-slate-200">{workflow.runsCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500">Est. Cost: </span>
              <span className="text-slate-200">{workflow.estimatedCostPer1k}/1k</span>
            </div>
          </div>

          <button
            onClick={handleExecuteWithPayload}
            disabled={isExecuting}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all shadow-sm ${
              isExecuting
                ? 'bg-amber-600/40 text-amber-200 border border-amber-500/40 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Executing Pipeline...' : 'Run Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace split: Visual Canvas on left, Inspector Drawer on right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Canvas Area */}
        <div className="flex-1 flex flex-col bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] bg-slate-950 relative overflow-y-auto p-8">
          {/* Top toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Multi-Service Flow (Zapier · n8n · Gemini · Claude · OpenAI)</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Node</span>
              </button>

              {showAddMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 px-2 py-1">
                    Select Node Type to Insert
                  </div>
                  <button
                    onClick={() => handleAddNode('llm_generate')}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs flex items-center gap-2.5 text-slate-200"
                  >
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-medium">AI LLM Inference</div>
                      <div className="text-[10px] text-slate-400">Gemini 3.8, Claude, GPT-4o</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAddNode('ai_agent')}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs flex items-center gap-2.5 text-slate-200"
                  >
                    <Bot className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="font-medium">Autonomous Agent Node</div>
                      <div className="text-[10px] text-slate-400">Tool execution & memory loop</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAddNode('n8n_webhook')}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs flex items-center gap-2.5 text-slate-200"
                  >
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-medium">n8n Workflow Connector</div>
                      <div className="text-[10px] text-slate-400">Execute sub-workflow or JS node</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAddNode('zapier_action')}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs flex items-center gap-2.5 text-slate-200"
                  >
                    <ExternalLink className="w-4 h-4 text-orange-400" />
                    <div>
                      <div className="font-medium">Zapier Action Dispatch</div>
                      <div className="text-[10px] text-slate-400">Sync with 7,000+ business apps</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAddNode('router_condition')}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs flex items-center gap-2.5 text-slate-200"
                  >
                    <Split className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="font-medium">Branching Router</div>
                      <div className="text-[10px] text-slate-400">Condition-based traffic splitting</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Connected Pipeline Sequence View */}
          <div className="space-y-4 max-w-4xl mx-auto w-full">
            {workflow.nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const isStepActive = isExecuting && activeStepIndex === index;
              const stepResult = currentExecution?.steps?.find((s) => s.nodeId === node.id);
              const isStepCompleted = !isExecuting && stepResult && stepResult.status === 'completed';
              const isStepFailed = stepResult && stepResult.status === 'failed';

              return (
                <div key={node.id} className="relative group">
                  {/* Step Card */}
                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                      isStepActive
                        ? 'bg-amber-950/20 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                        : isSelected
                        ? 'bg-slate-900 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/50'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 shrink-0">
                          {getNodeIcon(node.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400 font-semibold">
                              STEP 0{index + 1}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="text-xs text-slate-400 font-medium">{node.tool}</span>
                            {node.model && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                                {node.model}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-semibold text-white mt-0.5">{node.name}</h3>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {node.summary}
                          </p>
                        </div>
                      </div>

                      {/* Right Telemetry / Status indicator */}
                      <div className="flex items-center gap-3 shrink-0 text-right">
                        {isStepActive && (
                          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono animate-pulse">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            <span>Inference Running...</span>
                          </div>
                        )}
                        {isStepCompleted && (
                          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>{stepResult.durationMs}ms</span>
                            {stepResult.tokensUsed > 0 && (
                              <span className="text-slate-500 text-[11px]">
                                · {stepResult.tokensUsed} tokens
                              </span>
                            )}
                          </div>
                        )}
                        {isStepFailed && (
                          <div className="flex items-center gap-1 text-xs font-mono text-rose-400">
                            <AlertCircle className="w-4 h-4" />
                            <span>Execution Failed</span>
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNode(node.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-all"
                          title="Delete Node"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Step Output Payload Snippet (if available) */}
                    {stepResult?.outputPayload && !isExecuting && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80">
                        <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                          <span>STEP TELEMETRY PAYLOAD OUTPUT</span>
                          <span className="text-emerald-400 font-semibold">200 OK</span>
                        </div>
                        <pre className="text-[11px] font-mono bg-slate-950 p-2.5 rounded border border-slate-800 text-slate-300 overflow-x-auto max-h-28">
                          {JSON.stringify(stepResult.outputPayload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Flow Arrow between steps */}
                  {index < workflow.nodes.length - 1 && (
                    <div className="flex justify-center my-1.5">
                      <div className="flex items-center gap-2 py-1 px-3 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-500">
                        <ArrowRight className="w-3 h-3 text-cyan-400 rotate-90" />
                        <span>Data Pipeline Stream</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Test Payload Drawer at Bottom */}
          <div className="mt-8 p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-200">
                  Input Webhook Test Payload
                </span>
                <span className="text-[11px] text-slate-500">(Passes into Step 1 Trigger)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCustomPayloadJson(
                      JSON.stringify(
                        {
                          fullName: 'Sarah Jenkins',
                          email: 'sarah.jenkins@acme-logistics.com',
                          company: 'Acme Logistics & Fleet Corp',
                          fleetSize: '450 trucks',
                          annualRevenue: '$85M',
                          inquiry: 'We need real-time OCR parsing on fuel invoices and automated n8n sync into PostgreSQL.',
                          urgency: 'high',
                        },
                        null,
                        2
                      )
                    );
                  }}
                  className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                >
                  Lead Demo
                </button>
                <button
                  onClick={() => {
                    setCustomPayloadJson(
                      JSON.stringify(
                        {
                          ticketId: 'ZD-884102',
                          customerName: 'Marcus Vance',
                          customerTier: 'Enterprise SLA',
                          issue: 'Our n8n cluster is timing out when syncing 50,000 records from Zapier webhook.',
                          errorCode: 'HTTP_504_GATEWAY_TIMEOUT',
                          priority: 'critical',
                        },
                        null,
                        2
                      )
                    );
                  }}
                  className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                >
                  Support Bug
                </button>
                <button
                  onClick={() => {
                    setCustomPayloadJson(
                      JSON.stringify(
                        {
                          invoiceNumber: 'INV-2026-904',
                          vendor: 'CloudScale Infrastructure LLC',
                          totalAmount: 14250.0,
                          currency: 'USD',
                          dueDate: '2026-11-15',
                          lineItems: [
                            { description: 'Dedicated AI Inference Worker Pods (x4)', amount: 10000.0 },
                            { description: 'n8n Enterprise Workflow Runner Storage', amount: 4250.0 },
                          ],
                        },
                        null,
                        2
                      )
                    );
                  }}
                  className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                >
                  Vendor Invoice
                </button>
              </div>
            </div>
            <textarea
              value={customPayloadJson}
              onChange={(e) => setCustomPayloadJson(e.target.value)}
              rows={4}
              className="w-full text-xs font-mono bg-slate-950 text-slate-300 p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Right: Node Inspector Drawer */}
        {selectedNode && (
          <div className="w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Node Inspector
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                {selectedNode.type}
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Node Name */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Node Step Title
                </label>
                <input
                  type="text"
                  value={selectedNode.name}
                  onChange={(e) =>
                    handleUpdateNode({ ...selectedNode, name: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Tool / Integration */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Integration Tool / Engine
                </label>
                <input
                  type="text"
                  value={selectedNode.tool}
                  onChange={(e) =>
                    handleUpdateNode({ ...selectedNode, tool: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Model Selector (for LLM or Agent nodes) */}
              {(selectedNode.type === 'llm_generate' || selectedNode.type === 'ai_agent') && (
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    AI Model & Inference Provider
                  </label>
                  <select
                    value={selectedNode.model || 'gemini-3.8-flash'}
                    onChange={(e) =>
                      handleUpdateNode({ ...selectedNode, model: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Fast & cheap workhorse)</option>
                    <option value="gemini-4-argon">Google Gemini 4 Argon (Deep reasoning & code)</option>
                    <option value="claude-3.5-sonnet">Anthropic Claude 3.5 Sonnet (Nuanced prose)</option>
                    <option value="claude-3.5-haiku">Anthropic Claude 3.5 Haiku (Rapid sub-second router)</option>
                    <option value="gpt-4o">OpenAI GPT-4o (Structured schema & ecosystem)</option>
                    <option value="o3-mini">OpenAI o3-mini (Chain-of-thought verification)</option>
                    <option value="deepseek-r1">DeepSeek R1 (Budget heavy reasoning)</option>
                  </select>
                </div>
              )}

              {/* Endpoint or Webhook URL */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  API Endpoint / Webhook URL
                </label>
                <input
                  type="text"
                  value={selectedNode.config?.endpoint || ''}
                  onChange={(e) =>
                    handleUpdateNode({
                      ...selectedNode,
                      config: { ...selectedNode.config, endpoint: e.target.value },
                    })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* System Prompt for LLM/Agent */}
              {(selectedNode.type === 'llm_generate' || selectedNode.type === 'ai_agent') && (
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    System Prompt / Directive
                  </label>
                  <textarea
                    rows={4}
                    value={selectedNode.config?.systemPrompt || ''}
                    onChange={(e) =>
                      handleUpdateNode({
                        ...selectedNode,
                        config: { ...selectedNode.config, systemPrompt: e.target.value },
                      })
                    }
                    className="w-full p-2.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              )}

              {/* Temperature Slider */}
              {(selectedNode.type === 'llm_generate' || selectedNode.type === 'ai_agent') && (
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
                    <span>Temperature / Determinism</span>
                    <span className="font-mono text-cyan-400">{selectedNode.config?.temperature ?? 0.2}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={selectedNode.config?.temperature ?? 0.2}
                    onChange={(e) =>
                      handleUpdateNode({
                        ...selectedNode,
                        config: {
                          ...selectedNode.config,
                          temperature: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>Strict (0.0)</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>
              )}

              {/* Summary Description */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Architectural Summary
                </label>
                <textarea
                  rows={2}
                  value={selectedNode.summary}
                  onChange={(e) =>
                    handleUpdateNode({ ...selectedNode, summary: e.target.value })
                  }
                  className="w-full p-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Node ID & Technical Metadata */}
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 space-y-1 font-mono">
                <div>Node UUID: {selectedNode.id}</div>
                <div>Runtime: Node.js Express + TSX</div>
                <div>Provider: {selectedNode.tool}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
