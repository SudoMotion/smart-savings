<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserCanLogin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->canLogin()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route($this->loginRoute($request))->withErrors([
                'email' => 'Your account has been disabled.',
            ]);
        }

        return $next($request);
    }

    private function loginRoute(Request $request): string
    {
        if ($request->is('vendor*')) {
            return 'vendor.login';
        }

        if ($request->is('admin*')) {
            return 'admin.login';
        }

        return 'account.login';
    }
}
