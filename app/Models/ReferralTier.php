<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferralTier extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'referral_from',
        'referral_to',
        'reward_amount',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'referral_from' => 'integer',
            'referral_to' => 'integer',
            'reward_amount' => 'decimal:2',
        ];
    }
}
