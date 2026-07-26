import { useEffect, useRef } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';
import './mouseGlow.css';

const LERP_FACTOR = 0.01;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function MouseGlow() {
  const position = useMousePosition();
  const glowRef = useRef<HTMLDivElement>(null);
  const current = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const initialized = useRef(false);

  useEffect(() => {
    if (!position) return;
    target.current = position;
    if (!initialized.current) {
      current.current = position;
      initialized.current = true;
    }
  }, [position]);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      current.current.x = lerp(current.current.x, target.current.x, LERP_FACTOR);
      current.current.y = lerp(current.current.y, target.current.y, LERP_FACTOR);

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!position) return null;

  return (
    <div
      ref={glowRef}
      className="mouse-glow"
      aria-hidden="true"
    >
      <div className="mouse-face">
        <div className="mouse-face__eyes">
          <span className="mouse-face__eye" />
          <span className="mouse-face__eye" />
        </div>
        <span className="mouse-face__mouth" />
      </div>
    </div>
  );
}

export default MouseGlow;
