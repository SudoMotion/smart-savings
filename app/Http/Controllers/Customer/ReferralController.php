<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\ReferralReward;
use App\Models\User;
use App\Services\ReferralService;
use App\Support\WalletData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReferralController extends Controller
{
    public function index(Request $request, ReferralService $referralService): Response
    {
        $user = $request->user();
        $referralService->ensureReferralCode($user);

        $user->refresh();

        $rewards = ReferralReward::query()
            ->where('referrer_user_id', $user->id)
            ->with(['referredUser:id,name,email', 'depositRequest:id,amount'])
            ->latest()
            ->limit(50)
            ->get();

        $totalEarned = (float) ReferralReward::query()
            ->where('referrer_user_id', $user->id)
            ->sum('amount');

        $referredCount = User::query()
            ->where('referred_by_user_id', $user->id)
            ->count();

        $rewardAmount = ReferralService::rewardAmount();

        return Inertia::render('Customer/Referral/Index', [
            'referralCode' => $user->referral_code,
            'referralUrl' => $referralService->referralRegisterUrl($user),
            'rewardAmount' => $rewardAmount,
            'formattedRewardAmount' => WalletData::format($rewardAmount),
            'referredCount' => $referredCount,
            'totalEarned' => $totalEarned,
            'formattedTotalEarned' => WalletData::format($totalEarned),
            'rewards' => $rewards->map(fn (ReferralReward $reward) => [
                'id' => $reward->id,
                'amount' => (string) $reward->amount,
                'formatted_amount' => WalletData::format((float) $reward->amount),
                'created_at' => $reward->created_at?->toIso8601String(),
                'referred_name' => $reward->referredUser?->name,
                'referred_email' => $reward->referredUser?->email,
                'deposit_amount' => $reward->depositRequest
                    ? WalletData::format((float) $reward->depositRequest->amount)
                    : null,
            ]),
        ]);
    }
}
