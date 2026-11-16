<?php

use App\Http\Controllers\Vendor\AttributeController;
use App\Http\Controllers\Vendor\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Vendor\BrandController;
use App\Http\Controllers\Vendor\CategoryController;
use App\Http\Controllers\Vendor\DashboardController;
use App\Http\Controllers\Vendor\ProductController;
use App\Http\Controllers\Vendor\SubcategoryController;
use App\Http\Controllers\Vendor\SubsubcategoryController;
use App\Http\Controllers\Vendor\UnitController;
use App\Support\PortalGuard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::prefix('vendor')->name('vendor.')->group(function () {
    Route::get('/', function () {
        return Auth::guard(PortalGuard::VENDOR)->check()
            ? redirect()->route('vendor.dashboard')
            : redirect()->route('vendor.login');
    });

    Route::middleware('guest:vendor')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);
    });

    Route::middleware(['auth:vendor', 'vendor'])->group(function () {
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Global Catalog CRUD for Vendors
        Route::resource('brands', BrandController::class);
        Route::resource('categories', CategoryController::class);
        Route::resource('subcategories', SubcategoryController::class);
        Route::resource('subsubcategories', SubsubcategoryController::class);
        Route::resource('units', UnitController::class);
        Route::resource('attributes', AttributeController::class);

        // Vendor Products (Vendor-owned CRUD)
        Route::get('products', [ProductController::class, 'index'])->name('products.index');
        Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('products', [ProductController::class, 'store'])->name('products.store');
        Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        Route::match(['put', 'post'], 'products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    });
});
