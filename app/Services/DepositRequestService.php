<?php

namespace App\Services;

use App\Enums\DepositRequestStatus;
use App\Models\DepositRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class DepositRequestService
{
    public function __construct(
        private ReferralService $referralService,
    ) {}

    public function approve(DepositRequest $depositRequest, User $reviewer): void
    {
        DB::transaction(function () use ($depositRequest, $reviewer) {
            /** @var DepositRequest $locked */
            $locked = DepositRequest::query()
                ->whereKey($depositRequest->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($locked->status !== DepositRequestStatus::UnderReview) {
                throw new InvalidArgumentException('This deposit request has already been reviewed.');
            }

            $wallet = $locked->user->ensureWallet();
            $wallet->increment('balance', $locked->amount);

            $locked->update([
                'status' => DepositRequestStatus::Approved,
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => now(),
            ]);

            $this->referralService->processRewardForApprovedDeposit($locked->fresh(['user.referrer']));
        });
    }

    public function reject(DepositRequest $depositRequest, User $reviewer, ?string $adminNote = null): void
    {
        DB::transaction(function () use ($depositRequest, $reviewer, $adminNote) {
            /** @var DepositRequest $locked */
            $locked = DepositRequest::query()
                ->whereKey($depositRequest->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($locked->status !== DepositRequestStatus::UnderReview) {
                throw new InvalidArgumentException('This deposit request has already been reviewed.');
            }

            $locked->update([
                'status' => DepositRequestStatus::Rejected,
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => now(),
                'admin_note' => $adminNote,
            ]);
        });
    }
}
