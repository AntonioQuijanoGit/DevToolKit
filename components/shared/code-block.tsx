"use client";

import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "json",
  className,
  showLineNumbers = false,
}: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  if (!code) {
    return (
      <div className={cn("flex items-center justify-center h-full text-muted-foreground", className)}>
        <p className="text-sm">No output</p>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-auto max-h-full", className)}>
      <pre
        ref={codeRef}
        className={cn(
          "p-4 rounded-lg text-sm font-mono",
          showLineNumbers && "line-numbers"
        )}
      >
        <code className={cn(`language-${language}`)}>{code}</code>
      </pre>
    </div>
  );
}

