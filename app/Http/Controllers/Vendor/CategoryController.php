<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = Category::query()->latest('id');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->paginate(20)->withQueryString()->through(fn (Category $category) => [
            'id' => $category->id,
            'name' => $category->name,
            'status' => $category->status,
            'created_at' => $category->created_at?->format('Y-m-d H:i:s'),
        ]);

        return Inertia::render('Vendor/Categories/Index', [
            'categories' => $categories,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Vendor/Categories/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        Category::create($validated);

        return redirect()
            ->route('vendor.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Vendor/Categories/Edit', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'status' => $category->status,
            ],
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $category->update($validated);

        return redirect()
            ->route('vendor.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()
            ->route('vendor.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}

