import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export default function Edit({ subcategory, categoryOptions = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        category_id: subcategory.category_id ? String(subcategory.category_id) : '',
        name: subcategory.name ?? '',
        status: subcategory.status ?? 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.subcategories.update', subcategory.id));
    };

    return (
        <AdminLayout title="Edit Subcategory">
            <Head title="Edit Subcategory" />

            <AdminPageHeader
                title={`Edit Subcategory: ${subcategory.name}`}
                backHref={route('admin.subcategories.index')}
                backLabel="Back to subcategories"
            />

            <AdminForm onSubmit={submit}>
                <Card title="Subcategory Details">
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
                            onChange={(e) => setData('category_id', e.target.value)}
                        />

                        <Input
                            id="name"
                            label="Subcategory Name"
                            placeholder="e.g. Smartphones, Wireless Earbuds, Gift Cards"
                            wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
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
                        <Link href={route('admin.subcategories.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Update Subcategory
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}

