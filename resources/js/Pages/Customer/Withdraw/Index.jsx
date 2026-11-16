import Container from '@/Components/Frontend/Container';
import ResultPopup from '@/Components/Frontend/ResultPopup';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Button, Card, Input, Textarea } from '@/Components/UI';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

function statusLabel(status) {
    const value = typeof status === 'object' && status?.value ? status.value : status;
    switch (value) {
        case 'approved':
            return { text: 'Approved', className: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20' };
        case 'rejected':
            return { text: 'Rejected', className: 'bg-rose-50 text-rose-800 ring-rose-600/20' };
        default:
            return { text: 'Under review', className: 'bg-amber-50 text-amber-800 ring-amber-600/20' };
    }
}

function formatAmount(amount) {
    const n = Number(amount);
    if (Number.isNaN(n)) return amount;
    return n.toFixed(2);
}

function firstFormError(errors) {
    if (!errors || typeof errors !== 'object') {
        return null;
    }

    for (const value of Object.values(errors)) {
        const message = Array.isArray(value) ? value[0] : value;
        if (message) {
            return message;
        }
    }

    return null;
}

export default function Index({ depositOptions = [], recentRequests = [], wallet }) {
    const { flash } = usePage().props;
    const [resultPopup, setResultPopup] = useState({ show: false, variant: 'success', message: '' });

    const closeResultPopup = useCallback(() => {
        setResultPopup((prev) => ({ ...prev, show: false }));
    }, []);

    useEffect(() => {
        if (flash?.success) {
            setResultPopup({
                show: true,
                variant: 'success',
                message: flash.success,
            });
        } else if (flash?.error) {
            setResultPopup({
                show: true,
                variant: 'error',
                message: flash.error,
            });
        }
    }, [flash?.success, flash?.error]);

    const { data, setData, post, processing, errors, reset } = useForm({
        deposit_option_id: depositOptions[0] ? String(depositOptions[0].id) : '',
        wallet_address: '',
        amount: '',
    });

    const selectedOption = useMemo(
        () => depositOptions.find((o) => String(o.id) === String(data.deposit_option_id)),
        [depositOptions, data.deposit_option_id],
    );

    const submit = (e) => {
        e.preventDefault();
        post(route('account.withdraw.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('wallet_address', 'amount');
            },
            onError: (pageErrors) => {
                setResultPopup({
                    show: true,
                    variant: 'error',
                    message:
                        firstFormError(pageErrors) ||
                        'Could not submit your withdraw request. Please check the form and try again.',
                });
            },
        });
    };

    return (
        <CustomerPanelLayout>
            <Head title="Withdraw" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-10 sm:py-12">
                <Container>
                    <SectionHeading
                        eyebrow="Customer panel"
                        title="Withdraw"
                        description="Request a payout to your external wallet. Requests are reviewed by our team."
                    />
                </Container>
            </section>

            <section className="py-10 sm:py-12">
                <Container>
                    <Card title="Available wallet balance" className="mb-6">
                        <p className="text-3xl font-bold tracking-tight text-neutral-900">
                            ${wallet?.formatted_balance ?? '0.00'}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                            Approved withdrawals are deducted from this balance.
                        </p>
                    </Card>

                    {depositOptions.length === 0 ? (
                        <Card>
                            <p className="text-sm text-neutral-600">
                                No withdraw methods are configured yet. Please contact support.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div>
                                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:mb-4 sm:text-sm">
                                    Withdraw method (coin type)
                                </h2>
                                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                    {depositOptions.map((option) => {
                                        const selected =
                                            String(option.id) === String(data.deposit_option_id);
                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() =>
                                                    setData('deposit_option_id', String(option.id))
                                                }
                                                className={`flex min-h-[3.25rem] items-center justify-center rounded-lg border bg-white px-1 py-2 text-center transition hover:border-[#2d5240]/50 hover:bg-neutral-50 sm:min-h-[4rem] sm:px-2 sm:py-3 ${
                                                    selected
                                                        ? 'border-[#2d5240] bg-[#f4f9f6] ring-2 ring-[#2d5240]/25'
                                                        : 'border-neutral-200'
                                                }`}
                                            >
                                                <span className="line-clamp-3 text-[10px] font-semibold leading-tight text-neutral-900 sm:text-xs">
                                                    {option.coin_type}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedOption && (
                                    <p className="mt-3 text-xs text-neutral-500">
                                        Selected: <span className="font-medium text-neutral-800">{selectedOption.coin_type}</span>
                                    </p>
                                )}
                            </div>

                            <Card title="Submit withdraw request">
                                <form onSubmit={submit} className="space-y-4">
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        label="Amount (USD)"
                                        value={data.amount}
                                        error={errors.amount}
                                        required
                                        onChange={(e) => setData('amount', e.target.value)}
                                    />

                                    <Textarea
                                        id="wallet_address"
                                        label="Your wallet address"
                                        placeholder="Paste the address where you want to receive funds"
                                        value={data.wallet_address}
                                        error={errors.wallet_address}
                                        required
                                        rows={3}
                                        onChange={(e) => setData('wallet_address', e.target.value)}
                                    />

                                    {errors.deposit_option_id && (
                                        <p className="text-sm text-red-600">{errors.deposit_option_id}</p>
                                    )}

                                    <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                        {processing ? 'Submitting…' : 'Submit for review'}
                                    </Button>
                                </form>
                            </Card>
                        </div>
                    )}

                    {recentRequests.length > 0 && (
                        <Card title="Your withdraw requests" className="mt-8">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-200 text-sm">
                                    <thead>
                                        <tr className="text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                            <th className="pb-2 pr-4">Date</th>
                                            <th className="pb-2 pr-4">Coin</th>
                                            <th className="pb-2 pr-4">Amount</th>
                                            <th className="pb-2 pr-4">Wallet address</th>
                                            <th className="pb-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {recentRequests.map((req) => {
                                            const badge = statusLabel(req.status);
                                            return (
                                                <tr key={req.id}>
                                                    <td className="py-3 pr-4 text-neutral-600">
                                                        {req.created_at
                                                            ? new Date(req.created_at).toLocaleString()
                                                            : '—'}
                                                    </td>
                                                    <td className="py-3 pr-4 font-medium text-neutral-900">
                                                        {req.coin_type}
                                                    </td>
                                                    <td className="py-3 pr-4">${formatAmount(req.amount)}</td>
                                                    <td className="max-w-[10rem] truncate py-3 pr-4 font-mono text-xs text-neutral-700">
                                                        {req.wallet_address}
                                                    </td>
                                                    <td className="py-3">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badge.className}`}
                                                        >
                                                            {badge.text}
                                                        </span>
                                                        {req.admin_note && req.status === 'rejected' && (
                                                            <p className="mt-1 text-xs text-neutral-500">
                                                                {req.admin_note}
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </Container>
            </section>

            <ResultPopup
                show={resultPopup.show}
                variant={resultPopup.variant}
                message={resultPopup.message}
                onClose={closeResultPopup}
            />
        </CustomerPanelLayout>
    );
}
