import Container from '@/Components/Frontend/Container';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head, Link } from '@inertiajs/react';

function CheckIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    );
}

function CrossIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    );
}

export default function Index({ sessions }) {
    const rows = sessions?.data ?? [];

    return (
        <CustomerPanelLayout>
            <Head title="Order logs" />

            <section className="py-6 sm:py-8">
                <Container className="max-w-lg">
                    <div className="mb-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1e3a2d]/70">
                            Activity
                        </p>
                        <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-neutral-900">
                            Order logs
                        </h1>
                    </div>

                    {rows.length === 0 ? (
                        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-10 text-center">
                            <p className="text-sm font-medium text-neutral-900">No sessions yet</p>
                            <p className="mt-1 text-xs text-neutral-500">
                                Daily approved, rejected, and earned totals will show here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {rows.map((row) => (
                                <article
                                    key={row.date}
                                    className="rounded-xl bg-[#1e3a2d] px-4 py-3 text-white"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-medium text-white/90">{row.date}</p>
                                        <p className="text-lg font-semibold tabular-nums text-[#febd69]">
                                            ${row.formatted_earned_balance}
                                        </p>
                                    </div>
                                    <div className="mt-2.5 flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#0f281c] px-2.5 py-1 text-xs text-emerald-400">
                                            <CheckIcon className="h-3 w-3" />
                                            {row.approved_orders} approved
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#0f281c] px-2.5 py-1 text-xs text-rose-300">
                                            <CrossIcon className="h-3 w-3" />
                                            {row.rejected_orders} rejected
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {sessions?.links && sessions.links.length > 3 && (
                        <div className="mt-5 flex items-center justify-center gap-1">
                            {sessions.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`min-w-8 rounded-full px-2.5 py-1 text-center text-xs font-medium ${
                                        link.active
                                            ? 'bg-[#0f281c] text-[#febd69]'
                                            : link.url
                                              ? 'bg-white text-neutral-700 hover:bg-neutral-50'
                                              : 'pointer-events-none text-neutral-300'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </Container>
            </section>
        </CustomerPanelLayout>
    );
}
