import { useEffect, useRef, useState } from 'react';

export default function CursorSpotlight() {
  const spotRef = useRef(null);
  const pos = useRef({ x: -999, y: -999 });
  const current = useRef({ x: -999, y: -999 });
  const [visible, setVisible] = useState(false);
  const rafId = useRef(null);

  useEffect(() => {
    // This effect is decorative only. Skip it entirely on touch/coarse-pointer
    // devices and for users who prefer reduced motion.
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return undefined;

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      current.current.x = lerp(current.current.x, pos.current.x, 0.14);
      current.current.y = lerp(current.current.y, pos.current.y, 0.14);
      if (spotRef.current) {
        spotRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }

      const dx = Math.abs(current.current.x - pos.current.x);
      const dy = Math.abs(current.current.y - pos.current.y);
      if (dx > 0.2 || dy > 0.2) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        rafId.current = null;
      }
    };

    const requestAnimation = () => {
      if (rafId.current == null) rafId.current = requestAnimationFrame(animate);
    };

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
      requestAnimation();
    };

    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  return (
    <div
      ref={spotRef}
      aria-hidden="true"
      className="fixed pointer-events-none z-[1] hidden lg:block"
      style={{
        left: 0,
        top: 0,
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, rgba(99,102,241,0.03) 40%, transparent 70%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        willChange: visible ? 'transform, opacity' : 'auto',
      }}
    />
  );
}
