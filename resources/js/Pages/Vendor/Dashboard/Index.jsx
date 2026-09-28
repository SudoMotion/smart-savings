import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import {
    Alert,
    Button,
    Card,
} from '@/Components/UI';
import VendorLayout from '@/Layouts/Vendor/VendorLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ vendor, stats }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    return (
        <VendorLayout title="Vendor Dashboard">
            <Head title="Vendor Dashboard" />

            <AdminPageHeader
                title={`Welcome, ${vendor?.shop_name || user.name}`}
                description="Monitor your store performance, products, and customer orders from your vendor dashboard."
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            {/* Store Information Banner */}
            <div className="mb-6 overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        {vendor?.logo_url ? (
                            <img
                                src={vendor.logo_url}
                                alt={vendor.shop_name}
                                className="h-16 w-16 rounded-lg border border-neutral-200 object-cover shadow-sm"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-900 text-xl font-bold text-white shadow-sm">
                                {vendor?.shop_name?.charAt(0) || user.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-lg font-bold text-neutral-900">
                                    {vendor?.shop_name || 'My Store'}
                                </h2>
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                    Verified Vendor
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-neutral-500">
                                Owner: <strong className="text-neutral-700">{user.name}</strong> ({user.email}) &bull; Member since {vendor?.created_at || 'Recently'}
                            </p>
                            {vendor?.phone && (
                                <p className="text-xs text-neutral-500">
                                    Phone: <span className="text-neutral-700">{vendor.phone}</span>
                                    {vendor?.address && (
                                        <> &bull; Address: <span className="text-neutral-700">{vendor.address}</span></>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 transition"
                        >
                            Visit Marketplace
                        </a>
                    </div>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <Card bodyClassName="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                                Total Products
                            </p>
                            <p className="mt-2 text-2xl font-bold text-neutral-900">
                                {stats.total_products}
                            </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card bodyClassName="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                                Active Products
                            </p>
                            <p className="mt-2 text-2xl font-bold text-neutral-900">
                                {stats.active_products}
                            </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card bodyClassName="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                                Account Status
                            </p>
                            <p className="mt-2 text-lg font-bold capitalize text-emerald-600">
                                {stats.shop_status}
                            </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                            </svg>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Welcome & Info */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card title="Getting Started with Vendor Portal">
                    <div className="space-y-4 text-xs text-neutral-600">
                        <p>
                            Welcome to your official vendor workspace! From here, you can manage your shop presence, keep your store details up to date, and reach customers across the platform.
                        </p>
                        <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
                            <h4 className="font-semibold text-neutral-900 mb-1">Store Details</h4>
                            <p><strong>Shop Name:</strong> {vendor?.shop_name || 'Not set'}</p>
                            <p><strong>Contact Email:</strong> {user.email}</p>
                            <p><strong>Contact Phone:</strong> {vendor?.phone || 'Not set'}</p>
                            <p><strong>Address:</strong> {vendor?.address || 'Not set'}</p>
                        </div>
                        <p>
                            Need help updating your business profile or have questions about listing products? Please contact marketplace support.
                        </p>
                    </div>
                </Card>

                <Card title="Marketplace Activity & Notices">
                    <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-neutral-500">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mb-3">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                        </div>
                        <p className="font-medium text-neutral-700">No new notices</p>
                        <p className="mt-1">All systems are running normally. Happy selling!</p>
                    </div>
                </Card>
            </div>
        </VendorLayout>
    );
}

