import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Alert, Button, Card, Input } from '@/Components/UI';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function EditPassword({ user }) {
    const { flash } = usePage().props;
    const { data, setData, put, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.update-password', user.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout title="Change password">
            <Head title="Change password" />

            <AdminPageHeader
                title="Change password"
                description={`${user.name} · ${user.email}`}
                backHref={route('admin.users.edit', user.id)}
                backLabel="Back to edit user"
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <AdminForm onSubmit={submit}>
                <Card title="New password">
                    <AdminFormGrid>
                        <Input
                            id="password"
                            label="New password"
                            type="password"
                            value={data.password}
                            error={errors.password}
                            required
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <Input
                            id="password_confirmation"
                            label="Confirm new password"
                            type="password"
                            value={data.password_confirmation}
                            error={errors.password_confirmation}
                            required
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                    </AdminFormGrid>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link href={route('admin.users.edit', user.id)}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Update password
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}
