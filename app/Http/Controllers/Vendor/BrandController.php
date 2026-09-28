<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = Brand::query()->latest('id');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $brands = $query->paginate(20)->withQueryString()->through(fn (Brand $brand) => [
            'id' => $brand->id,
            'name' => $brand->name,
            'status' => $brand->status,
            'created_at' => $brand->created_at?->format('Y-m-d H:i:s'),
        ]);

        return Inertia::render('Vendor/Brands/Index', [
            'brands' => $brands,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Vendor/Brands/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        Brand::create($validated);

        return redirect()
            ->route('vendor.brands.index')
            ->with('success', 'Brand created successfully.');
    }

    public function edit(Brand $brand): Response
    {
        return Inertia::render('Vendor/Brands/Edit', [
            'brand' => [
                'id' => $brand->id,
                'name' => $brand->name,
                'status' => $brand->status,
            ],
        ]);
    }

    public function update(Request $request, Brand $brand): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $brand->update($validated);

        return redirect()
            ->route('vendor.brands.index')
            ->with('success', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        $brand->delete();

        return redirect()
            ->route('vendor.brands.index')
            ->with('success', 'Brand deleted successfully.');
    }
}

