import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { formatShortBRL } from '../../../utils/formatters';
import { createPortal } from 'react-dom';

const C = { white: '#FFFFFF', gray200: '#D0D1D6', gray400: '#91939F', gray600: '#585B6C', blue400: '#5B9FFF', blue200: '#94D1FF', blue700: '#0523E5' };

const BAR_GRADIENT = 'linear-gradient(60deg, #0523E5, #94D1FF)';
const BAR_HOVER    = 'linear-gradient(60deg, #0523E5, #94D1FF)'; // same, full opacity on hover

// Card title icon — 20x20px
const IconBarChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6"  y1="20" x2="6"  y2="14" />
  </svg>
);

const formatFullBRL = (val) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val || 0);

export default function RankingChart({ salesData = [] }) {
  const barsRef = useRef([]);
  const [hoveredData, setHoveredData] = useState(null);

  // Aggregate sellers
  const sellerAgg = {};
  if (Array.isArray(salesData)) {
    salesData.forEach(s => {
      if (!s.seller) return;
      if (!sellerAgg[s.seller]) {
        sellerAgg[s.seller] = { revenue: 0, qty: 0, models: {}, biggestSale: 0, biggestSaleModel: '', biggestSaleQty: 0 };
      }
      sellerAgg[s.seller].revenue += (s.revenue || 0);
      sellerAgg[s.seller].qty     += (s.qty || 1);
      if (s.model) sellerAgg[s.seller].models[s.model] = (sellerAgg[s.seller].models[s.model] || 0) + (s.qty || 1);
      if ((s.revenue || 0) > sellerAgg[s.seller].biggestSale) {
        sellerAgg[s.seller].biggestSale      = s.revenue || 0;
        sellerAgg[s.seller].biggestSaleModel = s.model || 'N/A';
        sellerAgg[s.seller].biggestSaleQty   = s.qty || 1;
      }
    });
  }

  const sorted   = Object.entries(sellerAgg).sort((a, b) => b[1].revenue - a[1].revenue);
  const labels   = sorted.map(s => s[0].split(' ')[0]);
  const dataVals = sorted.map(s => s[1].revenue);
  const maxVal   = Math.max(...dataVals, 1);

  const fullData = sorted.map(([name, d]) => ({
    name, revenue: d.revenue, qty: d.qty,
    topModel: Object.entries(d.models).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A',
    biggestSale: d.biggestSale, biggestSaleModel: d.biggestSaleModel, biggestSaleQty: d.biggestSaleQty
  }));

  // Bar entrance animation
  const dataKey = dataVals.join(',');
  useEffect(() => {
    const bars = barsRef.current.filter(Boolean);
    if (!bars.length) return;
    bars.forEach(b => { b.style.height = '0%'; b.style.opacity = '0'; b.style.background = BAR_GRADIENT; });
    anime({
      targets: bars,
      height:  (_, i) => `${(dataVals[i] / maxVal) * 100}%`,
      opacity: [0, 1],
      duration: 500,
      easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
      delay: anime.stagger(50)
    });
  }, [dataKey, maxVal, dataVals]);

  // Global tooltip follow
  useEffect(() => {
    const move = (e) => {
      const tip = document.getElementById('ranking-tooltip');
      if (!tip || !tip.classList.contains('visible')) return;
      const offset = 12, tw = tip.offsetWidth, th = tip.offsetHeight;
      let x = e.clientX + offset, y = e.clientY;
      if (x + tw > window.innerWidth)  x = e.clientX - tw - offset;
      if (y + th > window.innerHeight) y = window.innerHeight - th - offset;
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
    };
    document.addEventListener('mousemove', move);
    return () => document.removeEventListener('mousemove', move);
  }, [dataVals]);

  const handleEnter = (idx) => {
    setHoveredData(fullData[idx]);
    setTimeout(() => { const t = document.getElementById('ranking-tooltip'); if (t) t.classList.add('visible'); }, 0);
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      anime.remove(bar);
      const rg = bar.closest('.rg');
      if (rg) anime.remove(rg);
      if (i === idx) {
        if (rg) rg.style.opacity = 1;
        anime({ targets: bar, opacity: 1, duration: 200, easing: 'easeOutQuad',
          begin: () => { bar.style.background = BAR_GRADIENT; bar.style.boxShadow = `0 0 16px rgba(5,35,229,0.4)`; }
        });
      } else {
        if (rg) anime({ targets: rg, opacity: 0.3, duration: 200, easing: 'easeOutQuad' });
        anime({ targets: bar, opacity: 1, duration: 200, easing: 'easeOutQuad',
          begin: () => { bar.style.boxShadow = 'none'; bar.style.background = BAR_GRADIENT; }
        });
      }
    });
  };

  const handleLeave = () => {
    setHoveredData(null);
    const t = document.getElementById('ranking-tooltip');
    if (t) t.classList.remove('visible');
    barsRef.current.forEach(bar => {
      if (!bar) return;
      anime.remove(bar);
      const rg = bar.closest('.rg');
      if (rg) { anime.remove(rg); anime({ targets: rg, opacity: 1, duration: 300, easing: 'easeOutQuad' }); }
      anime({ targets: bar, opacity: 1, duration: 300, easing: 'easeOutQuad',
        begin: () => { bar.style.background = BAR_GRADIENT; bar.style.boxShadow = 'none'; }
      });
    });
  };

  return (
    <div className="standard-card" style={{ padding: 20 }}>
      {/* Header — icon + title, no subtitle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconBarChart />
          <h3 style={{ fontSize: 14, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>Ranking de Vendas</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 999 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.blue400, flexShrink: 0 }} className="animate-pulse" />
          <span style={{ fontSize: 9, fontWeight: 300, color: C.gray600, letterSpacing: 'normal' }}>Live stats</span>
        </div>
      </div>

      {/* Bars */}
      <div style={{ height: 280, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 24, padding: '0 16px', overflowX: 'auto' }}>
        {dataVals.length > 0 ? dataVals.map((val, idx) => (
          <div
            key={idx}
            className="rg"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: 44, minWidth: 44, flexShrink: 0, height: '100%', cursor: 'pointer', position: 'relative' }}
            onMouseEnter={() => handleEnter(idx)}
            onMouseLeave={handleLeave}
          >
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', borderRadius: 999, overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
              <div
                ref={el => { barsRef.current[idx] = el; }}
                style={{ width: '100%', height: '0%', background: BAR_GRADIENT, borderRadius: 999, transformOrigin: 'bottom' }}
              />
            </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 300, color: C.white, letterSpacing: '-0.02em' }} className="truncate">{labels[idx]}</p>
                <p style={{ fontSize: 9, fontWeight: 300, color: C.gray200, letterSpacing: 'normal', marginTop: 2, whiteSpace: 'nowrap' }}>{formatShortBRL(val)}</p>
              </div>
          </div>
        )) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: C.gray600 }}>
            Carregando dados...
          </div>
        )}
      </div>

      {/* Tooltip */}
      {createPortal(
        <div
          id="ranking-tooltip"
          className={`fixed z-[9999] rounded-xl p-5 shadow-2xl backdrop-blur-xl pointer-events-none transition-opacity duration-150 ${hoveredData ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          style={{ width: 240, top: -999, left: -999, background: '#24252E' }}
        >
          {hoveredData && (
            <>
              <h4 style={{ fontSize: 13, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid rgba(88,91,108,0.20)' }}>
                {hoveredData.name}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Receita total',      value: formatFullBRL(hoveredData.revenue) },
                  { label: 'Volume',             value: `${hoveredData.qty} unidades` },
                  { label: 'Mix dominante',      value: hoveredData.topModel },
                  { label: 'Maior venda única',  value: formatFullBRL(hoveredData.biggestSale) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: 9, fontWeight: 300, color: C.gray600, letterSpacing: 'normal', marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>{value}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
