<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class VendorApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = VendorApplication::query()->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('shop_name', 'like', "%{$search}%");
            });
        }

        $applications = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/VendorApplications/Index', [
            'applications' => $applications,
            'filters' => [
                'search' => $search,
            ],
            'total' => VendorApplication::count(),
            'can' => [
                'approve' => auth()->user()?->can('vendor-applications.approve') ?? false,
                'reject' => auth()->user()?->can('vendor-applications.reject') ?? false,
                'delete' => auth()->user()?->can('vendor-applications.delete') ?? false,
            ],
        ]);
    }

    public function approve(VendorApplication $vendorApplication): RedirectResponse
    {
        $shopName = $vendorApplication->shop_name;

        // 1. Create or retrieve User
        $user = User::firstOrNew(['email' => $vendorApplication->email]);
        $user->name = $vendorApplication->name;
        // The password in application is already hashed
        $user->password = $vendorApplication->password;
        $user->email_verified_at = now();
        $user->save();

        // 2. Ensure vendor role exists and assign it
        Role::firstOrCreate(['name' => 'vendor', 'guard_name' => 'web']);
        $user->assignRole('vendor');

        // 3. Create or update Vendor profile
        Vendor::updateOrCreate(
            ['user_id' => $user->id],
            [
                'shop_name' => $vendorApplication->shop_name,
                'shop_logo' => $vendorApplication->shop_logo,
                'phone' => $vendorApplication->phone,
                'address' => $vendorApplication->address,
                'status' => 'active',
            ]
        );

        // 4. Remove from vendor_applications so it is not kept here, transferred to vendor list
        $vendorApplication->delete();

        return redirect()
            ->route('admin.vendor-applications.index')
            ->with('success', "Vendor application for '{$shopName}' approved and transferred to Vendor List successfully.");
    }

    public function reject(Request $request, VendorApplication $vendorApplication): RedirectResponse
    {
        $shopName = $vendorApplication->shop_name;

        // Delete uploaded shop logo file if present
        if ($vendorApplication->shop_logo) {
            Storage::disk('public')->delete($vendorApplication->shop_logo);
        }

        // Delete from vendor_applications
        $vendorApplication->delete();

        return redirect()
            ->route('admin.vendor-applications.index')
            ->with('success', "Vendor application for '{$shopName}' has been rejected and removed.");
    }

    public function destroy(VendorApplication $vendorApplication): RedirectResponse
    {
        if ($vendorApplication->shop_logo) {
            Storage::disk('public')->delete($vendorApplication->shop_logo);
        }

        $vendorApplication->delete();

        return redirect()
            ->route('admin.vendor-applications.index')
            ->with('success', 'Vendor application deleted successfully.');
    }
}
