import AppLogo from '@/Components/AppLogo';
import AdminSidebarLink from '@/Layouts/Admin/AdminSidebarLink';
import { Link, usePage } from '@inertiajs/react';

function DashboardIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
    );
}

function StoreIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72m-13.5 8.65h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.65c0 .414.336.75.75.75Z" />
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

export default function VendorSidebar({ open, onNavigate }) {
    const user = usePage().props.auth.user;
    const vendor = user?.vendor;

    return (
        <aside
            className={
                'fixed bottom-0 left-0 top-14 z-40 flex w-60 flex-col border-r border-neutral-200 bg-neutral-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ' +
                (open ? 'translate-x-0' : '-translate-x-full')
            }
        >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-4 lg:hidden">
                <Link href={route('vendor.dashboard')} onClick={onNavigate} className="flex items-center gap-2">
                    <AppLogo className="block h-7 w-auto fill-current text-neutral-800" />
                    <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                        Vendor
                    </span>
                </Link>
            </div>

            {/* Vendor Profile Mini Card */}
            {vendor && (
                <div className="border-b border-neutral-200 p-3 bg-white">
                    <div className="flex items-center gap-2.5">
                        {vendor.logo_url ? (
                            <img
                                src={vendor.logo_url}
                                alt={vendor.shop_name}
                                className="h-9 w-9 rounded-md border border-neutral-200 object-cover shrink-0"
                            />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-xs font-semibold text-neutral-600 shrink-0">
                                {vendor.shop_name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-neutral-900">{vendor.shop_name}</p>
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                Active Store
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
                <AdminSidebarLink
                    href={route('vendor.dashboard')}
                    active={route().current('vendor.dashboard')}
                    icon={DashboardIcon}
                    onNavigate={onNavigate}
                >
                    Dashboard
                </AdminSidebarLink>

                <div className="pt-4 mt-4 border-t border-neutral-200">
                    <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                        Shortcuts
                    </p>
                    <div className="mt-2 space-y-0.5">
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                        >
                            <GlobeIcon className="h-[18px] w-[18px] shrink-0 text-neutral-400 group-hover:text-neutral-700" />
                            <span>Visit Marketplace</span>
                        </a>
                    </div>
                </div>
            </nav>

            <div
                className="hidden h-10 shrink-0 border-t border-neutral-200 bg-neutral-50 lg:block"
                aria-hidden="true"
            />
        </aside>
    );
}

