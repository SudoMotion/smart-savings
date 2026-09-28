<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class VendorApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $query = VendorApplication::query()
            ->with(['user', 'reviewer'])
            ->latest();

        if ($status && in_array($status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('shop_name', 'like', "%{$search}%");
            });
        }

        $applications = $query->paginate(15)->withQueryString();

        $counts = [
            'all' => VendorApplication::count(),
            'pending' => VendorApplication::where('status', 'pending')->count(),
            'approved' => VendorApplication::where('status', 'approved')->count(),
            'rejected' => VendorApplication::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/VendorApplications/Index', [
            'applications' => $applications,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'counts' => $counts,
            'can' => [
                'approve' => auth()->user()?->can('vendor-applications.approve') ?? false,
                'reject' => auth()->user()?->can('vendor-applications.reject') ?? false,
                'delete' => auth()->user()?->can('vendor-applications.delete') ?? false,
            ],
        ]);
    }

    public function approve(VendorApplication $vendorApplication): RedirectResponse
    {
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

        // 4. Update Application status
        $vendorApplication->update([
            'status' => 'approved',
            'user_id' => $user->id,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'rejection_reason' => null,
        ]);

        return redirect()
            ->route('admin.vendor-applications.index')
            ->with('success', "Vendor application for '{$vendorApplication->shop_name}' approved successfully! Vendor transferred to Vendor List.");
    }

    public function reject(Request $request, VendorApplication $vendorApplication): RedirectResponse
    {
        $validated = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:1000'],
        ]);

        $vendorApplication->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return redirect()
            ->route('admin.vendor-applications.index')
            ->with('success', "Vendor application for '{$vendorApplication->shop_name}' has been rejected.");
    }

    public function destroy(VendorApplication $vendorApplication): RedirectResponse
    {
        $vendorApplication->delete();

        return redirect()
            ->route('admin.vendor-applications.index')
            ->with('success', 'Vendor application deleted successfully.');
    }
}

