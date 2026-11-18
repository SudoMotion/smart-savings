<?php

namespace App\Support;

use App\Models\User;
use App\Models\UserEvent;

class UserEventData
{
    /**
     * @return array{id: int, first_window_text: string}|null
     */
    public static function activeEvent(User $user): ?UserEvent
    {
        if (! $user->canLogin()) {
            return null;
        }

        return $user->events()
            ->where('expire_on', '>=', now())
            ->orderBy('expire_on')
            ->first();
    }

    public static function activeForDashboard(User $user): ?array
    {
        $event = self::activeEvent($user);

        if (! $event) {
            return null;
        }

        return [
            'id' => $event->id,
            'first_window_text' => $event->first_window_text,
        ];
    }

    /**
     * @return array{
     *     id: int,
     *     first_window_text: string,
     *     balance: float,
     *     formatted_balance: string,
     *     deposit_amount: float,
     *     formatted_deposit_amount: string,
     *     standard_balance: float,
     *     formatted_standard_balance: string,
     *     bonus_amount: float,
     *     formatted_bonus_amount: string,
     *     expire_on: string
     * }
     */
    public static function forShow(User $user, UserEvent $event): array
    {
        $wallet = WalletData::totalForUser($user);
        $balance = $wallet['balance'];
        $depositAmount = (float) $event->deposit_amount;
        $standardBalance = $balance + $depositAmount;
        $bonusAmount = (float) $event->bonus_amount;

        return [
            'id' => $event->id,
            'first_window_text' => $event->first_window_text,
            'balance' => $balance,
            'formatted_balance' => $wallet['formatted_balance'],
            'deposit_amount' => $depositAmount,
            'formatted_deposit_amount' => WalletData::format($depositAmount),
            'standard_balance' => $standardBalance,
            'formatted_standard_balance' => WalletData::format($standardBalance),
            'bonus_amount' => $bonusAmount,
            'formatted_bonus_amount' => WalletData::format($bonusAmount),
            'expire_on' => $event->expire_on?->format('F j, Y g:i A') ?? '',
        ];
    }
}
