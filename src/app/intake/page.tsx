"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MascotReactor } from "../components/mascot/MascotReactor";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const PENDING_NARRATIVE_KEY = "future-you-pending-narrative";

export default function IntakePage() {
  const router = useRouter();
  const dogArchetype = usePlanStore((s) => s.dogArchetype);
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const [narrative, setNarrative] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = narrative.trim();
    if (trimmed.length < 20) {
      setError("Tell me a bit more — the more detail, the better your plan.");
      return;
    }

    // Enrich narrative with quiz context so API contract is preserved
    const enriched = [
      trimmed,
      ambitionType ? `Goal area: ${ambitionType}` : "",
      dogArchetype ? `Coaching style: ${dogArchetype}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      sessionStorage.setItem(PENDING_NARRATIVE_KEY, enriched);
    } catch {
      // ignore private mode
    }

    router.push("/generating");
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 pb-10 pt-14">
      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Mascot */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <MascotReactor emotion="thinking" size={80} />
        </motion.div>

        {/* Badge + heading */}
        <motion.div
          className="space-y-3 text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center">
            <Badge variant="secondary">One question</Badge>
          </div>
          <h2 className="font-display text-2xl leading-snug text-foreground">
            Tell me what winning looks like for you.
          </h2>
          <p className="text-[14px] text-muted-foreground">
            Be specific — the more detail, the better your plan.
          </p>
        </motion.div>

        {/* Textarea */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-4"
        >
          <textarea
            className="min-h-[140px] w-full resize-none rounded-2xl border border-input bg-background px-4 py-4 text-[16px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            value={narrative}
            onChange={(e) => {
              setNarrative(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. I want to launch my first product by summer, feel confident enough to pitch investors, and build a small team I'm proud of..."
            rows={5}
            autoFocus
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[13px] text-destructive"
            >
              {error}
            </motion.p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={narrative.trim().length < 10}
            className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
            size="lg"
          >
            Create my plan
            <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden />
          </Button>

          <p className="text-center text-[12px] text-muted-foreground">
            Quick · Private · No credit card required
          </p>
        </motion.div>
      </div>
    </div>
  );
}
