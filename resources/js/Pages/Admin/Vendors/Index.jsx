import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import {
    ActionButtonGroup,
    Alert,
    Card,
    DeleteAction,
    EditAction,
} from '@/Components/UI';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ vendors, filters, counts, can }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.vendors.index'),
            { status: filters.status, search },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterStatus = (newStatus) => {
        router.get(
            route('admin.vendors.index'),
            { status: newStatus || undefined, search: filters.search || undefined },
            { preserveState: true }
        );
    };

    const handleToggleStatus = (vendor) => {
        router.post(route('admin.vendors.toggle-status', vendor.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Vendor List">
            <Head title="Vendor List" />

            <AdminPageHeader
                title="Vendor List"
                description="Manage all active and registered vendors on the platform."
                actions={
                    can.managePermissions ? (
                        <Link href={route('admin.vendor-permissions.index')}>
                            <Button variant="secondary" className="flex items-center gap-2">
                                <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                                Manage Vendor Permissions
                            </Button>
                        </Link>
                    ) : null
                }
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            {/* Filter Tabs & Search */}
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleFilterStatus(null)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                            !filters.status
                                ? 'bg-neutral-900 text-white'
                                : 'bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-200'
                        }`}
                    >
                        All ({counts.all})
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterStatus('active')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                            filters.status === 'active'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-200'
                        }`}
                    >
                        Active ({counts.active})
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterStatus('inactive')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                            filters.status === 'inactive'
                                ? 'bg-rose-600 text-white'
                                : 'bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-200'
                        }`}
                    >
                        Inactive ({counts.inactive})
                    </button>
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search vendor or shop..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9 w-64 rounded-md border border-neutral-300 bg-white px-3 text-xs placeholder-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                    />
                    <Button type="submit" size="sm" variant="secondary">
                        Search
                    </Button>
                    {filters.search && (
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setSearch('');
                                router.get(route('admin.vendors.index'), { status: filters.status });
                            }}
                        >
                            Reset
                        </Button>
                    )}
                </form>
            </div>

            <Card bodyClassName="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Shop
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Owner
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Phone & Address
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Status
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Joined Date
                                </th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {vendors.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-500">
                                        No vendors found. When applications are approved, vendors appear here.
                                    </td>
                                </tr>
                            ) : (
                                vendors.data.map((vendor) => (
                                    <tr key={vendor.id} className="hover:bg-neutral-50/60 transition">
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex items-center gap-3">
                                                {vendor.logo_url ? (
                                                    <img
                                                        src={vendor.logo_url}
                                                        alt={vendor.shop_name}
                                                        className="h-10 w-10 rounded-md border border-neutral-200 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-xs font-medium text-neutral-600">
                                                        Shop
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-neutral-900">{vendor.shop_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="font-medium text-neutral-900">{vendor.user?.name}</div>
                                            <div className="text-xs text-neutral-500">{vendor.user?.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="text-neutral-900">{vendor.phone || '—'}</div>
                                            <div className="text-xs text-neutral-500 truncate max-w-xs">{vendor.address || '—'}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {can.edit ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(vendor)}
                                                    className="group inline-flex items-center gap-1.5 focus:outline-none"
                                                    title="Click to toggle status"
                                                >
                                                    {vendor.status === 'active' ? (
                                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 group-hover:bg-emerald-100">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20 group-hover:bg-rose-100">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </button>
                                            ) : (
                                                vendor.status === 'active' ? (
                                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                                                        Inactive
                                                    </span>
                                                )
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-neutral-500">
                                            {new Date(vendor.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <ActionButtonGroup className="justify-end">
                                                {can.edit && (
                                                    <EditAction
                                                        href={route('admin.vendors.edit', vendor.id)}
                                                        title="Edit Vendor"
                                                    />
                                                )}

                                                {can.delete && (
                                                    <DeleteAction
                                                        href={route('admin.vendors.destroy', vendor.id)}
                                                        title="Delete Vendor"
                                                        confirmTitle="Delete vendor"
                                                        confirmMessage={
                                                            <>
                                                                Are you sure you want to remove{' '}
                                                                <strong>{vendor.shop_name}</strong>? This will delete
                                                                the vendor profile and revoke access to the vendor
                                                                panel.
                                                            </>
                                                        }
                                                        confirmLabel="Delete vendor"
                                                    />
                                                )}
                                            </ActionButtonGroup>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {vendors.links && vendors.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
                        <div className="text-xs text-neutral-500">
                            Showing {vendors.from ?? 0} to {vendors.to ?? 0} of {vendors.total} vendors
                        </div>
                        <div className="flex gap-1">
                            {vendors.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded px-2.5 py-1 text-xs ${
                                        link.active
                                            ? 'bg-neutral-900 text-white font-medium'
                                            : link.url
                                            ? 'text-neutral-700 hover:bg-neutral-100'
                                            : 'text-neutral-300 pointer-events-none'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </AdminLayout>
    );
}

