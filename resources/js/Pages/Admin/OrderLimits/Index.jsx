import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    ActionButtonGroup,
    Alert,
    Button,
    Card,
    DeleteAction,
    EditAction,
    Input,
} from '@/Components/UI';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

function formatLimit(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return value;
    return n.toFixed(2);
}

export default function Index({ globalOrderLimit, userOrderLimits, filters, can }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    const globalForm = useForm({
        global_order_limit: globalOrderLimit ?? '',
    });

    const saveGlobal = (e) => {
        e.preventDefault();
        globalForm.patch(route('admin.order-limits.update-global'), {
            preserveScroll: true,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.order-limits.index'),
            { search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Order Limits">
            <Head title="Order Limits" />

            <AdminPageHeader
                title="Order Limits"
                description="Set a default order limit for all users, then override per user when needed."
                actions={
                    can.create ? (
                        <Link href={route('admin.order-limits.create')}>
                            <Button>Add user limit</Button>
                        </Link>
                    ) : null
                }
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <Card title="Global order limit" className="mb-6">
                <p className="mb-4 text-sm text-neutral-600">
                    Applies to every user who does not have a custom limit. Leave empty for no global cap.
                </p>
                <form onSubmit={saveGlobal} className="flex flex-col gap-4 sm:flex-row sm:items-end items-end">
                    <Input
                        id="global_order_limit"
                        type="number"
                        step="0.01"
                        min="0"
                        label="Global limit (USD)"
                        wrapperClassName="sm:max-w-xs flex-1"
                        value={globalForm.data.global_order_limit}
                        error={globalForm.errors.global_order_limit}
                        disabled={!can.updateGlobal}
                        onChange={(e) => globalForm.setData('global_order_limit', e.target.value)}
                    />
                    {can.updateGlobal && (
                        <Button type="submit" disabled={globalForm.processing}>
                            Save global limit
                        </Button>
                    )}
                </form>
            </Card>

            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-neutral-600">
                    {userOrderLimits.total ?? 0} user-specific limit
                    {(userOrderLimits.total ?? 0) === 1 ? '' : 's'}
                </p>
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9 w-64 rounded-md border border-neutral-300 bg-white px-3 text-xs placeholder-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                    />
                    <Button type="submit" size="sm" variant="secondary">
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
                                    Order limit
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Updated
                                </th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {userOrderLimits.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-neutral-500">
                                        No user-specific limits yet.
                                    </td>
                                </tr>
                            ) : (
                                userOrderLimits.data.map((row) => (
                                    <tr key={row.id} className="hover:bg-neutral-50/60">
                                        <td className="px-4 py-3 text-sm">
                                            <div className="font-medium text-neutral-900">
                                                {row.user?.name ?? '—'}
                                            </div>
                                            <div className="text-xs text-neutral-500">{row.user?.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-neutral-900">
                                            ${formatLimit(row.order_limit)}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-neutral-600">
                                            {row.updated_at
                                                ? new Date(row.updated_at).toLocaleString()
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <ActionButtonGroup className="justify-end">
                                                {can.edit && (
                                                    <EditAction
                                                        href={route('admin.order-limits.edit', row.id)}
                                                    />
                                                )}
                                                {can.delete && (
                                                    <DeleteAction
                                                        href={route('admin.order-limits.destroy', row.id)}
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

                {userOrderLimits.links && userOrderLimits.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
                        <div className="text-xs text-neutral-500">
                            Showing {userOrderLimits.from ?? 0} to {userOrderLimits.to ?? 0} of{' '}
                            {userOrderLimits.total} entries
                        </div>
                        <div className="flex gap-1">
                            {userOrderLimits.links.map((link, idx) => (
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
        </AdminLayout>
    );
}
