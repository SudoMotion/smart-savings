import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        referral_from: '1',
        referral_to: '',
        reward_amount: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.referral-tiers.store'));
    };

    return (
        <AdminLayout title="Add referral tier">
            <Head title="Add referral tier" />

            <AdminPageHeader
                title="Add referral tier"
                backHref={route('admin.referral-tiers.index')}
                backLabel="Back to referral rewards"
            />

            <AdminForm onSubmit={submit}>
                <Card title="Tier details">
                    <AdminFormGrid>
                        <Input
                            id="referral_from"
                            type="number"
                            min="1"
                            step="1"
                            label="From referral #"
                            wrapperClassName="sm:col-span-2 lg:col-span-1"
                            value={data.referral_from}
                            error={errors.referral_from}
                            required
                            onChange={(e) => setData('referral_from', e.target.value)}
                        />
                        <Input
                            id="referral_to"
                            type="number"
                            min="1"
                            step="1"
                            label="To referral # (optional)"
                            wrapperClassName="sm:col-span-2 lg:col-span-1"
                            value={data.referral_to}
                            error={errors.referral_to}
                            onChange={(e) => setData('referral_to', e.target.value)}
                        />
                        <Input
                            id="reward_amount"
                            type="number"
                            step="0.01"
                            min="0"
                            label="Bonus amount"
                            wrapperClassName="sm:col-span-2 lg:col-span-1"
                            value={data.reward_amount}
                            error={errors.reward_amount}
                            required
                            onChange={(e) => setData('reward_amount', e.target.value)}
                        />
                    </AdminFormGrid>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link href={route('admin.referral-tiers.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Save tier
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}