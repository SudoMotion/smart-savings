<?php

use App\Http\Controllers\Vendor\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Vendor\CatalogController;
use App\Http\Controllers\Vendor\DashboardController;
use App\Http\Controllers\Vendor\ProductController;
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

        // Product Catalog Master Data (read-only for vendors)
        Route::get('brands', [CatalogController::class, 'brands'])->name('brands.index');
        Route::get('categories', [CatalogController::class, 'categories'])->name('categories.index');
        Route::get('subcategories', [CatalogController::class, 'subcategories'])->name('subcategories.index');
        Route::get('subsubcategories', [CatalogController::class, 'subsubcategories'])->name('subsubcategories.index');
        Route::get('units', [CatalogController::class, 'units'])->name('units.index');
        Route::get('attributes', [CatalogController::class, 'attributes'])->name('attributes.index');

        // Vendor Products (Vendor-owned CRUD)
        Route::get('products', [ProductController::class, 'index'])->name('products.index');
        Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('products', [ProductController::class, 'store'])->name('products.store');
        Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        Route::match(['put', 'post'], 'products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    });
});

