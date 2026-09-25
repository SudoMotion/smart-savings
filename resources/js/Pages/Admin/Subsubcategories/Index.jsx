import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    ActionButtonGroup,
    Alert,
    Button,
    Card,
    DeleteAction,
    EditAction,
} from '@/Components/UI';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ subsubcategories, can }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout title="Sub-subcategories">
            <Head title="Sub-subcategories" />

            <AdminPageHeader
                title="Sub-subcategories"
                description="Manage catalog third-level categories under categories and subcategories."
                actions={
                    can.create ? (
                        <Link href={route('admin.subsubcategories.create')}>
                            <Button>Add Sub-subcategory</Button>
                        </Link>
                    ) : null
                }
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <Card bodyClassName="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Name
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Category
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Subcategory
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Status
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Created
                                </th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {subsubcategories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-sm text-neutral-500"
                                    >
                                        No sub-subcategories found.
                                    </td>
                                </tr>
                            ) : (
                                subsubcategories.map((item) => (
                                    <tr key={item.id} className="hover:bg-neutral-50/50">
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-neutral-900">
                                            {item.name}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                            {item.category_name}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                            {item.subcategory_name}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    item.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                                                        : 'bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-500/20'
                                                }`}
                                            >
                                                {item.status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-500">
                                            {item.created_at ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <ActionButtonGroup className="justify-end">
                                                {can.edit && (
                                                    <EditAction
                                                        href={route(
                                                            'admin.subsubcategories.edit',
                                                            item.id,
                                                        )}
                                                    />
                                                )}
                                                {can.delete && (
                                                    <DeleteAction
                                                        href={route(
                                                            'admin.subsubcategories.destroy',
                                                            item.id,
                                                        )}
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
            </Card>
        </AdminLayout>
    );
}

