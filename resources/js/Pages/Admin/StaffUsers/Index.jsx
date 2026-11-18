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
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ staffUsers, filters, can }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const userList = staffUsers.data ?? [];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.staff-users.index'),
            { search: search || undefined },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Staff Users">
            <Head title="Staff Users" />

            <AdminPageHeader
                title="Staff Users"
                description="Admin panel accounts with roles (Access Control)."
                actions={
                    can.create ? (
                        <Link href={route('admin.staff-users.create')}>
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
            {flash?.error && (
                <Alert variant="error" className="mb-4">
                    {flash.error}
                </Alert>
            )}

            <form onSubmit={handleSearch} className="mb-4 flex w-full max-w-sm items-end gap-2">
                <Input
                    id="staff-user-search"
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

            <Card bodyClassName="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Name
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Email
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Role
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Added
                                </th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {userList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-neutral-500">
                                        No staff users found.
                                    </td>
                                </tr>
                            ) : (
                                userList.map((user) => (
                                    <tr key={user.id} className="hover:bg-neutral-50/50">
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-neutral-900">
                                            {user.name}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                            {user.email}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold capitalize text-indigo-800">
                                                {user.role ?? '—'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                            {user.created_at ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <ActionButtonGroup className="justify-end">
                                                {can.edit && (
                                                    <EditAction href={route('admin.staff-users.edit', user.id)} />
                                                )}
                                                {can.delete && (
                                                    <DeleteAction href={route('admin.staff-users.destroy', user.id)} />
                                                )}
                                            </ActionButtonGroup>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}