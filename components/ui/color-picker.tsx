"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
  className?: string
}

const ColorPicker = React.forwardRef<HTMLButtonElement, ColorPickerProps>(
  ({ value = "#000000", onChange, className }, ref) => {
    const [color, setColor] = React.useState(value)
    const [inputValue, setInputValue] = React.useState(value)

    React.useEffect(() => {
      setColor(value)
      setInputValue(value)
    }, [value])

    const handleColorChange = (newColor: string) => {
      setColor(newColor)
      setInputValue(newColor)
      onChange?.(newColor)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      
      // Validate hex color
      if (/^#[0-9A-F]{6}$/i.test(newValue)) {
        setColor(newValue)
        onChange?.(newValue)
      }
    }

    const presetColors = [
      "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff",
      "#ffff00", "#ff00ff", "#00ffff", "#ff8000", "#8000ff",
      "#0080ff", "#80ff00", "#ff0080", "#00ff80", "#8080ff",
      "#ff8080", "#80ff80", "#8080ff", "#ffff80", "#ff80ff"
    ]

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              "w-[220px] justify-start text-left font-normal",
              className
            )}
          >
            <div
              className="w-4 h-4 rounded border mr-2"
              style={{ backgroundColor: color }}
            />
            {color}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="color-input">Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="color-input"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="#000000"
                />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-10 border border-input rounded-md cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Presets</Label>
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handleColorChange(presetColor)}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)

ColorPicker.displayName = "ColorPicker"

export { ColorPicker }