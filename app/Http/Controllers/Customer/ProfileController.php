<?php

namespace App\Http\Controllers\Customer;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Support\WalletData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Customer/Profile/Index', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'user_type' => ($user->user_type ?? UserType::Regular)->value,
                'user_type_label' => ($user->user_type ?? UserType::Regular)->label(),
                'created_at' => $user->created_at?->format('F j, Y'),
            ],
            'wallet' => WalletData::totalForUser($user),
        ]);
    }
}
