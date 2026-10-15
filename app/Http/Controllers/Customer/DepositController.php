<?php

namespace App\Http\Controllers\Customer;

use App\Enums\DepositRequestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreDepositRequest;
use App\Models\DepositOption;
use App\Models\DepositRequest;
use App\Support\WalletData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepositController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $depositOptions = DepositOption::query()
            ->where('status', 'active')
            ->orderBy('coin_type')
            ->get(['id', 'coin_type', 'value']);

        $recentRequests = DepositRequest::query()
            ->where('user_id', $user->id)
            ->latest()
            ->limit(20)
            ->get(['id', 'coin_type', 'amount', 'transaction_id', 'status', 'proof_path', 'created_at', 'admin_note']);

        return Inertia::render('Customer/Deposit/Index', [
            'depositOptions' => $depositOptions,
            'recentRequests' => $recentRequests,
            'wallet' => WalletData::forUser($user),
        ]);
    }

    public function store(StoreDepositRequest $request): RedirectResponse
    {
        $option = $request->depositOption();

        $proofPath = null;
        if ($request->hasFile('proof')) {
            $proofPath = $request->file('proof')->store('deposit-proofs', 'public');
        }

        DepositRequest::query()->create([
            'user_id' => $request->user()->id,
            'deposit_option_id' => $option->id,
            'coin_type' => $option->coin_type,
            'amount' => $request->validated('amount'),
            'transaction_id' => $request->validated('transaction_id'),
            'proof_path' => $proofPath,
            'status' => DepositRequestStatus::UnderReview,
        ]);

        return redirect()
            ->route('account.deposit')
            ->with('success', 'Your deposit request was submitted and is under review.');
    }
}
