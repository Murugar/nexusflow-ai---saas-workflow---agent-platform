import React, { useState } from 'react';
import { PRICING_TIERS } from '../data/initialData';
import { X, Check, ShieldCheck, Zap } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full p-6 lg:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            TRANSPARENT SCALE-TO-VALUE TIERS
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Predictable Pricing for Autonomous AI Workflows
          </h2>
          <p className="text-xs text-slate-400">
            Every plan includes our low-latency Gemini 3.8 Flash runner, n8n webhook routing, and Zapier
            Central synchronization.
          </p>

          {/* Cadence Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs">
            <span className={!isAnnual ? 'text-white font-semibold' : 'text-slate-400'}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                isAnnual ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={isAnnual ? 'text-white font-semibold' : 'text-slate-400'}>
              Annual (Save 20%)
            </span>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {PRICING_TIERS.map((tier) => {
            const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;
            return (
              <div
                key={tier.name}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                  tier.highlighted
                    ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500 shadow-xl ring-1 ring-indigo-500'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="text-xs font-mono text-slate-400 mb-1">{tier.audience}</div>
                  <h3 className="text-lg font-bold text-white">{tier.name}</h3>

                  <div className="mt-4 mb-6">
                    <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ month</span>
                  </div>

                  {/* Concrete Limits Matrix */}
                  <div className="space-y-2 py-3 border-y border-slate-800 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Executions:</span>
                      <span className="text-slate-200">{tier.limits.monthlyExecutions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Concurrency:</span>
                      <span className="text-slate-200">{tier.limits.concurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">LLMs:</span>
                      <span className="text-slate-200 truncate max-w-[140px] text-right">
                        {tier.limits.llmProviders}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">SLA:</span>
                      <span className="text-slate-200">{tier.limits.sla}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">n8n Clusters:</span>
                      <span className="text-slate-200">{tier.limits.n8nInstances}</span>
                    </div>
                  </div>

                  {/* Feature check rows */}
                  <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className={`mt-8 w-full py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    tier.highlighted
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {tier.ctaText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
