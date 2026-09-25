<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAttributeRequest;
use App\Http\Requests\Admin\UpdateAttributeRequest;
use App\Models\Attribute;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AttributeController extends Controller
{
    public function index(): Response
    {
        $attributes = Attribute::query()
            ->latest('id')
            ->get()
            ->map(fn (Attribute $attribute) => [
                'id' => $attribute->id,
                'name' => $attribute->name,
                'status' => $attribute->status,
                'created_at' => $attribute->created_at?->format('Y-m-d H:i:s'),
            ]);

        return Inertia::render('Admin/Attributes/Index', [
            'attributes' => $attributes,
            'can' => [
                'create' => auth()->user()?->can('attributes.create') ?? false,
                'edit' => auth()->user()?->can('attributes.edit') ?? false,
                'delete' => auth()->user()?->can('attributes.delete') ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Attributes/Create');
    }

    public function store(StoreAttributeRequest $request): RedirectResponse
    {
        Attribute::create($request->validated());

        return redirect()
            ->route('admin.attributes.index')
            ->with('success', 'Attribute created successfully.');
    }

    public function edit(Attribute $attribute): Response
    {
        return Inertia::render('Admin/Attributes/Edit', [
            'attribute' => [
                'id' => $attribute->id,
                'name' => $attribute->name,
                'status' => $attribute->status,
            ],
        ]);
    }

    public function update(UpdateAttributeRequest $request, Attribute $attribute): RedirectResponse
    {
        $attribute->update($request->validated());

        return redirect()
            ->route('admin.attributes.index')
            ->with('success', 'Attribute updated successfully.');
    }

    public function destroy(Attribute $attribute): RedirectResponse
    {
        $attribute->delete();

        return redirect()
            ->route('admin.attributes.index')
            ->with('success', 'Attribute deleted successfully.');
    }
}

