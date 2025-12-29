/**
 * JSON Parser Web Worker
 * Procesa JSON en background sin bloquear UI
 */

self.onmessage = function (e) {
  const { type, data, id } = e.data;

  try {
    switch (type) {
      case "parse": {
        const startTime = performance.now();
        const parsed = JSON.parse(data);
        const duration = performance.now() - startTime;

        self.postMessage({
          id,
          success: true,
          result: parsed,
          duration,
        });
        break;
      }

      case "stringify": {
        const startTime = performance.now();
        const stringified = JSON.stringify(data, null, 2);
        const duration = performance.now() - startTime;

        self.postMessage({
          id,
          success: true,
          result: stringified,
          duration,
        });
        break;
      }

      case "validate": {
        const startTime = performance.now();
        try {
          JSON.parse(data);
          const duration = performance.now() - startTime;
          self.postMessage({
            id,
            success: true,
            valid: true,
            duration,
          });
        } catch (error) {
          const duration = performance.now() - startTime;
          self.postMessage({
            id,
            success: false,
            valid: false,
            error: error instanceof Error ? error.message : "Invalid JSON",
            duration,
          });
        }
        break;
      }

      default:
        self.postMessage({
          id,
          success: false,
          error: `Unknown operation: ${type}`,
        });
    }
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};



