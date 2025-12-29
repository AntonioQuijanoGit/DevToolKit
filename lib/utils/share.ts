/**
 * Utility functions for sharing results via URL hash
 */

export interface ShareableData {
  tool: string;
  input?: string;
  output?: string;
  config?: Record<string, any>;
}

/**
 * Encode data to base64 for URL sharing
 */
export function encodeShareData(data: ShareableData): string {
  try {
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json));
  } catch (error) {
    console.error("Failed to encode share data:", error);
    return "";
  }
}

/**
 * Decode base64 data from URL hash
 */
export function decodeShareData(encoded: string): ShareableData | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to decode share data:", error);
    return null;
  }
}

/**
 * Generate shareable URL
 */
export function generateShareUrl(data: ShareableData, baseUrl?: string): string {
  const encoded = encodeShareData(data);
  const url = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  return `${url}/tools/${data.tool}?share=${encoded}`;
}

/**
 * Get share data from URL
 */
export function getShareDataFromUrl(): ShareableData | null {
  if (typeof window === "undefined") return null;
  
  const params = new URLSearchParams(window.location.search);
  const shareParam = params.get("share");
  
  if (!shareParam) return null;
  
  return decodeShareData(shareParam);
}

/**
 * Copy share URL to clipboard
 */
export async function copyShareUrl(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error("Failed to copy URL:", error);
    return false;
  }
}



