import React from 'react';
import './ETFList.css';

const Alerts: React.FC = () => {
  return (
    <div className="etf-table-container">
      <h2>Alerts & Pro Features</h2>
      <p style={{ color: '#cfe8ff' }}>RS ETF Pro offers advanced comparisons, exportable backtests, and real-time alerts tailored to your watchlists.</p>

      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ marginTop: 0, color: '#4f8cff' }}>Advanced Backtesting</h3>
          <p>Run exact historical backtests with daily prices, dividends reinvested, fees, and monthly contributions. Export CSV of the simulation timeline.</p>
        </div>

        <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ marginTop: 0, color: '#4f8cff' }}>Custom Alerts</h3>
          <ul style={{ color: '#cfe8ff' }}>
            <li>Price crosses above/below threshold</li>
            <li>Percentage move within a day / week</li>
            <li>Relative performance vs peers (top/bottom performer)</li>
            <li>Scheduled exported reports (weekly/monthly)</li>
          </ul>
        </div>

        <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ marginTop: 0, color: '#4f8cff' }}>Example</h3>
          <p style={{ color: '#cfe8ff' }}>Create a watchlist "Tech Core" with VOO, QQQ, ARKK. Schedule an alert: notify me when any ETF underperforms VOO by more than 5% in a month. Export the backtest CSV for your tax or performance tracking.</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ background: '#4f8cff', color: '#fff', padding: '10px 16px', borderRadius: 8, border: 'none' }}>Upgrade to Pro</button>
          <button style={{ background: 'transparent', color: '#cfe8ff', padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.03)' }}>Contact Sales</button>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
