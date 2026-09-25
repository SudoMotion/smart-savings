import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        status: 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.units.store'));
    };

    return (
        <AdminLayout title="Create Unit">
            <Head title="Create Unit" />

            <AdminPageHeader
                title="Create Unit"
                backHref={route('admin.units.index')}
                backLabel="Back to units"
            />

            <AdminForm onSubmit={submit}>
                <Card title="Unit Details">
                    <AdminFormGrid>
                        <Input
                            id="name"
                            label="Unit Name"
                            placeholder="e.g. Piece (Pcs), Kilogram (Kg), Box, Litre"
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
                        <Link href={route('admin.units.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Save Unit
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}

