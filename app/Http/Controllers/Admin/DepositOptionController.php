<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDepositOptionRequest;
use App\Http\Requests\Admin\UpdateDepositOptionRequest;
use App\Models\DepositOption;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DepositOptionController extends Controller
{
    public function index(): Response
    {
        $depositOptions = DepositOption::query()
            ->latest('id')
            ->get()
            ->map(fn (DepositOption $option) => [
                'id' => $option->id,
                'coin_type' => $option->coin_type,
                'value' => $option->value,
                'status' => $option->status,
                'created_at' => $option->created_at?->format('Y-m-d H:i:s'),
            ]);

        return Inertia::render('Admin/DepositOptions/Index', [
            'depositOptions' => $depositOptions,
            'can' => [
                'create' => auth()->user()?->can('deposit-options.create') ?? false,
                'edit' => auth()->user()?->can('deposit-options.edit') ?? false,
                'delete' => auth()->user()?->can('deposit-options.delete') ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/DepositOptions/Create');
    }

    public function store(StoreDepositOptionRequest $request): RedirectResponse
    {
        DepositOption::create($request->validated());

        return redirect()
            ->route('admin.deposit-options.index')
            ->with('success', 'Deposit option created successfully.');
    }

    public function edit(DepositOption $depositOption): Response
    {
        return Inertia::render('Admin/DepositOptions/Edit', [
            'depositOption' => [
                'id' => $depositOption->id,
                'coin_type' => $depositOption->coin_type,
                'value' => $depositOption->value,
                'status' => $depositOption->status,
            ],
        ]);
    }

    public function update(UpdateDepositOptionRequest $request, DepositOption $depositOption): RedirectResponse
    {
        $depositOption->update($request->validated());

        return redirect()
            ->route('admin.deposit-options.index')
            ->with('success', 'Deposit option updated successfully.');
    }

    public function destroy(DepositOption $depositOption): RedirectResponse
    {
        $depositOption->delete();

        return redirect()
            ->route('admin.deposit-options.index')
            ->with('success', 'Deposit option deleted successfully.');
    }
}

