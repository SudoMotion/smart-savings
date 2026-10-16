<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

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
            'global_order_limit' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
