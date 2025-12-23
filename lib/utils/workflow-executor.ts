/**
 * Workflow Executor - Ejecuta workflows de herramientas
 */

import { Workflow, WorkflowStep } from "@/lib/store/workflow-store";
import { formatJSON, minifyJSON, validateJSON, type FormatResult } from "./formatters";
import { jsonToTypeScript } from "./json-to-ts";

export interface WorkflowResult {
  stepId: string;
  toolId: string;
  success: boolean;
  output?: string;
  error?: string;
  duration: number;
}

export interface WorkflowExecution {
  workflowId: string;
  results: WorkflowResult[];
  totalDuration: number;
  success: boolean;
}

/**
 * Ejecuta un paso del workflow
 */
async function executeStep(
  step: WorkflowStep,
  input: string
): Promise<WorkflowResult> {
  const startTime = Date.now();
  
  try {
    let output: string = input;

    switch (step.toolId) {
      case "json-formatter":
        const formatResult = formatJSON(input);
        if (formatResult.success && formatResult.result) {
          output = formatResult.result;
        } else {
          throw new Error(formatResult.error || "Formatting failed");
        }
        break;

      case "json-minify":
        const minifyResult = minifyJSON(input);
        if (minifyResult.success && minifyResult.result) {
          output = minifyResult.result;
        } else {
          throw new Error(minifyResult.error || "Minification failed");
        }
        break;

      case "json-validate":
        const validateResult = validateJSON(input);
        if (!validateResult.success) {
          throw new Error(validateResult.error || "Validation failed");
        }
        output = input; // Valid JSON, return as-is
        break;

      case "json-to-typescript":
        try {
          const parsed = JSON.parse(input);
          output = jsonToTypeScript(parsed, step.config?.interfaceName || "Root");
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Conversion failed");
        }
        break;

      default:
        throw new Error(`Tool ${step.toolId} not supported in workflows yet`);
    }

    const duration = Date.now() - startTime;

    return {
      stepId: step.id,
      toolId: step.toolId,
      success: true,
      output,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      stepId: step.id,
      toolId: step.toolId,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      duration,
    };
  }
}

/**
 * Ejecuta un workflow completo
 */
export async function executeWorkflow(
  workflow: Workflow,
  initialInput: string,
  onProgress?: (step: number, total: number, result: WorkflowResult) => void
): Promise<WorkflowExecution> {
  const startTime = Date.now();
  const results: WorkflowResult[] = [];
  let currentInput = initialInput;

  for (let i = 0; i < workflow.steps.length; i++) {
    const step = workflow.steps[i];
    const result = await executeStep(step, currentInput);

    results.push(result);
    onProgress?.(i + 1, workflow.steps.length, result);

    if (!result.success) {
      // Si un paso falla, detener el workflow
      return {
        workflowId: workflow.id,
        results,
        totalDuration: Date.now() - startTime,
        success: false,
      };
    }

    // El output de este paso es el input del siguiente
    if (result.output) {
      currentInput = result.output;
    }
  }

  return {
    workflowId: workflow.id,
    results,
    totalDuration: Date.now() - startTime,
    success: true,
  };
}

/**
 * Valida que un workflow sea ejecutable
 */
export function validateWorkflow(workflow: Workflow): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!workflow.name.trim()) {
    errors.push("Workflow name is required");
  }

  if (workflow.steps.length === 0) {
    errors.push("Workflow must have at least one step");
  }

  // Validar que cada paso tenga un toolId válido
  workflow.steps.forEach((step, index) => {
    if (!step.toolId) {
      errors.push(`Step ${index + 1} is missing a tool`);
    }
    if (!step.toolName) {
      errors.push(`Step ${index + 1} is missing a tool name`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

