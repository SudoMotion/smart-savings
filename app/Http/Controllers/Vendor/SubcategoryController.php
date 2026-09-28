<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SubcategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = Subcategory::query()->with('category:id,name')->latest('id');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('category', fn ($q) => $q->where('name', 'like', "%{$search}%"));
        }

        $subcategories = $query->paginate(20)->withQueryString()->through(fn (Subcategory $subcategory) => [
            'id' => $subcategory->id,
            'name' => $subcategory->name,
            'category_id' => $subcategory->category_id,
            'category_name' => $subcategory->category?->name ?? '—',
            'status' => $subcategory->status,
            'created_at' => $subcategory->created_at?->format('Y-m-d H:i:s'),
        ]);

        return Inertia::render('Vendor/Subcategories/Index', [
            'subcategories' => $subcategories,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Vendor/Subcategories/Create', [
            'categoryOptions' => $this->getCategoryOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        Subcategory::create($validated);

        return redirect()
            ->route('vendor.subcategories.index')
            ->with('success', 'Subcategory created successfully.');
    }

    public function edit(Subcategory $subcategory): Response
    {
        return Inertia::render('Vendor/Subcategories/Edit', [
            'subcategory' => [
                'id' => $subcategory->id,
                'category_id' => $subcategory->category_id,
                'name' => $subcategory->name,
                'status' => $subcategory->status,
            ],
            'categoryOptions' => $this->getCategoryOptions(),
        ]);
    }

    public function update(Request $request, Subcategory $subcategory): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $subcategory->update($validated);

        return redirect()
            ->route('vendor.subcategories.index')
            ->with('success', 'Subcategory updated successfully.');
    }

    public function destroy(Subcategory $subcategory): RedirectResponse
    {
        $subcategory->delete();

        return redirect()
            ->route('vendor.subcategories.index')
            ->with('success', 'Subcategory deleted successfully.');
    }

    private function getCategoryOptions(): array
    {
        return Category::query()
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Category $category) => [
                'value' => (string) $category->id,
                'label' => $category->name,
            ])
            ->values()
            ->all();
    }
}

