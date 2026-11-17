<?php

namespace App\Http\Controllers\Customer\Auth;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Mail\CustomerRegistrationVerificationMail;
use App\Models\User;
use App\Services\ReferralService;
use App\Support\MailDelivery;
use App\Support\PortalGuard;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    private const SESSION_KEY = 'customer_registration_pending';

    public function __construct(
        private ReferralService $referralService,
    ) {}

    public function create(Request $request): Response
    {
        $referralCode = $request->filled('ref')
            ? strtoupper((string) $request->query('ref'))
            : null;

        $referrerName = null;

        if ($referralCode) {
            $referrer = $this->referralService->findReferrerByCode($referralCode);
            $referrerName = $referrer?->name;
        }

        return Inertia::render('Customer/Auth/Register', [
            'referralCode' => $referralCode,
            'referrerName' => $referrerName,
            'referralCodeFromQuery' => $request->filled('ref'),
        ]);
    }

    /**
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'referral_code' => ['nullable', 'string', 'max:16'],
        ]);

        $referralInput = $request->input('referral_code');
        $referrer = $this->referralService->assertValidReferralCode(
            is_string($referralInput) && trim($referralInput) !== '' ? $referralInput : null
        );

        $verificationCode = (string) random_int(100000, 999999);

        session([
            self::SESSION_KEY => [
                'name' => $request->string('name')->toString(),
                'email' => $request->string('email')->toString(),
                'password' => $request->string('password')->toString(),
                'referred_by_user_id' => $referrer?->id,
                'verification_code' => $verificationCode,
                'verification_code_expires_at' => now()->addMinutes(10),
            ],
        ]);

        $sent = MailDelivery::attempt(
            fn () => Mail::to($request->email)->send(
                new CustomerRegistrationVerificationMail(
                    $verificationCode,
                    $request->string('email')->toString(),
                    $request->string('name')->toString(),
                )
            ),
            'customer_registration'
        );

        if (! $sent) {
            session()->forget(self::SESSION_KEY);

            return redirect()
                ->back()
                ->withInput($request->except('password', 'password_confirmation'))
                ->with('error', 'We could not send the verification email. Please try again later.');
        }

        return redirect()
            ->route('account.register.verify')
            ->with('success', 'A verification code has been sent to your email.');
    }

    public function verify(Request $request): Response|RedirectResponse
    {
        $pending = session(self::SESSION_KEY);

        if (! $pending || ! isset($pending['email'])) {
            return redirect()
                ->route('account.register')
                ->with('error', 'Your registration session expired. Please sign up again.');
        }

        return Inertia::render('Customer/Auth/RegisterVerify', [
            'email' => $pending['email'],
        ]);
    }

    public function verifyCode(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $pending = session(self::SESSION_KEY);

        if (! $pending) {
            return redirect()
                ->route('account.register')
                ->with('error', 'Your registration session expired. Please sign up again.');
        }

        $expiresAt = $pending['verification_code_expires_at'] instanceof Carbon
            ? $pending['verification_code_expires_at']
            : Carbon::parse($pending['verification_code_expires_at']);

        if (now()->greaterThan($expiresAt)) {
            return redirect()
                ->route('account.register.verify')
                ->with('error', 'Verification code has expired. Please request a new one.');
        }

        if ($pending['verification_code'] !== $request->input('code')) {
            return redirect()
                ->route('account.register.verify')
                ->with('error', 'Invalid verification code. Please try again.');
        }

        if (User::query()->where('email', $pending['email'])->exists()) {
            session()->forget(self::SESSION_KEY);

            return redirect()
                ->route('account.register')
                ->with('error', 'This email is already registered. Please sign in instead.');
        }

        $user = User::query()->create([
            'name' => $pending['name'],
            'email' => $pending['email'],
            'password' => Hash::make($pending['password']),
            'user_type' => UserType::GoldMember,
            'referred_by_user_id' => $pending['referred_by_user_id'] ?? null,
        ]);

        $this->referralService->ensureReferralCode($user);
        session()->forget(self::SESSION_KEY);

        event(new Registered($user));
        Auth::guard(PortalGuard::CUSTOMER)->login($user);

        return redirect(route('home', absolute: false));
    }

    public function resendCode(Request $request): RedirectResponse
    {
        $pending = session(self::SESSION_KEY);

        if (! $pending) {
            return redirect()
                ->route('account.register')
                ->with('error', 'Your registration session expired. Please sign up again.');
        }

        if (User::query()->where('email', $pending['email'])->exists()) {
            session()->forget(self::SESSION_KEY);

            return redirect()
                ->route('account.register')
                ->with('error', 'This email is already registered. Please sign in instead.');
        }

        $verificationCode = (string) random_int(100000, 999999);
        $pending['verification_code'] = $verificationCode;
        $pending['verification_code_expires_at'] = now()->addMinutes(10);
        session([self::SESSION_KEY => $pending]);

        $sent = MailDelivery::attempt(
            fn () => Mail::to($pending['email'])->send(
                new CustomerRegistrationVerificationMail(
                    $verificationCode,
                    $pending['email'],
                    $pending['name'],
                )
            ),
            'customer_registration_resend'
        );

        if (! $sent) {
            return redirect()
                ->back()
                ->with('error', 'We could not send the verification email. Please try again later.');
        }

        return redirect()
            ->route('account.register.verify')
            ->with('success', 'A new verification code has been sent to your email.');
    }
}
