<?php

namespace App\Http\Controllers\Customer;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\UpdateProfileRequest;
use App\Support\WalletData;
use Illuminate\Http\RedirectResponse;
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

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return back()->with('success', 'Profile updated.');
    }
}
