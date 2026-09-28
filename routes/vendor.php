<?php

use App\Http\Controllers\Vendor\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Vendor\DashboardController;
use Illuminate\Support\Facades\Route;

Route::prefix('vendor')->name('vendor.')->group(function () {
    Route::get('/', function () {
        return auth()->check()
            ? redirect()->route('vendor.dashboard')
            : redirect()->route('vendor.login');
    });

    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);
    });

    Route::middleware(['auth', 'vendor'])->group(function () {
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });
});

