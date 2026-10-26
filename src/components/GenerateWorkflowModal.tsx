import React, { useState } from 'react';
import { Workflow } from '../types';
import { Sparkles, X, Loader2, ArrowRight } from 'lucide-react';

interface GenerateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (workflow: Workflow) => void;
}

export const GenerateWorkflowModal: React.FC<GenerateWorkflowModalProps> = ({
  isOpen,
  onClose,
  onGenerated,
}) => {
  const [prompt, setPrompt] = useState<string>(
    'When a customer initiates a return or dispute on Stripe, extract receipt details with Gemini multimodal OCR, score fraud risk with OpenAI o3-mini, execute refund via n8n webhook into accounting ledger, and dispatch confirmation to Slack and customer email via Zapier.'
  );
  const [businessType, setBusinessType] = useState<string>('E-Commerce & SaaS FinTech');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/workflows/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          businessType,
          preferredTools: ['n8n', 'Zapier', 'Gemini', 'Claude', 'OpenAI'],
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate recommendation from AI engine');
      }

      const data = await res.json();
      const generated = data.workflow;

      const newWorkflow: Workflow = {
        id: 'wf_' + Math.random().toString(36).substring(2, 9),
        title: generated.title || 'AI Generated Autonomous Pipeline',
        description: generated.description || prompt,
        category: businessType,
        isLive: true,
        runsCount: 0,
        avgLatencyMs: parseInt(generated.estimatedLatency) || 350,
        estimatedCostPer1k: generated.estimatedCostPer1kRuns || '$1.20',
        createdAt: new Date().toISOString().split('T')[0],
        nodes: (generated.nodes || []).map((n: any, idx: number) => ({
          ...n,
          position: { x: 50 + idx * 260, y: 150 },
        })),
        edges: generated.edges || [],
      };

      onGenerated(newWorkflow);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-500/30">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              AI-Powered Automation Blueprint Architect
            </h2>
            <p className="text-xs text-slate-400">
              Describe your business automation goal; our Gemini 3.8 Flash engine will architect
              optimal n8n, Zapier, and LLM nodes.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Industry & Business Context
            </label>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Automation Requirements & Desired Flow
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe trigger, processing logic, LLM tasks, and final destination..."
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-400 p-2.5 rounded bg-rose-950/40 border border-rose-800">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] font-mono text-slate-500">
              Engine: Google Gemini 3.8 Flash · JSON Schema
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Architecting Flow...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate & Deploy Canvas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
