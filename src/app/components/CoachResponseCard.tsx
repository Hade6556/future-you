"use client";

import { motion } from "framer-motion";
import { ACCENT as LIME, TEXT_HI, TEXT_MID, GLASS, GLASS_BORDER } from "@/app/theme";

const FONT_BODY: React.CSSProperties = {
  fontFamily: "var(--font-apercu), sans-serif",
};

type CoachResponseCardProps = {
  message: string;
  actionItem?: string | null;
};

export default function CoachResponseCard({ message, actionItem }: CoachResponseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.25 }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "stretch",
        borderRadius: 12, padding: "12px 16px",
        background: GLASS, border: "1px solid " + GLASS_BORDER,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ ...FONT_BODY, fontSize: 13, fontWeight: 500, color: TEXT_MID, margin: "0 0 4px" }}>
          Behavio
        </p>
        <p style={{ ...FONT_BODY, fontSize: 14, lineHeight: 1.6, color: TEXT_HI, margin: 0 }}>
          {message}
        </p>
        {actionItem && (
          <p style={{
            ...FONT_BODY,
            marginTop: 8, paddingTop: 8,
            borderTop: "1px solid " + GLASS_BORDER,
            fontSize: 12, color: LIME, margin: "8px 0 0",
          }}>
            → {actionItem}
          </p>
        )}
      </div>
    </motion.div>
  );
}
