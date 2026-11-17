<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Support\CustomerOrderData;
use App\Support\UserEventData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->isDiamond()) {
            $event = UserEventData::activeEvent($user);

            if ($event) {
                return redirect()->route('event.show', $event);
            }
        }

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
