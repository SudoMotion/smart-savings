<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDepositOptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('deposit-options.create') ?? false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'coin_type' => ['required', 'string', 'max:255'],
            'value' => ['required', 'string', 'max:2000'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ];
    }
}

