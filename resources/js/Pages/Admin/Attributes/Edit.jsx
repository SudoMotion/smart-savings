import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export default function Edit({ attribute }) {
    const { data, setData, put, processing, errors } = useForm({
        name: attribute.name ?? '',
        status: attribute.status ?? 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.attributes.update', attribute.id));
    };

    return (
        <AdminLayout title="Edit Attribute">
            <Head title="Edit Attribute" />

            <AdminPageHeader
                title={`Edit Attribute: ${attribute.name}`}
                backHref={route('admin.attributes.index')}
                backLabel="Back to attributes"
            />

            <AdminForm onSubmit={submit}>
                <Card title="Attribute Details">
                    <AdminFormGrid>
                        <Input
                            id="name"
                            label="Attribute Name"
                            placeholder="e.g. Color, Size, Storage, RAM"
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
                        <Link href={route('admin.attributes.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Update Attribute
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}

