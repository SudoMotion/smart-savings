import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ status, error }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('guest.reset.password.store'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-4 text-sm text-gray-600">
                Enter your email address to receive a verification code.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
            )}

            {error && (
                <div className="mb-4 text-sm font-medium text-red-600">{error}</div>
            )}

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Send Code
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
