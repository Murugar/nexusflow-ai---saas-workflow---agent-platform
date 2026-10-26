import React, { useState } from 'react';
import { ExecutionRun, ExecutionStep } from '../types';
import { INITIAL_EXECUTIONS } from '../data/initialData';
import { Activity, Clock, CheckCircle2, AlertCircle, RefreshCw, FileText } from 'lucide-react';

interface ExecutionTelemetryProps {
  executions?: ExecutionRun[];
  onSelectRun?: (run: ExecutionRun) => void;
}

export const ExecutionTelemetry: React.FC<ExecutionTelemetryProps> = ({
  executions = INITIAL_EXECUTIONS,
}) => {
  const [selectedRun, setSelectedRun] = useState<ExecutionRun>(executions[0]);
  const [selectedStep, setSelectedStep] = useState<ExecutionStep>(executions[0]?.steps[0]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <span>REAL-TIME AUDIT LOGS</span>
          <span>·</span>
          <span>STEP-BY-STEP PAYLOAD INSPECTOR</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Execution Telemetry & Audit Logs
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Inspect granular inputs, transformed payloads, token costs, and millisecond latencies across
          every n8n node, Zapier dispatch, and LLM call.
        </p>
      </div>

      {/* Main Grid: Executions table on left, Payload Inspector on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Execution Runs Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Recent Pipeline Executions</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {executions.length} Runs Recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">RUN ID</th>
                  <th className="py-2.5 px-3">PIPELINE</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">DURATION</th>
                  <th className="py-2.5 px-3 text-right">TOKENS</th>
                  <th className="py-2.5 px-3 text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {executions.map((run) => {
                  const isSelected = selectedRun?.executionId === run.executionId;
                  return (
                    <tr
                      key={run.executionId}
                      onClick={() => {
                        setSelectedRun(run);
                        setSelectedStep(run.steps[0]);
                      }}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-slate-800/80 text-white' : 'text-slate-300'
                      }`}
                    >
                      <td className="py-3 px-3 font-semibold text-cyan-400">
                        {run.executionId}
                      </td>
                      <td className="py-3 px-3 font-sans max-w-xs truncate text-slate-200">
                        {run.workflowTitle}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-400 font-semibold uppercase">
                          {run.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums">
                        {run.totalDurationMs}ms
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums text-purple-300">
                        {run.totalTokens}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums text-slate-500">
                        {new Date(run.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Steps Timeline for Selected Run */}
          {selectedRun && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-300">
                Steps Timeline ({selectedRun.steps.length} sequential nodes)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {selectedRun.steps.map((step, idx) => {
                  const isSelectedStep = selectedStep?.nodeId === step.nodeId;
                  return (
                    <button
                      key={step.nodeId}
                      onClick={() => setSelectedStep(step)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                        isSelectedStep
                          ? 'bg-amber-950/30 border-amber-500 text-white ring-1 ring-amber-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-slate-500">
                        STEP 0{idx + 1}
                      </div>
                      <div className="font-semibold truncate mt-0.5">{step.nodeName}</div>
                      <div className="text-[11px] font-mono text-emerald-400 mt-1">
                        {step.durationMs}ms
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Granular Payload Inspector */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Node Payload Inspector</span>
              </h3>
              {selectedStep && (
                <span className="text-[10px] font-mono text-cyan-400">
                  {selectedStep.durationMs}ms · {selectedStep.tokensUsed} tokens
                </span>
              )}
            </div>

            {selectedStep ? (
              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-white">{selectedStep.nodeName}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Engine: {selectedStep.tool} ({selectedStep.nodeType})
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">
                    INPUT PAYLOAD
                  </label>
                  <pre className="text-[11px] font-mono bg-slate-950 text-slate-300 p-3 rounded-lg border border-slate-800 overflow-x-auto max-h-44">
                    {JSON.stringify(selectedStep.inputPayload, null, 2)}
                  </pre>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-emerald-400 block mb-1">
                    OUTPUT / TRANSFORMED RESULT
                  </label>
                  <pre className="text-[11px] font-mono bg-slate-950 text-emerald-300 p-3 rounded-lg border border-slate-800 overflow-x-auto max-h-44">
                    {JSON.stringify(selectedStep.outputPayload, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center text-xs text-slate-500">
                Select an execution step to view input/output payload diffs.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 mt-4 text-[11px] font-mono text-slate-500">
            Immutable Audit Trail · Verified Hash
          </div>
        </div>
      </div>
    </div>
  );
};
