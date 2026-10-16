<?php

namespace App\Enums;

enum OrderResetInterval: string
{
    case Hours6 = '6_hours';
    case Hours12 = '12_hours';
    case Hours24 = '24_hours';
    case Days2 = '2_days';
    case Days3 = '3_days';
    case Days5 = '5_days';
    case Days10 = '10_days';

    public function label(): string
    {
        return match ($this) {
            self::Hours6 => '6 hours',
            self::Hours12 => '12 hours',
            self::Hours24 => '24 hours',
            self::Days2 => '2 days',
            self::Days3 => '3 days',
            self::Days5 => '5 days',
            self::Days10 => '10 days',
        };
    }

    public function hours(): int
    {
        return match ($this) {
            self::Hours6 => 6,
            self::Hours12 => 12,
            self::Hours24 => 24,
            self::Days2 => 48,
            self::Days3 => 72,
            self::Days5 => 120,
            self::Days10 => 240,
        };
    }

    public static function default(): self
    {
        return self::Hours24;
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
