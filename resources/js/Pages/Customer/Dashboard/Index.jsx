import { useEffect, useRef, useState } from 'react';
import Container from '@/Components/Frontend/Container';
import { Alert } from '@/Components/UI';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

function ChevronLeftIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
    );
}

function ChevronRightIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
    );
}

export default function Index({ user, orders, event }) {
    const { flash } = usePage().props;
    const [busySlot, setBusySlot] = useState(null);
    const [index, setIndex] = useState(0);
    const trackRef = useRef(null);
    const isDiamond = Boolean(user?.is_diamond);
    const isRegular = Boolean(orders?.enabled);
    const orderList = orders?.products ?? [];

    useEffect(() => {
        setIndex((current) => Math.min(current, Math.max(0, orderList.length - 1)));
    }, [orderList.length]);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const width = track.clientWidth;
        track.scrollTo({ left: index * width, behavior: 'smooth' });
    }, [index, orderList.length]);

    const handleOrder = (product, action) => {
        if (busySlot !== null) return;

        setBusySlot(product.slot);
        router.post(route(`account.orders.${action}`, product.id), {}, {
            preserveScroll: true,
            onFinish: () => setBusySlot(null),
        });
    };

    const goTo = (nextIndex) => {
        if (nextIndex < 0 || nextIndex >= orderList.length) return;
        setIndex(nextIndex);
    };

    const handleTrackScroll = () => {
        const track = trackRef.current;
        if (!track || !orderList.length) return;
        const width = track.clientWidth;
        if (!width) return;
        const next = Math.round(track.scrollLeft / width);
        if (next !== index) {
            setIndex(Math.max(0, Math.min(next, orderList.length - 1)));
        }
    };

    const emptyMessage = isDiamond
        ? 'No active event is available right now.'
        : !isRegular
        ? 'Orders are not available for this account type.'
        : orders?.remaining > 0
          ? 'No more products are available for orders right now.'
          : orders?.limit > 0
            ? `You have used all ${orders.limit} orders. New orders will be available after the ${orders.reset_interval_label} reset window.`
            : 'No orders are available until an order limit is configured.';

    return (
        <CustomerPanelLayout>
            <Head title="Orders" />

            <section
                className={
                    isDiamond
                        ? 'flex min-h-[calc(100dvh-11rem)] items-center justify-center px-4 py-10'
                        : 'py-8 sm:py-10'
                }
            >
                <Container className="w-full max-w-lg">
                    {/* {flash?.success && (
                        <Alert variant="success" className="mb-5">
                            {flash.success}
                        </Alert>
                    )}
                    {flash?.error && (
                        <Alert variant="error" className="mb-5">
                            {flash.error}
                        </Alert>
                    )} */}

                    {isDiamond ? (
                        event ? (
                            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                                <p className="whitespace-pre-wrap text-center text-lg font-medium leading-relaxed text-neutral-800 sm:text-xl sm:leading-relaxed">
                                    {event.first_window_text}
                                </p>
                                <Link
                                    href={route('event.show', event.id)}
                                    className="mt-5 flex w-full items-center justify-center rounded-lg bg-[#0f281c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a2d]"
                                >
                                    Submit
                                </Link>
                            </div>
                        ) : (
                            <div className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
                                <p className="text-sm text-neutral-600">{emptyMessage}</p>
                            </div>
                        )
                    ) : isRegular && orders?.limit > 0 ? (
                        <p className="mb-5 text-center text-sm text-neutral-600">
                            {orders.used} of {orders.limit} orders
                            <span className="text-neutral-400"> · </span>
                            Resets every {orders.reset_interval_label}
                        </p>
                    ) : null}

                    {!isDiamond && orderList.length > 0 ? (
                        <div className="relative">
                            {orderList.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => goTo(index - 1)}
                                        disabled={index === 0}
                                        className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-2 text-neutral-700 shadow-md transition hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-30 sm:-translate-x-full sm:left-0"
                                        aria-label="Previous order"
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => goTo(index + 1)}
                                        disabled={index === orderList.length - 1}
                                        className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-2 text-neutral-700 shadow-md transition hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-30 sm:translate-x-full sm:right-0"
                                        aria-label="Next order"
                                    >
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </button>
                                </>
                            )}

                            <div
                                ref={trackRef}
                                onScroll={handleTrackScroll}
                                className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {orderList.map((product) => {
                                    const busy = busySlot === product.slot;

                                    return (
                                        <article
                                            key={`${product.id}-${product.slot}`}
                                            className="w-full shrink-0 snap-center px-1"
                                        >
                                            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                                                <div className="flex aspect-[4/5] items-center justify-center bg-white sm:aspect-square">
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="h-full w-full object-contain p-6"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-neutral-400">No image</span>
                                                    )}
                                                </div>
                                                <div className="border-t border-neutral-100 px-5 pb-6 pt-4">
                                                    <h2 className="line-clamp-2 min-h-[3.25rem] text-center text-lg font-semibold text-neutral-900">
                                                        {product.name}
                                                    </h2>
                                                    <button
                                                        type="button"
                                                        disabled={busy || busySlot !== null}
                                                        onClick={() => handleOrder(product, 'confirm')}
                                                        className="mt-5 flex w-full items-center justify-center rounded-lg bg-[#0f281c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a2d] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {busy ? 'Submitting…' : 'Submit'}
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            {orderList.length > 1 && (
                                <div className="mt-5 flex justify-center gap-2">
                                    {orderList.map((product, dotIndex) => (
                                        <button
                                            key={`${product.id}-${product.slot}`}
                                            type="button"
                                            onClick={() => goTo(dotIndex)}
                                            className={`h-2 rounded-full transition ${
                                                dotIndex === index
                                                    ? 'w-6 bg-[#0f281c]'
                                                    : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                                            }`}
                                            aria-label={`Go to order ${dotIndex + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : !isDiamond ? (
                        <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
                            <p className="text-sm text-neutral-600">{emptyMessage}</p>
                        </div>
                    ) : null}
                </Container>
            </section>
        </CustomerPanelLayout>
    );
}
