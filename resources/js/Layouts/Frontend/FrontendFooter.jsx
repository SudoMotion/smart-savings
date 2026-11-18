import { Link, usePage } from '@inertiajs/react';

export default function FrontendFooter() {
    const { site, auth } = usePage().props;
    const year = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <footer className="w-full select-none text-white">
            {/* Back to top bar */}
            <button
                type="button"
                onClick={scrollToTop}
                className="w-full bg-[#2d5240] py-4 text-center text-xs font-semibold text-white transition hover:bg-[#3d6650] active:bg-[#243d30]"
            >
                Back to top
            </button>

            {/* Main Amazon 4-Column Links Section */}
            <div className="bg-[#1e3a2d] px-4 py-12">
                <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-8 text-xs sm:grid-cols-4 sm:gap-10">
                    {/* Col 1: Get to Know Us */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white">Get to Know Us</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <Link href={route('about')} className="hover:underline">
                                    About {site?.name || 'Amazon'}
                                </Link>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Careers</span>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Press Releases</span>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Marketplace Science</span>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Community Impact</span>
                            </li>
                        </ul>
                    </div>

                    {/* Col 2: Make Money with Us */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white">Make Money with Us</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <Link
                                    href={route('vendor.apply')}
                                    className="font-semibold text-[#febd69] hover:underline"
                                >
                                    Sell products on {site?.name || 'Amazon'}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('vendor.apply')}
                                    className="hover:underline"
                                >
                                    Become a Registered Seller
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('vendor.login')}
                                    className="hover:underline"
                                >
                                    Vendor Management Portal
                                </Link>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Become an Affiliate</span>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Advertise Your Products</span>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Self-Publish with Us</span>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Payment Products */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white">Payment Products</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <span className="hover:underline cursor-pointer">{site?.name || 'Amazon'} Business Card</span>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Shop with Points</span>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Reload Your Balance</span>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Currency Converter</span>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Secure Vendor Payouts</span>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Let Us Help You */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white">Let Us Help You</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <Link
                                    href={auth?.user ? route('account.profile') : route('account.login')}
                                    className="hover:underline"
                                >
                                    Your Account
                                </Link>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Your Orders</span>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Shipping Rates & Policies</span>
                            </li>
                            <li>
                                <span className="hover:underline cursor-pointer">Returns & Replacements</span>
                            </li>
                            <li>
                                <Link href={route('contact')} className="hover:underline">
                                    Customer Service & Help
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Middle Divider & Language/Country Bar */}
                <div className="mx-auto mt-10 max-w-[1200px] border-t border-[#2d5240] pt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-300">
                    <Link href={route('home')} className="flex items-center gap-1 mr-4">
                        {site?.logo_url ? (
                            <img
                                src={site.logo_url}
                                alt={site.name}
                                className="h-6 w-auto object-contain brightness-110"
                            />
                        ) : (
                            <span className="text-lg font-black tracking-tight text-white">
                                {site?.name || 'amazon'}
                                <span className="text-[#febd69] font-normal text-xs">.com</span>
                            </span>
                        )}
                    </Link>

                    <div className="flex items-center gap-1.5 rounded border border-[#3d6650] px-3 py-1.5 cursor-pointer hover:border-emerald-400/70">
                        <span>🌐</span>
                        <span>English</span>
                    </div>

                    <div className="flex items-center gap-1.5 rounded border border-[#3d6650] px-3 py-1.5 cursor-pointer hover:border-emerald-400/70">
                        <span>$ USD - U.S. Dollar</span>
                    </div>

                    <div className="flex items-center gap-1.5 rounded border border-[#3d6650] px-3 py-1.5 cursor-pointer hover:border-emerald-400/70">
                        <span>🇺🇸 United States</span>
                    </div>
                </div>
            </div>

            {/* Bottom Dark Navy Strip: Legal & Copyright */}
            <div className="bg-[#0f281c] px-4 py-8 text-center text-[11px] text-gray-400">
                <div className="mx-auto flex max-w-[800px] flex-wrap items-center justify-center gap-4 font-normal">
                    <span className="hover:underline cursor-pointer">Conditions of Use</span>
                    <span className="hover:underline cursor-pointer">Privacy Notice</span>
                    <span className="hover:underline cursor-pointer">Consumer Health Data Privacy Disclosure</span>
                    <span className="hover:underline cursor-pointer">Your Ads Privacy Choices</span>
                </div>
                <p className="mt-3 text-gray-400">
                    &copy; 1996-{year}, {site?.name || 'Amazon.com'}, Inc. or its affiliates. Multi-Vendor Marketplace Platform.
                </p>
                {site?.address && (
                    <p className="mt-1 text-[10px] text-gray-500">
                        Headquarters: {site.address} {site.phone ? `| Tel: ${site.phone}` : ''}
                    </p>
                )}
            </div>
        </footer>
    );
}
