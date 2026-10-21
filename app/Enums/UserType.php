<?php

namespace App\Enums;

enum UserType: string
{
    case GoldMember = 'gold_member';
    case DiamondMember = 'diamond_member';
    case Disable = 'disable';

    public function label(): string
    {
        return match ($this) {
            self::GoldMember => 'Gold Member',
            self::DiamondMember => 'Diamond Member',
            self::Disable => 'Disable',
        };
    }

    public function canLogin(): bool
    {
        return $this !== self::Disable;
    }

    public function canProcessOrders(): bool
    {
        return $this === self::GoldMember;
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
