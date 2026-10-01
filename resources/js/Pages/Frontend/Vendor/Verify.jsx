import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import Modal from '@/Components/Modal';
import { Alert, Button, Card, Input } from '@/Components/UI';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Verify() {
    const { flash } = usePage().props;
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [resending, setResending] = useState(false);
    const [codeError, setCodeError] = useState('');
    const [resendCount, setResendCount] = useState(0);
    const [canResend, setCanResend] = useState(true);
    const [countdown, setCountdown] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    useEffect(() => {
        if (flash?.success && flash.success.includes('verified successfully')) {
            setShowSuccessModal(true);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) {
            // Set error for any verification-related error
            if (flash.error.includes('Invalid verification code') ||
                flash.error.includes('Invalid or expired')) {
                setCodeError(flash.error);
                setErrorMessage(flash.error);
                setShowErrorModal(true);
            } else if (flash.error) {
                setErrorMessage(flash.error);
                setShowErrorModal(true);
            } else {
                setCodeError('');
            }
        } else {
            setCodeError('');
        }
    }, [flash?.error]);

    // Countdown timer effect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const submit = (e) => {
        e.preventDefault();
        post(route('vendor.verify.code'), {
            preserveScroll: true,
            onSuccess: () => {
                // Success modal will be shown via useEffect watching flash.success
            },
            onError: (errors) => {
                // Error will be shown via useEffect watching flash.error
            },
        });
    };

    const handleResend = () => {
        setResending(true);
        setCanResend(false);

        // Increment resend count and calculate wait time
        const newResendCount = resendCount + 1;
        setResendCount(newResendCount);

        // Wait time: 1 min for first, 2 min for second, 3 min for third, etc.
        const waitTimeInSeconds = newResendCount * 60;
        setCountdown(waitTimeInSeconds);

        post(route('vendor.verify.resend'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessModal(true);
            },
            onError: (errors) => {
                setErrorMessage(flash?.error || 'Failed to send verification code. Please try again.');
                setShowErrorModal(true);
                // Reset countdown on error
                setCanResend(true);
                setCountdown(0);
            },
            onFinish: () => setResending(false),
        });
    };

    return (
        <FrontendLayout>
            <Head title="Verify Email - Vendor Application" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-12 sm:py-16">
                <Container>
                    <SectionHeading
                        eyebrow="Email Verification"
                        title="Verify Your Email"
                        description="We've sent a 6-digit verification code to your email. Please enter it below to complete your vendor application."
                    />
                </Container>
            </section>

            <section className="py-12 sm:py-16">
                <Container className="max-w-xl">
                    {flash?.success && !showSuccessModal && (
                        <Alert variant="success" className="mb-6">
                            {flash.success}
                        </Alert>
                    )}

                    {flash?.error && (
                        <Alert variant="error" className="mb-6">
                            {flash.error}
                        </Alert>
                    )}

                    <Card
                        title="Enter Verification Code"
                        description="Check your email inbox for the 6-digit code. The code will expire in 10 minutes."
                    >
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Input
                                    id="code"
                                    label="Verification Code"
                                    required
                                    maxLength={6}
                                    placeholder="e.g. 123456"
                                    value={data.code}
                                    error={codeError || errors.code}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        setData('code', value);
                                        setCodeError(''); // Clear error when user types
                                    }}
                                    className={`text-center text-2xl tracking-widest font-mono ${
                                        codeError ? '!border-red-500 !border-2 focus:!border-red-500 focus:!ring-red-500' : ''
                                    }`}
                                />
                                {!codeError && (
                                    <p className="mt-2 text-xs text-neutral-500">
                                        Enter the 6-digit code sent to your email address
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-6">
                                <Button
                                    type="submit"
                                    disabled={processing || data.code.length !== 6}
                                    className="w-full sm:w-auto min-w-[200px]"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Verifying...
                                        </span>
                                    ) : (
                                        'Verify Email'
                                    )}
                                </Button>

                                <div className="flex flex-col items-center gap-2 text-xs text-neutral-500">
                                    <span>Didn't receive the code?</span>
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={resending || !canResend}
                                        className="font-medium text-neutral-900 underline hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {resending ? 'Resending...' : !canResend && countdown > 0 ? `Resend Code (${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')})` : 'Resend Code'}
                                    </button>
                                    {!canResend && countdown > 0 && (
                                        <span className="text-xs text-neutral-400">
                                            Please wait {Math.floor(countdown / 60)} minute{Math.floor(countdown / 60) !== 1 ? 's' : ''} before requesting again
                                        </span>
                                    )}
                                </div>

                                <Link
                                    href={route('vendor.apply')}
                                    className="text-xs text-neutral-500 hover:text-neutral-700 underline"
                                >
                                    Back to Application
                                </Link>
                            </div>
                        </form>
                    </Card>

                    <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs text-blue-800">
                        <div className="flex items-start gap-2">
                            <svg className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                            <div>
                                <p className="font-semibold mb-1">Having trouble?</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Check your spam/junk folder</li>
                                    <li>Make sure you entered the correct email address</li>
                                    <li>Wait a few minutes before requesting a new code</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} maxWidth="md">
                <div className="p-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 ring-8 ring-emerald-50">
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900">
                        Email Verified Successfully!
                    </h3>

                    <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                        Your vendor application has been submitted and is now under review by our admin team.
                    </p>

                    <div className="mt-5 rounded-lg border border-neutral-100 bg-neutral-50 p-4 text-left text-xs text-neutral-600 space-y-2">
                        <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                            <svg className="h-4 w-4 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                            What happens next?
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-neutral-500">
                            <li>Our administration team will review your application and verify shop details.</li>
                            <li>Once approved, you will be able to log in to your dedicated Vendor Portal at <strong className="text-neutral-700">/vendor/login</strong> with your credentials.</li>
                            <li>You'll receive a notification once your application status changes.</li>
                        </ul>
                    </div>

                    <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full sm:w-auto"
                        >
                            Close
                        </Button>
                        <Link href={route('home')} className="w-full sm:w-auto">
                            <Button type="button" variant="primary" className="w-full sm:w-auto">
                                Back to Homepage
                            </Button>
                        </Link>
                    </div>
                </div>
            </Modal>

            {/* Error Modal */}
            <Modal show={showErrorModal} onClose={() => setShowErrorModal(false)} maxWidth="md">
                <div className="p-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4 ring-8 ring-red-50">
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900">
                        Verification Failed
                    </h3>

                    <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                        {errorMessage}
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowErrorModal(false)}
                            className="w-full sm:w-auto"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </Modal>
        </FrontendLayout>
    );
}
