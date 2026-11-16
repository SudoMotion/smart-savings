<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreReferralTierRequest;
use App\Http\Requests\Admin\UpdateReferralTierRequest;
use App\Models\ReferralTier;
use App\Support\ReferralTierData;
use App\Support\WalletData;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReferralTierController extends Controller
{
    public function index(): Response
    {
        $referralTiers = ReferralTier::query()
            ->orderBy('referral_from')
            ->get()
            ->map(fn (ReferralTier $tier) => [
                'id' => $tier->id,
                'referral_from' => $tier->referral_from,
                'referral_to' => $tier->referral_to,
                'reward_amount' => (string) $tier->reward_amount,
                'formatted_reward_amount' => WalletData::format((float) $tier->reward_amount),
                'range_label' => ReferralTierData::rangeLabel($tier->referral_from, $tier->referral_to),
            ]);

        return Inertia::render('Admin/ReferralTiers/Index', [
            'referralTiers' => $referralTiers,
            'can' => [
                'create' => auth()->user()?->can('referral-tiers.create') ?? false,
                'edit' => auth()->user()?->can('referral-tiers.edit') ?? false,
                'delete' => auth()->user()?->can('referral-tiers.delete') ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/ReferralTiers/Create');
    }

    public function store(StoreReferralTierRequest $request): RedirectResponse
    {
        ReferralTier::query()->create($this->payload($request));

        return redirect()
            ->route('admin.referral-tiers.index')
            ->with('success', 'Referral tier created successfully.');
    }

    public function edit(ReferralTier $referralTier): Response
    {
        return Inertia::render('Admin/ReferralTiers/Edit', [
            'referralTier' => [
                'id' => $referralTier->id,
                'referral_from' => $referralTier->referral_from,
                'referral_to' => $referralTier->referral_to,
                'reward_amount' => (string) $referralTier->reward_amount,
            ],
        ]);
    }

    public function update(UpdateReferralTierRequest $request, ReferralTier $referralTier): RedirectResponse
    {
        $referralTier->update($this->payload($request));

        return redirect()
            ->route('admin.referral-tiers.index')
            ->with('success', 'Referral tier updated successfully.');
    }

    public function destroy(ReferralTier $referralTier): RedirectResponse
    {
        $referralTier->delete();

        return redirect()
            ->route('admin.referral-tiers.index')
            ->with('success', 'Referral tier deleted successfully.');
    }

    /**
     * @return array{referral_from: int, referral_to: int|null, reward_amount: mixed}
     */
    private function payload(StoreReferralTierRequest|UpdateReferralTierRequest $request): array
    {
        return [
            'referral_from' => $request->integer('referral_from'),
            'referral_to' => $request->filled('referral_to') ? $request->integer('referral_to') : null,
            'reward_amount' => $request->input('reward_amount'),
        ];
    }
}
