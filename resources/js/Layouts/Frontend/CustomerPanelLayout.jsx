import SiteFavicon from '@/Components/SiteFavicon';
import FrontendNavbar from './FrontendNavbar';
import CustomerBottomNav from './CustomerBottomNav';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CustomerPanelLayout({ children, categories }) {
    const { categories: pageCategories, auth } = usePage().props;
    const cats = categories || pageCategories || [];
    const [menuOpen, setMenuOpen] = useState(false);
    const user = auth?.user;

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
                        onClick={() => setMenuOpen(false)}
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
                            <li>
                                <Link
                                    href={route('account.dashboard')}
                                    className="block rounded-lg px-3 py-2.5 hover:bg-[#2d5240]/60"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('account.profile')}
                                    className="block rounded-lg px-3 py-2.5 hover:bg-[#2d5240]/60"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('account.deposit')}
                                    className="block rounded-lg px-3 py-2.5 hover:bg-[#2d5240]/60"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Deposit funds
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('contact')}
                                    className="block rounded-lg px-3 py-2.5 hover:bg-[#2d5240]/60"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Customer support
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('guest.reset.password')}
                                    className="block rounded-lg px-3 py-2.5 hover:bg-[#2d5240]/60"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Reset password
                                </Link>
                            </li>
                        </ul>
                        <Link
                            href={route('account.logout')}
                            method="post"
                            as="button"
                            className="mt-4 w-full rounded-lg bg-[#0f281c] py-2.5 text-center text-sm font-semibold text-red-300 hover:bg-[#0f281c]/90"
                            onClick={() => setMenuOpen(false)}
                        >
                            Sign out
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
