import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Card } from '@/Components/UI';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ sessions }) {
    const rows = sessions?.data ?? [];

    return (
        <CustomerPanelLayout>
            <Head title="Order logs" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-10 sm:py-12">
                <Container>
                    <SectionHeading
                        eyebrow="Customer panel"
                        title="Order logs"
                        description="Daily session totals for approved orders, rejected orders, and earnings."
                    />
                </Container>
            </section>

            <section className="py-10 sm:py-12">
                <Container>
                    <Card bodyClassName="p-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-neutral-200">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                            Date
                                        </th>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                            Approved orders
                                        </th>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                            Rejected orders
                                        </th>
                                        <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                            Earned balance
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 bg-white">
                                    {rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-10 text-center text-sm text-neutral-500">
                                                No order sessions yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        rows.map((row) => (
                                            <tr key={row.date}>
                                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-neutral-900">
                                                    {row.date}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-900">
                                                    {row.approved_orders}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-900">
                                                    {row.rejected_orders}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-neutral-900">
                                                    ${row.formatted_earned_balance}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {sessions?.links && sessions.links.length > 3 && (
                            <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
                                <div className="text-xs text-neutral-500">
                                    Showing {sessions.from ?? 0} to {sessions.to ?? 0} of {sessions.total} sessions
                                </div>
                                <div className="flex gap-1">
                                    {sessions.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={`rounded px-2.5 py-1 text-xs ${
                                                link.active
                                                    ? 'bg-neutral-900 font-medium text-white'
                                                    : link.url
                                                      ? 'text-neutral-700 hover:bg-neutral-100'
                                                      : 'pointer-events-none text-neutral-300'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </Container>
            </section>
        </CustomerPanelLayout>
    );
}
