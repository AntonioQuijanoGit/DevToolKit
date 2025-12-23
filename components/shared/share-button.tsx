"use client";

import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/use-toast";
import { generateShareUrl, copyShareUrl, ShareableData } from "@/lib/utils/share";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  data: ShareableData;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
}

export function ShareButton({ data, className, size = "icon" }: ShareButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const url = generateShareUrl(data);
      const success = await copyShareUrl(url);
      
      if (success) {
        setCopied(true);
        toast({
          title: "Link copied!",
          description: "Share this link to share your results",
        });
        
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error("Failed to copy");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate share link",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleShare}
      className={cn("h-8 w-8 p-0", className)}
      aria-label="Share results"
    >
      {copied ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
    </Button>
  );
}

