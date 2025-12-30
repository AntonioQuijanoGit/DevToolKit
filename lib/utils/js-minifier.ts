/**
 * JavaScript minification and beautification utilities
 */

/**
 * Basic JavaScript minifier (removes comments and extra whitespace)
 */
export function minifyJS(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
    .replace(/\/\/.*$/gm, "") // Remove line comments
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/\s*([{}()\[\];,=+\-*/])\s*/g, "$1") // Remove spaces around operators
    .trim();
}

/**
 * Basic JavaScript beautifier (formats code with indentation)
 */
export function beautifyJS(code: string, indentSize: number = 2): string {
  let indent = 0;
  let result = "";
  let inString = false;
  let stringChar = "";
  let i = 0;

  while (i < code.length) {
    const char = code[i];
    const nextChar = code[i + 1];

    if (!inString && (char === '"' || char === "'" || char === "`")) {
      inString = true;
      stringChar = char;
      result += char;
      i++;
      continue;
    }

    if (inString && char === stringChar && code[i - 1] !== "\\") {
      inString = false;
      stringChar = "";
      result += char;
      i++;
      continue;
    }

    if (inString) {
      result += char;
      i++;
      continue;
    }

    // Handle block comments
    if (char === "/" && nextChar === "*") {
      result += "  ".repeat(indent) + "/*";
      i += 2;
      while (i < code.length && !(code[i] === "*" && code[i + 1] === "/")) {
        result += code[i];
        i++;
      }
      result += "*/\n";
      i += 2;
      continue;
    }

    // Handle line comments
    if (char === "/" && nextChar === "/") {
      result += "  ".repeat(indent) + "//";
      i += 2;
      while (i < code.length && code[i] !== "\n") {
        result += code[i];
        i++;
      }
      result += "\n";
      continue;
    }

    // Handle opening braces
    if (char === "{") {
      result += "{\n";
      indent++;
      result += "  ".repeat(indent);
      i++;
      continue;
    }

    // Handle closing braces
    if (char === "}") {
      indent = Math.max(0, indent - 1);
      result += "\n" + "  ".repeat(indent) + "}";
      i++;
      continue;
    }

    // Handle semicolons
    if (char === ";") {
      result += ";\n";
      result += "  ".repeat(indent);
      i++;
      continue;
    }

    // Handle newlines
    if (char === "\n") {
      result += "\n";
      result += "  ".repeat(indent);
      i++;
      continue;
    }

    result += char;
    i++;
  }

  return result.trim();
}






