"use client";

import { useState } from "react";
import { AlignLeft } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/copy-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo"
];

const generateLorem = (type: "words" | "sentences" | "paragraphs", count: number): string => {
  if (type === "words") {
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      words.push(loremWords[i % loremWords.length]);
    }
    return words.join(" ");
  } else if (type === "sentences") {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) {
      const wordCount = Math.floor(Math.random() * 10) + 5;
      const words: string[] = [];
      for (let j = 0; j < wordCount; j++) {
        words.push(loremWords[j % loremWords.length]);
      }
      const sentence = words.join(" ").charAt(0).toUpperCase() + words.join(" ").slice(1) + ".";
      sentences.push(sentence);
    }
    return sentences.join(" ");
  } else {
    const paragraphs: string[] = [];
    for (let i = 0; i < count; i++) {
      const sentenceCount = Math.floor(Math.random() * 3) + 3;
      const sentences: string[] = [];
      for (let j = 0; j < sentenceCount; j++) {
        const wordCount = Math.floor(Math.random() * 10) + 5;
        const words: string[] = [];
        for (let k = 0; k < wordCount; k++) {
          words.push(loremWords[k % loremWords.length]);
        }
        const sentence = words.join(" ").charAt(0).toUpperCase() + words.join(" ").slice(1) + ".";
        sentences.push(sentence);
      }
      paragraphs.push(sentences.join(" "));
    }
    return paragraphs.join("\n\n");
  }
};

export default function LoremIpsumPage() {
  const [type, setType] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    const generated = generateLorem(type, count);
    setOutput(generated);
  };

  const handleClear = () => {
    setOutput("");
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Lorem Ipsum Generator"
        description="Generate placeholder text"
        icon={AlignLeft}
      />

      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Type
              </label>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="words">Words</SelectItem>
                  <SelectItem value="sentences">Sentences</SelectItem>
                  <SelectItem value="paragraphs">Paragraphs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Count: {count}
              </label>
              <Input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Generated Text</CardTitle>
            <div className="flex gap-2">
              {output && <CopyButton text={output} />}
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {output ? (
              <Textarea
                value={output}
                readOnly
                className="h-full resize-none"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Click Generate to create text</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="border-t border-border p-4 flex justify-center gap-3">
        <Button onClick={handleGenerate} size="lg">
          Generate
        </Button>
      </div>
    </div>
  );
}






