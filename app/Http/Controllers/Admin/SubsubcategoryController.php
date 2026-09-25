<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSubsubcategoryRequest;
use App\Http\Requests\Admin\UpdateSubsubcategoryRequest;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Subsubcategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SubsubcategoryController extends Controller
{
    public function index(): Response
    {
        $subsubcategories = Subsubcategory::query()
            ->with(['category:id,name', 'subcategory:id,name'])
            ->latest('id')
            ->get()
            ->map(fn (Subsubcategory $item) => [
                'id' => $item->id,
                'name' => $item->name,
                'category_id' => $item->category_id,
                'category_name' => $item->category?->name ?? '—',
                'subcategory_id' => $item->subcategory_id,
                'subcategory_name' => $item->subcategory?->name ?? '—',
                'status' => $item->status,
                'created_at' => $item->created_at?->format('Y-m-d H:i:s'),
            ]);

        return Inertia::render('Admin/Subsubcategories/Index', [
            'subsubcategories' => $subsubcategories,
            'can' => [
                'create' => auth()->user()?->can('subsubcategories.create') ?? false,
                'edit' => auth()->user()?->can('subsubcategories.edit') ?? false,
                'delete' => auth()->user()?->can('subsubcategories.delete') ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Subsubcategories/Create', [
            'categoryOptions' => $this->getCategoryOptions(),
            'subcategoryOptions' => $this->getSubcategoryOptions(),
        ]);
    }

    public function store(StoreSubsubcategoryRequest $request): RedirectResponse
    {
        Subsubcategory::create($request->validated());

        return redirect()
            ->route('admin.subsubcategories.index')
            ->with('success', 'Sub-subcategory created successfully.');
    }

    public function edit(Subsubcategory $subsubcategory): Response
    {
        return Inertia::render('Admin/Subsubcategories/Edit', [
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

    public function update(UpdateSubsubcategoryRequest $request, Subsubcategory $subsubcategory): RedirectResponse
    {
        $subsubcategory->update($request->validated());

        return redirect()
            ->route('admin.subsubcategories.index')
            ->with('success', 'Sub-subcategory updated successfully.');
    }

    public function destroy(Subsubcategory $subsubcategory): RedirectResponse
    {
        $subsubcategory->delete();

        return redirect()
            ->route('admin.subsubcategories.index')
            ->with('success', 'Sub-subcategory deleted successfully.');
    }

    private function getCategoryOptions(): array
    {
        return Category::query()
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

