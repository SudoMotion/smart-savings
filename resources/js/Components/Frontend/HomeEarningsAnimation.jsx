import { useMemo } from 'react';

function GearIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49 1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65Z" />
        </svg>
    );
}

export default function HomeEarningsAnimation() {
    const coins = useMemo(
        () =>
            Array.from({ length: 14 }, (_, i) => ({
                id: i,
                left: `${6 + ((i * 13) % 88)}%`,
                delay: `${(i * 0.55) % 6}s`,
                duration: `${3.2 + (i % 4) * 0.35}s`,
                sizeClass: i % 3 === 0 ? 'h-9 w-9 text-sm' : i % 3 === 1 ? 'h-7 w-7 text-xs' : 'h-6 w-6 text-[10px]',
            })),
        [],
    );

    return (
        <section
            className="home-earnings-scene relative w-full overflow-hidden bg-gradient-to-b from-[#0f281c] via-[#1a3d2e] to-[#0f281c]"
            aria-hidden
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(254,189,105,0.12),transparent_55%)]" />

            {coins.map((coin) => (
                <div
                    key={coin.id}
                    className={`home-earnings-coin pointer-events-none absolute top-0 flex items-center justify-center rounded-full border-2 border-amber-200/80 bg-gradient-to-b from-amber-300 to-amber-500 font-bold text-amber-950 shadow-[0_2px_8px_rgba(251,191,36,0.45)] ${coin.sizeClass}`}
                    style={{
                        left: coin.left,
                        animationDelay: coin.delay,
                        animationDuration: coin.duration,
                    }}
                >
                    $
                </div>
            ))}

            <div className="relative mx-auto flex min-h-[220px] max-w-[1500px] flex-col items-center justify-center px-4 py-10 sm:min-h-[260px]">
                <div className="relative flex items-center justify-center">
                    <span className="absolute h-28 w-28 rounded-full bg-[#febd69]/10 blur-2xl sm:h-36 sm:w-36" />

                    <div className="home-earnings-gear-main relative z-10 text-[#febd69]/90">
                        <GearIcon className="h-20 w-20 sm:h-24 sm:w-24" />
                    </div>

                    <div className="home-earnings-gear-secondary absolute -right-6 top-2 z-10 text-emerald-300/80 sm:-right-8 sm:top-1">
                        <GearIcon className="h-11 w-11 sm:h-14 sm:w-14" />
                    </div>

                    <div className="home-earnings-gear-tertiary absolute -left-5 bottom-0 z-10 text-emerald-400/70 sm:-left-7">
                        <GearIcon className="h-9 w-9 sm:h-11 sm:w-11" />
                    </div>
                </div>

                <p className="home-earnings-pulse mt-6 text-center text-sm font-medium tracking-wide text-emerald-100/90 sm:text-base">
                    Generating returns…
                </p>

                <div className="mt-3 flex gap-1.5">
                    {[0, 1, 2].map((dot) => (
                        <span
                            key={dot}
                            className="home-earnings-dot h-2 w-2 rounded-full bg-[#febd69]"
                            style={{ animationDelay: `${dot * 0.2}s` }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}