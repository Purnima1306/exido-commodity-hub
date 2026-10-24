

"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";

type Props = {
  profession: "trader" | "retailer" | "wholesaler";
};

const dashboardContent = {
  trader: {
    title: "traderDashboard",
    subtitle: "traderSubtitle",
    cards: [
      ["marketOverview", "marketOverviewDesc"],
      ["goldAnalysis", "goldAnalysisDesc"],
      ["aiMarketInsights", "aiMarketInsightsDesc"],
    ],
  },
  retailer: {
    title: "retailerDashboard",
    subtitle: "retailerSubtitle",
    cards: [
      ["inventory", "inventoryDesc"],
      ["salesOverview", "salesOverviewDesc"],
      ["aiBusinessAssistant", "aiBusinessAssistantDesc"],
    ],
  },
  wholesaler: {
    title: "wholesalerDashboard",
    subtitle: "wholesalerSubtitle",
    cards: [
      ["bulkCommodities", "bulkCommoditiesDesc"],
      ["ordersSuppliers", "ordersSuppliersDesc"],
      ["aiMarketInsights", "aiMarketInsightsDesc"],
    ],
  },
} as const;

const featureDetails: Record<string, TranslationKey> = {
  marketOverview: "detailMarketOverview",
  goldAnalysis: "detailGoldAnalysis",
  aiMarketInsights: "detailAiMarketInsights",
  inventory: "detailInventory",
  salesOverview: "detailSalesOverview",
  aiBusinessAssistant: "detailAiBusinessAssistant",
  bulkCommodities: "detailBulkCommodities",
  ordersSuppliers: "detailOrdersSuppliers",
};

const sampleContracts = [
  {
    symbol: "GOLD",
    expiry: "Demo expiry",
    price: 72000,
    volume: 1250,
    openInterest: 8400,
    spread: 0.12,
  },
  {
    symbol: "GOLDM",
    expiry: "Demo expiry",
    price: 72100,
    volume: 980,
    openInterest: 6200,
    spread: 0.18,
  },
  {
    symbol: "GOLDTEN",
    expiry: "Demo expiry",
    price: 71950,
    volume: 760,
    openInterest: 4100,
    spread: 0.25,
  },
];

export default function DashboardContent({ profession }: Props) {
  const { t } = useLanguage();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("volume");

  const data = dashboardContent[profession];

  const filteredContracts = sampleContracts
    .filter((contract) =>
      contract.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") return b.price - a.price;
      if (sortBy === "openInterest")
        return b.openInterest - a.openInterest;
      return b.volume - a.volume;
    });

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <a href="/" className="text-xl font-bold tracking-wide">
            EXIDO
          </a>

          <a
            href="/"
            className="rounded-full border border-blue-400/40 px-4 py-2 text-sm text-blue-100 hover:bg-blue-500/10"
          >
            ← {t("backToHome")}
          </a>
        </header>

        <section className="mt-12">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300">
            {t("dashboardWorkspace")}
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            {t(data.title as TranslationKey)}
          </h1>

          <p className="mt-3 text-slate-400">
            {t(data.subtitle as TranslationKey)}
          </p>
        </section>

        {profession === "trader" && (
          <section className="mt-10 rounded-2xl border border-blue-400/20 bg-slate-900/80 p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-wider text-blue-300">
                  {t("mcxAnalytics")}
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {t("contractsTitle")}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  placeholder={t("searchContracts")}
                </p>
              </div>

              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
                {t("demoData")}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search GOLD, GOLDM..."
                aria-label="Search contracts"
                className="min-w-0 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-400"
              />

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort contracts"
                className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-400"
              >
                <option value="volume">{t("sortByVolume")}</option>
                <option value="price">{t("sortByPrice")}</option>
                <option value="openInterest">{t("sortByOI")}</option>
              </select>
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="px-4 py-3">{t("contract")}</th>
                    <th className="px-4 py-3">{t("expiry")}</th>
                    <th className="px-4 py-3">{t("samplePrice")} (₹)</th>
                    <th className="px-4 py-3">{t("volume")}</th>
                    <th className="px-4 py-3">{t("openInterest")}</th>
                    <th className="px-4 py-3">{t("spread")}</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContracts.map((contract) => (
                    <tr
                      key={contract.symbol}
                      className="border-t border-white/10 hover:bg-blue-400/5"
                    >
                      <td className="px-4 py-4 font-semibold text-blue-200">
                        {contract.symbol}
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {contract.expiry}
                      </td>
                      <td className="px-4 py-4">
                        {contract.price.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-4">
                        {contract.volume.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-4">
                        {contract.openInterest.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-4">
                        {contract.spread.toFixed(2)}%
                      </td>
                    </tr>
                  ))}

                  {filteredContracts.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-slate-400"
                      >
                        No matching contracts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Illustrative figures for interface demonstration only.
              Contract expiry dates, prices, volume, open interest and
              spreads must be populated from validated MCX data before
              being used for real analysis.
            </p>
          </section>
        )}
        

{profession === "trader" && (
  <section className="mt-8 rounded-2xl border border-purple-400/20 bg-slate-900/80 p-5 sm:p-7">
    <p className="text-sm uppercase tracking-wider text-purple-300">
      {t("riskAnalytics")}
    </p>

    <h2 className="mt-2 text-2xl font-bold">
      {t("marginSimulatorTitle")}
    </h2>

    <p className="mt-2 text-sm text-slate-400">
      Test how a hypothetical market fall could affect your position.
    </p>

    <MarginSimulator />
  </section>
)}
{profession === "trader" && (
          <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-5 sm:p-7">
            <p className="text-sm uppercase tracking-wider text-cyan-300">
              {t("liquidity")}
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {t("liquidityScanner")}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Compare sample contract volume and open interest to identify
              contracts that may need a liquidity review.
            </p>

            <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Contract</th>
                    <th className="px-4 py-3">Volume</th>
                    <th className="px-4 py-3">Open interest</th>
                    <th className="px-4 py-3">Volume / OI</th>
                    <th className="px-4 py-3">Signal</th>
                  </tr>
                </thead>

                <tbody>
                  {sampleContracts.map((contract) => {
                    const ratio =
                      contract.openInterest > 0
                        ? (contract.volume / contract.openInterest) * 100
                        : 0;

                    const lowActivity = contract.volume < 800;

                    return (
                      <tr
                        key={contract.symbol}
                        className="border-t border-white/10"
                      >
                        <td className="px-4 py-4 font-semibold text-cyan-200">
                          {contract.symbol}
                        </td>
                        <td className="px-4 py-4">
                          {contract.volume.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-4">
                          {contract.openInterest.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-4">{ratio.toFixed(1)}%</td>
                        <td className="px-4 py-4">
                          <span
                            className={
                              lowActivity
                                ? "rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300"
                                : "rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300"
                            }
                          >
                            {lowActivity
                              ? "Review liquidity"
                              : "Sample activity"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Demonstration only. The figures and threshold are illustrative,
              not real MCX market data or validated liquidity signals.
            </p>
          </section>
        )}
        {profession === "retailer" && (
  <section className="mt-10 space-y-6">
    <div className="rounded-2xl border border-emerald-400/20 bg-slate-900/80 p-5 sm:p-7">
      <p className="text-sm uppercase tracking-wider text-emerald-300">
        {t("retailerWorkspace")}
      </p>
      <h2 className="mt-2 text-2xl font-bold">{t("inventoryOverview")}</h2>
      <p className="mt-2 text-sm text-slate-400">
        Monitor sample commodity stock and identify items that may need
        replenishment.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Products listed</p>
          <p className="mt-2 text-2xl font-bold">4</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Low-stock items</p>
          <p className="mt-2 text-2xl font-bold text-amber-300">1</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Sample sales today</p>
          <p className="mt-2 text-2xl font-bold">₹18,500</p>
        </div>
      </div>
    </div>

    <RetailerInventory />
  </section>
)}
{profession === "wholesaler" && (
  <section className="mt-10 space-y-6">
    <div className="rounded-2xl border border-violet-400/20 bg-slate-900/80 p-5 sm:p-7">
      <p className="text-sm uppercase tracking-wider text-violet-300">
        {t("wholesalerWorkspace")}
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        {t("bulkCommodityOverview")}
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Review sample bulk stock, supplier orders and delivery status.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Active orders</p>
          <p className="mt-2 text-2xl font-bold">12</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Pending deliveries</p>
          <p className="mt-2 text-2xl font-bold text-amber-300">3</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Sample bulk volume</p>
          <p className="mt-2 text-2xl font-bold">850 kg</p>
        </div>
      </div>
    </div>

    
  </section>
)}

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.cards.map(([title, description]) => {
            const isActive = activeCard === title;

            return (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-blue-400/50"
              >
                <button
                  type="button"
                  aria-expanded={isActive}
                  onClick={() =>
                    setActiveCard(isActive ? null : title)
                  }
                  className="w-full text-left"
                >
                  <h2 className="text-lg font-semibold">
                    {t(title as TranslationKey)}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {t(description as TranslationKey)}
                  </p>

                  <span className="mt-5 inline-block text-sm font-medium text-blue-300">
                    {isActive ? "Close details ↑" : "Explore feature →"}
                  </span>
                </button>

                {isActive && (
                  <div className="mt-5 rounded-xl border border-blue-400/20 bg-slate-950/80 p-4">
                    <p className="text-sm leading-6 text-slate-300">
                      {t(featureDetails[title])}
                    </p>
                    <p className="mt-3 text-xs text-slate-500">
                      {t("frontendDemonstration")}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <p className="mt-8 text-sm text-slate-500">
          {t("dashboardNote")}
        </p>
      </div>
    </main>
  );
}
function MarginSimulator() {
  const [positionValue, setPositionValue] = useState("100000");
  const [shock, setShock] = useState(5);

  const value = Math.max(0, Number(positionValue) || 0);
  const loss = (value * shock) / 100;
  const remainingValue = value - loss;

  return (
    <div className="mt-6 space-y-5">
      <div>
        <label
          htmlFor="positionValue"
          className="mb-2 block text-sm text-slate-300"
        >
          Position value (₹)
        </label>

        <input
          id="positionValue"
          type="number"
          min="0"
          value={positionValue}
          onChange={(event) => setPositionValue(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-purple-400"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="marketShock" className="text-sm text-slate-300">
            Hypothetical market fall
          </label>
          <span className="font-semibold text-purple-300">{shock}%</span>
        </div>

        <input
          id="marketShock"
          type="range"
          min="0"
          max="30"
          step="1"
          value={shock}
          onChange={(event) => setShock(Number(event.target.value))}
          className="w-full accent-purple-400"
        />

        <div className="flex justify-between text-xs text-slate-500">
          <span>0%</span>
          <span>15%</span>
          <span>30%</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Position value</p>
          <p className="mt-2 text-xl font-bold">
            ₹{value.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-4">
          <p className="text-sm text-slate-400">Estimated Loss</p>
          <p className="mt-2 text-xl font-bold text-red-300">
            ₹{loss.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
          <p className="text-sm text-slate-400">Remaining value</p>
          <p className="mt-2 text-xl font-bold text-emerald-300">
            ₹{remainingValue.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <p className="text-xs leading-5 text-slate-500">
        Demonstration only. This estimates a simple percentage loss; it
        does not calculate official MCX or broker margin requirements.
        Actual risk depends on contract specifications, leverage,
        volatility and applicable margin rules.
      </p>
    </div>
  );
}
function RetailerInventory() {
  const [search, setSearch] = useState("");

  const products = [
    { name: "Gold", stock: 24, unit: "units" },
    { name: "Silver", stock: 42, unit: "units" },
    { name: "Gold Coins", stock: 6, unit: "pieces" },
    { name: "Silver Bars", stock: 18, unit: "pieces" },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 sm:p-7">
      <h2 className="text-xl font-bold">Stock Management</h2>
      <p className="mt-2 text-sm text-slate-400">
        Search products and review their sample stock levels.
      </p>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search products..."
        aria-label="Search inventory products"
        className="mt-5 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-400"
      />

      <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="bg-slate-950 text-slate-400">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const lowStock = product.stock < 10;

              return (
                <tr
                  key={product.name}
                  className="border-t border-white/10"
                >
                  <td className="px-4 py-4 font-medium">
                    {product.name}
                  </td>
                  <td className="px-4 py-4">
                    {product.stock} {product.unit}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={
                        lowStock
                          ? "rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300"
                          : "rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300"
                      }
                    >
                      {lowStock ? "Low stock" : "In stock"}
                    </span>
                  </td>
                </tr>
              );
            })}

            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-slate-400"
                >
                  No matching products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        All inventory and sales figures shown are illustrative demo data.
      </p>
    </div>
  );
}
