"use client";
import SectionError from "../components/SectionError";
export default function TasksError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <SectionError {...props} section="Tasks" />;
}
