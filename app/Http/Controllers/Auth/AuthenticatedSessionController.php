<?php

namespace App\Http\Controllers\Auth;

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
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate(PortalGuard::ADMIN);

        /** @var User $user */
        $user = Auth::guard(PortalGuard::ADMIN)->user();

        if (! $user->canAccessAdminPanel()) {
            Auth::guard(PortalGuard::ADMIN)->logout();

            throw ValidationException::withMessages([
                'email' => 'This account is not authorized for the admin panel. Please sign in at the customer account page.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard(PortalGuard::ADMIN)->logout();

        return redirect()->route('admin.login');
    }
}
