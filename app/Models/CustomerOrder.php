<?php

namespace App\Models;

use App\Enums\CustomerOrderStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerOrder extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'product_id',
        'status',
        'amount_earned',
        'deposit_amount',
        'percentage',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => CustomerOrderStatus::class,
            'amount_earned' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'percentage' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
