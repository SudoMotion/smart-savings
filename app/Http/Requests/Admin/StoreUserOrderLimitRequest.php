<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserOrderLimitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('order-limits.create') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id'),
                Rule::unique('user_order_limits', 'user_id'),
            ],
            'order_limit' => ['required', 'numeric', 'min:0'],
        ];
    }
}
