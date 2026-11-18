import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Alert, Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Edit({ staffUser, roles = [] }) {
    const { flash } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: staffUser.name ?? '',
        email: staffUser.email ?? '',
        role: staffUser.role ?? roles[0]?.value ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.staff-users.update', staffUser.id));
    };

    return (
        <AdminLayout title="Edit Staff User">
            <Head title="Edit Staff User" />

            <AdminPageHeader
                title="Edit Staff User"
                description={staffUser.email}
                backHref={route('admin.staff-users.index')}
                backLabel="Back to staff users"
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <AdminForm onSubmit={submit}>
                <Card title="Account">
                    <AdminFormGrid>
                        <Input
                            id="name"
                            label="Name"
                            wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-2"
                            value={data.name}
                            error={errors.name}
                            required
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <Select
                            id="role"
                            label="Role"
                            value={data.role}
                            error={errors.role}
                            options={roles}
                            required
                            onChange={(e) => setData('role', e.target.value)}
                        />
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-2"
                            value={data.email}
                            error={errors.email}
                            required
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <Input
                            id="password"
                            label="New password"
                            type="password"
                            value={data.password}
                            error={errors.password}
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <Input
                            id="password_confirmation"
                            label="Confirm new password"
                            type="password"
                            value={data.password_confirmation}
                            error={errors.password_confirmation}
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                    </AdminFormGrid>
                    <p className="mt-2 text-xs text-neutral-500">
                        Leave password fields empty to keep the current password.
                    </p>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link href={route('admin.staff-users.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Update User
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}