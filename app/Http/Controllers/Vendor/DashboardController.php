<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $vendor = $user->vendor;

        $stats = [
            'total_products' => Product::count(),
            'active_products' => Product::where('status', 'active')->count(),
            'shop_status' => $vendor?->status ?? 'active',
        ];

        return Inertia::render('Vendor/Dashboard/Index', [
            'vendor' => $vendor ? [
                'id' => $vendor->id,
                'shop_name' => $vendor->shop_name,
                'shop_logo' => $vendor->shop_logo,
                'logo_url' => $vendor->logo_url,
                'phone' => $vendor->phone,
                'address' => $vendor->address,
                'status' => $vendor->status,
                'created_at' => $vendor->created_at->format('M d, Y'),
            ] : null,
            'stats' => $stats,
        ]);
    }
}

