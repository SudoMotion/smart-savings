<?php

namespace App\Http\Requests\Customer;

use App\Models\DepositOption;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDepositRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'deposit_option_id' => [
                'required',
                'integer',
                Rule::exists('deposit_options', 'id')->where('status', 'active'),
            ],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'transaction_id' => ['required', 'string', 'max:255'],
            'proof' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ];
    }

    public function depositOption(): DepositOption
    {
        return DepositOption::query()
            ->where('status', 'active')
            ->findOrFail($this->integer('deposit_option_id'));
    }
}
