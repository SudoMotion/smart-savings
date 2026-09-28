<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Subsubcategory;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function brands(Request $request): Response
    {
        $search = $request->query('search');

        $query = Brand::query()->where('status', 'active')->orderBy('name');
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $brands = $query->paginate(24)->withQueryString();

        return Inertia::render('Vendor/Catalog/Brands', [
            'brands' => $brands,
            'filters' => ['search' => $search],
        ]);
    }

    public function categories(Request $request): Response
    {
        $search = $request->query('search');

        $query = Category::query()->where('status', 'active')->orderBy('name');
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->paginate(24)->withQueryString();

        return Inertia::render('Vendor/Catalog/Categories', [
            'categories' => $categories,
            'filters' => ['search' => $search],
        ]);
    }

    public function subcategories(Request $request): Response
    {
        $search = $request->query('search');

        $query = Subcategory::query()
            ->with('category:id,name')
            ->where('status', 'active')
            ->orderBy('name');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('category', fn ($q) => $q->where('name', 'like', "%{$search}%"));
        }

        $subcategories = $query->paginate(24)->withQueryString();

        return Inertia::render('Vendor/Catalog/Subcategories', [
            'subcategories' => $subcategories,
            'filters' => ['search' => $search],
        ]);
    }

    public function subsubcategories(Request $request): Response
    {
        $search = $request->query('search');

        $query = Subsubcategory::query()
            ->with(['subcategory:id,name,category_id', 'subcategory.category:id,name'])
            ->where('status', 'active')
            ->orderBy('name');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('subcategory', fn ($q) => $q->where('name', 'like', "%{$search}%"));
        }

        $subsubcategories = $query->paginate(24)->withQueryString();

        return Inertia::render('Vendor/Catalog/Subsubcategories', [
            'subsubcategories' => $subsubcategories,
            'filters' => ['search' => $search],
        ]);
    }

    public function units(Request $request): Response
    {
        $search = $request->query('search');

        $query = Unit::query()->where('status', 'active')->orderBy('name');
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $units = $query->paginate(24)->withQueryString();

        return Inertia::render('Vendor/Catalog/Units', [
            'units' => $units,
            'filters' => ['search' => $search],
        ]);
    }

    public function attributes(Request $request): Response
    {
        $search = $request->query('search');

        $query = Attribute::query()->where('status', 'active')->orderBy('name');
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $attributes = $query->paginate(24)->withQueryString();

        return Inertia::render('Vendor/Catalog/Attributes', [
            'attributes' => $attributes,
            'filters' => ['search' => $search],
        ]);
    }
}

