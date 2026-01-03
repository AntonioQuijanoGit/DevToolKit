"use client";

import { useState, useEffect, useRef } from "react";
import { QrCode, Download, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { QRCodeSVG } from "qrcode.react";
import { examples } from "@/lib/constants/examples";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/hooks/use-toast";

export default function QRGeneratorPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "decode">("generate");
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [qrSize, setQrSize] = useState(256);
  const [mounted, setMounted] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleExample = () => {
    const example = examples["qr-generator"];
    if (example && typeof example === "string") {
      setText(example);
      toast({
        title: "Example loaded",
        description: "Try scanning this QR code with your phone",
      });
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const calculateQrSize = () => {
      if (typeof window === 'undefined') {
        setQrSize(256);
        return;
      }
      const width = window.innerWidth;
      const containerWidth = qrRef.current?.clientWidth || width;
      
      if (width < 640) {
        // Mobile: use 80% of container, max 240px
        const maxSize = Math.min(containerWidth * 0.8, 240);
        setQrSize(Math.min(size, maxSize));
      } else if (width < 1024) {
        // Tablet: use 70% of container, max 300px
        const maxSize = Math.min(containerWidth * 0.7, 300);
        setQrSize(Math.min(size, maxSize));
      } else {
        // Desktop: use full size up to container
        const maxSize = Math.min(containerWidth * 0.6, size);
        setQrSize(maxSize);
      }
    };

    calculateQrSize();
    window.addEventListener('resize', calculateQrSize);
    return () => window.removeEventListener('resize', calculateQrSize);
  }, [size, mounted]);

  const handleDownload = () => {
    if (!text || !qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = qrSize;
    canvas.height = qrSize;
    
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-code-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast({
              title: "Downloaded",
              description: "QR code saved to your device",
              variant: "default",
            });
          }
        });
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="QR Code Generator"
        description="Generate QR codes from text, URLs, or any data. Scan with any QR reader app."
        icon={QrCode}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto pb-20 sm:pb-24">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "generate" | "decode")} className="h-full flex flex-col">
          <TabsList className="mb-3 sm:mb-4 w-full sm:w-auto">
            <TabsTrigger value="generate" className="flex-1 sm:flex-none text-xs sm:text-sm">
              Generate QR Code
            </TabsTrigger>
            <TabsTrigger value="decode" className="flex-1 sm:flex-none text-xs sm:text-sm">
              Decode QR Code
            </TabsTrigger>
          </TabsList>

          {activeTab === "generate" ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Instructions Card */}
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-sm sm:text-base text-blue-900 dark:text-blue-100">
                        How to use
                      </h3>
                      <ol className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 space-y-1.5 list-decimal list-inside">
                        <li>Enter any text, URL, or data in the input field below</li>
                        <li>Adjust the size slider to make the QR code larger or smaller</li>
                        <li>Scan the QR code with your phone's camera or any QR reader app</li>
                        <li>Download the QR code as an image to share or print</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Input Card */}
                <Card className="min-h-[300px] sm:min-h-[400px] flex flex-col">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-4 sm:p-6 border-b">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg font-semibold mb-1">
                        Enter Your Data
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Text, URL, contact info, or any data
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExample} 
                      className="text-xs sm:text-sm w-full sm:w-auto"
                    >
                      Load Example
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col space-y-4 p-4 sm:p-6">
                    <div className="flex-1">
                      <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text, URL, or data to encode...&#10;&#10;Examples:&#10;• https://example.com&#10;• Contact: John Doe, +1234567890&#10;• WiFi: WPA2;SSID;Password"
                        className="min-h-[200px] sm:min-h-[250px] text-xs sm:text-sm resize-y font-mono"
                      />
                    </div>
                    
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <label className="text-xs sm:text-sm font-medium">
                          QR Code Size
                        </label>
                        <Badge variant="secondary" className="text-xs">
                          {size}px
                        </Badge>
                      </div>
                      <input
                        type="range"
                        min="128"
                        max="512"
                        step="8"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        aria-label="QR code size"
                      />
                      <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                        <span>Small (128px)</span>
                        <span>Large (512px)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* QR Code Output Card */}
                <Card className="min-h-[300px] sm:min-h-[400px] flex flex-col">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-4 sm:p-6 border-b">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg font-semibold mb-1">
                        Your QR Code
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {text ? "Ready to scan or download" : "Enter data to generate"}
                      </p>
                    </div>
                    {text && (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownload}
                          className="text-xs sm:text-sm flex-1 sm:flex-none"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                          Download
                        </Button>
                        <CopyButton text={text} />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center p-4 sm:p-6">
                    {text ? (
                      <div className="w-full space-y-4">
                        <div 
                          ref={qrRef}
                          className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-white rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                          <div className="w-full max-w-full overflow-hidden flex items-center justify-center">
                            {mounted && (
                              <QRCodeSVG 
                                value={text} 
                                size={qrSize}
                                level="M"
                                includeMargin={true}
                                className="w-full h-auto"
                                aria-label="Generated QR code"
                              />
                            )}
                          </div>
                        </div>
                        
                        {/* Success Message */}
                        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <p className="text-xs sm:text-sm text-green-800 dark:text-green-200">
                            QR code generated successfully! Scan it with your phone's camera.
                          </p>
                        </div>

                        {/* Usage Tips */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground">Quick Tips:</p>
                          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Point your phone camera at the QR code</li>
                            <li>Most modern phones have built-in QR scanners</li>
                            <li>Download the image to share or print</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <EmptyState
                        icon={QrCode}
                        title="No QR code yet"
                        description="Enter text, URL, or any data above to generate your QR code"
                        tips={[
                          "Works with URLs, text, contact info, WiFi credentials",
                          "Adjust size for better scanning on different devices",
                          "Download as PNG image to share or print",
                          "100% free, no registration required"
                        ]}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader className="p-4 sm:p-6 border-b">
                <CardTitle className="text-base sm:text-lg font-semibold">Decode QR Code</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 p-4 sm:p-6">
                <div className="text-center py-8 px-4">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-muted rounded-full">
                      <QrCode className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm sm:text-base">Coming Soon</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                        QR code decoding feature is under development. For now, you can generate QR codes and scan them with your phone's camera.
                      </p>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 text-left">
                          <strong>Tip:</strong> Use your phone's camera app to scan QR codes. Most modern phones can read QR codes directly from the camera viewfinder.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </Tabs>
      </div>
    </div>
  );
}
