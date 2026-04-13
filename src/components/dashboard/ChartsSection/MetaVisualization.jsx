import React, { useEffect, useRef, useState, useMemo } from 'react';
import anime from 'animejs';
import { parseMeta, formatMetaDisplay } from '../../../utils/formatters';

import badgeRitmo    from '../../../assets/badge-ritmo.png';
import badgeTracao   from '../../../assets/badge-tracao.png';
import badgeAvanco   from '../../../assets/badge-avanco.png';
import badgeLendario from '../../../assets/badge-lendario.png';

const C = {
  white:   '#FFFFFF',
  gray200: '#D0D1D6',
  gray400: '#91939F',
  gray600: '#585B6C',
  gray900: '#24252E',
  blue700: '#0523E5',
  divider: 'rgba(88,91,108,0.20)',
};

const sLabel = { fontSize: 10, fontWeight: 300, color: C.gray200, letterSpacing: '-0.02em' };
const sValue = { fontSize: 20, fontWeight: 500, color: C.white,  letterSpacing: '-0.02em', lineHeight: 1.1 };

// Card title icon — 20x20px per spec
const IconTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// Edit icon — 16px per spec for "Editar meta"
const IconEdit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" stroke={C.gray400} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, flexShrink: 0 }}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const badgeMap = { ritmo: badgeRitmo, tracao: badgeTracao, avanco: badgeAvanco, lendario: badgeLendario };

const formatFullBRL = (val) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val || 0);

const KPIBlock = ({ label, value }) => (
  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
    <p style={sLabel}>{label}</p>
    <p style={sValue}>{value}</p>
  </div>
);

export default function MetaVisualization({ percent, rawRealized, rawTarget, onTargetChange }) {
  const barRef = useRef(null);
  const containerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [editMetaText, setEditMetaText] = useState(formatMetaDisplay(rawTarget || 2000000));

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHasAnimated(true); }, { threshold: 0.1 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const currentLevel = useMemo(() => {
    if (percent >= 175)      return 'lendario';
    if (percent >= 150) return 'avanco';
    if (percent >= 125) return 'tracao';
    if (percent >= 100) return 'ritmo';
    return null;
  }, [percent]);

  useEffect(() => {
    if (!hasAnimated || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tw = (Math.min(percent, 175) / 175) * 100;
    const anim = anime({ targets: barRef.current, width: ['0%', `${tw}%`], duration: 1800, easing: 'easeOutQuart' });
    return () => { anim.pause(); };
  }, [hasAnimated, percent]);

  const handleSaveMeta = () => {
    const val = parseMeta(editMetaText);
    if (val > 0 && onTargetChange) onTargetChange(val);
    setIsEditingMeta(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveMeta();
    if (e.key === 'Escape') { setEditMetaText(formatMetaDisplay(rawTarget)); setIsEditingMeta(false); }
  };

  const diff = rawRealized - rawTarget;
  const isSurplus = diff > 0;

  return (
    <div ref={containerRef} className="standard-card" style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', position: 'relative', background: C.gray900 }}>

      {/* Achievement badge */}
      {percent >= 100 && currentLevel && (
        <div style={{ position: 'absolute', top: 12, right: 12, padding: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 6, zIndex: 20, pointerEvents: 'none' }}>
          <img src={badgeMap[currentLevel]} alt={currentLevel} style={{ width: 60, height: 60, objectFit: 'contain' }} />
        </div>
      )}

      {/* Card title — icon + text, no subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconTarget />
        <h3 style={{ fontSize: 14, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>
          Objetivo Mensal
        </h3>
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <KPIBlock label="Meta do mês"                          value={formatFullBRL(rawTarget)} />
        <KPIBlock label="Receita atual"                        value={formatFullBRL(rawRealized)} />
        <KPIBlock label={isSurplus ? 'Excedente' : 'Faltante'} value={(isSurplus ? '+' : '') + formatFullBRL(Math.abs(diff))} />
        <KPIBlock label="Fat. atingido"                        value={`${percent.toFixed(0)}%`} />
      </div>

      {/* Progress bar */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <div style={{ height: 16, width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 9999, overflow: 'hidden' }}>
          <div
            ref={barRef}
            style={{
              height: '100%', width: '0%', borderRadius: 9999,
              background: 'linear-gradient(60deg, #0523E5, #94D1FF)',
              transition: 'none',
            }}
          />
        </div>
        {/* Milestones */}
        <div style={{ position: 'absolute', top: '100%', marginTop: 8, width: '100%', pointerEvents: 'none' }}>
          {[0, 50, 100, 125, 150, 175].map(val => (
            <span key={val} style={{
              position: 'absolute',
              left: `${(val / 175) * 100}%`,
              transform: 'translateX(-50%)',
              fontSize: 9, fontWeight: 300, color: C.gray600, letterSpacing: 'normal'
            }}>{val}%</span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="card-divider" />

      {/* Edit meta action — replaces the legend row */}
      {isEditingMeta ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconEdit />
          <input
            autoFocus
            type="text"
            value={editMetaText}
            onChange={e => setEditMetaText(e.target.value)}
            onBlur={handleSaveMeta}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: C.gray900,
              color: C.white,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: 13,
              letterSpacing: '-0.02em',
              borderRadius: 6,
              padding: '8px 12px',
              border: `1px solid ${C.blue700}`,
              outline: 'none',
            }}
          />
        </div>
      ) : (
        <button
          onClick={() => setIsEditingMeta(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            width: 'fit-content',
          }}
        >
          <IconEdit />
          <span style={{ fontSize: 11, fontWeight: 300, color: C.gray400, letterSpacing: '-0.02em' }}>
            Editar meta mensal
          </span>
        </button>
      )}
    </div>
  );
}
