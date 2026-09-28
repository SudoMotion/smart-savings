import { Link } from '@inertiajs/react';

function HomeIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    );
}

function ProductsIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
    );
}

function OrdersIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
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

export default function VendorBottomNav({ onOpenMenu }) {
    const isDashboard = route().current('vendor.dashboard');

    return (
        <nav
            aria-label="Mobile Bottom Navigation"
            className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-neutral-200 bg-white/95 px-2 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden"
        >
            <Link
                href={route('vendor.dashboard')}
                className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-medium transition ${
                    isDashboard
                        ? 'text-neutral-950 font-semibold'
                        : 'text-neutral-500 hover:text-neutral-800'
                }`}
            >
                <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                        isDashboard ? 'bg-neutral-900 text-white' : 'text-neutral-600'
                    }`}
                >
                    <HomeIcon className="h-4 w-4" />
                </div>
                <span>Home</span>
            </Link>

            <Link
                href={route('vendor.products.index')}
                className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-medium transition ${
                    route().current('vendor.products.*')
                        ? 'text-neutral-950 font-semibold'
                        : 'text-neutral-500 hover:text-neutral-800'
                }`}
            >
                <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                        route().current('vendor.products.*') ? 'bg-neutral-900 text-white' : 'text-neutral-600'
                    }`}
                >
                    <ProductsIcon className="h-4 w-4" />
                </div>
                <span>Products</span>
            </Link>

            <Link
                href={route('vendor.dashboard')}
                className="flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-medium text-neutral-500 hover:text-neutral-800 transition"
            >
                <div className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-600">
                    <OrdersIcon className="h-4 w-4" />
                </div>
                <span>Orders</span>
            </Link>

            <button
                type="button"
                onClick={onOpenMenu}
                className="flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-medium text-neutral-500 hover:text-neutral-800 transition focus:outline-none"
            >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
                    <MenuIcon className="h-4 w-4" />
                </div>
                <span>More</span>
            </button>
        </nav>
    );
}

