import HomeEarningsAnimation from '@/Components/Frontend/HomeEarningsAnimation';
import CustomerPanelLayout from '@/Layouts/Frontend/CustomerPanelLayout';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Index() {
    const { site, auth } = usePage().props;
    const Layout = auth?.user ? CustomerPanelLayout : FrontendLayout;
    const viewportClass = auth?.user
        ? 'home-viewport home-viewport--panel'
        : 'home-viewport';

    return (
        <Layout>
            <Head title={site?.name ? `${site.name} — Home` : 'Home'} />

            <div className={`${viewportClass} flex min-h-0 flex-1 flex-col overflow-x-hidden`}>
                <section className="home-hero-panel relative min-h-0 flex-[1_1_50%] overflow-hidden bg-[#0a1f16]">
                    <picture className="block h-full w-full">
                        <source media="(min-width: 768px)" srcSet="/images/hero-desktop.png" />
                        <source
                            media="(max-width: 767px)"
                            srcSet="/images/hero-mobile.webp"
                            type="image/webp"
                        />
                        <img
                            src="/images/hero-mobile.png"
                            alt="Tether saving account — low risk high return, earn interest in ETH"
                            className="h-full w-full object-cover object-center"
                            loading="eager"
                            fetchpriority="high"
                        />
                    </picture>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#e5e9e7] via-[#e5e9e7]/60 to-transparent sm:h-14 sm:from-[#0f281c] sm:via-[#0f281c]/50" />
                </section>

                <HomeEarningsAnimation />
            </div>
        </Layout>
    );
}