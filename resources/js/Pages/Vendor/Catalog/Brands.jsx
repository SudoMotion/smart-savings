import { useState } from 'react';
import VendorLayout from '@/Layouts/Vendor/VendorLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Brands({ brands = { data: [] }, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('vendor.brands.index'),
            { search: search.trim() },
            { preserveState: true, replace: true }
        );
    };

    const handleClear = () => {
        setSearch('');
        router.get(route('vendor.brands.index'), {}, { preserveState: true, replace: true });
    };

    return (
        <VendorLayout title="Brand Catalog">
            <Head title="Brand Catalog - Vendor" />

            {/* Mobile-friendly Header */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                        Brands Catalog
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-500">
                        Browse active platform brands available for your product listings.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search brands..."
                            className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        />
                        <svg
                            className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                    </div>
                    <button
                        type="submit"
                        className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition"
                    >
                        Search
                    </button>
                    {filters.search && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition"
                        >
                            Reset
                        </button>
                    )}
                </form>
            </div>

            {/* Brands Grid */}
            {brands.data && brands.data.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {brands.data.map((brand) => (
                        <div
                            key={brand.id}
                            className="group flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-white p-4 text-center shadow-xs transition hover:border-neutral-400 hover:shadow-sm"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-base font-bold text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition">
                                {brand.name.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="mt-3 line-clamp-1 text-xs font-semibold text-neutral-900">
                                {brand.name}
                            </h3>
                            <span className="mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                Active
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-neutral-900">No brands found</h3>
                    <p className="mt-1 text-xs text-neutral-500">
                        {filters.search
                            ? `No brands match your query "${filters.search}".`
                            : 'There are currently no active brands in the platform catalog.'}
                    </p>
                </div>
            )}

            {/* Pagination */}
            {brands.links && brands.links.length > 3 && (
                <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row border-t border-neutral-200 pt-4">
                    <p className="text-xs text-neutral-500">
                        Showing {brands.from ?? 0} to {brands.to ?? 0} of {brands.total} brands
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {brands.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                preserveScroll
                                className={`rounded-lg px-2.5 py-1.5 text-xs transition ${
                                    link.active
                                        ? 'bg-neutral-900 text-white font-semibold'
                                        : link.url
                                        ? 'text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100'
                                        : 'text-neutral-300 pointer-events-none'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </VendorLayout>
    );
}

