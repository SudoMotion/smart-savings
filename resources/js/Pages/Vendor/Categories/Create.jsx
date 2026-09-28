import VendorLayout from '@/Layouts/Vendor/VendorLayout';
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
        post(route('vendor.categories.store'));
    };

    return (
        <VendorLayout title="Create Category">
            <Head title="Create Category - Vendor Panel" />

            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <Link
                        href={route('vendor.categories.index')}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                        Add New Category
                    </h1>
                </div>
            </div>

            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <Card title="Category Information">
                    <div className="space-y-4">
                        <Input
                            id="name"
                            label="Category Name"
                            placeholder="e.g. Electronics, Fashion, Home & Kitchen"
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
                        <Link href={route('vendor.categories.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} loading={processing}>
                            {processing ? 'Saving...' : 'Save Category'}
                        </Button>
                    </div>
                </Card>
            </form>
        </VendorLayout>
    );
}

