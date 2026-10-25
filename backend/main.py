from datetime import datetime
from io import StringIO
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="EXIDO MCX Backend",
    description="Prototype API for commodity CSV processing and liquidity analysis",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://exido-commodity-hub.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Illustrative data only. This is not a live MCX feed.
SAMPLE_CONTRACTS = [
    {
        "symbol": "GOLDM",
        "expiry": "2026-12-05",
        "volume": 1250,
        "open_interest": 840,
        "price": 128500.0,
    },
    {
        "symbol": "GOLDTEN",
        "expiry": "2026-12-05",
        "volume": 85,
        "open_interest": 120,
        "price": 128520.0,
    },
]

# Demonstration threshold, not an official MCX rule.
LOW_VOLUME_THRESHOLD = 100


def normalize_date(value):
    """Convert supported date formats into YYYY-MM-DD."""
    if pd.isna(value) or not str(value).strip():
        return None

    value = str(value).strip()

    for date_format in (
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%d-%m-%Y",
    ):
        try:
            return datetime.strptime(value, date_format).date().isoformat()
        except ValueError:
            continue

    return None


def clean_contracts(dataframe):
    """Clean column names, symbols, dates and numeric market fields."""
    dataframe.columns = [
        str(column).strip().lower().replace(" ", "_")
        for column in dataframe.columns
    ]

    required = {"symbol", "expiry", "volume", "open_interest", "price"}
    missing = required - set(dataframe.columns)

    if missing:
        raise ValueError(
            "Missing required CSV columns: " + ", ".join(sorted(missing))
        )

    dataframe["symbol"] = (
        dataframe["symbol"].astype("string").str.strip().str.upper()
    )
    dataframe["expiry"] = dataframe["expiry"].apply(normalize_date)

    for column in ("volume", "open_interest", "price"):
        dataframe[column] = pd.to_numeric(
            dataframe[column], errors="coerce"
        )

    dataframe = dataframe.dropna(
        subset=["symbol", "expiry", "volume", "open_interest", "price"]
    )

    dataframe = dataframe[dataframe["symbol"] != ""]

    if (dataframe[["volume", "open_interest", "price"]] < 0).any().any():
        raise ValueError("Volume, open interest and price cannot be negative.")

    return dataframe


def analyze_liquidity(dataframe):
    """Flag contracts below the illustrative minimum-volume threshold."""
    results = []

    for _, row in dataframe.iterrows():
        volume = int(row["volume"])
        open_interest = int(row["open_interest"])

        results.append(
            {
                "symbol": str(row["symbol"]),
                "expiry": str(row["expiry"]),
                "volume": volume,
                "open_interest": open_interest,
                "price": float(row["price"]),
                "low_liquidity": volume < LOW_VOLUME_THRESHOLD,
                "threshold_used": LOW_VOLUME_THRESHOLD,
            }
        )

    return results
def analyze_risk(dataframe):
    """Calculate illustrative price movement and margin cushion scenarios."""
    results = []

    for _, row in dataframe.iterrows():
        price = float(row["price"])

        # Hypothetical 1%, 3%, and 5% adverse price movements.
        scenarios = []

        for shock_percent in (1, 3, 5):
            estimated_loss = round(price * shock_percent / 100, 2)

            scenarios.append(
                {
                    "shock_percent": shock_percent,
                    "estimated_loss_per_unit": estimated_loss,
                    "price_after_downward_shock": round(
                        price - estimated_loss, 2
                    ),
                }
            )

        results.append(
            {
                "symbol": str(row["symbol"]),
                "expiry": str(row["expiry"]),
                "reference_price": price,
                "scenarios": scenarios,
                "note": (
                    "Illustrative stress test only; not an official "
                    "MCX margin requirement or trading recommendation."
                ),
            }
        )

    return results


@app.get("/")
def home():
    return {
        "project": "EXIDO Commodity Intelligence Hub",
        "module": "MCX Backend",
        "status": "running",
        "data_source": "prototype sample data",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/mcx/contracts")
def get_contracts():
    return {
        "source": "prototype_sample",
        "contracts": SAMPLE_CONTRACTS,
    }


@app.post("/api/mcx/analyze-csv")
async def analyze_csv(file: UploadFile = File(...)):
    """Upload a CSV containing symbol, expiry, volume, open_interest and price."""
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a .csv file.",
        )

    try:
        contents = await file.read()

        if not contents:
            raise HTTPException(status_code=400, detail="The CSV file is empty.")

        try:
            csv_text = contents.decode("utf-8-sig")
        except UnicodeDecodeError:
            csv_text = contents.decode("latin-1")

        dataframe = pd.read_csv(StringIO(csv_text))

        if dataframe.empty:
            raise HTTPException(
                status_code=400,
                detail="The CSV contains no data rows.",
            )

        cleaned = clean_contracts(dataframe)

        if cleaned.empty:
            raise HTTPException(
                status_code=400,
                detail="No valid contract rows were found in the CSV.",
            )

        return {
            "source": "uploaded_csv",
            "rows_received": len(dataframe),
            "rows_processed": len(cleaned),
            "rows_skipped": len(dataframe) - len(cleaned),
            "liquidity_threshold": LOW_VOLUME_THRESHOLD,
            "contracts": analyze_liquidity(cleaned),
        }

    except HTTPException:
        raise
    except (ValueError, pd.errors.ParserError) as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Could not process the CSV file.",
        ) from error

@app.post("/api/mcx/risk-analysis")
async def risk_analysis(file: UploadFile = File(...)):
    """Upload a CSV and return illustrative margin stress-test scenarios."""
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a .csv file.",
        )

    try:
        contents = await file.read()

        if not contents:
            raise HTTPException(status_code=400, detail="The CSV file is empty.")

        try:
            csv_text = contents.decode("utf-8-sig")
        except UnicodeDecodeError:
            csv_text = contents.decode("latin-1")

        dataframe = pd.read_csv(StringIO(csv_text))

        if dataframe.empty:
            raise HTTPException(
                status_code=400,
                detail="The CSV contains no data rows.",
            )

        cleaned = clean_contracts(dataframe)

        if cleaned.empty:
            raise HTTPException(
                status_code=400,
                detail="No valid contract rows were found in the CSV.",
            )

        return {
            "source": "uploaded_csv",
            "contracts_analyzed": len(cleaned),
            "risk_analysis": analyze_risk(cleaned),
        }

    except HTTPException:
        raise
    except (ValueError, pd.errors.ParserError) as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Could not process the CSV file.",
        ) from error
@app.get("/api/mcx/liquidity")
def get_real_mcx_liquidity():
    data_folder = Path(__file__).parent / "data"
    files = list(data_folder.glob("*.csv"))

    if not files:
        return {
            "source": "official_mcx_csv",
            "contracts": [],
            "message": "No MCX CSV files found."
        }

    all_rows = []

    for file in files:
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.strip()

            required = ["Symbol", "Expiry Date", "Close"]
            if not all(column in df.columns for column in required):
                continue

            volume_col = next(
                (c for c in [
                    "Volume(Lots)", "Volume (Lots)",
                    "Volume(In Lots)", "Volume"
                ] if c in df.columns),
                None,
            )

            oi_col = next(
                (c for c in [
                    "Open Interest(Lots)", "Open Interest (Lots)",
                    "Open Interest", "OpenInterest"
                ] if c in df.columns),
                None,
            )

            if volume_col is None:
                continue

            df["Symbol"] = df["Symbol"].astype(str).str.strip().str.upper()
            df["Close"] = pd.to_numeric(df["Close"], errors="coerce")
            df["volume"] = pd.to_numeric(df[volume_col], errors="coerce")
            df["open_interest"] = (
                pd.to_numeric(df[oi_col], errors="coerce")
                if oi_col else None
            )

            df = df.dropna(subset=["Close", "volume"])

            for _, row in df.iterrows():
                volume = int(row["volume"])
                oi = (
                    int(row["open_interest"])
                    if oi_col and pd.notna(row["open_interest"])
                    else None
                )

                all_rows.append({
                    "symbol": row["Symbol"],
                    "expiry": str(row["Expiry Date"]).strip(),
                    "price": float(row["Close"]),
                    "volume": volume,
                    "open_interest": oi,
                    "low_liquidity": volume < LOW_VOLUME_THRESHOLD,
                    "threshold_used": LOW_VOLUME_THRESHOLD,
                    "source_file": file.name,
                    "note": (
                        "100-lot threshold is a prototype screening rule, "
                        "not an official MCX liquidity standard."
                    ),
                })

        except Exception as error:
            print(f"Could not process {file.name}: {error}")

    return {
        "source": "official_mcx_csv",
        "files_read": len(files),
        "contracts_analyzed": len(all_rows),
        "liquidity_threshold": LOW_VOLUME_THRESHOLD,
        "contracts": all_rows,
    }
@app.get("/api/mcx/real-data")
def get_real_mcx_data():
    data_folder = Path(__file__).parent / "data"
    files = list(data_folder.glob("*.csv"))

    if not files:
        return {"error": "No MCX CSV files found in backend/data"}

    all_data = []

    for file in files:
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.strip()

            required = ["Date", "Symbol", "Expiry Date", "Close"]
            if not all(col in df.columns for col in required):
                continue

            df["Symbol"] = (
                df["Symbol"].astype(str).str.strip().str.upper()
            )
            df["Close"] = pd.to_numeric(df["Close"], errors="coerce")

            # MCX column names can vary slightly by file.
            volume_col = next(
                (c for c in ["Volume(Lots)", "Volume (Lots)",
                             "Volume(In Lots)", "Volume"]
                 if c in df.columns),
                None,
            )
            oi_col = next(
                (c for c in ["Open Interest(Lots)",
                             "Open Interest (Lots)",
                             "Open Interest", "OpenInterest"]
                 if c in df.columns),
                None,
            )

            df["volume"] = (
                pd.to_numeric(df[volume_col], errors="coerce")
                if volume_col else None
            )
            df["open_interest"] = (
                pd.to_numeric(df[oi_col], errors="coerce")
                if oi_col else None
            )

            df["source_file"] = file.name
            df = df.dropna(subset=["Close"])

            all_data.append(
                df[[
                    "Date", "Symbol", "Expiry Date", "Close",
                    "volume", "open_interest", "source_file"
                ]]
            )

        except Exception as error:
            print(f"Could not process {file.name}: {error}")

    if not all_data:
        return {
            "error": "Could not read valid MCX rows. Check CSV column names."
        }

    combined = pd.concat(all_data, ignore_index=True)

    return {
        "source": "Official MCX CSV files downloaded for this prototype",
        "files_read": len(files),
        "rows_loaded": len(combined),
        "contracts": combined.where(
            pd.notna(combined), None
        ).to_dict(orient="records"),
    }
@app.get("/api/mcx/relative-value")
def get_relative_value():
    data_folder = Path(__file__).parent / "data"
    files = list(data_folder.glob("*.csv"))

    if not files:
        return {"error": "No MCX CSV files found in backend/data"}

    purity = {
        "GOLDM": 0.995,
        "GOLDTEN": 0.999,
        "GOLDGUINEA": 0.999,
        "GOLDPETAL": 0.999,
    }

    quoted_per_gram = {
        "GOLDM": 10,
        "GOLDTEN": 10,
        "GOLDGUINEA": 8,
        "GOLDPETAL": 1,
    }

    frames = []

    for file in files:
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.strip()

            required = ["Date", "Symbol", "Expiry Date", "Close"]
            if not all(col in df.columns for col in required):
                continue

            df["Symbol"] = df["Symbol"].astype(str).str.strip().str.upper()
            df = df[df["Symbol"].isin(purity.keys())].copy()

            df["Close"] = pd.to_numeric(df["Close"], errors="coerce")
            df["Expiry Date"] = df["Expiry Date"].astype(str).str.strip()
            df["Date"] = pd.to_datetime(
                df["Date"], format="%d %b %Y", errors="coerce"
            )

            df = df.dropna(subset=["Date", "Close"])

            df["normalized_price_per_pure_gram"] = df.apply(
                lambda row: row["Close"]
                / quoted_per_gram[row["Symbol"]]
                / purity[row["Symbol"]],
                axis=1,
            )

            frames.append(
                df[
                    [
                        "Date",
                        "Symbol",
                        "Expiry Date",
                        "Close",
                        "normalized_price_per_pure_gram",
                    ]
                ]
            )

        except Exception:
            continue

    if not frames:
        return {
            "error": "Could not process the MCX CSV files. Check their column names."
        }

    combined = pd.concat(frames, ignore_index=True)

    # Compare contracts on the same trading date.
    # Expiry differences are retained and shown, not hidden.
    combined["Date"] = combined["Date"].dt.strftime("%Y-%m-%d")

    results = []
    for date, group in combined.groupby("Date"):
        rows = group.to_dict(orient="records")

        if len(group["Symbol"].unique()) < 2:
            continue

        prices = group["normalized_price_per_pure_gram"]
        reference = prices.mean()

        for row in rows:
            normalized = row["normalized_price_per_pure_gram"]
            results.append({
                "date": date,
                "symbol": row["Symbol"],
                "expiry_date": row["Expiry Date"],
                "close": round(float(row["Close"]), 2),
                "normalized_price_per_pure_gram": round(
                    float(normalized), 2
                ),
                "difference_from_daily_average_percent": round(
                    float((normalized / reference - 1) * 100), 3
                ),
                "comparison_note": (
                    "Indicative only: contract expiries differ; "
                    "not an arbitrage or trading recommendation."
                ),
            })

    return {
        "source": "Uploaded MCX CSV files",
        "rows_compared": len(results),
        "method": "Close price adjusted for quoted unit and stated purity",
        "results": results,
    }
@app.get("/api/mcx/validation")
def validate_relative_value():
    response = get_relative_value()

    if "error" in response:
        return response

    results = response["results"]

    if not results:
        return {
            "source": response["source"],
            "message": "Not enough overlapping data to validate.",
            "dates_analyzed": 0,
            "observations": 0,
        }

    df = pd.DataFrame(results)

    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["difference_from_daily_average_percent"] = pd.to_numeric(
        df["difference_from_daily_average_percent"],
        errors="coerce",
    )
    df = df.dropna(
        subset=["date", "difference_from_daily_average_percent"]
    )

    if df.empty:
        return {
            "message": "No valid observations available for validation.",
            "dates_analyzed": 0,
            "observations": 0,
        }

    daily = df.groupby("date").agg(
        contracts=("symbol", "nunique"),
        mean_absolute_difference=(
            "difference_from_daily_average_percent",
            lambda values: values.abs().mean(),
        ),
    )

    return {
        "source": response["source"],
        "method": (
            "Descriptive historical analysis of normalized closing-price "
            "differences from the same-day average."
        ),
        "dates_analyzed": int(len(daily)),
        "observations": int(len(df)),
        "average_absolute_difference_percent": round(
            float(daily["mean_absolute_difference"].mean()), 3
        ),
        "dates_with_multiple_contracts": int(
            (daily["contracts"] >= 2).sum()
        ),
        "caveat": (
            "Descriptive analysis only, not a backtest or evidence of "
            "profitability. Different expiries, transaction costs, "
            "liquidity and executable prices are not accounted for."
        ),
    }
@app.get("/api/mcx/backtest")
def backtest_relative_value():
    response = get_relative_value()

    if "error" in response:
        return response

    if not response.get("results"):
        return {
            "message": "No historical data available for backtesting.",
            "trades": 0,
        }

    df = pd.DataFrame(response["results"])

    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["normalized_price_per_pure_gram"] = pd.to_numeric(
        df["normalized_price_per_pure_gram"], errors="coerce"
    )
    df["difference_from_daily_average_percent"] = pd.to_numeric(
        df["difference_from_daily_average_percent"], errors="coerce"
    )

    df = df.dropna(
        subset=[
            "date",
            "normalized_price_per_pure_gram",
            "difference_from_daily_average_percent",
        ]
    )

    df = df.drop_duplicates(
        subset=["date", "symbol", "expiry_date"]
    ).sort_values("date")

    dates = sorted(df["date"].unique())
    trades = []

    # Illustrative assumption: 0.10% cost per transaction,
    # for entry and exit of both legs = 0.40% per completed pair.
    round_trip_cost_percent = 0.40

    for i in range(len(dates) - 1):
        current_date = dates[i]
        next_date = dates[i + 1]

        current = df[df["date"] == current_date]
        following = df[df["date"] == next_date]

        if len(current) < 2:
            continue

        # Signal uses only information available on the current date.
        cheapest = current.loc[
            current["difference_from_daily_average_percent"].idxmin()
        ]
        expensive = current.loc[
            current["difference_from_daily_average_percent"].idxmax()
        ]

        if cheapest["symbol"] == expensive["symbol"] and (
            cheapest["expiry_date"] == expensive["expiry_date"]
        ):
            continue

        def find_next(row):
            match = following[
                (following["symbol"] == row["symbol"])
                & (following["expiry_date"] == row["expiry_date"])
            ]
            return match.iloc[0] if not match.empty else None

        next_long = find_next(cheapest)
        next_short = find_next(expensive)

        if next_long is None or next_short is None:
            continue

        long_return = (
            next_long["normalized_price_per_pure_gram"]
            / cheapest["normalized_price_per_pure_gram"] - 1
        ) * 100

        short_return = (
            next_short["normalized_price_per_pure_gram"]
            / expensive["normalized_price_per_pure_gram"] - 1
        ) * 100

        gross_return = long_return - short_return
        net_return = gross_return - round_trip_cost_percent

        trades.append({
            "signal_date": current_date.strftime("%Y-%m-%d"),
            "evaluation_date": next_date.strftime("%Y-%m-%d"),
            "long_contract": cheapest["symbol"],
            "long_expiry": cheapest["expiry_date"],
            "short_contract": expensive["symbol"],
            "short_expiry": expensive["expiry_date"],
            "long_return_percent": round(float(long_return), 3),
            "short_return_percent": round(float(short_return), 3),
            "gross_pair_return_percent": round(float(gross_return), 3),
            "estimated_cost_percent": round(
                round_trip_cost_percent, 3
            ),
            "net_pair_return_percent": round(float(net_return), 3),
        })

    if not trades:
        return {
            "source": response["source"],
            "trades": 0,
            "message": "No valid consecutive-date pairs were available.",
        }

    results = pd.DataFrame(trades)
    net_returns = results["net_pair_return_percent"]

    cumulative_net = (
        (1 + net_returns / 100).prod() - 1
    ) * 100

    return {
        "source": response["source"],
        "method": (
            "Preliminary next-trading-date long-short relative-value "
            "simulation using the previous date's relative differences."
        ),
        "trades": len(trades),
        "assumed_round_trip_cost_percent": round_trip_cost_percent,
        "average_gross_pair_return_percent": round(
            float(results["gross_pair_return_percent"].mean()), 3
        ),
        "average_net_pair_return_percent": round(
            float(net_returns.mean()), 3
        ),
        "cumulative_net_pair_return_percent": round(
            float(cumulative_net), 3
        ),
        "results": trades,
        "caveat": (
            "Preliminary simulation, not evidence of profitability. "
            "Costs are illustrative assumptions, not verified MCX costs. "
            "Different expiries, execution prices, slippage, liquidity, "
            "short-position feasibility and underlying gold exposure "
            "limit interpretation. No actual fills are simulated."
        ),
    }