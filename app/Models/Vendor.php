<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Vendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shop_name',
        'shop_logo',
        'phone',
        'address',
        'status',
    ];

    protected $appends = [
        'logo_url',
    ];

    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->shop_logo) {
            return null;
        }

        return Storage::disk('public')->url($this->shop_logo);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function products(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Product::class);
    }
}

