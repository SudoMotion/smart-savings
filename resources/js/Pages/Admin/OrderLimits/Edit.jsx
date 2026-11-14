import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ userOrderLimit, userOptions = [], orderResetIntervalOptions = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: userOrderLimit.user_id ?? '',
        order_limit: userOrderLimit.order_limit ?? '',
        order_reset_interval: userOrderLimit.order_reset_interval ?? '24_hours',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.order-limits.update', userOrderLimit.id));
    };

    return (
        <AdminLayout title="Edit user order limit">
            <Head title="Edit user order limit" />

            <AdminPageHeader
                title="Edit user order limit"
                description={`${userOrderLimit.user_name ?? 'User'} · ${userOrderLimit.user_email ?? ''}`}
                backHref={route('admin.order-limits.index')}
                backLabel="Back to order limits"
            />

            <AdminForm onSubmit={submit}>
                <Card title="User limit">
                    <AdminFormGrid>
                        <Select
                            id="user_id"
                            label="User"
                            wrapperClassName="sm:col-span-2 lg:col-span-2 xl:col-span-3"
                            value={data.user_id}
                            error={errors.user_id}
                            options={userOptions}
                            required
                            onChange={(e) => setData('user_id', e.target.value)}
                        />
                        <Input
                            id="order_limit"
                            type="number"
                            step="0.01"
                            min="0"
                            label="Order limit"
                            wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-2"
                            value={data.order_limit}
                            error={errors.order_limit}
                            required
                            onChange={(e) => setData('order_limit', e.target.value)}
                        />
                        <Select
                            id="order_reset_interval"
                            label="Order reset in"
                            wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-2"
                            value={data.order_reset_interval}
                            error={errors.order_reset_interval}
                            options={orderResetIntervalOptions}
                            required
                            onChange={(e) => setData('order_reset_interval', e.target.value)}
                        />
                    </AdminFormGrid>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link href={route('admin.order-limits.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Update limit
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}
