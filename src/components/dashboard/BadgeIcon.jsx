import React from 'react';

const STROKE = '#5B9FFF';

const svgStyle = {
  width: 'auto',
  height: 32,
  flexShrink: 0,
  stroke: STROKE,
  strokeWidth: 2,
  fill: 'none',
};

const icons = {
  ritmo: (
    <svg viewBox="0 0 32 32" aria-hidden="true" style={{ ...svgStyle, width: 32 }}>
      <path d="M4 24L12 16L17 20L28 9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 9H28V14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 28H28" strokeLinecap="round" />
    </svg>
  ),
  tracao: (
    <svg viewBox="0 0 32 32" aria-hidden="true" style={{ ...svgStyle, width: 32 }}>
      <circle cx="16" cy="16" r="4" />
      <path d="M16 4V8M16 24V28M4 16H8M24 16H28M7.5 7.5L10.5 10.5M21.5 21.5L24.5 24.5M24.5 7.5L21.5 10.5M10.5 21.5L7.5 24.5" strokeLinecap="round" />
    </svg>
  ),
  avanco: (
    <svg viewBox="0 0 36 32" aria-hidden="true" style={{ ...svgStyle, width: 36 }}>
      <path d="M3 24L13 14L18 19L29 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 8H29V15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 28L18 18L23 23L33 13" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  ),
  lendario: (
    <svg viewBox="0 0 34 32" aria-hidden="true" style={{ ...svgStyle, width: 34 }}>
      <path d="M17 3L20.7 10.5L29 11.6L23 17.4L24.5 25.8L17 21.6L9.5 25.8L11 17.4L5 11.6L13.3 10.5L17 3Z" strokeLinejoin="round" />
      <path d="M29.5 4.5L30.8 7.3L33.5 8.6L30.8 9.9L29.5 12.7L28.2 9.9L25.5 8.6L28.2 7.3L29.5 4.5Z" strokeLinejoin="round" />
    </svg>
  ),
};

export default function BadgeIcon({ level, title }) {
  const icon = icons[level] || null;

  if (!icon) return null;

  return (
    <span role="img" aria-label={title || level} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>
      {icon}
    </span>
  );
}
