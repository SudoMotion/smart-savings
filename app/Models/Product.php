<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'user_id',
        'name',
        'code',
        'sku',
        'category_id',
        'subcategory_id',
        'subsubcategory_id',
        'brand_id',
        'unit_id',
        'image',
        'price',
        'discount_type',
        'discount_value',
        'stock',
        'alert_quantity',
        'short_description',
        'description',
        'status',
    ];

    protected $appends = [
        'image_url',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'discount_value' => 'decimal:2',
            'stock' => 'integer',
            'alert_quantity' => 'integer',
        ];
    }

    public function setDiscountValueAttribute($value): void
    {
        $this->attributes['discount_value'] = ($value === null || $value === '') ? 0 : $value;
    }

    public function setDiscountTypeAttribute($value): void
    {
        $this->attributes['discount_type'] = $value ?: null;
    }

    public function setStockAttribute($value): void
    {
        $this->attributes['stock'] = ($value === null || $value === '') ? 0 : (int) $value;
    }

    public function setAlertQuantityAttribute($value): void
    {
        $this->attributes['alert_quantity'] = ($value === null || $value === '') ? 0 : (int) $value;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function subsubcategory(): BelongsTo
    {
        return $this->belongsTo(Subsubcategory::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function attributes(): HasMany
    {
        return $this->hasMany(ProductAttribute::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::url($this->image) : null;
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

