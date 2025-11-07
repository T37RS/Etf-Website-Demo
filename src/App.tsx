import React, { useState } from 'react';
import './App.css';
import ETFList from './components/ETFList';
import InvestSimulator from './components/InvestSimulator';
// ETFCharts intentionally not used in header nav (kept in repo for later)
import News from './components/News';
import Alerts from './components/Alerts';
import Settings from './components/Settings';
import Projections from './components/Projections';
import LedMatrixBackground from './components/LedMatrixBg';
import MatrixRobot from './components/MatrixRobot';
// Note: removed unused icon and recharts imports to silence build warnings.

function App() {
  const [page, setPage] = useState<'etfs' | 'settings' | 'simulator' | 'charts' | 'news' | 'alerts' | 'projections'>('etfs');
  // Control LED background visibility via state so user can toggle it at runtime
  const [showLed, setShowLed] = useState(true);

  return (
    <div className="app-root">
  {showLed && <LedMatrixBackground />}
      <aside className="sidebar">
        <nav>
          <ul>
            <li style={{visibility: 'hidden'}} />
          </ul>
        </nav>
        <div style={{ padding: 8, height: '100%', boxSizing: 'border-box' }}>
          <MatrixRobot />
        </div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <div className="app-title">RS ETF</div>
            <nav className="header-nav">
              <ul>
                
                <li className={page === 'etfs' ? 'active' : ''} onClick={() => setPage('etfs')}>ETFs</li>
                <li className={page === 'simulator' ? 'active' : ''} onClick={() => setPage('simulator')}>Simulator</li>
                <li className={page === 'news' ? 'active' : ''} onClick={() => setPage('news')}>News</li>
                <li className={page === 'alerts' ? 'active' : ''} onClick={() => setPage('alerts')}>Alerts</li>
                <li className={page === 'projections' ? 'active' : ''} onClick={() => setPage('projections')}>Projections</li>
                <li className={page === 'settings' ? 'active' : ''} onClick={() => setPage('settings')}>Settings</li>
              </ul>
            </nav>
          </div>
          <div className="led-toggle">
            <label style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <input type="checkbox" checked={showLed} onChange={(e) => setShowLed(e.target.checked)} />
              <span style={{color: '#cfe8ff', fontSize: 12}}>LED Background</span>
            </label>
          </div>
        </header>
        <section className="content-section">
          
          {page === 'etfs' && <ETFList />}
          {page === 'simulator' && <InvestSimulator />}
          {page === 'news' && <News />}
          {page === 'alerts' && <Alerts />}
          {page === 'projections' && <Projections />}
          {page === 'settings' && <Settings />}
        </section>
        <footer className="site-footer">
          <div className="footer-inner">
            <div>Created by T37RS</div>
            <div className="footer-meta">Built with React · TypeScript · Recharts · CSS. For portfolio use only.</div>
            <div className="footer-links"><a href="https://github.com/T37RS/Etf-Website-Demo" target="_blank" rel="noreferrer">Source</a></div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;