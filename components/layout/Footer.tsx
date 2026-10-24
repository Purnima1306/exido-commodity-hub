"use client";

import { ExternalLink, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const BHAVCOPY_URL = "https://www.mcxindia.com/market-data/bhavcopy";
const GOLD_SPEC_URL = "https://www.mcxindia.com/products/bullion/gold";

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="relative z-10 mt-8 border-t border-white/10 bg-navy-950/70">
      <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 text-base font-bold text-navy-950">
              E
            </span>
            <span className="text-base font-semibold tracking-[0.22em] text-white">EXIDO</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
            {t("footerTagline")}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {t("footerSources")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={BHAVCOPY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-300 hover:text-blue-200"
              >
                {t("linkBhavcopy")}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href={GOLD_SPEC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-300 hover:text-blue-200"
              >
                {t("linkGold")}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        <div className="flex gap-3 rounded-xl border border-gold-400/25 bg-gold-400/5 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-slate-300">{t("footerDisclaimer")}</p>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8">
          <span>© 2026 EXIDO · Hackathon prototype</span>
          {language !== "en" && <span>{t("translationNote")}</span>}
        </div>
      </div>
    </footer>
  );
}