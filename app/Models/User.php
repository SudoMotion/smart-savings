<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserType;
use App\Support\Permissions;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password', 'profile_photo_path', 'percentage', 'user_type', 'referred_by_user_id', 'referral_code'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * @var list<string>
     */
    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'percentage' => 'decimal:2',
            'user_type' => UserType::class,
        ];
    }

    protected function profilePhotoUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->profile_photo_path
                ? Storage::disk('public')->url($this->profile_photo_path)
                : null,
        );
    }

    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    public function ensureWallet(): Wallet
    {
        /** @var Wallet $wallet */
        $wallet = $this->wallet()->firstOrCreate([], ['balance' => 0]);

        return $wallet;
    }

    public function earningWallet(): HasOne
    {
        return $this->hasOne(EarningWallet::class);
    }

    public function ensureEarningWallet(): EarningWallet
    {
        /** @var EarningWallet $wallet */
        $wallet = $this->earningWallet()->firstOrCreate([], ['balance' => 0]);

        return $wallet;
    }

    public function userType(): UserType
    {
        return $this->user_type ?? UserType::GoldMember;
    }

    public function canLogin(): bool
    {
        return $this->userType()->canLogin();
    }

    public function isStaffAccount(): bool
    {
        return $this->hasRole(Permissions::SUPERADMIN_ROLE) || $this->roles()->exists();
    }

    public function canAccessAdminPanel(): bool
    {
        return $this->hasRole(Permissions::SUPERADMIN_ROLE) || $this->can('dashboard.view');
    }

    /**
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeExcludingStaffAccounts(Builder $query): Builder
    {
        return $query->whereDoesntHave('roles');
    }

    public function isRegular(): bool
    {
        return $this->userType()->canProcessOrders();
    }

    /**
     * Whether the customer uses the event portal (all active accounts; not tied to user_type).
     */
    public function isDiamond(): bool
    {
        return $this->userType()->canLogin();
    }

    public function customerOrders(): HasMany
    {
        return $this->hasMany(CustomerOrder::class);
    }

    public function vendor(): HasOne
    {
        return $this->hasOne(Vendor::class);
    }

    public function vendorApplications(): HasMany
    {
        return $this->hasMany(VendorApplication::class);
    }

    public function depositRequests(): HasMany
    {
        return $this->hasMany(DepositRequest::class);
    }

    public function withdrawRequests(): HasMany
    {
        return $this->hasMany(WithdrawRequest::class);
    }

    public function orderLimit(): HasOne
    {
        return $this->hasOne(UserOrderLimit::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(UserEvent::class)->latest('id');
    }

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_by_user_id');
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(User::class, 'referred_by_user_id');
    }

    public function referralRewardsEarned(): HasMany
    {
        return $this->hasMany(ReferralReward::class, 'referrer_user_id');
    }
}
