import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const C = {
  white:    '#FFFFFF',
  gray200:  '#D0D1D6',
  gray400:  '#91939F',
  gray600:  '#585B6C',
  blue200:  '#94D1FF',
  blue400:  '#5B9FFF',
  divider:  'rgba(88,91,108,0.20)',
  tag:      'rgba(88,91,108,0.30)',
};

const sLabel = { fontSize: 10, fontWeight: 300, color: C.gray200, letterSpacing: '-0.02em' };
const sValue = { fontSize: 28, fontWeight: 500, color: C.white,  letterSpacing: '-0.02em', lineHeight: 1.1 };
const sValueMd = { fontSize: 20, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', lineHeight: 1.1 };

// Card title icons — 20x20px per spec
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconTrophy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="1.5" stroke={C.blue200} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <path d="M8 21h8m-4-4v4" />
    <path d="M5 7H3a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h.5" />
    <path d="M19 7h2a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-.5" />
    <path d="M5 3h14v8a7 7 0 0 1-14 0z" />
  </svg>
);

// Derive vehicle tags from salesData for the top seller
function getVehicleTags(salesData, sellerName) {
  if (!salesData || !sellerName) return [];
  const modelQty = {};
  salesData
    .filter(s => s.seller === sellerName)
    .forEach(s => {
      const firstName = (s.model || '').split(' ')[0];
      modelQty[firstName] = (modelQty[firstName] || 0) + (s.qty || 1);
    });
  return Object.entries(modelQty).sort((a, b) => b[1] - a[1]);
}

// Placeholder avatar — male/female by name heuristic
const FEMALE_NAMES = ['ana', 'carla', 'fernanda', 'juliana', 'mariana', 'camila', 'beatriz', 'leticia', 'patricia', 'sandra', 'lucia', 'renata'];
function getAvatarSrc(name) {
  const first = (name || '').split(' ')[0].toLowerCase();
  return FEMALE_NAMES.includes(first) ? '/avatar-female.png' : '/avatar-male.png';
}

function Avatar({ name, size, primary }) {
  const src = getAvatarSrc(name);
  const firstName = (name || '').split(' ')[0];
  const lastName  = (name || '').split(' ').slice(-1)[0];
  const displayName = primary ? `${firstName} ${lastName}` : firstName;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
        background: C.gray600,
      }}>
        <img src={src} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </div>
      <span style={{
        fontSize: primary ? 11 : 10,
        fontWeight: 300,
        color: primary ? C.white : C.gray200,
        letterSpacing: '-0.02em',
        textAlign: 'center',
        maxWidth: size + 16,
      }}>
        {displayName}
      </span>
    </div>
  );
}

export default function TopSellerCard({
  name, revenue,
  biggestSaleModel, biggestSaleVal, biggestSaleQty,
  totalCars,
  isVolumeLeader, isBiggestSaleLeader,
  salesData, top3Sellers,
}) {
  const metricsRef = useRef([]);
  const vehicleTags = getVehicleTags(salesData, name);
  const rank2 = top3Sellers?.[1];
  const rank3 = top3Sellers?.[2];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const anim = anime({
      targets: metricsRef.current.filter(Boolean),
      translateY: [8, 0], opacity: [0, 1],
      duration: 240, easing: 'easeOutQuad',
      delay: anime.stagger(80, { start: 100 })
    });
    return () => { anim.pause(); };
  }, []);

  return (
    <div className="standard-card" style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* === LEFT: metrics === */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

        {/* Card title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconUser />
          <h3 style={{ fontSize: 14, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>
            Executivo de Vendas Destaque
          </h3>
        </div>

        {/* 1. Receita Total */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }} ref={el => metricsRef.current[0] = el}>
          <p style={sLabel}>Receita total</p>
          <p style={sValue}>{revenue}</p>
        </div>

        <div className="card-divider" />

        {/* 2. Maior Venda Única */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }} ref={el => metricsRef.current[1] = el}>
          <p style={sLabel}>Maior venda única</p>
          <p style={sValueMd}>{biggestSaleVal}</p>
          <p style={{ fontSize: 11, fontWeight: 300, color: C.gray200, letterSpacing: '-0.02em' }}>
            {biggestSaleQty || 1} {biggestSaleQty > 1 ? 'unidades' : 'unidade'} · {biggestSaleModel}
          </p>
        </div>

        <div className="card-divider" />

        {/* 3. Volume — Vehicle tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} ref={el => metricsRef.current[2] = el}>
          <p style={sLabel}>Volume · {totalCars} un.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {vehicleTags.map(([model, qty]) => (
              <div key={model} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: C.tag, borderRadius: 9999, padding: '4px 10px',
              }}>
                <span style={{ fontSize: 11, fontWeight: 300, color: C.white, letterSpacing: '-0.02em' }}>{model}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: C.blue200, letterSpacing: '-0.02em' }}>{qty}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-divider" />

        {/* 4. Award tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {isVolumeLeader && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0C255C', border: '1.5px solid #0523E5', borderRadius: 9999, padding: '4px 10px' }}>
              <IconTrophy />
              <span style={{ fontSize: 11, fontWeight: 300, color: C.white, letterSpacing: '-0.02em' }}>Líder de Volume</span>
            </div>
          )}
          {isBiggestSaleLeader && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0C255C', border: '1.5px solid #0523E5', borderRadius: 9999, padding: '4px 10px' }}>
              <IconTrophy />
              <span style={{ fontSize: 11, fontWeight: 300, color: C.white, letterSpacing: '-0.02em' }}>Maior Venda Única</span>
            </div>
          )}
        </div>
      </div>

      {/* === RIGHT: Avatar column === */}
      <div style={{
        flexShrink: 0, width: 140, padding: '20px 20px 20px 0',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        {/* Primary avatar — 64px */}
        <Avatar name={name} size={64} primary />

        {/* Secondary avatars — 40px */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          {rank2 && <Avatar name={rank2} size={40} primary={false} />}
          {rank3 && <Avatar name={rank3} size={40} primary={false} />}
        </div>
      </div>

    </div>
  );
}
