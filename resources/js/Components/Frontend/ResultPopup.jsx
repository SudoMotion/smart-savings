import { Button } from '@/Components/UI';
import { useEffect } from 'react';

const styles = {
    success: {
        ring: 'ring-emerald-600/20',
        iconBg: 'bg-emerald-100 text-emerald-700',
        title: 'Success',
    },
    error: {
        ring: 'ring-rose-600/20',
        iconBg: 'bg-rose-100 text-rose-700',
        title: 'Failed',
    },
};

function CheckIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}

function XIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

export default function ResultPopup({
    show = false,
    variant = 'success',
    message = '',
    onClose = () => {},
    autoCloseMs = 4500,
}) {
    const theme = styles[variant] ?? styles.success;

    useEffect(() => {
        if (!show || autoCloseMs <= 0) {
            return undefined;
        }

        const timer = window.setTimeout(onClose, autoCloseMs);
        return () => window.clearTimeout(timer);
    }, [show, autoCloseMs, onClose]);

    if (!show || !message) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-popup-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
                aria-label="Dismiss"
                onClick={onClose}
            />
            <div
                className={`relative w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-5 shadow-2xl ring-1 ${theme.ring}`}
            >
                <div className="flex flex-col items-center text-center">
                    <div
                        className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${theme.iconBg}`}
                    >
                        {variant === 'error' ? (
                            <XIcon className="h-6 w-6" />
                        ) : (
                            <CheckIcon className="h-6 w-6" />
                        )}
                    </div>
                    <h2 id="result-popup-title" className="text-lg font-semibold text-neutral-900">
                        {theme.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{message}</p>
                    <Button type="button" className="mt-5 w-full sm:w-auto" onClick={onClose}>
                        OK
                    </Button>
                </div>
            </div>
        </div>
    );
}
