import React from 'react';
import {
  GitFork,
  Cpu,
  Layers,
  Bot,
  Activity,
  BarChart3,
  CreditCard,
  BookOpen,
  Zap,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedWorkflowId: string;
  onSelectWorkflow: (id: string) => void;
  workflows: Array<{ id: string; title: string; category: string; isLive: boolean }>;
  onOpenPricing: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedWorkflowId,
  onSelectWorkflow,
  workflows,
  onOpenPricing,
}) => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Workspace Context */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Active Workspace</span>
          <span className="text-emerald-400 font-medium">Production</span>
        </div>
        <div className="text-sm font-semibold text-slate-200 truncate">
          NexusFlow Autonomous Grid
        </div>
      </div>

      {/* Main Navigation */}
      <div className="p-3 space-y-1">
        <button
          onClick={() => onSelectTab('canvas')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
            currentTab === 'canvas'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <GitFork className="w-4 h-4 text-indigo-400" />
          <span>Workflow Studio</span>
        </button>

        <button
          onClick={() => onSelectTab('switchboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
            currentTab === 'switchboard'
              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Multi-Model Switchboard</span>
        </button>

        <button
          onClick={() => onSelectTab('integrations')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
            currentTab === 'integrations'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span>n8n & Zapier Hub</span>
        </button>

        <button
          onClick={() => onSelectTab('agents')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
            currentTab === 'agents'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>Autonomous AI Agents</span>
        </button>

        <button
          onClick={() => onSelectTab('telemetry')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
            currentTab === 'telemetry'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Execution Telemetry</span>
        </button>

        <button
          onClick={() => onSelectTab('metrics')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
            currentTab === 'metrics'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <span>SaaS Analytics & ROI</span>
        </button>
      </div>

      {/* Active Workflows Section */}
      <div className="flex-1 overflow-y-auto px-3 py-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 px-2 py-1.5 font-medium">
          <span>Active Pipelines</span>
          <span className="font-mono text-slate-500">{workflows.length}</span>
        </div>
        <div className="space-y-1 mt-1">
          {workflows.map((wf) => {
            const isSelected = selectedWorkflowId === wf.id;
            return (
              <button
                key={wf.id}
                onClick={() => {
                  onSelectWorkflow(wf.id);
                  onSelectTab('canvas');
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                  isSelected
                    ? 'bg-slate-800 border-slate-700 text-white font-medium'
                    : 'border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <div className="truncate font-medium">{wf.title}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>{wf.category}</span>
                  <span className={wf.isLive ? 'text-emerald-400' : 'text-slate-500'}>
                    {wf.isLive ? 'Active' : 'Draft'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subscription Banner & User Profile */}
      <div className="p-3 border-t border-slate-800 space-y-3 bg-slate-950/40">
        <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-indigo-300">Scale Operator Plan</span>
            <span className="text-[10px] font-mono text-emerald-400">99.9% SLA</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2.5">
            n8n clusters, Zapier Tables, Claude 3.5 & Gemini 3.8 enabled.
          </p>
          <button
            onClick={onOpenPricing}
            className="w-full py-1 text-center text-xs font-semibold text-white bg-indigo-600/80 hover:bg-indigo-600 rounded transition-colors"
          >
            Manage Subscription
          </button>
        </div>

        <div className="flex items-center gap-3 pt-1 px-1">
          <img
            src="/src/assets/images/avatar_engineer_elena_1793014998586.jpg"
            alt="Elena Rostova, Principal Automation Architect"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">Elena Rostova</div>
            <div className="text-[11px] text-slate-400 truncate">Lead Pipeline Architect</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
