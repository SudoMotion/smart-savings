<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSubcategoryRequest;
use App\Http\Requests\Admin\UpdateSubcategoryRequest;
use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SubcategoryController extends Controller
{
    public function index(): Response
    {
        $subcategories = Subcategory::query()
            ->with('category:id,name')
            ->latest('id')
            ->get()
            ->map(fn (Subcategory $subcategory) => [
                'id' => $subcategory->id,
                'name' => $subcategory->name,
                'category_id' => $subcategory->category_id,
                'category_name' => $subcategory->category?->name ?? '—',
                'status' => $subcategory->status,
                'created_at' => $subcategory->created_at?->format('Y-m-d H:i:s'),
            ]);

        return Inertia::render('Admin/Subcategories/Index', [
            'subcategories' => $subcategories,
            'can' => [
                'create' => auth()->user()?->can('subcategories.create') ?? false,
                'edit' => auth()->user()?->can('subcategories.edit') ?? false,
                'delete' => auth()->user()?->can('subcategories.delete') ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Subcategories/Create', [
            'categoryOptions' => $this->getCategoryOptions(),
        ]);
    }

    public function store(StoreSubcategoryRequest $request): RedirectResponse
    {
        Subcategory::create($request->validated());

        return redirect()
            ->route('admin.subcategories.index')
            ->with('success', 'Subcategory created successfully.');
    }

    public function edit(Subcategory $subcategory): Response
    {
        return Inertia::render('Admin/Subcategories/Edit', [
            'subcategory' => [
                'id' => $subcategory->id,
                'category_id' => $subcategory->category_id,
                'name' => $subcategory->name,
                'status' => $subcategory->status,
            ],
            'categoryOptions' => $this->getCategoryOptions(),
        ]);
    }

    public function update(UpdateSubcategoryRequest $request, Subcategory $subcategory): RedirectResponse
    {
        $subcategory->update($request->validated());

        return redirect()
            ->route('admin.subcategories.index')
            ->with('success', 'Subcategory updated successfully.');
    }

    public function destroy(Subcategory $subcategory): RedirectResponse
    {
        $subcategory->delete();

        return redirect()
            ->route('admin.subcategories.index')
            ->with('success', 'Subcategory deleted successfully.');
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
}

