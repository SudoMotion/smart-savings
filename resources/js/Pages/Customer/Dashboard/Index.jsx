import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Alert, Button, Card } from '@/Components/UI';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ user, wallet }) {
    const { auth, flash } = usePage().props;
    const isVendor = !!auth?.user?.vendor;
    const isAdmin =
        auth?.isSuperAdmin ||
        (auth?.permissions && auth.permissions.includes('dashboard.view'));

    return (
        <CustomerPanelLayout>
            <Head title="My account" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-10 sm:py-12">
                <Container>
                    <SectionHeading
                        eyebrow="Customer panel"
                        title={`Hello, ${user.name.split(' ')[0]}`}
                        description="Manage your shopping account from the same layout as the public storefront."
                    />
                </Container>
            </section>

            <section className="py-10 sm:py-12">
                <Container>
                    {flash?.success && (
                        <Alert variant="success" className="mb-6">
                            {flash.success}
                        </Alert>
                    )}

                    <Card title="Wallet balance" className="mb-6">
                        <p className="text-3xl font-bold tracking-tight text-neutral-900">
                            ${wallet?.formatted_balance ?? '0.00'}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                            Available balance in your customer wallet.
                        </p>
                        <Link
                            href={route('account.deposit')}
                            className="mt-4 inline-flex text-sm font-semibold text-[#007185] hover:text-[#c7511f] hover:underline"
                        >
                            Add funds via deposit
                        </Link>
                    </Card>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card title="Account details" className="lg:col-span-2">
                            <dl className="space-y-4 text-sm">
                                <div>
                                    <dt className="font-medium text-neutral-500">Name</dt>
                                    <dd className="mt-1 text-neutral-900">{user.name}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-neutral-500">Email</dt>
                                    <dd className="mt-1 text-neutral-900">{user.email}</dd>
                                </div>
                                {user.created_at && (
                                    <div>
                                        <dt className="font-medium text-neutral-500">Member since</dt>
                                        <dd className="mt-1 text-neutral-900">{user.created_at}</dd>
                                    </div>
                                )}
                            </dl>
                        </Card>

                        <div className="space-y-4">
                            <Card title="Quick links">
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <Link
                                            href={route('home')}
                                            className="font-medium text-[#007185] hover:text-[#c7511f] hover:underline"
                                        >
                                            Continue shopping
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route('contact')}
                                            className="font-medium text-[#007185] hover:text-[#c7511f] hover:underline"
                                        >
                                            Customer support
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route('guest.reset.password')}
                                            className="font-medium text-[#007185] hover:text-[#c7511f] hover:underline"
                                        >
                                            Reset password
                                        </Link>
                                    </li>
                                </ul>
                            </Card>

                            {(isVendor || isAdmin) && (
                                <Card title="Other portals">
                                    <ul className="space-y-2 text-sm">
                                        {isVendor && (
                                            <li>
                                                <Link
                                                    href={route('vendor.dashboard')}
                                                    className="font-semibold text-emerald-700 hover:underline"
                                                >
                                                    Vendor dashboard
                                                </Link>
                                            </li>
                                        )}
                                        {isAdmin && (
                                            <li>
                                                <Link
                                                    href={route('admin.dashboard')}
                                                    className="font-semibold text-indigo-700 hover:underline"
                                                >
                                                    Admin console
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </Card>
                            )}

                            <Link href={route('account.logout')} method="post" as="button" className="block w-full">
                                <Button variant="secondary" className="w-full">
                                    Sign out
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <Card title="Orders" className="mt-6">
                        <p className="text-sm text-neutral-600">
                            Order history will appear here once checkout is enabled. Browse products on the{' '}
                            <Link href={route('home')} className="font-medium text-[#007185] hover:underline">
                                home page
                            </Link>
                            .
                        </p>
                    </Card>
                </Container>
            </section>
        </CustomerPanelLayout>
    );
}
