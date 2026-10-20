<?php

namespace App\Enums;

enum UserType: string
{
    case Regular = 'regular';
    case Exclusive = 'exclusive';

    public function label(): string
    {
        return match ($this) {
            self::Regular => 'Regular',
            self::Exclusive => 'Exclusive',
        };
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
