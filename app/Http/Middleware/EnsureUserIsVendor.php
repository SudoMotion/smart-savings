<?php

namespace App\Http\Middleware;

use App\Support\Permissions;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsVendor
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('vendor.login');
        }

        $isSuperAdmin = $user->hasRole(Permissions::SUPERADMIN_ROLE);
        $isVendor = $user->hasRole('vendor') || $user->vendor()->exists();

        if (! $isSuperAdmin && ! $isVendor) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('vendor.login')->withErrors([
                'email' => 'You do not have vendor permissions to access this portal.',
            ]);
        }

        if (! $isSuperAdmin) {
            $vendor = $user->vendor;
            if ($vendor && $vendor->status === 'inactive') {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('vendor.login')->withErrors([
                    'email' => 'Your vendor account is currently inactive. Please contact support.',
                ]);
            }
        }

        return $next($request);
    }
}

