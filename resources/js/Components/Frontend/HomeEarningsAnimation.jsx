import { useMemo } from 'react';

function GearIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49 1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65Z" />
        </svg>
    );
}

function Coin({ sizeClass, style }) {
    return (
        <div className={`home-earnings-coin ${sizeClass}`} style={style} aria-hidden>
            <span className="home-earnings-coin-face">$</span>
            <span className="home-earnings-coin-shine" />
        </div>
    );
}

export default function HomeEarningsAnimation() {
    const coins = useMemo(
        () =>
            Array.from({ length: 18 }, (_, i) => ({
                id: i,
                left: `${4 + ((i * 11) % 92)}%`,
                delay: `${(i * 0.38) % 5.5}s`,
                duration: `${3.8 + (i % 5) * 0.5}s`,
                drift: `${(i % 7) - 3}rem`,
                sizeClass:
                    i % 4 === 0
                        ? 'home-earnings-coin--lg'
                        : i % 4 === 1
                          ? 'home-earnings-coin--md'
                          : 'home-earnings-coin--sm',
            })),
        [],
    );

    const sparks = useMemo(
        () =>
            Array.from({ length: 8 }, (_, i) => ({
                id: i,
                angle: i * 45,
                delay: `${i * 0.15}s`,
            })),
        [],
    );

    return (
        <section className="home-earnings-panel home-earnings-scene relative min-h-0 flex-[1_1_50%] overflow-hidden">
            <div className="home-earnings-grid pointer-events-none absolute inset-0 opacity-40" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(254,189,105,0.18),transparent_70%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0f281c] via-[#142f24] to-[#0a1f16]" />

            {coins.map((coin) => (
                <Coin
                    key={coin.id}
                    sizeClass={coin.sizeClass}
                    style={{
                        left: coin.left,
                        animationDelay: coin.delay,
                        animationDuration: coin.duration,
                        '--coin-drift': coin.drift,
                    }}
                />
            ))}

            <div className="relative flex h-full min-h-0 flex-col items-center justify-center px-4 py-6">
                <div className="home-earnings-machine relative flex items-center justify-center">
                    <div className="home-earnings-orbit pointer-events-none absolute rounded-full border border-dashed border-[#febd69]/25" />

                    {sparks.map((spark) => (
                        <span
                            key={spark.id}
                            className="home-earnings-spark pointer-events-none absolute left-1/2 top-1/2 h-0.5 w-8 origin-left -translate-y-1/2 bg-gradient-to-r from-[#febd69]/80 to-transparent"
                            style={{
                                '--spark-angle': `${spark.angle}deg`,
                                animationDelay: spark.delay,
                            }}
                        />
                    ))}

                    <div className="home-earnings-hub relative z-10">
                        <div className="home-earnings-gear-main text-[#febd69]">
                            <GearIcon className="h-[4.5rem] w-[4.5rem] sm:h-24 sm:w-24" />
                        </div>

                        <div className="home-earnings-gear-secondary absolute -right-10 -top-2 text-emerald-300/90">
                            <GearIcon className="h-14 w-14 sm:h-16 sm:w-16" />
                        </div>

                        <div className="home-earnings-gear-tertiary absolute -left-9 bottom-1 text-teal-200/80">
                            <GearIcon className="h-11 w-11 sm:h-12 sm:w-12" />
                        </div>
                    </div>

                    <div className="home-earnings-vault pointer-events-none absolute -bottom-2 left-1/2 z-0 h-3 w-32 -translate-x-1/2 rounded-full bg-[#febd69]/30 blur-md" />
                </div>

                <div className="mt-8 text-center">
                    <p className="home-earnings-pulse text-base font-semibold tracking-wide text-[#febd69] sm:text-lg">
                        Earnings in motion
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/70 sm:text-sm">
                        Your balance keeps working in the background
                    </p>
                    <div className="mt-4 flex justify-center gap-2">
                        {[0, 1, 2].map((dot) => (
                            <span
                                key={dot}
                                className="home-earnings-dot h-2 w-2 rounded-full bg-[#febd69]"
                                style={{ animationDelay: `${dot * 0.22}s` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}