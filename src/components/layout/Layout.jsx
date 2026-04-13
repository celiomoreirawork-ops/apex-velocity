import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children, status }) {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000000' }}>
      {/* Sidebar — 200px fixed */}
      <Sidebar activePage={activePage} onPageChange={setActivePage} status={status} />

      {/* Content area — 24px gap from sidebar, 24px padding on all remaining edges */}
      <main style={{
        flex: 1,
        marginLeft: 200,
        padding: 24,
        minHeight: '100vh',
        background: '#000000',
      }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
