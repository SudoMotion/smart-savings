import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Alert, Button, Input } from '@/Components/UI';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({
    referralCode = null,
    referrerName = null,
    referralCodeFromQuery = false,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        referral_code: referralCode ?? '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('account.register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <FrontendLayout>
            <Head title="Create account" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-10 sm:py-12">
                <Container>
                    <SectionHeading
                        eyebrow="Customer account"
                        title="Create your account"
                        description="Register to track orders and manage your profile on the public storefront."
                    />
                </Container>
            </section>

            <section className="py-10 sm:py-12">
                <Container>
                    <div className="mx-auto max-w-md rounded-sm border border-neutral-200 bg-white p-6 shadow-sm">
                        {errors.referral_code && (
                            <Alert variant="error" className="mb-4">
                                {errors.referral_code}
                            </Alert>
                        )}
                        {referralCode && (
                            <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                                {referrerName
                                    ? `You were invited by ${referrerName}. Complete signup, then make a deposit to activate their referral reward.`
                                    : 'You are signing up with a referral link.'}
                            </div>
                        )}
                        <form onSubmit={submit} className="space-y-4">
                            <Input
                                id="name"
                                label="Full name"
                                name="name"
                                value={data.name}
                                error={errors.name}
                                autoComplete="name"
                                required
                                onChange={(e) => setData('name', e.target.value)}
                            />

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
                                autoComplete="new-password"
                                required
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <Input
                                id="password_confirmation"
                                label="Confirm password"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                error={errors.password_confirmation}
                                autoComplete="new-password"
                                required
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />

                            <Input
                                id="referral_code"
                                label="Referral code (optional)"
                                placeholder="Friend's referral code"
                                value={data.referral_code}
                                error={errors.referral_code}
                                autoComplete="off"
                                readOnly={referralCodeFromQuery}
                                className={referralCodeFromQuery ? 'bg-neutral-50 text-neutral-700' : ''}
                                onChange={(e) => setData('referral_code', e.target.value.toUpperCase())}
                            />

                            <Button type="submit" className="w-full" disabled={processing}>
                                Create account
                            </Button>
                        </form>

                        <p className="mt-5 border-t border-neutral-100 pt-4 text-center text-sm text-neutral-600">
                            Already have an account?{' '}
                            <Link
                                href={route('account.login')}
                                className="font-semibold text-[#007185] hover:text-[#c7511f] hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Container>
            </section>
        </FrontendLayout>
    );
}
