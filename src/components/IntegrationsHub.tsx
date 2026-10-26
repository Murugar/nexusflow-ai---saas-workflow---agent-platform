import React, { useState } from 'react';
import { INITIAL_INTEGRATIONS } from '../data/initialData';
import { IntegrationConnector } from '../types';
import {
  Share2,
  ExternalLink,
  Cpu,
  Database,
  CheckCircle2,
  AlertCircle,
  Play,
  Key,
  ShieldCheck,
  Send,
  Code,
  Terminal,
} from 'lucide-react';

export const IntegrationsHub: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConnector[]>(INITIAL_INTEGRATIONS);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationConnector>(
    INITIAL_INTEGRATIONS[0]
  );
  const [testingService, setTestingService] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  // Live connection test via server API
  const handleTestIntegration = async (connector: IntegrationConnector) => {
    setTestingService(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: connector.id,
          endpoint: connector.endpointUrl,
          apiKey: connector.apiKeyConfigured ? 'demo_key' : undefined,
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({
        success: false,
        error: 'Network connection timeout to integration endpoint',
      });
    } finally {
      setTestingService(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <span>ECOSYSTEM CONNECTORS</span>
          <span>·</span>
          <span>N8N & ZAPIER INTEGRATION FABRIC</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Integration Hub & Automation Connectors
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Seamlessly stitch together self-hosted n8n workflows, Zapier Central actions, and multi-model
          LLMs with enterprise-grade retry queues and security attestation.
        </p>
      </div>

      {/* Integration Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((item) => {
          const isSelected = selectedIntegration.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => {
                setSelectedIntegration(item);
                setTestResult(null);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">{item.name}</span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {item.status.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {item.description}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2">
                <span>{item.version}</span>
                <span className="text-cyan-400">{item.eventsSupported.length} Events</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Configuration & Diagnostics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Selected Integration Settings & Architecture */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono text-slate-500">{selectedIntegration.category}</div>
              <h2 className="text-base font-bold text-white mt-0.5">{selectedIntegration.name}</h2>
            </div>
            <button
              onClick={() => handleTestIntegration(selectedIntegration)}
              disabled={testingService}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                testingService
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 cursor-wait'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${testingService ? 'animate-spin' : ''}`} />
              <span>{testingService ? 'Pinging Endpoint...' : 'Run Connectivity Probe'}</span>
            </button>
          </div>

          {/* Endpoint configuration */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Webhook / Service Ingestion Endpoint
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={selectedIntegration.endpointUrl}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-300"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(selectedIntegration.endpointUrl)}
                  className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                >
                  Copy URL
                </button>
              </div>
            </div>

            {/* Architecture Patterns Guide */}
            <div>
              <h3 className="text-xs font-semibold text-slate-300 mb-2">
                Production Orchestration Pattern
              </h3>
              {selectedIntegration.id === 'n8n' && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="font-semibold text-emerald-400">
                    Recommended n8n Topology:
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    1. Deploy n8n via Docker/Kubernetes with queue mode enabled (Redis worker pool).
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    2. Use NexusFlow to execute high-speed LLM transformations (Gemini 3.8 Flash, 220ms).
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    3. Dispatch structured JSON into n8n Webhook node for complex stateful multi-database
                    transactions and ERP synchronization.
                  </p>
                </div>
              )}

              {selectedIntegration.id === 'zapier' && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="font-semibold text-orange-400">
                    Recommended Zapier Topology:
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    1. Use Zapier Catch Hook as the inbound intake for marketing webhooks (Webflow, Typeform,
                    Shopify).
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    2. Forward raw payload to NexusFlow AI for intent classification (Claude 3.5 Haiku) and
                    firmographic synthesis.
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    3. Return enriched result to Zapier Actions AI to post rich interactive cards in Slack and
                    schedule Google Calendar demos.
                  </p>
                </div>
              )}

              {selectedIntegration.id !== 'n8n' && selectedIntegration.id !== 'zapier' && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="font-semibold text-cyan-400">
                    Direct Service Protocol:
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Server-side proxying via Node.js with encrypted secrets in environment variables.
                    Automatic exponential backoff on HTTP 429 and rate limit headers.
                  </p>
                </div>
              )}
            </div>

            {/* Supported Events */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Supported Triggers & Webhook Events
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedIntegration.eventsSupported.map((ev, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Diagnostics & Test Result Output */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Live Probe Diagnostics
              </h3>
            </div>

            {testResult ? (
              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Status</span>
                  <span className="text-emerald-400 font-semibold uppercase">{testResult.status}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Round-Trip Latency</span>
                  <span className="text-cyan-400 tabular-nums">{testResult.latencyMs} ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Auth Signature</span>
                  <span className="text-slate-300">{testResult.authType}</span>
                </div>

                <div className="p-3 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[11px] space-y-1">
                  <div className="text-slate-200 font-semibold mb-1">Verified Capabilities:</div>
                  {testResult.capabilities?.map((cap: string, i: number) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center text-xs text-slate-500 space-y-2">
                <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
                <p>Click "Run Connectivity Probe" to verify endpoint handshake and schema compatibility.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 mt-6 text-[11px] text-slate-500 font-mono">
            Encrypted TLS 1.3 · Mutual Auth Ready
          </div>
        </div>
      </div>
    </div>
  );
};
