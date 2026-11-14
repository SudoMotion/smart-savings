<?php

namespace App\Support;

use App\Enums\OrderResetInterval;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Carbon;

class OrderLimitData
{
    public static function globalLimit(): ?int
    {
        $value = Setting::current()->global_order_limit;

        return $value !== null && $value !== '' ? max(0, (int) $value) : null;
    }

    public static function hasDedicatedLimit(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        $user->loadMissing('orderLimit');

        return $user->orderLimit !== null;
    }

    /**
     * Dedicated user limit when set, otherwise the global order count.
     */
    public static function forUser(?User $user): ?int
    {
        if (self::hasDedicatedLimit($user)) {
            return max(0, (int) $user->orderLimit->order_limit);
        }

        return self::globalLimit();
    }

    public static function resetInterval(): OrderResetInterval
    {
        return Setting::current()->order_reset_interval ?? OrderResetInterval::default();
    }

    /**
     * Dedicated reset interval when set, otherwise global "Order reset in".
     */
    public static function resetIntervalForUser(?User $user): OrderResetInterval
    {
        if (self::hasDedicatedLimit($user) && $user->orderLimit->order_reset_interval !== null) {
            return $user->orderLimit->order_reset_interval;
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

    public static function orderCountForUser(?User $user): int
    {
        return self::forUser($user) ?? 0;
    }

    public static function windowStartForUser(?User $user): Carbon
    {
        return now()->subHours(self::resetIntervalHoursForUser($user));
    }
}
