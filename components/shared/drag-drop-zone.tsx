"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragDropZoneProps {
  onFileAccepted: (file: File) => void;
  accept?: Record<string, string[]>;
  className?: string;
  children?: React.ReactNode;
}

export function DragDropZone({
  onFileAccepted,
  accept,
  className,
  children,
}: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
      setIsDragging(false);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive || isDragging
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/50",
        className
      )}
    >
      <input {...getInputProps()} />
      {children || (
        <div className="flex flex-col items-center gap-4">
          {isDragActive ? (
            <Upload className="h-12 w-12 text-primary" />
          ) : (
            <File className="h-12 w-12 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop the file here"
                : "Drag & drop a file here, or click to select"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click or drag to upload
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



