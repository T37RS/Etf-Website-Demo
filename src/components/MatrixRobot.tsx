import React, { useEffect, useRef, useState } from 'react';
import './MatrixRobot.css';
import { ETF_META } from '../data/etfData';

// Small stock ticker widget (no background) that scrolls tickers across the
// sidebar. Uses ETF_META to display symbol and a percent (from return1Y).
const MatrixRobot: React.FC = () => {
  // Limit the number of unique tickers shown per loop to reduce DOM/paint work
  const MAX_ITEMS = 20;
  const items = ETF_META.slice(0, MAX_ITEMS).map((e) => ({ symbol: e.symbol, pct: e.return1Y }));
  const trackRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const [repeatCount, setRepeatCount] = useState<number>(2);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const group = groupRef.current;
      if (!track || !group) return;

      const wrap = track.parentElement as HTMLElement | null; // .ticker-wrap
      const groupHeight = group.scrollHeight;
      const wrapHeight = wrap?.clientHeight ?? 0;

      // Ensure we have at least enough repeated groups to cover the wrap height
      // plus one extra group for a seamless loop
      if (groupHeight > 0 && wrapHeight > 0) {
        const needed = Math.max(2, 1 + Math.ceil(wrapHeight / groupHeight));
        const capped = Math.min(6, needed); // guard against extreme repeats
        if (capped !== repeatCount) {
          setRepeatCount(capped);
          // Defer remaining style updates until next render w/ new repeatCount
          return;
        }
      }

      // Drive animation distance exactly one group height for a seamless reset
      track.style.setProperty('--groupHeightPx', `${groupHeight}px`);

      // Set duration based on pixel height so speed is stable across sizes
      const pxPerSec = 28; // adjust for taste
      const duration = Math.max(6, Math.round(groupHeight / pxPerSec));
      // Use CSS var the stylesheet reads for the animation duration
      track.style.setProperty('--duration', `${duration}s`);
    };

    // Initial measure (fonts/layout might shift, so measure twice)
    measure();
    const t = setTimeout(measure, 80);

    // ResizeObserver to handle container or content changes
    let ro: ResizeObserver | null = null;
    const w: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    if (w && 'ResizeObserver' in w) {
      const ros: ResizeObserver = new w.ResizeObserver(() => measure());
      ro = ros;
      if (trackRef.current?.parentElement) ros.observe(trackRef.current.parentElement);
      if (groupRef.current) ros.observe(groupRef.current);
    } else if (w && w.addEventListener) {
      w.addEventListener('resize', measure);
    }

    return () => {
      clearTimeout(t);
      if (ro) {
        ro.disconnect();
      } else if ((globalThis as any)?.removeEventListener) {
        (globalThis as any).removeEventListener('resize', measure);
      }
    };
  }, [repeatCount]);

  return (
    <div className="matrix-robot" aria-hidden>
      <div className="ticker-wrap">
        <div className="ticker-track" ref={trackRef}>
          {Array.from({ length: repeatCount }).map((_, r) => (
            <div className="group" ref={r === 0 ? groupRef : undefined} key={`grp-${r}`}>
              {items.map((it, idx) => (
                <div key={`r${r}-i${idx}`} className="ticker-item">
                  <span className="t-symbol">{it.symbol}</span>
                  <span className={`t-pct ${it.pct >= 0 ? 'up' : 'down'}`}>
                    {it.pct >= 0 ? '▲' : '▼'} {Math.abs(it.pct).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatrixRobot;
