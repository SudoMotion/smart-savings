<?php

use App\Http\Controllers\Customer\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Customer\Auth\RegisteredUserController;
use App\Http\Controllers\Customer\CustomerOrderController;
use App\Http\Controllers\Customer\DashboardController;
use App\Http\Controllers\Customer\DepositController;
use App\Http\Controllers\Customer\OrderLogController;
use App\Http\Controllers\Customer\PercentageController;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Customer\ReferralController;
use App\Http\Controllers\Customer\WithdrawController;
use Illuminate\Support\Facades\Route;

Route::prefix('account')->name('account.')->group(function () {
    Route::get('/', function () {
        return auth()->check()
            ? redirect()->route('account.dashboard')
            : redirect()->route('account.login');
    });

    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);

        Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
        Route::post('register', [RegisteredUserController::class, 'store']);
        Route::get('register/verify', [RegisteredUserController::class, 'verify'])->name('register.verify');
        Route::post('register/verify', [RegisteredUserController::class, 'verifyCode'])->name('register.verify.code');
        Route::post('register/verify/resend', [RegisteredUserController::class, 'resendCode'])->name('register.verify.resend');
    });

    Route::middleware('auth')->group(function () {
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('order-logs', [OrderLogController::class, 'index'])->name('order-logs');
        Route::post('orders/{product}/confirm', [CustomerOrderController::class, 'confirm'])->name('orders.confirm');
        Route::post('orders/{product}/reject', [CustomerOrderController::class, 'reject'])->name('orders.reject');
        Route::get('deposit', [DepositController::class, 'index'])->name('deposit');
        Route::post('deposit', [DepositController::class, 'store'])->name('deposit.store');
        Route::get('withdraw', [WithdrawController::class, 'index'])->name('withdraw');
        Route::post('withdraw', [WithdrawController::class, 'store'])->name('withdraw.store');
        Route::get('profile', [ProfileController::class, 'index'])->name('profile');
        Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::get('percentage', [PercentageController::class, 'index'])->name('percentage');
        Route::get('referral', [ReferralController::class, 'index'])->name('referral');
    });
});
