<?php

namespace App\Http\Controllers\Customer\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Support\PortalGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Customer/Auth/Login', [
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate(PortalGuard::CUSTOMER);

        /** @var User $user */
        $user = Auth::guard(PortalGuard::CUSTOMER)->user();

        if ($user->canAccessAdminPanel()) {
            Auth::guard(PortalGuard::CUSTOMER)->logout();

            throw ValidationException::withMessages([
                'email' => 'Staff accounts must sign in through the admin panel, not the customer account page.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('home', absolute: false));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard(PortalGuard::CUSTOMER)->logout();

        return redirect()->route('account.login');
    }
}
