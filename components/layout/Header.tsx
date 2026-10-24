"use client";

import Link from "next/link";
import { Mic, Sparkles } from "lucide-react";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

type HeaderProps = {
  assistantOpen?: boolean;
  onToggleAssistant?: () => void;
  onOpenVoice?: () => void;
};

export default function Header({
  assistantOpen = false,
  onToggleAssistant,
  onOpenVoice,
}: HeaderProps) {
  const { t } = useLanguage();
  const showAssistantControls = Boolean(onToggleAssistant && onOpenVoice);

  return (
    <header className="relative z-30 border-b border-white/10 bg-navy-950/80 backdrop-blur-md lg:sticky lg:top-0">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-lg font-bold text-navy-950 shadow-[0_0_24px_-6px_rgba(230,188,92,0.8)]">
            E
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-semibold tracking-[0.22em] text-white">EXIDO</span>
            <span className="block text-[11px] text-slate-400 sm:text-xs">{t("productTitle")}</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <LanguageSelector />

          {showAssistantControls && (
            <>
              <button
                type="button"
                onClick={onOpenVoice}
                className="inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-500/10 px-4 py-2 text-sm font-medium text-teal-200 transition hover:bg-teal-500/20"
              >
                <Mic className="h-4 w-4" aria-hidden="true" />
                {t("voiceAssistant")}
              </button>

              <button
                type="button"
                onClick={onToggleAssistant}
                aria-pressed={assistantOpen}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-white transition ${
                  assistantOpen
                    ? "border-blue-300/70 bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_0_24px_-6px_rgba(99,102,241,0.9)]"
                    : "border-blue-400/40 bg-gradient-to-r from-blue-600/60 to-purple-600/60 hover:from-blue-600/80 hover:to-purple-600/80"
                }`}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {t("aiAssistant")}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}