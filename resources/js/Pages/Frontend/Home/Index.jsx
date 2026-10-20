import { useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';

export default function Index({
    products = { data: [] },
    deals = [],
    categories = [],
    brands = [],
    vendors = [],
    filters = {},
}) {
    const { site, auth } = usePage().props;
    const dealsScrollRef = useRef(null);

    const productList = products?.data || (Array.isArray(products) ? products : []);
    const hasFilters = !!(filters.search || filters.category || filters.brand || filters.vendor);

    const scrollDeals = (direction) => {
        if (dealsScrollRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            dealsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleSortChange = (e) => {
        router.get(
            route('home'),
            {
                ...filters,
                sort: e.target.value,
            },
            { preserveState: true }
        );
    };

    const clearFilter = (key) => {
        const newFilters = { ...filters };
        delete newFilters[key];
        router.get(route('home'), newFilters, { preserveState: true });
    };

    return (
        <FrontendLayout categories={categories}>
            <Head title={`${site?.name || 'Amazon'} - Online Shopping & Multi-Vendor Marketplace`} />

            {/* 1. Tether savings hero (copy baked into hero-mobile / hero-desktop assets) */}
            <section className="w-full overflow-hidden bg-white">
                <div className="mx-auto w-full max-w-[1500px]">
                    <picture>
                        <source media="(min-width: 768px)" srcSet="/images/hero-desktop.png" />
                        <img
                            src="/images/hero-mobile.png"
                            alt="Tether saving account — low risk high return, earn interest in ETH"
                            className="block h-auto w-full"
                            loading="eager"
                            fetchpriority="high"
                            width={750}
                            height={900}
                        />
                    </picture>
                </div>
            </section>

            {/* 2. Feature cards */}
            <div className="relative mx-auto max-w-[1500px] px-3 pb-2 pt-4 sm:px-6 sm:pt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Shop by Category */}
                    <div className="flex flex-col justify-between rounded-sm bg-white p-5 shadow-sm border border-neutral-200">
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900 leading-tight">
                                Shop by Category
                            </h2>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                {categories.slice(0, 4).map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={route('home', { category: cat.id })}
                                        className="group block rounded bg-neutral-50 p-2.5 text-center transition hover:bg-amber-50"
                                    >
                                        <div className="flex h-12 w-full items-center justify-center rounded bg-neutral-200/60 group-hover:bg-[#febd69]/30">
                                            <svg className="h-6 w-6 text-neutral-600 group-hover:text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25A2.25 2.25 0 010 18.75V10.5m16.5 10.5h4.5A2.25 2.25 0 0023.25 18.75V10.5" />
                                            </svg>
                                        </div>
                                        <span className="mt-1 block text-xs font-semibold text-neutral-800 truncate">
                                            {cat.name}
                                        </span>
                                    </Link>
                                ))}
                                {categories.length === 0 && (
                                    <div className="col-span-2 py-6 text-center text-xs text-neutral-500">
                                        No categories found yet.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 pt-2">
                            <Link
                                href={route('home')}
                                className="text-xs font-medium text-[#007185] hover:text-[#c7511f] hover:underline"
                            >
                                See all departments ({categories.length})
                            </Link>
                        </div>
                    </div>

                    {/* Card 2: Today's Featured Deal */}
                    <div className="flex flex-col justify-between rounded-sm bg-white p-5 shadow-sm border border-neutral-200">
                        <div>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-neutral-900 leading-tight">
                                    Top Deal of the Day
                                </h2>
                                <span className="bg-[#cc0c39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                    DEAL
                                </span>
                            </div>

                            {deals.length > 0 ? (
                                <div className="mt-3">
                                    <div className="flex h-36 items-center justify-center overflow-hidden rounded bg-neutral-50 p-2">
                                        {deals[0].image_url ? (
                                            <img
                                                src={deals[0].image_url}
                                                alt={deals[0].name}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-400 text-xs">
                                                Product Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 flex items-baseline gap-2">
                                        <span className="rounded bg-[#cc0c39] px-1.5 py-0.5 text-xs font-bold text-white">
                                            {deals[0].discount_value > 0
                                                ? `${deals[0].discount_type === 'percentage' ? deals[0].discount_value + '%' : '$' + deals[0].discount_value} OFF`
                                                : 'Special Offer'}
                                        </span>
                                        <span className="text-xs font-bold text-[#cc0c39]">
                                            Limited time deal
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs font-semibold text-neutral-900 line-clamp-1">
                                        {deals[0].name}
                                    </p>
                                    <p className="text-[11px] text-neutral-500">
                                        Sold by: {deals[0].vendor?.shop_name || 'Verified Vendor'}
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-6 text-center text-xs text-neutral-500">
                                    Special deals refreshed daily.
                                </div>
                            )}
                        </div>
                        <div className="mt-4 pt-2">
                            <a
                                href="#todays-deals"
                                className="text-xs font-medium text-[#007185] hover:text-[#c7511f] hover:underline"
                            >
                                Shop all deals
                            </a>
                        </div>
                    </div>

                    {/* Card 3: Top Verified Marketplace Sellers */}
                    <div className="flex flex-col justify-between rounded-sm bg-white p-5 shadow-sm border border-neutral-200">
                        <div>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-neutral-900 leading-tight">
                                    Verified Stores
                                </h2>
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                    SELLERS
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-neutral-500">
                                Shop directly from certified independent businesses.
                            </p>

                            <div className="mt-3 space-y-2">
                                {vendors.slice(0, 3).map((v) => (
                                    <Link
                                        key={v.id}
                                        href={route('home', { vendor: v.id })}
                                        className="flex items-center justify-between rounded border border-neutral-100 p-2 hover:bg-neutral-50 transition"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs uppercase">
                                                {v.shop_name?.charAt(0) || 'V'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-neutral-900 truncate max-w-[120px]">
                                                    {v.shop_name}
                                                </p>
                                                <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                                                    <span>✓</span> Verified Merchant
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-bold text-[#007185] hover:underline">
                                            Visit
                                        </span>
                                    </Link>
                                ))}
                                {vendors.length === 0 && (
                                    <div className="py-4 text-center text-xs text-neutral-400">
                                        New vendor applications being reviewed.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 pt-2">
                            <a
                                href="#vendor-spotlight"
                                className="text-xs font-medium text-[#007185] hover:text-[#c7511f] hover:underline"
                            >
                                Explore all seller stores
                            </a>
                        </div>
                    </div>

                    {/* Card 4: Sell on Platform / Sign In */}
                    <div className="flex flex-col justify-between rounded-sm bg-white p-5 shadow-sm border border-neutral-200">
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900 leading-tight">
                                {auth?.user ? `Welcome, ${auth.user.name.split(' ')[0]}` : 'Sell on Our Platform'}
                            </h2>
                            <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                                {auth?.user?.vendor
                                    ? 'Manage your vendor catalog, inventory, and track seller performance in real-time.'
                                    : 'Join thousands of independent sellers. List your products and grow your brand worldwide.'}
                            </p>

                            <div className="mt-4">
                                {auth?.user?.vendor ? (
                                    <Link
                                        href={route('vendor.dashboard')}
                                        className="block w-full rounded-md bg-[#ffd814] py-2 text-center text-xs font-bold text-neutral-900 shadow-sm transition hover:bg-[#f7ca00]"
                                    >
                                        Go to Vendor Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('vendor.apply')}
                                        className="block w-full rounded-md bg-[#ffd814] py-2 text-center text-xs font-bold text-neutral-900 shadow-sm transition hover:bg-[#f7ca00]"
                                    >
                                        Become a Vendor Now
                                    </Link>
                                )}

                                {!auth?.user && (
                                    <div className="mt-3 text-center">
                                        <p className="text-[11px] text-neutral-500">
                                            Already registered?{' '}
                                            <Link
                                                href={route('vendor.login')}
                                                className="text-[#007185] font-semibold hover:underline"
                                            >
                                                Sign In to Vendor
                                            </Link>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 border-t border-neutral-100 pt-3">
                            <div className="flex items-center justify-between text-[11px] text-neutral-500">
                                <span>Zero setup fee</span>
                                <span>•</span>
                                <span>Full product CRUD</span>
                                <span>•</span>
                                <span>Fast approval</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. TODAY'S DEALS HORIZONTAL CAROUSEL */}
            <div id="todays-deals" className="mx-auto mt-6 max-w-[1500px] px-3 sm:px-6">
                <div className="relative rounded-sm bg-white p-5 shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-neutral-900">
                                Today's Deals
                            </h2>
                            <span className="hidden sm:inline-block text-xs text-[#007185] hover:underline cursor-pointer">
                                See all deals
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => scrollDeals('left')}
                                className="flex h-8 w-8 items-center justify-center rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200"
                                aria-label="Scroll left"
                            >
                                ‹
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollDeals('right')}
                                className="flex h-8 w-8 items-center justify-center rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200"
                                aria-label="Scroll right"
                            >
                                ›
                            </button>
                        </div>
                    </div>

                    {/* Horizontal scroll deals strip */}
                    <div
                        ref={dealsScrollRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2"
                    >
                        {deals.map((item) => {
                            const hasDiscount = item.discount_value > 0;

                            return (
                                <div
                                    key={item.id}
                                    className="group flex w-[210px] shrink-0 flex-col justify-between rounded border border-neutral-100 p-3 hover:shadow-md transition bg-white"
                                >
                                    <div>
                                        {/* Product Image */}
                                        <div className="flex h-36 w-full items-center justify-center overflow-hidden bg-white">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="max-h-full max-w-full object-contain transition group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-[11px] text-neutral-400">
                                                    No image
                                                </div>
                                            )}
                                        </div>

                                        {/* Deal Tag */}
                                        <div className="mt-3 flex items-center gap-1.5">
                                            {hasDiscount ? (
                                                <span className="rounded bg-[#cc0c39] px-1.5 py-0.5 text-[10px] font-bold text-white">
                                                    {item.discount_type === 'percentage'
                                                        ? `${item.discount_value}% off`
                                                        : `$${item.discount_value} off`}
                                                </span>
                                            ) : (
                                                <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                                    Featured
                                                </span>
                                            )}
                                            <span className="text-[10px] font-bold text-[#cc0c39] truncate">
                                                Limited time deal
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="mt-1 text-xs font-semibold text-neutral-800 line-clamp-2 leading-snug group-hover:text-[#c7511f]">
                                            {item.name}
                                        </h3>
                                    </div>

                                    {/* Vendor Attribution */}
                                    <div className="mt-3 border-t border-neutral-100 pt-2">
                                        <p className="text-[10px] text-neutral-500 truncate">
                                            Sold by:{' '}
                                            <span className="font-semibold text-neutral-700">
                                                {item.vendor?.shop_name || 'Marketplace Seller'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {deals.length === 0 && (
                            <div className="w-full py-8 text-center text-sm text-neutral-500">
                                Check back soon for daily lightning deals!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. MULTI-VENDOR MARKETPLACE SPOTLIGHT */}
            <div id="vendor-spotlight" className="mx-auto mt-6 max-w-[1500px] px-3 sm:px-6">
                <div className="rounded-sm bg-white p-5 shadow-sm border border-neutral-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-3 gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-neutral-900">
                                    Shop from Verified Vendor Stores
                                </h2>
                                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
                                    Multi-Vendor Hub
                                </span>
                            </div>
                            <p className="text-xs text-neutral-600 mt-0.5">
                                Buy directly from local artisans, distributors, and certified businesses.
                            </p>
                        </div>
                        <Link
                            href={route('vendor.apply')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007185] hover:text-[#c7511f] hover:underline"
                        >
                            <span>Sell with us — Open your store</span>
                            <span>→</span>
                        </Link>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {vendors.map((vendor) => (
                            <div
                                key={vendor.id}
                                className="flex flex-col justify-between rounded border border-neutral-200 p-4 hover:border-amber-400 hover:shadow-md transition bg-neutral-50/50"
                            >
                                <div>
                                    <div className="flex items-center gap-3">
                                        {vendor.logo_url ? (
                                            <img
                                                src={vendor.logo_url}
                                                alt={vendor.shop_name}
                                                className="h-12 w-12 rounded-full border border-neutral-200 object-cover shadow-sm"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#131921] text-white font-black text-lg">
                                                {vendor.shop_name?.charAt(0) || 'V'}
                                            </div>
                                        )}
                                        <div className="overflow-hidden">
                                            <h3 className="text-sm font-bold text-neutral-900 truncate">
                                                {vendor.shop_name}
                                            </h3>
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                </svg>
                                                Verified Seller
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-xs text-neutral-600 space-y-1">
                                        <p className="flex items-center justify-between">
                                            <span className="text-neutral-500">Products Listed:</span>
                                            <span className="font-bold text-neutral-900">{vendor.products_count ?? 0}</span>
                                        </p>
                                        {vendor.address && (
                                            <p className="text-[11px] text-neutral-500 truncate">
                                                📍 {vendor.address}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-neutral-200">
                                    <Link
                                        href={route('home', { vendor: vendor.id })}
                                        className="block w-full rounded bg-white py-1.5 text-center text-xs font-bold text-neutral-800 border border-neutral-300 shadow-xs hover:bg-[#febd69] hover:border-amber-400 hover:text-neutral-950 transition"
                                    >
                                        Visit Storefront
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {/* CTA Card for New Vendors */}
                        <div className="flex flex-col justify-between rounded border-2 border-dashed border-amber-300 p-4 bg-amber-50/40 text-center">
                            <div>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#febd69] text-neutral-900 font-bold">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </div>
                                <h3 className="mt-2 text-sm font-bold text-neutral-900">
                                    Your Store Here
                                </h3>
                                <p className="mt-1 text-xs text-neutral-600">
                                    Join our marketplace to showcase your products to active buyers.
                                </p>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={route('vendor.apply')}
                                    className="block w-full rounded bg-[#ffd814] py-1.5 text-xs font-bold text-neutral-900 shadow-sm hover:bg-[#f7ca00] transition"
                                >
                                    Register as Vendor
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. MAIN PRODUCT CATALOG & SEARCH RESULTS */}
            <div id="products-catalog" className="mx-auto mt-6 max-w-[1500px] px-3 sm:px-6">
                <div className="rounded-sm bg-white p-5 shadow-sm border border-neutral-200">
                    {/* Header with Search/Filter Information */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-neutral-200 gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">
                                {hasFilters ? 'Search & Filter Results' : 'Explore All Products'}
                            </h2>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                Showing {productList.length} products
                                {filters.search && <span> for <strong className="text-neutral-800">"{filters.search}"</strong></span>}
                            </p>
                        </div>

                        {/* Filter Badges & Sort dropdown */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Active Filter Pills */}
                            {filters.search && (
                                <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                                    Keyword: {filters.search}
                                    <button
                                        type="button"
                                        onClick={() => clearFilter('search')}
                                        className="text-neutral-400 hover:text-neutral-900 font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filters.category && (
                                <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">
                                    Category: {categories.find((c) => String(c.id) === String(filters.category))?.name || 'Selected'}
                                    <button
                                        type="button"
                                        onClick={() => clearFilter('category')}
                                        className="text-amber-700 hover:text-neutral-900 font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filters.vendor && (
                                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-900">
                                    Vendor: {vendors.find((v) => String(v.id) === String(filters.vendor))?.shop_name || 'Selected'}
                                    <button
                                        type="button"
                                        onClick={() => clearFilter('vendor')}
                                        className="text-emerald-700 hover:text-neutral-900 font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}

                            {hasFilters && (
                                <Link
                                    href={route('home')}
                                    className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline"
                                >
                                    Clear all filters
                                </Link>
                            )}

                            {/* Sort Selector */}
                            <div className="flex items-center gap-2 ml-auto">
                                <label htmlFor="sort-select" className="text-xs text-neutral-600 font-medium">
                                    Sort by:
                                </label>
                                <select
                                    id="sort-select"
                                    value={filters.sort || 'featured'}
                                    onChange={handleSortChange}
                                    className="rounded border border-neutral-300 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="newest">Newest Arrivals</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Department Quick Filter Chips */}
                    <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        <Link
                            href={route('home')}
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
                                !filters.category
                                    ? 'bg-[#131921] text-white'
                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                            }`}
                        >
                            All Categories
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={route('home', { ...filters, category: cat.id })}
                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
                                    String(filters.category) === String(cat.id)
                                        ? 'bg-[#131921] text-white'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>

                    {/* Amazon-style Product Cards Grid */}
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
                        {productList.map((product) => {
                            const hasDiscount = product.discount_value > 0;

                            return (
                                <div
                                    key={product.id}
                                    className="group flex flex-col justify-between rounded border border-neutral-200 bg-white p-3 hover:shadow-lg transition relative"
                                >
                                    <div>
                                        {/* Product Image */}
                                        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded bg-white">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="max-h-full max-w-full object-contain transition duration-200 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-neutral-50 text-neutral-400 text-xs">
                                                    Product Image
                                                </div>
                                            )}

                                            {/* Badge on Image */}
                                            {hasDiscount && (
                                                <span className="absolute top-1 left-1 rounded bg-[#cc0c39] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                                                    {product.discount_type === 'percentage'
                                                        ? `${product.discount_value}% off`
                                                        : `$${product.discount_value} off`}
                                                </span>
                                            )}
                                        </div>

                                        {/* Seller & Category info */}
                                        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
                                            <span className="truncate max-w-[100px]">
                                                {product.category?.name || 'General'}
                                            </span>
                                            {product.vendor && (
                                                <Link
                                                    href={route('home', { vendor: product.vendor.id })}
                                                    className="font-medium text-[#007185] hover:underline truncate max-w-[100px]"
                                                >
                                                    {product.vendor.shop_name}
                                                </Link>
                                            )}
                                        </div>

                                        {/* Product Title */}
                                        <h3 className="mt-1 text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug group-hover:text-[#c7511f]">
                                            {product.name}
                                        </h3>

                                        {/* Star Rating Display (Amazon 5-Star Format) */}
                                        <div className="mt-1 flex items-center gap-1">
                                            <div className="flex text-[#de7921] text-xs">
                                                ★★★★<span className="text-gray-300">★</span>
                                            </div>
                                            <span className="text-[11px] text-[#007185] hover:underline cursor-pointer">
                                                {(product.id * 17) % 80 + 12}
                                            </span>
                                        </div>

                                        {/* Shipping Badge */}
                                        <p className="mt-1 text-[11px] text-neutral-600">
                                            <span className="font-semibold text-neutral-800">FREE delivery</span> on eligible orders
                                        </p>

                                        {/* Stock note */}
                                        <p className="mt-0.5 text-[11px] text-emerald-700 font-medium">
                                            {product.stock > 0 ? 'In Stock' : 'Order soon'}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-3 pt-2">
                                        <button
                                            type="button"
                                            className="w-full rounded-full bg-[#ffd814] py-1.5 text-xs font-semibold text-neutral-900 shadow-sm transition hover:bg-[#f7ca00] active:scale-98"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {productList.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-base font-bold text-neutral-900">
                                No products found
                            </h3>
                            <p className="mt-1 text-xs text-neutral-500">
                                Try changing your search keywords or removing active category/vendor filters.
                            </p>
                            <div className="mt-4">
                                <Link
                                    href={route('home')}
                                    className="rounded-md bg-[#ffd814] px-4 py-2 text-xs font-bold text-neutral-900 shadow-sm hover:bg-[#f7ca00]"
                                >
                                    Browse all products
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Pagination Links if paginated */}
                    {products?.links && products.links.length > 3 && (
                        <div className="mt-8 flex items-center justify-center gap-1 border-t border-neutral-200 pt-4">
                            {products.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                                        link.active
                                            ? 'bg-[#131921] text-white font-bold'
                                            : link.url
                                            ? 'text-neutral-700 hover:bg-neutral-100 border border-neutral-300'
                                            : 'text-neutral-300 cursor-not-allowed border border-neutral-200'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </FrontendLayout>
    );
}
