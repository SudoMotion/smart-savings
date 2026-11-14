<?php

namespace App\Support;

use App\Models\CustomerOrder;
use App\Models\Product;
use App\Models\User;
use App\Services\CustomerOrderService;

class CustomerOrderData
{
    /**
     * @return array{
     *     enabled: bool,
     *     products: list<array{id: int, slot: int, name: string, image_url: ?string}>,
     *     limit: int,
     *     used: int,
     *     remaining: int,
     *     uses_global_limit: bool,
     *     reset_interval_label: string,
     *     reset_hours: int,
     *     percentage: float,
     *     formatted_percentage: string,
     *     deposit_amount: float,
     *     formatted_deposit_amount: string,
     *     earning_per_order: float,
     *     formatted_earning_per_order: string
     * }
     */
    public static function forDashboard(User $user): array
    {
        $limit = OrderLimitData::orderCountForUser($user);
        $windowStart = OrderLimitData::windowStartForUser($user);
        $resetInterval = OrderLimitData::resetIntervalForUser($user);
        $used = CustomerOrder::query()
            ->where('user_id', $user->id)
            ->where('created_at', '>=', $windowStart)
            ->count();
        $remaining = max(0, $limit - $used);
        $percentage = (float) ($user->percentage ?? 0);
        $deposit = (float) $user->ensureWallet()->balance;
        $earningPerOrder = (new CustomerOrderService())->earningPerOrder($user);

        $products = [];

        if ($user->isRegular() && $remaining > 0) {
            $catalog = Product::query()
                ->where('status', 'active')
                ->orderBy('id')
                ->get(['id', 'name', 'image']);

            $catalogCount = $catalog->count();

            if ($catalogCount > 0) {
                $show = $remaining;

                for ($i = 0; $i < $show; $i++) {
                    $product = $catalog[($used + $i) % $catalogCount];
                    $products[] = [
                        'id' => $product->id,
                        'slot' => $i,
                        'name' => $product->name,
                        'image_url' => $product->image_url,
                    ];
                }
            }
        }

        return [
            'enabled' => $user->isRegular(),
            'products' => $products,
            'limit' => $limit,
            'used' => $used,
            'remaining' => $remaining,
            'uses_global_limit' => ! OrderLimitData::hasDedicatedLimit($user),
            'reset_interval_label' => $resetInterval->label(),
            'reset_hours' => $resetInterval->hours(),
            'percentage' => $percentage,
            'formatted_percentage' => number_format($percentage, 2, '.', ''),
            'deposit_amount' => $deposit,
            'formatted_deposit_amount' => WalletData::format($deposit),
            'earning_per_order' => $earningPerOrder,
            'formatted_earning_per_order' => WalletData::format($earningPerOrder),
        ];
    }
}
