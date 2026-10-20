<?php

namespace App\Http\Controllers\Customer;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Support\CustomerOrderData;
use App\Support\WalletData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Customer/Dashboard/Index', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'user_type' => ($user->user_type ?? UserType::Regular)->value,
                'created_at' => $user->created_at?->format('F j, Y'),
            ],
            'wallet' => WalletData::forUser($user),
            'earningWallet' => WalletData::earningForUser($user),
            'orders' => CustomerOrderData::forDashboard($user),
        ]);
    }
}
