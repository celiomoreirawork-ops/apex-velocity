import { useEffect } from 'react';
import anime from 'animejs';

/**
 * Hook: efeito de shine metálico nos cards + coreografia silenciosa modo TV
 * Respeita prefers-reduced-motion automaticamente.
 */
export function useCardShine() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Injeta shine-layer em todos os standard-card existentes
    const cards = document.querySelectorAll('.standard-card');
    cards.forEach(card => {
      if (!card.querySelector('.shine-layer')) {
        const shine = document.createElement('div');
        shine.className = 'shine-layer';
        card.appendChild(shine);
        card.addEventListener('mouseenter', () => {
          anime.remove(shine);
          anime({
            targets: shine,
            translateX: ['-100%', '100%'],
            translateY: ['-100%', '100%'],
            opacity: [0, 0.32, 0],
            duration: 750,
            easing: 'easeOutSine'
          });
        });
      }
    });

    // Modo TV: dispara shine aleatório se mouse parado >5s
    let lastMouseTime = Date.now();
    const onMove = () => { lastMouseTime = Date.now(); };
    window.addEventListener('mousemove', onMove);

    const tvLoop = setInterval(() => {
      if (Date.now() - lastMouseTime > 5000) {
        const layers = document.querySelectorAll('.standard-card .shine-layer');
        if (layers.length > 0) {
          const target = layers[Math.floor(Math.random() * layers.length)];
          anime.remove(target);
          anime({
            targets: target,
            translateX: ['-100%', '100%'],
            translateY: ['-100%', '100%'],
            opacity: [0, 0.16, 0],
            duration: 1400,
            easing: 'easeInOutSine'
          });
        }
      }
    }, 4000);

    return () => {
      window.removeEventListener('mousemove', onMove);
      clearInterval(tvLoop);
    };
  }, []);
}
