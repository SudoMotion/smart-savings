<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Support\SiteData;
use App\Support\WalletData;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? $user->loadMissing('vendor') : null,
                'roles' => $user ? $user->getRoleNames()->values()->all() : [],
                'permissions' => $user ? $user->getAllPermissions()->pluck('name')->values()->all() : [],
                'isSuperAdmin' => $user?->hasRole(\App\Support\Permissions::SUPERADMIN_ROLE) ?? false,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'site' => fn () => SiteData::settings(),
            'categories' => fn () => Category::query()
                ->where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name']),
            'wallet' => function () use ($request) {
                $user = $request->user();

                if (! $user) {
                    return [
                        'balance' => 0,
                        'formatted_balance' => '0.00',
                    ];
                }

                return WalletData::forUser($user);
            },
            'totalWallet' => function () use ($request) {
                $user = $request->user();

                if (! $user) {
                    return [
                        'balance' => 0,
                        'formatted_balance' => '0.00',
                    ];
                }

                return WalletData::totalForUser($user);
            },
            'earningWallet' => function () use ($request) {
                $user = $request->user();

                if (! $user) {
                    return [
                        'balance' => 0,
                        'formatted_balance' => '0.00',
                    ];
                }

                return WalletData::earningForUser($user);
            },
            'vendor_email' => fn () => session('vendor_application_data')['email'] ?? null,
        ];
    }
}
