<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Mail\VendorVerificationCode;
use App\Models\User;
use App\Models\Vendor;
use App\Support\MailDelivery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

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

        $verificationCode = (string) random_int(100000, 999999);

        // Store application data in session (don't create database record yet)
        session([
            'vendor_application_data' => [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'shop_name' => $validated['shop_name'],
                'shop_logo' => $logoPath,
                'password' => Hash::make($validated['password']),
                'verification_code' => $verificationCode,
                'verification_code_expires_at' => now()->addMinutes(10),
            ],
        ]);

        $sent = MailDelivery::attempt(
            fn () => Mail::to($validated['email'])->send(
                new VendorVerificationCode($verificationCode, $validated['name'])
            ),
            'vendor_application'
        );

        if (! $sent) {
            session()->forget('vendor_application_data');

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'We could not send the verification email. Please try again later.');
        }

        return redirect()
            ->route('vendor.verify')
            ->with('success', 'A verification code has been sent to your email. Please verify to complete your application.');
    }

    public function verify(): Response
    {
        return Inertia::render('Frontend/Vendor/Verify');
    }

    public function verifyCode(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $applicationData = session('vendor_application_data');

        if (! $applicationData) {
            return redirect()
                ->route('vendor.apply')
                ->with('error', 'Session expired. Please submit your application again.');
        }

        // Check if code is expired
        if (now()->greaterThan($applicationData['verification_code_expires_at'])) {
            return redirect()
                ->route('vendor.verify')
                ->with('error', 'Verification code has expired. Please request a new one.');
        }

        // Check if code matches
        if ($applicationData['verification_code'] !== $request->input('code')) {
            return redirect()
                ->route('vendor.verify')
                ->with('error', 'Invalid verification code. Please try again.');
        }

        // Code is valid! Now create the user and vendor
        // 1. Create User
        $user = User::create([
            'name' => $applicationData['name'],
            'email' => $applicationData['email'],
            'password' => $applicationData['password'],
            'email_verified_at' => now(),
        ]);

        // 2. Ensure vendor role exists and assign it
        Role::firstOrCreate(['name' => 'vendor', 'guard_name' => 'web']);
        $user->assignRole('vendor');

        // 3. Create Vendor profile with inactive status (admin will activate)
        Vendor::create([
            'user_id' => $user->id,
            'shop_name' => $applicationData['shop_name'],
            'shop_logo' => $applicationData['shop_logo'],
            'phone' => $applicationData['phone'],
            'address' => $applicationData['address'],
            'status' => 'inactive', // Set as inactive until admin approves
        ]);

        // Clear session data
        session()->forget('vendor_application_data');

        return redirect()
            ->route('vendor.verify')
            ->with('success', 'Email verified successfully! Your vendor application has been submitted and is now under review.');
    }

    public function resendCode(Request $request): RedirectResponse
    {
        $applicationData = session('vendor_application_data');

        if (! $applicationData) {
            return redirect()
                ->route('vendor.apply')
                ->with('error', 'Session expired. Please submit your application again.');
        }

        // Generate new verification code
        $verificationCode = (string) random_int(100000, 999999);

        // Update session data with new code
        $applicationData['verification_code'] = $verificationCode;
        $applicationData['verification_code_expires_at'] = now()->addMinutes(10);
        session(['vendor_application_data' => $applicationData]);

        $sent = MailDelivery::attempt(
            fn () => Mail::to($applicationData['email'])->send(
                new VendorVerificationCode($verificationCode, $applicationData['name'])
            ),
            'vendor_application_resend'
        );

        if (! $sent) {
            return redirect()
                ->back()
                ->with('error', 'We could not send the verification email. Please try again later.');
        }

        return redirect()
            ->route('vendor.verify')
            ->with('success', 'A new verification code has been sent to your email.');
    }
}
