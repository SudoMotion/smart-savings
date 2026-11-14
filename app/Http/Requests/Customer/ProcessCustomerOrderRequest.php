<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class ProcessCustomerOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isRegular() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [];
    }
}
