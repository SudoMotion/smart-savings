<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Attribute;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductImage;
use App\Models\Subcategory;
use App\Models\Subsubcategory;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Products/Index');
        $products = Product::query()
            ->with(['category:id,name', 'brand:id,name', 'unit:id,name'])
            ->latest('id')
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'code' => $product->code,
                'sku' => $product->sku,
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'category_name' => $product->category?->name ?? '—',
                'brand_name' => $product->brand?->name ?? '—',
                'unit_name' => $product->unit?->name ?? '—',
                'status' => $product->status,
                'image_url' => $product->image_url,
                'created_at' => $product->created_at?->format('Y-m-d H:i:s'),
            ]);

        $user = auth()->user();
        $isSuperAdmin = $user?->hasRole(\App\Support\Permissions::SUPERADMIN_ROLE) ?? false;
        $hasView = $user?->can('products.view') ?? true;

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'can' => [
                'create' => $isSuperAdmin || $user?->can('products.create') || $hasView,
                'edit' => $isSuperAdmin || $user?->can('products.edit') || $hasView,
                'delete' => $isSuperAdmin || $user?->can('products.delete') || $hasView,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create', $this->getFormData());
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $data = $request->safe()->except(['image', 'additional_images', 'attributes']);

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('products', 'public');
            }

            /** @var Product $product */
            $product = Product::create($data);

            if ($request->hasFile('additional_images')) {
                foreach ($request->file('additional_images') as $file) {
                    $path = $file->store('products/gallery', 'public');
                    $product->images()->create(['image_path' => $path]);
                }
            }

            if ($request->filled('attributes')) {
                foreach ($request->input('attributes', []) as $attr) {
                    if (!empty($attr['attribute_id']) && isset($attr['value']) && trim($attr['value']) !== '') {
                        $product->attributes()->create([
                            'attribute_id' => $attr['attribute_id'],
                            'value' => trim($attr['value']),
                        ]);
                    }
                }
            }
        });

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        $product->load(['images', 'attributes']);

        return Inertia::render('Admin/Products/Edit', array_merge($this->getFormData(), [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'code' => $product->code ?? '',
                'sku' => $product->sku ?? '',
                'category_id' => $product->category_id ? (string) $product->category_id : '',
                'subcategory_id' => $product->subcategory_id ? (string) $product->subcategory_id : '',
                'subsubcategory_id' => $product->subsubcategory_id ? (string) $product->subsubcategory_id : '',
                'brand_id' => $product->brand_id ? (string) $product->brand_id : '',
                'unit_id' => $product->unit_id ? (string) $product->unit_id : '',
                'price' => (string) $product->price,
                'discount_type' => $product->discount_type ?? '',
                'discount_value' => (string) ($product->discount_value ?? 0),
                'stock' => (int) $product->stock,
                'alert_quantity' => (int) ($product->alert_quantity ?? 0),
                'short_description' => $product->short_description ?? '',
                'description' => $product->description ?? '',
                'status' => $product->status,
                'image_url' => $product->image_url,
            ],
            'existingImages' => $product->images->map(fn (ProductImage $img) => [
                'id' => $img->id,
                'url' => $img->image_url,
            ])->values()->all(),
            'existingAttributes' => $product->attributes->map(fn (ProductAttribute $attr) => [
                'attribute_id' => (string) $attr->attribute_id,
                'value' => $attr->value,
            ])->values()->all(),
        ]));
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        DB::transaction(function () use ($request, $product) {
            $data = $request->safe()->except([
                'image',
                'additional_images',
                'deleted_image_ids',
                'attributes',
            ]);

            if ($request->hasFile('image')) {
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }
                $data['image'] = $request->file('image')->store('products', 'public');
            }

            $product->update($data);

            if ($request->filled('deleted_image_ids')) {
                $imagesToDelete = ProductImage::where('product_id', $product->id)
                    ->whereIn('id', $request->input('deleted_image_ids'))
                    ->get();

                foreach ($imagesToDelete as $img) {
                    Storage::disk('public')->delete($img->image_path);
                    $img->delete();
                }
            }

            if ($request->hasFile('additional_images')) {
                foreach ($request->file('additional_images') as $file) {
                    $path = $file->store('products/gallery', 'public');
                    $product->images()->create(['image_path' => $path]);
                }
            }

            // Sync attributes
            $product->attributes()->delete();
            if ($request->filled('attributes')) {
                foreach ($request->input('attributes', []) as $attr) {
                    if (!empty($attr['attribute_id']) && isset($attr['value']) && trim($attr['value']) !== '') {
                        $product->attributes()->create([
                            'attribute_id' => $attr['attribute_id'],
                            'value' => trim($attr['value']),
                        ]);
                    }
                }
            }
        });

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        foreach ($product->images as $img) {
            Storage::disk('public')->delete($img->image_path);
        }

        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    private function getFormData(): array
    {
        return [
            'categoryOptions' => Category::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Category $c) => ['value' => (string) $c->id, 'label' => $c->name])
                ->values()
                ->all(),
            'subcategoryOptions' => Subcategory::query()
                ->orderBy('name')
                ->get(['id', 'name', 'category_id'])
                ->map(fn (Subcategory $s) => [
                    'value' => (string) $s->id,
                    'label' => $s->name,
                    'category_id' => (string) $s->category_id,
                ])
                ->values()
                ->all(),
            'subsubcategoryOptions' => Subsubcategory::query()
                ->orderBy('name')
                ->get(['id', 'name', 'subcategory_id'])
                ->map(fn (Subsubcategory $ss) => [
                    'value' => (string) $ss->id,
                    'label' => $ss->name,
                    'subcategory_id' => (string) $ss->subcategory_id,
                ])
                ->values()
                ->all(),
            'brandOptions' => Brand::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Brand $b) => ['value' => (string) $b->id, 'label' => $b->name])
                ->values()
                ->all(),
            'unitOptions' => Unit::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Unit $u) => ['value' => (string) $u->id, 'label' => $u->name])
                ->values()
                ->all(),
            'attributeOptions' => Attribute::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Attribute $a) => ['value' => (string) $a->id, 'label' => $a->name])
                ->values()
                ->all(),
        ];
    }
}

