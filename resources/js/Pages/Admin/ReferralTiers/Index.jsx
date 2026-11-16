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

export default function Index({ referralTiers, can }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout title="Referral rewards">
            <Head title="Referral rewards" />

            <AdminPageHeader
                title="Referral rewards"
                description="Set bonus amounts by how many successful referrals a customer has already earned. Ranges must not overlap."
                actions={
                    can.create ? (
                        <Link href={route('admin.referral-tiers.create')}>
                            <Button>Add tier</Button>
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
                                    Referral # range
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    From
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    To
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Bonus
                                </th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {referralTiers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-500">
                                        No referral tiers configured. Add tiers so referrers can earn bonuses.
                                    </td>
                                </tr>
                            ) : (
                                referralTiers.map((tier) => (
                                    <tr key={tier.id} className="hover:bg-neutral-50/50">
                                        <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                                            {tier.range_label}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-neutral-700">{tier.referral_from}</td>
                                        <td className="px-4 py-3 text-sm text-neutral-700">
                                            {tier.referral_to ?? '∞'}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-neutral-900">
                                            ${tier.formatted_reward_amount}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <ActionButtonGroup className="justify-end">
                                                {can.edit && (
                                                    <EditAction
                                                        href={route('admin.referral-tiers.edit', tier.id)}
                                                    />
                                                )}
                                                {can.delete && (
                                                    <DeleteAction
                                                        href={route('admin.referral-tiers.destroy', tier.id)}
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

            <p className="mt-4 text-sm text-neutral-600">
                Example: referrals 1–5 at $7.50 each, then 6–10 at $10.50. The &quot;to&quot; field is inclusive; leave
                it empty for unlimited upper bound.
            </p>
        </AdminLayout>
    );
}