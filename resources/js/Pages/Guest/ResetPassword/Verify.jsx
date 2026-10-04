import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Verify({ email }) {
    const { flash } = usePage().props;
    const [resendCount, setResendCount] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(true);
    const [codeError, setCodeError] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

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
        post(route('guest.reset.verify.code'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // redirect handled by controller
            },
            onError: () => {
                setCodeError(flash?.error || 'Invalid code');
            },
        });
    };

    const handleResend = () => {
        setCanResend(false);
        const newCount = resendCount + 1;
        setResendCount(newCount);
        setCountdown(newCount * 60);
        post(route('guest.reset.verify.resend'), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <GuestLayout>
            <Head title="Verify Code" />

            <div className="mb-4 text-sm text-gray-600">
                We sent a verification code to <strong>{email}</strong>. Please enter it below.
            </div>

            {flash?.success && (
                <div className="mb-4 text-sm font-medium text-green-600">{flash.success}</div>
            )}
            {flash?.error && (
                <div className="mb-4 text-sm font-medium text-red-600">{flash.error}</div>
            )}

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">Verification Code</label>
                    <TextInput
                        id="code"
                        type="text"
                        name="code"
                        value={data.code}
                        className="mt-1 block w-full text-center text-2xl tracking-widest font-mono"
                        maxLength={6}
                        placeholder="123456"
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setData('code', val);
                            setCodeError('');
                        }}
                        autoComplete="one-time-code"
                    />
                    <InputError message={codeError || errors.code} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={!canResend || processing}
                        className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
                    >
                        {canResend ? 'Resend Code' : `Resend in ${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}`}
                    </button>
                    <PrimaryButton type="submit" disabled={processing || data.code.length !== 6}>
                        Verify
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
