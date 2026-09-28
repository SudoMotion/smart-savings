<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $vendor = $request->user()->vendor;
        $search = $request->query('search');

        // Vendor ONLY views their own products!
        $query = Product::query()
            ->where('vendor_id', $vendor?->id)
            ->with(['category:id,name', 'brand:id,name', 'unit:id,name'])
            ->latest('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $products = $query->paginate(15)->withQueryString()->through(fn (Product $product) => [
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
            'created_at' => $product->created_at?->format('Y-m-d'),
        ]);

        return Inertia::render('Vendor/Products/Index', [
            'products' => $products,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Vendor/Products/Create', $this->getFormData());
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $vendor = $user->vendor;

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:100'],
            'sku' => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'exists:subcategories,id'],
            'subsubcategory_id' => ['nullable', 'exists:subsubcategories,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'unit_id' => ['nullable', 'exists:units,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_type' => ['nullable', 'in:percentage,fixed'],
            'discount_value' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'alert_quantity' => ['nullable', 'integer', 'min:0'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'additional_images' => ['nullable', 'array'],
            'additional_images.*' => ['image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'attributes' => ['nullable', 'array'],
            'attributes.*.attribute_id' => ['nullable', 'exists:attributes,id'],
            'attributes.*.value' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($request, $validated, $vendor, $user) {
            $data = $validated;
            unset($data['image'], $data['additional_images'], $data['attributes']);

            $data['vendor_id'] = $vendor->id;
            $data['user_id'] = $user->id;
            $data['stock'] = $data['stock'] ?? 0;
            $data['alert_quantity'] = $data['alert_quantity'] ?? 0;
            $data['discount_value'] = $data['discount_value'] ?? 0;

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

            if (!empty($validated['attributes'])) {
                foreach ($validated['attributes'] as $attr) {
                    if (!empty($attr['attribute_id']) && !empty(trim($attr['value'] ?? ''))) {
                        $product->attributes()->create([
                            'attribute_id' => $attr['attribute_id'],
                            'value' => trim($attr['value']),
                        ]);
                    }
                }
            }
        });

        return redirect()
            ->route('vendor.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Request $request, Product $product): Response
    {
        $vendor = $request->user()->vendor;

        // Vendor can ONLY edit their own product!
        if ($product->vendor_id !== $vendor?->id) {
            abort(403, 'Unauthorized. You can only edit your own products.');
        }

        $product->load(['images', 'attributes']);

        return Inertia::render('Vendor/Products/Edit', array_merge($this->getFormData(), [
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

    public function update(Request $request, Product $product): RedirectResponse
    {
        $vendor = $request->user()->vendor;

        // Vendor can ONLY update their own product!
        if ($product->vendor_id !== $vendor?->id) {
            abort(403, 'Unauthorized. You can only update your own products.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:100'],
            'sku' => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'exists:subcategories,id'],
            'subsubcategory_id' => ['nullable', 'exists:subsubcategories,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'unit_id' => ['nullable', 'exists:units,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_type' => ['nullable', 'in:percentage,fixed'],
            'discount_value' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'alert_quantity' => ['nullable', 'integer', 'min:0'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'additional_images' => ['nullable', 'array'],
            'additional_images.*' => ['image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'deleted_image_ids' => ['nullable', 'array'],
            'deleted_image_ids.*' => ['integer'],
            'attributes' => ['nullable', 'array'],
            'attributes.*.attribute_id' => ['nullable', 'exists:attributes,id'],
            'attributes.*.value' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($request, $validated, $product) {
            $data = $validated;
            unset($data['image'], $data['additional_images'], $data['deleted_image_ids'], $data['attributes']);

            $data['stock'] = $data['stock'] ?? 0;
            $data['alert_quantity'] = $data['alert_quantity'] ?? 0;
            $data['discount_value'] = $data['discount_value'] ?? 0;

            if ($request->hasFile('image')) {
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }
                $data['image'] = $request->file('image')->store('products', 'public');
            }

            $product->update($data);

            if (!empty($validated['deleted_image_ids'])) {
                $imagesToDelete = ProductImage::where('product_id', $product->id)
                    ->whereIn('id', $validated['deleted_image_ids'])
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

            $product->attributes()->delete();
            if (!empty($validated['attributes'])) {
                foreach ($validated['attributes'] as $attr) {
                    if (!empty($attr['attribute_id']) && !empty(trim($attr['value'] ?? ''))) {
                        $product->attributes()->create([
                            'attribute_id' => $attr['attribute_id'],
                            'value' => trim($attr['value']),
                        ]);
                    }
                }
            }
        });

        return redirect()
            ->route('vendor.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $vendor = $request->user()->vendor;

        // Vendor can ONLY delete their own product!
        if ($product->vendor_id !== $vendor?->id) {
            abort(403, 'Unauthorized. You can only delete your own products.');
        }

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        foreach ($product->images as $img) {
            Storage::disk('public')->delete($img->image_path);
        }

        $product->delete();

        return redirect()
            ->route('vendor.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    private function getFormData(): array
    {
        return [
            'categoryOptions' => Category::query()
                ->where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Category $c) => ['value' => (string) $c->id, 'label' => $c->name])
                ->values()
                ->all(),
            'subcategoryOptions' => Subcategory::query()
                ->where('status', 'active')
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
                ->where('status', 'active')
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
                ->where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Brand $b) => ['value' => (string) $b->id, 'label' => $b->name])
                ->values()
                ->all(),
            'unitOptions' => Unit::query()
                ->where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Unit $u) => ['value' => (string) $u->id, 'label' => $u->name])
                ->values()
                ->all(),
            'attributeOptions' => Attribute::query()
                ->where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Attribute $a) => ['value' => (string) $a->id, 'label' => $a->name])
                ->values()
                ->all(),
        ];
    }
}

