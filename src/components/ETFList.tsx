import React, { useState, useEffect } from 'react';
import './ETFList.css';
// Recharts removed from ETFList (sparkline removed) to avoid unused import warnings
import { ETF_META, FINNHUB_API_KEY } from '../data/etfData';

type ETF = {
  symbol: string;
  name: string;
  price: number;
  return1Y: number;
  expenseRatio: number;
  aum: number;
  chart1Y: number[]; // weekly closes (~52)
  chart7D: number[]; // last 7 daily closes
};

const columns = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'return1Y', label: '1Y Return' },
  { key: 'expenseRatio', label: 'Expense Ratio' },
  { key: 'annualCost', label: 'Cost ($1k/year)' },
  { key: 'aum', label: 'AUM' },
];

function formatAUM(aum: number): string {
  if (aum >= 1e12) return `$${(aum / 1e12).toFixed(2)}T`;
  if (aum >= 1e9) return `$${(aum / 1e9).toFixed(2)}B`;
  if (aum >= 1e6) return `$${(aum / 1e6).toFixed(2)}M`;
  return `$${aum}`;
}

const ETFList: React.FC = () => {
  const [etfs, setEtfs] = useState<ETF[]>([]);
  const [sortKey, setSortKey] = useState<string>('symbol');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
  const now = Math.floor(Date.now() / 1000);
  const oneYearAgo = now - 60 * 60 * 24 * 365;
  const sevenDaysAgo = now - 60 * 60 * 24 * 14; // fetch two weeks to be safe
    Promise.all(
      ETF_META.map(async (meta) => {
        try {
          // try to fetch weekly candles for the past year (approx 52 points)
          const url = `https://finnhub.io/api/v1/stock/candle?symbol=${meta.symbol}&resolution=W&from=${oneYearAgo}&to=${now}&token=${FINNHUB_API_KEY}`;
          const res = await fetch(url);
          const json = await res.json();
          let chart1Y: number[] = [];
          if (json && json.s === 'ok' && Array.isArray(json.c) && json.c.length > 0) {
            chart1Y = json.c.slice(-52); // up to 52 weekly closes
          }

          // fetch recent daily candles for 7-day sparkline
          let chart7D: number[] = [];
          try {
            const url7 = `https://finnhub.io/api/v1/stock/candle?symbol=${meta.symbol}&resolution=D&from=${sevenDaysAgo}&to=${now}&token=${FINNHUB_API_KEY}`;
            const r7 = await fetch(url7);
            const j7 = await r7.json();
            if (j7 && j7.s === 'ok' && Array.isArray(j7.c) && j7.c.length > 0) {
              chart7D = j7.c.slice(-7);
            }
          } catch {}

          if (chart1Y.length > 0 || chart7D.length > 0) {
            const price = (chart7D.length ? chart7D[chart7D.length -1] : (chart1Y.length ? chart1Y[chart1Y.length-1] : 0)) || 0;
            return { ...meta, price, chart1Y: chart1Y.length ? chart1Y : Array(52).fill(price), chart7D: chart7D.length ? chart7D : Array(7).fill(price) } as ETF;
          }

          // fallback: get a quote if candles not available
          const qr = await fetch(`https://finnhub.io/api/v1/quote?symbol=${meta.symbol}&token=${FINNHUB_API_KEY}`);
          const qj = await qr.json();
          const fallbackPrice = qj.c || qj.pc || 0;
          return { ...meta, price: fallbackPrice, chart1Y: Array(52).fill(fallbackPrice), chart7D: Array(7).fill(fallbackPrice) } as ETF;
        } catch (err) {
          return { ...meta, price: 0, chart1Y: Array(52).fill(0), chart7D: Array(7).fill(0) } as ETF;
        }
      })
    ).then((results) => {
      setEtfs(results);
      setLoading(false);
    });
  }, []);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filtered = etfs.filter(
    (etf) =>
      etf.symbol.toLowerCase().includes(search.toLowerCase()) ||
      etf.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aValue = (a as any)[sortKey];
    const bValue = (b as any)[sortKey];
    if (aValue < bValue) return sortAsc ? -1 : 1;
    if (aValue > bValue) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="etf-table-container">
      <h2>ETF Tracker</h2>
      <input
        className="etf-search"
        type="text"
        placeholder="Search by symbol or name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Loading live ETF data...</div>
      ) : (
        <table className="etf-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={sortKey === col.key ? 'active-sort' : ''}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="sort-arrow">{sortAsc ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((etf: ETF) => (
              <tr key={etf.symbol} className="etf-row">
                <td className="etf-symbol">{etf.symbol}</td>
                <td>{etf.name}</td>
                <td className="etf-price">
                  {etf.price > 0 ? `$${etf.price.toFixed(2)}` : 'N/A'}
                </td>
                <td className="etf-return">{etf.return1Y}%</td>
                <td className="etf-expense">{etf.expenseRatio}%</td>
                <td className="etf-cost">
                  ${ (etf.expenseRatio * 10).toFixed(2) }
                </td>
                  <td className="etf-aum">{formatAUM(etf.aum)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && sorted.length === 0 && (
        <div className="no-results">No ETFs found.</div>
      )}
    </div>
  );
};

export default ETFList;