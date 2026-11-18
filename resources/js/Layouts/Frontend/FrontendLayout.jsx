import SiteFavicon from '@/Components/SiteFavicon';
import FrontendFooter from './FrontendFooter';
import FrontendNavbar from './FrontendNavbar';
import { usePage } from '@inertiajs/react';
import { loadTawkTo } from '@/lib/tawk';
import { useEffect } from 'react';

export default function FrontendLayout({ children, categories }) {
    const { categories: pageCategories } = usePage().props;
    const cats = categories || pageCategories || [];

    useEffect(() => {
        loadTawkTo();
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-[#eaeded] text-neutral-900 font-sans antialiased">
            <SiteFavicon />
            <FrontendNavbar categories={cats} />
            <main className="flex min-h-0 flex-1 flex-col pb-12">{children}</main>
            <FrontendFooter />
        </div>
    );
}
