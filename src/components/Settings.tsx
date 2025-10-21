import React, { useEffect, useState } from 'react';
import { ETF_META } from '../data/etfData';
import './ETFList.css';

type Watchlist = { id: string; name: string; symbols: string[] };

const CURRENCIES: { code: string; label: string; symbol: string }[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
];

function uid() { return Math.random().toString(36).slice(2,9); }

const Settings: React.FC = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selected, setSelected] = useState<string[]>([ETF_META[0].symbol]);
  const [currency, setCurrency] = useState<string>('USD');
  const [accountEmail, setAccountEmail] = useState<string>('');
  const [accountPassword, setAccountPassword] = useState<string>('');
  const [accountMsg, setAccountMsg] = useState<string>('');

  useEffect(() => {
    const raw = localStorage.getItem('rs_watchlists');
    if (raw) setWatchlists(JSON.parse(raw));
    const cur = localStorage.getItem('rs_currency');
    if (cur) setCurrency(cur);
  }, []);

  useEffect(() => { localStorage.setItem('rs_watchlists', JSON.stringify(watchlists)); }, [watchlists]);
  useEffect(() => { localStorage.setItem('rs_currency', currency); }, [currency]);

  useEffect(() => {
    const acc = localStorage.getItem('rs_account');
    if (acc) {
      try { const a = JSON.parse(acc); setAccountEmail(a.email || ''); }
      catch(e){}
    }
  }, []);

  const addWatchlist = () => {
    const w: Watchlist = { id: uid(), name: `Watchlist • ${watchlists.length + 1}`, symbols: selected };
    setWatchlists((s) => [w, ...s]);
  };

  const remove = (id: string) => setWatchlists((s) => s.filter(w => w.id !== id));

  return (
    <div className="etf-table-container">
      <h2>Settings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginBottom: 12, alignItems: 'start' }}>
        <div>
          <div style={{ marginBottom: 8, color: '#cfe8ff', fontWeight: 700 }}>Create Account</div>
          <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
            <input placeholder="Email" value={accountEmail} onChange={(e)=>setAccountEmail(e.target.value)} className="etf-search" />
            <input placeholder="Password" type="password" value={accountPassword} onChange={(e)=>setAccountPassword(e.target.value)} className="etf-search" />
            <button style={{ background: '#4f8cff', color: '#fff', padding: '10px 12px', borderRadius: 8, border: 'none', width: 120 }} onClick={() => {
              if (!accountEmail.includes('@') || accountPassword.length < 6) {
                setAccountMsg('Enter a valid email and password (6+ chars).');
                return;
              }
              const acc = { email: accountEmail, createdAt: Date.now() };
              localStorage.setItem('rs_account', JSON.stringify(acc));
              setAccountMsg('Account created locally.');
            }}>Create</button>
            {accountMsg && <div style={{ marginTop: 8, color: '#cfe8ff' }}>{accountMsg}</div>}
          </div>

          <div style={{ marginBottom: 8, color: '#cfe8ff', fontWeight: 700 }}>Create a new watchlist</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select multiple className="etf-search" value={selected} onChange={(e)=>{
              const opts = Array.from(e.target.selectedOptions, o => o.value);
              setSelected(opts);
            }} style={{ height: 120 }}>
              {ETF_META.map(m => <option key={m.symbol} value={m.symbol}>{m.symbol} — {m.name}</option>)}
            </select>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={addWatchlist} style={{ background: '#4f8cff', color: '#fff', padding: '10px 18px', borderRadius: 10, border: 'none' }}>Create</button>
              <button onClick={() => setSelected([ETF_META[0].symbol])} style={{ background: 'transparent', color: '#cfe8ff', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.03)' }}>Reset</button>
            </div>
          </div>
        </div>
        <div />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <button onClick={addWatchlist} style={{ background: '#4f8cff', color: '#fff', padding: '10px 18px', borderRadius: 10, border: 'none' }}>Save Watchlist</button>
      </div>

      <div style={{ marginTop: 12 }}>
        {watchlists.length === 0 ? <div className="no-results">No watchlists yet.</div> : (
          <div style={{ display: 'grid', gap: 12 }}>
            {watchlists.map(w => (
              <div key={w.id} style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#dff6ff' }}>{w.name}</div>
                  <div style={{ color: '#cfe8ff' }}>{w.symbols.join(', ')}</div>
                </div>
                <div>
                  <button onClick={() => remove(w.id)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.04)', color: '#ffdede', padding: '6px 10px', borderRadius: 8 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
