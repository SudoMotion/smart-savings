import VendorLayout from '@/Layouts/Vendor/VendorLayout';
import { Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export default function Edit({ unit }) {
    const { data, setData, put, processing, errors } = useForm({
        name: unit.name || '',
        status: unit.status || 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('vendor.units.update', unit.id));
    };

    return (
        <VendorLayout title="Edit Unit">
            <Head title={`Edit Unit: ${unit.name} - Vendor Panel`} />

            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <Link
                        href={route('vendor.units.index')}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                        Edit Unit: {unit.name}
                    </h1>
                </div>
            </div>

            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <Card title="Unit Information">
                    <div className="space-y-4">
                        <Input
                            id="name"
                            label="Unit Name"
                            placeholder="Unit name"
                            value={data.name}
                            error={errors.name}
                            required
                            onChange={(e) => setData('name', e.target.value)}
                        />

                        {/* Status at the very last position */}
                        <Select
                            id="status"
                            label="Status"
                            value={data.status}
                            error={errors.status}
                            options={statusOptions}
                            required
                            onChange={(e) => setData('status', e.target.value)}
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3 border-t border-neutral-100 pt-4">
                        <Link href={route('vendor.units.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} loading={processing}>
                            {processing ? 'Saving...' : 'Update Unit'}
                        </Button>
                    </div>
                </Card>
            </form>
        </VendorLayout>
    );
}

