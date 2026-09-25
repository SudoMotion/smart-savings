import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input, Select, Textarea } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export default function Edit({ depositOption }) {
    const { data, setData, put, processing, errors } = useForm({
        coin_type: depositOption.coin_type ?? '',
        value: depositOption.value ?? '',
        status: depositOption.status ?? 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.deposit-options.update', depositOption.id));
    };

    return (
        <AdminLayout title="Edit Deposit Option">
            <Head title="Edit Deposit Option" />

            <AdminPageHeader
                title={`Edit Deposit Option: ${depositOption.coin_type}`}
                backHref={route('admin.deposit-options.index')}
                backLabel="Back to deposit options"
            />

            <AdminForm onSubmit={submit}>
                <Card title="Deposit Option Details">
                    <AdminFormGrid>
                        <Input
                            id="coin_type"
                            label="Coin Type"
                            placeholder="e.g. Bitcoin (BTC), USDT (TRC20), Ethereum (ETH)"
                            wrapperClassName="sm:col-span-2 lg:col-span-2 xl:col-span-2"
                            value={data.coin_type}
                            error={errors.coin_type}
                            required
                            onChange={(e) => setData('coin_type', e.target.value)}
                        />

                        <Textarea
                            id="value"
                            label="Deposit Value / Address"
                            placeholder="Enter wallet address, payment link, or deposit instructions"
                            wrapperClassName="sm:col-span-2 lg:col-span-3 xl:col-span-4"
                            value={data.value}
                            error={errors.value}
                            required
                            onChange={(e) => setData('value', e.target.value)}
                        />

                        <Select
                            id="status"
                            label="Status"
                            wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-2"
                            value={data.status}
                            error={errors.status}
                            options={statusOptions}
                            onChange={(e) => setData('status', e.target.value)}
                        />
                    </AdminFormGrid>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link href={route('admin.deposit-options.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Update Deposit Option
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}

