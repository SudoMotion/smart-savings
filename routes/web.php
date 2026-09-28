<?php

use App\Http\Controllers\Frontend\AboutController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\VendorApplicationController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/become-a-vendor', [VendorApplicationController::class, 'create'])->name('vendor.apply');
Route::post('/become-a-vendor', [VendorApplicationController::class, 'store'])->name('vendor.apply.store');

Route::redirect('/dashboard', '/admin/dashboard');
Route::redirect('/login', '/admin/login');
