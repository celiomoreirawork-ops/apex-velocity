import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { formatCurrency } from '../../utils/formatters';

const C = {
  white:    '#FFFFFF',
  gray200:  '#D0D1D6',
  gray400:  '#91939F',
  gray600:  '#585B6C',
  blue200:  '#94D1FF',
  blue400:  '#5B9FFF',
  blue700:  '#0523E5',
  divider:  'rgba(88,91,108,0.20)',
  tag:      'rgba(88,91,108,0.30)',
};

const sLabel = { fontSize: 10, fontWeight: 300, color: C.gray200, letterSpacing: '-0.02em' };
const sName = { fontSize: 16, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', textAlign: 'center' };
const sValue = { fontSize: 24, fontWeight: 600, color: C.white,  letterSpacing: '-0.02em', lineHeight: 1.1 };
const sValueSmall = { fontSize: 18, fontWeight: 600, color: C.white, letterSpacing: '-0.02em', lineHeight: 1.1 };

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconTrophy = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.5" stroke="#0523E5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, flexShrink: 0 }}>
    <path d="M8 21h8m-4-4v4" />
    <path d="M5 7H3a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h.5" />
    <path d="M19 7h2a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-.5" />
    <path d="M5 3h14v8a7 7 0 0 1-14 0z" />
  </svg>
);

const FEMALE_NAMES = ['ana', 'carla', 'fernanda', 'juliana', 'mariana', 'camila', 'beatriz', 'leticia', 'patricia', 'sandra', 'lucia', 'renata'];
function getAvatarSrc(name) {
  const first = (name || '').split(' ')[0].toLowerCase();
  return FEMALE_NAMES.includes(first) ? '/avatar-female.png' : '/avatar-male.png';
}

function Avatar({ name, size }) {
  const src = getAvatarSrc(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
      background: C.gray600, border: `2px solid #0523E5`,
    }}>
      <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
    </div>
  );
}

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

const MainExecutiveCard = ({ data, salesData, isVolumeLeader, isBiggestSaleLeader }) => {
  const vehicleTags = getVehicleTags(salesData, data.name);
  return (
    <div className="standard-card" style={{ flex: 1.4, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconUser />
        <h3 style={{ fontSize: 13, fontWeight: 500, color: C.gray200, letterSpacing: '-0.02em' }}>1º Lugar · Performance</h3>
      </div>
      
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Avatar name={data.name} size={120} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.white, letterSpacing: '-0.02em' }}>{data.name}</h2>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p style={sLabel}>Receita total acumulada</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: C.white, letterSpacing: '-0.02em', lineHeight: 1 }}>{formatCurrency(data.revenue)}</p>
          </div>
        </div>
      </div>

      <div className="card-divider" />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <p style={sLabel}>Maior venda única</p>
          <p style={{ ...sValueSmall, marginTop: 4 }}>{formatCurrency(data.biggestSingleSale?.revenue || 0)}</p>
          <p style={{ fontSize: 11, color: C.gray200, marginTop: 2 }}>
            {data.biggestSingleSale?.qty} un. · {data.biggestSingleSale?.model}
          </p>
        </div>
        <div>
          <p style={sLabel}>Volume total</p>
          <p style={{ ...sValueSmall, marginTop: 4 }}>{data.totalCars} <span style={{ fontSize: 12, fontWeight: 300 }}>unidades</span></p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {vehicleTags.slice(0, 3).map(([model, qty]) => (
                <span key={model} style={{ fontSize: 9, background: C.tag, padding: '2px 8px', borderRadius: 9999, color: C.white }}>{model}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        {isVolumeLeader && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0C255C', border: '1.5px solid #0523E5', borderRadius: 9999, padding: '4px 10px' }}>
                <IconTrophy size={12} />
                <span style={{ fontSize: 10, color: C.white }}>Líder de Volume</span>
            </div>
        )}
        {isBiggestSaleLeader && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0C255C', border: '1.5px solid #0523E5', borderRadius: 9999, padding: '4px 10px' }}>
                <IconTrophy size={12} />
                <span style={{ fontSize: 10, color: C.white }}>Maior Venda</span>
            </div>
        )}
      </div>
    </div>
  );
};

const SecondaryExecutiveCard = ({ data, rank }) => (
  <div className="standard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: C.blue400 }}>{rank}º Lugar</p>
        <Avatar name={data.name} size={48} />
    </div>
    
    <div>
        <h3 style={{ ...sName, textAlign: 'left', fontSize: 14 }}>{data.name}</h3>
    </div>

    <div className="card-divider" />

    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
            <p style={sLabel}>Receita total</p>
            <p style={{ ...sValueSmall, fontSize: 16 }}>{formatCurrency(data.revenue)}</p>
        </div>
        <div>
            <p style={sLabel}>Maior venda única</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: C.white }}>{formatCurrency(data.biggestSingleSale?.revenue || 0)}</p>
            <p style={{ fontSize: 10, color: C.gray200 }}>
                {data.biggestSingleSale?.qty} un. · {data.biggestSingleSale?.model}
            </p>
        </div>
    </div>
  </div>
);

export default function TopSellerCard({ sellersStats = [], salesData, leaderVolumeId, biggestSaleId }) {
    if (!sellersStats.length) return null;

    return (
        <div style={{ display: 'flex', gap: 8, height: '100%' }}>
            <MainExecutiveCard 
                data={sellersStats[0]} 
                salesData={salesData}
                isVolumeLeader={sellersStats[0].name === leaderVolumeId}
                isBiggestSaleLeader={sellersStats[0].biggestSingleSale?.revenue === biggestSaleId}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sellersStats[1] && (
                    <SecondaryExecutiveCard 
                        data={sellersStats[1]} 
                        rank={2}
                    />
                )}
                {sellersStats[2] && (
                    <SecondaryExecutiveCard 
                        data={sellersStats[2]} 
                        rank={3}
                    />
                )}
            </div>
        </div>
    );
}
