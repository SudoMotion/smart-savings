import { Button } from '@/Components/UI';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';

export default function VendorTopbar({ title, onToggleSidebar }) {
    const user = usePage().props.auth.user;
    const vendor = user?.vendor;

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-2 md:px-4 shadow-2xs">
            {/* Left section */}
            <div className="flex items-center gap-3">
                {/* Mobile hamburger menu toggle */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onToggleSidebar}
                    className="text-neutral-600 lg:hidden p-1.5"
                    aria-label="Toggle navigation menu"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </Button>

                {/* Desktop View Brand: exact admin style matching sidebar width */}
                <Link
                    href={route('vendor.dashboard')}
                    className="hidden items-center gap-2.5 lg:flex w-52"
                >
                    {vendor?.logo_url ? (
                        <img
                            src={vendor.logo_url}
                            alt={vendor.shop_name}
                            className="h-7 w-7 rounded-lg border border-neutral-200 object-cover shrink-0"
                        />
                    ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-white shrink-0">
                            {vendor?.shop_name?.charAt(0) || user.name.charAt(0)}
                        </div>
                    )}
                    <span className="truncate text-sm font-bold text-neutral-900 tracking-tight">
                        {vendor?.shop_name || 'Vendor Portal'}
                    </span>
                </Link>

                {/* Mobile View: App header badge with shop identity */}
                <div className="flex items-center gap-2 lg:hidden">
                    {vendor?.logo_url ? (
                        <img
                            src={vendor.logo_url}
                            alt={vendor.shop_name}
                            className="h-7 w-7 rounded-lg border border-neutral-200 object-cover shrink-0"
                        />
                    ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-white shrink-0">
                            {vendor?.shop_name?.charAt(0) || user.name.charAt(0)}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="truncate text-xs font-bold text-neutral-900 max-w-[130px] sm:max-w-xs">
                            {vendor?.shop_name || 'Vendor Shop'}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                            Live
                        </span>
                    </div>
                </div>

                {/* Desktop Title & Divider: matching AdminTopbar */}
                {title && (
                    <>
                        <div className="hidden h-4 w-px bg-neutral-200 lg:block" aria-hidden="true" />
                        <h1 className="hidden text-sm font-medium text-neutral-700 lg:block">
                            {title}
                        </h1>
                    </>
                )}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Storefront button */}
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition"
                >
                    <svg className="h-3.5 w-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    <span>Storefront</span>
                </a>

                {/* User Dropdown */}
                <Dropdown>
                    <Dropdown.Trigger>
                        <Button type="button" variant="ghost" size="sm" className="gap-2 text-neutral-700 p-1 sm:px-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="hidden text-sm font-normal sm:inline">{user.name}</span>
                            <svg className="hidden h-4 w-4 text-neutral-400 sm:block" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Button>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                        <div className="px-4 py-2 border-b border-neutral-100 text-xs text-neutral-500">
                            <span className="block font-bold text-neutral-900 truncate">{vendor?.shop_name || 'Vendor Store'}</span>
                            <span className="block truncate text-neutral-400">{user.email}</span>
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
