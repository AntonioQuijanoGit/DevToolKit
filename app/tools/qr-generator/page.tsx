"use client";

import { useState } from "react";
import { QrCode } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { QRCodeSVG } from "qrcode.react";

export default function QRGeneratorPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "decode">("generate");
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="QR Code Generator"
        description="Generate and decode QR codes"
        icon={QrCode}
      />

      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "generate" | "decode")} className="h-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>

          {activeTab === "generate" ? (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text, URL, or data to encode..."
                    className="min-h-[200px]"
                  />
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Size: {size}px
                    </label>
                    <input
                      type="range"
                      min="128"
                      max="512"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle>QR Code</CardTitle>
                  {text && <CopyButton text={text} />}
                </CardHeader>
                <CardContent>
                  {text ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg">
                      <QRCodeSVG value={text} size={size} />
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
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">QR code decoding coming soon...</p>
                  <p className="text-xs mt-2">Upload an image or paste a QR code</p>
                </div>
              </CardContent>
            </Card>
          )}
        </Tabs>
      </div>
    </div>
  );
}






