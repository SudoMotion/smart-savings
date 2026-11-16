<?php

namespace App\Http\Middleware;

use App\Support\PortalGuard;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserCanLogin
{
    public function handle(Request $request, Closure $next): Response
    {
        $guard = PortalGuard::forRequest($request) ?? PortalGuard::CUSTOMER;
        $user = $request->user($guard);

        if ($user && ! $user->canLogin()) {
            Auth::guard($guard)->logout();

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
