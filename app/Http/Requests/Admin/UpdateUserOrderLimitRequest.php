<?php

namespace App\Http\Requests\Admin;

use App\Enums\OrderResetInterval;
use App\Models\UserOrderLimit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserOrderLimitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('order-limits.edit') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var UserOrderLimit $userOrderLimit */
        $userOrderLimit = $this->route('userOrderLimit');

        return [
            'user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id'),
                Rule::unique('user_order_limits', 'user_id')->ignore($userOrderLimit->id),
            ],
            'order_limit' => ['required', 'integer', 'min:0'],
            'order_reset_interval' => ['required', Rule::enum(OrderResetInterval::class)],
        ];
    }
}
