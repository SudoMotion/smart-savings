<?php

namespace App\Models;

use App\Enums\OrderResetInterval;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserOrderLimit extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'order_limit',
        'order_reset_interval',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'order_limit' => 'decimal:2',
            'order_reset_interval' => OrderResetInterval::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
