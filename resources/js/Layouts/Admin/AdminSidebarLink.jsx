import { Link } from '@inertiajs/react';

export default function AdminSidebarLink({
    href,
    active = false,
    icon: Icon,
    children,
    onNavigate,
}) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            className={
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ' +
                (active
                    ? 'bg-[#0f281c] text-white shadow-sm'
                    : 'text-gray-300 hover:bg-[#2d5240]/60 hover:text-white')
            }
        >
            {Icon && (
                <Icon
                    className={
                        'h-[18px] w-[18px] shrink-0 ' +
                        (active
                            ? 'text-emerald-200'
                            : 'text-gray-400 group-hover:text-emerald-100')
                    }
                />
            )}
            <span>{children}</span>
        </Link>
    );
}
