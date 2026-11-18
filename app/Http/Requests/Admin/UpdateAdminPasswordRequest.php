<?php

namespace App\Http\Requests\Admin;

use App\Support\PortalGuard;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateAdminPasswordRequest extends FormRequest
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
        return [
            'current_password' => ['required', 'current_password:admin'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }
}