<?php

namespace App\Services;

use App\Enums\DepositRequestStatus;
use App\Models\User;
use App\Models\WithdrawRequest;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class WithdrawRequestService
{
    public function approve(WithdrawRequest $withdrawRequest, User $reviewer): void
    {
        DB::transaction(function () use ($withdrawRequest, $reviewer) {
            /** @var WithdrawRequest $locked */
            $locked = WithdrawRequest::query()
                ->whereKey($withdrawRequest->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($locked->status !== DepositRequestStatus::UnderReview) {
                throw new InvalidArgumentException('This withdraw request has already been reviewed.');
            }

            $wallet = $locked->user->ensureWallet();
            $wallet->refresh();

            if ((float) $wallet->balance < (float) $locked->amount) {
                throw new InvalidArgumentException('User wallet balance is insufficient to approve this withdrawal.');
            }

            $wallet->decrement('balance', $locked->amount);

            $locked->update([
                'status' => DepositRequestStatus::Approved,
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => now(),
            ]);
        });
    }

    public function reject(WithdrawRequest $withdrawRequest, User $reviewer, ?string $adminNote = null): void
    {
        DB::transaction(function () use ($withdrawRequest, $reviewer, $adminNote) {
            /** @var WithdrawRequest $locked */
            $locked = WithdrawRequest::query()
                ->whereKey($withdrawRequest->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($locked->status !== DepositRequestStatus::UnderReview) {
                throw new InvalidArgumentException('This withdraw request has already been reviewed.');
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
