<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $query = Vendor::query()
            ->with('user')
            ->latest();

        if ($status && in_array($status, ['active', 'inactive'])) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('shop_name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $vendors = $query->paginate(15)->withQueryString();

        $counts = [
            'all' => Vendor::count(),
            'active' => Vendor::where('status', 'active')->count(),
            'inactive' => Vendor::where('status', 'inactive')->count(),
        ];

        return Inertia::render('Admin/Vendors/Index', [
            'vendors' => $vendors,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'counts' => $counts,
            'can' => [
                'edit' => auth()->user()?->can('vendors.edit') ?? false,
                'delete' => auth()->user()?->can('vendors.delete') ?? false,
                'managePermissions' => auth()->user()?->can('vendor-permissions.manage') ?? false,
            ],
        ]);
    }

    public function edit(Vendor $vendor): Response
    {
        $vendor->load('user');

        return Inertia::render('Admin/Vendors/Edit', [
            'vendor' => [
                'id' => $vendor->id,
                'user_id' => $vendor->user_id,
                'name' => $vendor->user->name,
                'email' => $vendor->user->email,
                'phone' => $vendor->phone ?? '',
                'address' => $vendor->address ?? '',
                'shop_name' => $vendor->shop_name,
                'logo_url' => $vendor->logo_url,
                'status' => $vendor->status,
            ],
        ]);
    }

    public function update(Request $request, Vendor $vendor): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($vendor->user_id)],
            'phone' => ['required', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:1000'],
            'shop_name' => ['required', 'string', 'max:255'],
            'shop_logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        $vendor->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        $updateData = [
            'shop_name' => $validated['shop_name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'status' => $validated['status'],
        ];

        if ($request->hasFile('shop_logo')) {
            if ($vendor->shop_logo) {
                Storage::disk('public')->delete($vendor->shop_logo);
            }
            $updateData['shop_logo'] = $request->file('shop_logo')->store('vendor_logos', 'public');
        }

        $vendor->update($updateData);

        return redirect()
            ->route('admin.vendors.index')
            ->with('success', 'Vendor updated successfully.');
    }

    public function toggleStatus(Vendor $vendor): RedirectResponse
    {
        $newStatus = $vendor->status === 'active' ? 'inactive' : 'active';
        $vendor->update(['status' => $newStatus]);

        return redirect()
            ->route('admin.vendors.index')
            ->with('success', "Vendor status updated to {$newStatus}.");
    }

    public function destroy(Vendor $vendor): RedirectResponse
    {
        if ($vendor->shop_logo) {
            Storage::disk('public')->delete($vendor->shop_logo);
        }

        $user = $vendor->user;
        $vendor->delete();

        // Optionally delete the user account if they only have the vendor role
        if ($user && $user->roles()->count() <= 1 && $user->hasRole('vendor')) {
            $user->delete();
        }

        return redirect()
            ->route('admin.vendors.index')
            ->with('success', 'Vendor deleted successfully.');
    }
}

