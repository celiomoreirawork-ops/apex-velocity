import React from 'react';

const C = {
  black:    '#000000',
  gray900:  '#24252E',
  gray600:  '#585B6C',
  gray400:  '#91939F',
  gray200:  '#D0D1D6',
  blue400:  '#5B9FFF',
  blue700:  '#0523E5',
  white:    '#FFFFFF',
};

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'team',
    label: 'Time',
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function Sidebar({ activePage, onPageChange, status }) {
  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: 200,
      height: '100vh',
      background: C.gray900,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 40,
      // NO border on right edge — depth from bg contrast only
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 32 }}>
        <img
          src="/apex-dash-logo.svg"
          alt="Apex Dash"
          style={{ height: 20, width: 'auto', display: 'block' }}
        />
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const { id, label, Icon: MyIcon } = item;
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onPageChange(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                background: isActive ? 'rgba(91,159,255,0.12)' : 'transparent',
                color: isActive ? C.white : C.gray400,
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 500 : 300,
                letterSpacing: '-0.02em',
                width: '100%',
                textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <MyIcon />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Sync indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
          background: status === 'live' ? C.blue400 : C.gray600,
          opacity: status === 'live' ? 1 : 0.5,
        }} />
        <span style={{ fontSize: 9, fontWeight: 300, color: C.gray600, letterSpacing: 'normal' }}>
          {status === 'live' ? 'Sincronizado' : 'Sincronizando...'}
        </span>
      </div>
    </aside>
  );
}
