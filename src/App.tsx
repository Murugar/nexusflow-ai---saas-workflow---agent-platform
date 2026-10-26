/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { ModelSwitchboard } from './components/ModelSwitchboard';
import { IntegrationsHub } from './components/IntegrationsHub';
import { AgentStudio } from './components/AgentStudio';
import { ExecutionTelemetry } from './components/ExecutionTelemetry';
import { SaaSMetrics } from './components/SaaSMetrics';
import { PricingModal } from './components/PricingModal';
import { GenerateWorkflowModal } from './components/GenerateWorkflowModal';
import { INITIAL_WORKFLOWS, INITIAL_EXECUTIONS } from './data/initialData';
import { Workflow, ExecutionRun } from './types';

export default function App() {
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(INITIAL_WORKFLOWS[0].id);
  const [currentTab, setCurrentTab] = useState<string>('canvas');
  const [executions, setExecutions] = useState<ExecutionRun[]>(INITIAL_EXECUTIONS);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentExecution, setCurrentExecution] = useState<ExecutionRun | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);

  const activeWorkflow =
    workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

  const handleUpdateWorkflow = (updated: Workflow) => {
    setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const handleWorkflowGenerated = (newWorkflow: Workflow) => {
    setWorkflows((prev) => [newWorkflow, ...prev]);
    setSelectedWorkflowId(newWorkflow.id);
    setCurrentTab('canvas');
  };

  const handleExecutePipeline = async (initialPayload?: any) => {
    if (isExecuting) return;
    setIsExecuting(true);
    setCurrentExecution(null);
    setActiveStepIndex(0);

    // Animate active steps progressively
    const stepInterval = setInterval(() => {
      setActiveStepIndex((prev) => (prev < activeWorkflow.nodes.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const res = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow: activeWorkflow,
          initialPayload: initialPayload || {
            triggeredBy: 'Manual Studio Run',
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();
      clearInterval(stepInterval);
      setActiveStepIndex(activeWorkflow.nodes.length);

      const newExecution: ExecutionRun = {
        executionId: data.executionId || 'exec_' + Math.random().toString(36).substring(2, 9),
        workflowId: activeWorkflow.id,
        workflowTitle: activeWorkflow.title,
        status: data.status === 'success' ? 'success' : 'partial_failure',
        timestamp: new Date().toISOString(),
        totalDurationMs: data.totalDurationMs || 420,
        totalTokens: data.totalTokens || 340,
        stepsCount: data.stepsCount || activeWorkflow.nodes.length,
        steps: data.steps || [],
      };

      setCurrentExecution(newExecution);
      setExecutions((prev) => [newExecution, ...prev]);

      // Update workflow run stats
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === activeWorkflow.id
            ? {
                ...w,
                runsCount: w.runsCount + 1,
                avgLatencyMs: Math.round((w.avgLatencyMs + (data.totalDurationMs || 400)) / 2),
              }
            : w
        )
      );
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation (Contract: Zone 1 Wordmark, Zone 2 4-5 links, Zone 3 Primary action) */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNewWorkflow={() => setIsGenerateModalOpen(true)}
        isExecuting={isExecuting}
        onExecuteCurrent={() => handleExecutePipeline()}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          selectedWorkflowId={selectedWorkflowId}
          onSelectWorkflow={setSelectedWorkflowId}
          workflows={workflows}
          onOpenPricing={() => setIsPricingOpen(true)}
        />

        {/* Viewport Content Switcher */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {currentTab === 'canvas' && (
            <WorkflowCanvas
              workflow={activeWorkflow}
              onUpdateWorkflow={handleUpdateWorkflow}
              onExecute={handleExecutePipeline}
              isExecuting={isExecuting}
              currentExecution={currentExecution}
              activeStepIndex={activeStepIndex}
            />
          )}

          {currentTab === 'switchboard' && <ModelSwitchboard />}

          {currentTab === 'integrations' && <IntegrationsHub />}

          {currentTab === 'agents' && <AgentStudio />}

          {currentTab === 'telemetry' && (
            <ExecutionTelemetry executions={executions} />
          )}

          {currentTab === 'metrics' && <SaaSMetrics />}
        </main>
      </div>

      {/* Modals */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <GenerateWorkflowModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerated={handleWorkflowGenerated}
      />
    </div>
  );
}
