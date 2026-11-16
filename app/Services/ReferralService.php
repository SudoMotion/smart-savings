<?php

namespace App\Services;

use App\Models\DepositRequest;
use App\Models\ReferralReward;
use App\Models\User;
use App\Support\ReferralTierData;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReferralService
{
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

        if (ReferralReward::query()->where('referred_user_id', $referred->id)->exists()) {
            return;
        }

        $paidCount = ReferralReward::query()
            ->where('referrer_user_id', $referrer->id)
            ->count();

        $rewardNumber = $paidCount + 1;
        $amount = ReferralTierData::amountForRewardNumber($rewardNumber);

        if ($amount === null || $amount <= 0) {
            return;
        }

        ReferralReward::query()->create([
            'referrer_user_id' => $referrer->id,
            'referred_user_id' => $referred->id,
            'deposit_request_id' => $depositRequest->id,
            'amount' => $amount,
        ]);

        $referrer->ensureWallet()->increment('balance', $amount);
    }
}
