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

  const globalVolumeLeader = Math.max(...sorted.map(s => s[1].qty));
  const globalBiggestSale  = Math.max(...sorted.map(s => s[1].biggestSale));

  const fullData = sorted.map(([name, d]) => ({
    name, revenue: d.revenue, qty: d.qty,
    biggestSale: d.biggestSale,
    vehicleTags: Object.entries(d.models).sort((a, b) => b[1] - a[1]),
    isVolumeLeader: d.qty === globalVolumeLeader && globalVolumeLeader > 0,
    isBiggestSaleLeader: d.biggestSale === globalBiggestSale && globalBiggestSale > 0
  }));

  const dataKey = dataVals.join(',');
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated || !dataVals.length) return;
    const bars = barsRef.current.filter(Boolean);
    bars.forEach(b => { b.style.height = '0%'; b.style.opacity = '0'; });
    
    anime({
      targets: bars,
      height:  (_, i) => `${(dataVals[i] / maxVal) * 100}%`,
      opacity: [0, 1],
      duration: 2000, 
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
      delay: anime.stagger(100)
    });
  }, [hasAnimated, dataKey, maxVal]); 

  const handleMouseMove = (e) => {
    const t = document.getElementById('ranking-tooltip');
    if (t) {
      t.style.left = `${e.clientX + 48}px`;
      t.style.top = `${e.clientY}px`;
      t.style.transform = 'translateY(-50%)'; 
    }
  };

  const handleEnter = (idx) => {
    setHoveredData(fullData[idx]);
    setTimeout(() => { const t = document.getElementById('ranking-tooltip'); if (t) t.classList.add('visible'); }, 0);
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const rg = bar.closest('.rg');
      if (i === idx) {
        if (rg) rg.style.opacity = '1';
        bar.style.boxShadow = `0 0 20px rgba(5,35,229,0.5)`;
      } else {
        if (rg) rg.style.opacity = '0.4';
        bar.style.boxShadow = 'none';
      }
    });
  };

  const handleLeave = () => {
    setHoveredData(null);
    const t = document.getElementById('ranking-tooltip');
    if (t) { t.classList.remove('visible'); t.style.top = '-999px'; t.style.left = '-999px'; }
    barsRef.current.forEach(bar => {
      if (!bar) return;
      const rg = bar.closest('.rg');
      if (rg) rg.style.opacity = '1';
      bar.style.boxShadow = 'none';
    });
  };

  return (
    <div ref={containerRef} className="standard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconBarChart />
          <h3 style={{ fontSize: 14, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>Ranking de Vendas</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 9999 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.blue400, flexShrink: 0 }} className="animate-pulse" />
          <span style={{ fontSize: 9, fontWeight: 300, color: C.gray600, letterSpacing: 'normal' }}>Live stats</span>
        </div>
      </div>

      <div style={{ height: 280, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 24, padding: '0 16px', overflowX: 'auto' }}>
        {dataVals.length > 0 ? dataVals.map((val, idx) => (
          <div
            key={idx}
            className="rg"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: 44, minWidth: 44, flexShrink: 0, height: '100%', cursor: 'pointer', position: 'relative' }}
            onMouseEnter={() => handleEnter(idx)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleLeave}
          >
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', borderRadius: 9999, overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
              <div
                ref={el => { barsRef.current[idx] = el; }}
                style={{ width: '100%', height: '0%', background: BAR_GRADIENT, borderRadius: 9999, transformOrigin: 'bottom' }}
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

      {createPortal(
        <div
          id="ranking-tooltip"
          className={`fixed z-[9999] p-5 shadow-2xl backdrop-blur-xl pointer-events-none`}
          style={{ 
            width: 240, 
            top: -999, 
            left: -999, 
            background: '#24252E', 
            borderRadius: 16,
            border: '1px solid rgba(88,91,108,0.20)',
            opacity: hoveredData ? 1 : 0,
            visibility: hoveredData ? 'visible' : 'hidden',
            transition: 'opacity 0.15s ease-out',
            transform: 'translateY(-50%)'
          }}
        >
          {hoveredData && (
            <>
              <h4 style={{ fontSize: 13, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid rgba(88,91,108,0.20)' }}>
                {hoveredData.name}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 300, color: C.gray600, letterSpacing: 'normal', marginBottom: 2 }}>Receita total</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.blue400, letterSpacing: '-0.02em' }}>{formatFullBRL(hoveredData.revenue)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 300, color: C.gray600, letterSpacing: 'normal', marginBottom: 2 }}>Volume total</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>{hoveredData.qty} unidades</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 300, color: C.gray600, letterSpacing: 'normal', marginBottom: 2 }}>Maior venda única</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>{formatFullBRL(hoveredData.biggestSale)}</p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {hoveredData.vehicleTags.map(([model, qty]) => (
                      <div key={model} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(88,91,108,0.30)', borderRadius: 9999, padding: '4px 10px' }}>
                          <span style={{ fontSize: 10, fontWeight: 300, color: C.white }}>{model}</span>
                          <span style={{ fontSize: 10, fontWeight: 500, color: C.blue200 }}>{qty}</span>
                      </div>
                  ))}
                </div>

                {(hoveredData.isVolumeLeader || hoveredData.isBiggestSaleLeader) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {hoveredData.isVolumeLeader && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(88,91,108,0.30)', borderRadius: 9999, padding: '4px 10px' }}>
                            <span style={{ fontSize: 10, fontWeight: 300, color: C.white, letterSpacing: '-0.02em' }}>Líder de Volume</span>
                        </div>
                    )}
                    {hoveredData.isBiggestSaleLeader && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(88,91,108,0.30)', borderRadius: 9999, padding: '4px 10px' }}>
                            <span style={{ fontSize: 10, fontWeight: 300, color: C.white, letterSpacing: '-0.02em' }}>Maior Venda Única</span>
                        </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
