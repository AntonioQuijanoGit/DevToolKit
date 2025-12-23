/**
 * GraphQL Utilities
 * Query builder, validator, formatter
 */

export interface GraphQLQuery {
  operation: "query" | "mutation" | "subscription";
  name?: string;
  fields: string[];
  variables?: Record<string, { type: string; required: boolean }>;
  fragments?: GraphQLFragment[];
}

export interface GraphQLFragment {
  name: string;
  type: string;
  fields: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Valida una query GraphQL básica
 */
export function validateGraphQL(query: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Verificar que no esté vacía
  if (!query.trim()) {
    errors.push("Query is empty");
    return { valid: false, errors, warnings };
  }

  // Verificar que tenga una operación
  if (
    !query.includes("query") &&
    !query.includes("mutation") &&
    !query.includes("subscription")
  ) {
    errors.push("Query must contain a query, mutation, or subscription");
  }

  // Verificar llaves balanceadas
  const openBraces = (query.match(/\{/g) || []).length;
  const closeBraces = (query.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push("Unbalanced braces");
  }

  // Verificar paréntesis balanceados
  const openParens = (query.match(/\(/g) || []).length;
  const closeParens = (query.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push("Unbalanced parentheses");
  }

  // Warnings
  if (query.includes("__typename")) {
    warnings.push("Consider if __typename is necessary");
  }

  if (query.length > 1000) {
    warnings.push("Query is very long, consider splitting into fragments");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Formatea una query GraphQL
 */
export function formatGraphQL(query: string): string {
  let formatted = query.trim();
  let indent = 0;
  const indentSize = 2;
  const lines: string[] = [];
  let currentLine = "";

  for (let i = 0; i < formatted.length; i++) {
    const char = formatted[i];
    const nextChar = formatted[i + 1];

    if (char === "{") {
      if (currentLine.trim()) {
        lines.push(" ".repeat(indent * indentSize) + currentLine.trim());
        currentLine = "";
      }
      lines.push(" ".repeat(indent * indentSize) + "{");
      indent++;
    } else if (char === "}") {
      if (currentLine.trim()) {
        lines.push(" ".repeat(indent * indentSize) + currentLine.trim());
        currentLine = "";
      }
      indent--;
      lines.push(" ".repeat(indent * indentSize) + "}");
    } else if (char === "\n") {
      if (currentLine.trim()) {
        lines.push(" ".repeat(indent * indentSize) + currentLine.trim());
        currentLine = "";
      }
    } else {
      currentLine += char;
    }
  }

  if (currentLine.trim()) {
    lines.push(" ".repeat(indent * indentSize) + currentLine.trim());
  }

  return lines.join("\n");
}

/**
 * Construye una query GraphQL simple
 */
export function buildGraphQLQuery(
  operation: "query" | "mutation",
  name: string,
  fields: string[],
  variables?: Record<string, { type: string; required: boolean }>
): string {
  let query = `${operation} ${name}`;

  if (variables && Object.keys(variables).length > 0) {
    const varStrings = Object.entries(variables).map(([name, { type, required }]) => {
      return `$${name}: ${type}${required ? "!" : ""}`;
    });
    query += `(${varStrings.join(", ")})`;
  }

  query += " {\n";
  fields.forEach((field) => {
    query += `  ${field}\n`;
  });
  query += "}";

  return query;
}

/**
 * Minifica una query GraphQL
 */
export function minifyGraphQL(query: string): string {
  return query
    .replace(/\s+/g, " ")
    .replace(/\s*\{\s*/g, "{")
    .replace(/\s*\}\s*/g, "}")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s*,\s*/g, ",")
    .trim();
}

