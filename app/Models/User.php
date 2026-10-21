<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserType;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password', 'percentage', 'user_type'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

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

    public function isRegular(): bool
    {
        return $this->userType()->canProcessOrders();
    }

    public function isDiamond(): bool
    {
        return $this->userType() === UserType::DiamondMember;
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
}
