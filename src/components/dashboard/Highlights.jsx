import React from 'react';
import { motion as Motion } from 'framer-motion';

const C = { white: '#FFFFFF', gray200: '#D0D1D6', gray400: '#91939F', gray600: '#585B6C' };

const containerConfig = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
};
const itemConfig = { hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } };

// SVG gradient defs — Degradê 2 for icon strokes (special exception per UI Standards v3.2)
const GradientDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
    <defs>
      <linearGradient id="g2-icon" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#1B0056" />
        <stop offset="100%" stopColor="#0523E5" />
      </linearGradient>
    </defs>
  </svg>
);

// ── Icons — stroke uses url(#g2-icon) — Degradê 2 ──────────────────────────
const IconTrophy = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="url(#g2-icon)" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
    <path d="M8 21h8m-4-4v4" />
    <path d="M5 7H3a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h.5" />
    <path d="M19 7h2a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-.5" />
    <path d="M5 3h14v8a7 7 0 0 1-14 0z" />
  </svg>
);
const IconBar = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="url(#g2-icon)" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6"  y1="20" x2="6"  y2="14" />
  </svg>
);
const IconStar = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="url(#g2-icon)" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconCard = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="url(#g2-icon)" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
// New icons for the 2 additional subcards
const IconDollar = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="url(#g2-icon)" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const IconTarget = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="url(#g2-icon)" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const CARDS = [
  { key: 'biggestSale',      label: 'Maior venda única',    CardIcon: IconTrophy,  getValue: p => p.biggestSaleVal,      getSub: p => `${p.biggestSaleQty || 1} ${(p.biggestSaleQty > 1) ? 'unidades' : 'unidade'} · ${p.biggestSale}` },
  { key: 'leaderVolume',     label: 'Líder de volume',      CardIcon: IconBar,     getValue: p => p.leaderVolume,        getSub: p => `${p.leaderVolumeCount} unidades` },
  { key: 'topModel',         label: 'Best-seller',          CardIcon: IconStar,    getValue: p => p.topModel,            getSub: p => `${p.topModelCount} veículos` },
  { key: 'avgTicket',        label: 'Ticket médio',         CardIcon: IconCard,    getValue: p => p.avgTicket,           getSub: () => 'Mix por transação' },
  { key: 'receitaAtual',     label: 'Receita Atual',        CardIcon: IconDollar,  getValue: p => p.receitaAtual,        getSub: () => 'Receita acumulada' },
  { key: 'fatAtingido',      label: 'Faturamento Atingido', CardIcon: IconTarget,  getValue: p => p.fatAtingido,         getSub: () => '% da meta mensal' },
];

const IconAward = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="url(#g2-icon)" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

export default function Highlights({ biggestSale, biggestSaleVal, biggestSaleQty, leaderVolume, leaderVolumeCount, topModel, topModelCount, avgTicket, receitaAtual, fatAtingido }) {
  const props = { biggestSale, biggestSaleVal, biggestSaleQty, leaderVolume, leaderVolumeCount, topModel, topModelCount, avgTicket, receitaAtual, fatAtingido };

  return (
    <Motion.div variants={containerConfig} initial="hidden" animate="show"
      className="standard-card"
      style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16, position: 'relative' }}>

      {/* Shared gradient defs for icon strokes */}
      <GradientDefs />

      {/* Card title — icon + title, no subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconAward />
        <h3 style={{ fontSize: 14, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>Unidades de Performance</h3>
      </div>

      {/* Grid — 3 columns × 2 rows = 6 subcards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, flex: 1 }}>
        {CARDS.map((card) => {
          const { key, CardIcon, label, getValue, getSub } = card;
          return (
            <Motion.div
              key={key}
              variants={itemConfig}
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 8,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 110,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
              }}
            >
              {/* Icon — stroke uses gradient 2 */}
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <CardIcon />
              </div>

              <span style={{ fontSize: 11, fontWeight: 300, color: C.gray200, letterSpacing: '-0.02em' }}>{label}</span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'auto' }}>
                <p style={{ fontSize: 18, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', lineHeight: 1 }} className="truncate">
                  {getValue(props)}
                </p>
                <p style={{ fontSize: 11, fontWeight: 300, color: C.gray200, letterSpacing: '-0.02em' }}>
                  {getSub(props)}
                </p>
              </div>
            </Motion.div>
          );
        })}
      </div>
    </Motion.div>
  );
}
