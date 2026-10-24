import { Store, TrendingUp, Warehouse, type LucideIcon } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";

export type ProfessionId = "trader" | "retailer" | "wholesaler";

export type Profession = {
  id: ProfessionId;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: LucideIcon;
  /** Tailwind classes (written in full so Tailwind can detect them) */
  cardClasses: string;
  iconBoxClasses: string;
  ctaClasses: string;
};

export const PROFESSIONS: Profession[] = [
  {
    id: "trader",
    titleKey: "trader",
    descriptionKey: "traderDesc",
    icon: TrendingUp,
    cardClasses:
      "border-blue-400/25 hover:border-blue-400/60 hover:shadow-[0_0_44px_-14px_rgba(59,130,246,0.7)]",
    iconBoxClasses: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30",
    ctaClasses: "text-blue-300",
  },
  {
    id: "retailer",
    titleKey: "retailer",
    descriptionKey: "retailerDesc",
    icon: Store,
    cardClasses:
      "border-teal-400/25 hover:border-teal-400/60 hover:shadow-[0_0_44px_-14px_rgba(20,184,166,0.7)]",
    iconBoxClasses: "bg-teal-500/15 text-teal-300 ring-1 ring-teal-400/30",
    ctaClasses: "text-teal-300",
  },
  {
    id: "wholesaler",
    titleKey: "wholesaler",
    descriptionKey: "wholesalerDesc",
    icon: Warehouse,
    cardClasses:
      "border-purple-400/25 hover:border-purple-400/60 hover:shadow-[0_0_44px_-14px_rgba(168,85,247,0.7)]",
    iconBoxClasses: "bg-purple-500/15 text-purple-300 ring-1 ring-purple-400/30",
    ctaClasses: "text-purple-300",
  },
];

export function isProfessionId(value: string): value is ProfessionId {
  return PROFESSIONS.some((profession) => profession.id === value);
}

export function getProfession(id: ProfessionId): Profession {
  const found = PROFESSIONS.find((profession) => profession.id === id);
  if (!found) {
    throw new Error(`Unknown profession: ${id}`);
  }
  return found;
}