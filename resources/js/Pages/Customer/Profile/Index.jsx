import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Button, Card } from '@/Components/UI';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ user, wallet }) {
    return (
        <CustomerPanelLayout>
            <Head title="Profile" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-10 sm:py-12">
                <Container>
                    <SectionHeading
                        eyebrow="Customer panel"
                        title="Profile"
                        description="Your account information and security options."
                    />
                </Container>
            </section>

            <section className="py-10 sm:py-12">
                <Container className="max-w-lg">
                    <Card title="Wallet balance" className="mb-4">
                        <p className="text-2xl font-bold text-neutral-900">
                            ${wallet?.formatted_balance ?? '0.00'}
                        </p>
                    </Card>

                    <Card title="Account details">
                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="font-medium text-neutral-500">Name</dt>
                                <dd className="mt-1 text-neutral-900">{user.name}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-neutral-500">Email</dt>
                                <dd className="mt-1 text-neutral-900">{user.email}</dd>
                            </div>
                            {user.created_at && (
                                <div>
                                    <dt className="font-medium text-neutral-500">Member since</dt>
                                    <dd className="mt-1 text-neutral-900">{user.created_at}</dd>
                                </div>
                            )}
                        </dl>
                    </Card>

                    <div className="mt-4 space-y-2">
                        <Link
                            href={route('guest.reset.password')}
                            className="block text-sm font-medium text-[#007185] hover:text-[#c7511f] hover:underline"
                        >
                            Reset password
                        </Link>
                        <Link href={route('account.logout')} method="post" as="button" className="block w-full">
                            <Button variant="secondary" className="w-full">
                                Sign out
                            </Button>
                        </Link>
                    </div>
                </Container>
            </section>
        </CustomerPanelLayout>
    );
}
