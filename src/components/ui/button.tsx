"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent font-sans font-semibold whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover rounded-full",
        outline:
          "border-border bg-card text-foreground hover:bg-secondary rounded-full",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full",
        ghost:
          "hover:bg-secondary hover:text-foreground rounded-full",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 rounded-full",
        warm:
          "bg-warm-gold text-foreground hover:bg-warm-gold/80 rounded-full",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 min-h-[44px] gap-2 px-8 text-[15px]",
        sm: "h-11 min-h-[44px] gap-1.5 rounded-full px-4 text-sm",
        xs: "h-8 gap-1 rounded-full px-3 text-xs",
        lg: "h-16 gap-2 px-10 text-base",
        icon: "size-11 min-h-[44px] min-w-[44px] rounded-full",
        "icon-sm": "size-11 min-h-[44px] min-w-[44px] rounded-full",
        pill: "h-8 gap-1.5 rounded-full px-4 text-xs font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
