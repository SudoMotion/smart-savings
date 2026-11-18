import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { AddAction, Alert, Button, Card, Input, RemoveAction, Textarea } from '@/Components/UI';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

function emptyEvent() {
    return {
        id: null,
        first_window_text: '',
        bonus_amount: '',
        deposit_amount: '',
        expire_on: '',
    };
}

function formatAmount(value) {
    const amount = Number(value);

    return Number.isFinite(amount) ? amount.toFixed(2) : '0.00';
}

/** Wallet for event 1; each next event starts at the previous standard balance (wallet + prior deposits). */
function eventOpeningBalance(events, index, walletBalance) {
    let balance = Number(walletBalance) || 0;

    for (let i = 0; i < index; i += 1) {
        balance += Number(events[i]?.deposit_amount || 0);
    }

    return balance;
}

function eventStandardBalance(events, index, walletBalance) {
    return eventOpeningBalance(events, index, walletBalance) + Number(events[index]?.deposit_amount || 0);
}

export default function Edit({ user }) {
    const { flash } = usePage().props;
    const walletBalance = Number(user.wallet_balance ?? 0);
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        events: user.events ?? [],
    });

    const updateEvent = (index, field, value) => {
        const events = [...data.events];
        events[index] = { ...events[index], [field]: value };
        setData('events', events);
    };

    const addEvent = () => {
        setData('events', [...data.events, emptyEvent()]);
    };

    const removeEvent = (index) => {
        setData(
            'events',
            data.events.filter((_, eventIndex) => eventIndex !== index),
        );
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AdminLayout title="Edit User">
            <Head title="Edit User" />

            <AdminPageHeader
                title="Edit User"
                titleAside={
                    <Link
                        href={route('admin.users.edit-password', user.id)}
                        className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                    >
                        Change password
                    </Link>
                }
                backHref={route('admin.users.index')}
                backLabel="Back to users"
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <AdminForm onSubmit={submit} className="space-y-6">
                <Card title="User Details">
                    <AdminFormGrid>
                        <Input
                            id="name"
                            label="Name"
                            wrapperClassName="sm:col-span-2 lg:col-span-2 xl:col-span-2"
                            value={data.name}
                            error={errors.name}
                            required
                            onChange={(e) => setData('name', e.target.value)}
                        />

                        <Input
                            id="email"
                            label="Email"
                            wrapperClassName="sm:col-span-2 lg:col-span-2 xl:col-span-2"
                            type="email"
                            value={data.email}
                            error={errors.email}
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </AdminFormGrid>
                </Card>

                <Card title="Events" actions={<AddAction title="Add event" onClick={addEvent} />}>
                        {data.events.length === 0 ? (
                            <p className="text-sm text-neutral-500">
                                No events yet. Add an event for this customer.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {data.events.map((event, index) => (
                                    <div
                                        key={event.id ?? `new-${index}`}
                                        className="rounded-md border border-neutral-200 p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <p className="text-sm font-medium text-neutral-900">
                                                Event {index + 1}
                                            </p>
                                            <RemoveAction
                                                title="Remove event"
                                                onClick={() => removeEvent(index)}
                                            />
                                        </div>

                                        <AdminFormGrid>
                                            <Textarea
                                                id={`event-${index}-first-window-text`}
                                                label="First window text"
                                                wrapperClassName="sm:col-span-2 lg:col-span-4 xl:col-span-4"
                                                value={event.first_window_text}
                                                error={errors[`events.${index}.first_window_text`]}
                                                required
                                                onChange={(e) =>
                                                    updateEvent(index, 'first_window_text', e.target.value)
                                                }
                                            />
                                            <Input
                                                id={`event-${index}-balance`}
                                                label="Balance"
                                                value={formatAmount(
                                                    eventOpeningBalance(data.events, index, walletBalance),
                                                )}
                                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                                readOnly
                                                disabled
                                            />
                                            <Input
                                                id={`event-${index}-deposit-amount`}
                                                label="Deposit amount"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={event.deposit_amount}
                                                error={errors[`events.${index}.deposit_amount`]}
                                                required
                                                onChange={(e) =>
                                                    updateEvent(index, 'deposit_amount', e.target.value)
                                                }
                                            />
                                            <Input
                                                id={`event-${index}-standard-balance`}
                                                label="Standard balance"
                                                value={formatAmount(
                                                    eventStandardBalance(data.events, index, walletBalance),
                                                )}
                                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-1"
                                                readOnly
                                                disabled
                                            />
                                            <Input
                                                id={`event-${index}-bonus-amount`}
                                                label="Bonus amount"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={event.bonus_amount}
                                                error={errors[`events.${index}.bonus_amount`]}
                                                required
                                                onChange={(e) =>
                                                    updateEvent(index, 'bonus_amount', e.target.value)
                                                }
                                            />
                                            <Input
                                                id={`event-${index}-expire-on`}
                                                label="Expire on"
                                                type="datetime-local"
                                                wrapperClassName="sm:col-span-2 lg:col-span-2 xl:col-span-2"
                                                value={event.expire_on}
                                                error={errors[`events.${index}.expire_on`]}
                                                required
                                                onChange={(e) =>
                                                    updateEvent(index, 'expire_on', e.target.value)
                                                }
                                            />
                                        </AdminFormGrid>
                                    </div>
                                ))}
                            </div>
                        )}
                </Card>

                <div className="flex justify-end gap-3">
                    <Link href={route('admin.users.index')}>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing}>
                        Update User
                    </Button>
                </div>
            </AdminForm>
        </AdminLayout>
    );
}
