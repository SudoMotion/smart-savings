<?php

namespace App\Enums;

enum CustomerOrderStatus: string
{
    case Confirmed = 'confirmed';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Confirmed => 'Confirmed',
            self::Rejected => 'Rejected',
        };
    }
}
