<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\DepositOption;
use App\Support\WalletData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepositController extends Controller
{
    public function index(Request $request): Response
    {
        $depositOptions = DepositOption::query()
            ->where('status', 'active')
            ->orderBy('coin_type')
            ->get(['id', 'coin_type', 'value']);

        return Inertia::render('Customer/Deposit/Index', [
            'depositOptions' => $depositOptions,
            'wallet' => WalletData::forUser($request->user()),
        ]);
    }
}
