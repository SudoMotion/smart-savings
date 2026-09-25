import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name ?? '',
        status: category.status ?? 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.categories.update', category.id));
    };

    return (
        <AdminLayout title="Edit Category">
            <Head title="Edit Category" />

            <AdminPageHeader
                title={`Edit Category: ${category.name}`}
                backHref={route('admin.categories.index')}
                backLabel="Back to categories"
            />

            <AdminForm onSubmit={submit}>
                <Card title="Category Details">
                    <AdminFormGrid>
                        <Input
                            id="name"
                            label="Category Name"
                            placeholder="e.g. Electronics, Gift Cards, Savings Plans"
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
                            onChange={(e) => setData('status', e.target.value)}
                        />
                    </AdminFormGrid>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link href={route('admin.categories.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Update Category
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}

