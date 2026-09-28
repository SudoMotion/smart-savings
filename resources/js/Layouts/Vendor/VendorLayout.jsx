import { useState } from 'react';
import SiteFavicon from '@/Components/SiteFavicon';
import VendorBottomNav from './VendorBottomNav';
import VendorSidebar from './VendorSidebar';
import VendorTopbar from './VendorTopbar';

export default function VendorLayout({ title, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen((open) => !open);
    const closeSidebar = () => setSidebarOpen(false);
    const openSidebar = () => setSidebarOpen(true);

    return (
        <div className="min-h-screen bg-neutral-100/80 font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
            <SiteFavicon />

            {/* Mobile App Style Topbar */}
            <VendorTopbar title={title} onToggleSidebar={toggleSidebar} />

            {/* Sidebar Slide-over Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-xs transition-opacity duration-300"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* App Sidebar Drawer */}
            <VendorSidebar open={sidebarOpen} onClose={closeSidebar} />

            {/* Main App Content Area */}
            <main className="pt-16 pb-20 md:pb-10 transition-all">
                <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-6 sm:py-6">
                    {children}
                </div>
            </main>

            {/* Secondary Navbar at Bottom for Mobile View */}
            <VendorBottomNav onOpenMenu={openSidebar} />
        </div>
    );
}
