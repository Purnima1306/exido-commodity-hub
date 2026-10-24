"use client";

import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PROFESSIONS } from "@/lib/professions";

export default function ProfessionFlow() {
  const { t } = useLanguage();

  return (
    <section id="profession" aria-labelledby="profession-heading" className="scroll-mt-24 pb-16">
      {/* Root node of the flowchart */}
      <div className="mx-auto max-w-md rounded-2xl border border-gold-400/40 bg-navy-800/70 px-6 py-5 text-center shadow-[0_0_50px_-18px_rgba(230,188,92,0.55)]">
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/30">
          <Users className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 id="profession-heading" className="mt-3 text-xl font-semibold text-white">
          {t("professionQuestion")}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{t("professionHint")}</p>
      </div>

      {/* Connector from root */}
      <div
        aria-hidden="true"
        className="mx-auto h-8 w-px bg-gradient-to-b from-gold-400/70 to-blue-400/40"
      />

      {/* Branches */}
      <div className="relative">
        {/* Horizontal bar joining the three branches (desktop/tablet only) */}
        <div
          aria-hidden="true"
          className="absolute left-[16.667%] right-[16.667%] top-0 hidden h-px bg-blue-400/35 md:block"
        />

        <ul className="grid grid-cols-1 md:grid-cols-3">
          {PROFESSIONS.map((profession) => {
            const Icon = profession.icon;
            return (
              <li key={profession.id} className="relative pt-6 md:px-2.5">
                {/* Vertical drop connector */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-blue-400/35"
                />

                <Link
                  href={`/dashboard/${profession.id}`}
                  className={`group flex h-full flex-col rounded-2xl border bg-navy-800/60 p-5 transition ${profession.cardClasses}`}
                >
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-xl ${profession.iconBoxClasses}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {t(profession.titleKey)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {t(profession.descriptionKey)}
                  </p>
                  <span
                    className={`mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium ${profession.ctaClasses}`}
                  >
                    {t("openDashboard")}
                    <ArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}