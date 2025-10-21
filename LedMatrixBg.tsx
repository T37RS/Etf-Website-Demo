import React, { useEffect, useRef } from 'react';
import './LedMatrixBackground.css';

const LED_ROWS = 24;
const LED_COLS = 48;
const LED_SIZE = 12; // px
const LED_GAP = 6; // px

const LedMatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasEl = canvas as HTMLCanvasElement;
    const ctxEl = ctx as CanvasRenderingContext2D;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvasEl.width = Math.floor((LED_COLS * (LED_SIZE + LED_GAP) - LED_GAP) * dpr);
      canvasEl.height = Math.floor((LED_ROWS * (LED_SIZE + LED_GAP) - LED_GAP) * dpr);
      canvasEl.style.width = '100vw';
      canvasEl.style.height = '100vh';
      ctxEl.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let hueBase = 200;

    function draw() {
      const w = canvasEl.width / (window.devicePixelRatio || 1);
      const h = canvasEl.height / (window.devicePixelRatio || 1);
      ctxEl.clearRect(0, 0, w, h);

      const t = Date.now() / 1000;
      for (let r = 0; r < LED_ROWS; r++) {
        for (let c = 0; c < LED_COLS; c++) {
          const x = c * (LED_SIZE + LED_GAP) + LED_GAP / 2;
          const y = r * (LED_SIZE + LED_GAP) + LED_GAP / 2;

          const noise = Math.sin((r * 7 + c * 13) * 0.07 + t * 2) * 0.5 + Math.random() * 0.3;
          const brightness = Math.max(0.05, Math.min(1, 0.25 + noise));
          const hue = hueBase + (Math.sin((r + c) * 0.1 + t) * 20);

          ctxEl.beginPath();
          ctxEl.fillStyle = `hsla(${hue}, 100%, ${30 + brightness * 40}%, ${0.95 * brightness})`;
          ctxEl.shadowColor = `hsla(${hue}, 100%, 60%, ${0.9 * brightness})`;
          ctxEl.shadowBlur = 8 * brightness;
          ctxEl.fillRect(x, y, LED_SIZE, LED_SIZE);
          ctxEl.closePath();
          ctxEl.shadowBlur = 0;
        }
      }

      hueBase += 0.02;
      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="led-matrix-root">
      <canvas ref={canvasRef} className="led-matrix-canvas" />
    </div>
  );
};

export default LedMatrixBackground;
