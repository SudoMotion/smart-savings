<?php

use App\Http\Controllers\Admin\AboutUsController;
use App\Http\Controllers\Admin\AttributeController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DepositOptionController;
use App\Http\Controllers\Admin\DepositRequestController;
use App\Http\Controllers\Admin\OrderLimitController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SubcategoryController;
use App\Http\Controllers\Admin\SubsubcategoryController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserOrderLogController;
use App\Http\Controllers\Admin\VendorApplicationController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\VendorPermissionController;
use App\Http\Controllers\Admin\WithdrawRequestController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return auth()->check()
            ? redirect()->route('admin.dashboard')
            : redirect()->route('admin.login');
    })->name('index');

    Route::middleware('guest')->group(function () {
        Route::get('register', [RegisteredUserController::class, 'create'])
            ->name('register');

        Route::post('register', [RegisteredUserController::class, 'store']);

        Route::get('login', [AuthenticatedSessionController::class, 'create'])
            ->name('login');

        Route::post('login', [AuthenticatedSessionController::class, 'store']);

        Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
            ->name('password.request');

        Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
            ->name('password.email');

        Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
            ->name('password.reset');

        Route::post('reset-password', [NewPasswordController::class, 'store'])
            ->name('password.store');
    });

    Route::middleware('auth')->group(function () {
        Route::get('verify-email', EmailVerificationPromptController::class)
            ->name('verification.notice');

        Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
            ->middleware(['signed', 'throttle:6,1'])
            ->name('verification.verify');

        Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
            ->middleware('throttle:6,1')
            ->name('verification.send');

        Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
            ->name('password.confirm');

        Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

        Route::put('password', [PasswordController::class, 'update'])->name('password.update');

        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
            ->name('logout');
    });

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('Admin/Dashboard/Index');
        })->middleware('permission:dashboard.view')->name('dashboard');

        Route::middleware('permission:users.view')->group(function () {
            Route::get('users', [UserController::class, 'index'])->name('users.index');
            Route::get('users/create', [UserController::class, 'create'])
                ->middleware('permission:users.create')
                ->name('users.create');
            Route::post('users', [UserController::class, 'store'])
                ->middleware('permission:users.create')
                ->name('users.store');
            Route::get('users/{user}/order-logs', [UserOrderLogController::class, 'index'])
                ->name('users.order-logs');
            Route::get('users/{user}/edit', [UserController::class, 'edit'])
                ->middleware('permission:users.edit')
                ->name('users.edit');
            Route::put('users/{user}', [UserController::class, 'update'])
                ->middleware('permission:users.edit')
                ->name('users.update');
            Route::patch('users/{user}/percentage', [UserController::class, 'updatePercentage'])
                ->middleware('permission:users.edit')
                ->name('users.update-percentage');
            Route::delete('users/{user}', [UserController::class, 'destroy'])
                ->middleware('permission:users.delete')
                ->name('users.destroy');
        });

        Route::middleware('permission:roles.view')->group(function () {
            Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
            Route::get('roles/create', [RoleController::class, 'create'])
                ->middleware('permission:roles.create')
                ->name('roles.create');
            Route::post('roles', [RoleController::class, 'store'])
                ->middleware('permission:roles.create')
                ->name('roles.store');
            Route::get('roles/{role}/edit', [RoleController::class, 'edit'])
                ->middleware('permission:roles.edit')
                ->name('roles.edit');
            Route::put('roles/{role}', [RoleController::class, 'update'])
                ->middleware('permission:roles.edit')
                ->name('roles.update');
            Route::delete('roles/{role}', [RoleController::class, 'destroy'])
                ->middleware('permission:roles.delete')
                ->name('roles.destroy');
        });

        Route::middleware('permission:permissions.view')->group(function () {
            Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');
            Route::post('permissions', [PermissionController::class, 'update'])
                ->middleware('permission:permissions.update')
                ->name('permissions.update');
        });

        Route::middleware('permission:about-us.view')->group(function () {
            Route::get('about-us', [AboutUsController::class, 'index'])->name('about-us.index');
            Route::post('about-us', [AboutUsController::class, 'update'])
                ->middleware('permission:about-us.update')
                ->name('about-us.update');
        });

        Route::middleware('permission:settings.view')->group(function () {
            Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
            Route::post('settings', [SettingsController::class, 'update'])
                ->middleware('permission:settings.update')
                ->name('settings.update');
        });

        Route::middleware('permission:deposit-options.view')->group(function () {
            Route::get('deposit-options', [DepositOptionController::class, 'index'])->name('deposit-options.index');
            Route::get('deposit-options/create', [DepositOptionController::class, 'create'])
                ->middleware('permission:deposit-options.create')
                ->name('deposit-options.create');
            Route::post('deposit-options', [DepositOptionController::class, 'store'])
                ->middleware('permission:deposit-options.create')
                ->name('deposit-options.store');
            Route::get('deposit-options/{depositOption}/edit', [DepositOptionController::class, 'edit'])
                ->middleware('permission:deposit-options.edit')
                ->name('deposit-options.edit');
            Route::put('deposit-options/{depositOption}', [DepositOptionController::class, 'update'])
                ->middleware('permission:deposit-options.edit')
                ->name('deposit-options.update');
            Route::delete('deposit-options/{depositOption}', [DepositOptionController::class, 'destroy'])
                ->middleware('permission:deposit-options.delete')
                ->name('deposit-options.destroy');
        });

        Route::middleware('permission:deposit-requests.view')->group(function () {
            Route::get('deposit-requests', [DepositRequestController::class, 'index'])->name('deposit-requests.index');
            Route::post('deposit-requests/{depositRequest}/approve', [DepositRequestController::class, 'approve'])
                ->middleware('permission:deposit-requests.review')
                ->name('deposit-requests.approve');
            Route::post('deposit-requests/{depositRequest}/reject', [DepositRequestController::class, 'reject'])
                ->middleware('permission:deposit-requests.review')
                ->name('deposit-requests.reject');
        });

        Route::middleware('permission:withdraw-requests.view')->group(function () {
            Route::get('withdraw-requests', [WithdrawRequestController::class, 'index'])->name('withdraw-requests.index');
            Route::post('withdraw-requests/{withdrawRequest}/approve', [WithdrawRequestController::class, 'approve'])
                ->middleware('permission:withdraw-requests.review')
                ->name('withdraw-requests.approve');
            Route::post('withdraw-requests/{withdrawRequest}/reject', [WithdrawRequestController::class, 'reject'])
                ->middleware('permission:withdraw-requests.review')
                ->name('withdraw-requests.reject');
        });

        Route::middleware('permission:order-limits.view')->group(function () {
            Route::get('order-limits', [OrderLimitController::class, 'index'])->name('order-limits.index');
            Route::patch('order-limits/global', [OrderLimitController::class, 'updateGlobal'])
                ->middleware('permission:order-limits.update')
                ->name('order-limits.update-global');
            Route::get('order-limits/create', [OrderLimitController::class, 'create'])
                ->middleware('permission:order-limits.create')
                ->name('order-limits.create');
            Route::post('order-limits', [OrderLimitController::class, 'store'])
                ->middleware('permission:order-limits.create')
                ->name('order-limits.store');
            Route::get('order-limits/{userOrderLimit}/edit', [OrderLimitController::class, 'edit'])
                ->middleware('permission:order-limits.edit')
                ->name('order-limits.edit');
            Route::put('order-limits/{userOrderLimit}', [OrderLimitController::class, 'update'])
                ->middleware('permission:order-limits.edit')
                ->name('order-limits.update');
            Route::delete('order-limits/{userOrderLimit}', [OrderLimitController::class, 'destroy'])
                ->middleware('permission:order-limits.delete')
                ->name('order-limits.destroy');
        });

        Route::middleware('permission:brands.view')->group(function () {
            Route::get('brands', [BrandController::class, 'index'])->name('brands.index');
            Route::get('brands/create', [BrandController::class, 'create'])
                ->middleware('permission:brands.create')
                ->name('brands.create');
            Route::post('brands', [BrandController::class, 'store'])
                ->middleware('permission:brands.create')
                ->name('brands.store');
            Route::get('brands/{brand}/edit', [BrandController::class, 'edit'])
                ->middleware('permission:brands.edit')
                ->name('brands.edit');
            Route::put('brands/{brand}', [BrandController::class, 'update'])
                ->middleware('permission:brands.edit')
                ->name('brands.update');
            Route::delete('brands/{brand}', [BrandController::class, 'destroy'])
                ->middleware('permission:brands.delete')
                ->name('brands.destroy');
        });

        Route::middleware('permission:categories.view')->group(function () {
            Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
            Route::get('categories/create', [CategoryController::class, 'create'])
                ->middleware('permission:categories.create')
                ->name('categories.create');
            Route::post('categories', [CategoryController::class, 'store'])
                ->middleware('permission:categories.create')
                ->name('categories.store');
            Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])
                ->middleware('permission:categories.edit')
                ->name('categories.edit');
            Route::put('categories/{category}', [CategoryController::class, 'update'])
                ->middleware('permission:categories.edit')
                ->name('categories.update');
            Route::delete('categories/{category}', [CategoryController::class, 'destroy'])
                ->middleware('permission:categories.delete')
                ->name('categories.destroy');
        });

        Route::middleware('permission:subcategories.view')->group(function () {
            Route::get('subcategories', [SubcategoryController::class, 'index'])->name('subcategories.index');
            Route::get('subcategories/create', [SubcategoryController::class, 'create'])
                ->middleware('permission:subcategories.create')
                ->name('subcategories.create');
            Route::post('subcategories', [SubcategoryController::class, 'store'])
                ->middleware('permission:subcategories.create')
                ->name('subcategories.store');
            Route::get('subcategories/{subcategory}/edit', [SubcategoryController::class, 'edit'])
                ->middleware('permission:subcategories.edit')
                ->name('subcategories.edit');
            Route::put('subcategories/{subcategory}', [SubcategoryController::class, 'update'])
                ->middleware('permission:subcategories.edit')
                ->name('subcategories.update');
            Route::delete('subcategories/{subcategory}', [SubcategoryController::class, 'destroy'])
                ->middleware('permission:subcategories.delete')
                ->name('subcategories.destroy');
        });

        Route::middleware('permission:subsubcategories.view')->group(function () {
            Route::get('subsubcategories', [SubsubcategoryController::class, 'index'])->name('subsubcategories.index');
            Route::get('subsubcategories/create', [SubsubcategoryController::class, 'create'])
                ->middleware('permission:subsubcategories.create')
                ->name('subsubcategories.create');
            Route::post('subsubcategories', [SubsubcategoryController::class, 'store'])
                ->middleware('permission:subsubcategories.create')
                ->name('subsubcategories.store');
            Route::get('subsubcategories/{subsubcategory}/edit', [SubsubcategoryController::class, 'edit'])
                ->middleware('permission:subsubcategories.edit')
                ->name('subsubcategories.edit');
            Route::put('subsubcategories/{subsubcategory}', [SubsubcategoryController::class, 'update'])
                ->middleware('permission:subsubcategories.edit')
                ->name('subsubcategories.update');
            Route::delete('subsubcategories/{subsubcategory}', [SubsubcategoryController::class, 'destroy'])
                ->middleware('permission:subsubcategories.delete')
                ->name('subsubcategories.destroy');
        });

        Route::middleware('permission:units.view')->group(function () {
            Route::get('units', [UnitController::class, 'index'])->name('units.index');
            Route::get('units/create', [UnitController::class, 'create'])
                ->middleware('permission:units.create')
                ->name('units.create');
            Route::post('units', [UnitController::class, 'store'])
                ->middleware('permission:units.create')
                ->name('units.store');
            Route::get('units/{unit}/edit', [UnitController::class, 'edit'])
                ->middleware('permission:units.edit')
                ->name('units.edit');
            Route::put('units/{unit}', [UnitController::class, 'update'])
                ->middleware('permission:units.edit')
                ->name('units.update');
            Route::delete('units/{unit}', [UnitController::class, 'destroy'])
                ->middleware('permission:units.delete')
                ->name('units.destroy');
        });

        Route::middleware('permission:attributes.view')->group(function () {
            Route::get('attributes', [AttributeController::class, 'index'])->name('attributes.index');
            Route::get('attributes/create', [AttributeController::class, 'create'])
                ->middleware('permission:attributes.create')
                ->name('attributes.create');
            Route::post('attributes', [AttributeController::class, 'store'])
                ->middleware('permission:attributes.create')
                ->name('attributes.store');
            Route::get('attributes/{attribute}/edit', [AttributeController::class, 'edit'])
                ->middleware('permission:attributes.edit')
                ->name('attributes.edit');
            Route::put('attributes/{attribute}', [AttributeController::class, 'update'])
                ->middleware('permission:attributes.edit')
                ->name('attributes.update');
            Route::delete('attributes/{attribute}', [AttributeController::class, 'destroy'])
                ->middleware('permission:attributes.delete')
                ->name('attributes.destroy');
        });

        Route::middleware('permission:products.view')->group(function () {
            Route::get('products', [ProductController::class, 'index'])->name('products.index');
            Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
            Route::post('products', [ProductController::class, 'store'])->name('products.store');
            Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
            Route::match(['put', 'post'], 'products/{product}', [ProductController::class, 'update'])->name('products.update');
            Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
        });

        // Vendor Catalog Routes
        Route::middleware('permission:vendor-applications.view')->group(function () {
            Route::get('vendor-applications', [VendorApplicationController::class, 'index'])->name('vendor-applications.index');
            Route::post('vendor-applications/{vendorApplication}/approve', [VendorApplicationController::class, 'approve'])
                ->middleware('permission:vendor-applications.approve')
                ->name('vendor-applications.approve');
            Route::post('vendor-applications/{vendorApplication}/reject', [VendorApplicationController::class, 'reject'])
                ->middleware('permission:vendor-applications.reject')
                ->name('vendor-applications.reject');
            Route::delete('vendor-applications/{vendorApplication}', [VendorApplicationController::class, 'destroy'])
                ->middleware('permission:vendor-applications.delete')
                ->name('vendor-applications.destroy');
        });

        Route::middleware('permission:vendors.view')->group(function () {
            Route::get('vendors', [VendorController::class, 'index'])->name('vendors.index');
            Route::get('vendors/{vendor}/edit', [VendorController::class, 'edit'])
                ->middleware('permission:vendors.edit')
                ->name('vendors.edit');
            Route::match(['put', 'post'], 'vendors/{vendor}', [VendorController::class, 'update'])
                ->middleware('permission:vendors.edit')
                ->name('vendors.update');
            Route::post('vendors/{vendor}/toggle-status', [VendorController::class, 'toggleStatus'])
                ->middleware('permission:vendors.edit')
                ->name('vendors.toggle-status');
            Route::delete('vendors/{vendor}', [VendorController::class, 'destroy'])
                ->middleware('permission:vendors.delete')
                ->name('vendors.destroy');
        });

        Route::middleware('permission:vendor-permissions.manage')->group(function () {
            Route::get('vendor-permissions', [VendorPermissionController::class, 'index'])->name('vendor-permissions.index');
            Route::put('vendor-permissions', [VendorPermissionController::class, 'update'])->name('vendor-permissions.update');
        });
    });
});
