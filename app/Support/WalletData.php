<?php

namespace App\Support;

use App\Models\User;
use App\Models\Wallet;

class WalletData
{
    /**
     * @return array{balance: float, formatted_balance: string}
     */
    public static function forUser(User $user): array
    {
        return self::payload($user->ensureWallet()->balance);
    }

    /**
     * Order-confirm earnings only. Does not include deposit funds.
     *
     * @return array{balance: float, formatted_balance: string}
     */
    public static function earningForUser(User $user): array
    {
        return self::payload($user->ensureEarningWallet()->balance);
    }

    /**
     * Combined deposit + earning balance.
     *
     * @return array{balance: float, formatted_balance: string}
     */
    public static function totalForUser(User $user): array
    {
        $deposit = (float) $user->ensureWallet()->balance;
        $earning = (float) $user->ensureEarningWallet()->balance;

        return self::payload($deposit + $earning);
    }

    public static function format(float $amount): string
    {
        return number_format($amount, 2, '.', ',');
    }

    /**
     * @return array{balance: float, formatted_balance: string}
     */
    private static function payload(mixed $balance): array
    {
        $amount = (float) $balance;

        return [
            'balance' => $amount,
            'formatted_balance' => self::format($amount),
        ];
    }

    public static function balanceFromWallet(?Wallet $wallet): float
    {
        return (float) ($wallet?->balance ?? 0);
    }
}
