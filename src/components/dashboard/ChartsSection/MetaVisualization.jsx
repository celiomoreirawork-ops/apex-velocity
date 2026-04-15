import React, { useEffect, useRef, useState, useMemo } from 'react';
import anime from 'animejs';
import { parseMeta, formatMetaDisplay } from '../../../utils/formatters';

const C = {
  white:   '#FFFFFF',
  gray200: '#D0D1D6',
  gray400: '#91939F',
  gray600: '#585B6C',
  gray900: '#24252E',
  blue400: '#5B9FFF',
  blue700: '#0523E5',
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

const formatCompactValue = (value = 0) => {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1000000) {
    const compact = abs / 1000000;
    const rounded = Number(compact.toFixed(1));
    return `${sign}${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}M`;
  }

  if (abs >= 1000) {
    const compact = abs / 1000;
    const rounded = Number(compact.toFixed(1));
    return `${sign}${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}K`;
  }

  return `${value}`;
};

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
      ? { background: 'linear-gradient(135deg, #5B9FFF 0%, #0523E5 100%)' }
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

  const badgeLevels = useMemo(() => ([
    { threshold: 100, label: 'Ritmo', legend: '(acima de 100%)' },
    { threshold: 135, label: 'Tração', legend: '(acima de 135%)' },
    { threshold: 150, label: 'Avanço', legend: '(acima de 150%)' },
    { threshold: 175, label: 'Lendário', legend: '(acima de 175%)' },
  ]), []);

  useEffect(() => {
    if (!hasAnimated) return;
    const cappedPercent = Math.min(Math.max(percent, 0), 175);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const frame = window.requestAnimationFrame(() => setAnimatedGaugePercent(cappedPercent));
      return () => window.cancelAnimationFrame(frame);
    }

    const animationState = { value: 0 };
    const anim = anime({
      targets: animationState,
      value: cappedPercent,
      duration: 1200,
      easing: 'easeOutCubic',
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
  const gaugeRadius = 96;
  const gaugeLength = Math.PI * gaugeRadius;
  const gaugeOffset = gaugeLength * (1 - normalizedGauge);
  const realizedDisplay = formatCompactValue(rawRealized || 0);
  const isOverTarget = percent > 100;

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

      {/* Arc telemetry gauge */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px 8px 20px',
          gap: 24,
        }}
      >
        <style>{`
          @keyframes goalGaugePulse {
            0%, 100% { opacity: 0.55; transform: scale(0.995); }
            50% { opacity: 0.95; transform: scale(1.005); }
          }
        `}</style>
        <svg
          viewBox="0 0 260 180"
          role="img"
          aria-label={`Faturamento atingido: ${percent.toFixed(0)}%`}
          style={{ width: '100%', maxWidth: 320, height: 'auto', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="goalGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5B9FFF" />
              <stop offset="100%" stopColor="#0523E5" />
              {isOverTarget && (
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  from="-1 0"
                  to="1 0"
                  dur="3.2s"
                  repeatCount="indefinite"
                />
              )}
            </linearGradient>
          </defs>

          <path
            d="M 34 146 A 96 96 0 0 1 226 146"
            stroke="rgba(88,91,108,0.62)"
            strokeWidth="28"
            strokeLinecap="round"
            fill="none"
          />

          <path
            d="M 34 146 A 96 96 0 0 1 226 146"
            stroke="url(#goalGaugeGradient)"
            strokeWidth="28"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${gaugeLength} ${gaugeLength}`}
            strokeDashoffset={gaugeOffset}
            style={{
              filter: isOverTarget
                ? 'drop-shadow(0 0 8px rgba(91,159,255,0.35)) drop-shadow(0 0 16px rgba(5,35,229,0.28))'
                : 'drop-shadow(0 0 6px rgba(5,35,229,0.26))',
              animation: isOverTarget ? 'goalGaugePulse 2.8s ease-in-out infinite' : 'none',
              transformOrigin: '130px 146px',
            }}
          />

          <text x="34" y="168" fill="rgba(208,209,214,0.55)" fontSize="10" fontWeight="400" textAnchor="middle">0%</text>
          <text x="226" y="168" fill="rgba(208,209,214,0.55)" fontSize="10" fontWeight="400" textAnchor="middle">175%</text>
        </svg>

        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            top: '63%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            gap: 2,
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 38,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: C.white,
              lineHeight: 0.98,
            }}
          >
            {realizedDisplay}
          </p>
          <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.60)', textAlign: 'center', lineHeight: 1.05, marginTop: 6 }}>
            faturamento atingido
          </p>
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 24 }}>
            {badgeLevels.map((badge) => {
              const isActive = percent >= badge.threshold;
              return (
                <div
                  key={badge.threshold}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 94,
                    transform: `scale(${isActive ? 1.04 : 1})`,
                    transition: 'all 260ms ease-out',
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: C.gray900,
                      border: `1px solid ${isActive ? 'rgba(91,159,255,0.75)' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? C.blue400 : 'rgba(255,255,255,0.45)',
                      filter: isActive ? 'none' : 'grayscale(1)',
                      boxShadow: isActive ? '0 0 12px rgba(5,35,229,0.35)' : 'none',
                      transition: 'all 260ms ease-out',
                    }}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12.5 10.7 15 16.5 9.5" />
                    </svg>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {badge.label}
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 300, color: 'rgba(208,209,214,0.72)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                    {badge.legend}
                  </p>
                </div>
              );
            })}
          </div>
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
