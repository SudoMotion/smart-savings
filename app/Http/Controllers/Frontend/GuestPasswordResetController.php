<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Mail\GuestPasswordResetMail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class GuestPasswordResetController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Guest/ResetPassword/Index');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        $email = $validated['email'];
        $verificationCode = (string) random_int(100000, 999999);

        session([
            'guest_password_reset' => [
                'email' => $email,
                'verification_code' => $verificationCode,
                'verification_code_expires_at' => now()->addMinutes(10),
                'verified_at' => null,
            ],
        ]);

        try {
            Mail::to($email)->send(
                new GuestPasswordResetMail($verificationCode, $email)
            );
        } catch (\Throwable $e) {
            session()->forget('guest_password_reset');
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'We could not send the verification email. Please try again later.');
        }

        return redirect()
            ->route('guest.reset.verify')
            ->with('success', 'A verification code has been sent to your email. Please verify to reset your password.');
    }

    public function verify(): Response
    {
        $resetData = session('guest_password_reset');
        if (!$resetData) {
            return redirect()
                ->route('guest.reset.password')
                ->with('error', 'Session expired. Please submit your email again.');
        }
        return Inertia::render('Guest/ResetPassword/Verify', [
            'email' => $resetData['email'],
        ]);
    }

    public function verifyCode(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $resetData = session('guest_password_reset');

        if (!$resetData) {
            return redirect()
                ->route('guest.reset.password')
                ->with('error', 'Session expired. Please submit your email again.');
        }

        if (now()->greaterThan($resetData['verification_code_expires_at'])) {
            return redirect()
                ->route('guest.reset.verify')
                ->with('error', 'Verification code has expired. Please request a new one.');
        }

        if ($resetData['verification_code'] !== $request->input('code')) {
            return redirect()
                ->route('guest.reset.verify')
                ->with('error', 'Invalid verification code. Please try again.');
        }

        $resetData['verified_at'] = now();
        session(['guest_password_reset' => $resetData]);

        return redirect()
            ->route('guest.reset.new')
            ->with('success', 'Code verified! You can now set a new password.');
    }

    public function resendCode(Request $request): RedirectResponse
    {
        $resetData = session('guest_password_reset');

        if (!$resetData) {
            return redirect()
                ->route('guest.reset.password')
                ->with('error', 'Session expired. Please submit your email again.');
        }

        $verificationCode = (string) random_int(100000, 999999);
        $resetData['verification_code'] = $verificationCode;
        $resetData['verification_code_expires_at'] = now()->addMinutes(10);
        session(['guest_password_reset' => $resetData]);

        try {
            Mail::to($resetData['email'])->send(
                new GuestPasswordResetMail($verificationCode, $resetData['email'])
            );
        } catch (\Throwable $e) {
            return redirect()
                ->back()
                ->with('error', 'We could not send the verification email. Please try again later.');
        }

        return redirect()
            ->route('guest.reset.verify')
            ->with('success', 'A new verification code has been sent to your email.');
    }

    public function newPassword(): Response
    {
        $resetData = session('guest_password_reset');
        if (!$resetData || !$resetData['verified_at']) {
            return redirect()
                ->route('guest.reset.verify')
                ->with('error', 'Please verify your code before setting a new password.');
        }
        return Inertia::render('Guest/ResetPassword/NewPassword', [
            'email' => $resetData['email'],
        ]);
    }

    public function finalStore(Request $request): RedirectResponse
    {
        $resetData = session('guest_password_reset');
        if (!$resetData || !$resetData['verified_at']) {
            return redirect()
                ->route('guest.reset.verify')
                ->with('error', 'Please verify your code before setting a new password.');
        }

        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $email = $resetData['email'];
        $user = User::where('email', $email)->first();

        if ($user) {
            $user->forceFill([
                'password' => Hash::make($request->password),
            ])->save();
        } else {
            User::create([
                'name' => $email,
                'email' => $email,
                'password' => Hash::make($request->password),
            ]);
        }

        session()->forget('guest_password_reset');

        return redirect()
            ->route('guest.reset.password')
            ->with('success', 'Password reset successfully!');
}
}
