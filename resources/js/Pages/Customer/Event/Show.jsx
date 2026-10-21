import Container from '@/Components/Frontend/Container';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head, Link } from '@inertiajs/react';

const rows = [
    { label: 'Standard balance', key: 'formatted_standard_balance' },
    { label: 'Bonus amount', key: 'formatted_bonus_amount' },
    { label: 'Balance', key: 'formatted_balance' },
    { label: 'Deposit amount', key: 'formatted_deposit_amount' },
];

export default function Show({ event }) {
    return (
        <CustomerPanelLayout>
            <Head title="Event" />

            <section className="py-6 sm:py-8">
                <Container className="max-w-lg">
                    <div className="overflow-hidden rounded-xl border border-[#1e3a2d]/20 bg-white shadow-sm">
                        <div className="bg-[#1e3a2d] px-5 py-4 text-center">
                            <p className="text-lg font-semibold tracking-tight text-[#febd69]">
                                Congratulation
                            </p>
                        </div>

                        <div className="p-4">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-neutral-100">
                                    {rows.map((row) => (
                                        <tr key={row.key}>
                                            <th
                                                scope="row"
                                                className="py-3 pr-4 text-left font-medium text-neutral-600"
                                            >
                                                {row.label}
                                            </th>
                                            <td className="py-3 text-right font-semibold tabular-nums text-neutral-900">
                                                ${event[row.key]}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* <div className="mt-4 text-center">
                        <Link
                            href={route('account.dashboard')}
                            className="text-sm font-medium text-[#1e3a2d] hover:underline"
                        >
                            Back to dashboard
                        </Link>
                    </div> */}
                </Container>
            </section>
        </CustomerPanelLayout>
    );
}
