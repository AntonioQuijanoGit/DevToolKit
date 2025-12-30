"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle2, XCircle, Download, Loader2 } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";
import { formatJSON, minifyJSON } from "@/lib/utils/formatters";
import { useToast } from "@/lib/hooks/use-toast";
import { EmptyState } from "@/components/shared/empty-state";
import JSZip from "jszip";
import { cn } from "@/lib/utils";

interface ProcessedFile {
  id: string;
  name: string;
  originalSize: number;
  processedSize: number;
  success: boolean;
  error?: string;
  content?: string;
}

export default function BatchProcessorPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [operation, setOperation] = useState<string>("format-json");
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState<ProcessedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    toast({
      title: "Files added",
      description: `${acceptedFiles.length} file(s) added`,
      variant: "success",
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
      "text/plain": [".txt", ".js", ".ts"],
    },
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please add files to process",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setProcessed([]);
    setProgress(0);

    const results: ProcessedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(((i + 1) / files.length) * 100);

      try {
        const text = await file.text();
        const originalSize = text.length;

        let processedContent: string;
        let processedSize: number;

        switch (operation) {
          case "format-json":
            const formatResult = formatJSON(text);
            if (formatResult.success && formatResult.result) {
              processedContent = formatResult.result;
              processedSize = processedContent.length;
            } else {
              throw new Error(formatResult.error || "Formatting failed");
            }
            break;

          case "minify-json":
            const minifyResult = minifyJSON(text);
            if (minifyResult.success && minifyResult.result) {
              processedContent = minifyResult.result;
              processedSize = processedContent.length;
            } else {
              throw new Error(minifyResult.error || "Minification failed");
            }
            break;

          default:
            processedContent = text;
            processedSize = originalSize;
        }

        results.push({
          id: `${file.name}-${i}`,
          name: file.name,
          originalSize,
          processedSize,
          success: true,
          content: processedContent,
        });
      } catch (error) {
        results.push({
          id: `${file.name}-${i}`,
          name: file.name,
          originalSize: file.size,
          processedSize: 0,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    setProcessed(results);
    setProcessing(false);
    setProgress(100);

    const successCount = results.filter((r) => r.success).length;
    toast({
      title: "Processing complete",
      description: `${successCount}/${files.length} files processed successfully`,
      variant: successCount === files.length ? "success" : "default",
    });
  };

  const downloadAll = async () => {
    if (processed.filter((p) => p.success).length === 0) {
      toast({
        title: "Error",
        description: "No files to download",
        variant: "destructive",
      });
      return;
    }

    try {
      const zip = new JSZip();

      processed.forEach((file) => {
        if (file.success && file.content) {
          zip.file(file.name, file.content);
        }
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `processed-files-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "All files downloaded as ZIP",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ZIP file",
        variant: "destructive",
      });
    }
  };

  const downloadSingle = (file: ProcessedFile) => {
    if (!file.success || !file.content) return;

    const blob = new Blob([file.content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Batch Processor"
        description="Process multiple files at once (No API keys required)"
        icon={Upload}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Files & Operation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="format-json">Format JSON</SelectItem>
                  <SelectItem value="minify-json">Minify JSON</SelectItem>
                </SelectContent>
              </Select>

              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-2">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to select files
                </p>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {files.length} file(s) selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFiles([])}
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded bg-accent"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {(file.size / 1024).toFixed(1)} KB
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFile(index)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={processFiles}
                disabled={files.length === 0 || processing}
                className="w-full"
                size="lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Process {files.length} File(s)
                  </>
                )}
              </Button>

              {processing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Results</CardTitle>
                {processed.filter((p) => p.success).length > 0 && (
                  <Button onClick={downloadAll} size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {processed.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No results yet"
                  description="Process files to see results here"
                  tips={[
                    "Supports JSON files",
                    "Process multiple files at once",
                    "Download all as ZIP",
                    "100% local processing"
                  ]}
                />
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {processed.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        "p-3 rounded-lg border",
                        file.success
                          ? "border-green-500 bg-green-500/5"
                          : "border-red-500 bg-red-500/5"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {file.success ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          )}
                          <span className="text-sm font-medium truncate">{file.name}</span>
                        </div>
                        {file.success && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadSingle(file)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      {file.success ? (
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>
                            Size: {file.originalSize} → {file.processedSize} bytes
                          </div>
                          <div>
                            Reduction:{" "}
                            {((1 - file.processedSize / file.originalSize) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-red-500">{file.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}






