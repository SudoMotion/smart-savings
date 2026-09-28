<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\Permissions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class VendorPermissionController extends Controller
{
    public function index(): Response
    {
        $role = Role::firstOrCreate(['name' => 'vendor', 'guard_name' => 'web']);

        // Ensure all permissions exist in database
        foreach (Permissions::all() as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);
        }

        $assignedPermissions = $role->permissions->pluck('name')->all();

        return Inertia::render('Admin/VendorPermissions/Index', [
            'groups' => Permissions::groups(),
            'assignedPermissions' => $assignedPermissions,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'permissions' => ['present', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $role = Role::firstOrCreate(['name' => 'vendor', 'guard_name' => 'web']);
        $role->syncPermissions($request->input('permissions', []));

        return redirect()
            ->route('admin.vendor-permissions.index')
            ->with('success', 'Vendor permissions updated successfully.');
    }
}

