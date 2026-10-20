<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AccountType;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserAccountTypeRequest;
use App\Http\Requests\Admin\UpdateUserPercentageRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use App\Support\Permissions;
use App\Support\WalletData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $type = $request->query('type');

        $query = User::query()
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
        } elseif ($type === 'staff') {
            $query->whereHas('roles');
        }

        $users = $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->join(', ') ?: null,
                'portal_type' => $this->portalType($user),
                'account_type' => ($user->account_type ?? AccountType::InactiveMember)->value,
                'account_type_label' => ($user->account_type ?? AccountType::InactiveMember)->label(),
                'user_type' => ($user->user_type ?? UserType::Regular)->value,
                'user_type_label' => ($user->user_type ?? UserType::Regular)->label(),
                'vendor_shop' => $user->vendor?->shop_name,
                'percentage' => (float) ($user->percentage ?? 0),
                'wallet_balance' => WalletData::balanceFromWallet($user->wallet),
                'created_at' => $user->created_at?->format('Y-m-d H:i'),
            ]);

        $counts = [
            'all' => User::count(),
            'customer' => User::whereDoesntHave('roles')->whereDoesntHave('vendor')->count(),
            'vendor' => User::whereHas('vendor')->count(),
            'staff' => User::whereHas('roles')->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search ?? '',
                'type' => $type ?? '',
            ],
            'counts' => $counts,
            'accountTypeOptions' => AccountType::options(),
            'can' => [
                'create' => auth()->user()?->can('users.create') ?? false,
                'edit' => auth()->user()?->can('users.edit') ?? false,
                'delete' => auth()->user()?->can('users.delete') ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => $this->roleOptions(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => $request->validated('password'),
            'email_verified_at' => now(),
        ]);

        $user->syncRoles([$request->validated('role')]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()?->name ?? '',
                'user_type' => ($user->user_type ?? UserType::Regular)->value,
            ],
            'roles' => $this->roleOptions(),
            'userTypeOptions' => UserType::options(),
        ]);
    }

    public function updatePercentage(UpdateUserPercentageRequest $request, User $user): RedirectResponse
    {
        $user->update([
            'percentage' => $request->validated('percentage'),
        ]);

        return redirect()
            ->back()
            ->with('success', "Percentage updated for {$user->name}.");
    }

    public function updateAccountType(UpdateUserAccountTypeRequest $request, User $user): RedirectResponse
    {
        $user->update([
            'account_type' => $request->validated('account_type'),
        ]);

        return redirect()
            ->back()
            ->with('success', "Member type updated for {$user->name}.");
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->update([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'user_type' => $request->validated('user_type'),
        ]);

        if ($request->filled('password')) {
            $user->update([
                'password' => $request->validated('password'),
            ]);
        }

        $user->syncRoles([$request->validated('role')]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
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
     * @return list<array{value: string, label: string}>
     */
    private function roleOptions(): array
    {
        return Role::query()
            ->orderBy('name')
            ->get(['name'])
            ->map(fn (Role $role) => [
                'value' => $role->name,
                'label' => ucfirst($role->name),
            ])
            ->values()
            ->all();
    }

    private function portalType(User $user): string
    {
        if ($user->hasRole(Permissions::SUPERADMIN_ROLE) || $user->roles->isNotEmpty()) {
            return 'staff';
        }

        if ($user->vendor) {
            return 'vendor';
        }

        return 'customer';
    }
}
