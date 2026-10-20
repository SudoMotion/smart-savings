import Container from '@/Components/Frontend/Container';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Index({ user, wallet }) {
    const { flash } = usePage().props;
    const initial = (user.name || 'U').trim().charAt(0).toUpperCase();
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('account.profile.update'), { preserveScroll: true });
    };

    return (
        <CustomerPanelLayout>
            <Head title="Profile" />

            <section className="py-6 sm:py-8">
                <Container className="max-w-lg">
                    <div className="mb-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1e3a2d]/70">
                            Account
                        </p>
                        <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-neutral-900">
                            Profile
                        </h1>
                    </div>

                    {flash?.success && (
                        <p className="mb-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                            {flash.success}
                        </p>
                    )}

                    <div className="rounded-xl bg-[#1e3a2d] px-4 py-3.5 text-white">
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0f281c] text-lg font-semibold text-[#febd69]">
                                {initial}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">{user.name}</p>
                                <p className="truncate text-xs text-white/60">{user.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-medium uppercase tracking-wide text-white/45">
                                    Balance
                                </p>
                                <p className="text-lg font-semibold tabular-nums text-[#febd69]">
                                    ${wallet?.formatted_balance ?? '0.00'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {user.user_type_label && (
                                <span className="rounded-full bg-[#0f281c] px-2.5 py-1 text-[11px] text-[#febd69]">
                                    {user.user_type_label}
                                </span>
                            )}
                            {user.created_at && (
                                <span className="rounded-full bg-[#0f281c] px-2.5 py-1 text-[11px] text-white/70">
                                    Member since {user.created_at}
                                </span>
                            )}
                        </div>
                    </div>

                    <form
                        onSubmit={submit}
                        className="mt-3 space-y-3 rounded-xl border border-neutral-200 bg-white p-4"
                    >
                        <p className="text-sm font-semibold text-neutral-900">Edit profile</p>
                        <div>
                            <label htmlFor="name" className="text-[11px] font-medium text-neutral-500">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                required
                                autoComplete="name"
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 outline-none transition focus:border-[#1e3a2d] focus:bg-white focus:ring-1 focus:ring-[#1e3a2d]"
                            />
                            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="text-[11px] font-medium text-neutral-500">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                required
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 outline-none transition focus:border-[#1e3a2d] focus:bg-white focus:ring-1 focus:ring-[#1e3a2d]"
                            />
                            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="h-10 w-full rounded-lg bg-[#0f281c] text-sm font-medium text-white transition hover:bg-[#1e3a2d] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Save changes
                        </button>
                    </form>

                    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                        <Link
                            href={route('guest.reset.password')}
                            className="invisible font-medium text-[#1e3a2d] hover:underline"
                        >
                            Reset password
                        </Link>
                        <Link
                            href={route('account.logout')}
                            method="post"
                            as="button"
                            className="font-medium text-rose-600 hover:underline"
                        >
                            Sign out
                        </Link>
                    </div>
                </Container>
            </section>
        </CustomerPanelLayout>
    );
}
