<?php

namespace App\Models;

use App\Enums\OrderResetInterval;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'application_name',
        'email',
        'phone',
        'address',
        'google_map_embed_link',
        'social_media',
        'global_order_limit',
        'order_reset_interval',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'social_media' => 'array',
            'global_order_limit' => 'integer',
            'order_reset_interval' => OrderResetInterval::class,
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
