import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Alert, Button, Checkbox, Input } from '@/Components/UI';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('account.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <FrontendLayout>
            <Head title="Sign in" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-10 sm:py-12">
                <Container>
                    <SectionHeading
                        eyebrow="Customer account"
                        title="Sign in"
                        description="Access your orders, saved items, and account settings on the storefront."
                    />
                </Container>
            </section>

            <section className="py-10 sm:py-12">
                <Container>
                    <div className="mx-auto max-w-md rounded-sm border border-neutral-200 bg-white p-6 shadow-sm">
                        {status && (
                            <Alert variant="success" className="mb-4">
                                {status}
                            </Alert>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                name="email"
                                value={data.email}
                                error={errors.email}
                                autoComplete="username"
                                required
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                name="password"
                                value={data.password}
                                error={errors.password}
                                autoComplete="current-password"
                                required
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <div className="flex items-center justify-between gap-3">
                                <Checkbox
                                    id="remember"
                                    label="Remember me"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <Link
                                    href={route('guest.reset.password')}
                                    className="text-xs font-medium text-[#007185] hover:text-[#c7511f] hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                Sign in
                            </Button>
                        </form>

                        <p className="mt-5 border-t border-neutral-100 pt-4 text-center text-sm text-neutral-600">
                            New customer?{' '}
                            <Link
                                href={route('account.register')}
                                className="font-semibold text-[#007185] hover:text-[#c7511f] hover:underline"
                            >
                                Create an account
                            </Link>
                        </p>

                        <p className="mt-3 text-center text-xs text-neutral-500">
                            Selling on the marketplace?{' '}
                            <Link href={route('vendor.login')} className="text-[#007185] hover:underline">
                                Vendor sign in
                            </Link>
                            {' · '}
                            <Link href={route('admin.login')} className="text-[#007185] hover:underline">
                                Staff sign in
                            </Link>
                        </p>
                    </div>
                </Container>
            </section>
        </FrontendLayout>
    );
}
