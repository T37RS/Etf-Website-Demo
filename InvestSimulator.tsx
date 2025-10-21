import React, { useMemo, useState } from 'react';
import './ETFList.css';
import { ETF_META } from '../data/etfData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function monthsBetween(fromYear: number) {
  const now = new Date();
  const years = Math.max(0, now.getFullYear() - fromYear);
  return years * 12;
}

const InvestSimulator: React.FC = () => {
  const [symbol, setSymbol] = useState(ETF_META[0].symbol);
  const [initial, setInitial] = useState<number>(1000);
  const [monthly, setMonthly] = useState<number>(100);
  const [year, setYear] = useState<number>(2015);

  const months = monthsBetween(year);

  // Build monthly series for selected ETF and prepare final values for comparisons
  const series = useMemo(() => {
    // Build a combined array: each element has label and value per symbol
    const data: any[] = [];
    for (let m = 0; m <= months; m++) {
      const date = new Date(year, m, 1);
      const label = date.toISOString().slice(0,7);
      const point: any = { label };
      // for each ETF, compute balance
      ETF_META.forEach((e) => {
        const rAnnual = e.return1Y / 100;
        const rMonthly = Math.pow(1 + rAnnual, 1 / 12) - 1;
        // simulate contributions from month 0 to m
        let bal = initial;
        for (let i = 0; i <= m; i++) {
          bal = bal * (1 + rMonthly) + monthly;
        }
        point[e.symbol] = bal;
      });
      data.push(point);
    }
    return data;
  }, [initial, monthly, year, months]);

  const finalValues = useMemo(() => {
    if (!series.length) return [];
    const last = series[series.length - 1];
    return ETF_META.map(e => ({ symbol: e.symbol, value: last[e.symbol] || 0 })).sort((a,b)=> b.value - a.value);
  }, [series]);

  return (
    <div className="etf-table-container">
      <h2>Investment Simulator</h2>
  <div className="sim-controls" style={{ marginBottom: 14 }}>
        <label>
          Initial Investment (USD)
          <input type="number" value={initial} onChange={(e) => setInitial(Number(e.target.value))} className="etf-search" />
        </label>
        <label>
          Monthly Contribution
          <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="etf-search" />
        </label>
        <label style={{ flex: 2 }}>
          ETF
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="etf-search">
            {ETF_META.map((m) => <option key={m.symbol} value={m.symbol}>{m.symbol} — {m.name}</option>)}
          </select>
        </label>
        <label style={{ width: 140 }}>
          From Year
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="etf-search" />
        </label>
      </div>

      <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 14, color: '#cfe8ff' }}>Top projected performer</div>
        {finalValues.length > 0 ? (
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#ffd166' }}>Top:</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#4f8cff' }}>{finalValues[0].symbol}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>${new Intl.NumberFormat('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}).format(finalValues[0].value)}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#cfe8ff' }}>Selected:</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#00ffd0' }}>{symbol}</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>${new Intl.NumberFormat('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}).format((finalValues.find(f => f.symbol === symbol)?.value || 0))}</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 16, color: '#cfe8ff' }}>Enter values to simulate.</div>
        )}
        <div style={{ marginTop: 6, color: '#cfe8ff' }}>Comparison across available ETFs using a simplified model.</div>
      </div>

      <div style={{ width: '100%', height: 420 }}>
        <ResponsiveContainer>
          <LineChart data={series}>
            <XAxis dataKey="label" hide />
            <YAxis domain={[0, 'dataMax']} tickFormatter={(v) => `$${new Intl.NumberFormat('en-US').format(Math.round(Number(v)))}`} />
            <Tooltip formatter={(value:any) => `$${new Intl.NumberFormat('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}).format(Number(value))}`} />
            {/* Only render the selected ETF line to simplify the chart */}
            {ETF_META.filter(e => e.symbol === symbol).map((e, idx) => {
              const color = '#4f8cff';
              return <Line key={e.symbol} type="monotone" dataKey={e.symbol} stroke={color} strokeWidth={3} dot={false} />;
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ marginBottom: 8, color: '#cfe8ff', fontWeight: 700 }}>Other ETFs (final projected values)</div>
        <div className="returns-list">
          {finalValues.filter(f => f.symbol !== symbol).map(f => (
            <div key={f.symbol} className="return-item" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontWeight: 700 }}>{f.symbol}</div>
              <div style={{ color: '#cfe8ff' }}>${new Intl.NumberFormat('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}).format(f.value)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestSimulator;
