import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import Modal from '@/Components/Modal';
import {
    Alert,
    Button,
    Card,
    Input,
    Textarea,
} from '@/Components/UI';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ applications, filters, counts, can }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [rejectingApplication, setRejectingApplication] = useState(null);
    const [deletingApplication, setDeletingApplication] = useState(null);

    const {
        data: rejectData,
        setData: setRejectData,
        post: postReject,
        processing: rejectProcessing,
        errors: rejectErrors,
        reset: resetReject,
    } = useForm({
        rejection_reason: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.vendor-applications.index'),
            { status: filters.status, search },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterStatus = (newStatus) => {
        router.get(
            route('admin.vendor-applications.index'),
            { status: newStatus || undefined, search: filters.search || undefined },
            { preserveState: true }
        );
    };

    const handleApprove = (application) => {
        if (confirm(`Are you sure you want to approve the application for '${application.shop_name}'? This will create a vendor account and user login.`)) {
            router.post(route('admin.vendor-applications.approve', application.id), {}, {
                preserveScroll: true,
                onSuccess: () => setSelectedApplication(null),
            });
        }
    };

    const openRejectModal = (application) => {
        setRejectingApplication(application);
        setRejectData('rejection_reason', '');
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        if (!rejectingApplication) return;

        postReject(route('admin.vendor-applications.reject', rejectingApplication.id), {
            preserveScroll: true,
            onSuccess: () => {
                setRejectingApplication(null);
                setSelectedApplication(null);
                resetReject();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingApplication) return;
        router.delete(route('admin.vendor-applications.destroy', deletingApplication.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingApplication(null),
        });
    };

    const statusBadge = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        Pending
                    </span>
                );
        }
    };

    return (
        <AdminLayout title="Vendor Applications">
            <Head title="Vendor Applications" />

            <AdminPageHeader
                title="Vendor Applications"
                description="Review and manage vendor registration requests. Approve requests to transfer vendors to Vendor List."
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
                        onClick={() => handleFilterStatus('pending')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                            filters.status === 'pending'
                                ? 'bg-amber-600 text-white'
                                : 'bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-200'
                        }`}
                    >
                        Pending ({counts.pending})
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterStatus('approved')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                            filters.status === 'approved'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-200'
                        }`}
                    >
                        Approved ({counts.approved})
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterStatus('rejected')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                            filters.status === 'rejected'
                                ? 'bg-rose-600 text-white'
                                : 'bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-200'
                        }`}
                    >
                        Rejected ({counts.rejected})
                    </button>
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
                                router.get(route('admin.vendor-applications.index'), { status: filters.status });
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
                                    Status
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
                                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-500">
                                        No vendor applications found.
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
                                        <td className="px-4 py-3 text-sm">
                                            {statusBadge(app.status)}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-neutral-500">
                                            {new Date(app.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="xs"
                                                    variant="secondary"
                                                    onClick={() => setSelectedApplication(app)}
                                                >
                                                    View Details
                                                </Button>

                                                {app.status === 'pending' && can.approve && (
                                                    <Button
                                                        size="xs"
                                                        variant="primary"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        onClick={() => handleApprove(app)}
                                                    >
                                                        Approve
                                                    </Button>
                                                )}

                                                {app.status === 'pending' && can.reject && (
                                                    <Button
                                                        size="xs"
                                                        variant="ghost"
                                                        className="text-rose-600 hover:bg-rose-50"
                                                        onClick={() => openRejectModal(app)}
                                                    >
                                                        Reject
                                                    </Button>
                                                )}

                                                {can.delete && (
                                                    <Button
                                                        size="xs"
                                                        variant="ghost"
                                                        className="text-neutral-400 hover:text-rose-600"
                                                        onClick={() => setDeletingApplication(app)}
                                                        title="Delete Application"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </Button>
                                                )}
                                            </div>
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
                            <div>{statusBadge(selectedApplication.status)}</div>
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
                                    <p className="text-xs text-neutral-500">Shop / Brand</p>
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

                            {selectedApplication.status === 'rejected' && selectedApplication.rejection_reason && (
                                <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                                    <span className="font-semibold block mb-1">Rejection Reason:</span>
                                    {selectedApplication.rejection_reason}
                                </div>
                            )}

                            {selectedApplication.status === 'approved' && (
                                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                                    This vendor application has been approved. The vendor account is active in Vendor List and can log in at <strong>/vendor/login</strong>.
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-200 pt-4">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setSelectedApplication(null)}
                            >
                                Close
                            </Button>

                            {selectedApplication.status === 'pending' && can.reject && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => openRejectModal(selectedApplication)}
                                >
                                    Reject Application
                                </Button>
                            )}

                            {selectedApplication.status === 'pending' && can.approve && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => handleApprove(selectedApplication)}
                                >
                                    Approve Application
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Reject Modal */}
            <Modal show={!!rejectingApplication} onClose={() => setRejectingApplication(null)} maxWidth="md">
                <form onSubmit={handleRejectSubmit} className="p-6">
                    <h3 className="text-base font-semibold text-neutral-900">
                        Reject Vendor Application
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500">
                        Provide a reason for rejecting the application for{' '}
                        <strong>{rejectingApplication?.shop_name}</strong>.
                    </p>

                    <div className="mt-4">
                        <Textarea
                            id="rejection_reason"
                            label="Rejection Reason"
                            required
                            rows={4}
                            placeholder="Please state why this application is being rejected..."
                            value={rejectData.rejection_reason}
                            error={rejectErrors.rejection_reason}
                            onChange={(e) => setRejectData('rejection_reason', e.target.value)}
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-200 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setRejectingApplication(null)}
                            disabled={rejectProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="danger"
                            size="sm"
                            disabled={rejectProcessing}
                        >
                            {rejectProcessing ? 'Rejecting...' : 'Confirm Rejection'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={!!deletingApplication} onClose={() => setDeletingApplication(null)} maxWidth="sm">
                <div className="p-6">
                    <h3 className="text-base font-semibold text-neutral-900">Delete Application</h3>
                    <p className="mt-2 text-xs text-neutral-600">
                        Are you sure you want to delete this vendor application for{' '}
                        <strong>{deletingApplication?.shop_name}</strong>? This action cannot be undone.
                    </p>
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setDeletingApplication(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}

