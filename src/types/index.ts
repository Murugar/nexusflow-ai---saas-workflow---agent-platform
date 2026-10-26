export type NodeType =
  | 'trigger'
  | 'n8n_webhook'
  | 'zapier_action'
  | 'llm_generate'
  | 'ai_agent'
  | 'code_transform'
  | 'router_condition'
  | 'notification';

export interface NodeConfig {
  endpoint?: string;
  method?: string;
  systemPrompt?: string;
  temperature?: number;
  model?: string;
  inputSchema?: string;
  outputSchema?: string;
  condition?: string;
  actionService?: string;
  actionEvent?: string;
  retryAttempts?: number;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  tool: string;
  model?: string;
  summary: string;
  position?: { x: number; y: number };
  config?: NodeConfig;
}

export interface WorkflowEdge {
  id?: string;
  source: string;
  target: string;
  label?: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  isLive: boolean;
  runsCount: number;
  avgLatencyMs: number;
  estimatedCostPer1k: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: 'Google' | 'OpenAI' | 'Anthropic' | 'DeepSeek' | 'Mistral';
  role: string;
  contextWindow: string;
  latency: string;
  inputCostPer1M: string;
  outputCostPer1M: string;
  strengths: string[];
  recommendedFor: string[];
  supportsLiveRun: boolean;
}

export interface IntegrationConnector {
  id: string;
  name: string;
  category: 'automation_engine' | 'llm_provider' | 'crm' | 'communication' | 'database';
  status: 'connected' | 'configured' | 'available';
  endpointUrl: string;
  apiKeyConfigured: boolean;
  description: string;
  eventsSupported: string[];
  version: string;
}

export interface ExecutionStep {
  nodeId: string;
  nodeName: string;
  nodeType: NodeType;
  tool: string;
  status: 'completed' | 'failed' | 'running' | 'skipped';
  durationMs: number;
  tokensUsed: number;
  inputPayload: any;
  outputPayload: any;
  errorMessage?: string;
}

export interface ExecutionRun {
  executionId: string;
  workflowId: string;
  workflowTitle: string;
  status: 'success' | 'partial_failure' | 'running';
  timestamp: string;
  totalDurationMs: number;
  totalTokens: number;
  stepsCount: number;
  steps: ExecutionStep[];
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  tools: string[];
  memoryWindow: number;
  status: 'active' | 'standby';
  lastRun?: string;
}

export interface PricingTier {
  name: string;
  audience: string;
  priceMonthly: number;
  priceAnnual: number;
  limits: {
    monthlyExecutions: string;
    concurrency: string;
    llmProviders: string;
    sla: string;
    n8nInstances: string;
    zapierIntegration: string;
  };
  features: string[];
  ctaText: string;
  highlighted?: boolean;
}
