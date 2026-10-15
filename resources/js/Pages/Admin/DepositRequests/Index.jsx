import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import Modal from '@/Components/Modal';
import {
    ActionButtonGroup,
    Alert,
    Button,
    Card,
    Textarea,
} from '@/Components/UI';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

function statusBadge(status) {
    const value = typeof status === 'object' && status?.value ? status.value : status;
    switch (value) {
        case 'approved':
            return 'bg-emerald-50 text-emerald-800 ring-emerald-600/20';
        case 'rejected':
            return 'bg-rose-50 text-rose-800 ring-rose-600/20';
        default:
            return 'bg-amber-50 text-amber-800 ring-amber-600/20';
    }
}

function statusText(status) {
    const value = typeof status === 'object' && status?.value ? status.value : status;
    switch (value) {
        case 'approved':
            return 'Approved';
        case 'rejected':
            return 'Rejected';
        default:
            return 'Under review';
    }
}

function formatAmount(amount) {
    const n = Number(amount);
    if (Number.isNaN(n)) return amount;
    return n.toFixed(2);
}

const statusFilters = [
    { key: null, label: 'All' },
    { key: 'under_review', label: 'Under review' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
];

export default function Index({ depositRequests, filters, counts, can }) {
    const { flash, errors } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [rejecting, setRejecting] = useState(null);

    const rejectForm = useForm({ admin_note: '' });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.deposit-requests.index'),
            { search, status: filters.status || undefined },
            { preserveState: true, replace: true },
        );
    };

    const setStatusFilter = (status) => {
        router.get(
            route('admin.deposit-requests.index'),
            { status: status || undefined, search: filters.search || undefined },
            { preserveState: true, replace: true },
        );
    };

    const handleApprove = (request) => {
        if (
            !confirm(
                `Approve deposit of $${formatAmount(request.amount)} for ${request.user?.name ?? 'this user'}? The amount will be added to their wallet.`,
            )
        ) {
            return;
        }

        router.post(route('admin.deposit-requests.approve', request.id), {}, { preserveScroll: true });
    };

    const submitReject = (e) => {
        e.preventDefault();
        if (!rejecting) return;

        rejectForm.post(route('admin.deposit-requests.reject', rejecting.id), {
            preserveScroll: true,
            onSuccess: () => {
                setRejecting(null);
                rejectForm.reset();
            },
        });
    };

    const isUnderReview = (status) => {
        const value = typeof status === 'object' && status?.value ? status.value : status;
        return value === 'under_review';
    };

    return (
        <AdminLayout title="Deposit Requests">
            <Head title="Deposit Requests" />

            <AdminPageHeader
                title="Deposit Requests"
                description="Review customer deposit submissions. Approving credits the user's wallet balance."
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            {errors?.deposit && (
                <Alert variant="error" className="mb-4">
                    {errors.deposit}
                </Alert>
            )}

            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                    {statusFilters.map(({ key, label }) => {
                        const active = (filters.status || null) === key;
                        const countKey = key === null ? 'all' : key;
                        const count = counts?.[countKey] ?? 0;
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => setStatusFilter(key)}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition ${
                                    active
                                        ? 'bg-neutral-900 text-white ring-neutral-900'
                                        : 'bg-white text-neutral-700 ring-neutral-300 hover:bg-neutral-50'
                                }`}
                            >
                                {label} ({count})
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search user, coin, or transaction ID…"
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
                                router.get(route('admin.deposit-requests.index'), {
                                    status: filters.status || undefined,
                                });
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
                                    Customer
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Coin / method
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Amount
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Transaction ID
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Submitted
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Status
                                </th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {depositRequests.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-neutral-500">
                                        No deposit requests found.
                                    </td>
                                </tr>
                            ) : (
                                depositRequests.data.map((request) => (
                                    <tr key={request.id} className="hover:bg-neutral-50/60 transition">
                                        <td className="px-4 py-3 text-sm">
                                            <div className="font-medium text-neutral-900">
                                                {request.user?.name ?? '—'}
                                            </div>
                                            <div className="text-xs text-neutral-500">{request.user?.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="font-medium text-neutral-900">{request.coin_type}</div>
                                            {request.deposit_option?.value && (
                                                <div
                                                    className="mt-0.5 max-w-[12rem] truncate font-mono text-xs text-neutral-500"
                                                    title={request.deposit_option.value}
                                                >
                                                    {request.deposit_option.value}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-neutral-900">
                                            ${formatAmount(request.amount)}
                                        </td>
                                        <td className="max-w-[10rem] px-4 py-3 font-mono text-xs text-neutral-700">
                                            <span className="break-all">{request.transaction_id}</span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-neutral-600">
                                            {request.created_at
                                                ? new Date(request.created_at).toLocaleString()
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusBadge(request.status)}`}
                                            >
                                                {statusText(request.status)}
                                            </span>
                                            {request.proof_url && (
                                                <a
                                                    href={request.proof_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-1 block text-xs text-[#007185] hover:underline"
                                                >
                                                    View proof
                                                </a>
                                            )}
                                            {request.admin_note && (
                                                <p className="mt-1 max-w-[14rem] text-xs text-neutral-500">
                                                    {request.admin_note}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {can.review && isUnderReview(request.status) ? (
                                                <ActionButtonGroup>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center justify-center rounded-md border border-emerald-200 bg-white p-2 text-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
                                                        title="Approve"
                                                        onClick={() => handleApprove(request)}
                                                    >
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="sr-only">Approve</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center justify-center rounded-md border border-rose-200 bg-white p-2 text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-1"
                                                        title="Reject"
                                                        onClick={() => {
                                                            rejectForm.reset();
                                                            setRejecting(request);
                                                        }}
                                                    >
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                        <span className="sr-only">Reject</span>
                                                    </button>
                                                </ActionButtonGroup>
                                            ) : (
                                                <span className="text-xs text-neutral-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {depositRequests.links && depositRequests.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
                        <div className="text-xs text-neutral-500">
                            Showing {depositRequests.from ?? 0} to {depositRequests.to ?? 0} of{' '}
                            {depositRequests.total} requests
                        </div>
                        <div className="flex gap-1">
                            {depositRequests.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded px-2.5 py-1 text-xs ${
                                        link.active
                                            ? 'bg-neutral-900 font-medium text-white'
                                            : link.url
                                              ? 'text-neutral-700 hover:bg-neutral-100'
                                              : 'pointer-events-none text-neutral-300'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </Card>

            <Modal show={!!rejecting} onClose={() => setRejecting(null)} maxWidth="md">
                <form onSubmit={submitReject} className="p-6">
                    <h3 className="text-base font-semibold text-neutral-900">Reject deposit request</h3>
                    <p className="mt-1 text-sm text-neutral-600">
                        Optional note for the customer (shown on their deposit history if rejected).
                    </p>
                    <Textarea
                        id="admin_note"
                        label="Admin note"
                        className="mt-4"
                        value={rejectForm.data.admin_note}
                        error={rejectForm.errors.admin_note}
                        onChange={(e) => rejectForm.setData('admin_note', e.target.value)}
                    />
                    <div className="mt-6 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => setRejecting(null)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="danger" disabled={rejectForm.processing}>
                            Reject request
                        </Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
