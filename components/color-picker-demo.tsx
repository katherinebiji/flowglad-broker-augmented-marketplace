"use client"

import * as React from "react"
import { ColorPicker } from "@/components/ui/color-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ColorPickerDemo() {
  const [selectedColor, setSelectedColor] = React.useState("#3b82f6")

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Color Picker</CardTitle>
        <CardDescription>
          Select a color using the color picker below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <ColorPicker
            value={selectedColor}
            onChange={setSelectedColor}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Color:</p>
          <div
            className="w-full h-20 rounded-md border"
            style={{ backgroundColor: selectedColor }}
          />
          <p className="text-sm text-muted-foreground">
            {selectedColor}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}