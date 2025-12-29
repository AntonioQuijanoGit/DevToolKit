/**
 * Utilities for Web Workers
 */

export interface WorkerMessage<T = any> {
  id: string;
  type: string;
  data?: T;
}

export interface WorkerResponse<T = any> {
  id: string;
  success: boolean;
  result?: T;
  error?: string;
  duration?: number;
}

/**
 * Crea un worker y envía un mensaje
 */
export function createWorker<T = any, R = any>(
  workerPath: string,
  message: WorkerMessage<T>
): Promise<WorkerResponse<R>> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, { type: "module" });

    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error("Worker timeout"));
    }, 30000); // 30 second timeout

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      resolve(e.data);
    };

    worker.onerror = (error) => {
      clearTimeout(timeout);
      worker.terminate();
      reject(error);
    };

    worker.postMessage(message);
  });
}

/**
 * JSON Parser Worker helper
 */
export async function parseJSONInWorker(json: string): Promise<any> {
  const id = `parse-${Date.now()}-${Math.random()}`;
  const response = await createWorker("/workers/json-parser.worker.ts", {
    id,
    type: "parse",
    data: json,
  });

  if (!response.success) {
    throw new Error(response.error || "Failed to parse JSON");
  }

  return response.result;
}

/**
 * Minifier Worker helper
 */
export async function minifyInWorker(
  code: string,
  type: "json" | "javascript"
): Promise<{ result: string; reduction: string }> {
  const id = `minify-${Date.now()}-${Math.random()}`;
  const response = await createWorker("/workers/minifier.worker.ts", {
    id,
    type,
    data: code,
  });

  if (!response.success) {
    throw new Error(response.error || "Failed to minify");
  }

  return {
    result: response.result as string,
    reduction: (response as any).reduction || "0",
  };
}




