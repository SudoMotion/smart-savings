import { useState } from 'react';
import SiteFavicon from '@/Components/SiteFavicon';
import VendorFooter from './VendorFooter';
import VendorSidebar from './VendorSidebar';
import VendorTopbar from './VendorTopbar';

export default function VendorLayout({ title, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen((open) => !open);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen bg-neutral-100">
            <SiteFavicon />
            <VendorTopbar title={title} onToggleSidebar={toggleSidebar} />

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-neutral-900/20 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            <VendorSidebar open={sidebarOpen} onNavigate={closeSidebar} />
            <VendorFooter />

            <main className="fixed bottom-10 left-0 right-0 top-14 overflow-y-auto bg-neutral-100 transition-[left] duration-300 lg:left-60">
                <div className="w-full px-2 py-3 md:px-4">{children}</div>
            </main>
        </div>
    );
}

