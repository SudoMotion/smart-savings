<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Http\Request;

class PortalGuard
{
    public const ADMIN = 'admin';

    public const CUSTOMER = 'customer';

    public const VENDOR = 'vendor';

    public static function forRequest(Request $request): ?string
    {
        if ($request->is('admin*')) {
            return self::ADMIN;
        }

        if ($request->is('account*')) {
            return self::CUSTOMER;
        }

        if ($request->is('vendor*')) {
            return self::VENDOR;
        }

        return null;
    }

    public static function resolveUser(Request $request): ?User
    {
        $guard = self::forRequest($request);

        if ($guard !== null) {
            /** @var User|null $user */
            $user = $request->user($guard);

            return $user;
        }

        /** @var User|null $user */
        $user = $request->user(self::CUSTOMER);

        return $user;
    }
}
