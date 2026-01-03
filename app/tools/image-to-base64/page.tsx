"use client";

import { useState } from "react";
import { Image } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { fileToBase64 } from "@/lib/utils/encoders";

export default function ImageToBase64Page() {
  const [base64, setBase64] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      const base64String = await fileToBase64(file);
      const dataUrl = `data:${file.type};base64,${base64String}`;
      setBase64(dataUrl);
      setImageUrl(dataUrl);
    } catch (error) {
      console.error("Failed to convert image:", error);
    }
  };

  const handleClear = () => {
    setBase64("");
    setImageUrl("");
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Image to Base64"
        description="Convert images to Base64 with preview"
        icon={Image}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        <Card>
          <CardHeader className="p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Upload Image</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <label className="cursor-pointer">
              <Button variant="outline" asChild className="min-h-[44px] text-sm sm:text-base">
                <span>Choose Image</span>
              </Button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card className="min-h-[300px] sm:min-h-[400px]">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Preview</CardTitle>
              {imageUrl && <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm min-h-[36px]">Clear</Button>}
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {imageUrl ? (
                <div className="flex items-center justify-center p-3 sm:p-4 bg-accent rounded-lg">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-full max-h-[200px] sm:max-h-96 object-contain rounded"
                  />
                </div>
              ) : (
                <EmptyState
                  icon={Image}
                  title="No image"
                  description="Upload an image to see preview"
                />
              )}
            </CardContent>
          </Card>

          <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Base64</CardTitle>
              {base64 && <CopyButton text={base64} />}
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
              {base64 ? (
                <Textarea
                  value={base64}
                  readOnly
                  className="h-full font-mono text-[10px] sm:text-xs resize-none min-h-[200px]"
                />
              ) : (
                <EmptyState
                  icon={Image}
                  title="No Base64"
                  description="Upload an image to generate Base64"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}






