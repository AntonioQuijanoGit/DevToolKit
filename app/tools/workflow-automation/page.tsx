"use client";

import { useState } from "react";
import { Workflow as WorkflowIcon, Play, Plus, Trash2, Save, Copy, Check } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkflowStore, type Workflow, type WorkflowStep } from "@/lib/store/workflow-store";
import { executeWorkflow, type WorkflowExecution, type WorkflowResult } from "@/lib/utils/workflow-executor";
import { tools } from "@/lib/constants/tools";
import { useToast } from "@/lib/hooks/use-toast";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/shared/skeleton-loader";
import { CodeBlock } from "@/components/shared/code-block";
import { cn } from "@/lib/utils";

const supportedTools = [
  "json-formatter",
  "json-to-typescript",
];

// Tool mappings for workflow
const toolMappings: Record<string, { id: string; name: string }> = {
  "json-formatter": { id: "json-formatter", name: "Format JSON" },
  "json-to-typescript": { id: "json-to-typescript", name: "JSON to TypeScript" },
};

export default function WorkflowAutomationPage() {
  const [activeTab, setActiveTab] = useState<"create" | "run">("create");
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [input, setInput] = useState("");
  const [executing, setExecuting] = useState(false);
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  const {
    workflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    getWorkflow,
    recordRun,
  } = useWorkflowStore();
  const { toast } = useToast();

  const addStep = () => {
    if (!selectedTool) {
      toast({
        title: "Error",
        description: "Please select a tool",
        variant: "destructive",
      });
      return;
    }

    const toolMapping = toolMappings[selectedTool];
    if (!toolMapping) return;

    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      toolId: selectedTool,
      toolName: toolMapping.name,
    };

    setSteps([...steps, newStep]);
    setSelectedTool("");
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter((s) => s.id !== stepId));
  };

  const saveWorkflow = () => {
    if (!workflowName.trim()) {
      toast({
        title: "Error",
        description: "Workflow name is required",
        variant: "destructive",
      });
      return;
    }

    if (steps.length === 0) {
      toast({
        title: "Error",
        description: "Workflow must have at least one step",
        variant: "destructive",
      });
      return;
    }

    const id = createWorkflow({
      name: workflowName,
      description: workflowDescription,
      steps,
    });

    toast({
      title: "Workflow saved",
      description: `"${workflowName}" has been saved`,
      variant: "success",
    });

    // Reset form
    setWorkflowName("");
    setWorkflowDescription("");
    setSteps([]);
    setActiveTab("run");
  };

  const handleExecute = async (workflow: Workflow) => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter input data",
        variant: "destructive",
      });
      return;
    }

    setExecuting(true);
    setExecution(null);

    try {
      const result = await executeWorkflow(workflow, input, (step, total, stepResult) => {
        // Progress callback
        console.log(`Step ${step}/${total} completed`);
      });

      setExecution(result);
      recordRun(workflow.id);

      if (result.success) {
        toast({
          title: "Workflow completed",
          description: `Executed ${result.results.length} steps successfully`,
          variant: "success",
        });
      } else {
        toast({
          title: "Workflow failed",
          description: "One or more steps failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute workflow",
        variant: "destructive",
      });
    } finally {
      setExecuting(false);
    }
  };

  const selectedWorkflow = selectedWorkflowId ? getWorkflow(selectedWorkflowId) : null;
  const finalOutput = execution?.success
    ? execution.results[execution.results.length - 1]?.output
    : null;

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Workflow Automation"
        description="Create and execute multi-step workflows (No API keys required)"
        icon={WorkflowIcon}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "create" | "run")}>
          <TabsList>
            <TabsTrigger value="create">Create Workflow</TabsTrigger>
            <TabsTrigger value="run">Run Workflow</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Workflow Name</label>
                  <Input
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="e.g., Clean JSON Pipeline"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                  <Textarea
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    placeholder="Describe what this workflow does..."
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Add Steps</label>
                  <div className="flex gap-2">
                    <select
                      value={selectedTool}
                      onChange={(e) => setSelectedTool(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="">Select a tool...</option>
                      {Object.entries(toolMappings).map(([id, tool]) => (
                        <option key={id} value={id}>
                          {tool.name}
                        </option>
                      ))}
                    </select>
                    <Button onClick={addStep} disabled={!selectedTool}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </div>

                {steps.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Workflow Steps</label>
                    <div className="space-y-2">
                      {steps.map((step, index) => (
                        <div
                          key={step.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-accent"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{index + 1}</Badge>
                            <span className="font-medium">{step.toolName}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStep(step.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={saveWorkflow} className="w-full" disabled={!workflowName || steps.length === 0}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Workflow
                </Button>
              </CardContent>
            </Card>

            {workflows.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Saved Workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {workflows.map((workflow) => (
                      <div
                        key={workflow.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div>
                          <div className="font-medium">{workflow.name}</div>
                          {workflow.description && (
                            <div className="text-sm text-muted-foreground">
                              {workflow.description}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">
                            {workflow.steps.length} step(s) • Run {workflow.runCount} time(s)
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedWorkflowId(workflow.id);
                              setActiveTab("run");
                            }}
                          >
                            Run
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteWorkflow(workflow.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="run" className="space-y-6">
            {workflows.length === 0 ? (
              <EmptyState
                icon={WorkflowIcon}
                title="No workflows yet"
                description="Create a workflow first to run it"
                action={{
                  label: "Create Workflow",
                  onClick: () => setActiveTab("create"),
                }}
              />
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Select Workflow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <select
                      value={selectedWorkflowId || ""}
                      onChange={(e) => setSelectedWorkflowId(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="">Select a workflow...</option>
                      {workflows.map((workflow) => (
                        <option key={workflow.id} value={workflow.id}>
                          {workflow.name} ({workflow.steps.length} steps)
                        </option>
                      ))}
                    </select>
                  </CardContent>
                </Card>

                {selectedWorkflow && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Input Data</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Enter your input data here..."
                          className="font-mono min-h-[200px]"
                        />
                      </CardContent>
                    </Card>

                    <Button
                      onClick={() => handleExecute(selectedWorkflow)}
                      disabled={!input.trim() || executing}
                      className="w-full"
                      size="lg"
                    >
                      {executing ? (
                        <>
                          <Skeleton className="h-4 w-4 mr-2" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Execute Workflow
                        </>
                      )}
                    </Button>

                    {execution && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Execution Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Status</span>
                            <Badge variant={execution.success ? "default" : "destructive"}>
                              {execution.success ? "Success" : "Failed"}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Step Results</h4>
                            {execution.results.map((result, index) => (
                              <div
                                key={result.stepId}
                                className={cn(
                                  "p-3 rounded-lg border",
                                  result.success
                                    ? "border-green-500 bg-green-500/5"
                                    : "border-red-500 bg-red-500/5"
                                )}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">
                                    Step {index + 1}: {selectedWorkflow.steps[index]?.toolName}
                                  </span>
                                  <Badge variant={result.success ? "default" : "destructive"}>
                                    {result.success ? "✓" : "✗"}
                                  </Badge>
                                </div>
                                {result.error && (
                                  <p className="text-sm text-destructive">{result.error}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  Duration: {result.duration}ms
                                </p>
                              </div>
                            ))}
                          </div>

                          {finalOutput && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Final Output</h4>
                              <CodeBlock code={finalOutput} language="json" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

