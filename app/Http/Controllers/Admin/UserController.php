<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserPasswordRequest;
use App\Http\Requests\Admin\UpdateUserPercentageRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use App\Models\UserEvent;
use App\Support\WalletData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $type = $request->query('type');

        $query = User::query()
            ->excludingStaffAccounts()
            ->with(['roles', 'vendor', 'wallet'])
            ->latest('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($type === 'customer') {
            $query->whereDoesntHave('roles')->whereDoesntHave('vendor');
        } elseif ($type === 'vendor') {
            $query->whereHas('vendor');
        }

        $users = $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'portal_type' => $this->portalType($user),
                'vendor_shop' => $user->vendor?->shop_name,
                'percentage' => (float) ($user->percentage ?? 0),
                'wallet_balance' => WalletData::balanceFromWallet($user->wallet),
                'created_at' => $user->created_at?->format('Y-m-d H:i'),
            ]);

        $managedUsers = User::query()->excludingStaffAccounts();

        $counts = [
            'all' => (clone $managedUsers)->count(),
            'customer' => (clone $managedUsers)->whereDoesntHave('vendor')->count(),
            'vendor' => (clone $managedUsers)->whereHas('vendor')->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search ?? '',
                'type' => $type ?? '',
            ],
            'counts' => $counts,
            'can' => [
                'create' => auth()->user()?->can('users.create') ?? false,
                'edit' => auth()->user()?->can('users.edit') ?? false,
                'delete' => auth()->user()?->can('users.delete') ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => $request->validated('password'),
            'email_verified_at' => now(),
            'user_type' => UserType::GoldMember,
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        $this->ensureManagedUser($user);

        $wallet = WalletData::totalForUser($user);

        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'wallet_balance' => $wallet['balance'],
                'formatted_wallet_balance' => $wallet['formatted_balance'],
                'events' => $user->events()
                    ->get()
                    ->map(fn (UserEvent $event) => [
                        'id' => $event->id,
                        'first_window_text' => $event->first_window_text,
                        'bonus_amount' => $event->bonus_amount,
                        'deposit_amount' => $event->deposit_amount,
                        'expire_on' => $event->expire_on?->format('Y-m-d\TH:i'),
                    ])
                    ->values()
                    ->all(),
            ],
        ]);
    }

    public function editPassword(User $user): Response
    {
        $this->ensureManagedUser($user);

        return Inertia::render('Admin/Users/EditPassword', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function updatePassword(UpdateUserPasswordRequest $request, User $user): RedirectResponse
    {
        $this->ensureManagedUser($user);

        $user->update([
            'password' => $request->validated('password'),
        ]);

        return redirect()
            ->route('admin.users.edit', $user)
            ->with('success', 'Password updated successfully.');
    }

    public function updatePercentage(UpdateUserPercentageRequest $request, User $user): RedirectResponse
    {
        $this->ensureManagedUser($user);

        $user->update([
            'percentage' => $request->validated('percentage'),
        ]);

        return redirect()
            ->back()
            ->with('success', "Percentage updated for {$user->name}.");
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->ensureManagedUser($user);

        DB::transaction(function () use ($request, $user) {
            $user->update([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
            ]);

            $this->syncEvents($user, $request->validated('events') ?? []);
        });

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->ensureManagedUser($user);

        if ($user->id === auth()->id()) {
            return redirect()
                ->route('admin.users.index')
                ->with('success', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * @param  list<array{id?: int|null, first_window_text: string, bonus_amount: mixed, deposit_amount: mixed, expire_on: string}>  $events
     */
    private function syncEvents(User $user, array $events): void
    {
        $keepIds = [];

        foreach ($events as $event) {
            $payload = [
                'first_window_text' => $event['first_window_text'],
                'bonus_amount' => $event['bonus_amount'],
                'deposit_amount' => $event['deposit_amount'],
                'expire_on' => $event['expire_on'],
            ];

            if (! empty($event['id'])) {
                $user->events()->whereKey($event['id'])->update($payload);
                $keepIds[] = (int) $event['id'];
            } else {
                $created = $user->events()->create($payload);
                $keepIds[] = $created->id;
            }
        }

        $query = $user->events();

        if ($keepIds !== []) {
            $query->whereNotIn('id', $keepIds);
        }

        $query->delete();
    }

    private function portalType(User $user): string
    {
        if ($user->vendor) {
            return 'vendor';
        }

        return 'customer';
    }

    private function ensureManagedUser(User $user): void
    {
        if ($user->isStaffAccount()) {
            abort(404);
        }
    }
}
