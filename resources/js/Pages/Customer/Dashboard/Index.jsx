import { useState } from 'react';
import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Alert, Button, Card } from '@/Components/UI';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

function CheckIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    );
}

function CrossIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    );
}

export default function Index({ user, wallet, earningWallet, orders }) {
    const { auth, flash } = usePage().props;
    const [busyProductId, setBusyProductId] = useState(null);
    const isVendor = !!auth?.user?.vendor;
    const isAdmin =
        auth?.isSuperAdmin ||
        (auth?.permissions && auth.permissions.includes('dashboard.view'));
    const isRegular = user?.user_type === 'regular' || orders?.enabled;
    const orderList = orders?.products ?? [];

    const handleOrder = (productId, action) => {
        if (busyProductId) return;

        setBusyProductId(productId);
        router.post(route(`account.orders.${action}`, productId), {}, {
            preserveScroll: true,
            onFinish: () => setBusyProductId(null),
        });
    };

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
                    {flash?.error && (
                        <Alert variant="error" className="mb-6">
                            {flash.error}
                        </Alert>
                    )}

                    <div className={`mb-6 grid gap-4 ${isRegular ? 'sm:grid-cols-2' : ''}`}>
                        <Card title="Deposit wallet">
                            <p className="text-3xl font-bold tracking-tight text-neutral-900">
                                ${wallet?.formatted_balance ?? '0.00'}
                            </p>
                            <p className="mt-1 text-sm text-neutral-500">
                                Approved deposits only. Order earnings are kept separate.
                            </p>
                            <Link
                                href={route('account.deposit')}
                                className="mt-4 inline-flex text-sm font-semibold text-[#007185] hover:text-[#c7511f] hover:underline"
                            >
                                Add funds via deposit
                            </Link>
                        </Card>

                        {isRegular && (
                            <Card title="Earning wallet">
                                <p className="text-3xl font-bold tracking-tight text-neutral-900">
                                    ${earningWallet?.formatted_balance ?? '0.00'}
                                </p>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Balance from confirmed orders only. Deposits are not included.
                                </p>
                            </Card>
                        )}
                    </div>

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

                    {isRegular ? (
                        <Card
                            className="mt-6"
                            title="Orders"
                            description={
                                orders?.limit > 0
                                    ? `${orders.used} of ${orders.limit} orders used · Resets every ${orders.reset_interval_label}${
                                          orders.uses_global_limit ? ' (global settings)' : ''
                                      }`
                                    : `No order limit yet. Global limit and reset from Order Limits will apply when set.`
                            }
                        >
                            {orders?.limit > 0 && (
                                <p className="mb-4 text-sm text-neutral-600">
                                    Confirm an order to add {orders.formatted_percentage}% of your $
                                    {orders.formatted_deposit_amount} deposit
                                    (${orders.formatted_earning_per_order}) to your earning wallet.
                                </p>
                            )}

                            {orderList.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                    {orderList.map((product) => {
                                        const busy = busyProductId === product.id;

                                        return (
                                            <div
                                                key={product.id}
                                                className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white"
                                            >
                                                <div className="flex aspect-square items-center justify-center bg-neutral-50">
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="h-full w-full object-contain p-2"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-neutral-400">No image</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-1 flex-col p-3">
                                                    <h4 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-neutral-900">
                                                        {product.name}
                                                    </h4>
                                                    <div className="mt-3 flex items-center justify-center gap-3">
                                                        <button
                                                            type="button"
                                                            disabled={busy || !!busyProductId}
                                                            onClick={() => handleOrder(product.id, 'confirm')}
                                                            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                            aria-label={`Confirm ${product.name}`}
                                                        >
                                                            <CheckIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={busy || !!busyProductId}
                                                            onClick={() => handleOrder(product.id, 'reject')}
                                                            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                            aria-label={`Decline ${product.name}`}
                                                        >
                                                            <CrossIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-neutral-600">
                                    {orders?.remaining > 0
                                        ? 'No more products are available for orders right now. Check back after the reset window or when new products are added.'
                                        : orders?.limit > 0
                                          ? `You have used all ${orders.limit} orders. New orders will be available after the ${orders.reset_interval_label} reset window.`
                                          : 'Order cards will appear here once a global order limit is saved, or a dedicated limit is added for your account.'}
                                </p>
                            )}
                        </Card>
                    ) : (
                        <Card title="Orders" className="mt-6">
                            <p className="text-sm text-neutral-600">
                                Order history will appear here once checkout is enabled. Browse products on the{' '}
                                <Link href={route('home')} className="font-medium text-[#007185] hover:underline">
                                    home page
                                </Link>
                                .
                            </p>
                        </Card>
                    )}
                </Container>
            </section>
        </CustomerPanelLayout>
    );
}
