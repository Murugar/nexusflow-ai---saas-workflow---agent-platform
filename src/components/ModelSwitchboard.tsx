import React, { useState } from 'react';
import { ModelInfo } from '../types';
import { INITIAL_MODELS } from '../data/initialData';
import { Cpu, Zap, DollarSign, Clock, Layers, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const ModelSwitchboard: React.FC = () => {
  const [selectedWorkload, setSelectedWorkload] = useState<string>('webhook_etl');
  const [volumePerMonth, setVolumePerMonth] = useState<number>(100000);
  const [avgInputTokens, setAvgInputTokens] = useState<number>(800);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(300);

  // Recommendations logic based on selected workload
  const getRecommendation = () => {
    switch (selectedWorkload) {
      case 'webhook_etl':
        return {
          primary: INITIAL_MODELS.find((m) => m.id === 'gemini-3.8-flash')!,
          fallback: INITIAL_MODELS.find((m) => m.id === 'claude-3-5-haiku')!,
          rationale:
            'Gemini 3.8 Flash provides sub-250ms response times at $0.075/1M input tokens. Ideal for high-frequency n8n and Zapier webhook transformations with zero rate-limit starvation.',
          savingsVsGpt4: '92% cost reduction vs GPT-4o standard calls',
        };
      case 'deep_reasoning':
        return {
          primary: INITIAL_MODELS.find((m) => m.id === 'gemini-4-argon')!,
          fallback: INITIAL_MODELS.find((m) => m.id === 'o3-mini')!,
          rationale:
            'Gemini 4 Argon excels at multi-branch conditional logic, complex code generation for n8n function nodes, and self-correcting validation loops.',
          savingsVsGpt4: 'High-precision chain-of-thought verification',
        };
      case 'customer_dialogue':
        return {
          primary: INITIAL_MODELS.find((m) => m.id === 'claude-3-5-sonnet')!,
          fallback: INITIAL_MODELS.find((m) => m.id === 'gemini-3.8-flash')!,
          rationale:
            'Claude 3.5 Sonnet provides the most natural, nuanced customer communication with strict alignment to company tone of voice and complex policy boundaries.',
          savingsVsGpt4: 'Superior brand reputation safety and user satisfaction',
        };
      case 'schema_standard':
        return {
          primary: INITIAL_MODELS.find((m) => m.id === 'gpt-4o')!,
          fallback: INITIAL_MODELS.find((m) => m.id === 'gemini-3.8-flash')!,
          rationale:
            'GPT-4o integrates natively with Zapier AI Actions and provides standard JSON schema enforcement across legacy SaaS CRM endpoints.',
          savingsVsGpt4: 'Turnkey compatibility with existing Zapier action schemas',
        };
      default:
        return {
          primary: INITIAL_MODELS.find((m) => m.id === 'gemini-3.8-flash')!,
          fallback: INITIAL_MODELS.find((m) => m.id === 'claude-3-5-sonnet')!,
          rationale: 'Balanced high-speed execution with enterprise failover protection.',
          savingsVsGpt4: 'Optimized hybrid pipeline',
        };
    }
  };

  const rec = getRecommendation();

  // Calculate monthly cost estimation for each model based on sliders
  const calculateCost = (model: ModelInfo) => {
    const inputPrice = parseFloat(model.inputCostPer1M.replace('$', ''));
    const outputPrice = parseFloat(model.outputCostPer1M.replace('$', ''));
    const monthlyInputs = (volumePerMonth * avgInputTokens) / 1000000;
    const monthlyOutputs = (volumePerMonth * avgOutputTokens) / 1000000;
    const total = monthlyInputs * inputPrice + monthlyOutputs * outputPrice;
    return total.toFixed(2);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span>AI ENGINE ORCHESTRATION</span>
          <span>·</span>
          <span>MULTI-LLM SWITCHBOARD</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Model Intelligence & Automation Switchboard
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          NexusFlow dynamically routes every automation step to the optimal model based on latency
          SLAs, reasoning depth, and token economics.
        </p>
      </div>

      {/* Model Recommender Engine Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Autonomous Model Architecture Recommender
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Optimized for 2026 SaaS Operations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
          {/* Workload Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Select Automation Pipeline Workload
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'webhook_etl', label: 'High-Volume Webhook & Data ETL' },
                { id: 'deep_reasoning', label: 'Complex Logic & Code Synthesis' },
                { id: 'customer_dialogue', label: 'Customer Support & Email Drafting' },
                { id: 'schema_standard', label: 'Zapier Actions & CRM Schema Mapping' },
              ].map((wl) => (
                <button
                  key={wl.id}
                  onClick={() => setSelectedWorkload(wl.id)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors border ${
                    selectedWorkload === wl.id
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 font-semibold'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {wl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Architecture Result */}
          <div className="md:col-span-2 p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                  Recommended Pipeline Topology
                </span>
                <span className="text-xs text-indigo-300 font-mono">{rec.savingsVsGpt4}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-500">PRIMARY WORKHORSE</div>
                  <div className="text-sm font-bold text-white mt-0.5">{rec.primary.name}</div>
                  <div className="text-xs text-cyan-400 font-mono mt-1">
                    Latency: {rec.primary.latency} · In: {rec.primary.inputCostPer1M}/1M
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-500">FAILOVER / SECONDARY</div>
                  <div className="text-sm font-bold text-white mt-0.5">{rec.fallback.name}</div>
                  <div className="text-xs text-purple-400 font-mono mt-1">
                    Latency: {rec.fallback.latency} · In: {rec.fallback.inputCostPer1M}/1M
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rec.rationale}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Automatic failover on HTTP 429 or 5xx error</span>
              <span className="font-mono text-slate-500">Zero Downtime Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Token Economics & Cost Calculator */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Interactive Model Economics & Monthly Cost Projection</span>
        </h2>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
              <span>Monthly Workflow Runs</span>
              <span className="font-mono text-cyan-400 tabular-nums">
                {volumePerMonth.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={volumePerMonth}
              onChange={(e) => setVolumePerMonth(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
              <span>Avg Input Tokens / Run</span>
              <span className="font-mono text-cyan-400 tabular-nums">{avgInputTokens}</span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={avgInputTokens}
              onChange={(e) => setAvgInputTokens(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
              <span>Avg Output Tokens / Run</span>
              <span className="font-mono text-cyan-400 tabular-nums">{avgOutputTokens}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={avgOutputTokens}
              onChange={(e) => setAvgOutputTokens(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

        {/* Comparison Table with Tabular Figures */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">MODEL & PROVIDER</th>
                <th className="py-2.5 px-3">SPECIALIZED ROLE</th>
                <th className="py-2.5 px-3 text-right">AVG LATENCY</th>
                <th className="py-2.5 px-3 text-right">INPUT / 1M</th>
                <th className="py-2.5 px-3 text-right">OUTPUT / 1M</th>
                <th className="py-2.5 px-3 text-right">EST. MONTHLY COST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {INITIAL_MODELS.map((model) => {
                const cost = calculateCost(model);
                const isGeminiFlash = model.id === 'gemini-3.8-flash';
                return (
                  <tr
                    key={model.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isGeminiFlash ? 'bg-cyan-950/20 text-cyan-200' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <span>{model.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({model.provider})
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400">{model.role}</td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-200">
                      {model.latency}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-400">
                      {model.inputCostPer1M}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-400">
                      {model.outputCostPer1M}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-emerald-400 text-sm">
                      ${cost}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
