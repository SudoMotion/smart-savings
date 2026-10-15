<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Vendor;
use App\Support\Permissions;
use App\Support\SiteData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user && $this->isStorefrontCustomer($user)) {
            return redirect()->route('account.dashboard');
        }

        $search = $request->query('search');
        $categoryId = $request->query('category');
        $brandId = $request->query('brand');
        $vendorId = $request->query('vendor');
        $sort = $request->query('sort', 'featured');

        $query = Product::with(['category', 'brand', 'vendor'])
            ->where('status', 'active');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhereHas('vendor', function ($vq) use ($search) {
                        $vq->where('shop_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('category', function ($cq) use ($search) {
                        $cq->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('brand', function ($bq) use ($search) {
                        $bq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($brandId) {
            $query->where('brand_id', $brandId);
        }

        if ($vendorId) {
            $query->where('vendor_id', $vendorId);
        }

        match ($sort) {
            'newest' => $query->latest('id'),
            default => $query->latest('id'),
        };

        $products = $query->paginate(20)->withQueryString();

        // Today's Deals (discounted items or top picks)
        $deals = Product::with(['category', 'brand', 'vendor'])
            ->where('status', 'active')
            ->where('discount_value', '>', 0)
            ->latest('id')
            ->take(8)
            ->get();

        // If not enough discounted deals, supplement with recent active products
        if ($deals->count() < 4) {
            $extra = Product::with(['category', 'brand', 'vendor'])
                ->where('status', 'active')
                ->whereNotIn('id', $deals->pluck('id'))
                ->latest('id')
                ->take(8 - $deals->count())
                ->get();
            $deals = $deals->concat($extra);
        }

        // Active Categories
        $categories = Category::where('status', 'active')
            ->withCount(['products' => fn ($q) => $q->where('status', 'active')])
            ->get();

        // Active Brands
        $brands = Brand::where('status', 'active')
            ->withCount(['products' => fn ($q) => $q->where('status', 'active')])
            ->get();

        // Active Vendors with shop details
        $vendors = Vendor::where('status', 'active')
            ->withCount(['products' => fn ($q) => $q->where('status', 'active')])
            ->get();

        return Inertia::render('Frontend/Home/Index', [
            'products' => $products,
            'deals' => $deals,
            'categories' => $categories,
            'brands' => $brands,
            'vendors' => $vendors,
            'filters' => [
                'search' => $search ?? '',
                'category' => $categoryId ?? '',
                'brand' => $brandId ?? '',
                'vendor' => $vendorId ?? '',
                'sort' => $sort,
            ],
            'aboutUs' => SiteData::aboutUs(),
        ]);
    }

    private function isStorefrontCustomer(User $user): bool
    {
        if ($user->hasRole(Permissions::SUPERADMIN_ROLE) || $user->can('dashboard.view')) {
            return false;
        }

        return ! $user->vendor()->exists();
    }
}
