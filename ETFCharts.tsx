import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ETF_META, FINNHUB_API_KEY } from '../data/etfData';
import './ETFList.css';

type Candle = { t: number; c: number };

const ETFCharts: React.FC = () => {
  const [symbol, setSymbol] = useState(ETF_META[0].symbol);
  const [data, setData] = useState<{ date: string; close: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchHistory() {
      setLoading(true);
      try {
        // fetch 5 years daily candles (roughly)
        const now = Math.floor(Date.now() / 1000);
        const fiveYearsAgo = now - 60 * 60 * 24 * 365 * 5;
        const resp = await fetch(
          `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${fiveYearsAgo}&to=${now}&token=${FINNHUB_API_KEY}`
        );
        const json = await resp.json();
        if (!cancelled && json && Array.isArray(json.c)) {
          const arr = json.c.map((close: number, i: number) => ({
            date: new Date(json.t[i] * 1000).toISOString().slice(0,10),
            close,
          }));
          setData(arr);
        }
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchHistory();
    return () => { cancelled = true; };
  }, [symbol]);

  return (
    <div className="etf-table-container">
      <h2>ETF Charts</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="etf-search">
          {ETF_META.map((m) => <option key={m.symbol} value={m.symbol}>{m.symbol} — {m.name}</option>)}
        </select>
      </div>
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading historical data...</div>
      ) : (
        <div style={{ width: '100%', height: 360 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="date" hide />
              <YAxis domain={["dataMin", "dataMax"]} hide />
              <Tooltip />
              <Line type="monotone" dataKey="close" stroke="#4f8cff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ETFCharts;
