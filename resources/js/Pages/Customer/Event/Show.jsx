import CelebrationSprinkles from '@/Components/Frontend/CelebrationSprinkles';
import Container from '@/Components/Frontend/Container';
import { Button } from '@/Components/UI';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const rows = [
    { label: 'Standard balance', key: 'formatted_standard_balance' },
    { label: 'Bonus amount', key: 'formatted_bonus_amount' },
    { label: 'Balance', key: 'formatted_balance' },
    { label: 'Deposit amount', key: 'formatted_deposit_amount' },
];

export default function Show({ event, summaryRevealed = false }) {
    const [showSummary, setShowSummary] = useState(summaryRevealed);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setShowSummary(summaryRevealed);
    }, [summaryRevealed, event.id]);

    const showFirstWindow = !showSummary;

    const revealSummary = () => {
        if (submitting) {
            return;
        }

        setSubmitting(true);
        router.post(route('event.reveal', event.id), {}, {
            preserveScroll: true,
            onSuccess: () => setShowSummary(true),
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <CustomerPanelLayout>
            <Head title="Event" />
            {!showFirstWindow && <CelebrationSprinkles />}

            <section className="relative flex min-h-[calc(100dvh-11rem)] items-center justify-center overflow-hidden px-4 py-10">
                {!showFirstWindow && (
                    <>
                        <div
                            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fff7ed] via-[#fefce8] to-[#ecfdf5]"
                            aria-hidden
                        />
                        <div
                            className="pointer-events-none absolute -left-16 top-1/4 h-48 w-48 rounded-full bg-[#febd69]/20 blur-3xl"
                            aria-hidden
                        />
                        <div
                            className="pointer-events-none absolute -right-10 bottom-1/4 h-56 w-56 rounded-full bg-[#1e3a2d]/10 blur-3xl"
                            aria-hidden
                        />
                    </>
                )}

                <Container className="relative z-10 w-full max-w-md">
                    {showFirstWindow ? (
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                            <p className="whitespace-pre-wrap text-center text-lg font-medium leading-relaxed text-neutral-800 sm:text-xl sm:leading-relaxed">
                                {event.first_window_text}
                            </p>
                            <Button
                                type="button"
                                className="mt-5 w-full"
                                disabled={submitting}
                                onClick={revealSummary}
                            >
                                {submitting ? 'Submitting…' : 'Submit'}
                            </Button>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute -top-16 left-1/2 z-20 -translate-x-1/2">
                                <img
                                    src="/images/congratulation-hat.png"
                                    alt=""
                                    className="h-32 w-auto drop-shadow-lg sm:h-36"
                                />
                            </div>

                            <div className="overflow-hidden rounded-2xl border-2 border-[#febd69]/40 bg-white/95 shadow-xl shadow-[#1e3a2d]/10 backdrop-blur-sm">
                                <div className="bg-gradient-to-r from-[#0f281c] via-[#1e3a2d] to-[#0f281c] px-6 pb-5 pt-12 text-center">
                                    <p className="text-2xl font-bold tracking-tight text-[#febd69] sm:text-3xl">
                                        Congratulation
                                    </p>
                                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-white/50">
                                        You did it
                                    </p>
                                </div>

                                <div className="p-5 sm:p-6">
                                    <table className="w-full text-sm sm:text-base">
                                        <tbody className="divide-y divide-[#1e3a2d]/10">
                                            {rows.map((row) => (
                                                <tr key={row.key}>
                                                    <th
                                                        scope="row"
                                                        className="py-3.5 pr-4 text-left font-medium text-neutral-600"
                                                    >
                                                        {row.label}
                                                    </th>
                                                    <td className="py-3.5 text-right text-lg font-bold tabular-nums text-[#0f281c] sm:text-xl">
                                                        ${event[row.key]}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </Container>
            </section>
        </CustomerPanelLayout>
    );
}