/**
 * HTML formatting and minification utilities
 */

/**
 * Basic HTML minifier
 */
export function minifyHTML(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "") // Remove HTML comments
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/>\s+</g, "><") // Remove spaces between tags
    .trim();
}

/**
 * Basic HTML beautifier
 */
export function beautifyHTML(html: string, indentSize: number = 2): string {
  let indent = 0;
  let result = "";
  let i = 0;
  let inTag = false;
  let inString = false;
  let stringChar = "";

  while (i < html.length) {
    const char = html[i];
    const nextChar = html[i + 1];

    // Handle strings
    if (!inTag && (char === '"' || char === "'")) {
      inString = true;
      stringChar = char;
      result += char;
      i++;
      continue;
    }

    if (inString && char === stringChar && html[i - 1] !== "\\") {
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

    // Handle opening tags
    if (char === "<" && nextChar !== "/" && nextChar !== "!") {
      inTag = true;
      result += "\n" + "  ".repeat(indent) + "<";
      i++;
      continue;
    }

    // Handle closing tags
    if (char === ">" && !inString) {
      inTag = false;
      result += ">";
      
      // Check if it's a self-closing tag
      const tagContent = result.slice(result.lastIndexOf("<"));
      if (tagContent.includes("/>") || tagContent.match(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i)) {
        // Self-closing, don't increase indent
      } else if (html[i - 1] === "/") {
        // Self-closing tag
      } else {
        indent++;
      }
      
      i++;
      continue;
    }

    // Handle closing tag
    if (char === "<" && nextChar === "/") {
      indent = Math.max(0, indent - 1);
      result += "\n" + "  ".repeat(indent) + "</";
      i += 2;
      while (i < html.length && html[i] !== ">") {
        result += html[i];
        i++;
      }
      result += ">";
      i++;
      continue;
    }

    result += char;
    i++;
  }

  return result.trim();
}

/**
 * Validate HTML (basic check)
 */
export function validateHTML(html: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for unclosed tags (basic)
  const openTags = html.match(/<[^/!][^>]*>/g) || [];
  const closeTags = html.match(/<\/[^>]+>/g) || [];
  
  // Simple validation
  if (openTags.length !== closeTags.length) {
    errors.push("Mismatched tags detected");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

