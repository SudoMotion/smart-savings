import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Card } from '@/Components/UI';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ percentage = 0, formatted_percentage = '0.00' }) {
    return (
        <CustomerPanelLayout>
            <Head title="My percentage" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-10 sm:py-12">
                <Container>
                    <SectionHeading
                        eyebrow="Customer panel"
                        title="My percentage"
                        description="Your assigned percentage rate is set by the platform administrator."
                    />
                </Container>
            </section>

            <section className="py-10 sm:py-12">
                <Container className="max-w-lg">
                    <Card title="Assigned percentage">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold tracking-tight text-neutral-900">
                                {formatted_percentage}
                            </span>
                            <span className="text-2xl font-semibold text-neutral-600">%</span>
                        </div>
                        <p className="mt-3 text-sm text-neutral-600">
                            This is the percentage currently linked to your account. If it looks wrong or you have
                            questions, contact{' '}
                            <Link href={route('contact')} className="font-medium text-[#007185] hover:underline">
                                customer support
                            </Link>
                            .
                        </p>
                    </Card>

                    {percentage <= 0 && (
                        <p className="mt-4 text-sm text-neutral-500">
                            No percentage has been assigned yet. An admin can set your rate from the user list in the
                            admin panel.
                        </p>
                    )}
                </Container>
            </section>
        </CustomerPanelLayout>
    );
}
