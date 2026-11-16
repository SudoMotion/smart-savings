<?php

namespace App\Support;

use App\Models\ReferralTier;

class ReferralTierData
{
    public static function amountForRewardNumber(int $rewardNumber): ?float
    {
        if ($rewardNumber < 1) {
            return null;
        }

        $tier = ReferralTier::query()
            ->where('referral_from', '<=', $rewardNumber)
            ->where(function ($query) use ($rewardNumber) {
                $query->whereNull('referral_to')
                    ->orWhere('referral_to', '>=', $rewardNumber);
            })
            ->orderByDesc('referral_from')
            ->first();

        return $tier !== null ? (float) $tier->reward_amount : null;
    }

    /**
     * @return list<array{id: int, referral_from: int, referral_to: int|null, reward_amount: float, formatted_reward_amount: string, range_label: string}>
     */
    public static function tiersForDisplay(): array
    {
        return ReferralTier::query()
            ->orderBy('referral_from')
            ->get()
            ->map(fn (ReferralTier $tier) => [
                'id' => $tier->id,
                'referral_from' => $tier->referral_from,
                'referral_to' => $tier->referral_to,
                'reward_amount' => (float) $tier->reward_amount,
                'formatted_reward_amount' => WalletData::format((float) $tier->reward_amount),
                'range_label' => self::rangeLabel($tier->referral_from, $tier->referral_to),
            ])
            ->values()
            ->all();
    }

    public static function rangeLabel(int $from, ?int $to): string
    {
        if ($to === null) {
            return $from === 1
                ? 'Referral 1 and above'
                : "Referrals {$from}+";
        }

        if ($from === $to) {
            return "Referral {$from}";
        }

        return "Referrals {$from}–{$to}";
    }

    public static function rangesOverlap(int $fromA, ?int $toA, int $fromB, ?int $toB): bool
    {
        $endA = $toA ?? PHP_INT_MAX;
        $endB = $toB ?? PHP_INT_MAX;

        return $fromA <= $endB && $fromB <= $endA;
    }

    public static function hasOverlappingTier(int $from, ?int $to, ?int $ignoreId = null): bool
    {
        $query = ReferralTier::query();

        if ($ignoreId !== null) {
            $query->where('id', '!=', $ignoreId);
        }

        foreach ($query->get() as $existing) {
            if (self::rangesOverlap($from, $to, $existing->referral_from, $existing->referral_to)) {
                return true;
            }
        }

        return false;
    }
}
