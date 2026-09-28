import AppLogo from '@/Components/AppLogo';
import { Button } from '@/Components/UI';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';

export default function VendorTopbar({ title, onToggleSidebar }) {
    const user = usePage().props.auth.user;
    const vendor = user?.vendor;

    return (
        <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200/80 bg-white/95 px-3 md:px-6 backdrop-blur shadow-xs">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition focus:outline-none"
                    aria-label="Open sidebar menu"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                <div className="flex items-center gap-2.5">
                    {vendor?.logo_url ? (
                        <img
                            src={vendor.logo_url}
                            alt={vendor.shop_name}
                            className="h-9 w-9 rounded-xl border border-neutral-200 object-cover shadow-2xs"
                        />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-xs font-bold text-white shadow-2xs">
                            {vendor?.shop_name?.charAt(0) || user.name.charAt(0)}
                        </div>
                    )}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-neutral-900 leading-tight truncate max-w-[130px] sm:max-w-xs">
                                {vendor?.shop_name || 'Vendor Portal'}
                            </span>
                            <span className="rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                Live
                            </span>
                        </div>
                        <span className="text-[11px] text-neutral-500 font-medium">
                            {title || 'Vendor App'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition"
                >
                    <svg className="h-3.5 w-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    <span>Storefront</span>
                </a>

                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-xl p-1 text-neutral-700 hover:bg-neutral-100 transition focus:outline-none"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-xs font-semibold text-neutral-800 ring-1 ring-neutral-200">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                            <div className="hidden text-left sm:block">
                                <p className="text-xs font-semibold text-neutral-900 leading-tight">{user.name}</p>
                                <p className="text-[10px] text-neutral-500">Vendor Account</p>
                            </div>
                            <svg className="hidden h-4 w-4 text-neutral-400 sm:block" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                        <div className="px-4 py-2 border-b border-neutral-100 text-xs text-neutral-500">
                            Signed in as <strong className="text-neutral-900 block truncate">{user.email}</strong>
                        </div>
                        <Dropdown.Link href={route('vendor.logout')} method="post" as="button" className="text-rose-600 hover:text-rose-700">
                            Log Out
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </header>
    );
}
