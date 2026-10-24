"use client";

import { ArrowDown, Bot, Database, Mic, Sparkles, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";

type StatusItem = { icon: LucideIcon; label: TranslationKey; value: TranslationKey };

const STATUS_ITEMS: StatusItem[] = [
  { icon: Bot, label: "statusAi", value: "statusAiValue" },
  { icon: Mic, label: "statusVoice", value: "statusVoiceValue" },
  { icon: Database, label: "statusData", value: "statusDataValue" },
];

export default function Hero({ onOpenAssistant }: { onOpenAssistant: () => void }) {
  const { t } = useLanguage();

  return (
    <section className="pb-10 pt-10 sm:pt-14 lg:pt-16">
      <p className="inline-flex flex-wrap items-center gap-x-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-slate-300">
        <span className="font-semibold tracking-[0.2em] text-gold-300">EXIDO</span>
        <span aria-hidden="true" className="text-slate-600">
          ·
        </span>
        <span>{t("productTitle")}</span>
      </p>

      <h1 className="mt-5 bg-gradient-to-r from-white via-blue-100 to-gold-300 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
        {t("heroTitle")}
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
        {t("heroDescription")}
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <a
          href="#profession"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-300 to-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-[0_0_30px_-8px_rgba(230,188,92,0.8)] transition hover:brightness-110"
        >
          {t("heroCtaStart")}
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={onOpenAssistant}
          className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/10 px-5 py-2.5 text-sm font-medium text-blue-100 transition hover:bg-blue-500/20"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {t("heroCtaAssistant")}
        </button>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {t("statusTitle")}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {STATUS_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.label}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5"
              >
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-slate-300">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-200">{t(item.label)}</p>
                  <p className="mt-0.5 flex items-start gap-1.5 text-[12px] leading-snug text-slate-400">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400"
                    />
                    {t(item.value)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}