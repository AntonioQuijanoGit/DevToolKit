"use client";

import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";

const markdownExample = `# DevToolkit

A comprehensive developer tools platform.

## Features

- **27+ Tools** for developers
- **Dark/Light Mode** support
- **Offline** functionality
- **Fast** and responsive

## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Lists

1. First item
2. Second item
3. Third item

- Unordered item
- Another item

> This is a blockquote

[Link](https://example.com)
`;

export default function MarkdownEditorPage() {
  const [markdown, setMarkdown] = useState(markdownExample);
  const [html, setHtml] = useState("");

  const convertToHTML = (md: string) => {
    // Simple markdown to HTML converter
    let converted = md
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/`(.*?)`/gim, "<code>$1</code>")
      .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
      .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/\n/g, "<br>");

    return converted;
  };

  // Auto-convert markdown to HTML whenever markdown changes
  useEffect(() => {
    if (markdown.trim()) {
      const converted = convertToHTML(markdown);
      setHtml(converted);
    } else {
      setHtml("");
    }
  }, [markdown]);

  const handleClear = () => {
    setMarkdown("");
    setHtml("");
  };

  const handleExample = () => {
    setMarkdown(markdownExample);
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Markdown Editor"
        description="Editor with live preview"
        icon={FileText}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 md:p-6 overflow-auto pb-20 sm:pb-24">
        <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Markdown</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm min-h-[36px]">
                Example
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm min-h-[36px]">
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Write your markdown here..."
              className="h-full font-mono text-xs sm:text-sm resize-none min-h-[200px]"
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Preview</CardTitle>
            <div className="flex gap-2 flex-wrap">
              {html && <CopyButton text={html} />}
              {html && (
                <DownloadButton
                  content={html}
                  filename="markdown.html"
                  mimeType="text/html"
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 sm:p-6">
            {html ? (
              <div
                className="prose prose-invert max-w-none text-xs sm:text-sm"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground px-4">
                <p className="text-xs sm:text-sm text-center">Start typing to see preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






