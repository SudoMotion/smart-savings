<?php

namespace App\Http\Controllers\Customer;

use App\Enums\DepositRequestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreWithdrawRequest;
use App\Models\DepositOption;
use App\Models\WithdrawRequest;
use App\Support\WalletData;
use App\Support\WithdrawRules;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WithdrawController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $depositOptions = DepositOption::query()
            ->where('status', 'active')
            ->orderBy('coin_type')
            ->get(['id', 'coin_type']);

        $recentRequests = WithdrawRequest::query()
            ->where('user_id', $user->id)
            ->latest()
            ->limit(20)
            ->get([
                'id',
                'coin_type',
                'wallet_address',
                'amount',
                'status',
                'created_at',
                'admin_note',
            ]);

        $wallet = WalletData::forUser($user);
        $pending = (float) WithdrawRequest::query()
            ->where('user_id', $user->id)
            ->where('status', DepositRequestStatus::UnderReview)
            ->sum('amount');
        $availableBalance = (float) ($wallet['balance'] ?? 0) - $pending;

        return Inertia::render('Customer/Withdraw/Index', [
            'depositOptions' => $depositOptions,
            'recentRequests' => $recentRequests,
            'wallet' => $wallet,
            'minimumWithdrawAmount' => WithdrawRules::MINIMUM_AMOUNT_USD,
            'canSubmitWithdraw' => $availableBalance >= WithdrawRules::MINIMUM_AMOUNT_USD,
        ]);
    }

    public function store(StoreWithdrawRequest $request): RedirectResponse
    {
        $option = $request->depositOption();

        WithdrawRequest::query()->create([
            'user_id' => $request->user()->id,
            'deposit_option_id' => $option->id,
            'coin_type' => $option->coin_type,
            'wallet_address' => $request->validated('wallet_address'),
            'amount' => $request->validated('amount'),
            'status' => DepositRequestStatus::UnderReview,
        ]);

        return redirect()
            ->route('account.withdraw')
            ->with('success', 'Your withdraw request was submitted and is under review.');
    }
}
