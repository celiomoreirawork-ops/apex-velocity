import React from 'react';

const C = {
  gray900: '#24252E', // standard card/sidebar background
  gray600: '#585B6C', // standard contour color
  gray400: '#91939F',
  blue400: '#5B9FFF',
  white: '#FFFFFF',
};

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: () => (
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
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const NavButton = ({ id, label, icon, isActive, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', borderRadius: 9999 }}
    >
      <button
        onClick={() => onClick(id)}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 24px',
          borderRadius: 9999,
          background: isActive
            ? 'rgba(91,159,255,0.2)'
            : isHovered
              ? 'rgba(91,159,255,0.1)'
              : 'transparent',
          color: (isActive || isHovered) ? C.white : C.gray400,
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: (isActive || isHovered) ? 600 : 400,
          letterSpacing: '-0.02em',
          width: '100%',
          textAlign: 'left',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          {React.createElement(icon)}
          {label}
        </span>
      </button>
    </div>
  );
};

export default function Sidebar({ activePage, onPageChange, status }) {
  return (
    <aside style={{
      width: '100%',
      height: '100%',
      paddingTop: 24,
      paddingBottom: 24,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo Container */}
      <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'center' }}>
        <svg 
          width="100" 
          height="auto" 
          viewBox="0 0 192 26" 
          fill="none" 
          className="apex-logo-sanitized"
          xmlns="http://www.w3.org/2000/svg" 
          style={{ display: 'block', width: 100, maxWidth: 100, height: 'auto', margin: '0 auto' }}
        >
          {/* Blue Mark (Triangles) */}
          <path d="M11.9743 19.2262L13.976 25.0309H0L4.68804 16.9106L11.9743 19.2262Z" fill="#0523E5" />
          <path d="M28.9035 25.0308H18.436L21.642 12.4536L28.9035 25.0308Z" fill="#0523E5" />
          <path d="M19.6854 9.06495L7.19043 12.5767L14.452 0L19.6854 9.06495Z" fill="#0523E5" />
          
          {/* Wordmark: APEX DASH (Sanitized Individual Paths) */}
          <path d="M52.231 19.3315H49.1714L47.814 16.356H40.6851L39.3374 19.3315H36.2983L42.7134 5.67822H45.7524L52.231 19.3315ZM41.7456 14.0142H46.7456L44.2358 8.51416L41.7456 14.0142Z" fill="#FFFFFF" /> {/* A */}
          <path d="M64.9585 5.67822C65.718 5.67825 66.4283 5.7698 67.0894 5.95264C67.7647 6.13553 68.3489 6.41652 68.8413 6.79639C69.3477 7.17622 69.7416 7.66162 70.0229 8.25244C70.3043 8.84334 70.4448 9.5542 70.4448 10.3843C70.4448 11.2001 70.3043 11.8964 70.0229 12.4731C69.7416 13.05 69.3478 13.5214 68.8413 13.8872C68.3489 14.2389 67.7647 14.4996 67.0894 14.6685C66.4283 14.8231 65.718 14.8999 64.9585 14.8999H59.3022V19.3315H56.4956V5.67822H64.9585ZM59.3022 12.6636H65.2114C67.6382 12.6636 67.6382 8.0835 65.2114 8.0835H59.3022V12.6636Z" fill="#FFFFFF" /> {/* P (Sanitized Hole) */}
          <path d="M88.7251 8.02002H78.2153V11.4185H86.8257V13.6343H78.2153V16.9897H88.7456V19.3315H75.4087V5.67822H88.7251V8.02002Z" fill="#FFFFFF" /> {/* E */}
          <path d="M100.587 10.4585L104.48 5.67822H107.899L102.15 12.3843L107.961 19.3315H104.395L100.533 14.3315L96.5659 19.3315H93.147L98.9663 12.4038L93.3579 5.67822H96.7769L100.587 10.4585Z" fill="#FFFFFF" /> {/* X */}
          <path d="M127.958 5.67822C129.491 5.67825 130.771 5.86128 131.798 6.22705C132.825 6.5928 133.641 7.09215 134.246 7.7251C134.865 8.34409 135.301 9.06151 135.554 9.87744C135.822 10.6934 135.956 11.5522 135.956 12.4526C135.956 13.3529 135.808 14.2184 135.512 15.0483C135.231 15.8783 134.773 16.6171 134.14 17.2642C133.521 17.8971 132.698 18.4039 131.671 18.7837C130.659 19.1494 129.42 19.3315 127.958 19.3315H120.149V5.67822H127.958ZM122.956 16.9263H127.894C128.907 16.9263 129.744 16.8069 130.405 16.5679C131.08 16.3146 131.615 15.9763 132.009 15.5542C132.403 15.1323 132.684 14.654 132.853 14.1196C133.022 13.5851 133.107 13.0293 133.107 12.4526C133.107 11.8758 133.022 11.3267 132.853 10.8062C132.684 10.2857 132.403 9.82151 132.009 9.41357C131.615 9.00557 131.08 8.68205 130.405 8.44287C129.744 8.20377 128.907 8.08351 127.894 8.0835H122.956V16.9263Z" fill="#FFFFFF" /> {/* D */}
          <path d="M155.005 19.3315H151.945L150.587 16.356H143.458L142.111 19.3315H139.072L145.488 5.67822H148.527L155.005 19.3315ZM144.519 14.0142H149.519L147.009 8.51416L144.519 14.0142Z" fill="#FFFFFF" /> {/* A */}
          <path d="M164.718 5.40381C166.688 5.40381 168.201 5.82529 169.256 6.66943C170.326 7.49951 170.846 8.64669 170.818 10.1099H168.074C168.017 9.2798 167.666 8.68172 167.019 8.31592C166.386 7.95012 165.584 7.76709 164.613 7.76709C163.713 7.76713 162.967 7.90121 162.376 8.16846C161.8 8.43572 161.511 8.89256 161.511 9.53955C161.511 9.79279 161.581 10.0184 161.722 10.2153C161.863 10.3982 162.102 10.56 162.44 10.7007C162.778 10.8413 163.234 10.9755 163.811 11.1021C164.388 11.2286 165.105 11.3544 165.963 11.481C166.765 11.5935 167.49 11.7489 168.137 11.9458C168.798 12.1287 169.361 12.3746 169.826 12.6841C170.304 12.9795 170.67 13.3595 170.923 13.8237C171.177 14.288 171.303 14.8584 171.303 15.5337C171.303 16.3635 171.085 17.0877 170.649 17.7065C170.227 18.3114 169.566 18.783 168.666 19.1206C167.779 19.4582 166.625 19.6274 165.205 19.6274C164.192 19.6274 163.298 19.5221 162.524 19.311C161.75 19.0859 161.082 18.7901 160.519 18.4243C159.956 18.0585 159.499 17.6573 159.147 17.2212C158.795 16.7853 158.542 16.3495 158.387 15.9136C158.247 15.4774 158.191 15.0827 158.219 14.731H161.068C161.124 15.2093 161.342 15.6456 161.722 16.0396C162.116 16.4194 162.629 16.7227 163.262 16.9478C163.895 17.1588 164.606 17.2642 165.394 17.2642C166.111 17.2642 166.702 17.1864 167.167 17.0317C167.631 16.877 167.976 16.6588 168.201 16.3774C168.426 16.0961 168.539 15.7586 168.539 15.3647C168.539 14.985 168.398 14.6965 168.117 14.4995C167.835 14.2885 167.392 14.1193 166.787 13.9927C166.182 13.852 165.387 13.7115 164.402 13.5708C163.628 13.4583 162.897 13.3029 162.208 13.106C161.518 12.8949 160.906 12.6278 160.372 12.3042C159.851 11.9806 159.436 11.5868 159.126 11.1226C158.831 10.6442 158.683 10.0813 158.683 9.43408C158.683 8.63227 158.909 7.92863 159.359 7.32373C159.823 6.71896 160.506 6.24725 161.406 5.90967C162.306 5.57215 163.41 5.40385 164.718 5.40381Z" fill="#FFFFFF" /> {/* S */}
          <path d="M178.908 11.313H188.932V5.67822H191.739V19.3315H188.932V13.6548H178.908V19.3315H176.101V5.67822H178.908V11.313Z" fill="#FFFFFF" /> {/* H */}
        </svg>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            {...item}
            isActive={activePage === item.id}
            onClick={onPageChange}
          />
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div style={{
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        paddingBottom: 24,
        width: '100%',
      }}>
        {/* Sync indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: status === 'live' ? C.blue400 : C.gray600,
            boxShadow: status === 'live' ? `0 0 10px ${C.blue400}` : 'none',
            transition: 'all 0.3s'
          }} />
          <span style={{ fontSize: 10, fontWeight: 500, color: C.gray600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {status === 'live' ? 'Sincronizado' : 'Offline'}
          </span>
        </div>

        {/* Brand signature */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 9, fontWeight: 300, color: C.gray400, letterSpacing: 'normal' }}>
            Desenvolvido por CM Design | 2026
          </p>
        </div>
      </div>
    </aside>
  );
}
