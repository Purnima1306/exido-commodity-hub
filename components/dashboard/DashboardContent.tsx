

"use client";

import { useEffect, useState } from "react";
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
  marketOverview: "marketOverviewDesc",
  goldAnalysis: "goldAnalysisDesc",
  aiMarketInsights: "aiMarketInsightsDesc",
  inventory: "inventoryDesc",
  salesOverview: "salesOverviewDesc",
  aiBusinessAssistant: "aiBusinessAssistantDesc",
  bulkCommodities: "bulkCommodities",
  ordersSuppliers: "ordersSuppliers",
};

type Contract = {
  symbol: string;
  expiry: string;
  price: number;
  volume: number;
  openInterest: number;
  spread: number;
};

const sampleContracts: Contract[] = [
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
  const [csvFile, setCsvFile] = useState<File | null>(null);
const [csvResult, setCsvResult] = useState<any>(null);
const [riskResult, setRiskResult] = useState<any>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [relativeValue, setRelativeValue] = useState<any[]>([]);
  const [liquidityData, setLiquidityData] = useState<any[]>([]);
  const [validationData, setValidationData] = useState<any>(null);
  const [backtestData, setBacktestData] = useState<any>(null);

useEffect(() => {
  async function loadContracts() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/mcx/liquidity"
      );

      if (!response.ok) {
        throw new Error("Could not load real MCX liquidity data");
      }

      const result = await response.json();

      setContracts(
        (result.contracts ?? []).map(
          (item: {
            symbol: string;
            expiry: string;
            price: number;
            volume: number;
            open_interest: number | null;
            low_liquidity: boolean;
          }): Contract => ({
            symbol: item.symbol,
            expiry: item.expiry,
            price: item.price,
            volume: item.volume,
            openInterest: item.open_interest ?? 0,
            spread: 0,
          })
        )
      );
    } catch (error) {
      console.error("EXIDO real MCX liquidity connection failed:", error);
    }
  }

  loadContracts();
}, []);
useEffect(() => {
  async function loadValidation() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/mcx/validation"
      );

      if (!response.ok) {
        throw new Error("Could not load historical validation");
      }

      const result = await response.json();
      setValidationData(result);
    } catch (error) {
      console.error("Historical validation error:", error);
    }
  }

  loadValidation();
}, []);
useEffect(() => {
  async function loadBacktest() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/mcx/backtest"
      );

      if (!response.ok) {
        throw new Error("Could not load backtest results");
      }

      const result = await response.json();
      setBacktestData(result);
    } catch (error) {
      console.error("Backtest loading error:", error);
    }
  }

  loadBacktest();
}, []);


      
useEffect(() => {
  async function loadRelativeValue() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/mcx/relative-value"
      );

      if (!response.ok) {
        throw new Error("Could not load MCX relative-value data");
      }

      const result = await response.json();
      setRelativeValue(result.results ?? []);
    } catch (error) {
      console.error("MCX relative-value fetch failed:", error);
    }
  }

  loadRelativeValue();
}, []);
useEffect(() => {
  async function loadLiquidityData() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/mcx/liquidity"
      );

      if (!response.ok) {
        throw new Error("Could not load liquidity data");
      }

      const result = await response.json();
      setLiquidityData(result.contracts ?? []);
    } catch (error) {
      console.error("Liquidity data error:", error);
    }
  }

  loadLiquidityData();
}, []);

  const data = dashboardContent[profession];

  const filteredContracts = contracts
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
                        {contract.spread === 0 ? "N/A" : `${contract.spread.toFixed(2)}%`}
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
  <section className="mt-8 rounded-2xl border border-blue-400/20 bg-slate-900/80 p-5 sm:p-7">
    <h2 className="text-2xl font-bold">
      MCX Relative Value Analysis
    </h2>

    <p className="mt-2 text-sm text-slate-400">
      Historical settlement prices normalized approximately per gram
      of pure gold.
    </p>

    <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-slate-950 text-slate-400">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Contract</th>
            <th className="px-4 py-3">Expiry</th>
            <th className="px-4 py-3">Normalized ₹/gram</th>
            <th className="px-4 py-3">Difference (%)</th>
          </tr>
        </thead>
        <tbody>
          {relativeValue.slice(-20).map((item, index) => (
            <tr
              key={`${item.date}-${item.symbol}-${index}`}
              className="border-t border-white/10"
            >
              <td className="px-4 py-3">{item.date}</td>
              <td className="px-4 py-3 font-semibold text-blue-200">
                {item.symbol}
              </td>
              <td className="px-4 py-3">{item.expiry_date}</td>
              <td className="px-4 py-3">
                ₹{Number(item.normalized_price_per_pure_gram).toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3">
                {Number(item.difference_from_daily_average_percent).toFixed(3)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <p className="mt-4 text-xs leading-5 text-amber-200">
      Indicative comparison only. Contract expiry dates differ, so these
      values do not establish an arbitrage opportunity or trading recommendation.
    </p>
  </section>
)}
{validationData && (
  <section className="mt-6 rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-5 sm:p-7">
    <p className="text-sm uppercase tracking-wider text-cyan-300">
      Historical Analysis
    </p>

    <h2 className="mt-2 text-2xl font-bold text-white">
      Relative-Value Validation
    </h2>

    <p className="mt-2 text-sm text-slate-400">
      Descriptive analysis of normalized closing-price differences
      across the available MCX contracts.
    </p>

    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
        <p className="text-sm text-slate-400">Dates analyzed</p>
        <p className="mt-2 text-2xl font-bold text-white">
          {validationData.dates_analyzed ?? "—"}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
        <p className="text-sm text-slate-400">Observations</p>
        <p className="mt-2 text-2xl font-bold text-white">
          {validationData.observations ?? "—"}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
        <p className="text-sm text-slate-400">Average absolute difference</p>
        <p className="mt-2 text-2xl font-bold text-cyan-300">
          {validationData.average_absolute_difference_percent != null
            ? `${validationData.average_absolute_difference_percent}%`
            : "—"}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
        <p className="text-sm text-slate-400">Dates with multiple contracts</p>
        <p className="mt-2 text-2xl font-bold text-white">
          {validationData.dates_with_multiple_contracts ?? "—"}
        </p>
      </div>
    </div>

    <p className="mt-4 text-xs leading-5 text-amber-200">
      Descriptive analysis only, not a backtest or evidence of profitability.
      Contract expiries differ, and transaction costs, liquidity and
      executable prices are not accounted for.
    </p>
  </section>
)}
{backtestData && (
  <section className="mt-6 rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-5 sm:p-7">
    <p className="text-sm uppercase tracking-wider text-cyan-300">
      Strategy Evaluation
    </p>

    <h2 className="mt-2 text-2xl font-bold text-white">
      Historical Relative-Value Backtest
    </h2>

    <p className="mt-2 text-sm text-slate-400">
      Preliminary next-trading-date simulation using historical MCX prices.
    </p>

    {backtestData.trades > 0 ? (
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Completed trades</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {backtestData.trades}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Average gross return</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {backtestData.average_gross_pair_return_percent}%
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Average net return</p>
          <p className="mt-2 text-2xl font-bold text-rose-400">
            {backtestData.average_net_pair_return_percent}%
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Cumulative net return</p>
          <p className="mt-2 text-2xl font-bold text-rose-400">
            {backtestData.cumulative_net_pair_return_percent}%
          </p>
        </div>
      </div>
    ) : (
      <p className="mt-4 text-sm text-amber-200">
        {backtestData.message ?? "No completed trades available."}
      </p>
    )}

    <p className="mt-4 text-xs leading-5 text-amber-200">
      Assumed round-trip cost: {backtestData.assumed_round_trip_cost_percent}%.
      Preliminary simulation only. Costs are illustrative; different
      expiries, execution prices, slippage, liquidity and underlying
      gold-price exposure limit interpretation. Results do not establish
      profitability.
    </p>
  </section>
)}
{liquidityData.length > 0 && (
  <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
    <h2 className="text-xl font-semibold text-white">
      MCX Contract Liquidity Analysis
    </h2>

    <p className="mt-2 text-sm text-gray-400">
      Based on your downloaded MCX Bhavcopy CSV files.
    </p>

    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-300">
        <thead>
          <tr className="border-b border-white/10 text-gray-400">
            <th className="px-4 py-3">Contract</th>
            <th className="px-4 py-3">Expiry</th>
            <th className="px-4 py-3">Close Price</th>
            <th className="px-4 py-3">Volume (Lots)</th>
            <th className="px-4 py-3">Open Interest</th>
            <th className="px-4 py-3">Liquidity Screen</th>
          </tr>
        </thead>

        <tbody>
          {liquidityData.slice(-20).map((item, index) => (
            <tr
              key={`${item.symbol}-${item.expiry}-${index}`}
              className="border-t border-white/10"
            >
              <td className="px-4 py-3 font-semibold text-blue-200">
                {item.symbol}
              </td>
              <td className="px-4 py-3">{item.expiry}</td>
              <td className="px-4 py-3">
                ₹{Number(item.price).toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3">{item.volume}</td>
              <td className="px-4 py-3">
                {item.open_interest ?? "Unavailable"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    item.low_liquidity
                      ? "text-amber-300"
                      : "text-emerald-300"
                  }
                >
                  {item.low_liquidity ? "Low volume" : "Above threshold"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <p className="mt-4 text-xs leading-5 text-amber-200">
      Screening threshold: 100 lots. This is an illustrative prototype rule,
      not an official MCX liquidity standard. Volume alone does not measure
      market depth or guarantee executable liquidity.
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
    <div className="mt-6 rounded-xl border border-white/10 bg-slate-950 p-5">
  <h3 className="text-lg font-semibold">MCX Bhavcopy CSV Analysis</h3>
  <p className="mt-2 text-sm text-slate-400">
    Upload a CSV containing symbol, expiry, volume, open_interest, and price.
  </p>

  <input
    type="file"
    accept=".csv,text/csv"
    onChange={(event) => {
      setCsvFile(event.target.files?.[0] ?? null);
      setCsvResult(null);
    }}
    className="mt-4 block w-full text-sm text-slate-300"
  />

  <button
    type="button"
    disabled={!csvFile}
    onClick={async () => {
      if (!csvFile) return;

      const formData = new FormData();
      formData.append("file", csvFile);

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/mcx/analyze-csv",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.detail || "CSV analysis failed"
          );
        }

        setCsvResult(result);
      } catch (error) {
        setCsvResult({
          error:
            error instanceof Error
              ? error.message
              : "Could not connect to backend",
        });
      }
    }}
    className="mt-4 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
  >
    Analyze CSV
  </button>

  {csvResult && (
  <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
    {csvResult.error ? (
      <p className="p-4 text-sm text-red-300">{csvResult.error}</p>
    ) : (
      <>
        <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 text-sm">
          <p>Received: {csvResult.rows_received}</p>
          <p>Processed: {csvResult.rows_processed}</p>
          <p>Skipped: {csvResult.rows_skipped}</p>
        </div>

        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-slate-950 text-slate-400">
            <tr>
              <th className="p-3">Contract</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Volume</th>
              <th className="p-3">Open Interest</th>
              <th className="p-3">Price (₹)</th>
              <th className="p-3">Liquidity</th>
            </tr>
          </thead>
          <tbody>
            {(csvResult.contracts ?? []).map((item: {
              symbol: string;
              expiry: string;
              volume: number;
              open_interest: number;
              price: number;
              low_liquidity?: boolean;
            }) => (
              <tr key={item.symbol} className="border-t border-white/10">
                <td className="p-3">{item.symbol}</td>
                <td className="p-3">{item.expiry}</td>
                <td className="p-3">{item.volume}</td>
                <td className="p-3">{item.open_interest}</td>
                <td className="p-3">{item.price.toLocaleString("en-IN")}</td>
                <td className="p-3">
                  {item.low_liquidity ? "Review" : "Sample activity"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}
  </div>
)}
</div>
<button
  type="button"
  disabled={!csvFile}
  onClick={async () => {
    if (!csvFile) return;

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/mcx/risk-analysis",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Risk analysis failed");
      }

      setRiskResult(result);
    } catch (error) {
      setRiskResult({
        error: error instanceof Error
          ? error.message
          : "Could not connect to backend",
      });
    }
  }}
  className="mt-4 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
>
  Run Risk Analysis
</button>
{riskResult && (
  <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
    {riskResult.error ? (
      <p className="p-4 text-sm text-red-300">
        {riskResult.error}
      </p>
    ) : (
      <>
        <div className="border-b border-white/10 bg-slate-950 p-4">
          <h3 className="font-semibold text-white">
            Risk Analysis Results
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Contracts analyzed: {riskResult.contracts_analyzed}
          </p>
        </div>

        {(riskResult.risk_analysis ?? []).map(
          (contract: {
            symbol: string;
            expiry: string;
            reference_price: number;
            scenarios: {
              shock_percent: number;
              estimated_loss_per_unit: number;
              price_after_downward_shock: number;
            }[];
            note: string;
          }) => (
            <div
              key={contract.symbol}
              className="border-b border-white/10 p-4 last:border-b-0"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-white">
                    {contract.symbol}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Expiry: {contract.expiry}
                  </p>
                </div>

                <p className="text-sm text-slate-300">
                  Reference Price: ₹
                  {contract.reference_price.toLocaleString("en-IN")}
                </p>
              </div>

              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-3">Downward Shock</th>
                    <th className="p-3">Estimated Loss / Unit</th>
                    <th className="p-3">Price After Shock</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.scenarios.map((scenario) => (
                    <tr
                      key={scenario.shock_percent}
                      className="border-t border-white/10"
                    >
                      <td className="p-3">
                        {scenario.shock_percent}%
                      </td>
                      <td className="p-3 text-red-300">
                        ₹
                        {scenario.estimated_loss_per_unit.toLocaleString(
                          "en-IN",
                          { maximumFractionDigits: 2 }
                        )}
                      </td>
                      <td className="p-3 text-slate-200">
                        ₹
                        {scenario.price_after_downward_shock.toLocaleString(
                          "en-IN",
                          { maximumFractionDigits: 2 }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mt-3 text-xs text-amber-300">
                {contract.note}
              </p>
            </div>
          )
        )}
      </>
    )}
  </div>
)}
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
              Compare real MCX contract volume and open interest to flag
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
                  {contracts.map((contract) => {
                    const ratio =
                      contract.openInterest > 0
                        ? (contract.volume / contract.openInterest) * 100
                        : 0;

                    const lowActivity = contract.volume < 100;

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
              Based on downloaded MCX Bhavcopy data. The 100-lot threshold is
an illustrative screening rule, not an official MCX standard.
Volume alone does not establish market depth or executable liquidity.
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
