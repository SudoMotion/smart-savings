<?php

namespace App\Support;

use App\Models\Setting;
use App\Models\User;

class OrderLimitData
{
    public static function globalLimit(): ?float
    {
        $value = Setting::current()->global_order_limit;

        return $value !== null ? (float) $value : null;
    }

    public static function forUser(?User $user): ?float
    {
        if (! $user) {
            return self::globalLimit();
        }

        $user->loadMissing('orderLimit');

        if ($user->orderLimit !== null) {
            return (float) $user->orderLimit->order_limit;
        }

        return self::globalLimit();
    }
}
