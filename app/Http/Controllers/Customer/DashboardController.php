<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Support\CustomerOrderData;
use App\Support\UserEventData;
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
                'user_type' => $user->userType()->value,
                'is_diamond' => $user->isDiamond(),
            ],
            'orders' => CustomerOrderData::forDashboard($user),
            'event' => UserEventData::activeForDashboard($user),
        ]);
    }
}
