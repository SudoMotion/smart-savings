<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Mail\VendorVerificationCode;
use App\Models\VendorApplication;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades.Hash;
use Illuminate\Support\Facades\Mail;
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

        $verificationCode = (string) random_int(100000, 999999);

        $application = VendorApplication::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'shop_name' => $validated['shop_name'],
            'shop_logo' => $logoPath,
            'password' => Hash::make($validated['password']),
            'status' => 'pending',
            'verification_code' => $verificationCode,
            'verification_code_expires_at' => now()->addMinutes(10),
            'email_verified' => false,
        ]);

        session(['vendor_application_email' => $validated['email']]);

        try {
            Mail::to($validated['email'])->send(
                new VendorVerificationCode($verificationCode, $validated['name'])
            );
        } catch (\Throwable $e) {
            // If email fails, delete the application and return an error
            $application->delete();

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

        $application = VendorApplication::where('email', session('vendor_application_email'))
            ->where('email_verified', false)
            ->where('verification_code_expires_at', '>', now())
            ->first();

        if (! $application) {
            return redirect()
                ->route('vendor.verify')
                ->with('error', 'Invalid or expired verification code. Please request a new one.');
        }

        if ($application->verification_code !== $request->input('code')) {
            return redirect()
                ->route('vendor.verify')
                ->with('error', 'Invalid verification code. Please try again.');
        }

        $application->update([
            'email_verified' => true,
            'email_verified_at' => now(),
            'verification_code' => null,
            'verification_code_expires_at' => null,
        ]);

        return redirect()
            ->route('vendor.apply')
            ->with('success', 'Email verified successfully! Your vendor application has been submitted and is now under review.');
    }

    public function resendCode(Request $request): RedirectResponse
    {
        $application = VendorApplication::where('email', session('vendor_application_email'))
            ->where('email_verified', false)
            ->first();

        if (! $application) {
            return redirect()
                ->route('vendor.apply')
                ->with('error', 'No pending application found. Please submit a new application.');
        }

        $verificationCode = (string) random_int(100000, 999999);
        $application->update([
            'verification_code' => $verificationCode,
            'verification_code_expires_at' => now()->addMinutes(10),
        ]);

        try {
            Mail::to($application->email)->send(
                new VendorVerificationCode($verificationCode, $application->name)
            );
        } catch (\Throwable $e) {
            return redirect()
                ->back()
                ->with('error', 'We could not send the verification email. Please try again later.');
        }

        return redirect()
            ->route('vendor.verify')
            ->with('success', 'A new verification code has been sent to your email.');
    }
}