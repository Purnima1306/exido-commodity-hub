EXIDO — MCX Commodity Intelligence Backend

Overview

EXIDO is a hackathon prototype for analyzing Indian commodity futures data, focusing on MCX gold contracts. It processes official MCX Bhavcopy CSV files to explore price differences between contracts, identify potentially low-liquidity contracts, perform illustrative risk analysis, and evaluate a preliminary historical relative-value strategy.

The backend is built with FastAPI and provides REST API endpoints that connect market data and analytical results to the EXIDO dashboard.

Project purpose: Transform publicly available commodity-market data into useful analytical insights through a functional prototype.

Features

1. MCX Market Data Processing

- Reads downloaded MCX Bhavcopy CSV files.
- Extracts contract symbols, expiry dates, closing prices, trading volumes, and open interest.
- Cleans contract symbols and converts numeric fields for analysis.
- Returns processed market data through REST API endpoints.

2. Cross-Contract Relative-Value Analysis

- Analyzes GOLDM, GOLDTEN, GOLDGUINEA, and GOLDPETAL contracts when data is available.
- Normalizes prices to an approximate price per gram of pure gold using contract quotation and purity assumptions.
- Calculates percentage differences between each contract's normalized price and the same-day average.
- Displays relative-price differences to help identify contracts that appear relatively expensive or inexpensive.

Important: Contracts may have different expiry dates. Therefore, the calculated differences are indicative and do not establish arbitrage opportunities.

3. Liquidity Analysis

- Displays closing price, trading volume, and open interest.
- Identifies contracts below an illustrative volume threshold of 100 lots.
- Supports liquidity screening through the dashboard.

The threshold is a prototype screening assumption, not an official MCX liquidity standard. Trading volume alone does not establish market depth or executable liquidity.

4. Historical Relative-Value Validation

- Examines historical normalized-price differences.
- Reports the number of dates analyzed and observations.
- Calculates the average absolute difference from the same-day average.
- Counts dates with multiple contracts available for comparison.

This is descriptive historical analysis, not proof that a trading strategy is profitable.

5. Preliminary Historical Backtesting

- Uses relative-value differences from one trading date to select a relatively inexpensive contract and a relatively expensive contract.
- Evaluates their subsequent normalized-price movements using the next available trading date.
- Calculates gross pair return, estimated transaction costs, net pair return, and cumulative net return.
- Displays the preliminary backtest results on the dashboard.

The current prototype uses an illustrative round-trip cost assumption of 0.40% per completed pair. This is not a verified estimate of actual trading costs. Different expiries, execution prices, slippage, liquidity, short-position feasibility, and underlying gold-price exposure limit the interpretation of results.

The backtest is experimental and does not establish a profitable or executable trading strategy.

6. Illustrative Risk Analysis

- Accepts uploaded CSV files for analysis.
- Calculates hypothetical 1%, 3%, and 5% downward price-stress scenarios.
- Presents the results as illustrative risk scenarios.

These scenarios are not official MCX margin requirements or trading recommendations.

7. CSV Upload and Validation

- Accepts CSV uploads through the API.
- Checks and processes the expected contract fields.
- Cleans contract data and identifies potentially low-volume contracts.

8. Multilingual Dashboard Integration

The backend provides analytical data to the EXIDO dashboard. The frontend includes multilingual interface support, with four languages tested in the current prototype.

Technology Stack

- Python 3.11
- FastAPI
- Uvicorn
- Pandas
- REST APIs
- CSV-based market data processing
- Next.js frontend integration

Data Source

MCX Daily Bhavcopy:

https://www.mcxindia.com/market-data/bhavcopy

MCX Gold Contract Specifications:

https://www.mcxindia.com/products/bullion/gold

The prototype uses downloaded MCX CSV files. It does not currently claim to provide a continuously updated live market feed.

Project Structure

The backend directory contains the FastAPI application, market-data CSV files, and sample data.

backend/
├── main.py
├── data/
│   └── Downloaded MCX Bhavcopy CSV files
└── sample_mcx.csv

The "data/" directory contains the downloaded market-data files used by the analytical endpoints. Actual filenames may vary depending on the downloaded files.

Installation and Setup

Prerequisites

- Python 3.11
- Git
- A terminal or Visual Studio Code
- Downloaded MCX Bhavcopy CSV files for historical analysis

Step 1: Open the Backend Directory

Open a terminal in the project's "backend" directory.

Step 2: Install Dependencies

Run:

python -m pip install fastapi uvicorn pandas python-multipart

Step 3: Add MCX CSV Data

Place the downloaded MCX Bhavcopy CSV files inside:

backend/data/

The files should contain the relevant MCX contract information, including dates, symbols, expiry dates, closing prices, volume, and open interest.

Step 4: Start the Backend

Run:

python -m uvicorn main:app --reload

Keep the terminal running while using the application.

Step 5: Open the API Documentation

Open this URL in your browser:

http://127.0.0.1:8000/docs

The FastAPI documentation allows you to inspect endpoints, submit requests, upload CSV files, and view JSON responses.

Step 6: Run the Dashboard

Open a separate terminal in the frontend project directory and run:

npm install
npm run dev

If using Windows PowerShell and "npm" does not work as expected, use:

npm.cmd install
npm.cmd run dev

Open the local URL printed by Next.js in your terminal. Ensure the backend is running so the dashboard can retrieve its analytical data.

API Endpoints

Method| Endpoint| Purpose
GET| "/"| Backend status
GET| "/health"| Health check
GET| "/api/mcx/contracts"| Illustrative sample contracts
POST| "/api/mcx/analyze-csv"| Upload a CSV for data processing and liquidity analysis
POST| "/api/mcx/risk-analysis"| Calculate illustrative price-stress scenarios from uploaded CSV data
GET| "/api/mcx/real-data"| Retrieve processed data from downloaded MCX CSV files
GET| "/api/mcx/relative-value"| Calculate normalized cross-contract price differences
GET| "/api/mcx/liquidity"| Retrieve contract volume, open interest, and liquidity-screening results
GET| "/api/mcx/validation"| Retrieve descriptive historical relative-value statistics
GET| "/api/mcx/backtest"| Run the preliminary historical relative-value backtest

CSV Upload Format

The CSV upload endpoints expect the following fields:

symbol, expiry, volume, open_interest, price

Example:

symbol,expiry,volume,open_interest,price
GOLDM,05FEB2027,1200,2400,144790
GOLDTEN,31MAR2027,350,290,147903

The example rows are illustrative and are not a substitute for actual market data. The CSV upload endpoints and the downloaded MCX Bhavcopy analysis may use different input formats.

Analytical Methodology

The prototype focuses on comparing contracts representing the same underlying metal.

1. Read and clean the available market data.
2. Normalize closing prices to an approximate price per gram of pure gold.
3. Compare each contract's normalized price with the same-day average.
4. Screen contract volume using an illustrative threshold.
5. Summarize historical relative-price differences.
6. Simulate a preliminary next-trading-date long-short comparison.
7. Deduct an assumed transaction cost and report gross and net returns.

The methodology is intended for demonstration and exploration. It does not fully account for differences in expiry, executable prices, market depth, short-selling feasibility, or all relevant trading costs.

Limitations

- Results depend on the historical CSV files available locally.
- The data is not a continuously updated live market feed.
- GOLDTEN has a shorter available history than some other contracts.
- Different contract expiry dates can affect relative-price comparisons.
- The 100-lot liquidity threshold is illustrative.
- Risk scenarios are hypothetical and are not official margin calculations.
- Backtest transaction costs are assumed rather than verified.
- The preliminary backtest does not isolate all underlying gold-price exposure.
- Historical results do not guarantee future performance.

Disclaimer

EXIDO is a hackathon prototype developed for educational, analytical, and demonstration purposes. It is not a production-grade trading system, investment advisory service, or validated trading strategy. All analytical results should be interpreted in light of the stated assumptions and limitations. Nothing in this project constitutes financial advice or a recommendation to buy or sell a commodity contract.

Future Scope

- Integration with regularly updated market data.
- More robust contract matching and expiry-aware comparisons.
- Improved transaction-cost and slippage assumptions.
- Walk-forward testing on additional historical data.
- Better separation of relative-value performance from underlying gold-price movements.
- Enhanced trader-facing alerts and analytical visualizations.
- More comprehensive contract lifecycle and liquidity monitoring.