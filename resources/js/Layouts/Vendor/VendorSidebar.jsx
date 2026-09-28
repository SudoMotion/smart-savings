import AppLogo from '@/Components/AppLogo';
import { Link, usePage } from '@inertiajs/react';

function HomeIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    );
}

function ProductsIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
    );
}

function OrdersIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
    );
}

function CustomersIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
    );
}

function SettingsIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        </svg>
    );
}

function WalletIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
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

export default function VendorSidebar({ open, onClose }) {
    const user = usePage().props.auth.user;
    const vendor = user?.vendor;

    const navItems = [
        {
            group: 'Main App',
            items: [
                {
                    name: 'Dashboard',
                    href: route('vendor.dashboard'),
                    active: route().current('vendor.dashboard'),
                    icon: HomeIcon,
                },
                {
                    name: 'My Products',
                    href: route('vendor.dashboard'),
                    active: false,
                    icon: ProductsIcon,
                },
                {
                    name: 'Orders & Sales',
                    href: route('vendor.dashboard'),
                    active: false,
                    icon: OrdersIcon,
                },
                {
                    name: 'Customer Reviews',
                    href: route('vendor.dashboard'),
                    active: false,
                    icon: CustomersIcon,
                },
            ],
        },
        {
            group: 'Store Management',
            items: [
                {
                    name: 'Store Profile',
                    href: route('vendor.dashboard'),
                    active: false,
                    icon: SettingsIcon,
                },
                {
                    name: 'Payouts & Earnings',
                    href: route('vendor.dashboard'),
                    active: false,
                    icon: WalletIcon,
                },
            ],
        },
        {
            group: 'Explore',
            items: [
                {
                    name: 'Visit Marketplace',
                    href: '/',
                    external: true,
                    icon: GlobeIcon,
                },
            ],
        },
    ];

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
                open ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            {/* Header: Shop Profile & Close Button */}
            <div className="flex items-center justify-between border-b border-neutral-100 p-4 bg-neutral-50/70">
                <div className="flex items-center gap-3 min-w-0">
                    {vendor?.logo_url ? (
                        <img
                            src={vendor.logo_url}
                            alt={vendor.shop_name}
                            className="h-11 w-11 rounded-xl border border-neutral-200 object-cover shrink-0 shadow-xs"
                        />
                    ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-sm font-bold text-white shrink-0 shadow-xs">
                            {vendor?.shop_name?.charAt(0) || user.name.charAt(0)}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-neutral-900 leading-tight">
                            {vendor?.shop_name || 'Vendor Shop'}
                        </h3>
                        <p className="truncate text-xs text-neutral-500 mt-0.5">{user.email}</p>
                        <span className="mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.2 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                            Verified Store
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

            {/* Navigation Groups */}
            <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
                {navItems.map((group) => (
                    <div key={group.group}>
                        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                            {group.group}
                        </p>
                        <div className="mt-2 space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const className = `group flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                                    item.active
                                        ? 'bg-neutral-900 text-white shadow-xs'
                                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                }`;

                                if (item.external) {
                                    return (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={onClose}
                                            className={className}
                                        >
                                            <Icon
                                                className={`h-4 w-4 shrink-0 ${
                                                    item.active ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-700'
                                                }`}
                                            />
                                            <span>{item.name}</span>
                                        </a>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={onClose}
                                        className={className}
                                    >
                                        <Icon
                                            className={`h-4 w-4 shrink-0 ${
                                                item.active ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-700'
                                            }`}
                                        />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom Actions: Log out */}
            <div className="border-t border-neutral-100 p-4 bg-neutral-50/50">
                <Link
                    href={route('vendor.logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition shadow-2xs"
                >
                    <LogoutIcon className="h-4 w-4" />
                    <span>Log Out</span>
                </Link>
            </div>
        </aside>
    );
}
