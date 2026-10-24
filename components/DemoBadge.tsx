import { FlaskConical } from "lucide-react";

export const DEMO_LABEL = "DEMO DATA — NOT LIVE MCX DATA";

export default function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-gold-300 ${className}`}
    >
      <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
      {DEMO_LABEL}
    </span>
  );
}