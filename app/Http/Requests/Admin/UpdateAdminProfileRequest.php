<?php

namespace App\Http\Requests\Admin;

use App\Support\PortalGuard;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdminProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user(PortalGuard::ADMIN);

        return $user !== null && $user->canAccessAdminPanel();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $user = $this->user(PortalGuard::ADMIN);

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'profile_photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'remove_profile_photo' => ['sometimes', 'boolean'],
        ];
    }
}