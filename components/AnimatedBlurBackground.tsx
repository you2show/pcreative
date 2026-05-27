import React from 'react';

const AnimatedBlurBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Blob 1 - Indigo/Purple */}
      <div className="animated-blob blob-1 absolute w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-[120px]" />
      {/* Blob 2 - Pink/Rose */}
      <div className="animated-blob blob-2 absolute w-[500px] h-[500px] rounded-full bg-pink-500/15 blur-[100px]" />
      {/* Blob 3 - Blue/Cyan */}
      <div className="animated-blob blob-3 absolute w-[450px] h-[450px] rounded-full bg-cyan-500/15 blur-[110px]" />
      {/* Blob 4 - Violet */}
      <div className="animated-blob blob-4 absolute w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[90px]" />
    </div>
  );
};

export default AnimatedBlurBackground;
