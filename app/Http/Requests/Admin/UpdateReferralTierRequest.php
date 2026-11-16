<?php

namespace App\Http\Requests\Admin;

use App\Models\ReferralTier;
use App\Support\ReferralTierData;
use Illuminate\Foundation\Http\FormRequest;

class UpdateReferralTierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('referral-tiers.edit') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'referral_from' => ['required', 'integer', 'min:1'],
            'referral_to' => ['nullable', 'integer', 'min:1', 'gte:referral_from'],
            'reward_amount' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            /** @var ReferralTier $referralTier */
            $referralTier = $this->route('referralTier');

            $from = (int) $this->input('referral_from');
            $to = $this->filled('referral_to') ? (int) $this->input('referral_to') : null;

            if (ReferralTierData::hasOverlappingTier($from, $to, $referralTier->id)) {
                $validator->errors()->add(
                    'referral_from',
                    'This referral range overlaps an existing tier. Adjust the from / to values.',
                );
            }
        });
    }
}
