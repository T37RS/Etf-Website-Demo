import React, { useState } from 'react';
import './App.css';
import ETFList from './components/ETFList';
import InvestSimulator from './components/InvestSimulator';
import ETFCharts from './components/ETFCharts';
import News from './components/News';
import Alerts from './components/Alerts';
import Settings from './components/Settings';
import Projections from './components/Projections';
import LedMatrixBackground from './components/LedMatrixBg';
import MatrixRobot from './components/MatrixRobot';
import { FaChartBar } from 'react-icons/fa6';
import { FaUserCircle, FaCog } from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';


const ChartBarIcon = FaChartBar as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const UserCircleIcon = FaUserCircle as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const CogIcon = FaCog as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const dashboardData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 420 },
  { name: 'Wed', value: 410 },
  { name: 'Thu', value: 430 },
  { name: 'Fri', value: 440 },
];

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
      </main>
    </div>
  );
}

export default App;