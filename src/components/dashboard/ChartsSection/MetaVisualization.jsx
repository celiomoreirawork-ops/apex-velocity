import React, { useEffect, useRef, useState, useMemo } from 'react';
import anime from 'animejs';
import { parseMeta, formatMetaDisplay } from '../../../utils/formatters';

import BadgeIcon from '../BadgeIcon';

const C = {
  white:   '#FFFFFF',
  gray200: '#D0D1D6',
  gray400: '#91939F',
  gray600: '#585B6C',
  gray900: '#24252E',
  blue400: '#5B9FFF',
  blue700: '#0523E5',
  blue950: '#1B0056',
  divider: 'rgba(88,91,108,0.20)',
};

const sLabel = { fontSize: 10, fontWeight: 300, color: C.gray200, letterSpacing: '-0.02em' };
const sValue = { fontSize: 20, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', lineHeight: 1.1 };

// Card title icon
const IconTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconEdit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" stroke={C.gray400} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, flexShrink: 0 }}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// Subcard icons — all blue-400 stroke, 1.5px
const IconCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke={C.blue400} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke={C.blue400} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const formatFullBRL = (val) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val || 0);

// KPIBlock — "Meta do mês" gets Degradê 2. Others get plain surface.
// KPIBlock — Subcard standard borderRadius updated to 16px
const KPIBlock = ({ label, value, isHighlight = false }) => (
  <div style={{
    borderRadius: 16, // Doubled from 8px
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    ...(isHighlight
      ? { background: 'linear-gradient(135deg, #0523E5 0%, #1B0056 100%)' }
      : { background: 'rgba(255,255,255,0.04)' }
    ),
  }}>
    <p style={sLabel}>{label}</p>
    <p style={sValue}>{value}</p>
  </div>
);

export default function MetaVisualization({ percent, rawRealized, rawTarget, onTargetChange, avgTicket, topModel }) {
  const containerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animatedGaugePercent, setAnimatedGaugePercent] = useState(0);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [editMetaText, setEditMetaText] = useState(formatMetaDisplay(rawTarget || 2000000));

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHasAnimated(true); }, { threshold: 0.1 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const currentLevel = useMemo(() => {
    if (percent >= 175) return 'lendario';
    if (percent >= 150) return 'avanco';
    if (percent >= 125) return 'tracao';
    if (percent >= 100) return 'ritmo';
    return null;
  }, [percent]);

  useEffect(() => {
    if (!hasAnimated) return;
    const cappedPercent = Math.min(percent, 175);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const frame = window.requestAnimationFrame(() => setAnimatedGaugePercent(cappedPercent));
      return () => window.cancelAnimationFrame(frame);
    }

    const animationState = { value: 0 };
    const anim = anime({
      targets: animationState,
      value: cappedPercent,
      duration: 1200,
      easing: 'easeOutExpo',
      update: () => setAnimatedGaugePercent(animationState.value),
    });

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
  const normalizedGauge = Math.min(animatedGaugePercent / 175, 1);
  const gaugeRadius = 64;
  const gaugeLength = Math.PI * gaugeRadius;
  const gaugeOffset = gaugeLength * (1 - normalizedGauge);
  const showOverTargetGlow = percent > 100;

  return (
    <div
      ref={containerRef}
      className="standard-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: '100%',
        position: 'relative',
      }}
    >

      {/* Achievement badge */}
      {percent >= 100 && currentLevel && (
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 20, pointerEvents: 'none' }}>
          <BadgeIcon level={currentLevel} title={currentLevel} />
        </div>
      )}

      {/* Card title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconTarget />
        <h3 style={{ fontSize: 14, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>
          Objetivo Mensal
        </h3>
      </div>

      {/* KPI grid — all 6 items follow the subcard standard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <KPIBlock label="Meta do mês"                          value={formatFullBRL(rawTarget)} isHighlight />
        <KPIBlock label="Receita atual"                        value={formatFullBRL(rawRealized)} />
        <KPIBlock label={isSurplus ? 'Excedente' : 'Faltante'} value={(isSurplus ? '+' : '') + formatFullBRL(Math.abs(diff))} />
        <KPIBlock label="Fat. atingido"                        value={`${percent.toFixed(0)}%`} />
        <KPIBlock label="Ticket Médio"                         value={avgTicket || '--'} />
        <KPIBlock label="Best Seller"                          value={topModel || '--'} />
      </div>

      {/* Dual arc telemetry gauge */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
          padding: '12px 8px',
        }}
      >
        <svg
          viewBox="0 0 220 170"
          role="img"
          aria-label={`Faturamento atingido: ${percent.toFixed(0)}%`}
          style={{ width: '100%', maxWidth: 280, height: 'auto', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="goalGaugeGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#5B9FFF" />
              <stop offset="28.57%" stopColor="#5B9FFF" />
              <stop offset="57.14%" stopColor="#0523E5" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>

          <path
            d="M 74 148 A 64 64 0 0 1 74 20"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 146 148 A 64 64 0 0 0 146 20"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />

          <path
            d="M 74 148 A 64 64 0 0 1 74 20"
            stroke="url(#goalGaugeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={gaugeLength}
            strokeDashoffset={gaugeOffset}
            style={{
              filter: showOverTargetGlow ? `drop-shadow(0 0 ${6 + ((Math.min(percent, 175) - 100) / 75) * 8}px rgba(212,175,55,0.55))` : 'none',
            }}
          />
          <path
            d="M 146 148 A 64 64 0 0 0 146 20"
            stroke="url(#goalGaugeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={gaugeLength}
            strokeDashoffset={gaugeOffset}
            style={{
              filter: showOverTargetGlow ? `drop-shadow(0 0 ${6 + ((Math.min(percent, 175) - 100) / 75) * 8}px rgba(212,175,55,0.55))` : 'none',
            }}
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: '"DS-Digital", "Share Tech Mono", "JetBrains Mono", monospace',
              fontSize: 32,
              letterSpacing: '2px',
              color: C.white,
              lineHeight: 1,
            }}
          >
            {`${percent.toFixed(0)}%`}
          </span>
          <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.60)', textAlign: 'center', lineHeight: 1.25, marginTop: 6 }}>
            Faturamento <br /> atingido
          </p>
        </div>
      </div>

      <div className="card-divider" />

      {/* Edit meta action */}
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
          <span style={{ fontSize: 11, fontWeight: 300, color: C.gray200, letterSpacing: '-0.02em' }}>
            Editar meta mensal
          </span>
        </button>
      )}
    </div>
  );
}
