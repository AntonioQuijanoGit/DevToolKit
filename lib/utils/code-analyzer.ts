/**
 * Smart Code Analyzer - Sin API keys, usando heurísticas y pattern matching
 * Analiza código y sugiere mejoras basadas en mejores prácticas
 */

export interface CodeIssue {
  type: "error" | "warning" | "suggestion" | "info";
  message: string;
  line?: number;
  column?: number;
  suggestion?: string;
  severity: "low" | "medium" | "high";
}

export interface AnalysisResult {
  issues: CodeIssue[];
  summary: {
    total: number;
    errors: number;
    warnings: number;
    suggestions: number;
  };
  score: number; // 0-100, calidad del código
}

/**
 * Analiza código JavaScript/TypeScript
 */
export function analyzeJavaScript(code: string): AnalysisResult {
  const issues: CodeIssue[] = [];
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Detectar var
    if (/\bvar\s+\w+/.test(line)) {
      issues.push({
        type: "warning",
        message: "Using 'var' is discouraged",
        line: lineNum,
        suggestion: "Use 'let' or 'const' instead",
        severity: "medium",
      });
    }

    // Detectar == en lugar de ===
    if (/==[^=]/.test(line) && !/===/.test(line)) {
      issues.push({
        type: "warning",
        message: "Using loose equality (==) instead of strict (===)",
        line: lineNum,
        suggestion: "Use === for strict equality comparison",
        severity: "medium",
      });
    }

    // Detectar console.log
    if (/console\.log\(/.test(line)) {
      issues.push({
        type: "suggestion",
        message: "Console.log found",
        line: lineNum,
        suggestion: "Consider removing or using a logger in production",
        severity: "low",
      });
    }

    // Detectar funciones sin return type (TypeScript)
    if (/function\s+\w+\s*\([^)]*\)\s*\{/.test(line) && code.includes(":") && !/:\s*\w+/.test(line)) {
      issues.push({
        type: "suggestion",
        message: "Function missing return type annotation",
        line: lineNum,
        suggestion: "Add return type annotation for better type safety",
        severity: "low",
      });
    }

    // Detectar funciones muy largas
    if (trimmed.startsWith("function") || trimmed.match(/^\w+\s*=\s*(async\s+)?\(/)) {
      const functionEnd = findFunctionEnd(lines, index);
      const functionLength = functionEnd - index;
      if (functionLength > 50) {
        issues.push({
          type: "suggestion",
          message: "Function is too long",
          line: lineNum,
          suggestion: `Consider breaking this function into smaller functions (${functionLength} lines)`,
          severity: "medium",
        });
      }
    }

    // Detectar async sin await
    if (/async\s+function/.test(line) || /async\s+\(/.test(line)) {
      const hasAwait = code.substring(
        code.indexOf(line),
        code.indexOf("\n", code.indexOf(line) + line.length)
      ).includes("await");
      if (!hasAwait) {
        issues.push({
          type: "suggestion",
          message: "Async function without await",
          line: lineNum,
          suggestion: "Remove 'async' if not using await, or add await for async operations",
          severity: "low",
        });
      }
    }

    // Detectar nested ternaries
    if ((line.match(/\?/g) || []).length > 1) {
      issues.push({
        type: "warning",
        message: "Nested ternary operators reduce readability",
        line: lineNum,
        suggestion: "Consider using if-else statements or extracting to a function",
        severity: "medium",
      });
    }

    // Detectar magic numbers
    if (/\b\d{3,}\b/.test(line) && !/\/\/|\/\*|'|"|`/.test(line)) {
      issues.push({
        type: "suggestion",
        message: "Magic number detected",
        line: lineNum,
        suggestion: "Consider extracting to a named constant",
        severity: "low",
      });
    }
  });

  // Análisis global
  analyzeGlobalPatterns(code, issues);

  const errors = issues.filter((i) => i.type === "error").length;
  const warnings = issues.filter((i) => i.type === "warning").length;
  const suggestions = issues.filter((i) => i.type === "suggestion").length;

  // Calcular score (100 - penalizaciones)
  let score = 100;
  score -= errors * 10;
  score -= warnings * 5;
  score -= suggestions * 2;
  score = Math.max(0, Math.min(100, score));

  return {
    issues,
    summary: {
      total: issues.length,
      errors,
      warnings,
      suggestions,
    },
    score,
  };
}

/**
 * Analiza código JSON
 */
export function analyzeJSON(json: string): AnalysisResult {
  const issues: CodeIssue[] = [];

  try {
    const parsed = JSON.parse(json);
    
    // Detectar objetos vacíos
    if (typeof parsed === "object" && Object.keys(parsed).length === 0) {
      issues.push({
        type: "info",
        message: "Empty JSON object",
        suggestion: "Consider if this is intentional",
        severity: "low",
      });
    }

    // Detectar arrays vacíos
    if (Array.isArray(parsed) && parsed.length === 0) {
      issues.push({
        type: "info",
        message: "Empty JSON array",
        suggestion: "Consider if this is intentional",
        severity: "low",
      });
    }

    // Detectar objetos muy grandes
    if (typeof parsed === "object" && !Array.isArray(parsed)) {
      const keys = Object.keys(parsed);
      if (keys.length > 20) {
        issues.push({
          type: "suggestion",
          message: "Large JSON object detected",
          suggestion: `Consider splitting into smaller objects (${keys.length} keys)`,
          severity: "low",
        });
      }
    }

    // Detectar valores null
    const nullCount = countNullValues(parsed);
    if (nullCount > 0) {
      issues.push({
        type: "suggestion",
        message: `${nullCount} null value(s) found`,
        suggestion: "Consider if null is the right choice vs undefined or omitting the key",
        severity: "low",
      });
    }

  } catch (error) {
    // JSON inválido ya se maneja en el formatter
  }

  const score = issues.length === 0 ? 100 : Math.max(50, 100 - issues.length * 5);

  return {
    issues,
    summary: {
      total: issues.length,
      errors: 0,
      warnings: 0,
      suggestions: issues.length,
    },
    score,
  };
}

/**
 * Analiza código SQL
 */
export function analyzeSQL(sql: string): AnalysisResult {
  const issues: CodeIssue[] = [];
  const upperSQL = sql.toUpperCase();

  // Detectar SELECT *
  if (/SELECT\s+\*/.test(upperSQL)) {
    issues.push({
      type: "warning",
      message: "SELECT * is not recommended",
      suggestion: "Specify only the columns you need",
      severity: "medium",
    });
  }

  // Detectar falta de WHERE en UPDATE/DELETE
  if ((/UPDATE\s+\w+/.test(upperSQL) || /DELETE\s+FROM/.test(upperSQL)) && !/WHERE/.test(upperSQL)) {
    issues.push({
      type: "error",
      message: "UPDATE or DELETE without WHERE clause",
      suggestion: "Always use WHERE to prevent updating/deleting all rows",
      severity: "high",
    });
  }

  // Detectar SQL injection vulnerable
  if (sql.includes("'") && !sql.includes("'")) {
    issues.push({
      type: "warning",
      message: "Potential SQL injection risk",
      suggestion: "Use parameterized queries or prepared statements",
      severity: "high",
    });
  }

  const errors = issues.filter((i) => i.type === "error").length;
  const warnings = issues.filter((i) => i.type === "warning").length;

  const score = 100 - errors * 20 - warnings * 10;
  
  return {
    issues,
    summary: {
      total: issues.length,
      errors,
      warnings,
      suggestions: 0,
    },
    score: Math.max(0, score),
  };
}

// Helper functions
function findFunctionEnd(lines: string[], startIndex: number): number {
  let braceCount = 0;
  let inFunction = false;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    braceCount += (line.match(/\{/g) || []).length;
    braceCount -= (line.match(/\}/g) || []).length;

    if (braceCount > 0) inFunction = true;
    if (inFunction && braceCount === 0) return i;
  }

  return lines.length;
}

function analyzeGlobalPatterns(code: string, issues: CodeIssue[]): void {
  // Detectar falta de error handling
  if (/fetch\(|axios\.|\.get\(|\.post\(/.test(code) && !/try\s*\{|\.catch\(/.test(code)) {
    issues.push({
      type: "warning",
      message: "API calls without error handling",
      suggestion: "Add try-catch or .catch() for error handling",
      severity: "medium",
    });
  }

  // Detectar uso de eval
  if (/\beval\s*\(/.test(code)) {
    issues.push({
      type: "error",
      message: "Use of eval() is dangerous",
      suggestion: "Avoid eval(), use safer alternatives",
      severity: "high",
    });
  }

  // Detectar uso de document.write
  if (/document\.write\(/.test(code)) {
    issues.push({
      type: "warning",
      message: "document.write() is not recommended",
      suggestion: "Use DOM manipulation methods instead",
      severity: "medium",
    });
  }
}

function countNullValues(obj: any): number {
  let count = 0;
  
  if (obj === null) return 1;
  
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      count += countNullValues(item);
    });
  } else if (typeof obj === "object") {
    Object.values(obj).forEach((value) => {
      count += countNullValues(value);
    });
  }
  
  return count;
}

/**
 * Analiza código genérico (detecta el lenguaje)
 */
export function analyzeCode(code: string, language?: string): AnalysisResult {
  if (!language) {
    // Auto-detect
    if (code.trim().startsWith("{") || code.trim().startsWith("[")) {
      language = "json";
    } else if (/SELECT|INSERT|UPDATE|DELETE/i.test(code)) {
      language = "sql";
    } else if (/function|const|let|var|=>/.test(code)) {
      language = "javascript";
    }
  }

  switch (language?.toLowerCase()) {
    case "javascript":
    case "typescript":
    case "js":
    case "ts":
      return analyzeJavaScript(code);
    case "json":
      return analyzeJSON(code);
    case "sql":
      return analyzeSQL(code);
    default:
      return {
        issues: [{
          type: "info",
          message: "Language not supported for analysis",
          severity: "low",
        }],
        summary: { total: 0, errors: 0, warnings: 0, suggestions: 0 },
        score: 100,
      };
  }
}






