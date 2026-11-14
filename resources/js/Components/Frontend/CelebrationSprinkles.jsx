import { useEffect, useMemo, useState } from 'react';

const COLORS = ['#febd69', '#1e3a2d', '#ef4444', '#3b82f6', '#eab308', '#ec4899', '#22c55e', '#a855f7'];

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

export default function CelebrationSprinkles({ durationMs = 4500 }) {
    const [visible, setVisible] = useState(true);

    const pieces = useMemo(
        () =>
            Array.from({ length: 72 }, (_, index) => ({
                id: index,
                left: randomBetween(0, 100),
                delay: randomBetween(0, 1.2),
                duration: randomBetween(2.2, 4.5),
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                width: randomBetween(3, 7),
                height: randomBetween(8, 16),
                rotation: randomBetween(0, 360),
            })),
        [],
    );

    useEffect(() => {
        const timer = window.setTimeout(() => setVisible(false), durationMs);

        return () => window.clearTimeout(timer);
    }, [durationMs]);

    if (!visible) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
            {pieces.map((piece) => (
                <span
                    key={piece.id}
                    className="celebration-sprinkle absolute rounded-sm"
                    style={{
                        left: `${piece.left}%`,
                        top: '-4%',
                        width: `${piece.width}px`,
                        height: `${piece.height}px`,
                        backgroundColor: piece.color,
                        transform: `rotate(${piece.rotation}deg)`,
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${piece.duration}s`,
                    }}
                />
            ))}
            <style>{`
                @keyframes celebration-sprinkle-fall {
                    0% {
                        transform: translate3d(0, 0, 0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translate3d(0, 110vh, 0) rotate(720deg);
                        opacity: 0;
                    }
                }
                .celebration-sprinkle {
                    animation-name: celebration-sprinkle-fall;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                }
            `}</style>
        </div>
    );
}
