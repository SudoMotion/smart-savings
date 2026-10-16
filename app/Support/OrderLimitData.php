<?php

namespace App\Support;

use App\Enums\OrderResetInterval;
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

    public static function resetInterval(): OrderResetInterval
    {
        return Setting::current()->order_reset_interval ?? OrderResetInterval::default();
    }

    public static function resetIntervalForUser(?User $user): OrderResetInterval
    {
        if ($user) {
            $user->loadMissing('orderLimit');

            if ($user->orderLimit?->order_reset_interval !== null) {
                return $user->orderLimit->order_reset_interval;
            }
        }

        return self::resetInterval();
    }

    public static function resetIntervalHours(): int
    {
        return self::resetInterval()->hours();
    }

    public static function resetIntervalHoursForUser(?User $user): int
    {
        return self::resetIntervalForUser($user)->hours();
    }
}
