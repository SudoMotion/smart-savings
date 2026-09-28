<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = Unit::query()->latest('id');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $units = $query->paginate(20)->withQueryString()->through(fn (Unit $unit) => [
            'id' => $unit->id,
            'name' => $unit->name,
            'status' => $unit->status,
            'created_at' => $unit->created_at?->format('Y-m-d H:i:s'),
        ]);

        return Inertia::render('Vendor/Units/Index', [
            'units' => $units,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Vendor/Units/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        Unit::create($validated);

        return redirect()
            ->route('vendor.units.index')
            ->with('success', 'Unit created successfully.');
    }

    public function edit(Unit $unit): Response
    {
        return Inertia::render('Vendor/Units/Edit', [
            'unit' => [
                'id' => $unit->id,
                'name' => $unit->name,
                'status' => $unit->status,
            ],
        ]);
    }

    public function update(Request $request, Unit $unit): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $unit->update($validated);

        return redirect()
            ->route('vendor.units.index')
            ->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        $unit->delete();

        return redirect()
            ->route('vendor.units.index')
            ->with('success', 'Unit deleted successfully.');
    }
}

