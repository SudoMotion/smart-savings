import { useState, useEffect } from 'react';
import SiteFavicon from '@/Components/SiteFavicon';
import VendorBottomNav from './VendorBottomNav';
import VendorFooter from './VendorFooter';
import VendorSidebar from './VendorSidebar';
import VendorTopbar from './VendorTopbar';

export default function VendorLayout({ title, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen((open) => !open);
    const closeSidebar = () => setSidebarOpen(false);

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
        <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
            <SiteFavicon />

            {/* Topbar: Admin panel style on desktop, Mobile app header on mobile */}
            <VendorTopbar title={title} onToggleSidebar={toggleSidebar} />

            {/* Backdrop for mobile drawer */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar: Permanently docked admin-style on desktop (lg:left-0 lg:w-60), mobile app drawer on mobile */}
            <VendorSidebar open={sidebarOpen} onClose={closeSidebar} />

            {/* Footer: Admin panel fixed footer on desktop (hidden on mobile) */}
            <VendorFooter />

            {/* Main Content Area:
                - Desktop view: exact admin panel layout (fixed bottom-10 left-60 right-0 top-14 overflow-y-auto bg-neutral-100)
                - Mobile view: mobile app scrolling area with bottom navigation padding (pt-14 pb-20)
            */}
            <main className="min-h-screen pt-14 pb-20 lg:fixed lg:bottom-10 lg:left-60 lg:right-0 lg:top-14 lg:min-h-0 lg:overflow-y-auto lg:p-0 lg:pt-0 lg:pb-0 transition-[left] duration-300 bg-neutral-100">
                <div className="w-full px-2 py-3 md:px-4 lg:py-3">
                    {children}
                </div>
            </main>

            {/* Bottom Navigation: Mobile view only */}
            <VendorBottomNav onOpenMenu={toggleSidebar} />
        </div>
    );
}
