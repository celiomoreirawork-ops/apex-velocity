import { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * Custom hook to trigger AnimeJS animations when elements enter the viewport.
 * Uses Intersection Observer for efficient tracking.
 */
export function useScrollAnimation() {
  const elementsRef = useRef([]);

  const registerElement = (el) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            
            // Animation configuration
            anime({
              targets: el,
              opacity: [0, 1],
              translateY: [30, 0],
              filter: ['blur(7px)', 'blur(0px)'],
              scale: [0.96, 1],
              duration: 1000,
              easing: 'easeOutExpo',
              delay: parseInt(el.dataset.delay || 0, 10),
            });

            // Stop observing after animation starts
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    elementsRef.current.forEach((el) => {
      if (el) {
        // Prepare element state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.96)';
        el.style.filter = 'blur(7px)';
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return { registerElement };
}
