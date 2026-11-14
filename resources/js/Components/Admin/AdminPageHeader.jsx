import { Link } from '@inertiajs/react';

export default function AdminPageHeader({
    title,
    titleAside,
    description,
    backHref,
    backLabel,
    actions,
}) {
    return (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
                {backHref && (
                    <Link
                        href={backHref}
                        className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                    >
                        &larr; {backLabel}
                    </Link>
                )}
                <div
                    className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${backHref ? 'mt-2' : ''}`}
                >
                    <h2 className="text-xl font-medium text-neutral-900">{title}</h2>
                    {titleAside}
                </div>
                {description && (
                    <p className="mt-1 text-sm text-neutral-500">{description}</p>
                )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
        </div>
    );
}
