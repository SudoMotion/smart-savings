import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Card } from '@/Components/UI';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head } from '@inertiajs/react';

export default function Index({ depositOptions = [] }) {
    return (
        <CustomerPanelLayout>
            <Head title="Deposit" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-10 sm:py-12">
                <Container>
                    <SectionHeading
                        eyebrow="Customer panel"
                        title="Deposit"
                        description="Add funds using an available deposit method."
                    />
                </Container>
            </section>

            <section className="py-10 sm:py-12">
                <Container>
                    {depositOptions.length === 0 ? (
                        <Card>
                            <p className="text-sm text-neutral-600">
                                No deposit methods are available right now. Please check back later or contact
                                support.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {depositOptions.map((option) => (
                                <Card key={option.id} title={option.coin_type}>
                                    <p className="break-all font-mono text-sm text-neutral-800">{option.value}</p>
                                    <p className="mt-2 text-xs text-neutral-500">
                                        Send only {option.coin_type} to this address or account.
                                    </p>
                                </Card>
                            ))}
                        </div>
                    )}
                </Container>
            </section>
        </CustomerPanelLayout>
    );
}
