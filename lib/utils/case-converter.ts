/**
 * Case conversion utilities
 */

export type CaseType = 
  | "camelCase"
  | "PascalCase"
  | "snake_case"
  | "kebab-case"
  | "CONSTANT_CASE"
  | "lower case"
  | "UPPER CASE"
  | "Title Case"
  | "Sentence case";

/**
 * Convert text to camelCase
 */
export function toCamelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

/**
 * Convert text to PascalCase
 */
export function toPascalCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
      return word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

/**
 * Convert text to snake_case
 */
export function toSnakeCase(text: string): string {
  return text
    .replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("_");
}

/**
 * Convert text to kebab-case
 */
export function toKebabCase(text: string): string {
  return text
    .replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("-");
}

/**
 * Convert text to CONSTANT_CASE
 */
export function toConstantCase(text: string): string {
  return text
    .replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toUpperCase())
    .join("_");
}

/**
 * Convert text to Title Case
 */
export function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Convert text to Sentence case
 */
export function toSentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert text to specified case
 */
export function convertCase(text: string, caseType: CaseType): string {
  switch (caseType) {
    case "camelCase":
      return toCamelCase(text);
    case "PascalCase":
      return toPascalCase(text);
    case "snake_case":
      return toSnakeCase(text);
    case "kebab-case":
      return toKebabCase(text);
    case "CONSTANT_CASE":
      return toConstantCase(text);
    case "lower case":
      return text.toLowerCase();
    case "UPPER CASE":
      return text.toUpperCase();
    case "Title Case":
      return toTitleCase(text);
    case "Sentence case":
      return toSentenceCase(text);
    default:
      return text;
  }
}



