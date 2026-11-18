<?php

use App\Http\Middleware\EnsureUserCanLogin;
use App\Http\Middleware\EnsureUserIsVendor;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RedirectCustomerDashboardToHome;
use App\Http\Middleware\RedirectGuestsToCustomerAuth;
use App\Support\CustomerPortal;
use App\Support\PortalGuard;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')
                ->group(base_path('routes/admin.php'));
            Route::middleware('web')
                ->group(base_path('routes/vendor.php'));
            Route::middleware('web')
                ->group(base_path('routes/customer.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('vendor*')) {
                return '/vendor/login';
            }
            if ($request->is('admin*')) {
                return '/admin/login';
            }
            if ($request->is('account*')) {
                return '/account/login';
            }

            return '/account/login';
        });
        $middleware->redirectUsersTo(function (Request $request) {
            if ($request->is('vendor*')) {
                return '/vendor/dashboard';
            }
            if ($request->is('admin*')) {
                return '/admin/dashboard';
            }
            if ($request->is('account*')) {
                $user = Auth::guard(PortalGuard::CUSTOMER)->user();

                return $user
                    ? CustomerPortal::defaultLandingUrl($user)
                    : route('home', absolute: false);
            }

            $user = Auth::guard(PortalGuard::CUSTOMER)->user();

            return $user
                ? CustomerPortal::defaultLandingUrl($user)
                : route('home', absolute: false);
        });

        $middleware->web(append: [
            EnsureUserCanLogin::class,
            RedirectGuestsToCustomerAuth::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'redirect.customer.dashboard' => RedirectCustomerDashboardToHome::class,
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
            'vendor' => EnsureUserIsVendor::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();
