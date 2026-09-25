<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepositOption extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'coin_type',
        'value',
        'status',
    ];
}

