import { useMemo } from 'react';

const COIN_IMAGES = [
    '/images/coin-images/eth.png',
    '/images/coin-images/usdt.webp',
    '/images/coin-images/usdc.webp',
];

function GearIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49 1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65Z" />
        </svg>
    );
}

function FallingCoin({ src, sizeClass, style }) {
    return (
        <img src={src} alt="" className={`home-earnings-coin-img ${sizeClass}`} style={style} aria-hidden draggable={false} />
    );
}

export default function HomeEarningsAnimation() {
    const coins = useMemo(
        () =>
            Array.from({ length: 18 }, (_, i) => ({
                id: i,
                src: COIN_IMAGES[i % COIN_IMAGES.length],
                left: `${4 + ((i * 11) % 40)}%`,
                delay: `${(i * 0.35) % 4}s`,
                duration: `${2.8 + (i % 4) * 0.45}s`,
                drift: `${((i % 5) - 2) * 0.35}rem`,
                sizeClass:
                    i % 3 === 0 ? 'home-earnings-coin-img--lg' : i % 3 === 1 ? 'home-earnings-coin-img--md' : 'home-earnings-coin-img--sm',
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
        <section className="home-earnings-panel home-earnings-scene relative h-full min-h-0 flex-[1_1_50%] overflow-x-hidden">
            <div className="home-earnings-grid pointer-events-none absolute inset-0 opacity-35" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_72%_48%,rgba(254,189,105,0.09),transparent_68%)]" />

            <div className="home-earnings-coins" aria-hidden>
                {coins.map((coin) => (
                    <FallingCoin
                        key={coin.id}
                        src={coin.src}
                        sizeClass={coin.sizeClass}
                        style={{
                            left: coin.left,
                            animationDelay: coin.delay,
                            animationDuration: coin.duration,
                            '--coin-drift': coin.drift,
                        }}
                    />
                ))}
            </div>

            <div className="home-earnings-gear-stage">
                <div className="home-earnings-gear-cluster">
                <div className="home-earnings-machine relative flex items-center justify-center">
                    <div className="home-earnings-orbit pointer-events-none absolute rounded-full border border-dashed border-[#b45309]/25" />

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
                        <div className="home-earnings-gear-main text-[#c9890a]">
                            <GearIcon className="h-[3.75rem] w-[3.75rem] sm:h-[4.5rem] sm:w-[4.5rem] md:h-24 md:w-24" />
                        </div>

                        <div className="home-earnings-gear-secondary absolute -right-8 top-0 text-emerald-700/85 sm:-right-10 sm:-top-1">
                            <GearIcon className="h-11 w-11 sm:h-14 sm:w-14" />
                        </div>

                        <div className="home-earnings-gear-tertiary absolute -left-7 bottom-0 text-teal-700/80 sm:-left-9 sm:bottom-1">
                            <GearIcon className="h-9 w-9 sm:h-11 sm:w-11" />
                        </div>
                    </div>

                    <div className="home-earnings-vault pointer-events-none absolute -bottom-2 left-1/2 z-0 h-3 w-32 -translate-x-1/2 rounded-full bg-[#febd69]/30 blur-md" />
                </div>

                <div className="mt-4 max-w-xs text-center sm:mt-5">
                    <p className="home-earnings-pulse text-base font-semibold tracking-wide text-[#b45309] sm:text-lg">
                        Earnings in motion
                    </p>
                    <p className="mt-1 text-xs text-[#2d5a47]/80 sm:text-sm">
                        Your balance keeps working in the background
                    </p>
                    <div className="mt-4 flex justify-center gap-2">
                        {[0, 1, 2].map((dot) => (
                            <span
                                key={dot}
                                className="home-earnings-dot h-2 w-2 rounded-full bg-[#c9890a]"
                                style={{ animationDelay: `${dot * 0.22}s` }}
                            />
                        ))}
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
}