import React, { useState } from 'react';
import { VEHICLE_COLORS, DEFAULT_VEHICLE_COLOR } from '../../../constants/colors';

export default function PieChart({ entries, total }) {
  const [tooltip, setTooltip] = useState(null);
  const SIZE   = 90;
  const CX     = SIZE / 2;
  const CY     = SIZE / 2;
  const RADIUS = SIZE / 2 - 4;

  if (!entries.length || total <= 0) return null;

  const slices = [];
  let cumAngle = -Math.PI / 2;

  entries.forEach(([tipo, qty]) => {
    const angle = (qty / total) * 2 * Math.PI;
    const startX = CX + RADIUS * Math.cos(cumAngle);
    const startY = CY + RADIUS * Math.sin(cumAngle);
    const endAngle = cumAngle + angle;
    const endX = CX + RADIUS * Math.cos(endAngle);
    const endY = CY + RADIUS * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const color = VEHICLE_COLORS[tipo] || DEFAULT_VEHICLE_COLOR;
    const pct = ((qty / total) * 100).toFixed(0);

    const midAngle = cumAngle + angle / 2;
    const tooltipX = CX + (RADIUS * 0.65) * Math.cos(midAngle);
    const tooltipY = CY + (RADIUS * 0.65) * Math.sin(midAngle);

    slices.push({ tipo, qty, pct, color, startX, startY, endX, endY, largeArc, midAngle, tooltipX, tooltipY });
    cumAngle = endAngle;
  });

  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={`M ${CX} ${CY} L ${s.startX} ${s.startY} A ${RADIUS} ${RADIUS} 0 ${s.largeArc} 1 ${s.endX} ${s.endY} Z`}
            fill={s.color}
            opacity={tooltip?.tipo === s.tipo ? 1 : tooltip ? 0.35 : 0.85}
            style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
            onMouseEnter={() => setTooltip({ tipo: s.tipo, qty: s.qty, pct: s.pct, color: s.color })}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
        <circle cx={CX} cy={CY} r={RADIUS * 0.42} fill="#25323A" />
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-4px)' }}
        >
          <div
            className="px-2.5 py-1.5 rounded-lg text-[10px] font-black font-headline whitespace-nowrap shadow-xl border"
            style={{
              background: '#0B0E17',
              borderColor: `${tooltip.color}55`,
              color: tooltip.color,
            }}
          >
            {tooltip.tipo}: {tooltip.qty} un. ({tooltip.pct}%)
          </div>
        </div>
      )}
    </div>
  );
}
