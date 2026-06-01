diff --git a/components/Hero/HeroVisuals.tsx b/components/Hero/HeroVisuals.tsx
index 1840a805445229edfb79388b951c42f19c7a2ac2..b21f1b4ac95e21a23a8722a80f7320ba50b5e91d 100644
b/components/Hero/HeroVisuals.tsx
@@ -1,238 +1,263 @@
 import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UsersRound } from 'lucide-react';
 import { TeamMember } from '../../types';
 import PonloeLogo from '../PonloeLogo';
 import { useLanguage } from '../../contexts/LanguageContext';
 
 interface HeroVisualsProps {
   team: TeamMember[];
   onMemberClick: (member: TeamMember) => void;
 }
 
const NODE_SIZE = 'h-20 w-20';
 
 const HeroVisuals: React.FC<HeroVisualsProps> = ({ team, onMemberClick }) => {
   const { t } = useLanguage();
   const [isOrbiting, setIsOrbiting] = useState(true);
   const [isCoreHovered, setIsCoreHovered] = useState(false);
  const [isOrbitHovered, setIsOrbitHovered] = useState(false);
   const [rotationAngle, setRotationAngle] = useState(0);
   const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);
   const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
 
   const animationRef = useRef<number>(0);
   const constellationRef = useRef<HTMLDivElement>(null);
   const requestRef = useRef<number>(0);
   const lastFrame = useRef<number>(0);
   const mouse = useRef({ x: 0, y: 0 });
   const smoothMouse = useRef({ x: 0, y: 0 });
 
   const particles = useMemo(() => {
     return Array.from({ length: 18 }).map((_, i) => ({
       x: (13 + i * 29) % 100,
       y: (19 + i * 37) % 100,
       z: ((i * 17) % 90) - 45,
       size: 1.2 + (i % 4) * 0.55,
       duration: 9 + (i % 6) * 1.6,
       delay: (i % 7) * 0.35,
     }));
   }, []);
 
   useEffect(() => {
     const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
     const update = () => setPrefersReducedMotion(mediaQuery.matches);
     update();
     mediaQuery.addEventListener('change', update);
     return () => mediaQuery.removeEventListener('change', update);
   }, []);
 
   useEffect(() => {
    if (!isOrbiting || isOrbitHovered || hoveredMemberId || prefersReducedMotion) {
       cancelAnimationFrame(animationRef.current);
       return;
     }
 
     const animateRotation = (timestamp: number) => {
       if (!lastFrame.current) lastFrame.current = timestamp;
       const delta = Math.min(timestamp - lastFrame.current, 32);
       lastFrame.current = timestamp;
      const speed = isCoreHovered ? 0.00012 : 0.000075;
       setRotationAngle(prev => prev + delta * speed);
       animationRef.current = requestAnimationFrame(animateRotation);
     };
 
     animationRef.current = requestAnimationFrame(animateRotation);
 
     return () => {
       lastFrame.current = 0;
       cancelAnimationFrame(animationRef.current);
     };
  }, [isOrbiting, isCoreHovered, isOrbitHovered, hoveredMemberId, prefersReducedMotion]);
 
   useEffect(() => {
     if (prefersReducedMotion) return;
 
     const handleMouseMove = (e: MouseEvent) => {
       mouse.current = {
         x: (e.clientX / window.innerWidth) * 2 - 1,
         y: (e.clientY / window.innerHeight) * 2 - 1,
       };
     };
 
     window.addEventListener('mousemove', handleMouseMove, { passive: true });
 
     const animate = () => {
       smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.045;
       smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.045;
 
       if (constellationRef.current) {
         const x = smoothMouse.current.x;
         const y = smoothMouse.current.y;
         constellationRef.current.style.transform = `perspective(1100px) rotateY(${x * 4.5}deg) rotateX(${-y * 4.5}deg) translate3d(${x * 8}px, ${y * 8}px, 0)`;
       }
 
       requestRef.current = requestAnimationFrame(animate);
     };
 
     requestRef.current = requestAnimationFrame(animate);
 
     return () => {
       window.removeEventListener('mousemove', handleMouseMove);
       cancelAnimationFrame(requestRef.current);
     };
   }, [prefersReducedMotion]);
 
   const getDynamicPosition = (index: number, total: number, currentRotation: number) => {
     const safeTotal = Math.max(total, 1);
     const angle = (index / safeTotal) * 2 * Math.PI - (Math.PI / 2) + currentRotation;
     const radiusBase = safeTotal > 7 ? 40 : 37;
     const radiusVar = index % 2 === 0 ? 3 : -2.5;
     const radius = radiusBase + radiusVar;
     const left = 50 + radius * Math.cos(angle);
     const top = 50 + radius * Math.sin(angle);
     const depth = 18 + (index % 4) * 9;
 
     return {
       left: `${left}%`,
       top: `${top}%`,
       depth,
     };
   };
 
  const activeMemberIndex = team.findIndex(member => member.id === hoveredMemberId);
  const activeMemberPosition = activeMemberIndex >= 0
    ? getDynamicPosition(activeMemberIndex, team.length, rotationAngle)
    : null;
  const isPaused = !isOrbiting || isOrbitHovered || Boolean(hoveredMemberId) || prefersReducedMotion;
 
   return (
     <>
       <div className="lg:hidden w-full max-w-xl mx-auto mt-4">
         <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white/80 p-4 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
           <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_90%_80%,rgba(236,72,153,0.14),transparent_30%)]" />
           <div className="relative z-10 flex items-center justify-between gap-4">
             <div>
               <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-indigo-500 dark:text-indigo-300">
                 <UsersRound size={15} /> {t('Team constellation', 'ក្រុមការងារ')}
               </div>
               <p className="mt-2 text-sm font-bold leading-6 text-gray-700 dark:text-gray-300 font-khmer">
                 {t('Tap a creative mind behind the build.', 'ចុចមើលសមាជិកដែលនៅពីក្រោយការងារ។')}
               </p>
             </div>
             <div className="flex -space-x-3">
               {team.slice(0, 5).map(member => (
                 <button
                   key={member.id}
                   type="button"
                   onClick={() => onMemberClick(member)}
                   className="h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-lg transition-transform active:scale-95 dark:border-gray-950 dark:bg-gray-800"
                   aria-label={`View ${member.name}`}
                 >
                   <img src={member.image} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
                 </button>
               ))}
             </div>
           </div>
 
           <div className="relative z-10 mt-5 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
             {team.map(member => (
               <button
                 key={member.id}
                 type="button"
                 onClick={() => onMemberClick(member)}
                 className="group flex min-w-[9.5rem] items-center gap-3 rounded-2xl border border-gray-200 bg-white/80 p-3 text-left transition-all active:scale-95 dark:border-white/10 dark:bg-gray-950/70"
               >
                 <img src={member.image} alt={member.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/20" loading="lazy" />
                 <span className="min-w-0">
                   <span className="block truncate text-sm font-black text-gray-950 dark:text-white">{member.name}</span>
                   <span className="block truncate text-[11px] font-bold text-gray-500 dark:text-gray-400">{member.role}</span>
                 </span>
               </button>
             ))}
           </div>
         </div>
       </div>
 
      <div
        className="hero-orbit-shell relative hidden h-[620px] w-full lg:block"
        data-paused={isPaused ? 'true' : 'false'}
        onMouseEnter={() => setIsOrbitHovered(true)}
        onMouseLeave={() => {
          setIsOrbitHovered(false);
          setHoveredMemberId(null);
        }}
        onFocus={() => setIsOrbitHovered(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsOrbitHovered(false);
            setHoveredMemberId(null);
          }
        }}
        style={{ perspective: '1100px' }}
      >
         <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.16),transparent_42%),radial-gradient(circle_at_70%_20%,rgba(236,72,153,0.10),transparent_26%)]" />
        <div className="hero-signal-ring pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70" />
        {activeMemberPosition && (
          <div
            className="hero-active-spotlight pointer-events-none absolute z-[15] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: activeMemberPosition.left, top: activeMemberPosition.top }}
          />
        )}
 
         <div
           ref={constellationRef}
           className="relative w-full h-full flex items-center justify-center transition-transform duration-150 ease-out preserve-3d"
           style={{ transformStyle: 'preserve-3d' }}
         >
           {particles.map((p, i) => (
             <div
               key={i}
               className="absolute rounded-full bg-indigo-300/50 dark:bg-white/25 hero-visual-particle"
               style={{
                 left: `${p.x}%`,
                 top: `${p.y}%`,
                 width: `${p.size}px`,
                 height: `${p.size}px`,
                 transform: `translateZ(${p.z}px)`,
                 animationDuration: `${p.duration}s`,
                 animationDelay: `${p.delay}s`,
                 boxShadow: `0 0 ${p.size * 5}px rgba(129,140,248,0.45)`,
               }}
             />
           ))}
 
           <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400/10" />
           <div className="absolute left-1/2 top-1/2 h-[23rem] w-[23rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
           <div className="absolute left-1/2 top-1/2 h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-purple-400/20 hero-orbit-ring" />
 
           <button
             type="button"
             className="absolute z-30 group/core rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950"
             style={{ transform: 'translateZ(56px)' }}
             onMouseEnter={() => setIsCoreHovered(true)}
             onMouseLeave={() => setIsCoreHovered(false)}
             onClick={() => setIsOrbiting(!isOrbiting)}
             aria-label={isOrbiting ? 'Pause team orbit' : 'Resume team orbit'}
           >
            <div className={`absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[70px] transition-all duration-700 ${isCoreHovered || isPaused ? 'scale-125 opacity-90' : 'scale-100 opacity-50'}`} />
            <div className={`relative flex h-24 w-24 items-center justify-center rounded-full border bg-white/90 shadow-2xl backdrop-blur-2xl transition-all duration-700 dark:bg-gray-950/90 ${isCoreHovered || isPaused ? 'scale-110 border-indigo-300 shadow-indigo-500/30' : 'border-white/20 shadow-indigo-950/30'}`}>
               <div className="absolute inset-[-10px] rounded-full border border-indigo-400/30 hero-core-ring" />
               <PonloeLogo size={138} className="scale-125" />
             </div>
           </button>
 
           <svg className="absolute inset-0 z-10 h-full w-full pointer-events-none" style={{ transform: 'translateZ(8px)' }}>
             <defs>
               <linearGradient id="heroBeamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="rgba(129, 140, 248, 0.84)" />
                 <stop offset="55%" stopColor="rgba(168, 85, 247, 0.34)" />
                 <stop offset="100%" stopColor="rgba(236, 72, 153, 0)" />
               </linearGradient>
               <filter id="heroVisualGlow">
                 <feGaussianBlur stdDeviation="2.4" result="coloredBlur" />
                 <feMerge>
                   <feMergeNode in="coloredBlur" />
                   <feMergeNode in="SourceGraphic" />
                 </feMerge>
               </filter>
             </defs>
             {team.map((member, index) => {
               const pos = getDynamicPosition(index, team.length, rotationAngle);
               const isHovered = hoveredMemberId === member.id;
               const isActive = isHovered || isCoreHovered || !isOrbiting;
 
@@ -248,108 +273,127 @@ const HeroVisuals: React.FC<HeroVisualsProps> = ({ team, onMemberClick }) => {
                   strokeDasharray={isActive ? '0' : '4 10'}
                   className="transition-all duration-500"
                   style={{ filter: isActive ? 'url(#heroVisualGlow)' : 'none' }}
                 />
               );
             })}
           </svg>
 
           {team.map((member, index) => {
             const pos = getDynamicPosition(index, team.length, rotationAngle);
             const isHovered = hoveredMemberId === member.id;
 
             return (
               <button
                 key={member.id}
                 type="button"
                 className="absolute z-20 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950"
                 style={{
                   top: pos.top,
                   left: pos.left,
                   transform: `translate(-50%, -50%) translateZ(${pos.depth}px)`,
                   transition: 'top 520ms cubic-bezier(0.16, 1, 0.3, 1), left 520ms cubic-bezier(0.16, 1, 0.3, 1), transform 420ms cubic-bezier(0.16, 1, 0.3, 1)',
                 }}
                 onMouseEnter={() => setHoveredMemberId(member.id)}
                 onMouseLeave={() => setHoveredMemberId(null)}
                onFocus={() => setHoveredMemberId(member.id)}
                onBlur={() => setHoveredMemberId(null)}
                 onClick={() => onMemberClick(member)}
                 aria-label={`View ${member.name}`}
               >
                 <span className={`relative block rounded-full p-[3px] transition-all duration-500 ${isHovered ? 'scale-125 z-50' : 'scale-100 hover:scale-110'}`}>
                   <span className={`absolute inset-[-9px] rounded-full border transition-all duration-500 ${isHovered ? 'border-indigo-300/80 opacity-100 hero-node-ring' : 'border-white/0 opacity-0'}`} />
                   <span className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 opacity-80 blur-sm" />
                  <span className={`relative block ${NODE_SIZE} overflow-hidden rounded-full border-2 bg-gray-100 shadow-xl transition-all duration-500 dark:bg-gray-900 ${isHovered ? 'border-white shadow-indigo-500/40' : 'border-white/70 dark:border-white/20 shadow-black/20'}`}>
                     <img
                       src={member.image}
                       alt={member.name}
                       className={`h-full w-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 saturate-125' : 'scale-100 saturate-90'}`}
                       loading="lazy"
                     />
                     <span className="absolute inset-0 bg-gradient-to-t from-gray-950/45 via-transparent to-white/10" />
                   </span>
 
                  <span className={`pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-2xl border px-3 py-2 text-center backdrop-blur-xl transition-all duration-300 ${isHovered ? 'translate-y-0 border-indigo-300/50 bg-gray-950/85 text-white opacity-100 shadow-2xl shadow-indigo-500/20' : '-translate-y-2 border-white/10 bg-white/70 text-gray-600 opacity-0 dark:bg-gray-950/60 dark:text-gray-400'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-[0.16em]">{member.name}</span>
                    <span className="mt-1 block max-w-[11rem] truncate text-[10px] font-bold normal-case tracking-normal text-indigo-100/80">{member.role}</span>
                   </span>
                 </span>
               </button>
             );
           })}
         </div>
 
         <style>{`
           @keyframes heroVisualParticle {
             0%, 100% { opacity: 0.22; transform: translate3d(0, 0, 0) scale(1); }
             50% { opacity: 0.72; transform: translate3d(0, -18px, 24px) scale(1.35); }
           }
 
           @keyframes heroOrbitSpin {
             from { transform: translate(-50%, -50%) rotate(0deg); }
             to { transform: translate(-50%, -50%) rotate(360deg); }
           }
 
           @keyframes heroNodeRing {
             0%, 100% { transform: scale(1); opacity: 0.4; }
             50% { transform: scale(1.16); opacity: 1; }
           }
 
          @keyframes heroSignalSweep {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }

          .hero-signal-ring {
            background: conic-gradient(from 0deg, transparent 0deg, rgba(129, 140, 248, 0.32) 36deg, transparent 78deg, transparent 360deg);
            -webkit-mask: radial-gradient(circle, transparent 64%, #000 65%, #000 66%, transparent 67%);
            mask: radial-gradient(circle, transparent 64%, #000 65%, #000 66%, transparent 67%);
            animation: heroSignalSweep 18s linear infinite;
          }

          .hero-active-spotlight {
            background: radial-gradient(circle, rgba(255,255,255,0.48) 0%, rgba(129,140,248,0.28) 32%, transparent 70%);
            filter: blur(2px);
            box-shadow: 0 0 60px rgba(129,140,248,0.28);
            transition: left 520ms cubic-bezier(0.16, 1, 0.3, 1), top 520ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease;
          }

           .hero-visual-particle {
             animation: heroVisualParticle 12s ease-in-out infinite;
             will-change: opacity, transform;
           }
 
           .hero-orbit-ring {
             animation: heroOrbitSpin 28s linear infinite;
           }
 
           .hero-core-ring {
             animation: heroOrbitSpin 9s linear infinite;
           }
 
           .hero-node-ring {
             animation: heroNodeRing 1.8s ease-in-out infinite;
           }
 
          .hero-orbit-shell[data-paused="true"] .hero-signal-ring,
          .hero-orbit-shell[data-paused="true"] .hero-orbit-ring,
          .hero-orbit-shell[data-paused="true"] .hero-core-ring {
            animation-play-state: paused;
          }

           @media (prefers-reduced-motion: reduce) {
            .hero-signal-ring,
             .hero-visual-particle,
             .hero-orbit-ring,
             .hero-core-ring,
             .hero-node-ring {
               animation: none !important;
             }
           }
         `}</style>
       </div>
     </>
   );
 };
 
 export default HeroVisuals;
