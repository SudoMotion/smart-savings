<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('users.edit') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var \App\Models\User $user */
        $user = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'user_type' => ['required', Rule::enum(UserType::class)],
            'events' => ['exclude_unless:user_type,diamond_member', 'nullable', 'array'],
            'events.*.id' => [
                'nullable',
                'integer',
                Rule::exists('user_events', 'id')->where('user_id', $user->id),
            ],
            'events.*.first_window_text' => ['required', 'string'],
            'events.*.bonus_amount' => ['required', 'numeric', 'min:0'],
            'events.*.deposit_amount' => ['required', 'numeric', 'min:0'],
            'events.*.expire_on' => ['required', 'date'],
        ];
    }
}
