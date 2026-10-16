import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Alert, Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({
    userOptions = [],
    orderResetIntervalOptions = [],
    defaultOrderResetInterval = '24_hours',
}) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: userOptions[0]?.value ?? '',
        order_limit: '',
        order_reset_interval: defaultOrderResetInterval,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.order-limits.store'));
    };

    return (
        <AdminLayout title="Add user order limit">
            <Head title="Add user order limit" />

            <AdminPageHeader
                title="Add user order limit"
                description="Override the global limit for a specific user."
                backHref={route('admin.order-limits.index')}
                backLabel="Back to order limits"
            />

            {userOptions.length === 0 ? (
                <Alert variant="warning">
                    All users already have a custom order limit, or no users exist. Edit an existing entry
                    instead.
                </Alert>
            ) : (
                <AdminForm onSubmit={submit}>
                    <Card title="User limit">
                        <AdminFormGrid>
                            <Select
                                id="user_id"
                                label="User"
                                placeholder="Select user"
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
                                label="Order limit (USD)"
                                placeholder="0.00"
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
                                Save limit
                            </Button>
                        </div>
                    </Card>
                </AdminForm>
            )}
        </AdminLayout>
    );
}
