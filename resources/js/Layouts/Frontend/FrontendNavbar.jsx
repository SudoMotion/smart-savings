import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function FrontendNavbar({ categories = [] }) {
    const { site, auth, filters: pageFilters, totalWallet, wallet } = usePage().props;
    const walletBalance = totalWallet?.formatted_balance ?? wallet?.formatted_balance ?? '0.00';
    const [searchTerm, setSearchTerm] = useState(pageFilters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(pageFilters?.category || '');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [mobileGuestMenuOpen, setMobileGuestMenuOpen] = useState(false);
    const accountDropdownRef = useRef(null);
    const mobileGuestDropdownRef = useRef(null);

    // Sync input if URL search changes
    useEffect(() => {
        if (pageFilters?.search !== undefined) {
            setSearchTerm(pageFilters.search);
        }
        if (pageFilters?.category !== undefined) {
            setSelectedCategory(pageFilters.category);
        }
    }, [pageFilters]);

    // Close account dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
                setAccountMenuOpen(false);
            }
            if (mobileGuestDropdownRef.current && !mobileGuestDropdownRef.current.contains(event.target)) {
                setMobileGuestMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [drawerOpen]);

    const handleSearch = (e) => {
        e?.preventDefault();
        router.get(
            route('home'),
            {
                search: searchTerm.trim() || undefined,
                category: selectedCategory || undefined,
            },
            {
                preserveState: true,
                preserveScroll: false,
            }
        );
    };

    const user = auth?.user;
    const isVendor = !!user?.vendor;
    const isAdmin =
        auth?.isSuperAdmin ||
        (auth?.permissions && auth.permissions.includes('dashboard.view'));

    return (
        <header className="sticky top-0 z-50 w-full select-none shadow-md">
            {/* Tier 1: Main Amazon Navy Header */}
            <div className="bg-[#0f281c] px-2 py-2 sm:px-4 text-white">
                <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-2 sm:gap-4 md:justify-start">
                    {/* Brand Logo with Amazon Style */}
                    <Link
                        href={route('home')}
                        className="flex shrink-0 items-center gap-1 rounded-sm px-2 py-1 transition hover:ring-1 hover:ring-white"
                    >
                        {site?.logo_url ? (
                            <img
                                src={site.logo_url}
                                alt={site.name || 'Amazon'}
                                className="h-7 w-auto object-contain sm:h-8"
                            />
                        ) : (
                            <div className="flex flex-col leading-none">
                                <span className="text-xl font-black tracking-tight text-white sm:text-2xl">
                                    {site?.name || 'amazon'}
                                    <span className="text-[#febd69] font-normal text-xs sm:text-sm">.com</span>
                                </span>
                                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#febd69] to-[#febd69] rounded-full mt-0.5"></div>
                            </div>
                        )}
                    </Link>

                    {/* Deliver to Widget (Desktop) */}
                    <div className="hidden cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 transition hover:ring-1 hover:ring-white lg:flex">
                        <svg className="h-5 w-5 text-gray-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <div className="leading-tight">
                            <span className="block text-[11px] text-gray-300">Deliver to</span>
                            <span className="block text-xs font-bold text-white">All Locations</span>
                        </div>
                    </div>

                    {/* Amazon Signature Search Bar (Desktop & Tablet) */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden flex-1 items-center md:flex"
                    >
                        <div className="relative flex w-full rounded-md shadow-inner focus-within:ring-2 focus-within:ring-[#f3a847]">
                            {/* Department / Category Dropdown */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="h-10 cursor-pointer rounded-l-md border-0 bg-[#f3f3f3] px-3 text-xs text-neutral-800 transition hover:bg-[#dadada] focus:outline-none focus:ring-0 max-w-[130px] font-medium truncate"
                            >
                                <option value="">All Departments</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            {/* Search Input */}
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search Amazon or products, brands, sellers..."
                                className="h-10 w-full border-0 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-0"
                            />

                            {/* Clear Search button if typed */}
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        router.get(route('home'), { category: selectedCategory || undefined });
                                    }}
                                    className="bg-white px-2 text-neutral-400 hover:text-neutral-700"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}

                            {/* Search Amber Button */}
                            <button
                                type="submit"
                                className="flex h-10 w-12 items-center justify-center rounded-r-md bg-[#febd69] text-neutral-900 transition hover:bg-[#f3a847] active:bg-[#e49b38]"
                                aria-label="Search"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* Mobile: balance when signed in, account entry when guest */}
                    {user ? (
                        <Link
                            href={route('account.dashboard')}
                            className="flex md:hidden flex-col items-end rounded-sm px-2 py-1 leading-tight transition hover:ring-1 hover:ring-white"
                        >
                            <span className="text-[10px] font-medium text-gray-300">Balance</span>
                            <span className="text-sm font-bold text-[#febd69]">${walletBalance}</span>
                        </Link>
                    ) : (
                        <div className="relative md:hidden" ref={mobileGuestDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setMobileGuestMenuOpen((open) => !open)}
                                className="flex flex-col items-center rounded-sm px-2 py-1 transition hover:ring-1 hover:ring-white"
                                aria-label="Account menu"
                                aria-expanded={mobileGuestMenuOpen}
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d5240]/90 text-white">
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        aria-hidden
                                    >
                                        <circle cx="12" cy="8" r="5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M20 21a8 8 0 0 0-16 0"
                                        />
                                    </svg>
                                </span>
                                {/* <span className="mt-0.5 text-[10px] font-medium text-gray-300">Account</span>    */}
                            </button>

                            {mobileGuestMenuOpen && (
                                <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-md border border-neutral-200 bg-white p-3 text-neutral-800 shadow-2xl">
                                    <Link
                                        href={route('account.login')}
                                        className="block w-full rounded-md bg-[#ffd814] py-2 text-center text-xs font-bold text-neutral-900 shadow-sm transition hover:bg-[#f7ca00]"
                                        onClick={() => setMobileGuestMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <p className="mt-2 text-center text-xs text-neutral-600">
                                        New customer?{' '}
                                        <Link
                                            href={route('account.register')}
                                            className="font-semibold text-blue-700 hover:text-orange-600 hover:underline"
                                            onClick={() => setMobileGuestMenuOpen(false)}
                                        >
                                            Create account
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Desktop right navigation */}
                    <div className="ml-auto hidden items-center gap-1 sm:gap-2 md:flex">
                        {/* Language Selector Indicator (Desktop) */}
                        <div className="hidden cursor-pointer items-center gap-1 rounded-sm px-2 py-1.5 transition hover:ring-1 hover:ring-white xl:flex">
                            <span className="text-sm">🇺🇸</span>
                            <span className="text-xs font-bold text-white">EN</span>
                            <span className="text-[10px] text-gray-400">▾</span>
                        </div>

                        {/* Account & Lists Dropdown Trigger */}
                        <div className="relative" ref={accountDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setAccountMenuOpen((prev) => !prev)}
                                className="flex cursor-pointer flex-col rounded-sm px-2 py-1 text-left leading-tight transition hover:ring-1 hover:ring-white"
                            >
                                <span className="text-[11px] text-gray-300 truncate max-w-[110px]">
                                    Hello, {user ? user.name.split(' ')[0] : 'Sign in'}
                                </span>
                                <span className="flex items-center gap-0.5 text-xs font-bold text-white">
                                    Account & Lists
                                    <span className="text-[10px] text-gray-300">▾</span>
                                </span>
                            </button>

                            {/* Amazon Flyout Dropdown Menu */}
                            {accountMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-64 rounded-md border border-neutral-200 bg-white p-4 text-neutral-800 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {!user ? (
                                        <div className="border-b border-neutral-200 pb-3 text-center">
                                            <Link
                                                href={route('account.login')}
                                                className="block w-full rounded-md bg-[#ffd814] py-2 text-center text-xs font-bold text-neutral-900 shadow-sm transition hover:bg-[#f7ca00]"
                                                onClick={() => setAccountMenuOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                            <p className="mt-2 text-xs text-neutral-600">
                                                New customer?{' '}
                                                <Link
                                                    href={route('account.register')}
                                                    className="text-blue-700 hover:text-orange-600 hover:underline"
                                                    onClick={() => setAccountMenuOpen(false)}
                                                >
                                                    Create account
                                                </Link>
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="border-b border-neutral-200 pb-2">
                                            <p className="text-xs text-neutral-500">Signed in as</p>
                                            <p className="text-sm font-bold text-neutral-900 truncate">{user.name}</p>
                                            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                                        </div>
                                    )}

                                    <div className="py-2 text-xs">
                                        <p className="font-bold text-neutral-900 uppercase tracking-wide text-[10px] mb-1.5 text-neutral-500">
                                            Your Account
                                        </p>
                                        <div className="space-y-1">
                                            {user && (
                                                <Link
                                                    href={route('account.dashboard')}
                                                    className="flex items-center justify-between rounded px-2 py-1.5 font-semibold text-neutral-800 hover:bg-neutral-100"
                                                    onClick={() => setAccountMenuOpen(false)}
                                                >
                                                    <span>My Account</span>
                                                    <span className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded">
                                                        Customer
                                                    </span>
                                                </Link>
                                            )}
                                            {isVendor && (
                                                <Link
                                                    href={route('vendor.dashboard')}
                                                    className="flex items-center justify-between rounded px-2 py-1.5 font-semibold text-emerald-700 hover:bg-neutral-100"
                                                    onClick={() => setAccountMenuOpen(false)}
                                                >
                                                    <span>Vendor Dashboard</span>
                                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Store</span>
                                                </Link>
                                            )}
                                            {isAdmin && (
                                                <Link
                                                    href={route('admin.dashboard')}
                                                    className="flex items-center justify-between rounded px-2 py-1.5 font-semibold text-indigo-700 hover:bg-neutral-100"
                                                    onClick={() => setAccountMenuOpen(false)}
                                                >
                                                    <span>Admin Console</span>
                                                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">Admin</span>
                                                </Link>
                                            )}
                                            <Link
                                                href={route('vendor.apply')}
                                                className="flex items-center justify-between rounded px-2 py-1.5 text-neutral-700 hover:bg-neutral-100 hover:text-orange-600"
                                                onClick={() => setAccountMenuOpen(false)}
                                            >
                                                <span>Become a Vendor</span>
                                                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Sell</span>
                                            </Link>
                                            <Link
                                                href={route('about')}
                                                className="block rounded px-2 py-1.5 text-neutral-700 hover:bg-neutral-100"
                                                onClick={() => setAccountMenuOpen(false)}
                                            >
                                                About Marketplace
                                            </Link>
                                            <Link
                                                href={route('contact')}
                                                className="block rounded px-2 py-1.5 text-neutral-700 hover:bg-neutral-100"
                                                onClick={() => setAccountMenuOpen(false)}
                                            >
                                                Customer Support
                                            </Link>
                                        </div>
                                    </div>

                                    {user && (
                                        <div className="border-t border-neutral-200 pt-2">
                                            <Link
                                                href={route('account.logout')}
                                                method="post"
                                                as="button"
                                                className="w-full text-left text-xs text-red-600 font-medium px-2 py-1.5 rounded hover:bg-red-50 transition"
                                                onClick={() => setAccountMenuOpen(false)}
                                            >
                                                Sign Out
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Returns & Orders */}
                        <div className="hidden cursor-pointer flex-col rounded-sm px-2 py-1 leading-tight transition hover:ring-1 hover:ring-white md:flex">
                            <span className="text-[11px] text-gray-300">Returns</span>
                            <span className="text-xs font-bold text-white">& Orders</span>
                        </div>

                        {/* Become a Seller Badge / Button */}
                        <Link
                            href={route('vendor.apply')}
                            className="hidden sm:flex items-center gap-1 rounded-sm bg-gradient-to-r from-amber-500 to-[#febd69] px-2.5 py-1.5 text-xs font-bold text-neutral-900 shadow-sm transition hover:brightness-105 active:scale-95"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25A2.25 2.25 0 010 18.75V10.5m16.5 10.5h4.5A2.25 2.25 0 0023.25 18.75V10.5" />
                            </svg>
                            <span>Sell on {site?.name || 'Amazon'}</span>
                        </Link>

                        {/* Cart Widget */}
                        <Link
                            href={route('home')}
                            className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 transition hover:ring-1 hover:ring-white"
                        >
                            <div className="relative flex items-end">
                                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.7 2.4-7.5H5.105m2.395 7.5L5.105 4.5M7.5 14.25a2.25 2.25 0 104.5 0m4.5 0a2.25 2.25 0 104.5 0" />
                                </svg>
                                <span className="absolute -top-1 left-3.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#f08804] text-[10px] font-bold text-white">
                                    0
                                </span>
                            </div>
                            <span className="hidden text-xs font-bold text-white md:inline ml-1 mt-2">
                                Cart
                            </span>
                        </Link>
                    </div>
                </div>

            </div>

            {/* Tier 2: Amazon Slate Sub-Navbar (desktop / tablet) */}
            <div className="hidden bg-[#1e3a2d] px-2 py-1 sm:px-4 text-white md:block">
                <div className="mx-auto flex max-w-[1500px] items-center justify-between text-xs sm:text-sm">
                    {/* Left Quick Navigation items */}
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
                        {/* Amazon "All" Drawer Button */}
                        <button
                            type="button"
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-1 rounded-sm px-2 py-1 font-bold transition hover:ring-1 hover:ring-white shrink-0"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <span>All</span>
                        </button>

                        <Link
                            href={route('home')}
                            className="shrink-0 rounded-sm px-2 py-1 transition hover:ring-1 hover:ring-white"
                        >
                            Today's Deals
                        </Link>

                        <Link
                            href={route('vendor.apply')}
                            className="shrink-0 rounded-sm px-2 py-1 font-semibold text-[#febd69] transition hover:ring-1 hover:ring-white"
                        >
                            Sell on Marketplace
                        </Link>

                        {/* Top Categories in Subnav */}
                        {categories.slice(0, 5).map((cat) => (
                            <Link
                                key={cat.id}
                                href={route('home', { category: cat.id })}
                                className="hidden md:inline-block shrink-0 rounded-sm px-2 py-1 transition hover:ring-1 hover:ring-white text-gray-200 hover:text-white"
                            >
                                {cat.name}
                            </Link>
                        ))}

                        <Link
                            href={route('about')}
                            className="shrink-0 rounded-sm px-2 py-1 transition hover:ring-1 hover:ring-white text-gray-200 hover:text-white"
                        >
                            About Us
                        </Link>

                        <Link
                            href={route('contact')}
                            className="shrink-0 rounded-sm px-2 py-1 transition hover:ring-1 hover:ring-white text-gray-200 hover:text-white"
                        >
                            Customer Service
                        </Link>
                    </div>

                    {/* Right promo tag */}
                    <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[#febd69] shrink-0">
                        <span>Multi-Vendor Marketplace</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-300 font-normal">Shop from Verified Independent Sellers</span>
                    </div>
                </div>
            </div>

            {/* Amazon Sliding "All" Side Drawer */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in"
                        onClick={() => setDrawerOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative z-10 flex h-full w-[360px] max-w-[85vw] flex-col bg-white text-neutral-900 shadow-2xl animate-in slide-in-from-left duration-200">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between bg-[#1e3a2d] px-6 py-4 text-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-700 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-300">Welcome,</p>
                                    <p className="text-base font-bold leading-tight">
                                        {user ? user.name : 'Hello, Sign In'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDrawerOpen(false)}
                                className="rounded p-1 text-gray-300 hover:text-white"
                                aria-label="Close menu"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Drawer Scrollable Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 text-sm divide-y divide-neutral-200 space-y-4">
                            {/* Shop by Department */}
                            <div className="space-y-2 pt-2">
                                <h3 className="font-bold text-neutral-900 text-base">
                                    Shop by Department
                                </h3>
                                <ul className="space-y-1">
                                    <li>
                                        <Link
                                            href={route('home')}
                                            onClick={() => setDrawerOpen(false)}
                                            className="flex items-center justify-between rounded px-2 py-2 hover:bg-neutral-100"
                                        >
                                            <span>All Products & Categories</span>
                                            <span className="text-gray-400">›</span>
                                        </Link>
                                    </li>
                                    {categories.map((cat) => (
                                        <li key={cat.id}>
                                            <Link
                                                href={route('home', { category: cat.id })}
                                                onClick={() => setDrawerOpen(false)}
                                                className="flex items-center justify-between rounded px-2 py-2 text-neutral-700 hover:bg-neutral-100"
                                            >
                                                <span>{cat.name}</span>
                                                {cat.products_count !== undefined && (
                                                    <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                                                        {cat.products_count}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Multi-Vendor Marketplace Programs */}
                            <div className="space-y-2 pt-4">
                                <h3 className="font-bold text-neutral-900 text-base">
                                    Seller & Vendor Hub
                                </h3>
                                <ul className="space-y-1">
                                    <li>
                                        <Link
                                            href={route('vendor.apply')}
                                            onClick={() => setDrawerOpen(false)}
                                            className="flex items-center justify-between rounded px-2 py-2 font-semibold text-amber-700 hover:bg-amber-50"
                                        >
                                            <span>Become a Seller / Vendor</span>
                                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Join</span>
                                        </Link>
                                    </li>
                                    {isVendor && (
                                        <li>
                                            <Link
                                                href={route('vendor.dashboard')}
                                                onClick={() => setDrawerOpen(false)}
                                                className="flex items-center justify-between rounded px-2 py-2 font-semibold text-emerald-700 hover:bg-emerald-50"
                                            >
                                                <span>Vendor Management Panel</span>
                                                <span className="text-xs text-gray-400">›</span>
                                            </Link>
                                        </li>
                                    )}
                                    {isAdmin && (
                                        <li>
                                            <Link
                                                href={route('admin.dashboard')}
                                                onClick={() => setDrawerOpen(false)}
                                                className="flex items-center justify-between rounded px-2 py-2 font-semibold text-indigo-700 hover:bg-indigo-50"
                                            >
                                                <span>Platform Admin Panel</span>
                                                <span className="text-xs text-gray-400">›</span>
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Help & Settings */}
                            <div className="space-y-2 pt-4">
                                <h3 className="font-bold text-neutral-900 text-base">
                                    Help & Settings
                                </h3>
                                <ul className="space-y-1">
                                    <li>
                                        <Link
                                            href={route('about')}
                                            onClick={() => setDrawerOpen(false)}
                                            className="block rounded px-2 py-2 text-neutral-700 hover:bg-neutral-100"
                                        >
                                            About Marketplace
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route('contact')}
                                            onClick={() => setDrawerOpen(false)}
                                            className="block rounded px-2 py-2 text-neutral-700 hover:bg-neutral-100"
                                        >
                                            Customer Service & Support
                                        </Link>
                                    </li>
                                    {!user ? (
                                        <>
                                            <li>
                                                <Link
                                                    href={route('account.login')}
                                                    onClick={() => setDrawerOpen(false)}
                                                    className="block rounded px-2 py-2 font-semibold text-blue-600 hover:bg-blue-50"
                                                >
                                                    Sign In to Your Account
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={route('vendor.apply')}
                                                    onClick={() => setDrawerOpen(false)}
                                                    className="block rounded px-2 py-2 font-semibold text-amber-600 hover:bg-amber-50"
                                                >
                                                    Register as Vendor
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <Link
                                                href={route('account.logout')}
                                                method="post"
                                                as="button"
                                                onClick={() => setDrawerOpen(false)}
                                                className="w-full text-left rounded px-2 py-2 font-semibold text-red-600 hover:bg-red-50"
                                            >
                                                Sign Out
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
