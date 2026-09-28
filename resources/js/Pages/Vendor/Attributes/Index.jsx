import { useState } from 'react';
import VendorLayout from '@/Layouts/Vendor/VendorLayout';
import {
    ActionButtonGroup,
    Alert,
    Button,
    Card,
    DeleteAction,
    EditAction,
} from '@/Components/UI';
import Modal from '@/Components/Modal';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ attributes = { data: [] }, filters = {} }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [attrToDelete, setAttrToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('vendor.attributes.index'),
            { search: search.trim() },
            { preserveState: true, replace: true }
        );
    };

    const handleClear = () => {
        setSearch('');
        router.get(route('vendor.attributes.index'), {}, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        if (!attrToDelete) return;
        setDeleting(true);
        router.delete(route('vendor.attributes.destroy', attrToDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setAttrToDelete(null);
            },
        });
    };

    return (
        <VendorLayout title="Attribute Management">
            <Head title="Attributes - Vendor Panel" />

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                        Product Attributes
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-500">
                        Manage global platform attribute definitions (Color, Size, Material, RAM, etc.).
                    </p>
                </div>

                <Link href={route('vendor.attributes.create')}>
                    <Button className="flex items-center gap-1.5 shadow-xs">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>Add Attribute</span>
                    </Button>
                </Link>
            </div>

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            {/* Search Filter */}
            <Card className="mb-5 p-3 sm:p-4">
                <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search attributes by name..."
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
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition"
                        >
                            Filter
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
                    </div>
                </form>
            </Card>

            <Card bodyClassName="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200 text-left text-xs">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-neutral-500">
                                    Attribute Name
                                </th>
                                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-neutral-500">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-neutral-500">
                                    Created Date
                                </th>
                                <th className="px-4 py-3 text-right font-semibold uppercase tracking-wider text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {attributes.data && attributes.data.length > 0 ? (
                                attributes.data.map((attr) => (
                                    <tr key={attr.id} className="hover:bg-neutral-50/50 transition">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                                    </svg>
                                                </span>
                                                <span className="font-semibold text-neutral-900">{attr.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                                    attr.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-neutral-100 text-neutral-600'
                                                }`}
                                            >
                                                {attr.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-neutral-500">
                                            {attr.created_at || '—'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                            <ActionButtonGroup>
                                                <EditAction
                                                    href={route('vendor.attributes.edit', attr.id)}
                                                    title="Edit Attribute"
                                                />
                                                <DeleteAction
                                                    onClick={() => setAttrToDelete(attr)}
                                                    title="Delete Attribute"
                                                />
                                            </ActionButtonGroup>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-xs text-neutral-500">
                                        No attributes found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Pagination */}
            {attributes.links && attributes.links.length > 3 && (
                <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row border-t border-neutral-200 pt-4">
                    <p className="text-xs text-neutral-500">
                        Showing {attributes.from ?? 0} to {attributes.to ?? 0} of {attributes.total} attributes
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {attributes.links.map((link, idx) => (
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

            {/* Delete Modal */}
            <Modal show={!!attrToDelete} onClose={() => setAttrToDelete(null)} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-neutral-900">Delete Attribute</h3>
                            <p className="text-xs text-neutral-500">This action cannot be undone.</p>
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-neutral-600">
                        Are you sure you want to delete <strong className="text-neutral-900">{attrToDelete?.name}</strong>?
                    </p>
                    <div className="mt-6 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => setAttrToDelete(null)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button type="button" variant="danger" onClick={handleDelete} loading={deleting} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Yes, Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </VendorLayout>
    );
}

