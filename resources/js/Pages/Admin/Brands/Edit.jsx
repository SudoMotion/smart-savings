import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export default function Edit({ brand }) {
    const { data, setData, put, processing, errors } = useForm({
        name: brand.name ?? '',
        status: brand.status ?? 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.brands.update', brand.id));
    };

    return (
        <AdminLayout title="Edit Brand">
            <Head title="Edit Brand" />

            <AdminPageHeader
                title={`Edit Brand: ${brand.name}`}
                backHref={route('admin.brands.index')}
                backLabel="Back to brands"
            />

            <AdminForm onSubmit={submit}>
                <Card title="Brand Details">
                    <AdminFormGrid>
                        <Input
                            id="name"
                            label="Brand Name"
                            placeholder="e.g. Apple, Samsung, Nike, Sony"
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
                        <Link href={route('admin.brands.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Update Brand
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}

