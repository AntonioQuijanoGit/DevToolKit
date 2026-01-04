"use client";

import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HowToUseProps {
  steps: string[];
  title?: string;
}

export function HowToUse({ steps, title = "How to use" }: HowToUseProps) {
  return (
    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-sm sm:text-base text-blue-900 dark:text-blue-100">
              {title}
            </h3>
            <ol className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 space-y-1.5 list-decimal list-inside">
              {steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

