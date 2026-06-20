import React from 'react';

/**
 * Ambient backdrop — Linear-style.
 * A faint grid, a single soft electric-blue aurora at the top, and a vignette.
 * No loud multi-color blobs; just quiet depth.
 */
const AnimatedBlurBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Faint grid */}
      <div className="absolute inset-0 bg-grid-faint bg-[length:64px_64px] opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />

      {/* Top aurora glow */}
      <div className="animated-blob blob-1 absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full bg-blue-600/12 blur-[140px]" />

      {/* Secondary low cyan haze */}
      <div className="animated-blob blob-3 absolute bottom-[-10%] right-[10%] w-[460px] h-[460px] rounded-full bg-cyan-500/8 blur-[130px]" />

      {/* Vignette to deepen edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(3,6,15,0.55))]" />
    </div>
  );
};

export default AnimatedBlurBackground;
