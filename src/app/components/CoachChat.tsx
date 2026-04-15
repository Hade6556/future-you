"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { Button } from "@/components/ui/button";
// OrbAvatar removed in simplification

interface CoachMessage {
  role: "user" | "assistant";
  content: string;
  actionItem?: string | null;
}

export function CoachChat({ className }: { className?: string }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const chatHistory = usePlanStore((s) => s.chatHistory);
  const setChatHistory = usePlanStore((s) => s.setChatHistory);
  const dogArchetype = usePlanStore((s) => s.dogArchetype);
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const streak = usePlanStore((s) => s.streak);
  const userName = usePlanStore((s) => s.userName);
  const getCurrentStep = usePlanStore((s) => s.getCurrentStep);
  const lastReflection = usePlanStore((s) => s.lastReflection);

  // Seed display messages from persisted chat history on mount
  useEffect(() => {
    if (chatHistory.length > 0 && messages.length === 0) {
      setMessages(chatHistory.map((h) => ({ role: h.role, content: h.content })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: CoachMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const currentStep = getCurrentStep();

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: text,
          mode: "chat",
          context: {
            archetype: dogArchetype,
            ambitionType,
            streak,
            userName,
            currentPlanStepTitle: currentStep?.title ?? null,
            lastReflection,
          },
          history: chatHistory.slice(-5),
        }),
      });

      const data = await res.json() as { message: string; actionItem?: string | null };
      const assistantMsg: CoachMessage = {
        role: "assistant",
        content: data.message,
        actionItem: data.actionItem,
      };
      const finalMessages = [...nextMessages, assistantMsg];
      setMessages(finalMessages);

      // Persist to Zustand (last 10)
      setChatHistory(finalMessages.map((m) => ({ role: m.role, content: m.content })));
    } catch {
      setMessages([...nextMessages, { role: "assistant", content: "I hit a snag. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      {/* Message thread */}
      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            Ask Behavio anything about your goal, habits, or next move.
          </p>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {msg.content}
                {msg.actionItem && (
                  <p className="mt-2 text-[12px] opacity-75 border-t border-current/20 pt-2">
                    → {msg.actionItem}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex justify-start items-end gap-2"
          >
            {/* Typing indicator */}
            <div className="bg-secondary rounded-2xl px-4 py-3">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input row */}
      <div className="flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Behavio..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-border bg-secondary px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          style={{ minHeight: "48px", maxHeight: "120px" }}
        />
        <Button
          onClick={() => void sendMessage()}
          disabled={!input.trim() || loading}
          size="sm"
          className="h-12 w-12 shrink-0 rounded-xl p-0"
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
