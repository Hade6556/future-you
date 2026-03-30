"use client";
import SectionError from "../components/SectionError";
export default function AccountError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <SectionError {...props} section="Account" />;
}
