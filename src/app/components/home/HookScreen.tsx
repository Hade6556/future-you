"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { TestimonialsStrip } from "../TestimonialsStrip";

export function HookScreen() {
  const router = useRouter();
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-start px-6 pb-12 pt-24"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background mesh */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 20% 10%, rgba(40,80,200,0.30) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 85% 80%, rgba(15,40,100,0.50) 0%, transparent 60%),
            linear-gradient(160deg, #0f2040 0%, #090f1a 50%, #060912 100%)
          `,
          pointerEvents: "none",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center gap-5 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Product-of-the-day badge */}
        <div className="product-badge" aria-label="Product of the day No. 1">
          <Image
            src="/icons/laurel-leaf.svg"
            alt=""
            width={52}
            height={62}
            className="laurel laurel-left-from-right"
            aria-hidden
          />
          <div className="badge-text">
            <div className="badge-small">Product of the day</div>
            <div className="badge-big">No. 1</div>
          </div>
          <Image
            src="/icons/laurel-leaf.svg"
            alt=""
            width={52}
            height={62}
            className="laurel right"
            aria-hidden
          />
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="mx-auto w-full max-w-[22rem] space-y-3 text-center"
        >
          <h1
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: 50,
              lineHeight: 0.96,
              letterSpacing: "-0.03em",
              color: "rgba(235,242,255,0.92)",
              margin: "0 auto",
              textAlign: "center",
              textWrap: "balance",
            }}
          >
            Your{" "}
            <em style={{ fontStyle: "normal", color: "#C8FF00" }}>best self</em>
            {" "}is already in there.
          </h1>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="w-full space-y-3"
        >
          <button
            onClick={() => router.push("/quiz")}
            className="btn-cta w-full"
          >
            take me there
          </button>
          <p
            style={{
              textAlign: "center",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(120,155,195,0.56)",
            }}
          >
            2 min · private · free
          </p>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-full"
        >
          <TestimonialsStrip />
        </motion.div>
      </motion.div>
    </div>
  );
}
