<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AttributeController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = Attribute::query()->latest('id');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $attributes = $query->paginate(20)->withQueryString()->through(fn (Attribute $attribute) => [
            'id' => $attribute->id,
            'name' => $attribute->name,
            'status' => $attribute->status,
            'created_at' => $attribute->created_at?->format('Y-m-d H:i:s'),
        ]);

        return Inertia::render('Vendor/Attributes/Index', [
            'attributes' => $attributes,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Vendor/Attributes/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        Attribute::create($validated);

        return redirect()
            ->route('vendor.attributes.index')
            ->with('success', 'Attribute created successfully.');
    }

    public function edit(Attribute $attribute): Response
    {
        return Inertia::render('Vendor/Attributes/Edit', [
            'attribute' => [
                'id' => $attribute->id,
                'name' => $attribute->name,
                'status' => $attribute->status,
            ],
        ]);
    }

    public function update(Request $request, Attribute $attribute): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $attribute->update($validated);

        return redirect()
            ->route('vendor.attributes.index')
            ->with('success', 'Attribute updated successfully.');
    }

    public function destroy(Attribute $attribute): RedirectResponse
    {
        $attribute->delete();

        return redirect()
            ->route('vendor.attributes.index')
            ->with('success', 'Attribute deleted successfully.');
    }
}

