import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Card } from '@/Components/UI';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AdminLayout title="Products">
            <Head title="Products" />

            <AdminPageHeader
                title="Products"
                description="Manage products catalog and inventory."
            />

            <Card>
                <div className="py-12 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-neutral-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                        />
                    </svg>
                    <h3 className="mt-3 text-sm font-medium text-neutral-900">
                        Products Module
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                        Products management module will be configured here.
                    </p>
                </div>
            </Card>
        </AdminLayout>
    );
}

