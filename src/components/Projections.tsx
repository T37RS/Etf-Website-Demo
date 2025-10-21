import React, { useMemo, useState } from 'react';
import { ETF_META } from '../data/etfData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './ETFList.css';

const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});

const Projections: React.FC = () => {
  const [symbol, setSymbol] = useState<string>(ETF_META[0].symbol);
  const [years, setYears] = useState<number>(5);
  const [initial, setInitial] = useState<number>(1000);

  const etf = ETF_META.find(e => e.symbol === symbol)!;

  const series = useMemo(() => {
    const arr: { year: number, value: number }[] = [];
    const r = (etf.return1Y || 0) / 100;
    let v = initial;
    for (let y = 0; y <= years; y++) {
      arr.push({ year: y, value: v });
      v = v * (1 + r);
    }
    return arr;
  }, [years, initial, etf.return1Y]);

  const projectionsList = useMemo(() => {
    return ETF_META.map(e => {
      const r = (e.return1Y || 0) / 100;
      const value = initial * Math.pow(1 + r, years);
      return { symbol: e.symbol, value };
    }).sort((a,b)=> b.value - a.value);
  }, [initial, years]);

  return (
    <div className="etf-table-container">
      <h2>Projections</h2>
  <div className="projections-grid">
        <div>
            <div className="proj-chart" style={{ width: '100%', height: 160, overflow: 'hidden' }}>
              <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(v)=>`$${Math.round(Number(v)).toLocaleString()}`} />
                <Tooltip formatter={(v:any)=>`$${formatter.format(Number(v))}`} />
                <Line type="monotone" dataKey="value" stroke="#4f8cff" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
            </div>

          <div style={{ marginTop: 16 }}>
            <h3 style={{ marginBottom: 8 }}>Projected final values (simple compounding using each ETF's 1Y return)</h3>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
              {projectionsList.map(p => (
                <div key={p.symbol} style={{ minWidth: 160, padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontWeight: 800 }}>{p.symbol}</div>
                  <div style={{ color: '#cfe8ff' }}>${formatter.format(p.value)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside>
          <div style={{ display: 'grid', gap: 12 }}>
            <label>
              ETF
              <select value={symbol} onChange={(e)=>setSymbol(e.target.value)} className="etf-search">
                {ETF_META.map(m => <option key={m.symbol} value={m.symbol}>{m.symbol} — {m.name}</option>)}
              </select>
            </label>
            <label>
              Years
              <input type="number" value={years} onChange={(e)=>setYears(Number(e.target.value))} className="etf-search" />
            </label>
            <label>
              Initial ($)
              <input type="number" value={initial} onChange={(e)=>setInitial(Number(e.target.value))} className="etf-search" />
            </label>
          </div>
        </aside>
      </div>

      <div style={{ marginTop: 18 }}>
        <h4>About projection methods</h4>
        <p style={{ color: '#cfe8ff' }}>
          This page shows simple compounding projections using each ETF's 1-year return as a baseline. For more accurate projections consider:
        </p>
        <ul>
          <li>Using historical daily returns and bootstrapping / Monte Carlo simulations to capture volatility and tail risk.</li>
          <li>Fitting ARIMA or Prophet time-series models on historical prices (requires longer history and preprocessing).</li>
          <li>Incorporating macroeconomic scenarios and regime switches (bear vs bull) with Markov switching models.</li>
          <li>Using expected returns from factor models (e.g., Fama-French) and estimating expected drift and volatility.</li>
        </ul>
      </div>
    </div>
  );
};

export default Projections;
