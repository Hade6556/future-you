"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { domainQuotes } from "../data/copy";

interface InspirationQuotesProps {
  domain: string | null;
}

export function InspirationQuotes({ domain }: InspirationQuotesProps) {
  const quotes =
    domain && domainQuotes[domain]
      ? domainQuotes[domain]
      : domainQuotes["entrepreneur"];

  const [idx, setIdx] = useState(0);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--card-surface)",
        border: "1.5px solid var(--card-stroke)",
        boxShadow: "0 2px 12px rgba(123,107,168,0.08)",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-0 flex items-center gap-1.5">
        <span
          className="text-[13px] font-bold uppercase tracking-[0.2em]"
          style={{ color: "var(--accent-primary)" }}
        >
          ✦ Inspired by
        </span>
      </div>

      {/* Quote body */}
      <div className="px-5 pt-3 pb-5 min-h-[140px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-3"
          >
            {/* Decorative open quote */}
            <div
              className="text-[56px] font-extrabold leading-none select-none"
              style={{ color: "var(--accent-primary)", opacity: 0.25, marginBottom: "-12px" }}
              aria-hidden
            >
              &ldquo;
            </div>

            {/* Quote text */}
            <p
              className="text-[15px] italic leading-relaxed font-medium"
              style={{ color: "var(--foreground)" }}
            >
              {quotes[idx].quote}
            </p>

            {/* Author */}
            <p
              className="text-[12px] font-semibold text-right"
              style={{ color: "var(--text-muted, var(--muted-foreground))" }}
            >
              &mdash;&nbsp;{quotes[idx].author}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dot navigation */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Quote ${i + 1}`}
              className="h-2 w-2 rounded-full transition-all duration-200 focus:outline-none"
              style={{
                background:
                  i === idx
                    ? "var(--accent-primary)"
                    : "var(--card-stroke, #e2ddf5)",
                transform: i === idx ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
