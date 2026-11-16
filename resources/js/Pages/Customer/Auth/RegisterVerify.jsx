import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Alert, Button, Input } from '@/Components/UI';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function RegisterVerify({ email }) {
    const { flash } = usePage().props;
    const [resendCount, setResendCount] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(true);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);

            return undefined;
        }

        const timer = setTimeout(() => setCountdown((value) => value - 1), 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    const submit = (e) => {
        e.preventDefault();
        post(route('account.register.verify.code'), {
            preserveScroll: true,
        });
    };

    const handleResend = () => {
        setCanResend(false);
        const nextCount = resendCount + 1;
        setResendCount(nextCount);
        setCountdown(nextCount * 60);
        post(route('account.register.verify.resend'), {
            preserveScroll: true,
        });
    };

    return (
        <FrontendLayout>
            <Head title="Verify email" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-10 sm:py-12">
                <Container>
                    <SectionHeading
                        eyebrow="Customer account"
                        title="Verify your email"
                        description="We sent a 6-digit code to your inbox. Enter it below to finish creating your account."
                    />
                </Container>
            </section>

            <section className="py-10 sm:py-12">
                <Container>
                    <div className="mx-auto max-w-md rounded-sm border border-neutral-200 bg-white p-6 shadow-sm">
                        <p className="mb-4 text-sm text-neutral-600">
                            Code sent to <strong className="text-neutral-900">{email}</strong>
                        </p>

                        {flash?.success && (
                            <Alert variant="success" className="mb-4">
                                {flash.success}
                            </Alert>
                        )}
                        {flash?.error && (
                            <Alert variant="error" className="mb-4">
                                {flash.error}
                            </Alert>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <Input
                                id="code"
                                label="Verification code"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                placeholder="123456"
                                value={data.code}
                                error={errors.code}
                                className="text-center font-mono text-xl tracking-[0.35em]"
                                required
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setData('code', digits);
                                }}
                            />

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={!canResend || processing}
                                    className="text-sm font-medium text-[#007185] hover:text-[#c7511f] hover:underline disabled:cursor-not-allowed disabled:text-neutral-400"
                                >
                                    {canResend
                                        ? 'Resend code'
                                        : `Resend in ${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}`}
                                </button>
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto"
                                    disabled={processing || data.code.length !== 6}
                                >
                                    {processing ? 'Verifying…' : 'Verify & create account'}
                                </Button>
                            </div>
                        </form>

                        <p className="mt-5 border-t border-neutral-100 pt-4 text-center text-sm text-neutral-600">
                            <Link
                                href={route('account.register')}
                                className="font-semibold text-[#007185] hover:text-[#c7511f] hover:underline"
                            >
                                Start over
                            </Link>
                        </p>
                    </div>
                </Container>
            </section>
        </FrontendLayout>
    );
}