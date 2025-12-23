/**
 * Minifier Web Worker
 * Minifica código en background
 */

self.onmessage = function (e) {
  const { type, data, id } = e.data;

  try {
    const startTime = performance.now();
    let result: string;

    switch (type) {
      case "json": {
        const parsed = JSON.parse(data);
        result = JSON.stringify(parsed);
        break;
      }

      case "javascript": {
        // Simple JS minification (remove comments and extra whitespace)
        result = data
          .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
          .replace(/\/\/.*$/gm, "") // Remove line comments
          .replace(/\s+/g, " ") // Collapse whitespace
          .replace(/\s*([{}()\[\];,=])\s*/g, "$1") // Remove spaces around operators
          .trim();
        break;
      }

      default:
        throw new Error(`Unknown minification type: ${type}`);
    }

    const duration = performance.now() - startTime;

    self.postMessage({
      id,
      success: true,
      result,
      originalSize: data.length,
      minifiedSize: result.length,
      reduction: ((1 - result.length / data.length) * 100).toFixed(1),
      duration,
    });
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      error: error instanceof Error ? error.message : "Minification failed",
    });
  }
};

