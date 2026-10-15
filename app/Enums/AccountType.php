<?php

namespace App\Enums;

enum AccountType: string
{
    case InactiveMember = 'inactive_member';
    case GoldMember = 'gold_member';
    case DiamondMember = 'diamond_member';

    public function label(): string
    {
        return match ($this) {
            self::InactiveMember => 'Inactive member',
            self::GoldMember => 'Gold Member',
            self::DiamondMember => 'Diamond Member',
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
