import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Alert, Button, Card, FileInput, Input, Textarea } from '@/Components/UI';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Apply() {
    const { flash } = usePage().props;
    const [logoPreview, setLogoPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        shop_name: '',
        shop_logo: null,
        password: '',
        password_confirmation: '',
    });

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('shop_logo', file);
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setData('shop_logo', null);
            setLogoPreview(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('vendor.apply.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setLogoPreview(null);
            },
        });
    };

    return (
        <FrontendLayout>
            <Head title="Become a Vendor" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-12 sm:py-16">
                <Container>
                    <SectionHeading
                        eyebrow="Seller Portal"
                        title="Become a Vendor"
                        description="Register your shop on our marketplace. Reach thousands of customers and grow your business."
                    />
                </Container>
            </section>

            <section className="py-12 sm:py-16">
                <Container className="max-w-3xl">
                    {flash?.success && (
                        <Alert variant="success" className="mb-6">
                            {flash.success}
                        </Alert>
                    )}

                    <Card
                        title="Vendor Registration Request"
                        description="Fill in your personal and store details. Once submitted, our team will review your application."
                    >
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Input
                                    id="name"
                                    label="Full Name"
                                    required
                                    placeholder="e.g. John Doe"
                                    value={data.name}
                                    error={errors.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />

                                <Input
                                    id="email"
                                    type="email"
                                    label="Email Address"
                                    required
                                    placeholder="vendor@example.com"
                                    value={data.email}
                                    error={errors.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Input
                                    id="phone"
                                    label="Phone Number"
                                    required
                                    placeholder="+1 234 567 890"
                                    value={data.phone}
                                    error={errors.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />

                                <Input
                                    id="shop_name"
                                    label="Shop Name"
                                    required
                                    placeholder="e.g. Acme Furnishings"
                                    value={data.shop_name}
                                    error={errors.shop_name}
                                    onChange={(e) => setData('shop_name', e.target.value)}
                                />
                            </div>

                            <Textarea
                                id="address"
                                label="Store / Business Address"
                                required
                                rows={3}
                                placeholder="123 Marketplace Blvd, Suite 400..."
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
                                        <span className="text-xs text-neutral-500">Logo preview</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Input
                                    id="password"
                                    type="password"
                                    label="Password"
                                    required
                                    placeholder="At least 8 characters"
                                    value={data.password}
                                    error={errors.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />

                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    label="Confirm Password"
                                    required
                                    placeholder="Repeat your password"
                                    value={data.password_confirmation}
                                    error={errors.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-6 sm:flex-row">
                                <p className="text-xs text-neutral-500">
                                    Already have an approved vendor account?{' '}
                                    <Link
                                        href={route('vendor.login')}
                                        className="font-medium text-neutral-900 underline hover:text-neutral-700"
                                    >
                                        Log in here
                                    </Link>
                                </p>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto min-w-[140px]"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Submitting...
                                        </span>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </Container>
            </section>
        </FrontendLayout>
    );
}

