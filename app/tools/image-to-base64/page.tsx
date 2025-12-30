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

      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="cursor-pointer">
              <Button variant="outline" asChild>
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

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Preview</CardTitle>
              {imageUrl && <Button variant="ghost" size="sm" onClick={handleClear}>Clear</Button>}
            </CardHeader>
            <CardContent>
              {imageUrl ? (
                <div className="flex items-center justify-center p-4 bg-accent rounded-lg">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-full max-h-96 object-contain"
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

          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Base64</CardTitle>
              {base64 && <CopyButton text={base64} />}
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              {base64 ? (
                <Textarea
                  value={base64}
                  readOnly
                  className="h-full font-mono text-xs resize-none"
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






