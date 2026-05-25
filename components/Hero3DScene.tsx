import React, { useRef, useMemo } from 'react';

/**
 * Hero3DScene - A performant CSS 3D scene for the hero section
 * Uses CSS transforms and animations instead of Three.js for better performance
 */
const Hero3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const cubes = useMemo(() => 
    Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      size: 40 + Math.random() * 30,
      x: 20 + Math.random() * 60,
      y: 10 + Math.random() * 80,
      z: -100 + Math.random() * 200,
      rotateSpeed: 8 + Math.random() * 12,
      delay: i * 0.5,
    })), []);

  const spheres = useMemo(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      size: 6 + Math.random() * 14,
      x: Math.random() * 100,
      y: Math.random() * 100,
      floatDuration: 4 + Math.random() * 6,
      delay: i * 0.3,
      opacity: 0.3 + Math.random() * 0.4,
    })), []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: '1200px' }}>
      {/* Floating geometric shapes */}
      {cubes.map((cube) => (
        <div
          key={cube.id}
          className="absolute animate-spin-slow"
          style={{
            left: `${cube.x}%`,
            top: `${cube.y}%`,
            width: `${cube.size}px`,
            height: `${cube.size}px`,
            transformStyle: 'preserve-3d',
            transform: `translateZ(${cube.z}px)`,
            animationDuration: `${cube.rotateSpeed}s`,
            animationDelay: `${cube.delay}s`,
          }}
        >
          <div 
            className="w-full h-full border border-indigo-500/20 rounded-lg bg-indigo-500/5 backdrop-blur-sm"
            style={{ transform: 'rotateX(45deg) rotateY(45deg)' }}
          />
        </div>
      ))}

      {/* Glowing orbs */}
      {spheres.map((sphere) => (
        <div
          key={`sphere-${sphere.id}`}
          className="absolute rounded-full animate-float"
          style={{
            left: `${sphere.x}%`,
            top: `${sphere.y}%`,
            width: `${sphere.size}px`,
            height: `${sphere.size}px`,
            background: `radial-gradient(circle, rgba(99,102,241,${sphere.opacity}) 0%, transparent 70%)`,
            animationDuration: `${sphere.floatDuration}s`,
            animationDelay: `${sphere.delay}s`,
            boxShadow: `0 0 ${sphere.size}px rgba(99,102,241,0.3)`,
          }}
        />
      ))}

      {/* Central 3D torus/ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }}>
        <div className="w-[200px] h-[200px] animate-spin-slow" style={{ animationDuration: '20s', transformStyle: 'preserve-3d' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`ring-${i}`}
              className="absolute top-1/2 left-1/2 w-[180px] h-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400/10"
              style={{
                transform: `rotateY(${i * 30}deg) rotateX(60deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Grid floor effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[40%] opacity-20"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.05))',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom',
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

export default Hero3DScene;
