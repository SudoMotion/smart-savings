<?php

namespace App\Http\Controllers\Customer\Auth;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ReferralService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        private ReferralService $referralService,
    ) {}

    public function create(Request $request): Response
    {
        if ($request->filled('ref')) {
            $request->session()->put('referral_code', strtoupper((string) $request->query('ref')));
        }

        $referralCode = $request->session()->get('referral_code');
        $referrerName = null;

        if ($referralCode) {
            $referrer = $this->referralService->findReferrerByCode($referralCode);
            $referrerName = $referrer?->name;
        }

        return Inertia::render('Customer/Auth/Register', [
            'referralCode' => $referralCode,
            'referrerName' => $referrerName,
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

        $referralInput = $request->input('referral_code')
            ?? $request->session()->get('referral_code');

        $referrer = $this->referralService->assertValidReferralCode($referralInput);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => UserType::GoldMember,
            'referred_by_user_id' => $referrer?->id,
        ]);

        $this->referralService->ensureReferralCode($user);
        $request->session()->forget('referral_code');

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('account.dashboard', absolute: false));
    }
}
