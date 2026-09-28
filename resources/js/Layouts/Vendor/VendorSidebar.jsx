import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/Components/UI/cn';

function DashboardIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
    );
}

function CatalogIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
    );
}

function GlobeIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
    );
}

function LogoutIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
    );
}

const catalogItems = [
    { name: 'Brands', href: 'vendor.brands.index', active: 'vendor.brands.*' },
    { name: 'Categories', href: 'vendor.categories.index', active: 'vendor.categories.*' },
    { name: 'Subcategories', href: 'vendor.subcategories.index', active: 'vendor.subcategories.*' },
    { name: 'Subsubcategories', href: 'vendor.subsubcategories.index', active: 'vendor.subsubcategories.*' },
    { name: 'Units', href: 'vendor.units.index', active: 'vendor.units.*' },
    { name: 'Attributes', href: 'vendor.attributes.index', active: 'vendor.attributes.*' },
    { name: 'Products', href: 'vendor.products.index', active: 'vendor.products.*' },
];

export default function VendorSidebar({ open, onClose }) {
    const user = usePage().props.auth.user;
    const vendor = user?.vendor;

    const isCatalogChildActive = catalogItems.some((item) =>
        route().has(item.href) ? route().current(item.active) : false
    );

    const [catalogOpen, setCatalogOpen] = useState(true);

    return (
        <aside
            className={cn(
                // Mobile layout: Drawer overlay from top-0 to bottom-0
                'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out',
                // Desktop layout: Docked sidebar exactly like AdminSidebar (w-60, top-14, bottom-10, bg-neutral-50, border-r)
                'lg:top-14 lg:bottom-10 lg:left-0 lg:z-30 lg:w-60 lg:bg-neutral-50 lg:border-r lg:border-neutral-200 lg:shadow-none lg:translate-x-0',
                open ? 'translate-x-0' : '-translate-x-full'
            )}
        >
            {/* Mobile-Only Header: Shop Profile & Close Button */}
            <div className="flex items-center justify-between border-b border-neutral-100 p-4 bg-neutral-50/70 lg:hidden">
                <div className="flex items-center gap-3 min-w-0">
                    {vendor?.logo_url ? (
                        <img
                            src={vendor.logo_url}
                            alt={vendor.shop_name}
                            className="h-10 w-10 rounded-xl border border-neutral-200 object-cover shrink-0 shadow-xs"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-xs font-bold text-white shrink-0 shadow-xs">
                            {vendor?.shop_name?.charAt(0) || user.name.charAt(0)}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-xs font-bold text-neutral-900 leading-tight">
                            {vendor?.shop_name || 'Vendor Shop'}
                        </h3>
                        <p className="truncate text-[11px] text-neutral-500">{user.email}</p>
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.2 text-[9px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                            Verified Vendor
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-200/60 hover:text-neutral-700 transition"
                    aria-label="Close menu"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Navigation Menu (Desktop Admin-Style & Mobile App-Style) */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {/* Dashboard Link */}
                <Link
                    href={route('vendor.dashboard')}
                    onClick={onClose}
                    className={cn(
                        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        route().current('vendor.dashboard')
                            ? 'bg-neutral-200 text-neutral-900 font-semibold'
                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    )}
                >
                    <DashboardIcon
                        className={cn(
                            'h-[18px] w-[18px] shrink-0',
                            route().current('vendor.dashboard')
                                ? 'text-neutral-800'
                                : 'text-neutral-400 group-hover:text-neutral-700'
                        )}
                    />
                    <span>Dashboard</span>
                </Link>

                {/* Product Catalog Collapsible Group (Admin-Style) */}
                <div>
                    <button
                        type="button"
                        onClick={() => setCatalogOpen((v) => !v)}
                        className={cn(
                            'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            isCatalogChildActive
                                ? 'bg-neutral-200 text-neutral-900 font-semibold'
                                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                        )}
                    >
                        <CatalogIcon
                            className={cn(
                                'h-[18px] w-[18px] shrink-0',
                                isCatalogChildActive
                                    ? 'text-neutral-800'
                                    : 'text-neutral-400 group-hover:text-neutral-700'
                            )}
                        />
                        <span className="flex-1 text-left">Product Catalog</span>
                        <svg
                            className={cn(
                                'h-4 w-4 shrink-0 text-neutral-400 transition-transform',
                                catalogOpen && 'rotate-180'
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>

                    {/* Submenu links */}
                    {catalogOpen && (
                        <div className="mt-0.5 space-y-0.5 border-l border-neutral-200 ms-5 ps-2">
                            {catalogItems.map((item) => {
                                const hasRoute = route().has(item.href);
                                const active = hasRoute ? route().current(item.active) : false;
                                const href = hasRoute ? route(item.href) : '#';

                                return (
                                    <Link
                                        key={item.name}
                                        href={href}
                                        onClick={onClose}
                                        className={cn(
                                            'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                            active
                                                ? 'bg-neutral-200 text-neutral-900 font-semibold'
                                                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                        )}
                                    >
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Visit Storefront link */}
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                >
                    <GlobeIcon className="h-[18px] w-[18px] shrink-0 text-neutral-400 group-hover:text-neutral-700" />
                    <span>Storefront</span>
                </a>
            </nav>

            {/* Mobile-Only Drawer Footer with Log out */}
            <div className="border-t border-neutral-100 p-4 bg-neutral-50/50 lg:hidden">
                <Link
                    href={route('vendor.logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition shadow-2xs"
                >
                    <LogoutIcon className="h-4 w-4" />
                    <span>Log Out</span>
                </Link>
            </div>
        </aside>
    );
}
