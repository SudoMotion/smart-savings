<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use App\Support\Permissions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaffUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('staff-users.edit') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var User $staffUser */
        $staffUser = $this->route('staffUser');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($staffUser->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', Rule::exists('roles', 'name')->where('guard_name', 'web')],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('role') && is_string($this->input('role'))) {
            $this->merge([
                'role' => strtolower($this->input('role')),
            ]);
        }
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            /** @var User $staffUser */
            $staffUser = $this->route('staffUser');
            $newRole = (string) $this->input('role');

            if (
                $staffUser->hasRole(Permissions::SUPERADMIN_ROLE)
                && $newRole !== Permissions::SUPERADMIN_ROLE
                && User::query()->role(Permissions::SUPERADMIN_ROLE)->count() <= 1
            ) {
                $validator->errors()->add('role', 'At least one superadmin account is required.');
            }
        });
    }
}