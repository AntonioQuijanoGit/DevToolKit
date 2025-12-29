"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/use-toast";
import { downloadFile } from "@/lib/utils/download";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  content: string;
  filename: string;
  mimeType?: string;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
}

export function DownloadButton({
  content,
  filename,
  mimeType = "text/plain",
  className,
  size = "icon",
}: DownloadButtonProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      downloadFile(content, filename, mimeType);
      toast({
        title: "Downloaded!",
        description: `File ${filename} downloaded successfully`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleDownload}
      className={cn("h-8 w-8 p-0", className)}
      aria-label="Download file"
    >
      <Download className="h-4 w-4" />
    </Button>
  );
}



