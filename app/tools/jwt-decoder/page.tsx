"use client";

import { useState } from "react";
import { Key, AlertCircle } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { decodeJWT } from "@/lib/utils/generators";
import { examples } from "@/lib/constants/examples";
import { useHistoryStore } from "@/lib/store/history-store";
import { format } from "date-fns";

export default function JWTDecoderPage() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<{
    header: object;
    payload: object;
    signature: string;
    expired?: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleDecode = () => {
    try {
      const result = decodeJWT(input);
      setDecoded(result);
      setError(null);
      addHistory({
        tool: "jwt-decoder",
        input,
        output: JSON.stringify(result, null, 2),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decode JWT");
      setDecoded(null);
    }
  };

  const handleClear = () => {
    setInput("");
    setDecoded(null);
    setError(null);
  };

  const handleExample = () => {
    setInput(examples["jwt-decoder"]);
  };

  const formatTimestamp = (timestamp: number) => {
    try {
      return format(new Date(timestamp * 1000), "PPpp");
    } catch {
      return new Date(timestamp * 1000).toISOString();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="JWT Decoder"
        description="Decode and inspect JWT tokens"
        icon={Key}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        {/* Input */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">JWT Token</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm ">
                Example
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm ">
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JWT token here..."
              className="font-mono text-xs sm:text-sm min-h-[100px] resize-y"
            />
            <Button onClick={handleDecode} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base" size="lg">
              Decode
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        {error ? (
          <Card>
            <CardContent className="pt-6 p-4 sm:p-6">
              <div className="text-center py-8 px-4">
                <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive font-semibold mb-2 text-sm sm:text-base">Error</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : decoded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Header */}
            <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                <CardTitle className="text-base sm:text-lg font-semibold">Header</CardTitle>
                <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
                <CodeBlock
                  code={JSON.stringify(decoded.header, null, 2)}
                  language="json"
                />
              </CardContent>
            </Card>

            {/* Payload */}
            <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                  Payload
                  {decoded.expired && (
                    <Badge variant="destructive" className="text-[10px] sm:text-xs">Expired</Badge>
                  )}
                </CardTitle>
                <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
                <CodeBlock
                  code={JSON.stringify(decoded.payload, null, 2)}
                  language="json"
                />
                {/* Show formatted timestamps if present */}
                {decoded.payload && typeof decoded.payload === "object" && (
                  <div className="mt-4 pt-4 border-t border-border text-[10px] sm:text-xs text-muted-foreground space-y-1">
                    {"iat" in decoded.payload && (
                      <div>
                        Issued: {formatTimestamp(decoded.payload.iat as number)}
                      </div>
                    )}
                    {"exp" in decoded.payload && (
                      <div>
                        Expires: {formatTimestamp(decoded.payload.exp as number)}
                      </div>
                    )}
                    {"nbf" in decoded.payload && (
                      <div>
                        Not Before:{" "}
                        {formatTimestamp(decoded.payload.nbf as number)}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Signature */}
            <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                <CardTitle className="text-base sm:text-lg font-semibold">Signature</CardTitle>
                <CopyButton text={decoded.signature} />
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
                <div className="h-full overflow-auto">
                  <pre className="text-[10px] sm:text-xs font-mono break-all">
                    {decoded.signature}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 p-4 sm:p-6">
              <EmptyState
                icon={Key}
                title="No token decoded"
                description="Enter a JWT token and click Decode to see its contents"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}






