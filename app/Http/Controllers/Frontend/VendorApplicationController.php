<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\VendorApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class VendorApplicationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Frontend/Vendor/Apply');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email', 'unique:vendor_applications,email'],
            'phone' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string', 'max:1000'],
            'shop_name' => ['required', 'string', 'max:255'],
            'shop_logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $logoPath = null;
        if ($request->hasFile('shop_logo')) {
            $logoPath = $request->file('shop_logo')->store('vendor_logos', 'public');
        }

        VendorApplication::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'shop_name' => $validated['shop_name'],
            'shop_logo' => $logoPath,
            'password' => Hash::make($validated['password']),
            'status' => 'pending',
        ]);

        return redirect()
            ->route('vendor.apply')
            ->with('success', 'Your vendor application has been submitted successfully! Our team will review your application soon.');
    }
}

