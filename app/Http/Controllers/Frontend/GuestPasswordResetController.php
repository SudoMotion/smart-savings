<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Mail\GuestPasswordResetMail;
use App\Models\User;
use App\Support\MailDelivery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
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
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255'],
        ]);

        $email = $validated['email'];

        if (! User::query()->where('email', $email)->exists()) {
            throw ValidationException::withMessages([
                'email' => 'No account is registered with this email address.',
            ]);
        }

        $verificationCode = (string) random_int(100000, 999999);

        session([
            'guest_password_reset' => [
                'email' => $email,
                'verification_code' => $verificationCode,
                'verification_code_expires_at' => now()->addMinutes(10),
                'verified_at' => null,
            ],
        ]);

        $sent = MailDelivery::attempt(
            fn () => Mail::to($email)->send(
                new GuestPasswordResetMail($verificationCode, $email)
            ),
            'guest_password_reset'
        );

        if (! $sent) {
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
        if (! $resetData) {
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

        if (! $resetData) {
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

        if (! $resetData) {
            return redirect()
                ->route('guest.reset.password')
                ->with('error', 'Session expired. Please submit your email again.');
        }

        if (! User::query()->where('email', $resetData['email'])->exists()) {
            session()->forget('guest_password_reset');

            return redirect()
                ->route('guest.reset.password')
                ->with('error', 'No account is registered with this email address.');
        }

        $verificationCode = (string) random_int(100000, 999999);
        $resetData['verification_code'] = $verificationCode;
        $resetData['verification_code_expires_at'] = now()->addMinutes(10);
        session(['guest_password_reset' => $resetData]);

        $sent = MailDelivery::attempt(
            fn () => Mail::to($resetData['email'])->send(
                new GuestPasswordResetMail($verificationCode, $resetData['email'])
            ),
            'guest_password_reset_resend'
        );

        if (! $sent) {
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
        if (! $resetData || ! $resetData['verified_at']) {
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
        if (! $resetData || ! $resetData['verified_at']) {
            return redirect()
                ->route('guest.reset.verify')
                ->with('error', 'Please verify your code before setting a new password.');
        }

        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $email = $resetData['email'];
        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            session()->forget('guest_password_reset');

            return redirect()
                ->route('guest.reset.password')
                ->with('error', 'No account is registered with this email address.');
        }

        $user->forceFill([
            'password' => Hash::make($request->password),
        ])->save();

        session()->forget('guest_password_reset');

        return redirect()
            ->route('guest.reset.password')
            ->with('success', 'Password reset successfully!');
    }
}
