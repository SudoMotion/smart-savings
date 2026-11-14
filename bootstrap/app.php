<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
                return '/account/dashboard';
            }

            return '/account/dashboard';
        });

        $middleware->web(append: [
            \App\Http\Middleware\EnsureUserCanLogin::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'vendor' => \App\Http\Middleware\EnsureUserIsVendor::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();
