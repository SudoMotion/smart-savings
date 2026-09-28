import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import {
    Alert,
    Button,
    Card,
    Checkbox,
} from '@/Components/UI';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Index({ groups, assignedPermissions }) {
    const { flash } = usePage().props;

    const { data, setData, put, processing } = useForm({
        permissions: assignedPermissions || [],
    });

    const togglePermission = (name) => {
        if (data.permissions.includes(name)) {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== name)
            );
        } else {
            setData('permissions', [...data.permissions, name]);
        }
    };

    const toggleGroup = (groupPermissions) => {
        const groupKeys = Object.keys(groupPermissions);
        const allSelected = groupKeys.every((k) => data.permissions.includes(k));

        if (allSelected) {
            setData(
                'permissions',
                data.permissions.filter((p) => !groupKeys.includes(p))
            );
        } else {
            const newPerms = new Set([...data.permissions, ...groupKeys]);
            setData('permissions', Array.from(newPerms));
        }
    };

    const selectAll = () => {
        const allKeys = Object.values(groups).flatMap((g) => Object.keys(g));
        setData('permissions', allKeys);
    };

    const deselectAll = () => {
        setData('permissions', []);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.vendor-permissions.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Vendor Permissions">
            <Head title="Vendor Permissions" />

            <AdminPageHeader
                title="Vendor Permissions"
                description="Manage capabilities and access controls assigned to vendors on the platform."
                actions={
                    <div className="flex items-center gap-2">
                        <Link href={route('admin.vendors.index')}>
                            <Button variant="secondary">Back to Vendor List</Button>
                        </Link>
                    </div>
                }
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">
                            Role: <span className="text-neutral-600 font-normal">vendor</span>
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            {data.permissions.length} permissions currently assigned
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" size="xs" variant="secondary" onClick={selectAll}>
                            Select All
                        </Button>
                        <Button type="button" size="xs" variant="secondary" onClick={deselectAll}>
                            Deselect All
                        </Button>
                        <Button type="submit" size="sm" disabled={processing} className="min-w-[100px]">
                            {processing ? 'Saving...' : 'Save Permissions'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(groups).map(([groupName, groupPermissions]) => {
                        const groupKeys = Object.keys(groupPermissions);
                        const isAllGroupSelected = groupKeys.every((k) =>
                            data.permissions.includes(k)
                        );
                        const someSelected =
                            !isAllGroupSelected &&
                            groupKeys.some((k) => data.permissions.includes(k));

                        return (
                            <Card
                                key={groupName}
                                className="h-full flex flex-col justify-between"
                                title={
                                    <div className="flex items-center justify-between">
                                        <span>{groupName}</span>
                                        <button
                                            type="button"
                                            onClick={() => toggleGroup(groupPermissions)}
                                            className="text-xs font-normal text-neutral-500 hover:text-neutral-900"
                                        >
                                            {isAllGroupSelected ? 'Deselect group' : 'Select group'}
                                        </button>
                                    </div>
                                }
                            >
                                <div className="space-y-3">
                                    {Object.entries(groupPermissions).map(([permKey, permLabel]) => {
                                        const checked = data.permissions.includes(permKey);
                                        return (
                                            <div
                                                key={permKey}
                                                className="flex items-start gap-2.5 cursor-pointer rounded-md p-1.5 hover:bg-neutral-50 transition"
                                                onClick={() => togglePermission(permKey)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={permKey}
                                                    checked={checked}
                                                    onChange={() => {}} // handled by parent onClick
                                                    className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500 cursor-pointer"
                                                />
                                                <div className="flex-1 text-xs">
                                                    <span className="font-medium text-neutral-800 block">
                                                        {permLabel}
                                                    </span>
                                                    <span className="text-neutral-400 font-mono text-[11px]">
                                                        {permKey}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="sticky bottom-12 z-20 flex items-center justify-end rounded-lg border border-neutral-200 bg-white/95 p-4 backdrop-blur shadow-md">
                    <Button type="submit" disabled={processing} className="min-w-[140px]">
                        {processing ? 'Saving Changes...' : 'Save Permissions'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}

