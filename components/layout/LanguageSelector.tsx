"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGES } from "@/lib/i18n";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1"
    >
      <Globe className="ml-2 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
      <span className="sr-only">{t("language")}</span>
      {LANGUAGES.map((option) => {
        const active = option.code === language;
        return (
          <button
            key={option.code}
            type="button"
            lang={option.code}
            aria-pressed={active}
            title={option.englishName}
            onClick={() => setLanguage(option.code)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
              active
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_18px_-6px_rgba(99,102,241,0.9)]"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}