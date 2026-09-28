import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import Modal from '@/Components/Modal';
import {
    ActionButtonGroup,
    Alert,
    Button,
    Card,
    DeleteAction,
    ViewAction,
} from '@/Components/UI';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ applications, filters, total, can }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [rejectingApplication, setRejectingApplication] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.vendor-applications.index'),
            { search },
            { preserveState: true, replace: true }
        );
    };

    const handleApprove = (application) => {
        if (
            confirm(
                `Are you sure you want to approve the application for '${application.shop_name}'? This will transfer the vendor to the Vendor List and enable login.`
            )
        ) {
            router.post(
                route('admin.vendor-applications.approve', application.id),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => setSelectedApplication(null),
                }
            );
        }
    };

    const handleRejectConfirm = () => {
        if (!rejectingApplication) return;

        router.post(
            route('admin.vendor-applications.reject', rejectingApplication.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejectingApplication(null);
                    setSelectedApplication(null);
                },
            }
        );
    };

    return (
        <AdminLayout title="Vendor Applications">
            <Head title="Vendor Applications" />

            <AdminPageHeader
                title="Vendor Applications"
                description="Review pending vendor registration requests. Approving will transfer the vendor to the Vendor List; rejecting will delete the request."
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            {/* Header / Search toolbar */}
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20">
                        {total ?? applications.total ?? 0} Pending Application{(total ?? applications.total) === 1 ? '' : 's'}
                    </span>
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search applicant or shop..."
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
                                router.get(route('admin.vendor-applications.index'));
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
                                    Applicant
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Phone & Address
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Applied Date
                                </th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {applications.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-500">
                                        No pending vendor applications found.
                                    </td>
                                </tr>
                            ) : (
                                applications.data.map((app) => (
                                    <tr key={app.id} className="hover:bg-neutral-50/60 transition">
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex items-center gap-3">
                                                {app.logo_url ? (
                                                    <img
                                                        src={app.logo_url}
                                                        alt={app.shop_name}
                                                        className="h-10 w-10 rounded-md border border-neutral-200 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-xs font-medium text-neutral-600">
                                                        Shop
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-neutral-900">{app.shop_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="font-medium text-neutral-900">{app.name}</div>
                                            <div className="text-xs text-neutral-500">{app.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="text-neutral-900">{app.phone}</div>
                                            <div className="text-xs text-neutral-500 truncate max-w-xs">{app.address}</div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-neutral-500">
                                            {new Date(app.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <ActionButtonGroup className="justify-end">
                                                <ViewAction
                                                    onClick={() => setSelectedApplication(app)}
                                                    title="View Details"
                                                />

                                                {can.approve && (
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center justify-center rounded-md border border-emerald-200 bg-white p-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 transition"
                                                        onClick={() => handleApprove(app)}
                                                        title="Approve & Transfer to Vendor List"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                        <span className="sr-only">Approve</span>
                                                    </button>
                                                )}

                                                {can.reject && (
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center justify-center rounded-md border border-rose-200 bg-white p-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-1 transition"
                                                        onClick={() => setRejectingApplication(app)}
                                                        title="Reject & Delete Application"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        <span className="sr-only">Reject</span>
                                                    </button>
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
                {applications.links && applications.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
                        <div className="text-xs text-neutral-500">
                            Showing {applications.from ?? 0} to {applications.to ?? 0} of {applications.total} applications
                        </div>
                        <div className="flex gap-1">
                            {applications.links.map((link, idx) => (
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

            {/* Details Modal */}
            <Modal show={!!selectedApplication} onClose={() => setSelectedApplication(null)} maxWidth="lg">
                {selectedApplication && (
                    <div className="p-6">
                        <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
                            <div>
                                <h3 className="text-base font-semibold text-neutral-900">
                                    Vendor Application Details
                                </h3>
                                <p className="text-xs text-neutral-500 mt-1">
                                    Submitted on{' '}
                                    {new Date(selectedApplication.created_at).toLocaleString()}
                                </p>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                Pending Review
                            </span>
                        </div>

                        <div className="mt-5 space-y-4 text-sm">
                            <div className="flex items-center gap-4 rounded-lg border border-neutral-100 bg-neutral-50/70 p-3">
                                {selectedApplication.logo_url ? (
                                    <img
                                        src={selectedApplication.logo_url}
                                        alt={selectedApplication.shop_name}
                                        className="h-16 w-16 rounded-md border border-neutral-200 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-md border border-neutral-200 bg-neutral-200 text-sm font-semibold text-neutral-600">
                                        No Logo
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-sm font-semibold text-neutral-900">
                                        {selectedApplication.shop_name}
                                    </h4>
                                    <p className="text-xs text-neutral-500">Shop / Store</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs font-medium text-neutral-500">Applicant Name</span>
                                    <span className="font-medium text-neutral-900">{selectedApplication.name}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-neutral-500">Email</span>
                                    <span className="font-medium text-neutral-900">{selectedApplication.email}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-neutral-500">Phone</span>
                                    <span className="font-medium text-neutral-900">{selectedApplication.phone}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-neutral-500">Application ID</span>
                                    <span className="font-medium text-neutral-900">#{selectedApplication.id}</span>
                                </div>
                            </div>

                            <div>
                                <span className="block text-xs font-medium text-neutral-500">Business Address</span>
                                <span className="text-neutral-900 whitespace-pre-line">{selectedApplication.address}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-200 pt-4">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setSelectedApplication(null)}
                            >
                                Close
                            </Button>

                            {can.reject && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => setRejectingApplication(selectedApplication)}
                                >
                                    Reject Application
                                </Button>
                            )}

                            {can.approve && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => handleApprove(selectedApplication)}
                                >
                                    Approve & Transfer to Vendor List
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Reject Confirmation Modal */}
            <Modal show={!!rejectingApplication} onClose={() => setRejectingApplication(null)} maxWidth="sm">
                <div className="p-6">
                    <h3 className="text-base font-semibold text-neutral-900">
                        Reject & Delete Application
                    </h3>
                    <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                        Are you sure you want to reject the application for{' '}
                        <strong>{rejectingApplication?.shop_name}</strong>? This request will be deleted from the system.
                    </p>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setRejectingApplication(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={handleRejectConfirm}
                        >
                            Confirm Reject & Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
