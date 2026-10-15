<?php

namespace App\Models;

use App\Enums\DepositRequestStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class DepositRequest extends Model
{
    /**
     * @var list<string>
     */
    protected $appends = [
        'proof_url',
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'deposit_option_id',
        'coin_type',
        'amount',
        'transaction_id',
        'proof_path',
        'status',
        'reviewed_by',
        'reviewed_at',
        'admin_note',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'status' => DepositRequestStatus::class,
            'reviewed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function depositOption(): BelongsTo
    {
        return $this->belongsTo(DepositOption::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function getProofUrlAttribute(): ?string
    {
        if (! $this->proof_path) {
            return null;
        }

        return Storage::disk('public')->url($this->proof_path);
    }
}
