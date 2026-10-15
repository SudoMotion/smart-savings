import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    ActionButtonGroup,
    Alert,
    Button,
    Card,
    DeleteAction,
    EditAction,
} from '@/Components/UI';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ products = [], can = {} }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout title="Products">
            <Head title="Products" />

            <AdminPageHeader
                title="Products"
                description="Manage catalog products, stock, pricing, and variants."
                actions={
                    <Link href={route('admin.products.create')}>
                        <Button>Add Product</Button>
                    </Link>
                }
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <Card bodyClassName="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Product
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Category / Brand
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Stock
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Status
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Created
                                </th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {products.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-12 text-center"
                                    >
                                        <div className="mx-auto max-w-sm text-center">
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
                                            <h3 className="mt-2 text-sm font-medium text-neutral-900">
                                                No products found
                                            </h3>
                                            <p className="mt-1 text-sm text-neutral-500">
                                                Get started by adding your first product to the catalog.
                                            </p>
                                            <div className="mt-4">
                                                <Link href={route('admin.products.create')}>
                                                    <Button size="sm">Add Product</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-neutral-50/50">
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-10 w-10 shrink-0 rounded-lg border border-neutral-200 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-400">
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-neutral-900">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-xs text-neutral-500">
                                                        {product.code ? `Code: ${product.code}` : ''}
                                                        {product.code && product.sku ? ' • ' : ''}
                                                        {product.sku ? `SKU: ${product.sku}` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                            <div>{product.category_name}</div>
                                            {product.brand_name !== '—' && (
                                                <div className="text-xs text-neutral-400">{product.brand_name}</div>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                            <span className={product.stock <= 5 ? 'font-semibold text-rose-600' : ''}>
                                                {product.stock} {product.unit_name !== '—' ? product.unit_name : ''}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    product.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                                                        : 'bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-500/20'
                                                }`}
                                            >
                                                {product.status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-500">
                                            {product.created_at ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <ActionButtonGroup className="justify-end">
                                                {can.edit && (
                                                    <EditAction
                                                        href={route(
                                                            'admin.products.edit',
                                                            product.id,
                                                        )}
                                                    />
                                                )}
                                                {can.delete && (
                                                    <DeleteAction
                                                        href={route(
                                                            'admin.products.destroy',
                                                            product.id,
                                                        )}
                                                    />
                                                )}
                                            </ActionButtonGroup>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}
