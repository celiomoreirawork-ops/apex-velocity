import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import anime from 'animejs';
import { createPortal } from 'react-dom';

const C = { white: '#FFFFFF', gray200: '#D0D1D6', gray400: '#91939F', gray600: '#585B6C', blue400: '#5B9FFF', blue200: '#94D1FF', blue700: '#0523E5', blue950: '#1B0056' };

/* Unified color palette — Especificação colors as global standard for BOTH donuts */
const UNIFIED_COLORS = ['#0523E5', '#5B9FFF', '#94D1FF', '#1A4195', '#1B0056'];

// Bar gradient: dark (left) → light (right) — Design System standard
const BAR_GRADIENT = 'linear-gradient(90deg, #1B0056, #0523E5)';

const TOOLTIP_ID = 'mix-tooltip-shared';

// Card title icon
const IconPieChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);

function Legend({ entries, getColor }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 16px', marginTop: 8 }}>
      {entries.map(([label], i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: getColor(label, i), flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 300, color: C.gray200, letterSpacing: 'normal' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Modern Donut: rounded ends, 6px gap between slices, no stroke separators ── */
function DonutChart({ title, data, total, getColor, tooltipId }) {
  const [hovered, setHovered] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);
  const SIZE = 140, CX = 70, CY = 70, R = 52, T = 18;
  const pathsRef = useRef([]);

  // 6px gap between slices — convert px gap to angle
  const GAP_PX = 6;
  const GAP_ANGLE = GAP_PX / R;

  let slices = [];
  let currentAngle = -Math.PI / 2;
  const totalGap = GAP_ANGLE * data.length;
  const availableAngle = 2 * Math.PI - totalGap;

  for (let i = 0; i < data.length; i++) {
    const [label, value] = data[i];
    const angle = total > 0 ? (value / total) * availableAngle : 0;
    const start = currentAngle + GAP_ANGLE / 2;
    const end = start + angle;
    currentAngle = end + GAP_ANGLE / 2;
    slices.push({ label, value, start, end, color: getColor(label, i) });
  }

  const getPath = (s, e) => {
    if (e - s <= 0.01) return '';
    const x1 = CX + R * Math.cos(s), y1 = CY + R * Math.sin(s);
    const x2 = CX + R * Math.cos(e), y2 = CY + R * Math.sin(e);
    return `M ${x1} ${y1} A ${R} ${R} 0 ${(e - s) > Math.PI ? 1 : 0} 1 ${x2} ${y2}`;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHasAnimated(true); }, { threshold: 0.1 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasAnimated || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const anim = anime({ targets: pathsRef.current.filter(Boolean), strokeDashoffset: [anime.setDashoffset, 0], duration: 1200, easing: 'easeInOutQuad', delay: anime.stagger(80) });
    return () => anim.pause();
  }, [hasAnimated, data]);

  const moveTooltip = (e, label) => {
    const t = document.getElementById(tooltipId);
    if (t) {
      t.textContent = label;
      t.style.opacity = '1';
      t.style.visibility = 'visible';
      const tw = t.offsetWidth || 120;
      const th = t.offsetHeight || 40;
      let left = e.clientX + 20;
      let top = e.clientY;
      if (left + tw + 16 > window.innerWidth) left = e.clientX - tw - 20;
      if (top + th > window.innerHeight) top = window.innerHeight - th - 16;
      if (top < 16) top = 16;
      t.style.left = `${left}px`;
      t.style.top = `${top}px`;
    }
  };

  const hideTooltip = () => {
    const t = document.getElementById(tooltipId);
    if (t) { t.style.opacity = '0'; t.style.visibility = 'hidden'; }
  };

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: SIZE, height: SIZE, strokeWidth: 'unset', fill: 'none', stroke: 'none' }}>
          {/* Track ring */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={T} />
          {slices.map((s, i) => {
            const pLen = 2 * Math.PI * R;
            return (
              <path
                key={i}
                ref={el => pathsRef.current[i] = el}
                d={getPath(s.start, s.end)}
                fill="none"
                stroke={s.color}
                strokeWidth={T}
                strokeLinecap="round"
                style={{
                  strokeDasharray: pLen, strokeDashoffset: pLen,
                  opacity: hovered && hovered !== s.label ? 0.3 : 1,
                  transform: hovered === s.label ? 'scale(1.04)' : 'scale(1)',
                  transition: 'opacity 0.2s, transform 0.2s',
                  cursor: 'pointer',
                  transformOrigin: `${CX}px ${CY}px`,
                }}
                onMouseEnter={() => setHovered(s.label)}
                onMouseMove={(e) => moveTooltip(e, s.label)}
                onMouseLeave={() => { setHovered(null); hideTooltip(); }}
              />
            );
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <AnimatePresence mode="wait">
            {hovered && (
              <Motion.div key="h" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.1 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {((data.find(d => d[0] === hovered)?.[1] / total) * 100).toFixed(0)}%
                </span>
                <span style={{ fontSize: 10, fontWeight: 300, color: C.gray200, letterSpacing: 'normal', marginTop: 4 }}>
                  {data.find(d => d[0] === hovered)?.[1]} un.
                </span>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p style={{ fontSize: 12, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', marginTop: 8 }}>{title}</p>
      <Legend entries={data} getColor={(label, i) => getColor(label, i)} />
    </div>
  );
}

const BarTable = ({ entries, totalUnits, sectionTitle }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
      <h4 style={{ fontSize: 12, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>{sectionTitle}</h4>
      <div style={{ display: 'flex', gap: 16, paddingRight: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 300, color: C.gray200, letterSpacing: '-0.02em', width: 80, textAlign: 'right', whiteSpace: 'nowrap' }}>% de vendas</span>
        <span style={{ fontSize: 10, fontWeight: 300, color: C.gray200, letterSpacing: '-0.02em', width: 80, textAlign: 'right', whiteSpace: 'nowrap' }}>Unidades</span>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {entries.map(([label, value]) => {
        const pct = totalUnits > 0 ? ((value / totalUnits) * 100).toFixed(1) : 0;
        return (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 300, color: C.gray200, letterSpacing: '-0.02em' }}>{label}</span>
              <div style={{ display: 'flex', gap: 16, paddingRight: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', width: 80, textAlign: 'right' }}>{pct}%</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', width: 80, textAlign: 'right' }}>{value}</span>
              </div>
            </div>
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 12, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: BAR_GRADIENT, borderRadius: 4, transition: 'width 2s ease' }} />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default function MixDistribution({ salesData }) {
  const catAgg = {}, tierAgg = {};
  let totalUnits = 0;
  salesData.forEach(s => {
    totalUnits += (s.qty || 1);
    catAgg[s.category] = (catAgg[s.category] || 0) + (s.qty || 1);
    tierAgg[s.type]    = (tierAgg[s.type]    || 0) + (s.qty || 1);
  });
  const catEntries  = Object.entries(catAgg).sort((a, b)  => b[1] - a[1]);
  const tierEntries = Object.entries(tierAgg).sort((a, b) => b[1] - a[1]);

  // Same color function for BOTH donuts — unified palette
  const getUnifiedColor = (_, i) => UNIFIED_COLORS[i % UNIFIED_COLORS.length];

  return (
    <div className="standard-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <IconPieChart />
        <h3 style={{ fontSize: 14, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>Composição de Mercado</h3>
      </div>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBlock: 8 }}>
        {/* Central text: 3 lines — "64" / "unidades" / "vendidas" */}
        <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', zIndex: 10, textAlign: 'center' }}>
          <span className="text-large" style={{
            fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1,
            color: '#94D1FF',
            textShadow: '0 0 18px rgba(91,159,255,0.85), 0 0 40px rgba(5,35,229,0.55)',
            fontFamily: 'Inter, sans-serif',
          }}>{totalUnits}</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: C.gray200, letterSpacing: 'normal', marginTop: 4, fontFamily: 'Inter, sans-serif' }}>unidades</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: C.gray200, letterSpacing: 'normal', marginTop: 1, fontFamily: 'Inter, sans-serif' }}>vendidas</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, width: '100%', position: 'relative', zIndex: 0 }}>
          <DonutChart title="Categoria"     data={catEntries}  total={totalUnits} getColor={getUnifiedColor} tooltipId={TOOLTIP_ID} />
          <DonutChart title="Especificação" data={tierEntries} total={totalUnits} getColor={getUnifiedColor} tooltipId={TOOLTIP_ID} />
        </div>
      </div>

      {/* Shared tooltip */}
      {createPortal(
        <div
          id={TOOLTIP_ID}
          style={{
            position: 'fixed',
            zIndex: 10000,
            background: '#24252E',
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 500,
            padding: '4px 16px',
            borderRadius: 9999,
            pointerEvents: 'none',
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity 0.1s ease-out',
            transform: 'translateY(-50%)',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(88,91,108,0.25)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            letterSpacing: '-0.02em',
          }}
        />,
        document.body
      )}

      <div className="card-divider" style={{ marginBlock: 16 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <BarTable entries={catEntries}  totalUnits={totalUnits} sectionTitle="Detalhamento por categoria" />
        <div className="card-divider" />
        <BarTable entries={tierEntries} totalUnits={totalUnits} sectionTitle="Detalhamento por especificação" />
      </div>
    </div>
  );
}
