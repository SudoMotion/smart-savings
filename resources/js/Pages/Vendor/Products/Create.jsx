import { useMemo, useState } from 'react';
import VendorLayout from '@/Layouts/Vendor/VendorLayout';
import { Button, Card, Input, Select, Textarea } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

const discountTypeOptions = [
    { value: '', label: 'No Discount' },
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount ($)' },
];

export default function Create({
    categoryOptions = [],
    subcategoryOptions = [],
    subsubcategoryOptions = [],
    brandOptions = [],
    unitOptions = [],
    attributeOptions = [],
}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        sku: '',
        category_id: '',
        subcategory_id: '',
        subsubcategory_id: '',
        brand_id: '',
        unit_id: '',
        price: '',
        discount_type: '',
        discount_value: '',
        stock: '0',
        alert_quantity: '0',
        short_description: '',
        description: '',
        image: null,
        additional_images: [],
        attributes: [],
        status: 'active',
    });

    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [additionalPreviews, setAdditionalPreviews] = useState([]);

    const filteredSubcategories = useMemo(() => {
        if (!data.category_id) return [];
        return subcategoryOptions.filter(
            (sub) => String(sub.category_id) === String(data.category_id)
        );
    }, [data.category_id, subcategoryOptions]);

    const filteredSubsubcategories = useMemo(() => {
        if (!data.subcategory_id) return [];
        return subsubcategoryOptions.filter(
            (subsub) => String(subsub.subcategory_id) === String(data.subcategory_id)
        );
    }, [data.subcategory_id, subsubcategoryOptions]);

    const handleCategoryChange = (e) => {
        const catId = e.target.value;
        setData((prev) => ({
            ...prev,
            category_id: catId,
            subcategory_id: '',
            subsubcategory_id: '',
        }));
    };

    const handleSubcategoryChange = (e) => {
        const subId = e.target.value;
        setData((prev) => ({
            ...prev,
            subcategory_id: subId,
            subsubcategory_id: '',
        }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAdditionalImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setData('additional_images', [...data.additional_images, ...files]);
            const newPreviews = files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));
            setAdditionalPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeAdditionalImage = (index) => {
        const newImages = [...data.additional_images];
        newImages.splice(index, 1);
        setData('additional_images', newImages);

        const newPreviews = [...additionalPreviews];
        newPreviews.splice(index, 1);
        setAdditionalPreviews(newPreviews);
    };

    const addAttributeRow = () => {
        setData('attributes', [...data.attributes, { attribute_id: '', value: '' }]);
    };

    const updateAttributeRow = (index, field, val) => {
        const updated = [...data.attributes];
        updated[index] = { ...updated[index], [field]: val };
        setData('attributes', updated);
    };

    const removeAttributeRow = (index) => {
        const updated = [...data.attributes];
        updated.splice(index, 1);
        setData('attributes', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('vendor.products.store'), {
            forceFormData: true,
        });
    };

    return (
        <VendorLayout title="Add Product">
            <Head title="Add Product - Vendor Panel" />

            {/* Header */}
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('vendor.products.index')}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                            Add New Product
                        </h1>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                        Create a new product listing in your vendor store catalog.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* 1. Basic Information */}
                <Card title="Product Information">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Input
                                id="name"
                                label="Product Name"
                                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                                value={data.name}
                                error={errors.name}
                                required
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </div>

                        <Input
                            id="code"
                            label="Product Code"
                            placeholder="e.g. PRD-1024"
                            value={data.code}
                            error={errors.code}
                            onChange={(e) => setData('code', e.target.value)}
                        />

                        <Input
                            id="sku"
                            label="SKU"
                            placeholder="e.g. SKU-WH-1000XM5"
                            value={data.sku}
                            error={errors.sku}
                            onChange={(e) => setData('sku', e.target.value)}
                        />
                    </div>
                </Card>

                {/* 2. Categorization & Brand */}
                <Card title="Classification & Organization">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Select
                            id="category_id"
                            label="Category"
                            placeholder="Select category"
                            value={data.category_id}
                            error={errors.category_id}
                            options={categoryOptions}
                            onChange={handleCategoryChange}
                        />

                        <Select
                            id="subcategory_id"
                            label="Subcategory"
                            placeholder={data.category_id ? 'Select subcategory' : 'Select category first'}
                            value={data.subcategory_id}
                            error={errors.subcategory_id}
                            options={filteredSubcategories}
                            onChange={handleSubcategoryChange}
                            disabled={!data.category_id}
                        />

                        <Select
                            id="subsubcategory_id"
                            label="Sub-subcategory"
                            placeholder={data.subcategory_id ? 'Select sub-subcategory' : 'Select subcategory first'}
                            value={data.subsubcategory_id}
                            error={errors.subsubcategory_id}
                            options={filteredSubsubcategories}
                            onChange={(e) => setData('subsubcategory_id', e.target.value)}
                            disabled={!data.subcategory_id}
                        />

                        <Select
                            id="brand_id"
                            label="Brand"
                            placeholder="Select brand"
                            value={data.brand_id}
                            error={errors.brand_id}
                            options={brandOptions}
                            onChange={(e) => setData('brand_id', e.target.value)}
                        />

                        <Select
                            id="unit_id"
                            label="Unit of Measure"
                            placeholder="Select unit"
                            value={data.unit_id}
                            error={errors.unit_id}
                            options={unitOptions}
                            onChange={(e) => setData('unit_id', e.target.value)}
                        />
                    </div>
                </Card>

                {/* 3. Pricing & Inventory */}
                <Card title="Pricing & Inventory">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Input
                            id="price"
                            label="Price ($)"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={data.price}
                            error={errors.price}
                            required
                            onChange={(e) => setData('price', e.target.value)}
                        />

                        <Select
                            id="discount_type"
                            label="Discount Type"
                            value={data.discount_type}
                            error={errors.discount_type}
                            options={discountTypeOptions}
                            onChange={(e) => setData('discount_type', e.target.value)}
                        />

                        <Input
                            id="discount_value"
                            label="Discount Value"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={data.discount_value}
                            error={errors.discount_value}
                            disabled={!data.discount_type}
                            onChange={(e) => setData('discount_value', e.target.value)}
                        />

                        <Input
                            id="stock"
                            label="Stock Quantity"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={data.stock}
                            error={errors.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                        />

                        <Input
                            id="alert_quantity"
                            label="Low Stock Alert Quantity"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={data.alert_quantity}
                            error={errors.alert_quantity}
                            onChange={(e) => setData('alert_quantity', e.target.value)}
                        />
                    </div>
                </Card>

                {/* 4. Product Descriptions */}
                <Card title="Product Descriptions">
                    <div className="space-y-4">
                        <Textarea
                            id="short_description"
                            label="Short Summary / Key Highlights"
                            placeholder="Brief 1-2 sentence summary of product..."
                            rows={2}
                            value={data.short_description}
                            error={errors.short_description}
                            onChange={(e) => setData('short_description', e.target.value)}
                        />

                        <Textarea
                            id="description"
                            label="Full Detailed Description"
                            placeholder="Write comprehensive product details, specifications, warranty, etc..."
                            rows={5}
                            value={data.description}
                            error={errors.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>
                </Card>

                {/* 5. Images */}
                <Card title="Product Media & Gallery">
                    <div className="space-y-5">
                        {/* Main Cover Image */}
                        <div>
                            <label className="block text-xs font-semibold text-neutral-700">
                                Primary Product Image
                            </label>
                            <p className="mb-2 text-[11px] text-neutral-500">
                                Main product image displayed on store cards and hero views.
                            </p>
                            <div className="flex items-center gap-4">
                                {mainImagePreview ? (
                                    <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-neutral-200">
                                        <img
                                            src={mainImagePreview}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData('image', null);
                                                setMainImagePreview(null);
                                            }}
                                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white shadow-xs hover:bg-rose-700"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 transition">
                                        <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        <span className="mt-1 text-[10px] text-neutral-500">Upload</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleMainImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                            {errors.image && (
                                <p className="mt-1 text-xs text-rose-600">{errors.image}</p>
                            )}
                        </div>

                        {/* Additional Gallery Images */}
                        <div className="border-t border-neutral-100 pt-4">
                            <label className="block text-xs font-semibold text-neutral-700">
                                Additional Gallery Images
                            </label>
                            <p className="mb-2 text-[11px] text-neutral-500">
                                Upload multiple supplementary angle and detail shots.
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                {additionalPreviews.map((preview, idx) => (
                                    <div
                                        key={idx}
                                        className="relative h-20 w-20 overflow-hidden rounded-xl border border-neutral-200"
                                    >
                                        <img
                                            src={preview.url}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAdditionalImage(idx)}
                                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white shadow-xs hover:bg-rose-700"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}

                                <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 transition">
                                    <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span className="mt-1 text-[10px] text-neutral-500">+ More</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleAdditionalImagesChange}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 6. Product Attributes */}
                <Card
                    title="Product Attributes & Specifications"
                    actions={
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={addAttributeRow}
                            className="text-xs"
                        >
                            + Add Attribute
                        </Button>
                    }
                >
                    {data.attributes.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic">
                            No custom attributes added yet. Click "+ Add Attribute" to define custom options (e.g. Color, Size, Ram).
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {data.attributes.map((attr, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 sm:flex-row sm:items-center"
                                >
                                    <div className="w-full sm:w-1/3">
                                        <Select
                                            id={`attribute_id_${idx}`}
                                            placeholder="Choose attribute"
                                            value={attr.attribute_id}
                                            options={attributeOptions}
                                            onChange={(e) =>
                                                updateAttributeRow(idx, 'attribute_id', e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="w-full sm:flex-1">
                                        <Input
                                            id={`attribute_value_${idx}`}
                                            placeholder="e.g. Matte Black, 256GB, XL"
                                            value={attr.value}
                                            onChange={(e) =>
                                                updateAttributeRow(idx, 'value', e.target.value)
                                            }
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAttributeRow(idx)}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition"
                                        title="Remove attribute"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* 7. Status Card - ALWAYS PLACED AT THE VERY LAST POSITION! */}
                <Card title="Publication Status">
                    <div className="max-w-md">
                        <Select
                            id="status"
                            label="Publication Status"
                            value={data.status}
                            error={errors.status}
                            options={statusOptions}
                            required
                            onChange={(e) => setData('status', e.target.value)}
                        />
                        <p className="mt-1 text-[11px] text-neutral-500">
                            Active products will appear publicly in your store catalog.
                        </p>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
                        <Link href={route('vendor.products.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} loading={processing}>
                            {processing ? 'Publishing Product...' : 'Publish Product'}
                        </Button>
                    </div>
                </Card>
            </form>
        </VendorLayout>
    );
}

