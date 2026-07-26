import { useState, useEffect } from 'react';

type MousePosition = { x: number; y: number };

export function useMousePosition(): MousePosition | null {
  const [position, setPosition] = useState<MousePosition | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}
