import ApplicationLogo from '@/Components/ApplicationLogo';
import { usePage } from '@inertiajs/react';

export default function AppLogo({ className = 'h-7 w-auto', ...props }) {
    const { site } = usePage().props;

    return (
        <img
            src={site?.logo_url || '/images/logo.png'}
            alt={site?.name || 'Application logo'}
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
