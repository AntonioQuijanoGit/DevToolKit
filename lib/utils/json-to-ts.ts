/**
 * Convert JSON to TypeScript interfaces
 */

export interface TypeDefinition {
  name: string;
  type: string;
  optional: boolean;
  children?: TypeDefinition[];
}

/**
 * Generate TypeScript interface from JSON object
 */
export function jsonToTypeScript(
  json: any,
  interfaceName: string = "Root"
): string {
  const lines: string[] = [];
  const processed = new Set<string>();

  function generateInterface(obj: any, name: string, indent: number = 0): void {
    if (processed.has(name)) return;
    processed.add(name);

    const spaces = "  ".repeat(indent);
    lines.push(`${spaces}interface ${name} {`);

    for (const [key, value] of Object.entries(obj)) {
      const type = getType(value, key, indent + 1);
      const optional = value === null || value === undefined;
      lines.push(`${spaces}  ${key}${optional ? "?" : ""}: ${type};`);
    }

    lines.push(`${spaces}}`);
    lines.push("");
  }

  function getType(value: any, key: string, indent: number): string {
    if (value === null || value === undefined) {
      return "null";
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return "any[]";
      }
      const itemType = getType(value[0], key, indent);
      // If it's an object, create an interface for it
      if (typeof value[0] === "object" && value[0] !== null) {
        const interfaceName = toPascalCase(key) + "Item";
        generateInterface(value[0], interfaceName, indent);
        return `${interfaceName}[]`;
      }
      return `${itemType}[]`;
    }

    if (typeof value === "object") {
      const interfaceName = toPascalCase(key);
      generateInterface(value, interfaceName, indent);
      return interfaceName;
    }

    return typeof value;
  }

  function toPascalCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, "");
  }

  if (typeof json === "object" && json !== null) {
    generateInterface(json, interfaceName, 0);
  }

  return lines.join("\n");
}






