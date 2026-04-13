import React, { useEffect, useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import anime from 'animejs';

const C = { white: '#FFFFFF', gray400: '#91939F', gray600: '#585B6C' };

const containerConfig = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemConfig = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 }
};

export default function KPICards({ avgTicket }) {
  const counterRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const numericVal = parseFloat((avgTicket || '').replace(/[^\d]/g, '')) || 0;
    const anim = anime({
      targets: { val: 0 },
      val: numericVal,
      round: 1,
      duration: 1000,
      easing: 'easeOutExpo',
      update: (a) => {
        if (counterRef.current)
          counterRef.current.textContent = Math.floor(a.animations[0].currentValue).toLocaleString('pt-BR');
      }
    });
    return () => anim.pause();
  }, [avgTicket]);

  return (
    <Motion.div variants={containerConfig} initial="hidden" animate="show"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
      <Motion.div
        variants={itemConfig}
        className="standard-card dashboard-card"
      >
        <p style={{ fontSize: 10, fontWeight: 300, color: C.gray600, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Ticket médio
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 300, color: C.gray400, letterSpacing: '-0.02em' }}>R$</span>
          <h3
            ref={counterRef}
            style={{ fontSize: 20, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            {(avgTicket || '').replace('R$', '').trim()}
          </h3>
        </div>
        <p style={{ fontSize: 9, fontWeight: 300, color: C.gray600, letterSpacing: 'normal', marginTop: 16 }}>
          Mix de vendas
        </p>
      </Motion.div>
    </Motion.div>
  );
}
