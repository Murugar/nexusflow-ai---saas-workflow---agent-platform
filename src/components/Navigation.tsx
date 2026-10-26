import React from 'react';
import { Play, Sparkles, Layers, Cpu, Radio, Activity, ShieldCheck } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNewWorkflow: () => void;
  isExecuting?: boolean;
  onExecuteCurrent?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewWorkflow,
  isExecuting,
  onExecuteCurrent,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
      {/* Zone 1: Single Brand wordmark element */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          N
        </div>
        <button
          onClick={() => onSelectTab('canvas')}
          className="text-base font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          NexusFlow AI
        </button>
        <span className="hidden sm:inline text-xs text-slate-500 tracking-wider">
          Enterprise Automation Studio
        </span>
      </div>

      {/* Zone 2: 4-5 single-line clean navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onSelectTab('canvas')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'canvas' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : 'text-slate-300'
          }`}
        >
          Workflow Studio
        </button>
        <button
          onClick={() => onSelectTab('switchboard')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'switchboard' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : 'text-slate-300'
          }`}
        >
          Model Switchboard
        </button>
        <button
          onClick={() => onSelectTab('integrations')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'integrations' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : 'text-slate-300'
          }`}
        >
          n8n & Zapier Hub
        </button>
        <button
          onClick={() => onSelectTab('agents')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'agents' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : 'text-slate-300'
          }`}
        >
          AI Agents
        </button>
        <button
          onClick={() => onSelectTab('telemetry')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'telemetry' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : 'text-slate-300'
          }`}
        >
          Execution Logs
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {onExecuteCurrent && currentTab === 'canvas' && (
          <button
            onClick={onExecuteCurrent}
            disabled={isExecuting}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
              isExecuting
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Running Pipeline...' : 'Run Pipeline'}</span>
          </button>
        )}
        <button
          onClick={onOpenNewWorkflow}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Automation</span>
        </button>
      </div>
    </header>
  );
};
