export function downloadFile(content: string, filename: string, mimeType: string = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJSON(data: object, filename: string = "data.json") {
  downloadFile(JSON.stringify(data, null, 2), filename, "application/json");
}

export function downloadText(text: string, filename: string = "data.txt") {
  downloadFile(text, filename, "text/plain");
}

export function downloadCSV(csv: string, filename: string = "data.csv") {
  downloadFile(csv, filename, "text/csv");
}

