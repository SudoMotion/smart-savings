import SiteFavicon from '@/Components/SiteFavicon';
import FrontendFooter from './FrontendFooter';
import FrontendNavbar from './FrontendNavbar';
import { usePage } from '@inertiajs/react';

export default function FrontendLayout({ children, categories }) {
    const { categories: pageCategories } = usePage().props;
    const cats = categories || pageCategories || [];

    return (
        <div className="flex min-h-screen flex-col bg-[#eaeded] text-neutral-900 font-sans antialiased">
            <SiteFavicon />
            <FrontendNavbar categories={cats} />
            <main className="flex-1 pb-12">{children}</main>
            <FrontendFooter />
        </div>
    );
}
