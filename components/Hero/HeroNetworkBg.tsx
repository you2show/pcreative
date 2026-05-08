
import React, { useMemo } from 'react';

interface NetNode {
    id: number;
    x: number;
    y: number;
    r: number;
    duration: number;
    delay: number;
    /** Float amplitude in SVG viewBox units (viewBox is 0–100 in both axes). */
    floatSvgUnits: number;
    glow: boolean;
}

interface NetEdge {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    dist: number;
}

const NODE_COUNT = 34;
const CONNECTION_THRESHOLD = 24; // max distance in SVG viewBox percentage-points (viewBox is 0–100)

const HeroNetworkBg: React.FC = () => {
    const nodes = useMemo<NetNode[]>(() => {
        // Use a seeded-like approach so the layout is stable across renders.
        // Math.random() inside useMemo with empty deps only runs once per mount.
        return Array.from({ length: NODE_COUNT }, (_, i) => ({
            id: i,
            x: (i * 31.7 + 7) % 96 + 2,
            y: (i * 47.3 + 11) % 92 + 4,
            r: 1.5 + (i % 4) * 0.6,
            duration: 9 + (i % 7) * 1.8,
            delay: -(i % 12) * 1.3,
            floatSvgUnits: 0.8 + (i % 5) * 0.35,
            glow: i % 5 === 0,
        }));
    }, []);

    const edges = useMemo<NetEdge[]>(() => {
        const pairs: NetEdge[] = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_THRESHOLD) {
                    pairs.push({
                        x1: nodes[i].x,
                        y1: nodes[i].y,
                        x2: nodes[j].x,
                        y2: nodes[j].y,
                        dist,
                    });
                }
            }
        }
        return pairs;
    }, [nodes]);

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
            <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
            >
                <defs>
                    <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(129, 140, 248, 0.9)" />
                        <stop offset="100%" stopColor="rgba(129, 140, 248, 0)" />
                    </radialGradient>
                    <filter id="netGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="0.6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Connecting lines */}
                {edges.map((e, i) => {
                    const opacity = Math.max(0.03, 0.14 * (1 - e.dist / CONNECTION_THRESHOLD));
                    return (
                        <line
                            key={i}
                            x1={e.x1}
                            y1={e.y1}
                            x2={e.x2}
                            y2={e.y2}
                            stroke="rgba(129, 140, 248, 1)"
                            strokeWidth="0.15"
                            strokeOpacity={opacity}
                        />
                    );
                })}

                {/* Nodes */}
                {nodes.map((node) => (
                    <g
                        key={node.id}
                        style={{
                            animation: `net-float-${node.id} ${node.duration}s ${node.delay}s ease-in-out infinite`,
                            transformOrigin: `${node.x}% ${node.y}%`,
                        }}
                    >
                        {node.glow && (
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.r * 2.8}
                                fill="rgba(99, 102, 241, 0.06)"
                                filter="url(#netGlowFilter)"
                            />
                        )}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.r}
                            fill={node.glow ? 'rgba(129, 140, 248, 0.55)' : 'rgba(200, 210, 255, 0.25)'}
                            style={{
                                animation: `net-pulse ${node.duration * 0.7}s ${node.delay}s ease-in-out infinite`,
                            }}
                        />
                    </g>
                ))}
            </svg>

            {/* Per-node float keyframes injected once */}
            <style>{`
                ${nodes.map((n) => `
                    @keyframes net-float-${n.id} {
                        0%, 100% { transform: translateY(0); }
                        50%       { transform: translateY(-${n.floatSvgUnits}); }
                    }
                `).join('')}

                @keyframes net-pulse {
                    0%, 100% { opacity: 0.2; }
                    50%       { opacity: 0.65; }
                }
            `}</style>
        </div>
    );
};

export default HeroNetworkBg;
