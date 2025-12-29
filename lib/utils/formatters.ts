export interface FormatResult {
  success: boolean;
  result?: string;
  error?: string;
  line?: number;
}

export function formatJSON(input: string): FormatResult {
  try {
    if (!input.trim()) {
      return { success: false, error: "Input is empty" };
    }
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    return { success: true, result: formatted };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Invalid JSON";
    // Try to extract line number from error message
    const lineMatch = errorMessage.match(/position (\d+)/);
    const line = lineMatch ? Math.ceil(parseInt(lineMatch[1]) / 80) : undefined;
    return {
      success: false,
      error: `Invalid JSON: ${errorMessage}`,
      line,
    };
  }
}

export function minifyJSON(input: string): FormatResult {
  try {
    if (!input.trim()) {
      return { success: false, error: "Input is empty" };
    }
    const parsed = JSON.parse(input);
    const minified = JSON.stringify(parsed);
    return { success: true, result: minified };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Invalid JSON";
    return {
      success: false,
      error: `Invalid JSON: ${errorMessage}`,
    };
  }
}

export function validateJSON(input: string): FormatResult {
  try {
    if (!input.trim()) {
      return { success: false, error: "Input is empty" };
    }
    JSON.parse(input);
    return { success: true, result: "Valid JSON" };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Invalid JSON";
    return {
      success: false,
      error: `Invalid JSON: ${errorMessage}`,
    };
  }
}




