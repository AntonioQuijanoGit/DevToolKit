"use client";

import { useState, useMemo } from "react";
import { Palette } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/copy-button";
import { hexToRgb, rgbToHex, rgbToHsl, rgbToHsv, hslToRgb } from "@/lib/utils/color-utils";
import { examples } from "@/lib/constants/examples";

export default function ColorPickerPage() {
  const exampleColor = examples["color-picker"];
  const initialHex = (exampleColor && typeof exampleColor === "object" && exampleColor.hex) ? exampleColor.hex : "#0070F3";
  const initialRgb = hexToRgb(initialHex) || { r: 0, g: 112, b: 243 };
  const initialHsl = rgbToHsl(initialRgb.r, initialRgb.g, initialRgb.b);
  const initialHsv = rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b);

  const [hex, setHex] = useState(initialHex);
  const [rgb, setRgb] = useState(initialRgb);
  const [hsl, setHsl] = useState(initialHsl);
  const [hsv, setHsv] = useState(initialHsv);

  const updateFromHex = (newHex: string) => {
    const rgbValue = hexToRgb(newHex);
    if (rgbValue) {
      setRgb(rgbValue);
      const hslValue = rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b);
      const hsvValue = rgbToHsv(rgbValue.r, rgbValue.g, rgbValue.b);
      setHsl(hslValue);
      setHsv(hsvValue);
    }
  };

  const updateFromRgb = (newRgb: { r: number; g: number; b: number }) => {
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(newHex);
    const hslValue = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    const hsvValue = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
    setHsl(hslValue);
    setHsv(hsvValue);
  };

  const updateFromHsl = (newHsl: { h: number; s: number; l: number }) => {
    setHsl(newHsl);
    const rgbValue = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    updateFromRgb(rgbValue);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHex(value);
    if (/^#?[0-9A-Fa-f]{6}$/.test(value) || /^#?[0-9A-Fa-f]{3}$/.test(value)) {
      updateFromHex(value.startsWith("#") ? value : `#${value}`);
    }
  };

  const handleRgbChange = (component: "r" | "g" | "b", value: number) => {
    const clamped = Math.max(0, Math.min(255, value));
    updateFromRgb({ ...rgb, [component]: clamped });
  };

  const handleHslChange = (component: "h" | "s" | "l", value: number) => {
    const clamped =
      component === "h"
        ? Math.max(0, Math.min(360, value))
        : Math.max(0, Math.min(100, value));
    updateFromHsl({ ...hsl, [component]: clamped });
  };

  const colorString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Color Picker"
        description="Pick colors and convert between formats"
        icon={Palette}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-auto pb-20 sm:pb-24">
        {/* Color Preview */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-semibold">Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div
                className="w-full sm:w-32 h-32 sm:h-32 rounded-lg border-2 border-border flex-shrink-0"
                style={{ backgroundColor: hex }}
              />
              <div className="flex-1 w-full space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                    HEX
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={hex}
                      onChange={handleHexChange}
                      className="font-mono flex-1 min-h-[44px] text-sm sm:text-base"
                    />
                    <CopyButton text={hex} />
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                    RGB
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                      readOnly
                      className="font-mono flex-1 min-h-[44px] text-sm sm:text-base"
                    />
                    <CopyButton text={colorString} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* RGB Inputs */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-semibold">RGB</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Red
                </label>
                <Input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb.r}
                  onChange={(e) =>
                    handleRgbChange("r", parseInt(e.target.value) || 0)
                  }
                  className="min-h-[44px] text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Green
                </label>
                <Input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb.g}
                  onChange={(e) =>
                    handleRgbChange("g", parseInt(e.target.value) || 0)
                  }
                  className="min-h-[44px] text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Blue
                </label>
                <Input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb.b}
                  onChange={(e) =>
                    handleRgbChange("b", parseInt(e.target.value) || 0)
                  }
                  className="min-h-[44px] text-sm sm:text-base"
                />
              </div>
            </CardContent>
          </Card>

          {/* HSL */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-semibold">HSL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Hue
                </label>
                <Input
                  type="number"
                  min={0}
                  max={360}
                  value={hsl.h}
                  onChange={(e) =>
                    handleHslChange("h", parseInt(e.target.value) || 0)
                  }
                  className="min-h-[44px] text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Saturation
                </label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={hsl.s}
                  onChange={(e) =>
                    handleHslChange("s", parseInt(e.target.value) || 0)
                  }
                  className="min-h-[44px] text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Lightness
                </label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={hsl.l}
                  onChange={(e) =>
                    handleHslChange("l", parseInt(e.target.value) || 0)
                  }
                  className="min-h-[44px] text-sm sm:text-base"
                />
              </div>
              <div className="pt-2">
                <div className="flex gap-2">
                  <Input
                    value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                    readOnly
                    className="font-mono text-xs sm:text-sm flex-1 min-h-[44px]"
                  />
                  <CopyButton
                    text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HSV */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-semibold">HSV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Hue
                </label>
                <Input type="number" min={0} max={360} value={hsv.h} readOnly className="min-h-[44px] text-sm sm:text-base" />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Saturation
                </label>
                <Input type="number" min={0} max={100} value={hsv.s} readOnly className="min-h-[44px] text-sm sm:text-base" />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Value
                </label>
                <Input type="number" min={0} max={100} value={hsv.v} readOnly className="min-h-[44px] text-sm sm:text-base" />
              </div>
              <div className="pt-2">
                <div className="flex gap-2">
                  <Input
                    value={`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`}
                    readOnly
                    className="font-mono text-xs sm:text-sm flex-1 min-h-[44px]"
                  />
                  <CopyButton
                    text={`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

