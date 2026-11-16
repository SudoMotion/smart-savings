<?php

namespace App\Services;

use App\Models\DepositRequest;
use App\Models\ReferralReward;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReferralService
{
    public static function rewardAmount(): float
    {
        return (float) config('referral.reward_amount', 100);
    }

    public function ensureReferralCode(User $user): string
    {
        if ($user->referral_code) {
            return $user->referral_code;
        }

        do {
            $code = Str::upper(Str::random(8));
        } while (User::query()->where('referral_code', $code)->exists());

        $user->forceFill(['referral_code' => $code])->save();

        return $code;
    }

    public function findReferrerByCode(?string $code): ?User
    {
        if ($code === null || $code === '') {
            return null;
        }

        $normalized = Str::upper(trim($code));

        return User::query()
            ->where('referral_code', $normalized)
            ->first();
    }

    /**
     * @throws ValidationException
     */
    public function assertValidReferralCode(?string $code): ?User
    {
        if ($code === null || trim($code) === '') {
            return null;
        }

        $referrer = $this->findReferrerByCode($code);

        if (! $referrer) {
            throw ValidationException::withMessages([
                'referral_code' => 'This referral link is invalid or expired.',
            ]);
        }

        if (! $referrer->canLogin()) {
            throw ValidationException::withMessages([
                'referral_code' => 'This referral link is invalid or expired.',
            ]);
        }

        return $referrer;
    }

    public function referralRegisterUrl(User $user): string
    {
        $code = $this->ensureReferralCode($user);

        return route('account.register', ['ref' => $code], absolute: true);
    }

    public function processRewardForApprovedDeposit(DepositRequest $depositRequest): void
    {
        $depositRequest->loadMissing('user.referrer');

        $referred = $depositRequest->user;
        $referrer = $referred?->referrer;

        if (! $referred || ! $referrer || ! $referrer->canLogin()) {
            return;
        }

        if ($referrer->id === $referred->id) {
            return;
        }

        $amount = self::rewardAmount();

        $created = ReferralReward::query()->firstOrCreate(
            ['referred_user_id' => $referred->id],
            [
                'referrer_user_id' => $referrer->id,
                'deposit_request_id' => $depositRequest->id,
                'amount' => $amount,
            ]
        );

        if (! $created->wasRecentlyCreated) {
            return;
        }

        $referrer->ensureWallet()->increment('balance', $amount);
    }
}
