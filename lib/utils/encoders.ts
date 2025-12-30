export function encodeBase64(text: string): string {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (error) {
    throw new Error("Failed to encode to Base64");
  }
}

export function decodeBase64(base64: string): string {
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch (error) {
    throw new Error("Failed to decode from Base64");
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix if present
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function encodeURL(url: string): string {
  try {
    return encodeURIComponent(url);
  } catch (error) {
    throw new Error("Failed to encode URL");
  }
}

export function decodeURL(url: string): string {
  try {
    return decodeURIComponent(url);
  } catch (error) {
    throw new Error("Failed to decode URL");
  }
}






