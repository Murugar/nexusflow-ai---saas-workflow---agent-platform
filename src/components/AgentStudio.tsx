import React, { useState } from 'react';
import { AIAgent } from '../types';
import { INITIAL_AGENTS } from '../data/initialData';
import { Bot, Send, Sparkles, Terminal, Settings, Wrench, Shield, CheckCircle2 } from 'lucide-react';

export const AgentStudio: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(INITIAL_AGENTS[0]);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'Pipeline Sentinel online. I am actively monitoring your n8n workflow queues and Zapier webhook catch endpoints. Give me an instruction or task.',
      time: '04:40 UTC',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const userMsg = inputText.trim();
    setInputText('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setIsSending(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          agentRole: selectedAgent.role,
          tools: selectedAgent.tools,
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: data.reply || 'Task processed successfully.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: 'Error connecting to agent execution engine.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
          <span>AUTONOMOUS ORCHESTRATION</span>
          <span>·</span>
          <span>MULTI-AGENT REASONING CORES</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Autonomous AI Agent Studio
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Configure autonomous agent coordinators equipped with n8n triggers, Zapier actions, and memory
          retrieval to manage workflows with zero human intervention.
        </p>
      </div>

      {/* Main Grid: Agent list & configuration on left, Live Chat Sandbox on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Agent Selection & Prompt Configuration */}
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-300">Active Agent Fleet</div>
          <div className="space-y-2">
            {agents.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-purple-500 ring-1 ring-purple-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{agent.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {agent.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-purple-300 font-medium mb-1.5">{agent.role}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-1.5">
                    <span>{agent.model}</span>
                    <span>{agent.tools.length} Tools</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Configuration Inspector */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-white uppercase tracking-wider">
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              <span>Agent Configuration</span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                System Directive & Goal
              </label>
              <textarea
                rows={3}
                value={selectedAgent.systemPrompt}
                onChange={(e) =>
                  setSelectedAgent({ ...selectedAgent, systemPrompt: e.target.value })
                }
                className="w-full p-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Connected Execution Tools
              </label>
              <div className="flex flex-wrap gap-1.5">
                {selectedAgent.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-purple-300 border border-slate-800"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Interactive Chat Sandbox */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[560px]">
          {/* Sandbox Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30">
                <Bot className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{selectedAgent.name} Sandbox</div>
                <div className="text-[10px] font-mono text-slate-400">
                  Model: {selectedAgent.model} · Real-time Reasoning
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              Interactive Test Mode
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-slate-500 font-mono mb-1">{msg.time}</div>
                <div
                  className={`p-3 rounded-xl max-w-xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white font-medium'
                      : 'bg-slate-950 text-slate-200 border border-slate-800'
                  }`}
                >
                  <pre className="font-sans whitespace-pre-wrap">{msg.text}</pre>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex items-center gap-2 text-xs text-purple-400 font-mono animate-pulse">
                <Bot className="w-4 h-4 animate-spin" />
                <span>Agent reasoning and preparing tool invocation plan...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. A high-priority lead from Nike arrived via Zapier. Qualify and sync to n8n..."
              className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
