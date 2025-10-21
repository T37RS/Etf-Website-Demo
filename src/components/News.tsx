import React, { useEffect, useState } from 'react';
import './ETFList.css';
import { ETF_META, FINNHUB_API_KEY } from '../data/etfData';

type NewsItem = { id: string; headline: string; source: string; datetime: number; url: string };

const News: React.FC = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchNews() {
      setLoading(true);
      try {
  const all: NewsItem[] = [];
        // Use Finnhub /news or company-news for each symbol (company-news requires symbol + from/to)
        const now = Math.floor(Date.now() / 1000);
        const oneMonthAgo = now - 60 * 60 * 24 * 30;
        for (const e of ETF_META) {
          try {
            const url = `https://finnhub.io/api/v1/company-news?symbol=${e.symbol}&from=${new Date(oneMonthAgo*1000).toISOString().slice(0,10)}&to=${new Date(now*1000).toISOString().slice(0,10)}&token=${FINNHUB_API_KEY}`;
            const res = await fetch(url);
            const json = await res.json();
            if (Array.isArray(json)) {
              for (const it of json.slice(0,5)) {
                all.push({ id: `${e.symbol}-${it.id || it.datetime}`, headline: it.headline || it.summary || '', source: it.source || e.symbol, datetime: it.datetime || 0, url: it.url || '' });
              }
            }
          } catch {}
        }
        // Deduplicate by URL (preferred) or headline+datetime
        const seen = new Set<string>();
        const deduped: NewsItem[] = [];
        all.sort((a,b)=> b.datetime - a.datetime);
        for (const it of all) {
          const key = it.url && it.url.length ? it.url : `${it.headline}|${it.datetime}`;
          if (seen.has(key)) continue;
          seen.add(key);
          deduped.push(it);
        }
        if (!cancelled) setItems(deduped.slice(0,50));
      } catch (e) {
      } finally { if (!cancelled) setLoading(false); }
    }
    fetchNews();
    return ()=> { cancelled = true; };
  }, []);

  return (
    <div className="etf-table-container">
      <h2>News</h2>
      {loading ? <div style={{padding: 24}}>Loading recent news...</div> : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map(it => (
            <a key={it.id} href={it.url} target="_blank" rel="noreferrer" style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 10, display: 'block', color: '#e6f4ff', textDecoration: 'none' }}>
              <div style={{ fontWeight: 700 }}>{it.headline}</div>
              <div style={{ color: '#cfe8ff', fontSize: 13 }}>{it.source} — {new Date(it.datetime*1000).toLocaleString()}</div>
            </a>
          ))}
          {items.length === 0 && <div className="no-results">No recent news found.</div>}
        </div>
      )}
    </div>
  );
};

export default News;
