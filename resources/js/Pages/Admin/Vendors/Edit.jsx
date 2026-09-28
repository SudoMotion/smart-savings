import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import {
    Alert,
    Button,
    Card,
    FileInput,
    Input,
    Select,
    Textarea,
} from '@/Components/UI';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ vendor }) {
    const { flash } = usePage().props;
    const [logoPreview, setLogoPreview] = useState(vendor.logo_url || null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: vendor.name || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        shop_name: vendor.shop_name || '',
        address: vendor.address || '',
        shop_logo: null,
        status: vendor.status || 'active',
    });

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('shop_logo', file);
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setData('shop_logo', null);
            setLogoPreview(vendor.logo_url || null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.vendors.update', vendor.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={`Edit Vendor: ${vendor.shop_name}`}>
            <Head title={`Edit Vendor - ${vendor.shop_name}`} />

            <AdminPageHeader
                title={`Edit Vendor: ${vendor.shop_name}`}
                description="Update store details, contact information, and vendor account status."
                actions={
                    <Link href={route('admin.vendors.index')}>
                        <Button variant="secondary">Back to Vendors</Button>
                    </Link>
                }
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <Card className="max-w-3xl">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Input
                            id="name"
                            label="Owner Name"
                            required
                            value={data.name}
                            error={errors.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />

                        <Input
                            id="email"
                            type="email"
                            label="Owner Email"
                            required
                            value={data.email}
                            error={errors.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <Input
                            id="shop_name"
                            label="Shop Name"
                            required
                            value={data.shop_name}
                            error={errors.shop_name}
                            onChange={(e) => setData('shop_name', e.target.value)}
                        />

                        <Input
                            id="phone"
                            label="Phone Number"
                            required
                            value={data.phone}
                            error={errors.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                    </div>

                    <Textarea
                        id="address"
                        label="Store Address"
                        rows={3}
                        value={data.address}
                        error={errors.address}
                        onChange={(e) => setData('address', e.target.value)}
                    />

                    <div>
                        <FileInput
                            id="shop_logo"
                            label="Shop Logo"
                            accept="image/*"
                            hint="PNG, JPG, or WebP up to 2MB"
                            error={errors.shop_logo}
                            onChange={handleLogoChange}
                        />

                        {logoPreview && (
                            <div className="mt-3 flex items-center gap-3">
                                <img
                                    src={logoPreview}
                                    alt="Shop Logo Preview"
                                    className="h-16 w-16 rounded-md border border-neutral-200 object-cover"
                                />
                                <span className="text-xs text-neutral-500">Current / New logo preview</span>
                            </div>
                        )}
                    </div>

                    {/* Status field at the very last position */}
                    <div className="border-t border-neutral-200 pt-6">
                        <Select
                            id="status"
                            label="Vendor Status"
                            required
                            value={data.status}
                            error={errors.status}
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Select>
                        <p className="mt-1 text-xs text-neutral-500">
                            Inactive vendors cannot log into the vendor portal.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-6">
                        <Link href={route('admin.vendors.index')}>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update Vendor'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}

