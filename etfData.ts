export type ETFMeta = {
  symbol: string;
  name: string;
  return1Y: number;
  expenseRatio: number;
  aum: number;
};

export const ETF_META: ETFMeta[] = [
  { symbol: 'VOO', name: 'Vanguard S&P 500', return1Y: 12.5, expenseRatio: 0.03, aum: 350000000000 },
  { symbol: 'IVV', name: 'iShares Core S&P 500', return1Y: 12.3, expenseRatio: 0.03, aum: 320000000000 },
  { symbol: 'SPY', name: 'SPDR S&P 500', return1Y: 12.4, expenseRatio: 0.09, aum: 400000000000 },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', return1Y: 18.2, expenseRatio: 0.20, aum: 200000000000 },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market', return1Y: 11.8, expenseRatio: 0.03, aum: 310000000000 },
  { symbol: 'EFA', name: 'iShares MSCI EAFE', return1Y: 7.1, expenseRatio: 0.32, aum: 56000000000 },
  { symbol: 'IWM', name: 'iShares Russell 2000', return1Y: 8.9, expenseRatio: 0.19, aum: 65000000000 },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average', return1Y: 9.5, expenseRatio: 0.16, aum: 30000000000 },
  { symbol: 'ARKK', name: 'ARK Innovation ETF', return1Y: 5.2, expenseRatio: 0.75, aum: 8000000000 },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR', return1Y: 6.7, expenseRatio: 0.12, aum: 35000000000 },
];

// Use the same Finnhub API key you provided earlier. Keep this file for local development only.
export const FINNHUB_API_KEY = 'd3mi35pr01qmso33ubugd3mi35pr01qmso33ubv0';
