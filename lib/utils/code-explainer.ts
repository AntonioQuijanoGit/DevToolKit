/**
 * Code Explainer - Explica código usando pattern matching y heurísticas
 * Sin API keys, 100% local
 */

export interface CodeExplanation {
  overview: string;
  functions: FunctionExplanation[];
  variables: VariableExplanation[];
  structure: string;
  complexity: "simple" | "moderate" | "complex";
  suggestions: string[];
}

export interface FunctionExplanation {
  name: string;
  description: string;
  parameters: string[];
  returns: string;
  algorithm?: string;
}

export interface VariableExplanation {
  name: string;
  type: string;
  purpose: string;
}

/**
 * Explica código JavaScript/TypeScript
 */
export function explainJavaScript(code: string): CodeExplanation {
  const functions: FunctionExplanation[] = [];
  const variables: VariableExplanation[] = [];
  const suggestions: string[] = [];

  // Detectar funciones
  const functionRegex = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?function\s*\(([^)]*)\))/g;
  let match;

  while ((match = functionRegex.exec(code)) !== null) {
    const funcName = match[1] || match[2] || match[4] || "anonymous";
    const params = (match[3] || match[5] || "").split(",").map((p) => p.trim()).filter(Boolean);

    const funcBody = extractFunctionBody(code, match.index);
    const description = analyzeFunction(funcBody, funcName);
    const algorithm = detectAlgorithm(funcBody);

    functions.push({
      name: funcName,
      description,
      parameters: params,
      returns: detectReturnType(funcBody),
      algorithm,
    });
  }

  // Detectar variables importantes
  const varRegex = /(?:const|let|var)\s+(\w+)\s*=\s*([^;]+)/g;
  while ((match = varRegex.exec(code)) !== null) {
    const varName = match[1];
    const varValue = match[2];

    if (varName.length > 2 && !varName.startsWith("_")) {
      variables.push({
        name: varName,
        type: inferType(varValue),
        purpose: inferPurpose(varName, varValue),
      });
    }
  }

  // Generar overview
  const overview = generateOverview(code, functions, variables);

  // Detectar complejidad
  const complexity = determineComplexity(code, functions);

  // Generar sugerencias
  if (code.includes("var ")) {
    suggestions.push("Consider using 'let' or 'const' instead of 'var'");
  }
  if (code.includes("==") && !code.includes("===")) {
    suggestions.push("Use strict equality (===) instead of loose equality (==)");
  }
  if (functions.length > 10) {
    suggestions.push("Consider splitting this code into multiple modules");
  }

  return {
    overview,
    functions,
    variables: variables.slice(0, 10), // Limitar a 10 variables más importantes
    structure: analyzeStructure(code),
    complexity,
    suggestions,
  };
}

/**
 * Explica código JSON
 */
export function explainJSON(json: string): CodeExplanation {
  try {
    const parsed = JSON.parse(json);
    const overview = generateJSONOverview(parsed);
    const structure = analyzeJSONStructure(parsed);

    return {
      overview,
      functions: [],
      variables: [],
      structure,
      complexity: determineJSONComplexity(parsed),
      suggestions: generateJSONSuggestions(parsed),
    };
  } catch {
    return {
      overview: "Invalid JSON structure",
      functions: [],
      variables: [],
      structure: "Unable to analyze invalid JSON",
      complexity: "simple",
      suggestions: ["Fix JSON syntax errors first"],
    };
  }
}

// Helper functions
function extractFunctionBody(code: string, startIndex: number): string {
  let braceCount = 0;
  let inFunction = false;
  let bodyStart = -1;

  for (let i = startIndex; i < code.length; i++) {
    if (code[i] === "{") {
      if (!inFunction) {
        bodyStart = i + 1;
        inFunction = true;
      }
      braceCount++;
    }
    if (code[i] === "}") {
      braceCount--;
      if (inFunction && braceCount === 0) {
        return code.substring(bodyStart, i);
      }
    }
  }

  return "";
}

function analyzeFunction(body: string, name: string): string {
  const lowerBody = body.toLowerCase();
  const lowerName = name.toLowerCase();

  // Detectar tipo de función por nombre
  if (lowerName.includes("sort")) {
    return "This function sorts data";
  }
  if (lowerName.includes("filter")) {
    return "This function filters data based on a condition";
  }
  if (lowerName.includes("map")) {
    return "This function transforms each element in a collection";
  }
  if (lowerName.includes("get") || lowerName.includes("fetch")) {
    return "This function retrieves data";
  }
  if (lowerName.includes("set") || lowerName.includes("update")) {
    return "This function updates or sets a value";
  }
  if (lowerName.includes("validate") || lowerName.includes("check")) {
    return "This function validates data";
  }

  // Detectar por contenido
  if (lowerBody.includes("return") && lowerBody.includes("map")) {
    return "This function transforms an array using map";
  }
  if (lowerBody.includes("return") && lowerBody.includes("filter")) {
    return "This function filters an array based on a condition";
  }
  if (lowerBody.includes("if") && lowerBody.includes("return")) {
    return "This function contains conditional logic";
  }
  if (lowerBody.includes("for") || lowerBody.includes("while")) {
    return "This function iterates over data";
  }
  if (lowerBody.includes("async") || lowerBody.includes("await")) {
    return "This is an asynchronous function that handles async operations";
  }

  return "This function performs operations on data";
}

function detectAlgorithm(body: string): string | undefined {
  const lowerBody = body.toLowerCase();

  if (lowerBody.includes("bubble") || (lowerBody.includes("swap") && lowerBody.includes("for"))) {
    return "Bubble Sort";
  }
  if (lowerBody.includes("quick") || lowerBody.includes("pivot")) {
    return "Quick Sort";
  }
  if (lowerBody.includes("binary") && lowerBody.includes("search")) {
    return "Binary Search";
  }
  if (lowerBody.includes("fibonacci") || (lowerBody.includes("n-1") && lowerBody.includes("n-2"))) {
    return "Fibonacci";
  }

  return undefined;
}

function detectReturnType(body: string): string {
  if (body.includes("return true") || body.includes("return false")) {
    return "boolean";
  }
  if (body.includes("return []") || body.includes("return new Array")) {
    return "array";
  }
  if (body.includes("return {}") || body.includes("return new Object")) {
    return "object";
  }
  if (body.includes("return null") || body.includes("return undefined")) {
    return "null | undefined";
  }
  if (body.match(/return\s+\d+/)) {
    return "number";
  }
  if (body.match(/return\s+['"]/)) {
    return "string";
  }

  return "unknown";
}

function inferType(value: string): string {
  if (value.startsWith('"') || value.startsWith("'")) return "string";
  if (value === "true" || value === "false") return "boolean";
  if (!isNaN(Number(value))) return "number";
  if (value.startsWith("[") || value.includes("Array")) return "array";
  if (value.startsWith("{") || value.includes("Object")) return "object";
  if (value.includes("()") || value.includes("=>")) return "function";
  return "unknown";
}

function inferPurpose(name: string, value: string): string {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("count") || lowerName.includes("length")) {
    return "Stores a count or length value";
  }
  if (lowerName.includes("result") || lowerName.includes("output")) {
    return "Stores the result of an operation";
  }
  if (lowerName.includes("temp") || lowerName.includes("tmp")) {
    return "Temporary storage variable";
  }
  if (lowerName.includes("flag") || lowerName.includes("is")) {
    return "Boolean flag indicating a state";
  }
  if (lowerName.includes("list") || lowerName.includes("array")) {
    return "Stores a collection of items";
  }

  return "Stores data for processing";
}

function generateOverview(
  code: string,
  functions: FunctionExplanation[],
  variables: VariableExplanation[]
): string {
  const parts: string[] = [];

  if (functions.length > 0) {
    parts.push(`This code contains ${functions.length} function(s)`);
  }

  if (variables.length > 0) {
    parts.push(`and ${variables.length} variable(s)`);
  }

  if (code.includes("class ")) {
    parts.push("It defines a class");
  }

  if (code.includes("import ") || code.includes("require(")) {
    parts.push("It imports external dependencies");
  }

  if (code.includes("export ")) {
    parts.push("It exports functionality for use in other modules");
  }

  return parts.length > 0
    ? parts.join(", ") + "."
    : "This code performs various operations.";
}

function analyzeStructure(code: string): string {
  const hasClasses = code.includes("class ");
  const hasFunctions = /function\s+\w+|const\s+\w+\s*=\s*\(/.test(code);
  const hasImports = code.includes("import ") || code.includes("require(");
  const hasExports = code.includes("export ");

  const parts: string[] = [];

  if (hasClasses) parts.push("class-based");
  if (hasFunctions) parts.push("function-based");
  if (hasImports) parts.push("modular");
  if (hasExports) parts.push("exportable");

  return parts.length > 0
    ? `This code uses a ${parts.join(", ")} structure.`
    : "This code uses a procedural structure.";
}

function determineComplexity(
  code: string,
  functions: FunctionExplanation[]
): "simple" | "moderate" | "complex" {
  const lines = code.split("\n").length;
  const hasNestedLoops = (code.match(/for\s*\(.*\{[^}]*for/g) || []).length > 0;
  const hasRecursion = code.includes("function") && code.match(/\w+\s*\([^)]*\)/g)?.some((call) => {
    const funcName = call.split("(")[0].trim();
    return code.includes(`function ${funcName}`) || code.includes(`${funcName} =`);
  });

  if (lines < 50 && functions.length <= 3 && !hasNestedLoops) {
    return "simple";
  }
  if (lines < 200 && functions.length <= 10 && !hasRecursion) {
    return "moderate";
  }
  return "complex";
}

function generateJSONOverview(parsed: any): string {
  if (Array.isArray(parsed)) {
    return `This is a JSON array containing ${parsed.length} element(s).`;
  }
  if (typeof parsed === "object" && parsed !== null) {
    const keys = Object.keys(parsed);
    return `This is a JSON object with ${keys.length} key(s): ${keys.slice(0, 5).join(", ")}${keys.length > 5 ? "..." : ""}.`;
  }
  return "This is a simple JSON value.";
}

function analyzeJSONStructure(parsed: any, depth = 0): string {
  if (depth > 3) return "Deeply nested structure";

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return "Empty array";
    const firstType = typeof parsed[0];
    return `Array of ${firstType}s (${parsed.length} items)`;
  }

  if (typeof parsed === "object" && parsed !== null) {
    const keys = Object.keys(parsed);
    const types = keys.map((k) => typeof parsed[k]);
    const uniqueTypes = [...new Set(types)];
    return `Object with ${keys.length} properties of types: ${uniqueTypes.join(", ")}`;
  }

  return `Primitive value: ${typeof parsed}`;
}

function determineJSONComplexity(parsed: any): "simple" | "moderate" | "complex" {
  const jsonString = JSON.stringify(parsed);
  const depth = calculateDepth(parsed);

  if (depth <= 2 && jsonString.length < 1000) {
    return "simple";
  }
  if (depth <= 4 && jsonString.length < 10000) {
    return "moderate";
  }
  return "complex";
}

function calculateDepth(obj: any, current = 0): number {
  if (typeof obj !== "object" || obj === null) {
    return current;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return current;
    return Math.max(...obj.map((item) => calculateDepth(item, current + 1)));
  }

  const values = Object.values(obj);
  if (values.length === 0) return current;
  return Math.max(...values.map((value) => calculateDepth(value, current + 1)));
}

function generateJSONSuggestions(parsed: any): string[] {
  const suggestions: string[] = [];

  if (typeof parsed === "object" && parsed !== null) {
    const keys = Object.keys(parsed);
    if (keys.length > 20) {
      suggestions.push("Consider splitting this large object into smaller objects");
    }

    const hasNull = Object.values(parsed).some((v) => v === null);
    if (hasNull) {
      suggestions.push("Consider using undefined or omitting keys instead of null");
    }
  }

  return suggestions;
}

/**
 * Explica código genérico (auto-detecta el tipo)
 */
export function explainCode(code: string, language?: string): CodeExplanation {
  if (!language) {
    // Auto-detect
    if (code.trim().startsWith("{") || code.trim().startsWith("[")) {
      language = "json";
    } else if (/function|const|let|var|=>/.test(code)) {
      language = "javascript";
    }
  }

  switch (language?.toLowerCase()) {
    case "javascript":
    case "typescript":
    case "js":
    case "ts":
      return explainJavaScript(code);
    case "json":
      return explainJSON(code);
    default:
      return {
        overview: "Code explanation not available for this language",
        functions: [],
        variables: [],
        structure: "Unknown structure",
        complexity: "simple",
        suggestions: [],
      };
  }
}

