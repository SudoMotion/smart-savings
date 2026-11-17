import HomeEarningsAnimation from '@/Components/Frontend/HomeEarningsAnimation';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Index() {
    const { site, auth } = usePage().props;
    const Layout = auth?.user ? CustomerPanelLayout : FrontendLayout;

    return (
        <Layout>
            <Head title={site?.name ? `${site.name} — Home` : 'Home'} />

            <section className="w-full overflow-hidden bg-white">
                <div className="mx-auto w-full max-w-[1500px]">
                    <picture>
                        <source media="(min-width: 768px)" srcSet="/images/hero-desktop.png" />
                        <img
                            src="/images/hero-mobile.png"
                            alt="Tether saving account — low risk high return, earn interest in ETH"
                            className="block h-auto w-full"
                            loading="eager"
                            fetchpriority="high"
                            width={750}
                            height={900}
                        />
                    </picture>
                </div>
            </section>

            <HomeEarningsAnimation />
        </Layout>
    );
}