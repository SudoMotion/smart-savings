import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ roles = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: roles[0]?.value ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.staff-users.store'));
    };

    return (
        <AdminLayout title="Add Staff User">
            <Head title="Add Staff User" />

            <AdminPageHeader
                title="Add Staff User"
                backHref={route('admin.staff-users.index')}
                backLabel="Back to staff users"
            />

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
                            label="Password"
                            type="password"
                            value={data.password}
                            error={errors.password}
                            required
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <Input
                            id="password_confirmation"
                            label="Confirm password"
                            type="password"
                            value={data.password_confirmation}
                            error={errors.password_confirmation}
                            required
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                    </AdminFormGrid>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link href={route('admin.staff-users.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Save User
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}