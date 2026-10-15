import Container from '@/Components/Frontend/Container';
import ResultPopup from '@/Components/Frontend/ResultPopup';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import Modal from '@/Components/Modal';
import { Button, Card, FileInput, Input, Select } from '@/Components/UI';
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

async function copyText(text) {
    if (!text) return false;
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
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
    const [detailOption, setDetailOption] = useState(null);
    const [addressCopied, setAddressCopied] = useState(false);
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

    const optionChoices = useMemo(
        () =>
            depositOptions.map((option) => ({
                value: String(option.id),
                label: option.coin_type,
            })),
        [depositOptions],
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        deposit_option_id: optionChoices[0]?.value ?? '',
        amount: '',
        transaction_id: '',
        proof: null,
    });

    const selectedOption = useMemo(
        () => depositOptions.find((o) => String(o.id) === String(data.deposit_option_id)),
        [depositOptions, data.deposit_option_id],
    );

    const submit = (e) => {
        e.preventDefault();
        post(route('account.deposit.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset('amount', 'transaction_id', 'proof');
            },
            onError: (pageErrors) => {
                setResultPopup({
                    show: true,
                    variant: 'error',
                    message:
                        firstFormError(pageErrors) ||
                        'Could not submit your deposit request. Please check the form and try again.',
                });
            },
        });
    };

    const openOptionDetail = (option) => {
        setData('deposit_option_id', String(option.id));
        setAddressCopied(false);
        setDetailOption(option);
    };

    const handleCopyAddress = async (value) => {
        const ok = await copyText(value);
        if (ok) {
            setAddressCopied(true);
            window.setTimeout(() => setAddressCopied(false), 2000);
        }
    };

    return (
        <CustomerPanelLayout>
            <Head title="Deposit" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-10 sm:py-12">
                <Container>
                    <SectionHeading
                        eyebrow="Customer panel"
                        title="Deposit"
                        description="Choose a deposit method, send payment, then submit your request for review."
                    />
                </Container>
            </section>

            <section className="py-10 sm:py-12">
                <Container>
                    <Card title="Current wallet balance" className="mb-6">
                        <p className="text-3xl font-bold tracking-tight text-neutral-900">
                            ${wallet?.formatted_balance ?? '0.00'}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                            Approved deposits are credited to this balance.
                        </p>
                    </Card>

                    {depositOptions.length === 0 ? (
                        <Card>
                            <p className="text-sm text-neutral-600">
                                No deposit methods are available right now. Please check back later or contact
                                support.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div>
                                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:mb-4 sm:text-sm">
                                    Available methods
                                </h2>
                                <p className="mb-3 text-xs text-neutral-500">
                                    Tap a coin to view the deposit address and copy it.
                                </p>
                                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                    {depositOptions.map((option) => {
                                        const selected =
                                            String(option.id) === String(data.deposit_option_id);
                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => openOptionDetail(option)}
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
                            </div>

                            <Card title="Submit deposit request">
                                <form onSubmit={submit} className="space-y-4">
                                    <Select
                                        id="deposit_option_id"
                                        label="Coin type / method"
                                        value={data.deposit_option_id}
                                        error={errors.deposit_option_id}
                                        options={optionChoices}
                                        required
                                        onChange={(e) => setData('deposit_option_id', e.target.value)}
                                    />

                                    {selectedOption && (
                                        <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-medium text-neutral-700">
                                                    Deposit value / address
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    className="shrink-0"
                                                    onClick={() => handleCopyAddress(selectedOption.value)}
                                                >
                                                    {addressCopied ? 'Copied' : 'Copy'}
                                                </Button>
                                            </div>
                                            <p className="mt-1 break-all font-mono text-xs text-neutral-900 sm:text-sm">
                                                {selectedOption.value}
                                            </p>
                                        </div>
                                    )}

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

                                    <Input
                                        id="transaction_id"
                                        label="Transaction ID"
                                        placeholder="Paste your on-chain or payment reference"
                                        value={data.transaction_id}
                                        error={errors.transaction_id}
                                        required
                                        onChange={(e) => setData('transaction_id', e.target.value)}
                                    />

                                    <FileInput
                                        id="proof"
                                        label="Screenshot / proof (optional)"
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        hint="JPEG, PNG, or WebP, max 5 MB"
                                        error={errors.proof}
                                        onChange={(e) => setData('proof', e.target.files?.[0] ?? null)}
                                    />

                                    <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                        {processing ? 'Submitting…' : 'Submit for review'}
                                    </Button>
                                </form>
                            </Card>
                        </div>
                    )}

                    {recentRequests.length > 0 && (
                        <Card title="Your deposit requests" className="mt-8">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-200 text-sm">
                                    <thead>
                                        <tr className="text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                            <th className="pb-2 pr-4">Date</th>
                                            <th className="pb-2 pr-4">Coin</th>
                                            <th className="pb-2 pr-4">Amount</th>
                                            <th className="pb-2 pr-4">Transaction ID</th>
                                            <th className="pb-2 pr-4">Status</th>
                                            <th className="pb-2">Proof</th>
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
                                                        {req.transaction_id}
                                                    </td>
                                                    <td className="py-3 pr-4">
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
                                                    <td className="py-3">
                                                        {req.proof_url ? (
                                                            <a
                                                                href={req.proof_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[#007185] hover:underline"
                                                            >
                                                                View
                                                            </a>
                                                        ) : (
                                                            <span className="text-neutral-400">—</span>
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

            <Modal
                show={!!detailOption}
                onClose={() => setDetailOption(null)}
                maxWidth="md"
            >
                {detailOption && (
                    <div className="p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-neutral-900">
                            {detailOption.coin_type}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-500">
                            Send only {detailOption.coin_type} to this address or account.
                        </p>

                        <div className="mt-4 rounded-md border border-neutral-200 bg-neutral-50 p-3">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Deposit value / address
                                </p>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleCopyAddress(detailOption.value)}
                                >
                                    {addressCopied ? 'Copied' : 'Copy'}
                                </Button>
                            </div>
                            <p className="mt-2 break-all font-mono text-sm text-neutral-900">
                                {detailOption.value}
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full sm:w-auto"
                                onClick={() => setDetailOption(null)}
                            >
                                Close
                            </Button>
                            <Button
                                type="button"
                                className="w-full sm:w-auto"
                                onClick={() => setDetailOption(null)}
                            >
                                Use this method
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            <ResultPopup
                show={resultPopup.show}
                variant={resultPopup.variant}
                message={resultPopup.message}
                onClose={closeResultPopup}
            />
        </CustomerPanelLayout>
    );
}
