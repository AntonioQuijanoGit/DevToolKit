"use client";

import { useState } from "react";
import { AlignLeft } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/copy-button";
import { HowToUse } from "@/components/shared/how-to-use";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { examples } from "@/lib/constants/examples";

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
      const wordIndex = i - Math.floor(i / loremWords.length) * loremWords.length;
      words.push(loremWords[wordIndex]);
    }
    return words.join(" ");
  } else if (type === "sentences") {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) {
      const wordCount = Math.floor(Math.random() * 10) + 5;
      const words: string[] = [];
      for (let j = 0; j < wordCount; j++) {
        const wordIdx = j - Math.floor(j / loremWords.length) * loremWords.length;
        words.push(loremWords[wordIdx]);
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
          const wordIdx2 = k - Math.floor(k / loremWords.length) * loremWords.length;
          words.push(loremWords[wordIdx2]);
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

  const handleExample = () => {
    const example = examples["lorem-ipsum"];
    if (example && typeof example === "object") {
      setType(example.type || "paragraphs");
      setCount(example.count || 3);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Lorem Ipsum Generator"
        description="Generate placeholder text"
        icon={AlignLeft}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        <HowToUse
          steps={[
            "Select content type (Words, Sentences, or Paragraphs)",
            "Set the number of items to generate",
            "Click 'Generate' to create placeholder text",
            "Copy the generated text for use in your designs or layouts",
          ]}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Options</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm ">
                Example
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Type
                </label>
                <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                  <SelectTrigger className="min-h-[44px]">
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
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Count: {count}
                </label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  className="min-h-[44px] text-sm sm:text-base"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Generated Text</CardTitle>
              <div className="flex gap-2 flex-wrap">
                {output && <CopyButton text={output} />}
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm ">
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
              {output ? (
                <Textarea
                  value={output}
                  readOnly
                  className="h-full resize-none text-xs sm:text-sm min-h-[200px]"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground px-4">
                  <p className="text-xs sm:text-sm text-center">Click Generate to create text</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Button onClick={handleGenerate} size="lg" className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}






