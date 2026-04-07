"use client";

export { Button } from "@/components/ui/button";
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
export { Badge } from "@/components/ui/badge";
export { Input } from "@/components/ui/input";
export { Progress } from "@/components/ui/progress";
export { Checkbox } from "@/components/ui/checkbox";
export { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function SectionHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("font-accent text-[13px] font-medium uppercase tracking-[0.2em] text-muted-foreground", className)}>
      {children}
    </p>
  );
}
