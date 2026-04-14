import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children, status }) {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#24252E' }}>
      <aside style={{ width: 240, paddingLeft: 24, paddingRight: 24 }}>
        <Sidebar activePage={activePage} onPageChange={setActivePage} status={status} />
      </aside>

      {/* Vertical divider respecting global vertical padding */}
      <div style={{ width: 2, background: '#111111', marginTop: 24, marginBottom: 24, flexShrink: 0 }} />

      <main style={{
        flex: 1,
        padding: 24,
        background: '#24252E',
      }}>
        <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
