<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStaffUserRequest;
use App\Http\Requests\Admin\UpdateStaffUserRequest;
use App\Models\User;
use App\Support\Permissions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class StaffUserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = User::query()
            ->staffAccounts()
            ->with('roles')
            ->latest('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $staffUsers = $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first(),
                'is_protected' => $user->hasRole(Permissions::SUPERADMIN_ROLE),
                'created_at' => $user->created_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('Admin/StaffUsers/Index', [
            'staffUsers' => $staffUsers,
            'filters' => ['search' => $search ?? ''],
            'can' => [
                'create' => auth()->user()?->can('staff-users.create') ?? false,
                'edit' => auth()->user()?->can('staff-users.edit') ?? false,
                'delete' => auth()->user()?->can('staff-users.delete') ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/StaffUsers/Create', [
            'roles' => $this->roleOptions(),
        ]);
    }

    public function store(StoreStaffUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => $request->validated('password'),
            'email_verified_at' => now(),
            'user_type' => UserType::GoldMember,
        ]);

        $user->syncRoles([$request->validated('role')]);

        return redirect()
            ->route('admin.staff-users.index')
            ->with('success', 'Staff user created successfully.');
    }

    public function edit(User $staffUser): Response|RedirectResponse
    {
        if (! $staffUser->isStaffAccount()) {
            abort(404);
        }

        return Inertia::render('Admin/StaffUsers/Edit', [
            'staffUser' => [
                'id' => $staffUser->id,
                'name' => $staffUser->name,
                'email' => $staffUser->email,
                'role' => $staffUser->getRoleNames()->first(),
                'is_protected' => $staffUser->hasRole(Permissions::SUPERADMIN_ROLE),
            ],
            'roles' => $this->roleOptions(),
        ]);
    }

    public function update(UpdateStaffUserRequest $request, User $staffUser): RedirectResponse
    {
        if (! $staffUser->isStaffAccount()) {
            abort(404);
        }

        $staffUser->update([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
        ]);

        if ($request->filled('password')) {
            $staffUser->update([
                'password' => Hash::make($request->validated('password')),
            ]);
        }

        $staffUser->syncRoles([$request->validated('role')]);

        return redirect()
            ->route('admin.staff-users.index')
            ->with('success', 'Staff user updated successfully.');
    }

    public function destroy(User $staffUser): RedirectResponse
    {
        abort_unless(auth()->user()?->can('staff-users.delete'), 403);

        if (! $staffUser->isStaffAccount()) {
            abort(404);
        }

        if ($staffUser->id === auth()->id()) {
            return redirect()
                ->route('admin.staff-users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        if (
            $staffUser->hasRole(Permissions::SUPERADMIN_ROLE)
            && User::query()->role(Permissions::SUPERADMIN_ROLE)->count() <= 1
        ) {
            return redirect()
                ->route('admin.staff-users.index')
                ->with('error', 'You cannot delete the only superadmin account.');
        }

        $staffUser->syncRoles([]);
        $staffUser->delete();

        return redirect()
            ->route('admin.staff-users.index')
            ->with('success', 'Staff user deleted successfully.');
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function roleOptions(): array
    {
        return Role::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role) => [
                'value' => $role->name,
                'label' => ucfirst($role->name),
            ])
            ->values()
            ->all();
    }
}