import React from 'react';
import { BarChart3, TrendingUp, Clock, DollarSign, Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';

export const SaaSMetrics: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
          <span>BUSINESS TELEMETRY</span>
          <span>·</span>
          <span>ROI & TOKEN VALUE REALIZATION</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          SaaS Performance Analytics & Automation ROI
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Real-time measurement of automated human labor replacement, pipeline throughput, and multi-model
          cost optimizations.
        </p>
      </div>

      {/* KPI Cards Grid - Tabular Figures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>30-Day Pipeline Executions</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">472,180</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">+28.4% month-over-month</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Median End-to-End Latency</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">382ms</div>
          <div className="text-[11px] text-cyan-400 font-mono mt-1">p95: 710ms · p99: 1.1s</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Estimated Labor Hours Saved</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">1,940 hrs</div>
          <div className="text-[11px] text-purple-300 font-mono mt-1">~$145,000 monthly labor value</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Blended Cost / 1,000 Runs</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">$0.82</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">86% cheaper via Gemini 3.8 Flash</div>
        </div>
      </div>

      {/* Model Distribution & Throughput */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Volume Share by Model Architecture</span>
          </h2>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Google Gemini 3.8 Flash (High-Throughput Workhorse)</span>
                <span className="text-cyan-400 tabular-nums">68.4% (323,000 runs)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '68.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Anthropic Claude 3.5 Sonnet (High-Nuance Communication)</span>
                <span className="text-purple-400 tabular-nums">17.2% (81,200 runs)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '17.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>OpenAI GPT-4o (Legacy Zapier AI Actions)</span>
                <span className="text-emerald-400 tabular-nums">10.1% (47,600 runs)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '10.1%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Google Gemini 4 Argon & DeepSeek R1 (Complex Code & Logic)</span>
                <span className="text-amber-400 tabular-nums">4.3% (20,380 runs)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '4.3%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Mechanism-to-Outcome Chain (from SaaS reference) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Mechanism-to-Outcome Chain
            </h2>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-mono text-[10px]">USER GOAL</div>
                <div className="font-semibold text-white mt-0.5">
                  Instant lead qualification & CRM enrichment
                </div>
                <div className="text-slate-400 font-mono text-[10px] mt-2">VISIBLE INTERFACE MECHANISM</div>
                <div className="text-cyan-300 mt-0.5">
                  Sub-second Claude 3.5 Haiku + Gemini 3.8 Flash pipeline synced to n8n HubSpot node
                </div>
                <div className="text-slate-400 font-mono text-[10px] mt-2">MEASURABLE BENEFIT</div>
                <div className="text-emerald-400 font-semibold mt-0.5">
                  Inbound AE response time reduced from 4.2 hours to 85 seconds · +34% meeting bookings
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-mono text-[10px]">USER GOAL</div>
                <div className="font-semibold text-white mt-0.5">
                  Multi-agent support ticket auto-resolution
                </div>
                <div className="text-slate-400 font-mono text-[10px] mt-2">VISIBLE INTERFACE MECHANISM</div>
                <div className="text-cyan-300 mt-0.5">
                  Diagnostic agent with Jira issue creation and Zapier reply dispatch
                </div>
                <div className="text-emerald-400 font-semibold mt-0.5">
                  48% of Level 1 questions resolved autonomously with 98.2% customer CSAT
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-4 text-[11px] font-mono text-slate-500">
            Audit Standard SOC2 Type II Certified
          </div>
        </div>
      </div>
    </div>
  );
};
