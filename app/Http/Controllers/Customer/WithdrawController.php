<?php

namespace App\Http\Controllers\Customer;

use App\Enums\DepositRequestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreWithdrawRequest;
use App\Models\DepositOption;
use App\Models\WithdrawRequest;
use App\Support\WalletData;
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

        return Inertia::render('Customer/Withdraw/Index', [
            'depositOptions' => $depositOptions,
            'recentRequests' => $recentRequests,
            'wallet' => WalletData::forUser($user),
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