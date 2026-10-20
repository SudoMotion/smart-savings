<?php

namespace App\Services;

use App\Enums\CustomerOrderStatus;
use App\Models\CustomerOrder;
use App\Models\Product;
use App\Models\User;
use App\Support\OrderLimitData;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CustomerOrderService
{
    public function confirm(User $user, Product $product): float
    {
        return $this->process($user, $product, CustomerOrderStatus::Confirmed);
    }

    public function reject(User $user, Product $product): float
    {
        return $this->process($user, $product, CustomerOrderStatus::Rejected);
    }

    public function earningPerOrder(User $user): float
    {
        $deposit = (float) $user->ensureWallet()->balance;
        $percentage = (float) ($user->percentage ?? 0);

        return round($deposit * $percentage / 100, 2);
    }

    private function process(User $user, Product $product, CustomerOrderStatus $status): float
    {
        if (! $user->isRegular()) {
            throw new InvalidArgumentException('Order cards are only available for Regular accounts.');
        }

        if ($product->status !== 'active') {
            throw new InvalidArgumentException('This product is not available.');
        }

        return DB::transaction(function () use ($user, $product, $status) {
            /** @var User $lockedUser */
            $lockedUser = User::query()
                ->whereKey($user->id)
                ->lockForUpdate()
                ->firstOrFail();

            $windowStart = OrderLimitData::windowStartForUser($lockedUser);
            $limit = OrderLimitData::orderCountForUser($lockedUser);

            $alreadyProcessed = CustomerOrder::query()
                ->where('user_id', $lockedUser->id)
                ->where('product_id', $product->id)
                ->where('created_at', '>=', $windowStart)
                ->lockForUpdate()
                ->exists();

            if ($alreadyProcessed) {
                throw new InvalidArgumentException('You already handled this order.');
            }

            $used = CustomerOrder::query()
                ->where('user_id', $lockedUser->id)
                ->where('created_at', '>=', $windowStart)
                ->lockForUpdate()
                ->count();

            if ($limit <= 0 || $used >= $limit) {
                throw new InvalidArgumentException('You have reached your order limit for this reset window.');
            }

            $deposit = (float) $lockedUser->ensureWallet()->balance;
            $percentage = (float) ($lockedUser->percentage ?? 0);
            $earned = $status === CustomerOrderStatus::Confirmed
                ? round($deposit * $percentage / 100, 2)
                : 0.0;

            CustomerOrder::query()->create([
                'user_id' => $lockedUser->id,
                'product_id' => $product->id,
                'status' => $status,
                'amount_earned' => $earned,
                'deposit_amount' => $deposit,
                'percentage' => $percentage,
            ]);

            if ($earned > 0) {
                $lockedUser->ensureEarningWallet()->increment('balance', $earned);
            }

            return $earned;
        });
    }
}
