"use client";

import { useState, useEffect } from "react";
import { QrCode } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { QRCodeSVG } from "qrcode.react";
import { examples } from "@/lib/constants/examples";

export default function QRGeneratorPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "decode">("generate");
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [qrSize, setQrSize] = useState(256);

  const handleExample = () => {
    const example = examples["qr-generator"];
    if (example && typeof example === "string") {
      setText(example);
    }
  };

  useEffect(() => {
    // Calculate responsive QR size based on viewport
    const calculateQrSize = () => {
      if (typeof window === 'undefined') {
        setQrSize(256);
        return;
      }
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile: limit to 200px
        setQrSize(Math.min(size, 200));
      } else if (width < 1024) {
        // Tablet: limit to 256px
        setQrSize(Math.min(size, 256));
      } else {
        // Desktop: use full size
        setQrSize(size);
      }
    };

    calculateQrSize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', calculateQrSize);
      return () => window.removeEventListener('resize', calculateQrSize);
    }
  }, [size]);

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="QR Code Generator"
        description="Generate and decode QR codes"
        icon={QrCode}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto pb-20 sm:pb-24">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "generate" | "decode")} className="h-full flex flex-col">
          <TabsList className="mb-3 sm:mb-4">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>

          {activeTab === "generate" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <Card className="min-h-[300px] sm:min-h-[400px]">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-4 sm:p-6 border-b">
                  <CardTitle className="text-base sm:text-lg font-semibold">Input</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm min-h-[36px]">
                    Example
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text, URL, or data to encode..."
                    className="min-h-[200px] text-xs sm:text-sm resize-y"
                  />
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                      Size: {size}px
                    </label>
                    <input
                      type="range"
                      min="128"
                      max="512"
                      step="8"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-1">
                      <span>128px</span>
                      <span>512px</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="min-h-[300px] sm:min-h-[400px]">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                  <CardTitle className="text-base sm:text-lg font-semibold">QR Code</CardTitle>
                  {text && <CopyButton text={text} />}
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {text ? (
                    <div className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-8 bg-white rounded-lg">
                      <div className="w-full max-w-full overflow-hidden flex items-center justify-center">
                        <div className="w-full max-w-[200px] sm:max-w-[256px] md:max-w-none">
                          <QRCodeSVG 
                            value={text} 
                            size={qrSize}
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      icon={QrCode}
                      title="No QR code"
                      description="Enter text to generate QR code"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 p-4 sm:p-6">
                <div className="text-center py-8 px-4 text-muted-foreground">
                  <p className="text-xs sm:text-sm">QR code decoding coming soon...</p>
                  <p className="text-[10px] sm:text-xs mt-2">Upload an image or paste a QR code</p>
                </div>
              </CardContent>
            </Card>
          )}
        </Tabs>
      </div>
    </div>
  );
}






