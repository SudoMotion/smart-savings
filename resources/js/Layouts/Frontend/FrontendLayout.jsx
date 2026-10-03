import SiteFavicon from '@/Components/SiteFavicon';
import FrontendFooter from './FrontendFooter';
import FrontendNavbar from './FrontendNavbar';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function FrontendLayout({ children, categories }) {
    const { categories: pageCategories } = usePage().props;
    const cats = categories || pageCategories || [];

    useEffect(() => {
        if (!window.Tawk_API) {
            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_LoadStart = new Date();
            const s1 = document.createElement("script");
            const s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/6ac0ed545437be34c4581ef8/1k40pu4uj';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            if (s0 && s0.parentNode) {
                s0.parentNode.insertBefore(s1, s0);
            } else {
                document.head.appendChild(s1);
            }
        }
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-[#eaeded] text-neutral-900 font-sans antialiased">
            <SiteFavicon />
            <FrontendNavbar categories={cats} />
            <main className="flex-1 pb-12">{children}</main>
            <FrontendFooter />
        </div>
    );
}
