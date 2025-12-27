import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    return (
      <input
        type="range"
        ref={ref}
        value={value[0]}
        onChange={(e) => {
          const newValue = [Number(e.target.value)]
          onValueChange?.(newValue)
        }}
        min={min}
        max={max}
        step={step}
        className={cn(
          "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600",
          className
        )}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
