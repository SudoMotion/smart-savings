import { useMemo } from 'react';
import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export default function Create({ categoryOptions = [], subcategoryOptions = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        subcategory_id: '',
        name: '',
        status: 'active',
    });

    const filteredSubcategories = useMemo(() => {
        if (!data.category_id) return [];
        return subcategoryOptions.filter(
            (sub) => String(sub.category_id) === String(data.category_id)
        );
    }, [data.category_id, subcategoryOptions]);

    const handleCategoryChange = (e) => {
        const nextCategoryId = e.target.value;
        setData((prev) => ({
            ...prev,
            category_id: nextCategoryId,
            subcategory_id: '',
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.subsubcategories.store'));
    };

    return (
        <AdminLayout title="Create Sub-subcategory">
            <Head title="Create Sub-subcategory" />

            <AdminPageHeader
                title="Create Sub-subcategory"
                backHref={route('admin.subsubcategories.index')}
                backLabel="Back to sub-subcategories"
            />

            <AdminForm onSubmit={submit}>
                <Card title="Sub-subcategory Details">
                    <AdminFormGrid>
                        <Select
                            id="category_id"
                            label="Category"
                            placeholder="Select a category"
                            wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                            value={data.category_id}
                            error={errors.category_id}
                            options={categoryOptions}
                            required
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
                            required
                            disabled={!data.category_id}
                            onChange={(e) => setData('subcategory_id', e.target.value)}
                        />

                        <Input
                            id="name"
                            label="Sub-subcategory Name"
                            placeholder="e.g. iPhone Cases, Gaming Laptops, Digital Cards"
                            wrapperClassName="sm:col-span-2 lg:col-span-2 xl:col-span-2"
                            value={data.name}
                            error={errors.name}
                            required
                            onChange={(e) => setData('name', e.target.value)}
                        />

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
                        <Link href={route('admin.subsubcategories.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Save Sub-subcategory
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}

