<?php

namespace App\Http\Requests\Admin;

use App\Enums\OrderResetInterval;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGlobalOrderLimitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('order-limits.update') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'global_order_limit' => ['nullable', 'integer', 'min:0'],
            'order_reset_interval' => ['required', Rule::enum(OrderResetInterval::class)],
        ];
    }
}
