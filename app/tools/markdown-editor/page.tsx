"use client";

import { useState } from "react";
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

  const convertToHTML = () => {
    // Simple markdown to HTML converter
    let html = markdown
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

    setHtml(html);
  };

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

      <div className="flex-1 grid grid-cols-2 gap-4 p-6 overflow-hidden">
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Markdown</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExample}>
                Example
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <Textarea
              value={markdown}
              onChange={(e) => {
                setMarkdown(e.target.value);
                convertToHTML();
              }}
              placeholder="Write your markdown here..."
              className="h-full font-mono text-sm resize-none"
              onKeyUp={convertToHTML}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Preview</CardTitle>
            <div className="flex gap-2">
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
          <CardContent className="flex-1 overflow-auto p-4">
            {html ? (
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Start typing to see preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



