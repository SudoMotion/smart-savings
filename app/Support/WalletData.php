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
        $wallet = $user->ensureWallet();
        $balance = (float) $wallet->balance;

        return [
            'balance' => $balance,
            'formatted_balance' => self::format($balance),
        ];
    }

    public static function format(float $amount): string
    {
        return number_format($amount, 2, '.', ',');
    }

    public static function balanceFromWallet(?Wallet $wallet): float
    {
        return (float) ($wallet?->balance ?? 0);
    }
}
