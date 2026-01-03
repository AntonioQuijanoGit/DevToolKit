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

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 overflow-auto pb-20 sm:pb-24">
        <Card className="min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Files & Operation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger className="min-h-[44px]">
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
                  "border-2 border-dashed rounded-lg p-4 sm:p-8 text-center cursor-pointer transition-colors",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-muted-foreground" />
                <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  or click to select files
                </p>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <span className="text-xs sm:text-sm font-medium">
                      {files.length} file(s) selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFiles([])}
                      className="text-xs sm:text-sm min-h-[36px]"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="space-y-1 max-h-[150px] sm:max-h-[200px] overflow-y-auto">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded bg-accent"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">{file.name}</span>
                          <Badge variant="outline" className="text-[10px] sm:text-xs flex-shrink-0">
                            {(file.size / 1024).toFixed(1)} KB
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 sm:h-7 sm:w-7"
                          onClick={() => removeFile(index)}
                        >
                          <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={processFiles}
                disabled={files.length === 0 || processing}
                className="w-full min-h-[44px] text-sm sm:text-base"
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
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="min-h-[400px] sm:min-h-[500px]">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Results</CardTitle>
              {processed.filter((p) => p.success).length > 0 && (
                <Button onClick={downloadAll} size="sm" variant="outline" className="text-xs sm:text-sm min-h-[36px]">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-4 sm:p-6 overflow-auto">
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
                <div className="space-y-2 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                  {processed.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        "p-2 sm:p-3 rounded-lg border",
                        file.success
                          ? "border-green-500 bg-green-500/5"
                          : "border-red-500 bg-red-500/5"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {file.success ? (
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                          )}
                          <span className="text-xs sm:text-sm font-medium truncate">{file.name}</span>
                        </div>
                        {file.success && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadSingle(file)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                          >
                            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        )}
                      </div>
                      {file.success ? (
                        <div className="text-[10px] sm:text-xs text-muted-foreground space-y-1 break-words">
                          <div>
                            Size: {file.originalSize} → {file.processedSize} bytes
                          </div>
                          <div>
                            Reduction:{" "}
                            {((1 - file.processedSize / file.originalSize) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] sm:text-xs text-red-500 break-words">{file.error}</p>
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






