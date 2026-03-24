import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border-2 border-black px-2.5 py-0.5 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500 text-black",
        secondary:
          "bg-blue-200 text-black",
        destructive:
          "bg-red-500 text-white",
        outline: "bg-white text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
