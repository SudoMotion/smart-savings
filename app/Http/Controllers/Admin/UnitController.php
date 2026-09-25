<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUnitRequest;
use App\Http\Requests\Admin\UpdateUnitRequest;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function index(): Response
    {
        $units = Unit::query()
            ->latest('id')
            ->get()
            ->map(fn (Unit $unit) => [
                'id' => $unit->id,
                'name' => $unit->name,
                'status' => $unit->status,
                'created_at' => $unit->created_at?->format('Y-m-d H:i:s'),
            ]);

        return Inertia::render('Admin/Units/Index', [
            'units' => $units,
            'can' => [
                'create' => auth()->user()?->can('units.create') ?? false,
                'edit' => auth()->user()?->can('units.edit') ?? false,
                'delete' => auth()->user()?->can('units.delete') ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Units/Create');
    }

    public function store(StoreUnitRequest $request): RedirectResponse
    {
        Unit::create($request->validated());

        return redirect()
            ->route('admin.units.index')
            ->with('success', 'Unit created successfully.');
    }

    public function edit(Unit $unit): Response
    {
        return Inertia::render('Admin/Units/Edit', [
            'unit' => [
                'id' => $unit->id,
                'name' => $unit->name,
                'status' => $unit->status,
            ],
        ]);
    }

    public function update(UpdateUnitRequest $request, Unit $unit): RedirectResponse
    {
        $unit->update($request->validated());

        return redirect()
            ->route('admin.units.index')
            ->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        $unit->delete();

        return redirect()
            ->route('admin.units.index')
            ->with('success', 'Unit deleted successfully.');
    }
}

