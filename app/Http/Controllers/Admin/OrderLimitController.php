<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderResetInterval;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserOrderLimitRequest;
use App\Http\Requests\Admin\UpdateGlobalOrderLimitRequest;
use App\Http\Requests\Admin\UpdateUserOrderLimitRequest;
use App\Models\Setting;
use App\Models\User;
use App\Models\UserOrderLimit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderLimitController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = UserOrderLimit::query()
            ->with('user:id,name,email')
            ->latest('id');

        if ($search) {
            $query->whereHas('user', function ($userQuery) use ($search) {
                $userQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $userOrderLimits = $query->paginate(15)->withQueryString();

        $settings = Setting::current();

        return Inertia::render('Admin/OrderLimits/Index', [
            'globalOrderLimit' => $settings->global_order_limit !== null
                ? (string) $settings->global_order_limit
                : '',
            'orderResetInterval' => ($settings->order_reset_interval ?? OrderResetInterval::default())->value,
            'orderResetIntervalOptions' => OrderResetInterval::options(),
            'userOrderLimits' => $userOrderLimits,
            'filters' => [
                'search' => $search ?? '',
            ],
            'can' => [
                'updateGlobal' => auth()->user()?->can('order-limits.update') ?? false,
                'create' => auth()->user()?->can('order-limits.create') ?? false,
                'edit' => auth()->user()?->can('order-limits.edit') ?? false,
                'delete' => auth()->user()?->can('order-limits.delete') ?? false,
            ],
        ]);
    }

    public function updateGlobal(UpdateGlobalOrderLimitRequest $request): RedirectResponse
    {
        $settings = Setting::current();
        $value = $request->validated('global_order_limit');

        $settings->update([
            'global_order_limit' => $value !== null && $value !== '' ? $value : null,
            'order_reset_interval' => $request->validated('order_reset_interval'),
        ]);

        return back()->with('success', 'Global order settings saved.');
    }

    public function create(): Response
    {
        $assignedUserIds = UserOrderLimit::query()->pluck('user_id');

        $userOptions = User::query()
            ->whereNotIn('id', $assignedUserIds)
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $user) => [
                'value' => (string) $user->id,
                'label' => "{$user->name} ({$user->email})",
            ]);

        $settings = Setting::current();

        return Inertia::render('Admin/OrderLimits/Create', [
            'userOptions' => $userOptions,
            'defaultOrderResetInterval' => ($settings->order_reset_interval ?? OrderResetInterval::default())->value,
            'orderResetIntervalOptions' => OrderResetInterval::options(),
        ]);
    }

    public function store(StoreUserOrderLimitRequest $request): RedirectResponse
    {
        UserOrderLimit::query()->create($request->validated());

        return redirect()
            ->route('admin.order-limits.index')
            ->with('success', 'User order limit created successfully.');
    }

    public function edit(UserOrderLimit $userOrderLimit): Response
    {
        $userOrderLimit->load('user:id,name,email');

        $assignedUserIds = UserOrderLimit::query()
            ->where('id', '!=', $userOrderLimit->id)
            ->pluck('user_id');

        $userOptions = User::query()
            ->where(function ($query) use ($userOrderLimit, $assignedUserIds) {
                $query->where('id', $userOrderLimit->user_id)
                    ->orWhereNotIn('id', $assignedUserIds);
            })
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $user) => [
                'value' => (string) $user->id,
                'label' => "{$user->name} ({$user->email})",
            ]);

        $settings = Setting::current();
        $defaultReset = $settings->order_reset_interval ?? OrderResetInterval::default();

        return Inertia::render('Admin/OrderLimits/Edit', [
            'userOrderLimit' => [
                'id' => $userOrderLimit->id,
                'user_id' => (string) $userOrderLimit->user_id,
                'order_limit' => (string) $userOrderLimit->order_limit,
                'order_reset_interval' => ($userOrderLimit->order_reset_interval ?? $defaultReset)->value,
                'user_name' => $userOrderLimit->user?->name,
                'user_email' => $userOrderLimit->user?->email,
            ],
            'userOptions' => $userOptions,
            'orderResetIntervalOptions' => OrderResetInterval::options(),
        ]);
    }

    public function update(UpdateUserOrderLimitRequest $request, UserOrderLimit $userOrderLimit): RedirectResponse
    {
        $userOrderLimit->update($request->validated());

        return redirect()
            ->route('admin.order-limits.index')
            ->with('success', 'User order limit updated successfully.');
    }

    public function destroy(UserOrderLimit $userOrderLimit): RedirectResponse
    {
        $userOrderLimit->delete();

        return redirect()
            ->route('admin.order-limits.index')
            ->with('success', 'User order limit removed. User will use the global limit.');
    }
}
