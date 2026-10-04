import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLogo from '@/Components/AppLogo';
import SiteFavicon from '@/Components/SiteFavicon';

export default function Login({ status }) {
    const [showPassword, setShowPassword] = useState(false);

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
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0c16] font-sans text-slate-100 selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">
            <Head title="Vendor Portal Login | Smart Savings" />
            <SiteFavicon />

            {/* Custom Dynamic Keyframes Style */}
            <style>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                    50% { transform: translateY(-24px) rotate(6deg) scale(1.03); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                    50% { transform: translateY(-18px) rotate(-8deg) scale(0.98); }
                }
                @keyframes float-reverse {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(22px) rotate(10deg); }
                }
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.35; transform: scale(1); }
                    50% { opacity: 0.65; transform: scale(1.12); }
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .anim-float-1 { animation: float-slow 7s ease-in-out infinite; }
                .anim-float-2 { animation: float-medium 6s ease-in-out infinite 1s; }
                .anim-float-3 { animation: float-reverse 8s ease-in-out infinite 2s; }
                .anim-float-4 { animation: float-slow 9s ease-in-out infinite 0.5s; }
                .anim-spin-3d { animation: spin-slow 24s linear infinite; }
                .anim-pulse-glow { animation: pulse-glow 5s ease-in-out infinite; }
                .shimmer-effect {
                    position: relative;
                    overflow: hidden;
                }
                .shimmer-effect::after {
                    position: absolute;
                    top: 0; right: 0; bottom: 0; left: 0;
                    transform: translateX(-100%);
                    background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0) 100%);
                    animation: shimmer 3s infinite;
                    content: '';
                }
            `}</style>

            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="anim-pulse-glow absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-600/25 blur-3xl" />
                <div className="anim-pulse-glow absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full bg-emerald-600/20 blur-3xl" style={{ animationDelay: '2.5s' }} />
                <div className="anim-pulse-glow absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-amber-500/15 blur-3xl" style={{ animationDelay: '1.2s' }} />

                {/* Subtle Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px'
                    }}
                />
            </div>

            {/* Floating Animated Financial Elements (Coins, Crypto, Banknote) */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
                {/* 1. Floating Bitcoin (Top Left) */}
                <div className="anim-float-1 absolute top-12 left-6 sm:top-20 sm:left-20 lg:left-32">
                    <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-0.5 shadow-[0_0_35px_rgba(245,158,11,0.45)]">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border border-yellow-200/50">
                            <span className="text-2xl sm:text-3xl font-extrabold text-amber-950 drop-shadow-sm font-serif">₿</span>
                        </div>
                        {/* Glow ring */}
                        <div className="absolute -inset-1 rounded-full border border-amber-400/30 blur-[2px]" />
                    </div>
                </div>

                {/* 2. Floating Ethereum Crystal (Top Right) */}
                <div className="anim-float-2 absolute top-16 right-8 sm:top-24 sm:right-24 lg:right-36">
                    <div className="relative flex h-14 w-14 sm:h-18 sm:w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-600/40 p-2 backdrop-blur-md border border-purple-400/30 shadow-[0_0_30px_rgba(168,85,247,0.35)]">
                        <svg className="h-9 w-9 text-purple-200 drop-shadow-[0_2px_8px_rgba(168,85,247,0.8)]" viewBox="0 0 256 417" fill="currentColor">
                            <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fillOpacity="0.9" fill="url(#eth-grad-1)" />
                            <path d="M127.962 0L0 212.32l127.962 75.639V0z" fillOpacity="0.75" fill="url(#eth-grad-2)" />
                            <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.604 128.038-180.32z" fillOpacity="0.9" fill="url(#eth-grad-1)" />
                            <path d="M127.962 416.91V312.187L0 236.59z" fillOpacity="0.75" fill="url(#eth-grad-2)" />
                            <defs>
                                <linearGradient id="eth-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#c084fc" />
                                    <stop offset="100%" stopColor="#818cf8" />
                                </linearGradient>
                                <linearGradient id="eth-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* 3. Floating Holographic Banknote / Cash (Bottom Left) */}
                <div className="anim-float-3 absolute bottom-20 left-4 sm:bottom-28 sm:left-16 lg:left-28 hidden xs:block">
                    <div className="relative h-20 w-36 sm:h-24 sm:w-44 rounded-xl bg-gradient-to-r from-emerald-900/60 via-emerald-700/50 to-teal-800/60 p-2 backdrop-blur-md border border-emerald-400/40 shadow-[0_0_30px_rgba(16,185,129,0.3)] transform -rotate-12">
                        <div className="flex h-full w-full flex-col justify-between rounded-lg border border-emerald-400/20 p-1.5 bg-emerald-950/40">
                            <div className="flex justify-between items-center text-[10px] font-bold text-emerald-300">
                                <span>$100</span>
                                <span className="tracking-widest opacity-60">SMART PAY</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold text-xs">
                                    $
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-emerald-400/70">
                                <span>VENDOR NOTE</span>
                                <span>100</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Floating Gold Dollar Coin (Bottom Right) */}
                <div className="anim-float-4 absolute bottom-24 right-6 sm:bottom-32 sm:right-20 lg:right-32">
                    <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 p-0.5 shadow-[0_0_28px_rgba(234,179,8,0.4)] transform rotate-12">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 border border-yellow-100/60">
                            <span className="text-xl sm:text-2xl font-black text-amber-950 drop-shadow">$</span>
                        </div>
                    </div>
                </div>

                {/* 5. Mini Sparkling Stars / Crypto Nodes */}
                <div className="absolute top-1/4 left-1/3 h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] anim-pulse-glow" />
                <div className="absolute top-2/3 right-1/4 h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc] anim-pulse-glow" style={{ animationDelay: '1.7s' }} />
                <div className="absolute top-1/2 left-12 h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_6px_#6ee7b7] anim-pulse-glow" style={{ animationDelay: '3s' }} />
            </div>

            {/* Top Navigation & Brand Header (Android App Style) */}
            <header className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-4 sm:pt-6 flex items-center justify-between">
                <Link
                    href="/"
                    className="group flex items-center gap-2 rounded-full bg-slate-900/70 px-3.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md border border-slate-700/60 transition hover:border-slate-500 hover:text-white"
                >
                    <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <span>Storefront</span>
                </Link>

                {/* Android-like System Status Badge */}
                <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-900/40 via-slate-900/60 to-emerald-900/40 px-3.5 py-1 text-xs backdrop-blur-md border border-purple-500/30">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-semibold tracking-wide text-slate-200">Vendor Portal</span>
                </div>
            </header>

            {/* Center: Android App Login Container */}
            <main className="relative z-10 mx-auto my-auto w-full max-w-md px-4 py-6 sm:py-8">
                {/* App Device Shell / Card */}
                <div className="relative overflow-hidden rounded-[32px] sm:rounded-[36px] bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl border border-slate-700/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(168,85,247,0.25)]">

                    {/* Top Phone Pill Bar (Android Aesthetic) */}
                    <div className="mx-auto mb-6 h-1.5 w-14 rounded-full bg-slate-700/80" />

                    {/* Logo & Headline */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700/80 border border-slate-600/40 shadow-inner mb-3">
                            <AppLogo className="h-9 w-auto max-w-[150px] fill-current text-amber-400 drop-shadow" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                            Welcome Back
                        </h1>
                        <p className="mt-1 text-xs text-slate-400 font-medium">
                            Manage your store, payouts & crypto sales
                        </p>
                    </div>

                    {/* Status Alert */}
                    {status && (
                        <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{status}</span>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="mt-6 space-y-4">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between" htmlFor="vendor-email">
                                <span>Email Address</span>
                            </label>
                            <div className="relative flex items-center">
                                <div className="pointer-events-none absolute left-3.5 text-slate-400">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <input
                                    id="vendor-email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="username"
                                    required
                                    placeholder="vendor@smartsavings.com"
                                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 shadow-inner transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-[11px] font-medium text-rose-400 flex items-center gap-1 mt-1">
                                    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>{errors.email}</span>
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between" htmlFor="vendor-password">
                                <span>Password</span>
                            </label>
                            <div className="relative flex items-center">
                                <div className="pointer-events-none absolute left-3.5 text-slate-400">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </div>
                                <input
                                    id="vendor-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••••••"
                                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/60 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 shadow-inner transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition focus:outline-none"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-[11px] font-medium text-rose-400 flex items-center gap-1 mt-1">
                                    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>{errors.password}</span>
                                </p>
                            )}
                        </div>

                        {/* Remember Me Option */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded-md border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-400/30 focus:ring-offset-0 transition cursor-pointer"
                                />
                                <span className="text-xs text-slate-300 font-medium">Keep me signed in</span>
                            </label>
                        </div>

                        {/* Submit Button (Android-Style Glow Gradient) */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="shimmer-effect group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 py-3.5 px-4 text-sm font-bold text-slate-950 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.5)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin text-slate-950" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Log in</span>
                                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Bottom Link: Register + Forgot */}
                    <div className="mt-6 border-t border-slate-800/80 pt-5 text-center">
                        <p className="text-xs text-slate-400">
                            Don't have a merchant account?{' '}
                            <Link
                                href={route('vendor.apply')}
                                className="font-bold text-amber-400 hover:text-amber-300 hover:underline transition"
                            >
                                Apply as a Vendor
                            </Link>
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                            <Link
                                href={route('guest.reset.password')}
                                className="font-bold text-amber-400 hover:text-amber-300 hover:underline transition"
                            >
                                Forgot password ?
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Feature Pills Below Login Card */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] font-medium text-slate-400">
                    <span className="flex items-center gap-1 rounded-full bg-slate-900/60 px-3 py-1 border border-slate-800 backdrop-blur-sm">
                        <span className="text-amber-400">⚡</span> Instant Payouts
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-slate-900/60 px-3 py-1 border border-slate-800 backdrop-blur-sm">
                        <span className="text-purple-400">🔒</span> End-to-End Encrypted
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-slate-900/60 px-3 py-1 border border-slate-800 backdrop-blur-sm">
                        <span className="text-emerald-400">🪙</span> Crypto & Fiat Support
                    </span>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-4 text-center text-xs text-slate-500">
                &copy; {new Date().getFullYear()} Smart Savings Marketplace. All rights reserved.
            </footer>
        </div>
    );
}
