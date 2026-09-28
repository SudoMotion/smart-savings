<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Subsubcategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SubsubcategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = Subsubcategory::query()
            ->with(['category:id,name', 'subcategory:id,name'])
            ->latest('id');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('category', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                ->orWhereHas('subcategory', fn ($q) => $q->where('name', 'like', "%{$search}%"));
        }

        $subsubcategories = $query->paginate(20)->withQueryString()->through(fn (Subsubcategory $item) => [
            'id' => $item->id,
            'name' => $item->name,
            'category_id' => $item->category_id,
            'category_name' => $item->category?->name ?? '—',
            'subcategory_id' => $item->subcategory_id,
            'subcategory_name' => $item->subcategory?->name ?? '—',
            'status' => $item->status,
            'created_at' => $item->created_at?->format('Y-m-d H:i:s'),
        ]);

        return Inertia::render('Vendor/Subsubcategories/Index', [
            'subsubcategories' => $subsubcategories,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Vendor/Subsubcategories/Create', [
            'categoryOptions' => $this->getCategoryOptions(),
            'subcategoryOptions' => $this->getSubcategoryOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'subcategory_id' => ['required', 'exists:subcategories,id'],
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        Subsubcategory::create($validated);

        return redirect()
            ->route('vendor.subsubcategories.index')
            ->with('success', 'Sub-subcategory created successfully.');
    }

    public function edit(Subsubcategory $subsubcategory): Response
    {
        return Inertia::render('Vendor/Subsubcategories/Edit', [
            'subsubcategory' => [
                'id' => $subsubcategory->id,
                'category_id' => $subsubcategory->category_id,
                'subcategory_id' => $subsubcategory->subcategory_id,
                'name' => $subsubcategory->name,
                'status' => $subsubcategory->status,
            ],
            'categoryOptions' => $this->getCategoryOptions(),
            'subcategoryOptions' => $this->getSubcategoryOptions(),
        ]);
    }

    public function update(Request $request, Subsubcategory $subsubcategory): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'subcategory_id' => ['required', 'exists:subcategories,id'],
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $subsubcategory->update($validated);

        return redirect()
            ->route('vendor.subsubcategories.index')
            ->with('success', 'Sub-subcategory updated successfully.');
    }

    public function destroy(Subsubcategory $subsubcategory): RedirectResponse
    {
        $subsubcategory->delete();

        return redirect()
            ->route('vendor.subsubcategories.index')
            ->with('success', 'Sub-subcategory deleted successfully.');
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

    private function getSubcategoryOptions(): array
    {
        return Subcategory::query()
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'category_id'])
            ->map(fn (Subcategory $subcategory) => [
                'value' => (string) $subcategory->id,
                'label' => $subcategory->name,
                'category_id' => (string) $subcategory->category_id,
            ])
            ->values()
            ->all();
    }
}

