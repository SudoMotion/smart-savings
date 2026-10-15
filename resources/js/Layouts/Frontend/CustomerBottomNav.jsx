import { Link } from '@inertiajs/react';

function HomeIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    );
}

function PlusIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}

function ProfileIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    );
}

function MenuIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
    );
}

export default function CustomerBottomNav({ onOpenMenu }) {
    const isHome = route().current('account.dashboard');
    const isDeposit = route().current('account.deposit');
    const isProfile = route().current('account.profile');

    const iconWrap = (active) =>
        `flex h-9 w-9 items-center justify-center rounded-full transition ${
            active ? 'bg-[#2d5240] text-[#febd69]' : 'text-gray-300'
        }`;

    return (
        <nav
            aria-label="Customer panel navigation"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-[#2d5240] bg-[#0f281c] pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-4px_20px_rgba(0,0,0,0.25)]"
        >
            <div className="relative flex h-[4.25rem] items-stretch">
                {/* Left: Home + Percentage */}
                <div className="flex min-w-0 flex-1">
                    <div className="flex flex-1 justify-center">
                        <Link
                            href={route('account.dashboard')}
                            className={`flex w-full max-w-[5.5rem] flex-col items-center justify-end gap-0.5 pb-2 pt-1 text-[10px] font-medium transition ${
                                isHome ? 'text-[#febd69]' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            <div className={iconWrap(isHome)}>
                                <HomeIcon className="h-5 w-5" />
                            </div>
                            <span>Home</span>
                        </Link>
                    </div>
                    <div className="flex flex-1 justify-center">
                        <div
                            className="pointer-events-none flex w-full max-w-[5.5rem] select-none flex-col items-center justify-end gap-0.5 pb-2 pt-1 text-[10px] font-medium text-gray-500"
                            aria-hidden="true"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-gray-600 opacity-40">
                                %
                            </div>
                            <span className="h-3" />
                        </div>
                    </div>
                </div>

                {/* Center: Deposit */}
                <div className="relative flex w-[5.5rem] shrink-0 flex-col items-center justify-end pb-1">
                    <Link
                        href={route('account.deposit')}
                        className="absolute bottom-3 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5"
                        aria-label="Deposit"
                    >
                        <div
                            className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#1e3a2d] shadow-lg transition ${
                                isDeposit
                                    ? 'bg-[#febd69] text-[#0f281c]'
                                    : 'bg-emerald-500 text-white hover:bg-emerald-400'
                            }`}
                        >
                            <PlusIcon className="h-7 w-7" />
                        </div>
                        <span
                            className={`whitespace-nowrap text-[10px] font-semibold ${
                                isDeposit ? 'text-[#febd69]' : 'text-gray-300'
                            }`}
                        >
                            Deposit
                        </span>
                    </Link>
                </div>

                {/* Right: Profile + Menu */}
                <div className="flex min-w-0 flex-1">
                    <div className="flex flex-1 justify-center">
                        <Link
                            href={route('account.profile')}
                            className={`flex w-full max-w-[5.5rem] flex-col items-center justify-end gap-0.5 pb-2 pt-1 text-[10px] font-medium transition ${
                                isProfile ? 'text-[#febd69]' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            <div className={iconWrap(isProfile)}>
                                <ProfileIcon className="h-5 w-5" />
                            </div>
                            <span>Profile</span>
                        </Link>
                    </div>
                    <div className="flex flex-1 justify-center">
                        <button
                            type="button"
                            onClick={onOpenMenu}
                            className="flex w-full max-w-[5.5rem] flex-col items-center justify-end gap-0.5 pb-2 pt-1 text-[10px] font-medium text-gray-300 transition hover:text-white focus:outline-none"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d5240]/80 text-gray-200">
                                <MenuIcon className="h-5 w-5" />
                            </div>
                            <span>Menu</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
