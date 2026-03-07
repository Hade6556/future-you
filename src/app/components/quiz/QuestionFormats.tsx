"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizOption } from "../../data/quiz";

/* ─── Binary: 2 vertically stacked full-width tiles ─── */

type BinaryProps = {
  options: QuizOption[];
  onSelect: (idx: number) => void;
};

export function BinaryQuestion({ options, onSelect }: BinaryProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onSelect(idx), 200);
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {options.map((opt, i) => (
        <motion.button
          key={i}
          whileTap={{ scale: 0.97 }}
          onClick={() => pick(i)}
          className={`flex h-[80px] w-full items-center justify-center rounded-2xl border px-5 text-center text-[16px] font-medium transition-colors ${
            selected === i
              ? "border-[#121212] bg-[#121212] text-white"
              : "border-[#E0E0E0] bg-white text-[#121212]"
          }`}
        >
          <AnimatePresence mode="wait">
            {selected === i && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mr-2"
              >
                ✓
              </motion.span>
            )}
          </AnimatePresence>
          {opt.emoji && <span className="mr-2">{opt.emoji}</span>}
          {opt.label}
        </motion.button>
      ))}
    </div>
  );
}

/* ─── TileSelect: 2x2 or 3-in-a-row tiles with emoji ─── */

type TileSelectProps = {
  options: QuizOption[];
  onSelect: (idx: number) => void;
};

export function TileSelectQuestion({ options, onSelect }: TileSelectProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const cols = options.length <= 3 ? "grid-cols-3" : "grid-cols-2";

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onSelect(idx), 200);
  };

  return (
    <div className={`grid ${cols} w-full gap-3`}>
      {options.map((opt, i) => (
        <motion.button
          key={i}
          whileTap={{ scale: 0.97 }}
          onClick={() => pick(i)}
          className={`flex h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border text-center transition-colors ${
            selected === i
              ? "border-[#121212] bg-[#121212] text-white"
              : "border-[#E0E0E0] bg-white text-[#121212]"
          }`}
        >
          {opt.emoji && <span className="text-[28px]">{opt.emoji}</span>}
          <span className="text-[14px] font-medium">{opt.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ─── MultiSelect: checkbox rows with Next button ─── */

type MultiSelectProps = {
  options: QuizOption[];
  onSelect: (indices: number[]) => void;
};

export function MultiSelectQuestion({ options, onSelect }: MultiSelectProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => toggle(i)}
          className={`flex items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${
            selected.has(i)
              ? "border-[#121212] bg-[#121212]/5"
              : "border-[#E0E0E0] bg-white"
          }`}
        >
          <div
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
              selected.has(i)
                ? "border-[#121212] bg-[#121212]"
                : "border-[#C7C7CB] bg-transparent"
            }`}
          >
            <AnimatePresence>
              {selected.has(i) && (
                <motion.svg
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
          <span className="text-[15px] font-medium text-[#121212]">
            {opt.emoji && <span className="mr-2">{opt.emoji}</span>}
            {opt.label}
          </span>
        </button>
      ))}

      <button
        onClick={() => onSelect(Array.from(selected))}
        disabled={selected.size === 0}
        className="mt-4 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-[#121212] text-[17px] font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

/* ─── Scale: 5 circular options ─── */

type ScaleProps = {
  options: QuizOption[];
  onSelect: (idx: number) => void;
};

export function ScaleQuestion({ options, onSelect }: ScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full items-center justify-between">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelected(i)}
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-[16px] font-semibold transition-all ${
              selected === i
                ? "scale-110 border-[#121212] bg-[#121212] text-white"
                : "border-[#E0E0E0] bg-white text-[#6A6A6A]"
            }`}
          >
            {i + 1}
          </motion.button>
        ))}
      </div>

      <div className="flex w-full justify-between px-1">
        <span className="text-[12px] text-[#6A6A6A]">
          {options[0]?.label || "Low"}
        </span>
        <span className="text-[12px] text-[#6A6A6A]">
          {options[options.length - 1]?.label || "High"}
        </span>
      </div>

      <button
        onClick={() => selected !== null && onSelect(selected)}
        disabled={selected === null}
        className="mt-2 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-[#121212] text-[17px] font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

/* ─── EmojiGrid: 2x3 grid ─── */

type EmojiGridProps = {
  options: QuizOption[];
  onSelect: (idx: number) => void;
};

export function EmojiGridQuestion({ options, onSelect }: EmojiGridProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onSelect(idx), 200);
  };

  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {options.map((opt, i) => (
        <motion.button
          key={i}
          whileTap={{ scale: 0.95 }}
          onClick={() => pick(i)}
          className={`flex h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border transition-colors ${
            selected === i
              ? "border-[#121212] bg-[#121212] text-white"
              : "border-[#E0E0E0] bg-white text-[#121212]"
          }`}
        >
          <span className="text-[28px]">{opt.emoji}</span>
          <span className="text-[12px] font-medium">{opt.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ─── NameInput ─── */

type NameInputProps = {
  onSubmit: (name: string) => void;
};

export function NameInputQuestion({ onSubmit }: NameInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. Alex"
        className="w-full border-b-2 border-[#E0E0E0] bg-transparent pb-3 text-center text-[24px] font-medium text-[#121212] placeholder:text-[#121212]/25 focus:border-[#121212] focus:outline-none"
      />
      <button
        onClick={() => value.trim() && onSubmit(value.trim())}
        disabled={!value.trim()}
        className="flex h-[56px] w-full items-center justify-center rounded-[28px] bg-[#121212] text-[17px] font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-40"
      >
        Continue →
      </button>
    </div>
  );
}

/* ─── EmailInput ─── */

type EmailInputProps = {
  onSubmit: (email: string) => void;
};

export function EmailInputQuestion({ onSubmit }: EmailInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <input
        ref={inputRef}
        type="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="your@email.com"
        className="w-full border-b-2 border-[#E0E0E0] bg-transparent pb-3 text-center text-[20px] font-medium text-[#121212] placeholder:text-[#121212]/25 focus:border-[#121212] focus:outline-none"
      />
      <button
        onClick={() => valid && onSubmit(value.trim())}
        disabled={!valid}
        className="flex h-[56px] w-full items-center justify-center rounded-[28px] bg-[#121212] text-[17px] font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-40"
      >
        Build my plan →
      </button>
      <div className="flex items-center gap-1.5 text-[12px] text-[#6A6A6A]">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
          <rect x="2" y="6" width="8" height="7" rx="1.5" stroke="#6A6A6A" strokeWidth="1.2" />
          <path d="M4 6V4a2 2 0 114 0v2" stroke="#6A6A6A" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Your data is private
      </div>
    </div>
  );
}
