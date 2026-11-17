<?php

use App\Http\Controllers\Customer\UserEventController;
use App\Http\Controllers\Frontend\AboutController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\GuestPasswordResetController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\VendorApplicationController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/become-a-vendor', [VendorApplicationController::class, 'create'])->name('vendor.apply');
Route::post('/become-a-vendor', [VendorApplicationController::class, 'store'])->name('vendor.apply.store');
Route::get('/become-a-vendor/verify', [VendorApplicationController::class, 'verify'])->name('vendor.verify');
Route::post('/become-a-vendor/verify', [VendorApplicationController::class, 'verifyCode'])->name('vendor.verify.code');
Route::post('/become-a-vendor/verify/resend', [VendorApplicationController::class, 'resendCode'])->name('vendor.verify.resend');

Route::middleware('auth:customer')->group(function () {
    Route::get('/event/{userEvent}', [UserEventController::class, 'show'])->name('event.show');
    Route::post('/event/{userEvent}/reveal', [UserEventController::class, 'revealSummary'])->name('event.reveal');
});

Route::redirect('/dashboard', '/account/dashboard');
Route::redirect('/login', '/account/login');
Route::redirect('/register', '/account/register');

Route::middleware('guest:customer')->group(function () {
    Route::get('/reset-password', [GuestPasswordResetController::class, 'create'])->name('guest.reset.password');
    Route::post('/reset-password', [GuestPasswordResetController::class, 'store'])->name('guest.reset.password.store');
    Route::get('/reset-password/verify', [GuestPasswordResetController::class, 'verify'])->name('guest.reset.verify');
    Route::post('/reset-password/verify', [GuestPasswordResetController::class, 'verifyCode'])->name('guest.reset.verify.code');
    Route::post('/reset-password/verify/resend', [GuestPasswordResetController::class, 'resendCode'])->name('guest.reset.verify.resend');
    Route::get('/reset-password/reset', [GuestPasswordResetController::class, 'newPassword'])->name('guest.reset.new');
    Route::post('/reset-password/store', [GuestPasswordResetController::class, 'finalStore'])->name('guest.reset.password.store.final');
});
