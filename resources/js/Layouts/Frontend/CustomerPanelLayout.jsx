import SiteFavicon from '@/Components/SiteFavicon';
import FrontendNavbar from './FrontendNavbar';
import CustomerBottomNav from './CustomerBottomNav';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function MenuHomeIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    );
}

function MenuProfileIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    );
}

function MenuLogsIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
        </svg>
    );
}

function MenuPercentIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />
        </svg>
    );
}

function MenuDepositIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}

function MenuWithdrawIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
    );
}

function MenuSupportIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
    );
}

function MenuKeyIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
        </svg>
    );
}

function MenuLogoutIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
    );
}

function MenuLink({ href, icon: Icon, children, onNavigate }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white transition hover:bg-[#2d5240]/60"
            onClick={onNavigate}
        >
            <Icon className="h-5 w-5 shrink-0 text-gray-300" aria-hidden />
            <span>{children}</span>
        </Link>
    );
}

const panelMenuItems = [
    { href: () => route('account.dashboard'), label: 'Home', icon: MenuHomeIcon },
    { href: () => route('account.order-logs'), label: 'Order logs', icon: MenuLogsIcon },
    { href: () => route('account.profile'), label: 'Profile', icon: MenuProfileIcon },
    { href: () => route('account.percentage'), label: 'My percentage', icon: MenuPercentIcon },
    { href: () => route('account.deposit'), label: 'Deposit funds', icon: MenuDepositIcon },
    { href: () => route('account.withdraw'), label: 'Withdraw', icon: MenuWithdrawIcon },
    { href: () => route('contact'), label: 'Customer support', icon: MenuSupportIcon },
    { href: () => route('guest.reset.password'), label: 'Reset password', icon: MenuKeyIcon },
];

export default function CustomerPanelLayout({ children, categories }) {
    const { categories: pageCategories, auth } = usePage().props;
    const cats = categories || pageCategories || [];
    const [menuOpen, setMenuOpen] = useState(false);
    const user = auth?.user;

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [menuOpen]);

    return (
        <div className="flex min-h-screen flex-col bg-[#eaeded] text-neutral-900 font-sans antialiased">
            <SiteFavicon />
            <FrontendNavbar categories={cats} />
            <main className="flex-1 pb-[calc(4.25rem+env(safe-area-inset-bottom))]">{children}</main>
            <CustomerBottomNav onOpenMenu={() => setMenuOpen(true)} />

            {menuOpen && (
                <div className="fixed inset-0 z-[60] flex flex-col justify-end">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        aria-label="Close menu"
                        onClick={closeMenu}
                    />
                    <div className="relative max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-[#2d5240] bg-[#1e3a2d] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 text-white shadow-2xl">
                        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#2d5240]" />
                        {user && (
                            <div className="mb-4 border-b border-[#2d5240] pb-4">
                                <p className="text-xs text-gray-400">Signed in as</p>
                                <p className="font-bold truncate">{user.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                        )}
                        <ul className="space-y-1 text-sm">
                            {panelMenuItems.map((item) => (
                                <li key={item.label}>
                                    <MenuLink href={item.href()} icon={item.icon} onNavigate={closeMenu}>
                                        {item.label}
                                    </MenuLink>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={route('account.logout')}
                            method="post"
                            as="button"
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f281c] py-2.5 text-center text-sm font-semibold text-red-300 hover:bg-[#0f281c]/90"
                            onClick={closeMenu}
                        >
                            <MenuLogoutIcon className="h-5 w-5 shrink-0" aria-hidden />
                            Sign out
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
