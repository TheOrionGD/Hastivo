import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function CustomCursor() {
  const location = useLocation();
  const isSplash = location.pathname === '/' || location.pathname === '/splash';
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState([
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 },
  ]);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: coarse)').matches;
  });

  const trailRef = useRef([
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 },
  ]);

  useEffect(() => {
    if (isTouchDevice || typeof window === 'undefined') return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animId;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPosition({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    // Trailing smooth animation loop with fluid mouse tail
    const loop = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      setTrailingPos({ x: currentX, y: currentY });

      // Update multi-segment particle tail
      const pts = trailRef.current;
      let prevX = targetX;
      let prevY = targetY;
      for (let i = 0; i < pts.length; i++) {
        const factor = 0.35 - i * 0.05;
        pts[i].x += (prevX - pts[i].x) * factor;
        pts[i].y += (prevY - pts[i].y) * factor;
        prevX = pts[i].x;
        prevY = pts[i].y;
      }
      setTrail([...pts]);

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    // Interactive element hover listeners
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.lexicon-chip') ||
        target.closest('.interactive-trigger') ||
        target.closest('.swiss-action-btn') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('select')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, isTouchDevice]);

  if (isTouchDevice || !isVisible || isSplash) return null;

  return (
    <>
      {/* Fluid Glowing Mouse Tail Segments */}
      {trail.map((pt, idx) => {
        const size = Math.max(2, 6 - idx);
        const opacity = Math.max(0.08, 0.45 - idx * 0.08);
        return (
          <div
            key={idx}
            className="custom-cursor-tail"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              background: idx % 2 === 0 ? '#6FA3EF' : '#FF6F61',
              boxShadow: `0 0 ${8 - idx}px ${idx % 2 === 0 ? 'rgba(111,163,239,0.8)' : 'rgba(255,111,97,0.8)'}`,
              pointerEvents: 'none',
              zIndex: 9997 - idx,
              transform: `translate3d(${pt.x - size / 2}px, ${pt.y - size / 2}px, 0)`,
              opacity: isClicked ? opacity * 0.5 : opacity,
            }}
          />
        );
      })}

      {/* Precision Core Dot */}
      <div
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#ffffff',
          boxShadow: '0 0 10px #ffffff, 0 0 20px rgba(111,163,239,0.85)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: `translate3d(${position.x - 3}px, ${position.y - 3}px, 0)`,
          transition: 'transform 0.03s linear, opacity 0.2s ease',
          opacity: isClicked ? 0.6 : 1,
        }}
      />

      {/* Trailing Soft Halo Ring */}
      <div
        className="custom-cursor-halo"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '46px' : '24px',
          height: isHovered ? '46px' : '24px',
          borderRadius: '50%',
          border: `1.5px solid ${isHovered ? 'rgba(255, 111, 97, 0.8)' : 'rgba(111, 163, 239, 0.5)'}`,
          background: isHovered ? 'rgba(255, 111, 97, 0.10)' : 'transparent',
          boxShadow: isHovered ? '0 0 20px rgba(255, 111, 97, 0.4)' : '0 0 12px rgba(111, 163, 239, 0.25)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: `translate3d(${trailingPos.x - (isHovered ? 23 : 12)}px, ${trailingPos.y - (isHovered ? 23 : 12)}px, 0) scale(${isClicked ? 0.85 : 1})`,
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
        }}
      />
    </>
  );
}
