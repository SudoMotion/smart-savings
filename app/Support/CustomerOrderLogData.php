<?php

namespace App\Support;

use App\Enums\CustomerOrderStatus;
use App\Models\CustomerOrder;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerOrderLogData
{
    /**
     * @return LengthAwarePaginator<int, array{
     *     date: string,
     *     approved_orders: int,
     *     rejected_orders: int,
     *     earned_balance: float,
     *     formatted_earned_balance: string
     * }>
     */
    public static function sessionsForUser(User $user, int $perPage = 15): LengthAwarePaginator
    {
        $confirmed = CustomerOrderStatus::Confirmed->value;
        $rejected = CustomerOrderStatus::Rejected->value;

        return CustomerOrder::query()
            ->where('user_id', $user->id)
            ->selectRaw(
                'DATE(created_at) as session_date,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as approved_orders,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as rejected_orders,
                COALESCE(SUM(amount_earned), 0) as earned_balance',
                [$confirmed, $rejected]
            )
            ->groupByRaw('DATE(created_at)')
            ->orderByDesc('session_date')
            ->paginate($perPage)
            ->withQueryString()
            ->through(function ($row) {
                $earned = (float) $row->earned_balance;

                return [
                    'date' => Carbon::parse($row->session_date)->format('F j, Y'),
                    'approved_orders' => (int) $row->approved_orders,
                    'rejected_orders' => (int) $row->rejected_orders,
                    'earned_balance' => $earned,
                    'formatted_earned_balance' => WalletData::format($earned),
                ];
            });
    }
}
