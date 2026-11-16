import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Button, Card } from '@/Components/UI';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head } from '@inertiajs/react';
import { useCallback, useState } from 'react';

async function copyText(text) {
    if (!text) return false;
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

export default function Index({
    referralCode,
    referralUrl,
    referralTiers = [],
    formattedNextRewardAmount,
    nextRewardNumber,
    referredCount,
    formattedTotalEarned,
    rewards = [],
}) {
    const [copied, setCopied] = useState(null);

    const handleCopy = useCallback(async (value, key) => {
        const ok = await copyText(value);
        if (ok) {
            setCopied(key);
            window.setTimeout(() => setCopied(null), 2000);
        }
    }, []);

    return (
        <CustomerPanelLayout>
            <Head title="Referral program" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-10 sm:py-12">
                <Container>
                    <SectionHeading
                        eyebrow="Customer panel"
                        title="Referral program"
                        description="Share your link. When someone signs up and their first deposit is approved, you earn a tier bonus based on how many referrals you have already completed."
                    />
                </Container>
            </section>

            <section className="py-10 sm:py-12">
                <Container className="max-w-lg space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Card title="People referred">
                            <p className="text-3xl font-bold text-neutral-900">{referredCount}</p>
                        </Card>
                        <Card title="Total earned">
                            <p className="text-3xl font-bold text-neutral-900">${formattedTotalEarned}</p>
                            <p className="mt-1 text-xs text-neutral-500">Credited to your deposit wallet</p>
                        </Card>
                    </div>

                    {referralTiers.length > 0 && (
                        <Card title="Reward tiers">
                            {formattedNextRewardAmount && (
                                <p className="mb-3 text-sm text-neutral-600">
                                    Your next successful referral pays{' '}
                                    <span className="font-semibold text-neutral-900">
                                        ${formattedNextRewardAmount}
                                    </span>{' '}
                                    (referral #{nextRewardNumber}).
                                </p>
                            )}
                            <ul className="divide-y divide-neutral-100 text-sm">
                                {referralTiers.map((tier) => (
                                    <li
                                        key={tier.id}
                                        className="flex items-center justify-between gap-4 py-2.5"
                                    >
                                        <span className="text-neutral-700">{tier.range_label}</span>
                                        <span className="font-semibold text-neutral-900">
                                            ${tier.formatted_reward_amount}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}

                    <Card title="Your referral link">
                        <p className="text-sm text-neutral-600">
                            New customers should open this link before creating an account.
                        </p>
                        <div className="mt-4 space-y-3">
                            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Referral code
                                </p>
                                <div className="mt-1 flex items-center justify-between gap-2">
                                    <p className="font-mono text-sm font-semibold text-neutral-900">{referralCode}</p>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleCopy(referralCode, 'code')}
                                    >
                                        {copied === 'code' ? 'Copied' : 'Copy'}
                                    </Button>
                                </div>
                            </div>
                            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Shareable URL
                                </p>
                                <p className="mt-1 break-all text-sm text-neutral-800">{referralUrl}</p>
                                <Button
                                    type="button"
                                    className="mt-3 w-full sm:w-auto"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleCopy(referralUrl, 'url')}
                                >
                                    {copied === 'url' ? 'Link copied' : 'Copy link'}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {rewards.length > 0 && (
                        <Card title="Rewards paid">
                            <ul className="divide-y divide-neutral-100 text-sm">
                                {rewards.map((row) => (
                                    <li key={row.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium text-neutral-900">
                                                {row.referred_name ?? 'Referred user'}
                                            </p>
                                            <p className="text-xs text-neutral-500">{row.referred_email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-emerald-700">
                                                +${row.formatted_amount}
                                            </p>
                                            {row.created_at && (
                                                <p className="text-xs text-neutral-500">
                                                    {new Date(row.created_at).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}
                </Container>
            </section>
        </CustomerPanelLayout>
    );
}