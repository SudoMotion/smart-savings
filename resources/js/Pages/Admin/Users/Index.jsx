import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import Modal from '@/Components/Modal';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    ActionButtonGroup,
    Alert,
    Button,
    Card,
    DeleteAction,
    EditAction,
    Input,
    MemberTypeAction,
    PercentageAction,
    Select,
} from '@/Components/UI';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const portalTypeStyles = {
    customer: 'bg-sky-50 text-sky-700',
    vendor: 'bg-emerald-50 text-emerald-700',
    staff: 'bg-indigo-50 text-indigo-700',
};

const portalTypeLabels = {
    customer: 'Customer',
    vendor: 'Vendor',
    staff: 'Staff',
};

const memberAccountTypeStyles = {
    inactive_member: 'bg-neutral-100 text-neutral-600',
    gold_member: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
    diamond_member: 'bg-cyan-50 text-cyan-800 ring-1 ring-cyan-200',
    disable: 'bg-rose-50 text-rose-800 ring-1 ring-rose-200',
};

const userTypeStyles = {
    regular: 'bg-neutral-100 text-neutral-700',
    exclusive: 'bg-violet-50 text-violet-800 ring-1 ring-violet-200',
};

export default function Index({ users, filters, counts, accountTypeOptions = [], can }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [percentageUser, setPercentageUser] = useState(null);
    const [memberTypeUser, setMemberTypeUser] = useState(null);

    const {
        data: percentageData,
        setData: setPercentageData,
        patch: patchPercentage,
        processing: percentageProcessing,
        errors: percentageErrors,
        reset: resetPercentageForm,
    } = useForm({
        percentage: '',
    });

    useEffect(() => {
        if (percentageUser) {
            setPercentageData('percentage', String(percentageUser.percentage ?? 0));
        } else {
            resetPercentageForm();
        }
    }, [percentageUser, resetPercentageForm, setPercentageData]);

    const {
        data: memberTypeData,
        setData: setMemberTypeData,
        patch: patchMemberType,
        processing: memberTypeProcessing,
        errors: memberTypeErrors,
        reset: resetMemberTypeForm,
    } = useForm({
        account_type: '',
    });

    useEffect(() => {
        if (memberTypeUser) {
            setMemberTypeData('account_type', memberTypeUser.account_type ?? 'inactive_member');
        } else {
            resetMemberTypeForm();
        }
    }, [memberTypeUser, resetMemberTypeForm, setMemberTypeData]);

    const userList = users.data ?? [];

    const submitPercentage = (e) => {
        e.preventDefault();
        if (!percentageUser) return;

        patchPercentage(route('admin.users.update-percentage', percentageUser.id), {
            preserveScroll: true,
            onSuccess: () => setPercentageUser(null),
        });
    };

    const submitMemberType = (e) => {
        e.preventDefault();
        if (!memberTypeUser) return;

        patchMemberType(route('admin.users.update-account-type', memberTypeUser.id), {
            preserveScroll: true,
            onSuccess: () => setMemberTypeUser(null),
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.users.index'),
            { type: filters.type || undefined, search: search || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterType = (newType) => {
        router.get(
            route('admin.users.index'),
            {
                type: newType || undefined,
                search: filters.search || undefined,
            },
            { preserveState: true }
        );
    };

    return (
        <AdminLayout title="User Management">
            <Head title="User Management" />

            <AdminPageHeader
                title="User Management"
                description="View and manage customers, vendors, and staff accounts."
                actions={
                    can.create ? (
                        <Link href={route('admin.users.create')}>
                            <Button>Add User</Button>
                        </Link>
                    ) : null
                }
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleFilterType(null)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                            !filters.type
                                ? 'bg-neutral-900 text-white'
                                : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                        }`}
                    >
                        All ({counts.all})
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterType('customer')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                            filters.type === 'customer'
                                ? 'bg-sky-600 text-white'
                                : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                        }`}
                    >
                        Customers ({counts.customer})
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterType('vendor')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                            filters.type === 'vendor'
                                ? 'bg-emerald-600 text-white'
                                : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                        }`}
                    >
                        Vendors ({counts.vendor})
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterType('staff')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                            filters.type === 'staff'
                                ? 'bg-indigo-600 text-white'
                                : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                        }`}
                    >
                        Staff ({counts.staff})
                    </button>
                </div>

                <form onSubmit={handleSearch} className="flex w-full max-w-sm items-end gap-2">
                    <Input
                        id="user-search"
                        type="search"
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        wrapperClassName="min-w-0 flex-1"
                    />
                    <Button type="submit" variant="secondary">
                        Search
                    </Button>
                </form>
            </div>

            <Card bodyClassName="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    User
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Portal
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Member type
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    User type
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Role
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Wallet
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Percentage
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Registered
                                </th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {userList.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-12 text-center">
                                        <div className="mx-auto max-w-sm text-center">
                                            <svg
                                                className="mx-auto h-12 w-12 text-neutral-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                                />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-neutral-900">
                                                No users found
                                            </h3>
                                            <p className="mt-1 text-sm text-neutral-500">
                                                Try adjusting your search or filter, or add a new user.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                userList.map((user) => (
                                    <tr key={user.id} className="hover:bg-neutral-50/50">
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <div className="text-sm font-medium text-neutral-900">
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-neutral-500">{user.email}</div>
                                            {user.vendor_shop && (
                                                <div className="text-[11px] text-emerald-600">
                                                    Shop: {user.vendor_shop}
                                                </div>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                                                    portalTypeStyles[user.portal_type] ||
                                                    'bg-neutral-100 text-neutral-600'
                                                }`}
                                            >
                                                {portalTypeLabels[user.portal_type] || user.portal_type}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                    memberAccountTypeStyles[user.account_type] ||
                                                    'bg-neutral-100 text-neutral-600'
                                                }`}
                                            >
                                                {user.account_type_label || user.account_type}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                    userTypeStyles[user.user_type] ||
                                                    'bg-neutral-100 text-neutral-600'
                                                }`}
                                            >
                                                {user.user_type_label || user.user_type}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-neutral-600">
                                            {user.role ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-neutral-900">
                                            ${Number(user.wallet_balance ?? 0).toFixed(2)}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-neutral-900">
                                            {Number(user.percentage ?? 0).toFixed(2)}%
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                            {user.created_at ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <ActionButtonGroup className="justify-end">
                                                {can.edit && (
                                                    <MemberTypeAction
                                                        title="Set member type"
                                                        onClick={() => setMemberTypeUser(user)}
                                                    />
                                                )}
                                                {can.edit && (
                                                    <PercentageAction
                                                        title="Set user percentage"
                                                        onClick={() => setPercentageUser(user)}
                                                    />
                                                )}
                                                {can.edit && (
                                                    <EditAction
                                                        href={route('admin.users.edit', user.id)}
                                                    />
                                                )}
                                                {can.delete && (
                                                    <DeleteAction
                                                        href={route('admin.users.destroy', user.id)}
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

                {users.links && users.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
                        <div className="text-xs text-neutral-500">
                            Showing {users.from ?? 0} to {users.to ?? 0} of {users.total} users
                        </div>
                        <div className="flex gap-1">
                            {users.links.map((link, idx) => (
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

            <Modal show={!!memberTypeUser} onClose={() => setMemberTypeUser(null)} maxWidth="sm">
                <form onSubmit={submitMemberType} className="p-6">
                    <h3 className="text-base font-semibold text-neutral-900">Set member type</h3>
                    <p className="mt-1 text-xs text-neutral-600">
                        {memberTypeUser?.name} ({memberTypeUser?.email})
                    </p>

                    <div className="mt-4">
                        <Select
                            id="user-account-type"
                            label="Account type"
                            value={memberTypeData.account_type}
                            error={memberTypeErrors.account_type}
                            options={accountTypeOptions}
                            required
                            onChange={(e) => setMemberTypeData('account_type', e.target.value)}
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setMemberTypeUser(null)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={memberTypeProcessing}>
                            Save
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal show={!!percentageUser} onClose={() => setPercentageUser(null)} maxWidth="sm">
                <form onSubmit={submitPercentage} className="p-6">
                    <h3 className="text-base font-semibold text-neutral-900">Set user percentage</h3>
                    <p className="mt-1 text-xs text-neutral-600">
                        {percentageUser?.name} ({percentageUser?.email})
                    </p>

                    <div className="mt-4">
                        <Input
                            id="user-percentage"
                            label="Percentage (%)"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={percentageData.percentage}
                            error={percentageErrors.percentage}
                            required
                            onChange={(e) => setPercentageData('percentage', e.target.value)}
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setPercentageUser(null)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={percentageProcessing}>
                            Save
                        </Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
