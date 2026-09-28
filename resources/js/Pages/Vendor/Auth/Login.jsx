import {
    Alert,
    Button,
    Checkbox,
    Input,
} from '@/Components/UI';
import AppLogo from '@/Components/AppLogo';
import SiteFavicon from '@/Components/SiteFavicon';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('vendor.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-neutral-100 pt-6 sm:justify-center sm:pt-0">
            <SiteFavicon />
            <div className="flex flex-col items-center">
                <Link href="/" className="flex items-center gap-2">
                    <AppLogo className="h-12 w-auto max-w-[180px] fill-current text-neutral-800" />
                </Link>
                <div className="mt-3 flex items-center gap-2">
                    <span className="rounded bg-neutral-900 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
                        Vendor Portal
                    </span>
                </div>
            </div>

            <div className="mt-6 w-full overflow-hidden border border-neutral-200 bg-white px-6 py-6 shadow-sm sm:max-w-md sm:rounded-lg">
                <div className="mb-5 text-center">
                    <h2 className="text-base font-semibold text-neutral-900">Welcome Back</h2>
                    <p className="mt-1 text-xs text-neutral-500">Sign in to manage your shop and products</p>
                </div>

                {status && (
                    <Alert variant="success" className="mb-4">
                        {status}
                    </Alert>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        name="email"
                        value={data.email}
                        error={errors.email}
                        autoComplete="username"
                        isFocused={true}
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

                    <div className="flex items-center justify-between">
                        <Checkbox
                            id="remember"
                            name="remember"
                            label="Remember me"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                    </div>

                    <div className="pt-2">
                        <Button type="submit" disabled={processing} className="w-full justify-center">
                            {processing ? 'Logging in...' : 'Sign in to Vendor Portal'}
                        </Button>
                    </div>

                    <div className="mt-4 border-t border-neutral-100 pt-4 text-center text-xs text-neutral-500">
                        Don't have a vendor account yet?{' '}
                        <Link
                            href={route('vendor.apply')}
                            className="font-medium text-neutral-900 underline hover:text-neutral-700"
                        >
                            Become a vendor
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

