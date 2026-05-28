import { useEffect, useRef, useState } from 'react';

export default function CursorSpotlight() {
  const spotRef = useRef(null);
  const pos = useRef({ x: -999, y: -999 });
  const current = useRef({ x: -999, y: -999 });
  const [visible, setVisible] = useState(false);
  const rafId = useRef(null);

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };
    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave);

    // Smooth lerp loop
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      current.current.x = lerp(current.current.x, pos.current.x, 0.1);
      current.current.y = lerp(current.current.y, pos.current.y, 0.1);
      if (spotRef.current) {
        spotRef.current.style.left = current.current.x + 'px';
        spotRef.current.style.top  = current.current.y + 'px';
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      className="fixed pointer-events-none z-[1] hidden lg:block"
      style={{
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, rgba(99,102,241,0.03) 40%, transparent 70%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        willChange: 'left, top',
      }}
    />
  );
}
