import { useMemo, useState } from 'react';
import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
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
    const { data, setData, post, processing, errors, progress } = useForm({
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
        post(route('admin.products.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Create Product">
            <Head title="Create Product" />

            <AdminPageHeader
                title="Create Product"
                backHref={route('admin.products.index')}
                backLabel="Back to products"
            />

            <AdminForm onSubmit={submit}>
                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card title="Product Information">
                        <AdminFormGrid>
                            <Input
                                id="name"
                                label="Product Name"
                                placeholder="e.g. iPhone 15 Pro Max 256GB"
                                wrapperClassName="sm:col-span-2 lg:col-span-2 xl:col-span-2"
                                value={data.name}
                                error={errors.name}
                                required
                                onChange={(e) => setData('name', e.target.value)}
                            />

                            <Input
                                id="code"
                                label="Product Code"
                                placeholder="e.g. PRD-1002"
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                value={data.code}
                                error={errors.code}
                                onChange={(e) => setData('code', e.target.value)}
                            />

                            <Input
                                id="sku"
                                label="SKU"
                                placeholder="e.g. SKU-IP15-256-TI"
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                value={data.sku}
                                error={errors.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                            />

                            <Select
                                id="category_id"
                                label="Category"
                                placeholder="Select a category"
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                value={data.category_id}
                                error={errors.category_id}
                                options={categoryOptions}
                                onChange={handleCategoryChange}
                            />

                            <Select
                                id="subcategory_id"
                                label="Subcategory"
                                placeholder={data.category_id ? 'Select a subcategory' : 'Select a category first'}
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                value={data.subcategory_id}
                                error={errors.subcategory_id}
                                options={filteredSubcategories}
                                disabled={!data.category_id}
                                onChange={handleSubcategoryChange}
                            />

                            <Select
                                id="subsubcategory_id"
                                label="Sub-subcategory"
                                placeholder={data.subcategory_id ? 'Select a sub-subcategory' : 'Select a subcategory first'}
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                value={data.subsubcategory_id}
                                error={errors.subsubcategory_id}
                                options={filteredSubsubcategories}
                                disabled={!data.subcategory_id}
                                onChange={(e) => setData('subsubcategory_id', e.target.value)}
                            />

                            <Select
                                id="brand_id"
                                label="Brand"
                                placeholder="Select a brand"
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                value={data.brand_id}
                                error={errors.brand_id}
                                options={brandOptions}
                                onChange={(e) => setData('brand_id', e.target.value)}
                            />

                            <Select
                                id="unit_id"
                                label="Unit"
                                placeholder="Select a unit"
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                value={data.unit_id}
                                error={errors.unit_id}
                                options={unitOptions}
                                onChange={(e) => setData('unit_id', e.target.value)}
                            />
                        </AdminFormGrid>
                    </Card>

                    {/* Pricing, Discount & Inventory */}
                    <Card title="Pricing & Inventory">
                        <AdminFormGrid>
                            <Input
                                id="price"
                                label="Regular Price ($)"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                value={data.price}
                                error={errors.price}
                                required
                                onChange={(e) => setData('price', e.target.value)}
                            />

                            <Select
                                id="discount_type"
                                label="Discount Type"
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                value={data.discount_type}
                                error={errors.discount_type}
                                options={discountTypeOptions}
                                onChange={(e) => setData('discount_type', e.target.value)}
                            />

                            {data.discount_type && (
                                <Input
                                    id="discount_value"
                                    label={`Discount Value (${data.discount_type === 'percentage' ? '%' : '$'})`}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0"
                                    wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                    value={data.discount_value}
                                    error={errors.discount_value}
                                    onChange={(e) => setData('discount_value', e.target.value)}
                                />
                            )}

                            <Input
                                id="stock"
                                label="Stock Quantity"
                                type="number"
                                min="0"
                                placeholder="0"
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                value={data.stock}
                                error={errors.stock}
                                required
                                onChange={(e) => setData('stock', e.target.value)}
                            />

                            <Input
                                id="alert_quantity"
                                label="Alert Quantity"
                                type="number"
                                min="0"
                                placeholder="0"
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                value={data.alert_quantity}
                                error={errors.alert_quantity}
                                onChange={(e) => setData('alert_quantity', e.target.value)}
                            />
                        </AdminFormGrid>
                    </Card>

                    {/* Product Images */}
                    <Card title="Product Media">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">
                                    Primary Product Image
                                </label>
                                <div className="mt-1 flex items-center gap-4">
                                    {mainImagePreview ? (
                                        <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-neutral-300">
                                            <img
                                                src={mainImagePreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-400">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div>
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            className="block w-full text-sm text-neutral-500 file:mr-4 file:rounded-md file:border-0 file:bg-neutral-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-neutral-700"
                                            onChange={handleMainImageChange}
                                        />
                                        <p className="mt-1 text-xs text-neutral-500">
                                            PNG, JPG, WEBP up to 5MB. Recommended square aspect ratio.
                                        </p>
                                        {errors.image && (
                                            <p className="mt-1 text-xs text-rose-600">{errors.image}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-neutral-100 pt-5">
                                <label className="block text-sm font-medium text-neutral-700">
                                    Additional Images Gallery
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="file"
                                        id="additional_images"
                                        accept="image/*"
                                        multiple
                                        className="block w-full text-sm text-neutral-500 file:mr-4 file:rounded-md file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-neutral-700 hover:file:bg-neutral-200"
                                        onChange={handleAdditionalImagesChange}
                                    />
                                    <p className="mt-1 text-xs text-neutral-500">
                                        Upload multiple supplementary angles or photos for this product.
                                    </p>
                                </div>

                                {additionalPreviews.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {additionalPreviews.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="group relative h-20 w-20 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
                                            >
                                                <img
                                                    src={item.url}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeAdditionalImage(idx)}
                                                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Descriptions */}
                    <Card title="Descriptions">
                        <div className="space-y-4">
                            <Textarea
                                id="short_description"
                                label="Short Description"
                                rows={2}
                                placeholder="Brief summary of the product..."
                                value={data.short_description}
                                error={errors.short_description}
                                onChange={(e) => setData('short_description', e.target.value)}
                            />

                            <Textarea
                                id="description"
                                label="Detailed Description"
                                rows={5}
                                placeholder="Full product details, specifications, and warranty info..."
                                value={data.description}
                                error={errors.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                    </Card>

                    {/* Product Attributes */}
                    <Card
                        title="Product Attributes"
                        actions={
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={addAttributeRow}
                            >
                                + Add Attribute
                            </Button>
                        }
                    >
                        {data.attributes.length === 0 ? (
                            <p className="text-sm text-neutral-500 italic">
                                No attributes added. Click "+ Add Attribute" to specify attributes like Color, Size, RAM, etc.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {data.attributes.map((attr, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-1/3">
                                            <Select
                                                id={`attribute_id_${idx}`}
                                                placeholder="Select Attribute"
                                                value={attr.attribute_id}
                                                options={attributeOptions}
                                                onChange={(e) =>
                                                    updateAttributeRow(idx, 'attribute_id', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                id={`attribute_value_${idx}`}
                                                placeholder="e.g. Space Black, 16GB, XL"
                                                value={attr.value}
                                                onChange={(e) =>
                                                    updateAttributeRow(idx, 'value', e.target.value)
                                                }
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAttributeRow(idx)}
                                            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-rose-600"
                                            title="Remove Attribute"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Status Card - ALWAYS AT LAST! */}
                    <Card title="Publication Status">
                        <AdminFormGrid>
                            <Select
                                id="status"
                                label="Status"
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-2"
                                value={data.status}
                                error={errors.status}
                                options={statusOptions}
                                required
                                onChange={(e) => setData('status', e.target.value)}
                            />
                        </AdminFormGrid>

                        <div className="mt-4 flex justify-end gap-3">
                            <Link href={route('admin.products.index')}>
                                <Button type="button" variant="secondary">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} loading={processing}>
                                {processing ? 'Saving Product...' : 'Save Product'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </AdminForm>
        </AdminLayout>
    );
}

