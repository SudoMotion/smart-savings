<?php

namespace App\Http\Requests\Customer;

use App\Enums\DepositRequestStatus;
use App\Models\DepositOption;
use App\Models\WithdrawRequest;
use App\Support\WithdrawRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreWithdrawRequest extends FormRequest
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
            'wallet_address' => ['required', 'string', 'max:500'],
            'amount' => ['required', 'numeric', 'min:'.WithdrawRules::MINIMUM_AMOUNT_USD],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'amount.min' => 'Each withdraw request must be at least $'.number_format(WithdrawRules::MINIMUM_AMOUNT_USD, 2, '.', '').'.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $user = $this->user();
            $amount = (float) $this->input('amount');
            $wallet = $user->ensureWallet();
            $pending = WithdrawRequest::query()
                ->where('user_id', $user->id)
                ->where('status', DepositRequestStatus::UnderReview)
                ->sum('amount');

            $available = (float) $wallet->balance - (float) $pending;

            if ($available < WithdrawRules::MINIMUM_AMOUNT_USD) {
                $validator->errors()->add(
                    'amount',
                    'You need at least $'.number_format(WithdrawRules::MINIMUM_AMOUNT_USD, 2, '.', '').' available balance to request a withdrawal.'
                );

                return;
            }

            if ($amount > $available) {
                $validator->errors()->add(
                    'amount',
                    'Insufficient balance for this withdrawal (including pending requests).'
                );
            }
        });
    }

    public function depositOption(): DepositOption
    {
        return DepositOption::query()
            ->where('status', 'active')
            ->findOrFail($this->integer('deposit_option_id'));
    }
}
