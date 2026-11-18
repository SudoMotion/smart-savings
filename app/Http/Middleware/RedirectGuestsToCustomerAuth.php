<?php

namespace App\Http\Middleware;

use App\Support\PortalGuard;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectGuestsToCustomerAuth
{
    /**
     * Guests on the public customer site may only use login, register, and password-reset flows.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('admin*', 'vendor*', 'up', 'build/*', 'storage/*')) {
            return $next($request);
        }

        if (Auth::guard(PortalGuard::CUSTOMER)->check()) {
            return $next($request);
        }

        if ($this->guestMayAccess($request)) {
            return $next($request);
        }

        return redirect()->route('account.login');
    }

    private function guestMayAccess(Request $request): bool
    {
        if ($request->routeIs(
            'home',
            'about',
            'contact',
            'contact.store',
            'account.login',
            'account.register',
            'account.register.verify',
            'account.register.verify.code',
            'account.register.verify.resend',
            'guest.reset.password',
            'guest.reset.password.store',
            'guest.reset.verify',
            'guest.reset.verify.code',
            'guest.reset.verify.resend',
            'guest.reset.new',
            'guest.reset.password.store.final',
        )) {
            return true;
        }

        if ($request->path() === '' || $request->path() === '/') {
            return true;
        }

        return $request->is(
            'about',
            'contact',
            'account/login',
            'account/register',
            'account/register/verify',
            'login',
            'register',
            'reset-password',
            'reset-password/*',
        );
    }
}
